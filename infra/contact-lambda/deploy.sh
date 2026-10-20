#!/usr/bin/env bash
#
# 세이프롬 문의 폼 Lambda 배포 스크립트.
#
# 콘솔에서 손으로 만들지 말고 이 스크립트를 쓸 것 - IAM 정책 · CORS · 런타임 설정이
# 하나라도 어긋나면 증상이 "그냥 안 됨"으로만 나타나서 원인을 찾기 어렵다.
# 여러 번 돌려도 안전하다(이미 있으면 갱신).
#
# 사전 준비
#   1) aws cli 설치 후 `aws configure` 로 자격증명 등록
#   2) SES 에서 MAIL_FROM 주소 검증 (아래 1단계가 검증 메일을 보내 준다)
#
set -euo pipefail

REGION="${REGION:-ap-northeast-2}"        # 서울
FUNC="${FUNC:-todayiz-contact}"
ROLE="${ROLE:-${FUNC}-role}"
MAIL_TO="${MAIL_TO:-today@todayiz.io}"
MAIL_FROM="${MAIL_FROM:-today@todayiz.io}"
ALLOW_ORIGIN="${ALLOW_ORIGIN:-https://todayiz.io}"

cd "$(dirname "$0")"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "계정 ${ACCOUNT} / 리전 ${REGION}"

# ---------------------------------------------------------------------------
# 1. SES 발신 주소 검증
#    주소 하나만 검증하면 DNS 를 건드릴 필요가 없다. 도메인 검증은 DKIM 레코드가 필요하다.
#    이미 검증돼 있으면 AlreadyExists 가 나는데 무시해도 된다.
# ---------------------------------------------------------------------------
echo "1) SES 발신 주소 검증 요청: ${MAIL_FROM}"
aws sesv2 create-email-identity --region "$REGION" --email-identity "$MAIL_FROM" 2>/dev/null \
  || echo "   (이미 등록돼 있음)"
echo "   -> ${MAIL_FROM} 메일함에서 AWS 인증 메일의 링크를 클릭해야 발송이 가능해진다."

# ---------------------------------------------------------------------------
# 2. 실행 역할
#    ses:SendEmail 만 준다. 넓은 권한(AmazonSESFullAccess 등)을 붙이지 말 것 -
#    이 함수는 메일 한 통 보내는 것 외에 할 일이 없다.
# ---------------------------------------------------------------------------
echo "2) IAM 역할 준비: ${ROLE}"
aws iam create-role --role-name "$ROLE" \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]
  }' >/dev/null 2>&1 || echo "   (이미 있음)"

aws iam attach-role-policy --role-name "$ROLE" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy --role-name "$ROLE" --policy-name ses-send \
  --policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Action":["ses:SendEmail"],"Resource":"*"}]
  }'

# IAM 역할 전파에 몇 초 걸린다. 바로 Lambda 를 만들면 역할을 못 찾는 오류가 난다.
sleep 10

# ---------------------------------------------------------------------------
# 3. 함수 생성 / 코드 갱신
#    @aws-sdk/client-sesv2 는 Lambda Node.js 런타임에 기본 포함돼 있어 번들이 필요 없다.
# ---------------------------------------------------------------------------
echo "3) 함수 배포: ${FUNC}"
rm -f function.zip
zip -q function.zip index.mjs

ENV="Variables={MAIL_TO=${MAIL_TO},MAIL_FROM=${MAIL_FROM},ALLOW_ORIGIN=${ALLOW_ORIGIN}}"

if aws lambda get-function --region "$REGION" --function-name "$FUNC" >/dev/null 2>&1; then
  aws lambda update-function-code --region "$REGION" \
    --function-name "$FUNC" --zip-file fileb://function.zip >/dev/null
  aws lambda wait function-updated --region "$REGION" --function-name "$FUNC"
  aws lambda update-function-configuration --region "$REGION" \
    --function-name "$FUNC" --environment "$ENV" >/dev/null
else
  aws lambda create-function --region "$REGION" \
    --function-name "$FUNC" \
    --runtime nodejs22.x \
    --handler index.handler \
    --role "arn:aws:iam::${ACCOUNT}:role/${ROLE}" \
    --timeout 10 \
    --environment "$ENV" \
    --zip-file fileb://function.zip >/dev/null
fi
rm -f function.zip

# ---------------------------------------------------------------------------
# 4. Function URL + 공개 호출 허용
#    AuthType NONE 은 "누구나 호출 가능"이라는 뜻이다. 문의 폼이라 의도한 것이고,
#    대신 함수 안에서 미끼 필드 검사와 입력 길이 제한을 한다.
#    CORS 허용 출처를 * 로 바꾸지 말 것 - 아무 사이트나 이 주소로 메일을 보낼 수 있게 된다.
# ---------------------------------------------------------------------------
echo "4) Function URL 생성"
aws lambda create-function-url-config --region "$REGION" \
  --function-name "$FUNC" --auth-type NONE \
  --cors "AllowOrigins=${ALLOW_ORIGIN},AllowMethods=POST,AllowHeaders=content-type" >/dev/null 2>&1 \
  || aws lambda update-function-url-config --region "$REGION" \
       --function-name "$FUNC" --auth-type NONE \
       --cors "AllowOrigins=${ALLOW_ORIGIN},AllowMethods=POST,AllowHeaders=content-type" >/dev/null

# 2025-10 부터 Function URL 은 InvokeFunctionUrl 과 InvokeFunction 두 권한을 모두 요구한다.
# 하나라도 빠지면 AuthType 이 NONE 이어도 403 Forbidden 이 난다 - 반드시 둘 다 넣을 것.
# --invoked-via-function-url 은 'URL 로 들어온 호출에만 허용'이라는 제한이다. 빼지 말 것.
aws lambda add-permission --region "$REGION"   --function-name "$FUNC" --statement-id UrlPolicyInvokeURL   --action lambda:InvokeFunctionUrl --principal '*'   --function-url-auth-type NONE >/dev/null 2>&1   || echo "   (InvokeFunctionUrl 권한 이미 있음)"

aws lambda add-permission --region "$REGION"   --function-name "$FUNC" --statement-id UrlPolicyInvokeFunction   --action lambda:InvokeFunction --principal '*'   --invoked-via-function-url >/dev/null 2>&1   || echo "   (InvokeFunction 권한 이미 있음)"

# 공개 엔드포인트라 호출 수에 천장이 없다. 동시 실행을 묶어 피해 상한을 건다.
# 문의 폼에는 2면 충분하다 - 이 줄을 지우면 악용 시 비용이 무한정 늘 수 있다.
aws lambda put-function-concurrency --region "$REGION"   --function-name "$FUNC" --reserved-concurrent-executions 2 >/dev/null

URL=$(aws lambda get-function-url-config --region "$REGION" \
        --function-name "$FUNC" --query FunctionUrl --output text)

echo
echo "────────────────────────────────────────────"
echo " 배포 완료"
echo " Function URL: ${URL}"
echo
echo " 다음 할 일"
echo "  1. ${MAIL_FROM} 메일함에서 AWS 인증 메일의 링크 클릭"
echo "  2. 위 URL 을 src/components/ContactForm.tsx 의 ENDPOINT 에 입력"
echo "────────────────────────────────────────────"
