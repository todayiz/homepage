import { useEffect, useState } from 'react'
import { ContactForm } from '../components/ContactForm'
import { SiteFooter, SiteNav } from '../components/SiteChrome'
import { useHashScrollOnLoad } from '../components/useHashScrollOnLoad'
import './Safeprom.css'
import logo from '../assets/세이프롬로고.png'
import maskConfirmImg from '../assets/세이프롬가림확인.jpg'
import chatImg from '../assets/세이프롬채팅화면.jpg'
import credentialBlockImg from '../assets/세이프롬인증정보차단.jpg'
// 'AI 연결' 캡처는 투어를 4장으로 추리면서 뺐다. 파일은 src/assets 에 남아 있다.
// '사용량' 캡처는 화면에 환율·금액이 박혀 있어 투어에서 뺐다 (data/safeprom.ts 주석 참고).
import securityPolicyImg from '../assets/세이프롬보안정책.png'
// '가림 미리보기' 캡처는 동작 방식이 그대로 보여 투어에서 뺐다 (특허 출원 중).
import {
  safepromContact,
  safepromDefaults,
  safepromFaq,
  safepromFeatureBaseline,
  safepromFeatures,
  safepromPrinciples,
  safepromHero,
  safepromProblems,
  safepromPromises,
  safepromRollout,
  safepromScreensNotice,
  safepromShowcase,
  safepromSecurity,
  safepromStatus,
} from '../data/safeprom'

/*
  세이프롬(Safeprom) 제품 소개 페이지. /safeprom/ 로 서빙되는 별도 HTML 문서다
  (SPA 라우트가 아닌 이유는 vite.config.ts 상단 주석 참고).

  문구와 수치는 전부 src/data/safeprom.ts 에 있고, 그 파일 상단에
  "원본 문서에 있지만 공개하지 않기로 한 내용" 목록이 있다 - 내용을 추가하기 전에 꼭 읽을 것.

  SiteNav/SiteFooter 에 isHome 을 주지 않는다 - 공통 헤더의 섹션 링크가
  #about 이 아니라 /#about 으로 나가 홈으로 이동해야 하기 때문이다.
*/

/*
  제품 화면 투어에 쓰는 이미지. 문구는 data/safeprom.ts 의 safepromShowcase 에 있고
  여기서는 key 로 짝을 맞춘다 - 둘 중 한쪽만 고치면 화면과 설명이 어긋나므로 같이 고칠 것.

  masking 만 소개서 v1.1(슬라이드 8) 캡처이고 나머지는 매뉴얼 캡처다.
*/
const SHOWCASE_IMAGES: Record<string, string> = {
  chat: chatImg,
  block: credentialBlockImg,
}

