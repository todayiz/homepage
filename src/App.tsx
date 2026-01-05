import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.svg'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, phone, message } = formData
    const subject = encodeURIComponent(`[홈페이지 문의] ${name}님의 문의`)
    const body = encodeURIComponent(
      `회사/성함: ${name}\n` +
      `이메일: ${email}\n` +
      `연락처: ${phone || '미입력'}\n\n` +
      `문의 내용:\n${message}`
    )
    window.location.href = `mailto:jinchai0407@daum.net?subject=${subject}&body=${body}`
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
            <li onClick={() => scrollToSection('history')}>연혁</li>
            <li onClick={() => scrollToSection('portfolio')}>사업실적</li>
            <li onClick={() => scrollToSection('contact')}>문의하기</li>
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
          <div className="hero__buttons">
            <button className="btn btn--primary" onClick={() => scrollToSection('services')}>
              서비스 알아보기
            </button>
            <button className="btn btn--secondary" onClick={() => scrollToSection('contact')}>
              문의하기
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
                <div className="about__stat">
                  <span className="about__stat-number">2025</span>
                  <span className="about__stat-label">설립연도</span>
                </div>
                <div className="about__stat">
                  <span className="about__stat-number">6+</span>
                  <span className="about__stat-label">주요 프로젝트</span>
                </div>
                <div className="about__stat">
                  <span className="about__stat-number">100%</span>
                  <span className="about__stat-label">고객 만족</span>
                </div>
              </div>
            </div>

            <div className="about__right">
              <div className="about__info-list">
                <div className="about__info-item">
                  <div className="about__info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div className="about__info-content">
                    <span className="about__info-label">법인명</span>
                    <span className="about__info-value">㈜오늘이즈 (Todayiz)</span>
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
                    <span className="about__info-value">채 진</span>
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
                    <span className="about__info-value">2025년 2월 10일</span>
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
                    <span className="about__info-value">서울시 금천구 서부샛길 606<br />대성디폴리스지식산업센터 지하114</span>
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
                    <span className="about__info-value">www.todayiz.io</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <span className="section-label">BUSINESS</span>
            <h2 className="section-title">주요 사업 분야</h2>
          </div>

          <div className="services__grid">
            <div className="service-card service-card--large">
              <div className="service-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8m-4-4v4"/>
                </svg>
              </div>
              <h3>시스템 통합 (SI)</h3>
              <ul>
                <li>공공/기업 시스템 구축 및 유지보수</li>
                <li>웹사이트 · 모바일 서비스 개발</li>
                <li>SW 엔지니어링 기술지원</li>
                <li>상용SW 공급 및 기술지원</li>
              </ul>
            </div>

            <div className="service-card service-card--large">
              <div className="service-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>블록체인 & 보안</h3>
              <ul>
                <li>블록체인 기반 서비스 개발</li>
                <li>데이터 암호화 및 보안 서비스</li>
                <li>DB보안 솔루션 (PrivacyDB) 공급</li>
                <li>DB접근제어 솔루션 (ChakraMax) 공급</li>
              </ul>
            </div>

            <div className="service-card service-card--large">
              <div className="service-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z"/>
                  <path d="M12 8v8m-4-4h8"/>
                  <circle cx="12" cy="18" r="4"/>
                </svg>
              </div>
              <h3>인공지능 (AI)</h3>
              <ul>
                <li>LLM 기반 AI 모델 개발 및 서비스</li>
                <li>빅데이터 기반 데이터 분석</li>
                <li>AI 매칭 · 예측 · 추천 서비스</li>
                <li>AI 분류 및 분석 서비스 개발</li>
              </ul>
            </div>
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

          <div className="history__timeline">
            <div className="history__year">
              <h3>2025</h3>
            </div>

            <div className="history__items">
              <div className="history__item">
                <span className="history__date">12월</span>
                <p>㈜웨어밸리 ChakraMax DB접근제어 솔루션 공급</p>
              </div>
              <div className="history__item">
                <span className="history__date">12월</span>
                <p>㈜아울시스템즈 PrivacyDB DB보안 솔루션 공급</p>
              </div>
              <div className="history__item">
                <span className="history__date">07월</span>
                <p>파라다이스시티 전자문서 및 전자계약 관리시스템 사업</p>
              </div>
              <div className="history__item">
                <span className="history__date">03월</span>
                <p>공수처 전자적 증거보존관리시스템 유지보수 사업</p>
              </div>
              <div className="history__item">
                <span className="history__date">02월</span>
                <p>천성덕 포렌식연구소 myproof 앱 구축 사업</p>
              </div>
              <div className="history__item">
                <span className="history__date">02월</span>
                <p>한국포렌식학회 대표홈페이지 유지보수 사업</p>
              </div>
              <div className="history__item history__item--highlight">
                <span className="history__date">02월</span>
                <p>㈜오늘이즈 설립</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-header">
            <span className="section-label">PORTFOLIO</span>
            <h2 className="section-title">주요 사업 실적</h2>
          </div>

          <div className="portfolio__grid">
            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">고위공직자범죄수사처</span>
              </div>
              <h4>전자적 증거보존관리시스템</h4>
              <p>유지보수</p>
            </div>

            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">천성덕 디지털포렌식연구소</span>
              </div>
              <h4>마이프루프 앱</h4>
              <p>개발 및 공급</p>
            </div>

            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">파라다이스세가사미</span>
              </div>
              <h4>전자문서 및 전자계약시스템</h4>
              <p>구축</p>
            </div>

            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">한국포렌식학회</span>
              </div>
              <h4>대표홈페이지</h4>
              <p>유지보수</p>
            </div>

            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">아울시스템즈</span>
              </div>
              <h4>DB보안 솔루션 PrivacyDB</h4>
              <p>공급</p>
            </div>

            <div className="portfolio__card">
              <div className="portfolio__card-header">
                <span className="portfolio__client">웨어밸리</span>
              </div>
              <h4>DB접근제어 솔루션 ChakraMax</h4>
              <p>공급</p>
            </div>
          </div>

          {/* Clients */}
          <div className="clients">
            <h3 className="clients__title">주요 고객사</h3>
            <div className="clients__list">
              <div className="clients__item">고위공직자범죄수사처</div>
              <div className="clients__item">파라다이스시티</div>
              <div className="clients__item">천성덕 디지털포렌식연구소</div>
              <div className="clients__item">한국포렌식학회</div>
              <div className="clients__item">아울시스템즈</div>
              <div className="clients__item">웨어밸리</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header section-header--light">
            <span className="section-label">CONTACT</span>
            <h2 className="section-title">문의하기</h2>
          </div>

          <div className="contact__content">
            <div className="contact__info">
              <h3>함께 성장할 파트너를<br />기다립니다</h3>
              <p>프로젝트 문의, 제휴 제안 등<br />어떤 문의든 환영합니다</p>

              <div className="contact__details">
                <div className="contact__detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <strong>주소</strong>
                    <p>서울시 금천구 서부샛길 606<br />대성디폴리스지식산업센터 지하114</p>
                  </div>
                </div>

                <div className="contact__detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <div>
                    <strong>웹사이트</strong>
                    <p>www.todayiz.io</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="회사/성함"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="연락처"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="문의 내용을 입력해주세요"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn--primary btn--full">
                문의하기
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer__brand">
              <div className="footer__logo">
                <img src={logo} alt="오늘이즈 로고" className="footer__logo-img" />
              </div>
              <p>당신의 가장 소중한 오늘을 함께하는 기업</p>
            </div>

            <div className="footer__links">
              <div className="footer__column">
                <h4>바로가기</h4>
                <ul>
                  <li onClick={() => scrollToSection('about')}>회사소개</li>
                  <li onClick={() => scrollToSection('services')}>사업분야</li>
                  <li onClick={() => scrollToSection('portfolio')}>사업실적</li>
                  <li onClick={() => scrollToSection('contact')}>문의하기</li>
                </ul>
              </div>
              <div className="footer__column">
                <h4>사업분야</h4>
                <ul>
                  <li>시스템 통합</li>
                  <li>블록체인 & 보안</li>
                  <li>인공지능</li>
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
