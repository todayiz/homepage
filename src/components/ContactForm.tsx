import { useState, type FormEvent } from 'react'
import { safepromContact } from '../data/safeprom'

/*
  도입 문의 폼.

  전송 경로: 이 폼 -> AWS Lambda Function URL -> SES -> today@todayiz.io
  Lambda 소스와 배포 스크립트는 infra/contact-lambda/ 에 있다.

  Lambda 는 본문을 JSON.parse 한다. FormData(multipart) 로 보내면 파싱에 실패해
  400 '본문을 읽을 수 없습니다' 가 돌아온다 - 반드시 JSON 으로 보낼 것.

  ENDPOINT 를 비우면 메일 앱을 여는 방식으로 되돌아간다(아래 openMailClient).
  백엔드를 옮기더라도 이 한 줄만 바꾸면 된다.

  주의: Lambda 의 CORS 허용 출처가 https://todayiz.io 하나뿐이다.
  로컬 개발 주소(127.0.0.1)에서 제출하면 브라우저가 CORS 로 막는다.
  개발 중에 실제 전송까지 확인하려면 Lambda 의 AllowOrigins 에 개발 주소를 추가해야 한다.
*/
const ENDPOINT = 'https://kblofgg2l6jigxz5hwjzlzv4340sxtah.lambda-url.ap-northeast-2.on.aws/'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  /*
    ENDPOINT 가 없을 때의 대체 경로.
    입력값을 메일 본문으로 옮겨 메일 앱을 연다 - 적어 둔 내용을 버리지 않기 위해서다.
    웹메일만 쓰는 방문자는 메일 앱이 안 열릴 수 있어서, 화면에는 주소도 함께 보여 준다.
  */
  const openMailClient = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const body = [
      `회사명: ${data.get('company')}`,
      `담당자: ${data.get('name')}`,
      `회신 이메일: ${data.get('email')}`,
      '',
      String(data.get('message') ?? ''),
    ].join('\n')
    const subject = `[세이프롬] ${data.get('company')} 도입 문의`
    window.location.href =
      `mailto:${safepromContact.email}` +
      `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    // 봇 차단용 미끼 필드. 사람 눈에는 안 보이므로 값이 차 있으면 사람이 아니다.
    // 성공처럼 조용히 끝내야 봇이 재시도하지 않는다 - 오류를 띄우지 말 것.
    if (new FormData(form).get('botcheck')) {
      setStatus('sent')
      return
    }

    if (!ENDPOINT) {
      openMailClient(form)
      return
    }

    setStatus('sending')
    try {
      // Lambda 가 JSON.parse 로 읽으므로 FormData 가 아니라 JSON 으로 보낸다.
      const payload = Object.fromEntries(new FormData(form).entries())
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="sp-form sp-form--done">
        <p className="sp-form__done-title">문의가 접수되었습니다.</p>
        <p className="sp-form__done-detail">영업일 기준 1~2일 안에 회신드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form className="sp-form" onSubmit={handleSubmit}>
      <div className="sp-form__row">
        <label className="sp-form__field">
          <span>회사명</span>
          <input name="company" type="text" required autoComplete="organization" />
        </label>
        <label className="sp-form__field">
          <span>담당자명</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
      </div>

      <label className="sp-form__field">
        <span>회신받을 이메일</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <label className="sp-form__field">
        <span>문의 내용</span>
        <textarea name="message" rows={5} required placeholder="도입 규모, 궁금한 점을 적어 주세요." />
      </label>

      {/* 미끼 필드. tabIndex -1 과 aria-hidden 으로 키보드 · 읽기 도구에서도 건너뛰게 한다. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="sp-form__trap"
      />

      <button className="btn btn--primary sp-form__submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? '보내는 중…' : '문의 보내기'}
      </button>

      {status === 'error' && (
        <p className="sp-form__error">
          전송에 실패했습니다. 번거로우시겠지만 {safepromContact.email} 로 보내 주세요.
        </p>
      )}
    </form>
  )
}
