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
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? 'https://todayiz.io'

const ses = new SESv2Client({ region: REGION })

const cors = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const reply = (statusCode, body) => ({ statusCode, headers: cors, body })

/* 메일 헤더 인젝션 방지. 제목에 줄바꿈이 들어가면 헤더를 새로 끼워 넣을 수 있다. */
const oneLine = (value, max = 200) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)

export const handler = async (event) => {
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
