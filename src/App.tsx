import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.svg'
import researchCert from './assets/기업부설연구소인정서.jpg'
import ventureCert from './assets/벤처기업확인서.jpg'
import ransomDefenseImg from './assets/랜섬디펜스.png'
import softFilterImg from './assets/소프트필터화면.png'
import trafficImg from './assets/고속도로통행량분석.png'
import chargerImg from './assets/휴게소충전소현황.jpg'
import blockchainAuthDiagram from './assets/블록체인기반사용자인증서비스구성.png'
import blockchainKeyDiagram from './assets/블록체인기반사용자개인키관리구성.png'
import {
  aiGateway,
  aiService,
  bigdataService,
  blockchainService,
  certifications,
  clients,
  companyInfo,
  history,
  paradiseCase,
  portfolio,
  ransomDefense,
  securityService,
  softFilter,
  stats,
} from './data/company'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  /*
    모달이 열려 있는 동안 배경 스크롤을 막는다.
    body 스타일 변경을 핸들러에서 직접 하면 react-hooks/immutability 규칙에 걸리므로
    (컴포넌트 밖 값의 변경) 반드시 이 이펙트 안에서만 건드릴 것.
  */
  useEffect(() => {
    document.body.style.overflow = modalImage ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalImage])

  const openImageModal = (src: string, alt: string) => {
    setModalImage({ src, alt })
  }

  const closeImageModal = () => {
    setModalImage(null)
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__container">
          <div className="nav__logo" onClick={() => scrollToSection('hero')}>
            <img src={logo} alt="오늘이즈 로고" className="nav__logo-img" />
          </div>

          <button
            className={`nav__hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav__menu ${isMenuOpen ? 'nav__menu--open' : ''}`}>
            <li onClick={() => scrollToSection('about')}>회사소개</li>
            <li onClick={() => scrollToSection('services')}>사업분야</li>
            <li onClick={() => scrollToSection('case-paradise')}>고객사례</li>
            <li onClick={() => scrollToSection('history')}>연혁</li>
            <li onClick={() => scrollToSection('portfolio')}>사업실적</li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero__background">
          <div className="hero__gradient"></div>
          <div className="hero__grid"></div>
        </div>
        <div className="hero__content">
          <p className="hero__subtitle">IT Innovation Partner</p>
          <h1 className="hero__title">
            당신의 가장 소중한<br />
            <span className="hero__highlight">오늘</span>을 함께하는 기업
          </h1>
          <p className="hero__description">
            시스템 통합 · 블록체인 · 인공지능<br />
            최신 기술로 비즈니스의 미래를 설계합니다
          </p>
          <p className="hero__slogan">{companyInfo.sloganEn}</p>
          <div className="hero__buttons">
            <button className="btn btn--primary" onClick={() => scrollToSection('services')}>
              서비스 알아보기
            </button>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about__wrapper">
            <div className="about__left">
              <span className="section-label">ABOUT US</span>
              <h2 className="about__title">
                당신의 가장 소중한<br />
                <span className="highlight">오늘</span>을 함께하는 기업
              </h2>
              <p className="about__desc">
                ㈜오늘이즈는 시스템 통합 구축부터 블록체인, 인공지능까지
                최신 기술력으로 고객의 디지털 전환을 지원합니다.
              </p>
              <div className="about__stats">
                {stats.map((stat) => (
                  <div className="about__stat" key={stat.label}>
                    <span className="about__stat-number">{stat.number}</span>
                    <span className="about__stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/*
        대외 인증 (소개서 v1.11 slide4).

        조회번호(기업부설연구소 공서번호 / 벤처기업확인서 발급번호) 노출을 막기 위한 장치가 세 겹이다 -
        이 중 아무거나 하나만 풀어도 번호가 읽히니 같이 유지할 것 (2026-09-18):
          1. 220px 안팎의 고정 표시 크기 (아래 .cert 의 width)
          2. 클릭 확대 없음 (카드 안 주석 참고)
          3. src/assets 의 두 이미지는 GaussianBlur(0.45) + JPEG q82 로 살짝 눌러 저장한 버전
        한때 번호를 회색 박스로 가렸으나 사용자 판단으로 마스킹은 걷어냈고, 위 세 겹이 그 역할을 대신한다.
        소개서 pptx에서 이미지를 새로 뽑으면 3번 처리가 사라지니(확장자도 png로 돌아간다)
        교체할 때 같은 변환을 다시 걸 것. 원본은 docs/ 의 pptx 안에 그대로 있다.
      */}
      <section id="certifications" className="certifications">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CERTIFICATION</span>
            <h2 className="section-title">대외 인증</h2>
            <p className="section-desc">기술력과 성장성을 공인기관으로부터 인정받았습니다</p>
          </div>

          <div className="certifications__list">
            {certifications.map((cert, i) => {
              const img = i === 0 ? ventureCert : researchCert
              return (
                <article className="cert" key={cert.name}>
                  {/*
                    인증서는 클릭 확대를 일부러 붙이지 않는다 (2026-09-18).
                    국내 기업 인증현황 페이지(신라시스템 222x310, 베스타텍 218x300)도 모두
                    이 크기에서 끝내고 확대를 제공하지 않는다 - 확대하면 발급번호 / 공서번호가
                    판독 가능해지기 때문이다. 다른 섹션 이미지처럼 모달을 달지 말 것.
                  */}
                  <div className="cert__thumb">
                    <img src={img} alt={cert.name} />
                  </div>
                  <div className="cert__body">
                    <h3>{cert.name}</h3>
                    <p className="cert__issuer">{cert.issuer}</p>
                    <p className="cert__detail">{cert.detail}</p>
                    <span className="cert__date">{cert.date}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Header Section */}
      <section id="services" className="services-header">
        <div className="container">
          <div className="section-header">
            <span className="section-label">BUSINESS</span>
            <h2 className="section-title">주요 사업 분야</h2>
            <p className="section-desc">최신 기술력으로 고객의 디지털 전환을 지원합니다</p>
          </div>
        </div>
      </section>

      {/* Service 1: 시스템 통합 */}
      <section id="service-si" className="service-section service-section--light">
        <div className="container">
          <div className="service-section__content">
            <div className="service-section__info">
              <div className="service-section__number">01</div>
              <div className="service-section__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8m-4-4v4"/>
                </svg>
              </div>
              <h3 className="service-section__title">시스템 통합 (SI)</h3>
              <p className="service-section__desc">
                공공기관 및 기업의 디지털 인프라를 설계하고 구축합니다.
                안정적인 시스템 운영과 지속적인 기술 지원을 제공합니다.
              </p>
              <ul className="service-section__list">
                <li>공공/기업 시스템 구축 및 유지보수</li>
                <li>웹사이트 · 모바일 서비스 개발</li>
                <li>SW 엔지니어링 기술지원</li>
                <li>상용SW 공급 및 기술지원</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2: 블록체인 & 보안 */}
      <section id="service-blockchain" className="service-section service-section--dark">
        <div className="container">
          <div className="service-section__content service-section__content--reverse">
            <div className="service-section__info">
              <div className="service-section__number">02</div>
              <div className="service-section__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="service-section__title">블록체인 & 보안</h3>
              <p className="service-section__desc">
                블록체인 기술을 활용한 안전하고 투명한 서비스를 개발합니다.
                데이터 보안과 사용자 인증의 새로운 패러다임을 제시합니다.
              </p>
              {/*
                2026-09-18 소개서 v1.11 기준으로 교체. DB보안(PrivacyDB) / DB접근제어(ChakraMax)
                공급 2줄은 v1.11 사업분야 슬라이드에서 빠져 여기서도 제거했다. 없어진 사업이 아니라
                회사 정보(companyInfo.businessAreas)의 사업 분야 목록에 그대로 남아 있으니
                누락으로 보고 이 목록에 되돌려 넣지 말 것.
              */}
              <ul className="service-section__list">
                <li>블록체인 기반 서비스 개발</li>
                <li>데이터 암호화 및 보안 서비스 개발</li>
                <li>사용자 인증 · 개인키 관리 (HSM)</li>
              </ul>
            </div>
            <div className="service-section__visual">
              <div className="service-section__diagrams">
                <div className="service-section__diagram">
                  <h4>사용자 인증 서비스 구성</h4>
                  <div
                    className="service-section__diagram-img service-section__diagram-img--clickable"
                    onClick={() => openImageModal(blockchainAuthDiagram, '블록체인 기반 사용자 인증 서비스 구성도')}
                  >
                    <img src={blockchainAuthDiagram} alt="블록체인 기반 사용자 인증 서비스 구성도" />
                    <div className="service-section__diagram-zoom">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="service-section__diagram">
                  <h4>개인키 관리 서비스 구성</h4>
                  <div
                    className="service-section__diagram-img service-section__diagram-img--clickable"
                    onClick={() => openImageModal(blockchainKeyDiagram, '블록체인 기반 사용자 개인키 관리 구성도')}
                  >
                    <img src={blockchainKeyDiagram} alt="블록체인 기반 사용자 개인키 관리 구성도" />
                    <div className="service-section__diagram-zoom">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 소개서 v1.11 slide9 - 다이어그램만으로는 전달되지 않는 인증 흐름 / 키 보안 항목 */}
          <div className="bc-detail">
            <div className="bc-detail__col">
              <h4>사용자 인증 흐름</h4>
              <ol className="bc-detail__flow">
                {blockchainService.authFlow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div className="bc-detail__col">
              <h4>개인키 보안 (HSM)</h4>
              <ul className="bc-detail__points">
                {blockchainService.keySecurity.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="bc-detail__tech">
            <strong>자체 보유 기술</strong> {blockchainService.ownTech}
          </p>
        </div>
      </section>

      {/* Service 3: 인공지능 */}
      <section id="service-ai" className="service-section service-section--gradient">
        <div className="container">
          <div className="service-section__content">
            <div className="service-section__info">
              <div className="service-section__number">03</div>
              <div className="service-section__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z"/>
                  <path d="M12 8v8m-4-4h8"/>
                  <circle cx="12" cy="18" r="4"/>
                </svg>
              </div>
              <h3 className="service-section__title">인공지능 (AI)</h3>
              <p className="service-section__desc">
                데이터 수집부터 지식화, 추론, 서비스까지 AI 파이프라인 전 과정을 설계합니다.
                LLM 기반의 지능형 서비스로 업무 효율을 극대화합니다.
              </p>
              <ul className="service-section__list">
                {aiService.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {/*
              AI 보안 게이트웨이 구성도 (소개서 v1.11 slide8).
              소개서에서는 파워포인트 도형이라 내려받을 이미지가 없어 HTML/CSS로 다시 그렸다.
              이전에 쓰던 인공지능2.png 는 v1.11에 없는 구버전(멀티에이전트 / RAG) 그림이라 걷어냈다 -
              "구성도가 사라졌다"고 판단해 되돌리지 말 것.
            */}
            <div className="service-section__visual">
              <div className="ai-gateway">
                <h4 className="ai-gateway__title">AI 보안 솔루션 구성</h4>

                <div className="ai-gateway__node">
                  <span className="ai-gateway__node-title">{aiGateway.client.title}</span>
                  <span className="ai-gateway__node-detail">{aiGateway.client.detail}</span>
                </div>

                <span className="ai-gateway__link">HTTPS</span>

                <div className="ai-gateway__core">
                  <span className="ai-gateway__core-title">AI 보안 게이트웨이</span>
                  <ol className="ai-gateway__steps">
                    {aiGateway.steps.map((step) => (
                      <li key={step.no}>
                        <span className="ai-gateway__step-no">{step.no}</span>
                        {step.title}
                      </li>
                    ))}
                  </ol>
                  <p className="ai-gateway__note">※ {aiGateway.note}</p>
                </div>

                <span className="ai-gateway__link">고정 IP</span>

                <div className="ai-gateway__node">
                  <span className="ai-gateway__node-title">{aiGateway.provider.title}</span>
                  <span className="ai-gateway__node-detail">{aiGateway.provider.detail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 4: 보안솔루션 개발 (소개서 v1.11에서 신설된 네 번째 사업분야) */}
      <section id="service-security" className="service-section service-section--light">
        <div className="container">
          <div className="service-section__content">
            <div className="service-section__info">
              <div className="service-section__number">04</div>
              <div className="service-section__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="service-section__title">보안솔루션 개발</h3>
              <p className="service-section__desc">
                화이트리스트 기반으로 인증되지 않은 소프트웨어를 원천 차단합니다.
                신종 · 변종 랜섬웨어까지 행위 기반으로 대응하는 자체 솔루션을 개발합니다.
              </p>
              <ul className="service-section__list">
                {securityService.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 보안솔루션 상세 1: 랜섬디펜스 (소개서 v1.11 slide6) */}
      <section id="ransom-defense" className="solution solution--dark">
        <div className="container">
          <div className="solution__head">
            <div className="solution__brand">
              <img src={ransomDefenseImg} alt="랜섬디펜스 로고" />
            </div>
            <div className="solution__intro">
              <span className="section-label">SECURITY SOLUTION</span>
              <h2 className="solution__title">
                {ransomDefense.nameKo}
                <span className="solution__title-en">({ransomDefense.name})</span>
              </h2>
              <p className="solution__summary">{ransomDefense.summary}</p>
            </div>
          </div>

          <h3 className="solution__subtitle">주요 기능</h3>
          <div className="solution__features">
            {ransomDefense.features.map((feature) => (
              <article className="solution__feature" key={feature.no}>
                <span className="solution__feature-no">{feature.no}</span>
                <h4>{feature.title}</h4>
                <ul>
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h3 className="solution__subtitle">백신과 비교</h3>
          <div className="solution__table-wrap">
            <table className="solution__table">
              <thead>
                <tr>
                  {ransomDefense.compare.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ransomDefense.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={`${row[0]}-${i}`} className={i === 2 ? 'solution__table-own' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 보안솔루션 상세 2: 소프트필터 (소개서 v1.11 slide7) */}
      <section id="soft-filter" className="solution">
        <div className="container">
          <div className="solution__head">
            <div
              className="solution__shot service-section__diagram-img--clickable"
              onClick={() => openImageModal(softFilterImg, '소프트필터 관리 화면')}
            >
              <img src={softFilterImg} alt="소프트필터 관리 화면" />
              <div className="service-section__diagram-zoom">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                </svg>
              </div>
            </div>
            <div className="solution__intro">
              <span className="section-label">SECURITY SOLUTION</span>
              <h2 className="solution__title">
                {softFilter.nameKo}
                <span className="solution__title-en">({softFilter.name})</span>
              </h2>
              <p className="solution__summary">{softFilter.summary}</p>
              <p className="solution__note">※ {softFilter.note}</p>
            </div>
          </div>

          <h3 className="solution__subtitle">분석 방식</h3>
          <div className="solution__features">
            {softFilter.features.map((feature) => (
              <article className="solution__feature" key={feature.no}>
                <span className="solution__feature-no">{feature.no}</span>
                <h4>{feature.title}</h4>
                <ul>
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h3 className="solution__subtitle">일반 화이트리스트와 비교</h3>
          <div className="solution__table-wrap">
            <table className="solution__table">
              <thead>
                <tr>
                  {softFilter.compare.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {softFilter.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={`${row[0]}-${i}`} className={i === 2 ? 'solution__table-own' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 빅데이터 기반 시각화 서비스 (소개서 v1.11 slide10) */}
      <section id="bigdata" className="bigdata">
        <div className="container">
          <div className="section-header">
            <span className="section-label">BIG DATA</span>
            <h2 className="section-title">빅데이터 기반 시각화</h2>
            <p className="section-desc">{bigdataService.summary}</p>
          </div>

          <div className="bigdata__grid">
            {bigdataService.cases.map((item, i) => (
              <article className="bigdata__card" key={item.title}>
                {i < 2 && (
                  <div
                    className="bigdata__img service-section__diagram-img--clickable"
                    onClick={() => openImageModal(i === 0 ? trafficImg : chargerImg, item.title)}
                  >
                    <img src={i === 0 ? trafficImg : chargerImg} alt={item.title} />
                    <div className="service-section__diagram-zoom">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="bigdata__stat">
                    <strong>185~315기</strong>
                    <span>권역별 충전기 규모</span>
                    <strong>120~360억</strong>
                    <span>추정 수익성</span>
                  </div>
                )}
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Client Highlight: 호텔·리조트 파트너십 */}
      <section id="case-paradise" className="case">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CLIENT HIGHLIGHT</span>
            <h2 className="section-title">호텔 · 리조트 파트너십</h2>
            <p className="section-desc">복합리조트 운영 시스템의 디지털 전환을 함께하고 있습니다</p>
          </div>

          <div className="case__client">
            <div className="case__client-mark">P</div>
            <div className="case__client-info">
              <h3>
                {paradiseCase.client}
                <span className="case__client-en">({paradiseCase.clientEn})</span>
              </h3>
              <p className="case__client-operator">{paradiseCase.operator}</p>
              <p className="case__client-desc">{paradiseCase.description}</p>
            </div>
            <span className="case__badge">{paradiseCase.badge}</span>
          </div>

          <div className="case__projects">
            {paradiseCase.projects.map((project) => (
              <article className="case__project" key={project.date}>
                <div className="case__project-head">
                  <span className="case__project-date">{project.date}</span>
                  <span className="case__project-period">{project.period}</span>
                </div>
                <span className="case__project-subtitle">{project.subtitle}</span>
                <h4 className="case__project-title">{project.title}</h4>
                <p className="case__project-problem">{project.problem}</p>
                <ul className="case__project-points">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="history">
        <div className="container">
          <div className="section-header">
            <span className="section-label">HISTORY</span>
            <h2 className="section-title">주요 연혁</h2>
          </div>

          {history.map((group) => (
            <div className="history__timeline" key={group.year}>
              <div className="history__year">
                <h3>{group.year}</h3>
              </div>

              <div className="history__items">
                {group.items.map((item) => (
                  <div
                    className={`history__item ${item.highlight ? 'history__item--highlight' : ''}`}
                    key={`${item.month}-${item.text}`}
                  >
                    <span className="history__date">{item.month}</span>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-header">
            <span className="section-label">PORTFOLIO</span>
            <h2 className="section-title">주요 사업 실적</h2>
          </div>

          {portfolio.map((group) => (
            <div className="portfolio__group" key={group.year}>
              <h3 className="portfolio__year">{group.year}</h3>
              <div className="portfolio__grid">
                {group.items.map((item) => (
                  <div className="portfolio__card" key={`${item.client}-${item.title}`}>
                    <div className="portfolio__card-header">
                      <span className="portfolio__client">{item.client}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.role}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Clients */}
          <div className="clients">
            <h3 className="clients__title">주요 고객사</h3>
            <div className="clients__list">
              {clients.map((client) => (
                <div className="clients__item" key={client}>
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*
        회사 정보(법인명/대표/주소 등) 블록 - 2026-09-15 About 섹션 우측에서 페이지 하단으로 이동.
        모바일에서 About 섹션이 1단으로 접히면 이 표가 히어로 직후에 길게 노출돼
        회사 소개보다 먼저 읽히는 문제가 있어 푸터 바로 위로 내렸다.
        클래스는 기존 .about__info-* 를 그대로 재사용한다(스타일 중복 방지) - 이름만 보고
        About 섹션 전용이라 판단해 옮기거나 지우지 말 것.
      */}
      <section id="company-info" className="company-info">
        <div className="container">
          <div className="section-header">
            <span className="section-label">COMPANY</span>
            <h2 className="section-title">회사 정보</h2>
          </div>
          <div className="company-info__card">
            <div className="about__info-list">
              <div className="about__info-item">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">법인명</span>
                  <span className="about__info-value">{companyInfo.name}</span>
                </div>
              </div>

              <div className="about__info-item">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">대표이사</span>
                  <span className="about__info-value">{companyInfo.ceo}</span>
                </div>
              </div>

              <div className="about__info-item">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">설립일자</span>
                  <span className="about__info-value">{companyInfo.founded}</span>
                </div>
              </div>

              <div className="about__info-item">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">주소</span>
                  <span className="about__info-value">{companyInfo.address}<br />{companyInfo.addressDetail}</span>
                </div>
              </div>

              <div className="about__info-item about__info-item--wide">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">사업 분야</span>
                  <ul className="about__info-values">
                    {companyInfo.businessAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="about__info-item">
                <div className="about__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="about__info-content">
                  <span className="about__info-label">웹사이트</span>
                  <span className="about__info-value">{companyInfo.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        문의하기(Contact) 섹션 제거 - 2026-09-15
        메일 폼(mailto 전송)과 연락처 블록을 통째로 삭제했다. 되살리지 말 것:
        주소/웹사이트는 바로 위 .company-info 섹션에 이미 노출되므로 중복이었고,
        폼은 mailto 링크 방식이라 실제 문의 접수 경로로 쓰이지 않았다.
        관련 nav/footer 링크와 hero의 '문의하기' 버튼, formData state/handleSubmit,
        App.css의 .contact* / .form-group* 규칙도 함께 제거됨.
      */}

      {/* Image Modal */}
      {modalImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal__overlay" />
          <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal__close" onClick={closeImageModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="image-modal__header">
              <h3>{modalImage.alt}</h3>
            </div>
            <div className="image-modal__body">
              <img src={modalImage.src} alt={modalImage.alt} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer__brand">
              <div className="footer__logo">
                <img src={logo} alt="오늘이즈 로고" className="footer__logo-img" />
              </div>
              <p>{companyInfo.slogan}</p>
            </div>

            <div className="footer__links">
              <div className="footer__column">
                <h4>바로가기</h4>
                <ul>
                  <li onClick={() => scrollToSection('about')}>회사소개</li>
                  <li onClick={() => scrollToSection('services')}>사업분야</li>
                  <li onClick={() => scrollToSection('case-paradise')}>고객사례</li>
                  <li onClick={() => scrollToSection('portfolio')}>사업실적</li>
                      </ul>
              </div>
              <div className="footer__column">
                <h4>사업분야</h4>
                <ul>
                  <li onClick={() => scrollToSection('service-si')}>시스템 통합</li>
                  <li onClick={() => scrollToSection('service-blockchain')}>블록체인 & 보안</li>
                  <li onClick={() => scrollToSection('service-ai')}>인공지능</li>
                  <li onClick={() => scrollToSection('service-security')}>보안솔루션</li>
                  <li onClick={() => scrollToSection('bigdata')}>빅데이터 시각화</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2025 Todayiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
