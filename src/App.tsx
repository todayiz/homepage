import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.svg'
import aiServiceDiagram from './assets/인공지능2.png'
import blockchainAuthDiagram from './assets/블록체인기반사용자인증서비스구성.png'
import blockchainKeyDiagram from './assets/블록체인기반사용자개인키관리구성.png'
import {
  aiService,
  clients,
  companyInfo,
  history,
  paradiseCase,
  portfolio,
  stats,
} from './data/company'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
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

  const openImageModal = (src: string, alt: string) => {
    setModalImage({ src, alt })
    document.body.style.overflow = 'hidden'
  }

  const closeImageModal = () => {
    setModalImage(null)
    document.body.style.overflow = ''
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
          <p className="hero__slogan">{companyInfo.sloganEn}</p>
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
                {stats.map((stat) => (
                  <div className="about__stat" key={stat.label}>
                    <span className="about__stat-number">{stat.number}</span>
                    <span className="about__stat-label">{stat.label}</span>
                  </div>
                ))}
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
              <ul className="service-section__list">
                <li>블록체인 기반 서비스 개발</li>
                <li>데이터 암호화 및 보안 서비스</li>
                <li>DB보안 솔루션 (PrivacyDB) 공급</li>
                <li>DB접근제어 솔루션 (ChakraMax) 공급</li>
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
            <div className="service-section__visual">
              <div className="service-section__diagram service-section__diagram--single">
                <h4>AI 서비스 구성</h4>
                <div
                  className="service-section__diagram-img service-section__diagram-img--clickable"
                  onClick={() => openImageModal(aiServiceDiagram, '인공지능 서비스 구성도')}
                >
                  <img src={aiServiceDiagram} alt="인공지능 서비스 구성도" />
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
                    <p>{companyInfo.address}<br />{companyInfo.addressDetail}</p>
                  </div>
                </div>

                <div className="contact__detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <div>
                    <strong>웹사이트</strong>
                    <p>{companyInfo.website}</p>
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
                  <li onClick={() => scrollToSection('contact')}>문의하기</li>
                </ul>
              </div>
              <div className="footer__column">
                <h4>사업분야</h4>
                <ul>
                  <li onClick={() => scrollToSection('service-si')}>시스템 통합</li>
                  <li onClick={() => scrollToSection('service-blockchain')}>블록체인 & 보안</li>
                  <li onClick={() => scrollToSection('service-ai')}>인공지능</li>
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
