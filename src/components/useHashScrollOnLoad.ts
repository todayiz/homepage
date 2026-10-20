import { useEffect } from 'react'

/*
  /#about 처럼 해시를 달고 들어온 경우(다른 페이지의 헤더 링크로 넘어온 상황) 직접 스크롤해 준다.

  브라우저의 기본 해시 스크롤은 문서를 받은 직후에 일어나는데, 그 시점에는 React 가
  아직 섹션을 그리지 않아 대상 요소가 없다. 그래서 아무 일도 일어나지 않고 맨 위에 머문다.
  이 훅을 빼면 제품 페이지에서 '회사소개'를 눌러도 홈 최상단으로만 이동한다 - 지우지 말 것.

  페이지 컴포넌트마다 한 번씩 호출한다.
*/
export function useHashScrollOnLoad() {
  useEffect(() => {
    const { hash } = window.location
    if (!hash) return
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!target) return
    // 레이아웃이 확정된 다음 프레임에 스크롤해야 위치가 어긋나지 않는다.
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
}
