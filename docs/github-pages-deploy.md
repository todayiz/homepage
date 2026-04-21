# GitHub Pages 배포 가이드

Firebase Hosting → GitHub Pages 이전 절차. 저장소: `todayiz/homepage` (프로젝트 사이트 형태, 기본 URL: `https://todayiz.github.io/homepage/`). 현재 커스텀 도메인 `todayiz.io`가 적용되어 있어 실제 서비스 URL은 `https://todayiz.io/` 이다.

---

## 1. Vite `base` 경로 설정

프로젝트 사이트는 `/<repo>/` 하위에서 서비스되므로 빌드 시 `base`를 지정해야 한다. 로컬 `dev`에서는 `/`를 유지하도록 분기.

**현재 상태**: 커스텀 도메인 `todayiz.io`를 쓰므로 `base`는 `/`로 충분하다. 아래 `vite.config.ts`는 그대로 유지.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
  },
})
```

> 커스텀 도메인을 해제하고 `https://todayiz.github.io/homepage/`로만 서비스할 경우에는 `base: command === 'build' ? '/homepage/' : '/'`로 분기해야 한다.

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
4. 첫 배포 완료 후 `https://todayiz.github.io/homepage/` (또는 커스텀 도메인 `https://todayiz.io/`) 접속 확인

---

## 6. 커스텀 도메인 (현재 적용: `todayiz.io`)

1. Settings → Pages → **Custom domain**에 `todayiz.io` 입력
2. DNS 공급자에서 레코드 추가:
   - `www` → `todayiz.github.io` (CNAME)
   - 루트(`@`)는 A 레코드 4개 (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
3. CNAME 파일 위치 주의:
   - 현재 저장소 루트에 `CNAME` (`todayiz.io`)이 있는데, GitHub Actions 배포는 `dist/`만 업로드하므로 **루트 CNAME은 효과가 없다**.
   - `public/CNAME`에 두면 Vite가 빌드 시 `dist/CNAME`으로 복사해 준다. **루트 CNAME은 삭제하고 `public/CNAME`으로 옮기는 것을 권장.**
4. **Enforce HTTPS** 체크
5. 커스텀 도메인을 쓰는 동안에는 `vite.config.ts`의 `base`는 `/` 유지

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

- [x] `vite.config.ts` `base` — 커스텀 도메인 사용 중이라 `/` 유지 (변경 불필요)
- [ ] `.github/workflows/deploy.yml` 추가 (현재 미존재)
- [ ] Settings → Pages → Source = GitHub Actions
- [ ] `main` push 후 Actions 성공 확인
- [ ] 배포 URL 접속 확인 (에셋 404 없는지 devtools 확인)
- [ ] 루트 `CNAME` → `public/CNAME`으로 이동 (Actions 배포에서 dist에 포함되도록)
- [ ] Firebase Hosting 리소스 정리 (`firebase.json`, `.firebaserc` 제거)