export default function SafepromPage() {
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)

  // /safeprom/#sp-rollout 처럼 해시를 달고 들어온 외부 링크 대응.
  useHashScrollOnLoad()

  /*
    모달이 열려 있는 동안 배경 스크롤을 막는다.
    App.tsx 의 같은 이펙트와 동일한 이유로 핸들러가 아니라 이펙트 안에서만 body 를 건드린다
    (컴포넌트 밖 값을 핸들러에서 바꾸면 react-hooks 규칙에 걸린다).
  */
  useEffect(() => {
    document.body.style.overflow = modalImage ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalImage])

  return (
    <div className="app">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="sp-hero">
          <div className="container sp-hero__inner">
            <div className="sp-hero__copy">
              <img src={logo} alt="세이프롬 Safeprom 로고" className="sp-hero__logo" />
              <h1 className="sp-hero__tagline">{safepromHero.tagline}</h1>
              <p className="sp-hero__summary">{safepromHero.summary}</p>
              {/*
                버튼이 하나뿐인 건 의도다. 예전에 있던 '동작 방식 보기'는
                가리키던 #sp-flow 섹션(게이트웨이 처리 흐름)을 걷어내면서 죽은 링크가 돼 제거했다.
                되살리려면 대상 섹션부터 만들 것.
              */}
              <div className="sp-hero__actions">
                <a className="btn btn--primary" href="#sp-contact">
                  도입 문의하기
                </a>
              </div>
            </div>

            {/*
              히어로 이미지는 '보내기 전에 확인해 주세요 · 가림 2건' 다이얼로그다.
              제품을 한 장으로 설명하는 유일한 화면이라 여기에 뒀다 - 다른 캡처로 바꾸지 말 것.
            */}
            <figure className="sp-hero__shot">
              <img
                src={maskConfirmImg}
                alt="보내기 전에 확인해 주세요 - 전화번호와 계좌번호가 가려진 확인 화면"
                onClick={() => setModalImage({ src: maskConfirmImg, alt: '가림 확인 화면' })}
              />
              <figcaption>보내기 전, 무엇을 가렸는지 직원이 직접 확인합니다</figcaption>
            </figure>
          </div>
        </section>

        {/* 핵심 약속 3가지 */}
        <section className="sp-promises">
          <div className="container">
            <div className="sp-promises__grid">
              {safepromPromises.map((promise) => (
                <div key={promise.title} className="sp-promise">
                  <h3>{promise.title}</h3>
                  <p>{promise.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 도입 배경 */}
        <section id="sp-problems" className="sp-section">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">도입 배경</span>
              <h2>생성형 AI, 안전하게 쓰고 계신가요?</h2>
              <p>{safepromProblems.lead}</p>
            </header>

            <div className="sp-problem-grid">
              {safepromProblems.items.map((item) => (
                <div key={item.no} className="sp-problem">
                  <span className="sp-problem__no">{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="sp-table-wrap">
              <h3 className="sp-table-title">기존 방식과 무엇이 다른가</h3>
              <table className="sp-table">
                <thead>
                  <tr>
                    {safepromProblems.compare.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {safepromProblems.compare.rows.map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                      <td className="sp-table__highlight">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/*
          2026-10-13: 게이트웨이 처리 흐름 다이어그램 섹션을 걷어냈다.
          우리 내부 처리 단계를 그대로 그려 둔 것이라, 공개 페이지에 둘 이유가 없다는 판단이다
          (사유는 data/safeprom.ts 의 safepromFlow 자리에 남긴 주석 참고).
          회사소개 페이지의 AI 보안 게이트웨이 구성도에서 5단계를 뺀 것과 같은 결정 -
          "동작 설명이 없다"고 판단해 되살리지 말 것. 대신 아래 제품 화면 투어가 그 역할을 한다.
        */}
        {/* 핵심 기능 8가지 */}
        <section id="sp-features" className="sp-section">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">한눈에 보기</span>
              <h2>직원이 쓰는 기능, 관리자가 쓰는 기능</h2>
              <p>
                회사 API 키 하나로 ChatGPT · Claude · Gemini를 쓰되, 개인정보는 가려서 보내고 관리자도
                대화 내용은 볼 수 없는 업무용 AI 포털입니다.
              </p>
            </header>

            {/*
              브로셔 v1.2 가 '03 — 임직원' / '04 — 관리자' 두 패널로 나눈 구성을 따른다.
              한 줄로 12장을 쭉 늘어놓으면 누구를 위한 기능인지 구분이 안 된다 - 묶음을 합치지 말 것.
            */}
            {(['직원', '관리자'] as const).map((role) => (
              <div key={role} className="sp-feature-group">
                <h3 className="sp-feature-group__title">
                  {role === '직원' ? '직원이 쓰는 기능' : '관리자가 쓰는 기능'}
                </h3>
                <div className="sp-feature-grid">
                  {safepromFeatures
                    .filter((feature) => feature.role === role)
                    .map((feature) => (
                      <article key={feature.no} className="sp-feature">
                        <div className="sp-feature__head">
                          <span
                            className={`sp-feature__no sp-feature__no--${
                              role === '관리자' ? 'admin' : 'staff'
                            }`}
                          >
                            {feature.no}
                          </span>
                        </div>
                        <h4>{feature.title}</h4>
                        <p className="sp-feature__example">예) {feature.example}</p>
                        <ul>
                          {feature.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                        <p className="sp-feature__guard">
                          <strong>안전장치</strong> {feature.guard}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            ))}

            <p className="sp-baseline">
              <strong>모든 기능의 기본</strong> {safepromFeatureBaseline}
            </p>
          </div>
        </section>

        {/* 보안 기능 */}
        <section id="sp-security" className="sp-section sp-section--gradient">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">보안 기능</span>
              <h2>회사 정보는 밖으로 나가지 않습니다</h2>
              <p>{safepromSecurity.lead}</p>
            </header>

            <div className="sp-guard-grid">
              {safepromSecurity.guards.map((guard) => (
                <div key={guard.no} className="sp-guard">
                  <span className="sp-guard__no">{guard.no}</span>
                  <h3>{guard.title}</h3>
                  <ul>
                    {guard.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/*
              2026-10-20: 왕복 치환 예시와 탐지 대상 · 기본 조치 표를 걷어냈다.
              치환 전/후 문장과 분류 체계가 동작 방식을 그대로 드러내서다 (특허 출원 중).
              사유와 원칙은 data/safeprom.ts 상단 주석 참고 - 되살리지 말 것.
            */}
          </div>
        </section>

        {/*
          제품 화면 투어. 이 페이지에서 가장 중요한 섹션이다 -
          읽지 않고 훑기만 해도 무엇을 사는지 알게 하는 게 목적이라
          화면을 크게 쓰고 문구는 짧게 둔다. 작은 썸네일 그리드로 되돌리지 말 것.
        */}
        <section id="sp-screens" className="sp-section">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">제품 화면</span>
              <h2>직원도, 관리자도 쓰던 대로 씁니다</h2>
              <p>설치할 프로그램은 없습니다. 브라우저만 열면 됩니다.</p>
            </header>

            <div className="sp-tour">
              {safepromShowcase.map((item) => (
                <article key={item.key} className="sp-tour__item">
                  <div className="sp-tour__copy">
                    <span className="sp-tour__eyebrow">{item.eyebrow}</span>
                    <h3>{item.headline}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <figure className="sp-tour__shot">
                    <img
                      src={SHOWCASE_IMAGES[item.key]}
                      alt={item.alt}
                      loading="lazy"
                      onClick={() =>
                        setModalImage({ src: SHOWCASE_IMAGES[item.key], alt: item.alt })
                      }
                    />
                  </figure>
                </article>
              ))}
            </div>

            {/*
              화면 속 가상 정보 고지. 매뉴얼 표지에도 같은 고지가 붙어 있다 -
              캡처를 공개하는 한 이 문구를 지우지 말 것.
            */}
            <p className="sp-disclaimer">※ {safepromScreensNotice}</p>
          </div>
        </section>

        {/*
          2026-10-20 신설. 브로셔 v1.2 '06 — 원칙과 도입'.
          기능 나열과 성격이 달라 따로 뒀다 - 기능 카드 안으로 접어 넣지 말 것.
        */}
        <section className="sp-section sp-section--dark">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">원칙</span>
              <h2>{safepromPrinciples.headline}</h2>
            </header>

            <div className="sp-principles">
              {safepromPrinciples.items.map((item) => (
                <div key={item.no} className="sp-principle">
                  <span className="sp-principle__no">{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 기본값 */}
        <section className="sp-section sp-section--muted">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">기본 설정</span>
              <h2>위험한 기능은 처음부터 꺼져 있습니다</h2>
            </header>

            <div className="sp-table-wrap">
              <table className="sp-table sp-table--defaults">
                <thead>
                  <tr>
                    {safepromDefaults.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {safepromDefaults.rows.map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td className="sp-table__highlight">{row[1]}</td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*
              표와 같은 내용을 실제 관리자 화면으로 한 번 더 보여 준다.
              이 캡처만 소개서 v1.1(슬라이드 10)에서 가져왔다 - 나머지 화면은 매뉴얼 쪽이다.
              v1.1 의 다른 캡처를 추가할 때는 data/safeprom.ts 상단 비공개 목록 5번을 먼저 읽을 것
              (로그인 · OTP · 조직계정은 구 브랜딩, 사용량 · LLM연결은 촬영 날짜와 단가가 박혀 있다).
            */}
            <figure className="sp-policy-shot">
              <img
                src={securityPolicyImg}
                alt="보안 정책 관리 화면 - 이미지 첨부 · 대화 보존 기간 · 웹검색 · 데이터 분석 설정"
                loading="lazy"
                onClick={() => setModalImage({ src: securityPolicyImg, alt: '보안 정책 관리 화면' })}
              />
              <figcaption>관리자가 회사 단위로 기능을 켜고 끕니다</figcaption>
            </figure>

            <p className="sp-disclaimer">※ {safepromScreensNotice}</p>
          </div>
        </section>

        {/* 도입 안내 */}
        <section id="sp-rollout" className="sp-section sp-section--dark">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">도입 안내</span>
              <h2>문의부터 전사 도입까지</h2>
            </header>

            {/*
              2026-10-20: 서비스 형태 · 지원 AI · 대상 · 지원 파일 · AI 사용료를 나열하던
              사실표(sp-facts)를 뺐다. 같은 내용이 위쪽 기능 카드와 기본값 표에 이미 나와 있어
              같은 말을 세 번 하는 꼴이었다. 절차만 남겨 흐름이 끊기지 않게 했다.
            */}

            <div className="sp-steps">
              <h3 className="sp-table-title">도입 절차</h3>
              <ol className="sp-steps__list">
                {safepromRollout.steps.map((step) => (
                  <li key={step.no}>
                    <span className="sp-steps__no">{step.no}</span>
                    <strong>{step.title}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="sp-steps">
              <h3 className="sp-table-title">첫 설정은 10분이면 끝납니다</h3>
              <ol className="sp-setup">
                {safepromRollout.setup.map((step) => (
                  <li key={step.no}>
                    <span className="sp-setup__no">{step.no}</span>
                    <strong>{step.title}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="sp-disclaimer">※ {safepromStatus.note}</p>
          </div>
        </section>

        {/*
          문의 폼. 브로셔 v1.2 에서 도입 절차가 '문의 · 데모'로 시작하도록 바뀌면서
          이 섹션이 페이지의 실제 목적지가 됐다 - 아래로 더 내리거나 빼지 말 것.

          폼 아래에 메일 주소를 그대로 남겨 둔 이유:
          전송이 실패하거나 폼을 못 쓰는 환경에서도 연락할 길이 있어야 한다.
          전송 경로가 아직 연결되지 않은 상태라면 폼은 메일 앱을 여는 방식으로 동작한다
          (자세한 내용은 components/ContactForm.tsx 상단 주석).
        */}
        <section id="sp-contact" className="sp-section sp-section--dark">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">{safepromContact.label}</span>
              <h2>도입을 검토 중이시라면</h2>
              <p>온라인 데모로 가림 미리보기와 관리자 화면을 먼저 보여 드립니다.</p>
            </header>

            <div className="sp-contact-wrap">
              <ContactForm />
              <p className="sp-contact">
                <span className="sp-contact__label">메일로 보내셔도 됩니다</span>
                <a className="sp-contact__mail" href={`mailto:${safepromContact.email}`}>
                  {safepromContact.email}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="sp-faq" className="sp-section">
          <div className="container">
            <header className="sp-section__head">
              <span className="sp-eyebrow">지원</span>
              <h2>자주 묻는 질문</h2>
            </header>

            <div className="sp-faq">
              {safepromFaq.map((item) => (
                <details key={item.q} className="sp-faq__item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* 이미지 확대 모달. App.tsx 의 증명서 모달과 같은 패턴이다. */}
      {modalImage && (
        <div className="sp-modal" onClick={() => setModalImage(null)} role="dialog" aria-modal="true">
          <button className="sp-modal__close" onClick={() => setModalImage(null)} aria-label="닫기">
            ×
          </button>
          <img src={modalImage.src} alt={modalImage.alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
