import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

/*
  세이프롬 도입 문의 폼을 받아 메일로 보내는 Lambda.

  구조: 브라우저 폼 -> Lambda Function URL -> SES -> today@todayiz.io
  API Gateway 는 쓰지 않는다. Function URL 이 HTTPS 주소를 직접 주므로 구성 요소가 하나 줄고
  CORS 도 Lambda 설정에서 바로 켤 수 있다 - 앞단에 API Gateway 를 다시 끼우지 말 것.

  배포는 같은 폴더의 deploy.sh 참고. 수동으로 콘솔에서 만들지 말 것 -
  IAM 정책과 CORS 설정이 어긋나면 원인을 찾기 어렵다.

  SES 샌드박스 그대로 동작한다. 받는 사람이 항상 검증된 자기 주소 하나뿐이라
  "검증된 주소로만 발송 가능" 제약에 걸리지 않는다 - 프로덕션 액세스 신청 불필요.
*/

const REGION = process.env.AWS_REGION ?? 'ap-northeast-2'
const MAIL_TO = process.env.MAIL_TO ?? 'today@todayiz.io'
/* From 은 SES 에서 검증한 주소여야 한다. 검증 안 된 주소를 넣으면 발송이 거부된다. */
const MAIL_FROM = process.env.MAIL_FROM ?? 'today@todayiz.io'
/*
  Cloudflare Turnstile 시크릿. 값은 Lambda 환경변수에만 둔다 - 코드에 적지 말 것.

  이게 이 엔드포인트의 유일한 실질 방어다.
  CORS 는 브라우저만 지키는 규칙이라 curl · 스크립트에는 아무 효과가 없고,
  미끼 필드는 필드만 비우면 통과한다. 토큰을 서버에서 검증해야 직접 호출을 막을 수 있다.
*/
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET

const ses = new SESv2Client({ region: REGION })

/*
  CORS 헤더를 여기서 붙이지 말 것.

  Function URL 의 CORS 설정(AllowOrigins 등)이 응답에 헤더를 자동으로 넣는다.
  코드에서 같은 헤더를 또 넣으면 값이 두 개가 되어
  "Access-Control-Allow-Origin header contains multiple values" 로 브라우저가 전부 막는다.

  허용 출처를 바꿀 때는 코드가 아니라 Function URL 설정을 고친다:
    aws lambda update-function-url-config --function-name todayiz-contact       --auth-type NONE --cors "AllowOrigins=<주소>,AllowMethods=POST,AllowHeaders=content-type"
*/
const reply = (statusCode, body) => ({ statusCode, body })

/* 메일 헤더 인젝션 방지. 제목에 줄바꿈이 들어가면 헤더를 새로 끼워 넣을 수 있다. */
const oneLine = (value, max = 200) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)

export const handler = async (event) => {
  /*
    OPTIONS(preflight)는 보통 Function URL 이 함수를 부르지 않고 직접 처리한다.
    설정이 빠진 경우를 대비해 남겨 둔 안전장치다.
  */
  if (event.requestContext?.http?.method === 'OPTIONS') return reply(204, '')
  if (event.requestContext?.http?.method !== 'POST') return reply(405, 'Method Not Allowed')

  let data
  try {
    data = JSON.parse(event.body ?? '{}')
  } catch {
    return reply(400, '본문을 읽을 수 없습니다')
  }

  /*
    봇 차단용 미끼 필드. 사람 눈에는 안 보이므로 값이 차 있으면 사람이 아니다.
    성공처럼 조용히 끝내야 봇이 재시도하지 않는다 - 오류를 돌려주지 말 것.
  */
  if (data.botcheck) return reply(200, 'ok')

  /*
    사람 확인. 토큰이 없거나 검증에 실패하면 메일을 보내지 않는다.

    시크릿이 설정돼 있지 않으면 통째로 건너뛴다 - 설정 누락으로 문의가 막히는 것보다는
    낫다는 판단이다. 다만 그 상태면 아무나 직접 호출할 수 있으므로 로그에 남긴다.
    운영 중에 이 경고가 보이면 환경변수부터 확인할 것.
  */
  if (TURNSTILE_SECRET) {
    const token = data['cf-turnstile-response']
    if (!token) return reply(403, '사람 확인이 필요합니다')
    try {
      const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET,
          response: token,
          remoteip: event.requestContext?.http?.sourceIp,
        }),
      }).then((r) => r.json())
      if (!check.success) {
        console.warn('Turnstile 검증 실패', check['error-codes'])
        return reply(403, '사람 확인에 실패했습니다')
      }
    } catch (error) {
      console.error('Turnstile 검증 호출 실패', error)
      return reply(502, '사람 확인 중 오류가 발생했습니다')
    }
  } else {
    console.warn('TURNSTILE_SECRET 미설정 - 사람 확인 없이 통과시킴')
  }

  const company = oneLine(data.company, 100)
  const name = oneLine(data.name, 50)
  const email = oneLine(data.email, 150)
  const message = String(data.message ?? '').trim().slice(0, 5000)

  if (!company || !email || !message) return reply(400, '필수 항목이 비었습니다')

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: MAIL_FROM,
        Destination: { ToAddresses: [MAIL_TO] },
        /* 받은 메일에서 바로 답장하면 문의자에게 가도록 한다. */
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            /*
              Charset 을 빼면 한글이 전부 깨진다. SES 기본값이 UTF-8 이 아니다 - 지우지 말 것.
            */
            Subject: { Data: `[세이프롬] ${company} 도입 문의`, Charset: 'UTF-8' },
            Body: {
              Text: {
                Data: `회사: ${company}\n담당자: ${name}\n회신: ${email}\n\n${message}`,
                Charset: 'UTF-8',
              },
            },
          },
        },
      }),
    )
  } catch (error) {
    // 실패를 조용히 삼키면 문의를 통째로 놓친다. CloudWatch 에 남겨 둘 것.
    console.error('SES 발송 실패', error)
    return reply(502, '메일 발송에 실패했습니다')
  }

  return reply(200, 'ok')
}
