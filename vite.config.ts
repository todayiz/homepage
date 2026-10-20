import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

/*
  2026-10-07: 멀티페이지(MPA) 빌드로 전환했다. 페이지마다 실제 HTML 파일이 하나씩 나온다.

  react-router 같은 클라이언트 사이드 라우터를 쓰지 않은 이유 -
  이 사이트는 GitHub Pages(순수 정적 호스팅)로 배포된다(.github/workflows/deploy.yml).
  SPA 라우팅으로 /safefrom 주소를 만들면 서버에 그 경로의 파일이 없어서,
  주소 직접 입력 · 새로고침 · 외부 링크 유입 시 Pages가 404.html 을 HTTP 404 상태로 돌려준다.
  dist/index.html 을 404.html 로 복사하는 우회법이 널리 쓰이지만 응답 코드는 그대로 404라서
  검색엔진이 제품 페이지를 색인하지 않는다. 제품 소개 페이지는 유입이 목적이라 이게 치명적이다.

  그래서 페이지별로 실제 HTML 을 빌드해 200 으로 서빙되게 한다.
  페이지 간 이동은 일반 <a href> 전체 로드다 - 정적 홍보 페이지라 체감 차이가 없고,
  각 페이지가 독립적으로 색인 · 공유되며 og 태그도 페이지별로 다르게 줄 수 있다.

  페이지를 추가할 때: 루트에 <이름>/index.html 을 만들고 아래 input 에 등록할 것.
  input 경로는 root 기준 상대경로다 - package.json 이 "type": "module" 이라
  vite.config.ts 에서 __dirname 을 쓸 수 없으니 resolve(__dirname, ...) 로 바꾸지 말 것.
*/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        safeprom: 'safeprom/index.html',
      },
    },
  },
  server: {
    host: '127.0.0.1', 
    port: 5174,
    strictPort: true,
  },
})
