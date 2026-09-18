/** 회사 기본 정보 (회사소개서 v1.11 기준) */
export const companyInfo = {
  name: '㈜오늘이즈 (Todayiz)',
  ceo: '채 진',
  founded: '2025년 2월 10일',
  address: '서울특별시 금천구 가산디지털2로 135',
  addressDetail: 'A동 1412호 (가산어반워크 1차)',
  website: 'www.todayiz.io',
  email: 'jinchai0407@daum.net',
  slogan: '당신의 가장 소중한 오늘을 함께하는 기업',
  /*
    소개서 v1.11 slide2 'General Status'의 사업 분야 5줄을 그대로 옮긴 값.
    주요사업분야 섹션(01~04)과 항목 수가 다른 이유: DB보안/DB접근제어 솔루션 공급은
    v1.11 사업분야 슬라이드에서는 빠졌지만 회사 소개 정보에는 남아 있다. 임의로 맞추지 말 것.
  */
  businessAreas: [
    '시스템 통합 구축 및 유지보수',
    '블록체인 및 보안 서비스 개발 및 공급',
    '인공지능 서비스 개발 및 공급',
    'DB보안(PrivacyDB) 솔루션 공급',
    'DB접근제어(ChakraMax) 솔루션 공급',
  ],
  sloganEn: 'The fastest change is now, from todayiz.',
}

export const stats = [
  { number: '2025', label: '설립연도' },
  { number: '10+', label: '주요 프로젝트' },
  { number: '100%', label: '고객 만족' },
]

export type HistoryGroup = {
  year: string
  items: { month: string; text: string; highlight?: boolean }[]
}

export const history: HistoryGroup[] = [
  {
    year: '2026',
    items: [
      { month: '09월', text: '벤처기업 확인' },
      { month: '09월', text: '기업부설연구소 설립' },
      { month: '06월', text: '한국인터넷진흥원 IoT 보안인증 플랫폼 운영 관리 사업' },
      { month: '04월', text: '파라다이스시티 PIS 시스템 개선 프로젝트 사업' },
      { month: '04월', text: '소프트웨어 사업자 등록' },
      { month: '01월', text: '공수처 전자적 증거보존관리시스템 유지보수 사업' },
    ],
  },
  {
    year: '2025',
    items: [
      { month: '12월', text: '㈜웨어밸리 ChakraMax DB접근제어 솔루션 공급' },
      { month: '12월', text: '㈜아울시스템즈 PrivacyDB DB보안 솔루션 공급' },
      { month: '07월', text: '파라다이스시티 전자문서 및 전자계약 관리시스템 사업' },
      { month: '03월', text: '공수처 전자적 증거보존관리시스템 유지보수 사업' },
      /*
        2026-09-18: 천성덕 myproof 건은 소개서 v1.11 기준으로 '02월 앱 구축' -> '03월 서비스 개발'로 정정.
        같은 슬라이드에서 빠져 있던 2025.03 공수처 유지보수는 사용자 확인 후 그대로 유지하기로 했다
        (소개서 쪽 줄바꿈이 깨지면서 누락된 것으로 판단). 소개서와 대조할 때 다시 지우지 말 것.
      */
      { month: '03월', text: '천성덕 포렌식연구소 myproof 서비스 개발 사업' },
      { month: '02월', text: '한국포렌식학회 대표홈페이지 유지보수 사업' },
      { month: '02월', text: '㈜오늘이즈 설립', highlight: true },
    ],
  },
]

export type PortfolioGroup = {
  year: string
  items: { client: string; title: string; role: string }[]
}

export const portfolio: PortfolioGroup[] = [
  {
    year: '2026',
    items: [
      {
        client: '한국인터넷진흥원',
        title: 'IoT 보안인증 시스템 플랫폼',
        role: '운영 · 유지관리',
      },
      {
        client: '파라다이스세가사미',
        title: 'PIS 시스템 개선 프로젝트',
        role: '구축',
      },
      {
        client: '고위공직자범죄수사처',
        title: '전자적 증거보존관리시스템',
        role: '유지보수',
      },
      {
        client: '천성덕 디지털포렌식연구소',
        title: '마이프루프 앱',
        role: '고도화 개발',
      },
    ],
  },
  {
    year: '2025',
    items: [
      {
        client: '고위공직자범죄수사처',
        title: '전자적 증거보존관리시스템',
        role: '유지보수',
      },
      {
        client: '천성덕 디지털포렌식연구소',
        title: '마이프루프 앱',
        role: '개발 및 공급',
      },
      {
        client: '파라다이스세가사미',
        title: '전자문서 및 전자계약시스템',
        role: '구축',
      },
      {
        client: '한국포렌식학회',
        title: '대표홈페이지',
        role: '유지보수',
      },
      {
        client: '아울시스템즈',
        title: 'DB보안 솔루션 PrivacyDB',
        role: '공급',
      },
      {
        client: '웨어밸리',
        title: 'DB접근제어 솔루션 ChakraMax',
        role: '공급',
      },
    ],
  },
]

