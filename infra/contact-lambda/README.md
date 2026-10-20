# 문의 폼 메일 발송 (AWS Lambda + SES)

세이프롬 페이지(`/safeprom/`)의 도입 문의 폼이 보낸 내용을 `today@todayiz.io` 로 메일 발송한다.

```
브라우저 폼 ──POST──▶ Lambda Function URL ──▶ SES ──▶ today@todayiz.io
              (검증·스팸 차단)                        (후이즈웍스 메일함)
```

받는 메일함은 바꾸지 않는다. 지금 쓰는 후이즈웍스 메일로 그대로 들어온다.

## 왜 이 구성인가

- **API Gateway 를 안 쓴다** — Lambda Function URL 이 HTTPS 주소를 직접 주므로 구성 요소가 하나 줄고 CORS 도 Lambda 설정에서 끝난다.
- **SES 샌드박스 그대로 쓴다** — 샌드박스는 "검증된 주소로만 발송 가능 / 하루 200통" 제약이 있는데, 문의 폼은 받는 사람이 항상 `today@todayiz.io` 하나라 걸리지 않는다. 프로덕션 액세스 신청(심사 96시간)이 필요 없다.
- **주소 하나만 검증한다** — DNS 를 건드리지 않는다. 도메인 검증은 DKIM 레코드가 필요하지만 주소 검증은 메일 링크 클릭이면 끝이다.

## 배포

```bash
aws configure                 # 최초 1회
./deploy.sh
```

끝나면 Function URL 이 출력된다. 그 값을 `src/components/ContactForm.tsx` 의 `ENDPOINT` 에 넣으면 연결된다.

바꾸고 싶으면 환경변수로:

```bash
REGION=ap-northeast-2 MAIL_TO=today@todayiz.io ./deploy.sh
```

## 배포 후 반드시 할 것

1. **`today@todayiz.io` 메일함에서 AWS 인증 메일의 링크 클릭.** 이걸 안 하면 발송이 거부된다.
2. 폼으로 실제 한 통 보내 수신 확인.

## 메일이 스팸함으로 가면

`todayiz.io` 의 SPF 는 현재 후이즈웍스만 인증한다.

```
v=spf1 include:spf1.whoisworks.com ~all
```

SES 로 보내면 발신 주소가 `today@todayiz.io` 인데 SPF 에 SES 가 없어 인증에 실패(softfail)한다. 본인 메일함으로 가는 거라 대개 들어오지만 스팸함으로 빠질 수 있다.

해결은 둘 중 하나:

- **간단** — 메일함에서 해당 발신 주소를 수신 허용 등록
- **정석** — SES 에서 도메인 검증 후 DKIM CNAME 3개를 후이즈 DNS 에 추가. 기존 레코드와 충돌하지 않는다(DKIM 은 셀렉터별로 따로 동작). SPF 까지 맞추려면 **레코드를 새로 만들지 말고** 기존 한 줄에 `include:amazonses.com` 을 끼워 넣을 것. `v=spf1` TXT 가 두 개가 되면 둘 다 깨져서 지금 쓰는 회사 메일까지 인증에 실패한다.

## 비용

| | |
|---|---|
| Lambda | 월 100만 요청까지 무료 |
| SES | 1,000통당 $0.10 |

문의 폼 수준에서는 사실상 0원.

## 나중에 세이프롬 백엔드가 생기면

이 Lambda 를 지우고 백엔드에 `/api/contact` 엔드포인트를 만드는 편이 낫다. 그때는 SES 대신 후이즈웍스 SMTP 를 써도 된다(확인된 설정: `smtp.whoisworks.com:587`, STARTTLS, AUTH LOGIN/PLAIN). SPF 에 후이즈웍스가 이미 있어 인증 문제가 없다.

폼 쪽은 `ENDPOINT` 한 줄만 바꾸면 되므로 교체 비용이 거의 없다.
