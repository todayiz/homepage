import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import SafepromPage from './SafepromPage'

/*
  /safeprom/ 페이지 전용 엔트리. 홈(src/main.tsx)과는 완전히 별개의 문서다.
  두 엔트리는 vite.config.ts 의 build.rollupOptions.input 에 등록돼 있다 -
  이 파일 경로를 바꾸면 safeprom/index.html 의 script src 도 함께 고칠 것.
*/
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SafepromPage />
  </StrictMode>,
)
