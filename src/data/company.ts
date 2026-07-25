/** 회사 기본 정보 (회사소개서 v0.7 기준) */
export const companyInfo = {
  name: '㈜오늘이즈 (Todayiz)',
  ceo: '채 진',
  founded: '2025년 2월 10일',
  address: '서울특별시 금천구 가산디지털2로 135',
  addressDetail: 'A동 1412호 (가산어반워크 1차)',
  website: 'www.todayiz.io',
  email: 'jinchai0407@daum.net',
  slogan: '당신의 가장 소중한 오늘을 함께하는 기업',
  sloganEn: 'The fastest change is now, from todayiz.',
}

export const stats = [
  { number: '2025', label: '설립연도' },
  { number: '9+', label: '주요 프로젝트' },
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
      { month: '06월', text: '한국인터넷진흥원 IoT 보안인증 플랫폼 운영 관리 사업' },
      { month: '04월', text: '파라다이스시티 PIS 시스템 개선 프로젝트 사업' },
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
      { month: '02월', text: '천성덕 포렌식연구소 myproof 앱 구축 사업' },
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

/** 호텔·리조트 파트너십 하이라이트 (회사소개서 v0.7 slide 10) */
export const paradiseCase = {
  client: '파라다이스시티',
  clientEn: 'Paradise City',
  operator: '㈜파라다이스세가사미 운영',
  description: '인천 영종도 복합리조트 (호텔 · 카지노 · 엔터테인먼트)',
  badge: '2025~2026 연속 파트너십',
  projects: [
    {
      date: '2025.07',
      period: '2025.06 ~ 10',
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
      period: '7개월',
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

/** 인공지능 사업 (회사소개서 v0.7 slide 7) */
export const aiService = {
  items: [
    'LLM 기반 인공지능 모델 개발 및 서비스',
    '멀티에이전트 오케스트레이션 · MCP 툴 연동',
    '하이브리드 RAG · Knowledge Graph 지식베이스 구축',
    '빅데이터 기반 데이터 분석 및 시각화 서비스',
    'AI 기반 매칭 · 예측 · 추천 서비스 개발',
  ],
}
