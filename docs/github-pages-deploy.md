# GitHub Pages 배포 가이드

Firebase Hosting → GitHub Pages 이전 절차. 저장소: `todayiz-team/website` (프로젝트 사이트 형태, 최종 URL: `https://todayiz-team.github.io/website/`).

---

## 1. Vite `base` 경로 설정

프로젝트 사이트는 `/<repo>/` 하위에서 서비스되므로 빌드 시 `base`를 지정해야 한다. 로컬 `dev`에서는 `/`를 유지하도록 분기.

`vite.config.ts` 수정:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/website/' : '/',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
  },
}))
```

> 커스텀 도메인(예: `www.todayiz.com`)을 쓸 예정이면 `base`는 `/`로 두면 된다.

---

## 2. SPA 라우팅 대응 (React Router 등을 쓰는 경우)

GitHub Pages는 Firebase의 `rewrites` 같은 기능이 없어, 새로고침 시 404가 난다. 해결책:

- **방법 A (권장, 간단)**: 해시 라우터 사용 (`createHashRouter`)
- **방법 B**: `dist/404.html`을 `index.html`과 동일하게 복사. 빌드 스크립트에 추가:

  ```json
  "build": "tsc -b && vite build && cp dist/index.html dist/404.html"
  ```

  Windows에서도 돌리려면 `copyfiles` 같은 크로스플랫폼 툴을 쓰거나, 아래 GitHub Actions에서 처리한다.

현재 프로젝트는 라우터를 쓰지 않는 단일 페이지이므로 **둘 다 불필요**할 수 있음. 필요 시만 적용.

---

## 3. SPA 404 Fallback (GitHub Actions에서 처리)

라우터를 추가하게 되면 아래 단계를 워크플로에 넣으면 된다:

```yaml
- name: SPA fallback
  run: cp dist/index.html dist/404.html
```

---

## 4. GitHub Actions 워크플로 작성

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 5. GitHub 저장소 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → **Source**를 `GitHub Actions`로 변경
3. `main`에 push하면 위 워크플로가 자동으로 실행됨
4. 첫 배포 완료 후 `https://todayiz-team.github.io/website/` 접속 확인

---

## 6. 커스텀 도메인 (선택)

1. Settings → Pages → **Custom domain**에 도메인 입력 (예: `www.todayiz.com`)
2. DNS 공급자에서 CNAME 레코드 추가:
   - `www` → `todayiz-team.github.io`
   - 루트(`@`)는 A 레코드 4개 (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
3. `public/CNAME` 파일에 도메인 한 줄 기입 (빌드 시 `dist/CNAME`으로 복사됨)
4. **Enforce HTTPS** 체크
5. 커스텀 도메인을 쓰면 `vite.config.ts`의 `base`를 `/`로 되돌리기

---

## 7. Firebase Hosting 정리

배포가 정상화된 뒤 진행:

1. DNS/도메인이 Firebase를 가리키고 있었다면 GitHub Pages로 전환
2. Firebase 콘솔 → Hosting → 사이트 해제 또는 프로젝트 삭제
3. 레포 정리:
   - `firebase.json`, `.firebaserc` 삭제
   - `package.json`에 Firebase 관련 스크립트/디펜던시가 있으면 제거

---

## 8. 체크리스트

- [ ] `vite.config.ts`에 `base` 추가
- [ ] `.github/workflows/deploy.yml` 추가
- [ ] Settings → Pages → Source = GitHub Actions
- [ ] `main` push 후 Actions 성공 확인
- [ ] 배포 URL 접속 확인 (에셋 404 없는지 devtools 확인)
- [ ] (선택) 커스텀 도메인 + CNAME 설정
- [ ] Firebase Hosting 리소스 정리
