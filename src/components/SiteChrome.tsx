import { useEffect, useState, type MouseEvent } from 'react'
import '../App.css'
import logo from '../assets/logo.svg'
/*
  세이프롬 로고에서 방패 마크만 떼어낸 이미지(src/assets/세이프롬로고.png 의 왼쪽 부분).
  워드마크까지 넣으면 가로로 길어 메뉴 줄을 밀어내고, 'Safe' 글자가 짙은 남색이라
  어두운 헤더에서 읽히지도 않는다 - 전체 로고로 바꾸지 말 것.
*/
import safepromMark from '../assets/세이프롬마크.png'
import { companyInfo } from '../data/company'

/*
  사이트 공통 헤더 · 푸터.

  2026-10-07: 제품 소개 페이지(/safefrom/)가 생기면서 App.tsx 안에 인라인으로 있던
  nav · footer 를 여기로 뽑았다. 이 사이트는 멀티페이지 빌드(vite.config.ts 참고)라
  페이지마다 별도 엔트리에서 렌더되므로, 공통 부분을 각 페이지에 복사해 두면
  한쪽만 수정되어 헤더가 어긋난다 - 반드시 이 파일만 고칠 것.

  App.css 를 여기서 import 하는 이유: .nav / .footer 스타일이 App.css 에 들어 있어서
  이 컴포넌트를 쓰는 페이지가 App.css import 를 빼먹으면 레이아웃이 통째로 깨진다.
  App.tsx 도 같은 파일을 import 하지만 동일 모듈이라 중복 로드되지 않고,
  빌드 시 두 엔트리가 공유하는 CSS 청크로 묶인다.
*/

type SiteChromeProps = {
  /*
    홈(/)에서 렌더할 때만 true.
    true 면 섹션 링크가 같은 문서 안의 #id 로 나가고 부드러운 스크롤이 걸린다.
    false(서브 페이지)면 /#id 로 홈으로 이동한다 - 서브 페이지에는 그 섹션이 없으므로
    여기서 isHome 을 생략하면 링크가 먹지 않는 것처럼 보인다.
  */
  isHome?: boolean
}

const SECTION_LINKS = [
  { id: 'about', label: '회사소개' },
  { id: 'services', label: '사업분야' },
  { id: 'case-paradise', label: '고객사례' },
  { id: 'history', label: '연혁' },
  { id: 'portfolio', label: '사업실적' },
]

/*
  2026-10-20: 홈의 사업분야 순서와 맞췄다.
  'service-ai' 섹션이 'service-safeprom' 으로 바뀌어 맨 앞으로 올라갔고,
  빅데이터 시각화 섹션은 사라져서 링크도 함께 뺐다 - 없는 섹션으로 보내면 아무 일도 안 일어난다.
*/
const SERVICE_LINKS = [
  { id: 'service-safeprom', label: '세이프롬' },
  { id: 'service-si', label: '시스템 통합' },
  { id: 'service-blockchain', label: '블록체인 & 보안' },
  { id: 'service-security', label: '보안솔루션' },
]

/*
  섹션 링크를 실제 <a href> 로 렌더하기 위한 훅.
  이전 구현은 <li onClick={scrollToSection}> 이라 키보드 포커스 · 가운데 클릭으로 새 탭 열기 ·
  크롤러의 링크 추적이 모두 불가능했다 - href 를 지우고 onClick 만 남기지 말 것.
*/
function useSectionLink(isHome: boolean, onNavigate?: () => void) {
  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // 서브 페이지에서는 막지 않는다. href(/#id)대로 홈으로 이동해야 한다.
    if (!isHome) return
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
    onNavigate?.()
  }

  return { href, onClick }
}

export function SiteNav({ isHome = false }: SiteChromeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { href, onClick } = useSectionLink(isHome, () => setIsMenuOpen(false))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__container">
        <a className="nav__logo" href={isHome ? '#hero' : '/'} onClick={(e) => onClick(e, 'hero')}>
          <img src={logo} alt="오늘이즈 로고" className="nav__logo-img" />
        </a>

        <button
          className={`nav__hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav__menu ${isMenuOpen ? 'nav__menu--open' : ''}`}>
          {SECTION_LINKS.map((link) => (
            <li key={link.id}>
              <a href={href(link.id)} onClick={(e) => onClick(e, link.id)}>
                {link.label}
              </a>
            </li>
          ))}
          {/*
            제품 페이지는 섹션이 아니라 별도 HTML 문서라 항상 절대경로 링크다.
            끝의 슬래시를 빼지 말 것 - /safeprom 로 두면 GitHub Pages 가
            /safeprom/ 로 301 리다이렉트를 한 번 더 태운다.

            2026-10-13: 라벨을 '제품소개' -> '세이프롬' + 마크로 바꿨다.
            제품 이름을 메뉴에서 바로 노출해 브랜드를 알리려는 의도다 -
            일반 명사로 되돌리지 말 것.
            마크의 alt 가 비어 있는 건 의도적이다. 옆의 '세이프롬' 글자가 같은 뜻을 전하므로
            alt 를 채우면 읽기 도구가 '세이프롬 세이프롬'으로 두 번 읽는다.
          */}
          <li className="nav__menu-item--product">
            <a href="/safeprom/">
              <img src={safepromMark} alt="" className="nav__product-mark" />
              세이프롬
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export function SiteFooter({ isHome = false }: SiteChromeProps) {
  const { href, onClick } = useSectionLink(isHome)

  return (
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
                {SECTION_LINKS.filter((link) => link.id !== 'history').map((link) => (
                  <li key={link.id}>
                    <a href={href(link.id)} onClick={(e) => onClick(e, link.id)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer__column">
              <h4>사업분야</h4>
              <ul>
                {SERVICE_LINKS.map((link) => (
                  <li key={link.id}>
                    <a href={href(link.id)} onClick={(e) => onClick(e, link.id)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer__column">
              <h4>제품</h4>
              <ul>
                <li>
                  <a href="/safeprom/">세이프롬</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; 2025 Todayiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