export const clients: string[] = [
  '고위공직자범죄수사처',
  '파라다이스시티',
  '한국인터넷진흥원',
  '천성덕 디지털포렌식연구소',
  '한국포렌식학회',
  '아울시스템즈',
  '웨어밸리',
]

/** 호텔·리조트 파트너십 하이라이트 (회사소개서 v1.11 slide 11) */
export const paradiseCase = {
  client: '파라다이스시티',
  clientEn: 'Paradise City',
  operator: '㈜파라다이스세가사미 운영',
  description: '인천 영종도 복합리조트 (호텔 · 카지노 · 엔터테인먼트)',
  badge: '2025~2026 연속 파트너십',
  projects: [
    {
      date: '2025.07',
      period: '2025.07 ~ 12',
      title: '전자문서 · 전자계약 관리시스템 구축',
      subtitle: '계약 · 문서 디지털 전환',
      problem: '종이 · 파일 문서관리의 검색 · 보안 한계 극복',
      points: [
        '문서 전(全)주기 관리 : 등록 · 분류 · 검색 · 버전 · 권한 · 감사',
        '법적효력 전자서명 전자계약 : 결재 → 서명 → 만료 알림',
        'ERP · 그룹웨어 · 법무시스템 연계한 통합 계약관리 체계',
      ],
    },
    {
      date: '2026.04',
      period: '2026.04 ~ 12',
      title: 'PIS 시스템 개선 프로젝트',
      subtitle: '운영 시스템 고도화 & 보안 강화',
      problem: '엑셀 수작업 · 정산 부재 · 임대매장 노후화 개선',
      points: [
        '위탁관리 시스템 신규 개발 + 임대매장 관리 고도화',
        '정산 자동계산 · 무결성 체크, 거래처 인보이싱 일괄관리',
        '기준정보 · 재고 · 매출 정합성 및 데이터 모델 재설계',
      ],
    },
  ],
}

/** 인공지능 사업 (회사소개서 v1.11 slide 5 - 03 인공지능) */
export const aiService = {
  items: [
    'LLM 보안 게이트웨이(오늘AI) 서비스 개발',
    '포렌식 판례 기반 AI 챗봇 서비스',
    '빅데이터 분석 및 시각화 서비스',
  ],
}

/**
  보안솔루션 개발 (회사소개서 v1.11 slide 5 - 04). v1.11에서 새로 생긴 네 번째 사업분야로,
  상세 슬라이드(slide6 랜섬디펜스 / slide7 소프트필터)가 별도로 존재한다.
*/
export const securityService = {
  items: [
    'SoftFilter 화이트리스트 보안',
    'RansomDefense 랜섬웨어 방어',
    'SW 신뢰도 분석 · 행위 기반 차단',
  ],
}

/**
  대외 인증 (회사소개서 v1.11 slide 4).
  인증서 이미지 처리(마스킹을 걷어낸 경위, 화질을 살짝 눌러 저장하는 이유)는
  App.tsx 의 대외 인증 섹션 주석 참고.
*/
export const certifications = [
  {
    name: '벤처기업 확인서',
    issuer: '벤처기업확인기관',
    date: '2026년 09월 09일',
    detail: '혁신성장유형 · 유효기간 2029.09.08',
  },
  {
    name: '기업부설연구소 인정서',
    issuer: '한국산업기술진흥협회',
    date: '2026년 09월 02일',
    detail: '㈜오늘이즈 기업부설연구소',
  },
]

/**
  AI 보안 게이트웨이 구성 (회사소개서 v1.11 slide 8).
  소개서에서는 파워포인트 도형으로 그려져 있어 내려받을 이미지가 없다.
  그래서 사이트에서는 같은 내용을 HTML/CSS 다이어그램으로 다시 그렸다 -
  소개서가 갱신되면 이미지가 아니라 이 데이터와 .ai-gateway 마크업을 고쳐야 한다.
*/
export const aiGateway = {
  steps: [
    { no: '1', title: '한국어 정규화' },
    { no: '2', title: '민감정보 4계층 탐지' },
    { no: '3', title: '정책 평가 (허용~차단)' },
    { no: '4', title: '세션 왕복 토큰화' },
    { no: '5', title: '출력 검사 (응답 재검사)' },
  ],
  note: '원문 미보관 · 관리자 원문 열람 불가',
  client: { title: '사용자', detail: '웹 브라우저 (React SPA)' },
  provider: { title: 'LLM 공급자', detail: 'OpenAI · Claude · Gemini (고객사 소유 API 키)' },
}

/** 랜섬디펜스 솔루션 (회사소개서 v1.11 slide 6) */
export const ransomDefense = {
  name: 'RansomDefense',
  nameKo: '랜섬디펜스',
  summary:
    '화이트리스트 기반으로 랜섬웨어를 사전에 차단하는 안티 랜섬웨어 솔루션입니다. ' +
    '인증되지 않은 프로그램은 중요 자료에 접근할 수 없어, 백신이 잡지 못하는 신종 · 변종 랜섬웨어에도 대응할 수 있습니다.',
  features: [
    { no: '01', title: '소프트웨어 인증', points: ['실행 시점에 신뢰도를 자동으로 검증', '미인증 프로그램의 중요 자료 접근 차단'] },
    { no: '02', title: '미끼 탐지', points: ['랜섬웨어만 접근하는 미끼 파일 배치', '미끼 파일에 접근하면 즉시 차단'] },
    { no: '03', title: '행위 감시', points: ['파일 암호화 · 삭제 · 이름 변경 감시', '시작프로그램 · 스케줄 등록 감시'] },
    { no: '04', title: '실시간 백업 · 복원', points: ['중요 자료를 실시간으로 백업', '파일이 훼손되면 이전 상태로 복원'] },
  ],
  compare: {
    headers: ['구분', '백신', '랜섬디펜스'],
    rows: [
      ['처리 방식', '블랙리스트', '화이트리스트'],
      ['차단 방식', '시그니처', '행위 기반'],
      ['신종 랜섬웨어 탐지', 'X', 'O'],
      ['실시간 백업 · 복원', 'X', 'O'],
      ['프로세스 감시', '전체 프로세스', '인증된 프로세스'],
    ],
  },
}

/** 소프트필터 솔루션 (회사소개서 v1.11 slide 7) */
export const softFilter = {
  name: 'SoftFilter',
  nameKo: '소프트필터',
  summary:
    '소프트웨어가 실행되기 전에 자동으로 분석해 보안 등급을 매기고, 그 결과로 화이트리스트를 구성하는 솔루션입니다. ' +
    '별도 수집 기간 없이 바로 적용할 수 있고, 일반 PC뿐 아니라 키오스크 · ATM 같은 무인 자동화 기기에도 사용할 수 있습니다.',
  features: [
    { no: '01', title: '정적 분석', points: ['파일 기본 정보를 수집해 신뢰성 검사'] },
    { no: '02', title: '동적 분석', points: ['실행 중 변화하는 정보로 신뢰성 검사'] },
    { no: '03', title: '사회공학적 분석', points: ['실행 주체가 실제 사용자인지 판별'] },
    { no: '04', title: '휴리스틱 분석', points: ['수집한 정보 전체의 이상 여부 판단'] },
  ],
  compare: {
    headers: ['구분', '일반 방식', '소프트필터'],
    rows: [
      ['등록 방식', '수집 후 수동 등록', '즉시 자동 등록'],
      ['관리 기준', '주관적 판단', '객관적 보안등급'],
      ['통제', '제어 안 함', '등급별 제어'],
      ['SW 현황 파악', '알 수 없음', '등급별 파악'],
      ['OS 업데이트', '수동 등록', '자동 등록'],
    ],
  },
  note: '소프트웨어 신뢰도를 위험~보호 7단계 등급으로 분류',
}

/** 빅데이터 시각화 서비스 (회사소개서 v1.11 slide 10) */
export const bigdataService = {
  summary: '전국 교통 빅데이터를 수집 · 분석 · 시각화하여 정책 의사결정을 지원합니다.',
  cases: [
    { title: '고속도로 통행량 분석', desc: '노선별 통행량 히트맵으로 주요 통행 고속도로 도출' },
    { title: '휴게소 충전소 현황', desc: '수도권 · 노선 중간 구간에 밀집, 서해안 · 영남권은 간격이 넓음' },
    { title: '무선충전도로 입지선정', desc: '권역별 최적 구간 도출 — 충전기 185~315기 · 수익성 120~360억' },
  ],
}

/** 블록체인 기반 인증·보안 서비스 (회사소개서 v1.11 slide 9) */
export const blockchainService = {
  authFlow: [
    '계정 생성 — 개인키 · 공개키 생성',
    '전자서명 인증 (Sign · Recover)',
    '트랜잭션 실행 (sendTransaction)',
  ],
  keySecurity: [
    '개인키를 HSM 대칭키로 암호화 보관',
    '인증 · 서명 요청 시에만 복호화',
    '관리자 마스터키로 권한 통제',
  ],
  ownTech: '전자서명 인증 · HSM 키 관리 · 블록체인 노드 연동',
}
