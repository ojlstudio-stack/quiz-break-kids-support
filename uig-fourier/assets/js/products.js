/* =====================================================================
   UIG × Fourier — 제품 · 가격 데이터
   ---------------------------------------------------------------------
   ● 가격 구조
     editions[].base   : 공개된 기준 가격 { amount, currency: 'CNY' | 'USD' }
     editions[].factor : 기준가 → 국내 공급 참고가 환산 계수
                         (수입 통관·운송·인증·설치·교육 비용 및 딜러 마진 반영)
                         - 해외 리셀러 판매가(USD) 기준 : 1.10
                         - 중국 내 조달·소매가(CNY) 기준 : 1.25
     editions[].krw    : 숫자를 넣으면 위 계산을 무시하고 이 금액을 그대로 표시
                         (UIG 확정 공급가를 입력할 때 사용)
     editions[].basis  : 'published' (공개가 기준) | 'estimate' (UIG 예상가)
     editions[].free   : true 이면 "무상 · 오픈소스"로 표시
     base 와 krw 가 모두 없으면 "견적 문의"로 표시됩니다.
   ● 환율은 config.js 의 fxCNY / fxUSD 를 사용합니다.
   ● 모든 가격은 부가세(VAT) 별도 참고가입니다.
   ===================================================================== */

window.UIG_CATEGORIES = {
  humanoid: {
    label: '휴머노이드 로봇',
    icon: 'humanoid',
    desc: 'GR 시리즈 풀사이즈 휴머노이드, 오픈소스 N1, 휠 기반 GRW 등 Fourier 범용 로봇 라인업.'
  },
  component: {
    label: '핵심 부품 · 개발 플랫폼',
    icon: 'actuator',
    desc: 'FSA 액추에이터, 덱스터러스 핸드, SDK·시뮬레이션·텔레오퍼레이션 등 자체 로봇 개발용 모듈.'
  },
  rehab: {
    label: '재활 · 의료 로봇',
    icon: 'exo',
    desc: 'Fourier Rehab의 하지 외골격, 상지·손목·발목 로봇, 사이클 트레이너, 통합 재활 플랫폼.'
  }
};

window.UIG_PRODUCTS = [

  /* ================================================================
     휴머노이드 로봇
     ================================================================ */
  {
    id: 'gr-3',
    code: 'GR-3',
    name: 'Fourier GR-3 Care-bot',
    series: 'GR 시리즈',
    category: 'humanoid',
    subcategory: '풀사이즈 휴머노이드 · 돌봄 특화',
    tagline: '전신 촉각 센서와 소프트 쉘을 갖춘 돌봄·교감 특화 풀사이즈 휴머노이드. 재활병원·요양기관·공공 안내용 플래그십 모델.',
    description: [
      'GR-3는 Fourier가 2025년 8월 공개한 3세대 풀사이즈 휴머노이드로, "Care-bot"이라는 이름처럼 사람과의 물리적 접촉과 정서적 교감을 전제로 설계되었습니다. 머리와 몸통에 분산 배치된 31개의 촉각·압력 센서, 자동차 내장재 등급의 소프트 패브릭 외장, LED 표정 디스플레이가 결합되어 재활·요양 환경에서 안전하게 사용할 수 있습니다.',
      '시각·음원 위치 추적·촉각을 통합한 풀-퍼셉션 멀티모달 인터랙션 시스템이 사용자의 감정을 인식하고 자연어로 대화하며, 12-DoF 촉각 덱스터러스 핸드로 물건을 건네거나 보조 동작을 수행합니다. 듀얼 핫스왑 배터리로 운용 중단 없이 약 3시간 연속 구동이 가능합니다.',
      'Fourier Rehab의 통합 재활 플랫폼(RehabHub)과 연동되어 인지 훈련, 건강 모니터링, 안내 서비스 시나리오에 활용되며, Aurora SDK를 통해 연구·교육기관의 자체 애플리케이션 개발도 지원합니다.'
    ],
    launch: '2025.08',
    status: 'shipping',
    featured: true,
    icon: 'care',
    accent: '#1d5cff',
    keywords: ['케어봇', 'care-bot', '돌봄', '요양', '휴머노이드', '소프트'],
    specs: [
      { label: '신장 / 중량', value: '165 cm / 71 kg', short: '165 cm · 71 kg' },
      { label: '자유도', value: '총 55 DoF (12-DoF 덱스터러스 핸드 ×2 포함)', short: '55 DoF' },
      { label: '가반하중', value: '편측 팔 3 kg', short: '팔 3 kg' },
      { label: '배터리', value: '듀얼 핫스왑 리튬이온 702 Wh + 234 Wh, 연속 구동 약 3시간, 충전 약 1.5시간' },
      { label: '컴퓨팅', value: 'NVIDIA Jetson AGX Orin / Thor + AMD Ryzen 8코어 CPU, Ubuntu 22.04' },
      { label: '센서', value: 'RGB·구조광 카메라 모듈, 6축 IMU, 4채널 마이크 어레이, 15 W 스피커, 31개 분산 촉각·압력 센서(머리·몸통)' },
      { label: '외장 · 표정', value: '자동차 내장재 등급 소프트 패브릭, LED 표정 디스플레이' },
      { label: '인터페이스', value: 'USB-C, USB 3.0, RJ45' },
      { label: 'SDK', value: 'Fourier Aurora SDK (C++17 / Python, Apache 2.0), RoCS 제어 앱' }
    ],
    features: [
      '전신 촉각 센싱 + 시각·청각 통합 멀티모달 인터랙션, 감정 인식 및 자연어 대화',
      '소프트 쉘 안전 설계로 사람과의 접촉이 잦은 돌봄·안내 환경에 적합',
      '듀얼 핫스왑 배터리로 중단 없는 연속 운용',
      '12-DoF 촉각 덱스터러스 핸드로 정밀 파지 및 보조 동작',
      'RehabHub 통합 재활 플랫폼 연동 (인지 훈련, 건강 모니터링, 안내)',
      'Aurora SDK·RoCS 기반 애플리케이션 개발 및 연구 활용'
    ],
    applications: ['요양 · 돌봄', '재활병원', '공공 안내 · 교육', '연구 · 교육기관', '전시 · 서비스'],
    editions: [
      { name: 'GR-3 표준형 (소프트 쉘 Care-bot)', base: { amount: 100000, currency: 'USD' }, factor: 1.1, basis: 'published', ref: '해외 공식 리셀러 판매가 US$100,000 기준', note: '12-DoF 핸드 ×2, 듀얼 배터리, 충전기, 기본 SW 포함' },
      { name: '연구 · 교육기관 패키지 (SDK 워크숍 포함)', note: '기관 할인 적용, 개발자 교육 2일 포함' }
    ],
    priceNote: '※ GR-3의 제조사 공식 판매가는 공개되지 않았습니다. 해외 리셀러 판매가는 US$80,000~125,000, 중국 내 보도 가격은 CNY 115,000~200,000 이상으로 편차가 큽니다. 위 참고가는 해외 리셀러 판매가를 기준으로 환산한 값이며, 국내 공급가는 제조사 딜러 정책에 따라 견적 시 확정됩니다.',
    sources: [
      { label: 'Fourier CES 2026 발표 (PR Newswire)', url: 'https://www.prnewswire.com/news-releases/fourier-makes-ces-debut-with-gr-3-a-next-generation-care-focused-humanoid-robot-302654565.html' },
      { label: 'GR-3 사전판매 (Sina, 2025.09)', url: 'https://finance.sina.com.cn/tech/roll/2025-09-08/doc-infptzmm4507492.shtml' },
      { label: '리셀러 가격 (Robotopian)', url: 'https://robotopian.com/products/fourier-gr3-humanoid-robot' }
    ],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'gr-3c',
    code: 'GR-3C',
    name: 'Fourier GR-3C Astronaut',
    series: 'GR 시리즈',
    category: 'humanoid',
    subcategory: '풀사이즈 휴머노이드 · 하드 쉘 · 텔레오퍼레이션',
    tagline: 'GR-3의 하드 쉘 버전. 링 LED 헤드와 전신 텔레오퍼레이션을 갖춘 연구·원격작업·산업 실증용 모델.',
    description: [
      'GR-3C("우주비행사")는 2025년 9월 상하이 공업박람회(CIIF)에서 공개된 GR-3의 기능형 파생 모델입니다. 알루미늄 합금과 엔지니어링 플라스틱으로 된 화이트 하드 쉘, 링형 LED 디스플레이가 있는 둥근 헤드가 특징이며, 모션 캡처 기반의 저지연 전신 텔레오퍼레이션을 지원합니다.',
      '비전 시스템과 12-DoF 핸드 등 모듈식 업그레이드가 가능해 연구, 고위험·원격 작업, 조립·검사 등 산업 실증(PoC), 재활 훈련 보조 등에 활용됩니다.'
    ],
    launch: '2025.09',
    status: 'shipping',
    featured: false,
    icon: 'humanoid',
    accent: '#3b82f6',
    keywords: ['astronaut', '우주비행사', '텔레오퍼레이션', '원격', '하드쉘'],
    specs: [
      { label: '신장 / 중량', value: '165 cm / 71 kg', short: '165 cm · 71 kg' },
      { label: '자유도', value: '최대 55 DoF', short: '최대 55 DoF' },
      { label: '외장', value: '알루미늄 합금 + 엔지니어링 플라스틱 하드 쉘 (화이트)', short: '하드 쉘' },
      { label: '헤드', value: '링형 LED 디스플레이 탑재 원형 헤드' },
      { label: '텔레오퍼레이션', value: '모션 캡처 기반 전신 원격 조작, 저지연 매핑' },
      { label: '확장', value: '비전 시스템, 12-DoF 덱스터러스 핸드 등 모듈식 업그레이드' }
    ],
    features: [
      '전신 텔레오퍼레이션으로 데이터 수집·원격 작업에 최적화',
      '내구성 높은 하드 쉘, 산업 현장 실증에 적합',
      'GR-3와 동일한 플랫폼·SDK 공유',
      '모듈식 센서·핸드 업그레이드'
    ],
    applications: ['연구 · 데이터 수집', '고위험 · 원격 작업', '산업 PoC (조립 · 검사)', '재활 훈련 보조'],
    editions: [
      { name: 'GR-3C 표준형 (하드 쉘)', base: { amount: 85000, currency: 'USD' }, factor: 1.1, basis: 'published', ref: '해외 공식 리셀러 판매가 US$85,000 기준' },
      { name: '텔레오퍼레이션 데이터 수집 패키지', note: 'VR 헤드셋 · 카메라 · 12-DoF 핸드 구성, 견적' }
    ],
    priceNote: '※ 제조사 공식 판매가 미공개. 해외 리셀러 판매가 기준 환산 참고가입니다.',
    sources: [
      { label: 'GR-3C 공개 (Sina, 2025.09)', url: 'https://finance.sina.com.cn/tech/digi/2025-09-24/doc-infrqprp1717510.shtml' },
      { label: '리셀러 가격 (Robotopian)', url: 'https://robotopian.com/products/fourier-gr-3c-humanoid-robot' }
    ],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'gr-2',
    code: 'GR-2',
    name: 'Fourier GR-2',
    series: 'GR 시리즈',
    category: 'humanoid',
    subcategory: '풀사이즈 휴머노이드 · 범용 · 연구',
    tagline: '175 cm, 53 DoF의 범용 풀사이즈 휴머노이드. FSA 2.0 액추에이터와 촉각 핸드, 오픈 소프트웨어 플랫폼을 갖춘 연구·산업 표준 모델.',
    description: [
      'GR-2는 2024년 9월 공개된 Fourier의 2세대 풀사이즈 휴머노이드입니다. 7종의 FSA 2.0 액추에이터(최대 토크 380 N·m 이상)를 적용해 관절 출력과 내구성을 높였고, 직렬 관절 구조와 내장 배선으로 정비성을 개선했습니다.',
      '양손에는 12-DoF 덱스터러스 핸드와 6개의 어레이형 촉각 센서가 탑재되어 물체의 힘·형상·재질을 실시간으로 감지하며 파지력을 조절합니다. 탈착식 배터리는 GR-1 대비 2배 용량으로 약 2시간 연속 구동을 지원합니다.',
      'GR-2 오픈 소프트웨어 플랫폼은 NVIDIA Isaac Lab, ROS, MuJoCo와 호환되며, 직접 명령·리드스루·VR 텔레오퍼레이션 등 다양한 방식으로 로봇을 제어할 수 있어 대학·연구소의 로코모션·매니퓰레이션·모방학습 연구에 널리 사용됩니다.'
    ],
    launch: '2024.09',
    status: 'shipping',
    featured: true,
    icon: 'humanoid',
    accent: '#2563eb',
    keywords: ['GR2', '범용', '연구용', 'isaac', 'ros'],
    specs: [
      { label: '신장 / 중량', value: '175 cm / 63 kg', short: '175 cm · 63 kg' },
      { label: '자유도', value: '총 53 DoF (바디 29 + 12-DoF 핸드 ×2)', short: '53 DoF' },
      { label: '가반하중', value: '편측 팔 3 kg', short: '팔 3 kg' },
      { label: '액추에이터', value: 'FSA 2.0 7종, 최대 토크 380 N·m 이상' },
      { label: '배터리', value: '탈착·교체식, GR-1 대비 2배 용량, 연속 구동 약 2시간' },
      { label: '핸드 · 촉각', value: '12-DoF 덱스터러스 핸드, 어레이형 촉각 센서 6개 (힘·형상·재질 감지)' },
      { label: '센서', value: '카메라, 뎁스 센서, 힘 센서' },
      { label: '소프트웨어', value: 'GR-2 오픈 플랫폼: NVIDIA Isaac Lab · ROS · MuJoCo 호환, 직접 명령 · 리드스루 · VR 텔레오퍼레이션' }
    ],
    features: [
      'FSA 2.0 액추에이터로 GR-1 대비 출력·내구성 향상',
      '촉각 센서 내장 12-DoF 핸드로 정밀 매니퓰레이션',
      'Isaac Lab · ROS · MuJoCo 호환 오픈 소프트웨어 플랫폼',
      '리드스루 · VR 텔레오퍼레이션으로 모방학습 데이터 수집',
      '탈착식 배터리, 직렬 관절 구조로 정비 용이'
    ],
    applications: ['대학 · 연구소 휴머노이드 연구', '산업 파일럿 · PoC', '재활 · 헬스케어 연구', '전시 · 데모'],
    editions: [
      { name: 'GR-2 표준형 (12-DoF 촉각 핸드 포함)', base: { amount: 125000, currency: 'USD' }, factor: 1.1, basis: 'published', ref: '해외 공식 리셀러 판매가 US$125,000 기준' },
      { name: '연구 · 교육기관 패키지 (SDK 워크숍 포함)', note: '기관 할인 적용, 개발자 교육 2일 포함' }
    ],
    priceNote: '※ 제조사 공식 판매가 미공개. 해외 리셀러 판매가(US$125,000) 기준 환산 참고가이며, 일부 매체는 US$150,000 이상으로 추정합니다.',
    sources: [
      { label: 'GR-2 출시 (The Robot Report)', url: 'https://www.therobotreport.com/fourier-launches-gr-2-humanoid-software-platform/' },
      { label: '리셀러 가격 (Robotix Market)', url: 'https://robotixmarket.com/products/fourier-gr-2-humanoid-robot' }
    ],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'gr-1',
    code: 'GR-1',
    name: 'Fourier GR-1',
    series: 'GR 시리즈',
    category: 'humanoid',
    subcategory: '풀사이즈 휴머노이드 · 1세대 · 한정 공급',
    tagline: '2023년 중국 최초로 양산된 풀사이즈 휴머노이드. GR-2·GR-3로 세대 교체되었으며 연구용 한정 공급 및 SDK 지원이 유지됩니다.',
    description: [
      'GR-1은 2023년 7월 WAIC에서 공개되고 같은 해 말 양산에 들어간 Fourier의 1세대 풀사이즈 휴머노이드입니다. 자체 개발한 FSA 1.0 액추에이터(최대 토크 300 N·m)를 적용해 최대 5 km/h 보행과 최대 50 kg 운반이 가능하며, 2024년 10월까지 100대 이상이 연구·교육기관에 공급되었습니다.',
      'GR1T1 / GR1T2 두 가지 하드웨어 버전이 있으며, 6-DoF·11-DoF 핸드 또는 그리퍼 옵션을 선택할 수 있습니다. 현재는 GR-2·GR-3로 세대 교체되어 재고·주문 상황에 따라 한정 공급되며, 기존 도입 기관을 위한 SDK·텔레오퍼레이션 지원은 계속됩니다.'
    ],
    launch: '2023.07',
    status: 'limited',
    featured: false,
    icon: 'humanoid',
    accent: '#475569',
    keywords: ['GR1', '1세대', 'legacy'],
    specs: [
      { label: '신장 / 중량', value: '165 cm / 55 kg', short: '165 cm · 55 kg' },
      { label: '자유도', value: '바디 40 DoF (핸드 포함 최대 44)', short: '40 DoF' },
      { label: '보행 속도', value: '최대 5 km/h', short: '5 km/h' },
      { label: '운반 하중', value: '최대 50 kg' },
      { label: '액추에이터', value: 'FSA 1.0, 최대 관절 토크 300 N·m' },
      { label: '핸드 옵션', value: '6-DoF / 11-DoF 덱스터러스 핸드 또는 Fourier 그리퍼' },
      { label: '버전', value: 'GR1T1, GR1T2 (절대 엔코더 버전 포함)' }
    ],
    features: [
      '중국 최초 양산 풀사이즈 휴머노이드 (2023)',
      'GR-2 · N1과 동일한 SDK · 시뮬레이션 · 텔레오퍼레이션 스택 지원',
      '연구·교육용 레퍼런스 플랫폼으로 100대 이상 공급 실적'
    ],
    applications: ['연구 · 교육', '기존 도입 기관 추가 도입 · 부품'],
    editions: [
      { name: 'GR-1 T2 (연구용, 재고 · 주문 상황에 따라 한정 공급)', note: 'GR-2 · GR-3 대체 도입 권장' }
    ],
    priceNote: '※ 세대 교체 모델로 공식 판매가가 없으며, 재고 및 제조사 생산 여부에 따라 개별 견적으로 안내합니다.',
    sources: [
      { label: 'GR-1 양산 발표 (The Robot Report)', url: 'https://www.therobotreport.com/fourier-intelligence-launches-production-version-of-gr-1-humanoid-robot/' }
    ],
    leadTime: '재고 · 생산 여부 확인 후 안내',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'n1',
    code: 'N1',
    name: 'Fourier N1',
    series: 'N 시리즈 · 오픈소스',
    category: 'humanoid',
    subcategory: '컴팩트 휴머노이드 · 오픈소스',
    tagline: '1.3 m, 38 kg의 완전 오픈소스 휴머노이드. BOM·CAD·조립 가이드·기본 SW가 공개되어 연구·교육용으로 가장 접근성이 높은 플랫폼.',
    description: [
      'N1은 2025년 4월 Fourier가 "Nexus 오픈소스 생태계" 이니셔티브의 일환으로 공개한 컴팩트 휴머노이드입니다. 부품 목록(BOM), 가공 가능한 도면·CAD, 조립 가이드, 기본 운용 소프트웨어와 통신 인터페이스가 GitHub와 클라우드 드라이브를 통해 공개되어 있어, 완제품 도입은 물론 자체 제작·개조 연구에도 활용할 수 있습니다.',
      'FSA 2.0 액추에이터(최대 96 N·m)와 알루미늄 합금·엔지니어링 플라스틱 구조로 최대 3.5 m/s 주행, 15~20° 경사와 20 cm 계단 등반, 엎드린 자세에서의 기립이 가능하며, 1,000시간 이상의 야외 지형 테스트와 72시간 연속 구동 검증을 거쳤습니다.',
      '후면 교체식 배터리로 2시간 이상 연속 구동하며, 강화학습·모방학습 알고리즘 개발과 로봇공학 교육 커리큘럼에 적합한 가격대의 플랫폼입니다.'
    ],
    launch: '2025.04',
    status: 'opensource',
    featured: true,
    icon: 'compact',
    accent: '#0ea5e9',
    keywords: ['오픈소스', 'open source', '교육용', '소형', 'nexus'],
    specs: [
      { label: '신장 / 중량', value: '130 cm / 38 kg', short: '130 cm · 38 kg' },
      { label: '자유도', value: '23 DoF (다리 6×2, 허리 1, 팔 5×2)', short: '23 DoF' },
      { label: '최대 주행 속도', value: '3.5 m/s', short: '3.5 m/s' },
      { label: '최대 관절 토크', value: '96 N·m (FSA 2.0)' },
      { label: '지형 성능', value: '경사 15~20°, 계단 20 cm, 엎드린 자세에서 기립' },
      { label: '배터리', value: '후면 교체식, 연속 구동 2시간 이상' },
      { label: '구조', value: '알루미늄 합금 + 엔지니어링 플라스틱' },
      { label: '오픈소스 범위', value: 'BOM, CAD · 도면, 조립 가이드, 기본 운용 SW, 통신 인터페이스 (GitHub FFTAI)' }
    ],
    features: [
      '하드웨어 설계 전체 공개 — 자체 제작·개조·교육 커리큘럼 활용',
      '3.5 m/s 주행, 경사·계단·기립 등 검증된 로코모션',
      'FSA 2.0 액추에이터, 72시간 연속 구동 검증',
      'Wiki-GRx 시뮬레이션(Isaac Lab · MuJoCo) 및 RL 학습 환경 제공',
      '연구실 단위 도입이 가능한 가격대'
    ],
    applications: ['대학 · 연구소 알고리즘 연구', '로봇공학 교육', 'RL · 모방학습 개발', '경진대회 · 데모'],
    editions: [
      { name: 'N1 완제품 (조립 완료 플랫폼)', base: { amount: 40000, currency: 'USD' }, factor: 1.1, basis: 'published', ref: '해외 공식 리셀러 판매가 US$40,000 기준', note: '조립 · 캘리브레이션 완료, 배터리 · 충전기 포함' },
      { name: 'N1 오픈소스 설계 자료 (BOM · CAD · SW)', free: true, note: 'GitHub FFTAI 공개, 라이선스 조건 준수' },
      { name: 'N1 부품 키트 (FSA 액추에이터 · 구조물)', note: '자체 조립용, 구성에 따라 견적' }
    ],
    priceNote: '※ 제조사는 N1 완제품의 공식 가격을 공개하지 않았으며(DIY 키트부터 완제품까지 구성별 상이), 해외 리셀러 판매가(US$40,000) 기준 환산 참고가입니다.',
    sources: [
      { label: 'N1 오픈소스 (GitHub FFTAI)', url: 'https://github.com/FFTAI/fourier-grx-N1' },
      { label: 'N1 출시 (Humanoids Daily)', url: 'https://www.humanoidsdaily.com/news/fourier-intelligence-launches-n1-humanoid-robot-with-open-source-strategy' },
      { label: '리셀러 가격 (Robotopian)', url: 'https://robotopian.com/products/fourier-n1-humanoid-robot' }
    ],
    leadTime: '계약 후 6~10주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'grw',
    code: 'GRW',
    name: 'Fourier GRW',
    series: 'GR 시리즈 · 휠 플랫폼',
    category: 'humanoid',
    subcategory: '휠 기반 양팔 로봇 · 물류 · 제조 · 돌봄',
    tagline: '2026년 7월 WAIC에서 공개된 Fourier 최초의 휠 기반 양팔 로봇. 16 kg 가반하중, 4시간 구동, 노코드 툴체인으로 물류·제조·돌봄 현장 투입용.',
    description: [
      'GRW는 Fourier가 2026년 7월 세계인공지능대회(WAIC)에서 발표한 첫 휠 기반 양팔 매니퓰레이터입니다. 720×618 mm의 좁은 풋프린트와 1,160~1,650 mm의 가변 높이, 585 mm의 좁은 어깨 폭과 긴 팔로 협소한 작업 공간에서도 약 2 m의 작업 반경을 확보합니다.',
      '엔드이펙터 제외 29 DoF, 최대 16 kg의 안정 가반하중을 제공하며 그리퍼·석션 컵·덱스터러스 핸드를 교체 장착할 수 있습니다. 핫스왑 배터리로 4시간 연속 구동하며, 다층 안전 설계와 노코드 소프트웨어 툴체인, 다중 로봇 협업 기능이 기본 제공됩니다.'
    ],
    launch: '2026.07',
    status: 'preorder',
    featured: true,
    icon: 'wheel',
    accent: '#6366f1',
    keywords: ['휠', 'wheeled', '양팔', '물류', '제조', '매니퓰레이터'],
    specs: [
      { label: '크기', value: '720 × 618 × 1,160~1,650 mm (가변 높이)', short: '가변 높이 1.16~1.65 m' },
      { label: '중량', value: '약 160 kg' },
      { label: '자유도', value: '29 DoF (엔드이펙터 제외)', short: '29 DoF' },
      { label: '가반하중', value: '최대 16 kg (안정 하중)', short: '가반 16 kg' },
      { label: '작업 반경', value: '약 2 m, 어깨 폭 585 mm' },
      { label: '엔드이펙터', value: '그리퍼 · 석션 컵 · 덱스터러스 핸드 교체 장착' },
      { label: '배터리', value: '핫스왑, 연속 구동 4시간' },
      { label: '소프트웨어', value: '노코드 툴체인, 다중 로봇 협업, 다층 안전 시스템' }
    ],
    features: [
      '협소 공간에 최적화된 좁은 어깨 · 긴 팔 설계',
      '16 kg 가반하중, 교체형 엔드이펙터',
      '노코드 작업 정의 툴체인으로 빠른 현장 적용',
      '핫스왑 배터리 4시간 구동, 다중 로봇 협업'
    ],
    applications: ['창고 · 물류', '제조 · 조립', '요양 · 돌봄 보조', '연구 · PoC'],
    editions: [
      { name: 'GRW 표준 구성 (그리퍼)', note: '2026년 7월 발표 신제품, 출시가 · 납기 제조사 확정 후 안내' },
      { name: 'GRW 덱스터러스 핸드 구성', note: '12-DoF 핸드 ×2, 견적' }
    ],
    priceNote: '※ 2026년 7월 발표된 신제품으로 제조사 공식 가격과 납기가 아직 확정되지 않았습니다. 사전 예약 접수 중이며, 확정 즉시 가격표에 반영합니다.',
    sources: [
      { label: 'GRW 발표 (IT之家, 2026.07)', url: 'https://www.ithome.com/0/978/489.htm' },
      { label: 'WAIC 2026 신제품 (投资界)', url: 'https://news.pedaily.cn/202607/566499.shtml' }
    ],
    leadTime: '제조사 출시 일정에 따름 (사전 예약)',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'gr-mini',
    code: 'GR MINI',
    name: 'Fourier GR Mini',
    series: 'GR 시리즈 · 컴팩트',
    category: 'humanoid',
    subcategory: '소형 이족 휴머노이드 · 안내 · 서비스',
    tagline: 'GR-3와 GR Nano 사이에 위치하는 소형 이족 휴머노이드. 자연어 대화와 표정 모션으로 전시 안내·리테일·요양 교감 서비스에 적합.',
    description: [
      'GR Mini는 2026년 7월 WAIC에서 GRW, GR Nano와 함께 공개된 소형 이족 휴머노이드로, GR-3의 캐릭터 디자인("고양이 머리" 패밀리)을 계승합니다. 자연어 대화, 표정과 몸짓을 결합한 표현 모션, 자율 이동 기능을 갖추어 전시장 안내, 리테일, 관광·공연, 요양기관 교감 서비스 등 공공 서비스 시나리오를 목표로 합니다.',
      '상세 사양(신장·중량·자유도)과 가격은 제조사 발표 예정이며, Fourier 하드웨어 오픈 플랫폼에 GR Mini T1 튜토리얼이 포함되어 개발 환경이 준비되고 있습니다.'
    ],
    launch: '2026.07',
    status: 'preorder',
    featured: false,
    icon: 'compact',
    accent: '#8b5cf6',
    keywords: ['mini', '소형', '안내', '리테일', '서비스'],
    specs: [
      { label: '형태', value: '소형 이족 휴머노이드 (GR-3 · GR Nano 사이 체급)', short: '소형 이족' },
      { label: '인터랙션', value: '자연어 대화, 표정 · 제스처 모션', short: '대화 · 표정' },
      { label: '이동', value: '자율 이동', short: '자율 이동' },
      { label: '개발 환경', value: 'FourierHardwareOpen (GR Mini T1 튜토리얼)' },
      { label: '상세 사양', value: '제조사 공식 발표 예정' }
    ],
    features: [
      'GR-3 캐릭터 디자인 계승, 친근한 외형',
      '공공 서비스 · 리테일 · 관광 시나리오 특화',
      'Fourier 공통 SDK 생태계 지원'
    ],
    applications: ['전시 · 안내', '리테일', '관광 · 공연', '요양 · 교감'],
    editions: [
      { name: 'GR Mini 표준형', note: '2026년 7월 발표 신제품, 출시가 · 사양 제조사 확정 후 안내' }
    ],
    priceNote: '※ 제조사 공식 가격·사양 미확정. 사전 예약 접수 중입니다.',
    sources: [
      { label: 'WAIC 2026 신제품 (投资界)', url: 'https://news.pedaily.cn/202607/566499.shtml' }
    ],
    leadTime: '제조사 출시 일정에 따름 (사전 예약)',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'gr-nano',
    code: 'GR NANO',
    name: 'Fourier GR Nano',
    series: 'GR 시리즈 · 데스크톱',
    category: 'humanoid',
    subcategory: '데스크톱 교감 로봇 · 개인용',
    tagline: 'GR-3 캐릭터 IP 기반의 데스크톱 교감 로봇. 터치에 반응하는 감정 상태와 전용 앱을 갖춘 개인·소매용 모델로 2026년 내 출시 목표.',
    description: [
      'GR Nano는 GR-3의 "고양이 머리" IP를 데스크톱 크기로 축소한 정서 교감 로봇입니다. 터치에 반응해 감정 상태가 변하고, 전용 컴패니언 앱으로 로봇의 기분을 확인할 수 있습니다. Fourier는 2026년 내 판매 개시를 목표로 하고 있으며, 개인 소비자와 교육·리테일 시장을 겨냥합니다.',
      '기업·기관 단위의 대량 구매(기념품, 교육 키트, 로비 비치용)와 커스텀 브랜딩은 UIG를 통해 협의하실 수 있습니다.'
    ],
    launch: '2026.07',
    status: 'preorder',
    featured: false,
    icon: 'compact',
    accent: '#a855f7',
    keywords: ['nano', '데스크톱', '교감', '개인용', '컴패니언'],
    specs: [
      { label: '형태', value: '데스크톱 사이즈 교감 로봇', short: '데스크톱' },
      { label: '인터랙션', value: '터치 반응 감정 상태, 표정 표현', short: '터치 · 감정' },
      { label: '앱', value: '전용 컴패니언 앱 (기분 · 상태 확인)', short: '전용 앱' },
      { label: '출시', value: '2026년 내 판매 개시 목표' }
    ],
    features: [
      'GR-3 캐릭터 IP 기반 정서 교감',
      '개인 · 교육 · 리테일용 합리적 가격대 예상',
      '기관 대량 구매 · 커스텀 브랜딩 협의 가능'
    ],
    applications: ['개인 · 가정', '교육 키트', '리테일 · 로비 비치', '기념품 · 프로모션'],
    editions: [
      { name: 'GR Nano', note: '2026년 내 출시 목표, 가격 제조사 확정 후 안내' }
    ],
    priceNote: '※ 제조사 공식 가격 미확정. 사전 예약 접수 중입니다.',
    sources: [
      { label: 'GR Nano 발표 (Sina, 2026.07)', url: 'https://finance.sina.com.cn/stock/csjzbj/2026-07-19/doc-iniiifmm0317116.shtml' }
    ],
    leadTime: '제조사 출시 일정에 따름 (사전 예약)',
    warranty: '본체 12개월 (제조사 표준)'
  },

  /* ================================================================
     핵심 부품 · 개발 플랫폼
     ================================================================ */
  {
    id: 'fdh-6',
    code: 'FDH-6',
    name: 'Fourier FDH-6 덱스터러스 핸드',
    series: '덱스터러스 핸드',
    category: 'component',
    subcategory: '6-DoF 로봇 핸드 · 단품 판매',
    tagline: '6 DoF · 11관절 · 515 g의 경량 덱스터러스 핸드. 0.5 mm 반복 정밀도와 30만 회 내구성, 이더넷 SDK로 로봇 팔·연구 플랫폼에 바로 통합.',
    description: [
      'FDH-6는 2025년 11월 출시된 Fourier의 단품 판매용 6자유도 덱스터러스 핸드입니다. 코어리스 모터와 링크 구동 방식으로 위치·속도 제어를 지원하며, 손끝 반복 정밀도 0.5 mm, 30만 회 사이클 내구성을 갖추었습니다. 실리콘 핑거 패드로 파지 안정성을 높였고, UDP/이더넷 기반 SDK(Python)로 다양한 로봇 팔과 연구 플랫폼에 손쉽게 통합할 수 있습니다.',
      'Fourier 휴머노이드 라인업 중 유일하게 제조사 공식 소비자가(CNY 4,999)가 공개된 제품으로, 매니퓰레이션 연구·교육용 핸드로 가성비가 높습니다.'
    ],
    launch: '2025.11',
    status: 'shipping',
    featured: false,
    icon: 'hand',
    accent: '#0ea5b7',
    keywords: ['핸드', 'hand', '그리퍼', '6dof', '덱스터러스'],
    specs: [
      { label: '자유도 / 관절', value: '6 DoF / 11 관절', short: '6 DoF · 11관절' },
      { label: '중량', value: '515 g', short: '515 g' },
      { label: '반복 정밀도', value: '손끝 0.5 mm', short: '정밀도 0.5 mm' },
      { label: '구동', value: '코어리스 모터 + 링크 구동, 위치 · 속도 제어' },
      { label: '내구성', value: '300,000 사이클' },
      { label: '핑거 패드', value: '실리콘' },
      { label: '통신 · SDK', value: 'UDP / 이더넷, Python SDK (GitHub fourier_dexhand_sdk)' }
    ],
    features: [
      '제조사 공식 소비자가 공개 (CNY 4,999)',
      '경량 515 g, 로봇 팔 엔드이펙터로 즉시 적용',
      '오픈 SDK로 ROS · 연구 스택 통합 용이',
      '좌 · 우 핸드 선택 가능'
    ],
    applications: ['매니퓰레이션 연구', '로봇 팔 엔드이펙터', '교육용 키트', '텔레오퍼레이션'],
    editions: [
      { name: 'FDH-6 (좌 또는 우, 1개)', base: { amount: 4999, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '제조사 공식 소비자가 CNY 4,999 기준' },
      { name: 'FDH-6 페어 (좌 + 우)', base: { amount: 9998, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '제조사 공식 소비자가 CNY 4,999 × 2 기준' }
    ],
    priceNote: '※ 제조사 공식 소비자가(CNY 4,999)를 기준 환율로 환산하고 수입·운송 비용을 반영한 참고가입니다. 10개 이상 구매 시 별도 할인.',
    sources: [
      { label: 'FDH-6 출시 · 가격 (IT之家, 2025.11)', url: 'https://www.ithome.com/0/896/535.htm' },
      { label: 'FDH-6 SDK (GitHub)', url: 'https://github.com/FFTAI/fourier_dexhand_sdk' }
    ],
    leadTime: '재고 보유 시 2~4주',
    warranty: '12개월'
  },

  {
    id: 'fdh-12',
    code: 'FDH-12',
    name: 'Fourier 12-DoF 촉각 덱스터러스 핸드',
    series: '덱스터러스 핸드',
    category: 'component',
    subcategory: '12-DoF 촉각 핸드 · GR-2 / GR-3 탑재',
    tagline: 'GR-2·GR-3에 탑재되는 12자유도 촉각 핸드. 6개 어레이형 촉각 센서로 힘·형상·재질을 감지하며 파지력을 실시간 조절.',
    description: [
      '12-DoF 촉각 덱스터러스 핸드는 2024년 GR-2와 함께 도입된 Fourier의 상위 핸드 모듈로, GR-2·GR-3·GR-3C에 기본 탑재됩니다. 손가락에 배치된 6개의 어레이형 촉각 센서가 접촉 힘·형상·재질을 감지하고, 파지력을 실시간으로 조절해 깨지기 쉬운 물체도 안정적으로 다룰 수 있습니다.',
      'Fourier 텔레오퍼레이션 스택(F.A.R.T.S.)에서 "Fourier 12 DOF dexterous hand"로 지원되어 VR 기반 원격 조작과 모방학습 데이터 수집에 활용됩니다. 기존 GR 시리즈 업그레이드용 또는 연구용 단품 공급은 견적으로 안내합니다.'
    ],
    launch: '2024.09',
    status: 'shipping',
    featured: false,
    icon: 'hand',
    accent: '#14b8a6',
    keywords: ['12dof', '촉각', 'tactile', '핸드', '업그레이드'],
    specs: [
      { label: '자유도', value: '12 DoF (핸드당)', short: '12 DoF' },
      { label: '촉각 센서', value: '어레이형 촉각 센서 6개 (힘 · 형상 · 재질 감지)', short: '촉각 센서 6개' },
      { label: '탑재 모델', value: 'GR-2, GR-3, GR-3C 기본 탑재', short: 'GR-2/3 탑재' },
      { label: '텔레오퍼레이션', value: 'F.A.R.T.S. 스택 지원 (Vision Pro · Quest)' }
    ],
    features: [
      '실시간 파지력 조절로 섬세한 물체 취급',
      'GR 시리즈 업그레이드 · 예비 부품으로 공급',
      '텔레오퍼레이션 · 모방학습 데이터 수집 지원'
    ],
    applications: ['GR 시리즈 업그레이드 · 교체', '매니퓰레이션 연구', '텔레오퍼레이션'],
    editions: [
      { name: '12-DoF 촉각 핸드 (단품 · 업그레이드용)', note: 'GR 시리즈 호환 여부 확인 후 견적' }
    ],
    priceNote: '※ 단품 판매가 미공개. 기존 GR 시리즈 업그레이드 및 연구용 공급은 개별 견적으로 안내합니다.',
    sources: [
      { label: 'GR-2 촉각 핸드 (TechEBlog)', url: 'https://www.techeblog.com/new-fourier-gr-2-humanoid-robot-upgrade/' }
    ],
    leadTime: '주문 후 6~8주',
    warranty: '12개월'
  },

  {
    id: 'fsa',
    code: 'FSA',
    name: 'Fourier FSA 액추에이터 (FSA 1.0 / 2.0)',
    series: '액추에이터 · 관절 모듈',
    category: 'component',
    subcategory: '일체형 스마트 액추에이터',
    tagline: '모터·드라이버·감속기·엔코더 일체형 관절 모듈. GR-2·N1에 적용된 FSA 2.0은 7종 토크 등급, 최대 380 N·m 이상.',
    description: [
      'FSA(Fourier Smart Actuator)는 Fourier가 휴머노이드용으로 자체 개발한 일체형 관절 모듈입니다. 모터, 드라이버, 감속기, 엔코더를 하나의 하우징에 통합해 배선과 정비를 단순화했으며, 48 V DC 전원과 이더넷/UDP 제어 인터페이스를 사용합니다.',
      'GR-1에 적용된 FSA 1.0(최대 300 N·m)에 이어 GR-2·N1에는 7종 토크 등급의 FSA 2.0(최대 380 N·m 이상, N1 관절 최대 96 N·m)이 적용되었습니다. 감속비 7~120의 다양한 구성이 문서화되어 있으며, 공개 SDK(fourier_actuator_sdk)로 자체 로봇 개발에 활용할 수 있습니다. 단품 공급은 수량·구성에 따라 견적으로 안내합니다.'
    ],
    launch: '2023 / 2024',
    status: 'shipping',
    featured: false,
    icon: 'actuator',
    accent: '#0891b2',
    keywords: ['액추에이터', 'actuator', '관절', '모터', 'fsa'],
    specs: [
      { label: '구성', value: '모터 + 드라이버 + 감속기 + 엔코더 일체형', short: '일체형 모듈' },
      { label: 'FSA 2.0 토크', value: '7종 등급, 최대 380 N·m 이상 (N1 관절 96 N·m)', short: '최대 380 N·m+' },
      { label: 'FSA 1.0 토크', value: '최대 300 N·m (GR-1)' },
      { label: '감속비', value: '7 / 30 / 36 / 50 / 70 / 80 / 100 / 120', short: '감속비 7~120' },
      { label: '전원 · 통신', value: '48 V DC, 이더넷 / UDP' },
      { label: 'SDK', value: 'fourier_actuator_sdk (GitHub), FSA 문서 (fftai.github.io/fsa)' }
    ],
    features: [
      '휴머노이드 실전 검증을 거친 고토크 일체형 관절',
      '7종 토크 등급으로 다양한 관절 설계 대응',
      '공개 SDK · 문서로 자체 로봇 개발 지원',
      'N1 오픈소스 설계와 호환'
    ],
    applications: ['자체 휴머노이드 · 레그 로봇 개발', 'N1 자체 제작', '연구용 액추에이터 테스트베드', 'GR 시리즈 예비 부품'],
    editions: [
      { name: 'FSA 2.0 (토크 등급별 단품)', note: '등급 · 수량에 따라 견적' },
      { name: 'FSA 1.0 (GR-1 예비 부품)', note: '기존 GR-1 도입 기관용' }
    ],
    priceNote: '※ 단품 판매가 미공개. 등급·수량·납기에 따라 개별 견적으로 안내합니다.',
    sources: [
      { label: 'FSA 액추에이터 문서', url: 'https://fftai.github.io/fsa/fsa/' },
      { label: 'FSA SDK (GitHub)', url: 'https://github.com/FFTAI/fourier_actuator_sdk' }
    ],
    leadTime: '주문 후 6~10주',
    warranty: '12개월'
  },

  {
    id: 'software',
    code: 'SDK',
    name: 'Fourier 소프트웨어 · 개발 플랫폼',
    series: '소프트웨어 · 데이터',
    category: 'component',
    subcategory: 'SDK · 시뮬레이션 · 텔레오퍼레이션 · 데이터셋',
    tagline: 'Aurora SDK, RoCS, Wiki-GRx 시뮬레이션, F.A.R.T.S. 텔레오퍼레이션, ActionNet 데이터셋. 대부분 오픈소스로 제공되며 UIG가 온보딩을 지원.',
    description: [
      'Fourier는 휴머노이드 개발에 필요한 소프트웨어 스택을 대부분 오픈소스로 공개합니다. Aurora SDK(Apache 2.0, C++17/Python)와 RoCS 제어 시스템으로 로봇을 제어하고, Wiki-GRx로 URDF/MJCF 모델과 Isaac Gym/Lab · MuJoCo · Gazebo · Webots 시뮬레이션 환경을 구성할 수 있습니다.',
      'F.A.R.T.S. 텔레오퍼레이션 시스템은 Apple Vision Pro(Quest 2 지원)와 OAK/RealSense/ZED 카메라로 GR 시리즈를 원격 조작하고 모방학습·VLA용 데이터를 기록합니다. ActionNet 데이터셋은 3만 개 이상의 양손 조작 궤적(약 140시간)을 VLM 자동 주석과 함께 무상 제공합니다.',
      'UIG는 제품 도입 시 개발 환경 세팅, 시뮬레이션 구축, 텔레오퍼레이션 장비 구성, 개발자 워크숍을 함께 제공합니다.'
    ],
    launch: '2024 ~ 2026',
    status: 'opensource',
    featured: false,
    icon: 'platform',
    accent: '#06b6d4',
    keywords: ['sdk', 'ros', 'isaac', 'mujoco', '시뮬레이션', '텔레오퍼레이션', '데이터셋', 'actionnet', 'aurora'],
    specs: [
      { label: 'Aurora SDK', value: 'C++17 / Python, FourierDDS 기반, Apache 2.0 (GR-3)', short: 'Aurora SDK' },
      { label: 'RoCS', value: '로봇 제어 시스템 + Control App + 클라이언트 SDK', short: 'RoCS 제어' },
      { label: 'Wiki-GRx', value: 'URDF / MJCF 모델, Isaac Gym · Isaac Lab · MuJoCo · Gazebo · Webots', short: '시뮬레이션' },
      { label: 'F.A.R.T.S.', value: '텔레오퍼레이션: Vision Pro · Quest 2, OAK / RealSense / ZED / USB 카메라, 데이터 기록' },
      { label: 'ActionNet', value: '30K+ 양손 조작 궤적 (~140 h), VLM 자동 주석, 무상 공개' },
      { label: 'FourierHardwareOpen', value: 'Docker 튜토리얼 (GR1T2 · GR2T2 · GR Mini T1 · Fourier Hand)' }
    ],
    features: [
      '대부분 오픈소스 · 무상 — 라이선스 비용 없이 시작',
      'Isaac Lab · MuJoCo 등 주류 시뮬레이터 지원',
      'VR 텔레오퍼레이션으로 모방학습 데이터 수집',
      'UIG 온보딩: 환경 세팅 · 워크숍 · 기술 문의 대행'
    ],
    applications: ['RL · 모방학습 연구', '시뮬레이션 기반 개발', '데이터 수집 · VLA', '교육 커리큘럼'],
    editions: [
      { name: '오픈소스 SDK · 시뮬레이션 · 데이터셋', free: true, note: 'GitHub FFTAI, action-net.org' },
      { name: '텔레오퍼레이션 장비 패키지 (VR 헤드셋 · 카메라 · 워크스테이션)', note: '구성에 따라 견적' },
      { name: 'UIG 개발자 워크숍 (2일)', note: '제품 도입 시 옵션, 견적' }
    ],
    priceNote: '※ 소프트웨어는 제조사 라이선스 조건에 따라 무상 제공되며, 장비 패키지와 교육은 별도 견적입니다.',
    sources: [
      { label: 'Fourier GitHub (FFTAI)', url: 'https://github.com/FFTAI' },
      { label: 'ActionNet 데이터셋', url: 'https://action-net.org/' },
      { label: '텔레오퍼레이션 (GitHub)', url: 'https://github.com/FFTAI/teleoperation' }
    ],
    leadTime: '즉시 (오픈소스) / 장비 패키지 4~6주',
    warranty: '장비 12개월'
  },

  /* ================================================================
     재활 · 의료 로봇 (Fourier Rehab)
     ================================================================ */
  {
    id: 'exomotus-m4',
    code: 'M4',
    name: 'ExoMotus™ M4 하지 외골격 로봇',
    series: 'ExoMotus 시리즈',
    category: 'rehab',
    subcategory: '하지 외골격 · 보행 · 균형 훈련',
    tagline: '착용형 하지 외골격과 4륜 밸런스 지지 프레임이 결합된 Fourier Rehab의 플래그십 보행 재활 로봇. 수동·보조·능동·저항 4가지 훈련 모드.',
    description: [
      'ExoMotus M4는 뇌졸중, 척수손상, 외상성 뇌손상, 다발성 경화증, 소아 뇌성마비 환자의 보행·균형 훈련을 위한 하지 외골격 로봇입니다. 착용형 외골격(약 40 kg)과 저마찰 4륜 지지 프레임(약 100 kg)으로 구성되어 병원 복도와 일반 승강기에서도 이동·훈련이 가능하며, 세팅 시간은 약 5분입니다.',
      '자체 개발 서보 모터와 다차원 힘 센서가 환자의 의도를 감지해 수동 · 보조 · 능동 · 저항 모드로 훈련하며, 보폭 · 발 높이 · 속도 · 가이드 힘 · 신장 · 골반 폭을 개별 환자에 맞게 조절합니다. 2025년 11월 MEDICA에서 VR 훈련 패키지(M4 + VR)가 추가되었고, 2026년 GReAT Summit에서 신형 액추에이터·제어 업그레이드가 공개되었습니다.',
      '중국 NMPA 등록(보행·균형 기능 훈련 평가 시스템)과 CE 인증을 보유하며, 국내 의료기기 허가 현황은 문의 시 안내드립니다.'
    ],
    launch: '2020',
    status: 'shipping',
    featured: true,
    icon: 'exo',
    accent: '#15a35a',
    keywords: ['외골격', 'exoskeleton', '보행', '하지', '재활', 'M4'],
    specs: [
      { label: '구성', value: '착용형 하지 외골격 + 4륜 밸런스 지지 프레임', short: '외골격 + 지지 프레임' },
      { label: '중량', value: '외골격 약 40 kg, 지지 프레임 약 100 kg' },
      { label: '훈련 모드', value: '수동 · 보조 · 능동 · 저항', short: '4가지 훈련 모드' },
      { label: '조절 항목', value: '보폭, 발 높이, 속도, 가이드 힘, 신장, 골반 폭' },
      { label: '센서 · 구동', value: '다차원 힘 센서, 자체 개발 서보 모터 · 모션 컨트롤러' },
      { label: '세팅 시간', value: '약 5분', short: '세팅 5분' },
      { label: '적응증', value: '뇌졸중, 척수손상, 외상성 뇌손상, 다발성 경화증, 소아 뇌성마비' },
      { label: '인증', value: '중국 NMPA 등록, CE (국내 허가 현황 문의)' }
    ],
    features: [
      '외골격 + 이동식 지지 프레임 일체 설계로 별도 트레드밀 불필요',
      '환자 의도 감지 기반 보조(assist-as-needed) 제어',
      '보폭 · 속도 · 가이드 힘 등 세밀한 개인화',
      'VR 훈련 패키지 및 2026년형 액추에이터 업그레이드',
      'iF 디자인 어워드 2022 수상'
    ],
    applications: ['재활병원 · 재활의학과', '척수손상 · 뇌졸중 센터', '요양병원', '연구'],
    editions: [
      { name: 'ExoMotus M4 표준형', base: { amount: 1175000, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '중국 공공조달 낙찰가 CNY 1,175,000 (2024.12) 기준', note: '외골격 + 지지 프레임 + 제어 태블릿' },
      { name: 'ExoMotus M4 + VR 훈련 패키지', note: 'VR 헤드셋 · 훈련 콘텐츠 포함, 견적' }
    ],
    priceNote: '※ 중국 내 병원 공공조달 낙찰가(2024년 12월, 대당 CNY 1,175,000)를 기준 환율로 환산하고 수입·설치·교육 비용을 반영한 참고가입니다.',
    sources: [
      { label: 'ExoMotus M4 (Exoskeleton Report)', url: 'https://exoskeletonreport.com/product/exomotus-m4/' },
      { label: '외골격 가격 조사 (Exoskeleton Index)', url: 'https://exoskeletonindex.com/exoskeleton-prices/' },
      { label: 'GReAT Summit 2026 업데이트', url: 'https://exoskeletonreport.com/2026/05/fourier-rehabs-great-summit-2026-highlights-rehabilitation-robotics-exomotus-m4-updates-and-new-global-partnerships/' }
    ],
    leadTime: '계약 후 10~14주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'armmotus-m2-pro',
    code: 'M2 PRO',
    name: 'ArmMotus™ M2 Pro 상지 재활 로봇',
    series: 'ArmMotus 시리즈',
    category: 'rehab',
    subcategory: '상지 · 평면 엔드이펙터 · 8가지 훈련 모드',
    tagline: '힘 피드백 기반 상지(어깨·팔꿈치) 재활 로봇. 8가지 훈련 모드와 자동 평가 리포트, 게임형 과제로 병원·클리닉·소아 재활에 널리 사용.',
    description: [
      'ArmMotus M2 Pro는 2016년 중국 최초의 힘 피드백 상지 재활 로봇으로 출시된 Fourier M2의 3세대 올인원 모델입니다. 고정밀 힘·위치 센서가 환자의 움직임을 감지해 필요한 만큼만 보조(assist-as-needed)하며, 운동 제어 · 등척성 · 관절 집중 · 편측 · 인지 · 동적 근력 · 복합 기능 · 양측 등 8가지 훈련 모드를 제공합니다.',
      '지능형 평가 기능이 관절 가동 범위, 근력, 협응 등을 측정해 리포트를 자동 생성하고, 게임형 과제로 환자의 참여도를 높입니다. 중국 NMPA Class II, CE MDR Class II 인증과 미국 FDA 등록을 보유하며, 소아용 M2K 모델도 공급됩니다.'
    ],
    launch: '2020',
    status: 'shipping',
    featured: true,
    icon: 'arm',
    accent: '#16a34a',
    keywords: ['상지', '팔', 'upper limb', 'M2', '재활', '소아'],
    specs: [
      { label: '훈련 부위', value: '상지 (어깨 · 팔꿈치), 테이블탑 2D 작업 공간', short: '상지 · 2D' },
      { label: '제어', value: '고정밀 힘 · 위치 센서, assist-as-needed 힘 피드백', short: '힘 피드백' },
      { label: '훈련 모드', value: '8종 (운동 제어, 등척성, 관절 집중, 편측, 인지, 동적 근력, 복합 기능, 양측)', short: '8가지 모드' },
      { label: '평가', value: '지능형 평가 및 자동 리포트 생성' },
      { label: '콘텐츠', value: '게임형 훈련 과제 라이브러리' },
      { label: '인증', value: '중국 NMPA Class II, CE MDR Class II, 미국 FDA 등록' },
      { label: '변형 모델', value: 'M2K (소아용)' }
    ],
    features: [
      '올인원 설계로 설치 공간 최소화',
      '8가지 훈련 모드 · 자동 평가 리포트',
      '게임형 과제로 높은 훈련 몰입도',
      'NMPA · CE MDR · FDA 등록 다중 인증',
      '성인 · 소아 모델 선택'
    ],
    applications: ['재활병원 · 재활의학과', '클리닉 · 물리치료실', '소아 재활', '요양병원'],
    editions: [
      { name: 'ArmMotus M2 Pro (성인용)', base: { amount: 368000, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '중국 공공조달 낙찰가 CNY 368,000 (2023.10) 기준' },
      { name: 'ArmMotus M2K (소아용)', note: '소아 전용 구성, 견적' }
    ],
    priceNote: '※ 중국 내 병원 공공조달 낙찰가(2023년 10월, 대당 CNY 368,000)를 기준 환율로 환산하고 수입·설치·교육 비용을 반영한 참고가입니다.',
    sources: [
      { label: 'ArmMotus M2 Pro (Thor Assistive)', url: 'https://thortechnologies.co.uk/product/armmotus-m2-pro/' },
      { label: 'M2 Pro 제품 정보 (MedicalExpo)', url: 'https://www.medicalexpo.com/prod/shanghai-fuliye-intelligent-technology/product-304765-1033574.html' }
    ],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'armmotus-emu',
    code: 'EMU',
    name: 'ArmMotus™ EMU 3D 상지 재활 로봇',
    series: 'ArmMotus 시리즈',
    category: 'rehab',
    subcategory: '상지 · 3D 케이블 구동 엔드이펙터',
    tagline: '멜버른대학교와 공동 개발한 3차원 상지 재활 로봇. 케이블 구동과 카본 평행 링크로 낮은 관성, 중력 보상과 햅틱 피드백 제공.',
    description: [
      'ArmMotus EMU는 2021년 출시된 3차원 상지 재활 로봇으로, 이중 알루미늄 캡스턴 케이블 구동과 카본 파이버 평행 링크 구조로 낮은 관성과 마찰을 구현했습니다. 백드라이버블 엔드이펙터가 3D 공간에서 환자의 팔을 자유롭게 보조·저항하며, 중력 보상과 햅틱 피드백으로 실제 일상 동작에 가까운 훈련을 제공합니다.',
      'iF · Red Dot 디자인 어워드를 수상했으며 CE MDR Class II 인증을 보유합니다. 미국 Brooks Rehabilitation, 영국 STEPS Rehabilitation, 일본 나고야대학 등에 도입되어 임상 및 연구에 활용되고 있습니다.'
    ],
    launch: '2021.07',
    status: 'shipping',
    featured: false,
    icon: 'arm',
    accent: '#22c55e',
    keywords: ['3D', '상지', 'EMU', '케이블', '멜버른'],
    specs: [
      { label: '훈련 부위', value: '상지 3차원 작업 공간', short: '상지 · 3D' },
      { label: '구동', value: '이중 알루미늄 캡스턴 케이블 구동 + 카본 파이버 평행 링크', short: '케이블 구동' },
      { label: '제어', value: '백드라이버블 엔드이펙터, 중력 보상, 햅틱 피드백, 3D 보조 · 저항 조절', short: '중력 보상 · 햅틱' },
      { label: '콘텐츠', value: '게임형 훈련 과제' },
      { label: '인증', value: 'CE MDR Class II' },
      { label: '수상', value: 'iF 디자인 어워드, Red Dot 디자인 어워드' }
    ],
    features: [
      '3차원 공간에서의 실제 동작 기반 훈련',
      '낮은 관성 · 마찰로 섬세한 힘 제어',
      '멜버른대학교 공동 개발, 해외 주요 재활센터 도입',
      'M2 Pro와 병행 운용으로 상지 재활 단계별 커버'
    ],
    applications: ['재활병원', '신경 재활 센터', '연구 (임상 · 로봇 재활)'],
    editions: [
      { name: 'ArmMotus EMU 표준형', note: '공개 가격 없음, 견적' }
    ],
    priceNote: '※ 제조사·조달 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [
      { label: 'EMU 출시 (EIN Presswire, 2021)', url: 'https://www.einnews.com/pr_news/552213182/' }
    ],
    leadTime: '계약 후 10~14주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'anklemotus-m1a',
    code: 'M1A',
    name: 'AnkleMotus™ M1A 발목 재활 로봇',
    series: 'Motus M1 시리즈',
    category: 'rehab',
    subcategory: '발목 단일 관절 · 평가 · 훈련',
    tagline: '발목 관절의 가동 범위·근력·반응 속도를 측정하고 게임형 훈련을 제공하는 단일 관절 재활 로봇.',
    description: [
      'AnkleMotus M1A는 힘·위치 센서를 갖춘 발목 관절 전용 재활 로봇입니다. 관절 가동 범위(ROM), 근력, 인지, 반응 시간을 정량 측정하고, 게임 라이브러리를 통해 발목 배측·저측 굴곡 등 훈련을 재미있게 수행할 수 있습니다. CE MDR Class II 인증을 보유하며, 성인은 물론 소아 재활(Fourier Education 라인)에도 적용됩니다.'
    ],
    launch: '2021',
    status: 'shipping',
    featured: false,
    icon: 'walk',
    accent: '#059669',
    keywords: ['발목', 'ankle', 'M1', '단일 관절'],
    specs: [
      { label: '훈련 부위', value: '발목 관절', short: '발목' },
      { label: '센서', value: '힘 · 위치 센서', short: '힘 · 위치 센서' },
      { label: '평가', value: 'ROM, 근력, 인지, 반응 시간', short: 'ROM · 근력 평가' },
      { label: '콘텐츠', value: '게임 라이브러리' },
      { label: '인증', value: 'CE MDR Class II' }
    ],
    features: ['발목 기능 정량 평가', '게임형 훈련으로 순응도 향상', '성인 · 소아 겸용'],
    applications: ['재활병원', '정형외과 · 스포츠 재활', '소아 재활'],
    editions: [{ name: 'AnkleMotus M1A', note: '공개 가격 없음, 견적' }],
    priceNote: '※ 제조사·조달 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'AnkleMotus M1A (Fourier 공식)', url: 'https://www.fftai.com/products-anklemotus-m1a' }],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'wristmotus-m1w',
    code: 'M1W',
    name: 'WristMotus™ M1W 손목 재활 로봇',
    series: 'Motus M1 시리즈',
    category: 'rehab',
    subcategory: '손목 단일 관절 · 교체형 핸들',
    tagline: '교체형 핸들로 손목 굴곡·신전·회내·회외 훈련과 평가를 지원하는 단일 관절 재활 로봇.',
    description: [
      'WristMotus M1W는 손목 관절 전용 재활 로봇으로, 힘·위치 센서를 통해 ROM · 근력 · 인지 · 반응 시간을 측정하고 게임형 훈련을 제공합니다. 교체형 핸들로 다양한 손 크기와 훈련 동작(굴곡 · 신전 · 회내 · 회외)에 대응하며 CE MDR Class II 인증을 보유합니다.'
    ],
    launch: '2021',
    status: 'shipping',
    featured: false,
    icon: 'glove',
    accent: '#10b981',
    keywords: ['손목', 'wrist', 'M1', '단일 관절'],
    specs: [
      { label: '훈련 부위', value: '손목 관절 (굴곡 · 신전 · 회내 · 회외)', short: '손목' },
      { label: '센서', value: '힘 · 위치 센서', short: '힘 · 위치 센서' },
      { label: '평가', value: 'ROM, 근력, 인지, 반응 시간', short: 'ROM · 근력 평가' },
      { label: '핸들', value: '교체형 핸들' },
      { label: '인증', value: 'CE MDR Class II' }
    ],
    features: ['손목 기능 정량 평가', '교체형 핸들로 다양한 훈련 동작', '게임형 훈련'],
    applications: ['재활병원', '수부 재활 · 작업치료', '정형외과'],
    editions: [{ name: 'WristMotus M1W', note: '공개 가격 없음, 견적' }],
    priceNote: '※ 제조사·조달 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'WristMotus M1W (Fourier 공식)', url: 'https://www.fftai.com/products-wristmotus-m1w' }],
    leadTime: '계약 후 8~12주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'cyclemotus',
    code: 'CYCLE',
    name: 'CycleMotus™ 시리즈 사이클 트레이너',
    series: 'CycleMotus 시리즈',
    category: 'rehab',
    subcategory: '능동 · 수동 사이클 트레이너 (A4 · A4K · B2L · H1)',
    tagline: '좌식 상·하지 트레이너 A4, 소아용 A4K, 침상용 B2L, 가정용 경량 페달 트레이너 H1까지 병원부터 가정까지 이어지는 사이클 재활 라인업.',
    description: [
      'CycleMotus 시리즈는 수동 · 보조 · 능동 · 저항 모드를 지원하는 능동-수동 사이클 트레이너 라인업입니다. A4는 터치스크린을 갖춘 좌식 상·하지 트레이너, A4K는 소아용 버전, B2L은 침상(와위) 환자용 하지 트레이너입니다.',
      'H1은 퇴원 후 가정 재활을 위한 경량 전동 페달 트레이너로 7단 속도(5~60 rpm), 12단 저항, 3~30분 타이머와 태블릿 게임을 지원합니다. 병원에서 가정까지 이어지는 연속 재활 프로그램을 구성할 수 있습니다.'
    ],
    launch: '2020 ~',
    status: 'shipping',
    featured: false,
    icon: 'cycle',
    accent: '#65a30d',
    keywords: ['사이클', 'cycle', '페달', '가정용', '침상', '소아'],
    specs: [
      { label: 'A4', value: '좌식 상 · 하지 사이클 트레이너, 터치스크린, 수동 · 보조 · 능동 · 저항', short: 'A4 상 · 하지' },
      { label: 'A4K', value: '소아용 사이클 트레이너', short: 'A4K 소아용' },
      { label: 'B2L', value: '침상(와위) 하지 트레이너, 성인용', short: 'B2L 침상용' },
      { label: 'H1', value: '가정용 경량 전동 페달 트레이너: 7단 속도 5~60 rpm, 12단 저항, 3~30분, 태블릿 게임' }
    ],
    features: ['병원 · 침상 · 가정을 잇는 라인업', '수동 · 보조 · 능동 · 저항 4모드', '게임형 콘텐츠로 훈련 동기 부여'],
    applications: ['재활병원 · 요양병원', '중환자 · 침상 환자', '가정 재활', '소아 재활'],
    editions: [
      { name: 'CycleMotus A4 (좌식 상 · 하지)', note: '공개 가격 없음, 견적' },
      { name: 'CycleMotus A4K (소아용)', note: '견적' },
      { name: 'CycleMotus B2L (침상용 하지)', note: '견적' },
      { name: 'CycleMotus 가정용 페달 트레이너', base: { amount: 580, currency: 'USD' }, factor: 1.25, basis: 'published', ref: '싱가포르 소매가 S$750 (≈US$580) 기준' }
    ],
    priceNote: '※ A4 · A4K · B2L은 공개 가격이 없어 견적으로 안내하며, 가정용 페달 트레이너는 해외 소매가 기준 환산 참고가입니다.',
    sources: [
      { label: 'CycleMotus A4K (MedicalExpo)', url: 'https://www.medicalexpo.com/prod/shanghai-fuliye-intelligent-technology/product-304765-1154129.html' },
      { label: 'CycleMotus H1 (Healthlink)', url: 'https://www.healthlinkholdings.com/products/bike/fourier-intelligence-cyclemotus-h1' },
      { label: '가정용 페달 트레이너 소매가 (Fu Kang Healthcare)', url: 'https://rehabshop.com.sg/cyclemotus-intelligent-multi-functional-pedal-bike' }
    ],
    leadTime: '재고 보유 시 4~6주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'metamotus-galileo',
    code: 'GALILEO',
    name: 'MetaMotus™ Galileo 생체역학 분석 · 훈련 시스템',
    series: 'MetaMotus 시리즈',
    category: 'rehab',
    subcategory: '6-DoF 모션 플랫폼 · 힘판 · 혼합현실',
    tagline: '6자유도 모션 플랫폼, 6축 힘판, LED 링 스크린, 적응형 트레드밀을 통합한 국가급 재활센터 · 스포츠과학용 플래그십 플랫폼.',
    description: [
      'MetaMotus Galileo는 2023년 6월 출시된 대형 통합 생체역학 분석 · 훈련 시스템입니다. 6자유도 모션 플랫폼 위에 6축 힘판과 적응형 트레드밀, 동적 체중 지지 장치를 결합하고 LED 플렉시블 링 스크린과 모션 캡처로 혼합현실 시나리오를 구현해 균형 · 보행 · 반응 훈련을 수행합니다.',
      '말레이시아 PERKESO 국가 재활센터, 미국 HealthTech Partners Global 공급 라인업의 플래그십으로, 국가급 재활센터 · 대학병원 · 스포츠과학 연구소에 적합합니다. 설치 공간 · 전력 · 구성에 따라 개별 견적으로 안내합니다.'
    ],
    launch: '2023.06',
    status: 'shipping',
    featured: false,
    icon: 'balance',
    accent: '#0d9488',
    keywords: ['갈릴레오', 'galileo', '균형', '힘판', '트레드밀', '혼합현실', '스포츠'],
    specs: [
      { label: '모션 플랫폼', value: '6-DoF 모션 플랫폼', short: '6-DoF 플랫폼' },
      { label: '힘 측정', value: '6축 포스 플레이트', short: '6축 힘판' },
      { label: '디스플레이', value: 'LED 플렉시블 링 스크린, 혼합현실 시나리오', short: 'LED 링 스크린' },
      { label: '트레드밀', value: '적응형 트레드밀, 동적 체중 지지' },
      { label: '측정', value: '모션 캡처, 생체역학 분석' }
    ],
    features: ['균형 · 보행 · 반응을 하나의 플랫폼에서 평가 · 훈련', '몰입형 혼합현실 시나리오', '국가급 재활센터 도입 실적'],
    applications: ['국가급 · 대학병원 재활센터', '스포츠과학 · 선수 재활', '연구'],
    editions: [{ name: 'MetaMotus Galileo 시스템', note: '설치 공간 · 구성에 따라 견적' }],
    priceNote: '※ 대형 통합 시스템으로 설치 환경과 구성에 따라 개별 견적으로 안내합니다.',
    sources: [{ label: 'Galileo 출시 (Tencent News, 2023)', url: 'https://news.qq.com/rain/a/20230612A08IXA00' }],
    leadTime: '계약 후 16~24주 (설치 공사 포함)',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'rehabhub',
    code: 'REHABHUB',
    name: 'RehabHub™ 통합 재활 솔루션 + InfinityNet',
    series: '통합 플랫폼',
    category: 'rehab',
    subcategory: '재활과 통합 구축 · 데이터 네트워크',
    tagline: '30종 이상의 Fourier 재활 장비를 EHR과 연동해 하나의 재활과로 구축하는 통합 솔루션. GR-3 휴머노이드와 BCI 훈련까지 확장.',
    description: [
      'RehabHub는 2020년 출시된 Fourier Rehab의 통합 재활 솔루션으로, 상지 · 하지 · 손 · 균형 · 사이클 등 30종 이상의 장비를 병원 EHR과 연동해 평가-훈련-리포트 흐름을 표준화합니다. 중국 내 300개 이상의 재활과에 구축되었으며, 2025년에는 GR-3 휴머노이드를 통합한 "구현지능 재활 허브", 2026년에는 뇌-기계 인터페이스(BCI) 폐루프 훈련이 추가되었습니다.',
      'InfinityNet(2025년 11월 MEDICA 공개)은 모든 RehabHub 장비의 데이터를 안전하게 동기화하는 클라우드 데이터 네트워크입니다. UIG는 재활과 신설 · 리모델링 시 장비 구성, 공간 설계, 임상 프로토콜 교육을 포함한 턴키 구축을 지원합니다.'
    ],
    launch: '2020',
    status: 'shipping',
    featured: false,
    icon: 'hub',
    accent: '#0f766e',
    keywords: ['통합', '재활과', '턴키', 'EHR', '데이터', 'BCI', 'infinitynet'],
    specs: [
      { label: '연동 장비', value: '30종 이상 Fourier 재활 장비', short: '30종+ 장비 연동' },
      { label: '데이터', value: 'EHR 연동, InfinityNet 클라우드 동기화', short: 'EHR · 클라우드' },
      { label: '확장', value: 'GR-3 휴머노이드 통합 (2025), BCI 폐루프 훈련 (2026)', short: '휴머노이드 · BCI' },
      { label: '실적', value: '중국 내 300개 이상 재활과 구축, 말레이시아 PERKESO 국가 재활센터' }
    ],
    features: ['재활과 전체를 하나의 데이터 흐름으로 표준화', '장비 · 공간 · 교육을 포함한 턴키 구축', '휴머노이드 · BCI 등 최신 기술 확장'],
    applications: ['재활병원 신설 · 리모델링', '대학병원 재활의학과', '국가 · 지자체 재활센터'],
    editions: [
      { name: 'RehabHub 재활과 구축 패키지 (장비 구성별)', note: '구성에 따라 수억 ~ 수십억 원, 견적' },
      { name: 'InfinityNet 데이터 네트워크', note: '장비 수 · 라이선스 기준 견적' }
    ],
    priceNote: '※ 장비 구성과 규모에 따라 개별 견적으로 안내합니다. (참고: 말레이시아 PERKESO 국가 재활센터 프로젝트는 수십억 원 규모로 보도)',
    sources: [
      { label: 'RehabHub 사양서 (v1.0)', url: 'https://portalimages.blob.core.windows.net/products/pdfs/gqxefmtz_200121_RehabHub_SD_v1.0.pdf' },
      { label: 'MEDICA 2025 (Healthcare in Europe)', url: 'https://healthcare-in-europe.com/en/news/fourier-robotic-rehabilitation-medica-2025.html' }
    ],
    leadTime: '구축 규모에 따라 3~9개월',
    warranty: '장비별 12개월'
  },

  {
    id: 'otparvos',
    code: 'OTPARVOS',
    name: 'OTParvos™ / OTParvos™ Pro 디지털 작업치료 시스템',
    series: 'OTParvos 시리즈',
    category: 'rehab',
    subcategory: '작업치료 · 인지 훈련',
    tagline: '전자기 센서와 LED 어레이, AI를 결합한 휴대형 디지털 작업치료 트레이너. 2026년 대형 터치스크린 Pro 모델 출시.',
    description: [
      'OTParvos는 전자기 센서, LED 어레이, AI 분석을 결합한 휴대형 디지털 작업치료(OT) 트레이너로 상지 운동 제어, 소근육, 눈-손 협응, 인지 기능을 평가 · 훈련합니다. 2026년 5월 GReAT Summit에서 공개된 OTParvos Pro는 대형 터치스크린과 인지 · 비판적 사고 · 눈-손 협응 · 평가 모듈을 갖춘 상위 모델입니다. 소아용 OTParvos Small은 Fourier Education 라인으로 공급됩니다.'
    ],
    launch: '2023 / 2026.05 (Pro)',
    status: 'shipping',
    featured: false,
    icon: 'platform',
    accent: '#0284c7',
    keywords: ['작업치료', 'OT', '인지', '소근육', 'otparvos'],
    specs: [
      { label: 'OTParvos', value: '휴대형, 전자기 센서 + LED 어레이 + AI, 상지 운동 제어 · 소근육 · 눈-손 협응 · 인지', short: '휴대형 OT 트레이너' },
      { label: 'OTParvos Pro', value: '대형 터치스크린, 인지 · 비판적 사고 · 눈-손 협응 · 평가 모듈 (2026.05)', short: 'Pro: 대형 터치스크린' },
      { label: 'OTParvos Small', value: '소아용 (Fourier Education)', short: 'Small: 소아용' }
    ],
    features: ['작업치료실 디지털 전환', 'AI 기반 정량 평가', '성인 · 소아 · Pro 라인업'],
    applications: ['작업치료실', '인지 재활 · 치매 센터', '소아 발달 센터'],
    editions: [
      { name: 'OTParvos', note: '견적' },
      { name: 'OTParvos Pro', note: '2026년 5월 출시, 견적' },
      { name: 'OTParvos Small (소아용)', note: '견적' }
    ],
    priceNote: '※ 제조사 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'OTParvos (Healthlink)', url: 'https://www.healthlinkholdings.com/products/cognitive-rehabilitation/fourier-otparvos/' }],
    leadTime: '계약 후 6~10주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'dualmotus',
    code: 'DUALMOTUS',
    name: 'DualMotus™ 다지(多肢) 로봇 재활 시스템',
    series: 'DualMotus',
    category: 'rehab',
    subcategory: '양측 상 · 하지 통합 로봇 · 신제품',
    tagline: '2025년 11월 MEDICA에서 공개된 양측 상·하지 통합 로봇 재활 시스템. 뇌졸중 · 신경계 · 정형외과 환자용 신제품.',
    description: [
      'DualMotus는 2025년 11월 MEDICA에서 처음 공개된 Fourier Rehab의 다지(multi-limb) 로봇 재활 시스템으로, 양측 상지 · 하지를 하나의 시스템에서 훈련합니다. 뇌졸중, 신경계 질환, 정형외과 환자를 대상으로 하며, 상세 사양과 가격은 제조사 확정 후 안내드립니다.'
    ],
    launch: '2025.11',
    status: 'new',
    featured: false,
    icon: 'arm',
    accent: '#7c3aed',
    keywords: ['양측', '다지', 'dual', '신제품', 'medica'],
    specs: [
      { label: '훈련 부위', value: '양측 상지 · 하지 (다지 통합)', short: '양측 상 · 하지' },
      { label: '대상', value: '뇌졸중, 신경계 질환, 정형외과 환자', short: '신경 · 정형 재활' },
      { label: '공개', value: 'MEDICA 2025 (2025.11)', short: 'MEDICA 2025 공개' },
      { label: '상세 사양', value: '제조사 확정 후 안내' }
    ],
    features: ['하나의 시스템으로 다지 훈련', '신경 · 정형 재활 통합 프로토콜'],
    applications: ['재활병원', '신경 재활 센터', '정형외과 재활'],
    editions: [{ name: 'DualMotus', note: '신제품, 사양 · 가격 제조사 확정 후 안내' }],
    priceNote: '※ 신제품으로 제조사 가격 미확정. 사전 문의 접수 중입니다.',
    sources: [{ label: 'MEDICA 2025 (Healthcare in Europe)', url: 'https://healthcare-in-europe.com/en/news/fourier-robotic-rehabilitation-medica-2025.html' }],
    leadTime: '제조사 출시 일정에 따름',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'pelmamotus',
    code: 'PELMA',
    name: 'PelmaMotus™ 족저압 평가 · 훈련 시스템',
    series: 'PelmaMotus',
    category: 'rehab',
    subcategory: '족부 · 자세 · 균형 평가',
    tagline: '대면적 압력 센서 어레이로 족부 기능 · 자세 · 균형을 평가하고 인터랙티브 훈련을 제공하는 족저압 시스템.',
    description: [
      'PelmaMotus는 대면적 압력 센서 어레이와 고속 데이터 수집, 생체역학 데이터베이스를 기반으로 족부 기능, 자세, 균형을 정량 평가하고 인터랙티브 훈련을 제공합니다. 재활병원은 물론 정형외과, 스포츠 클리닉, 족부 · 보조기 센터에서 활용됩니다.'
    ],
    launch: '2023',
    status: 'shipping',
    featured: false,
    icon: 'balance',
    accent: '#b45309',
    keywords: ['족저압', '발', '자세', '균형', 'pelma'],
    specs: [
      { label: '센서', value: '대면적 압력 센서 어레이, 고속 수집', short: '압력 센서 어레이' },
      { label: '평가', value: '족부 기능, 자세, 균형', short: '족부 · 자세 · 균형' },
      { label: '데이터', value: '생체역학 데이터베이스 기반 분석', short: '생체역학 DB' },
      { label: '훈련', value: '인터랙티브 훈련 프로그램' }
    ],
    features: ['정량적 족저압 · 균형 평가', '인터랙티브 훈련', '보조기 처방 · 스포츠 재활 활용'],
    applications: ['재활병원', '정형외과 · 족부 클리닉', '스포츠 의학', '보조기 센터'],
    editions: [{ name: 'PelmaMotus', note: '견적' }],
    priceNote: '※ 제조사 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'PelmaMotus (Polaris)', url: 'https://ptpolaris.com/product/pelmamotus/' }],
    leadTime: '계약 후 6~10주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'balancemotus',
    code: 'KINE-SIM',
    name: 'BalanceMotus™ KINE-SIM 균형 · 보행 트레이너',
    series: 'BalanceMotus',
    category: 'rehab',
    subcategory: '균형 · 낙상 위험 평가 · 훈련',
    tagline: '캐나다 KINESIQ와 공동 출시한 이중 전동 힘판 기반 균형 트레이너. 20분 디지털 균형 · 낙상 위험 평가.',
    description: [
      'BalanceMotus KINE-SIM은 2022년 3월 Fourier와 캐나다 KINESIQ가 공동 출시한 균형 · 보행 트레이너입니다. 이중 전동 포스 플레이트가 실생활 시나리오(버스 · 에스컬레이터 등)의 지면 움직임을 재현하고, 20분 디지털 평가로 균형 능력과 낙상 위험을 정량화합니다. 싱가포르 Tan Tock Seng 병원 등에서 사용 중입니다.'
    ],
    launch: '2022.03',
    status: 'shipping',
    featured: false,
    icon: 'balance',
    accent: '#c2410c',
    keywords: ['균형', 'balance', '낙상', '힘판', 'kinesiq'],
    specs: [
      { label: '구동', value: '이중 전동 포스 플레이트', short: '이중 전동 힘판' },
      { label: '시나리오', value: '실생활 지면 움직임 재현', short: '실생활 시나리오' },
      { label: '평가', value: '20분 디지털 균형 · 낙상 위험 평가', short: '20분 낙상 위험 평가' },
      { label: '파트너', value: 'KINESIQ (캐나다) 공동 개발' }
    ],
    features: ['낙상 위험 정량 평가', '실생활 시나리오 기반 균형 훈련', '노인 · 신경 재활 적용'],
    applications: ['재활병원', '노인 · 낙상 예방 센터', '신경 재활'],
    editions: [{ name: 'BalanceMotus KINE-SIM', note: '견적' }],
    priceNote: '※ 제조사 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'Fourier × KINESIQ (NR Times)', url: 'https://nrtimes.co.uk/fourier-partners-with-kinesiq-inc-fourier/' }],
    leadTime: '계약 후 10~14주',
    warranty: '본체 12개월 (제조사 표준)'
  },

  {
    id: 'fourier-education',
    code: 'KIDS',
    name: 'Fourier Education 소아 재활 라인',
    series: 'Fourier Education',
    category: 'rehab',
    subcategory: '소아 · 발달 재활 통합 라인업',
    tagline: 'StellarMotus, LumiMotus, NaviMotus, ArtMotus, OTParvos Small과 소아용 M2K · A4K · M1-A로 구성된 소아 발달 재활 라인업.',
    description: [
      'Fourier Education(傅利叶教育)은 소아 · 발달 재활에 특화된 라인업입니다. 다차원 인터랙티브 훈련 StellarMotus, 시나리오 시뮬레이션 LumiMotus, 가이드 인터랙티브 훈련 NaviMotus, 지능형 드로잉 보드 ArtMotus, 소아용 작업치료 OTParvos Small에 더해 소아용 상지 로봇 M2K, 사이클 A4K, 발목 M1-A를 조합해 소아 재활실 · 발달센터를 구성할 수 있습니다.'
    ],
    launch: '2022 ~',
    status: 'shipping',
    featured: false,
    icon: 'kit',
    accent: '#db2777',
    keywords: ['소아', '아동', '발달', 'education', 'kids', 'stellar', 'lumi', 'navi', 'art'],
    specs: [
      { label: 'StellarMotus', value: '다차원 인터랙티브 훈련', short: 'StellarMotus' },
      { label: 'LumiMotus', value: '시나리오 시뮬레이션 훈련', short: 'LumiMotus' },
      { label: 'NaviMotus', value: '가이드 인터랙티브 훈련', short: 'NaviMotus' },
      { label: 'ArtMotus', value: '지능형 드로잉 보드' },
      { label: 'OTParvos Small', value: '소아용 디지털 작업치료' },
      { label: '소아용 로봇', value: 'ArmMotus M2K, CycleMotus A4K, AnkleMotus M1-A' }
    ],
    features: ['소아 눈높이의 게임형 훈련 콘텐츠', '발달센터 · 소아재활실 턴키 구성', '성인 라인업과 동일한 데이터 플랫폼'],
    applications: ['소아 재활병원', '발달 센터', '특수학교 · 교육기관'],
    editions: [
      { name: '소아 재활실 구성 패키지', note: '장비 조합에 따라 견적' },
      { name: 'StellarMotus · LumiMotus · NaviMotus · ArtMotus 단품', note: '견적' }
    ],
    priceNote: '※ 제조사 공개 가격이 없어 개별 견적으로 안내합니다.',
    sources: [{ label: 'Fourier Education 공식', url: 'http://www.fftedu.com/' }],
    leadTime: '계약 후 8~12주',
    warranty: '장비별 12개월'
  },

  {
    id: 'x2-exops',
    code: 'X2',
    name: 'Fourier X2 연구용 외골격 + EXOPS 오픈 플랫폼',
    series: 'X 시리즈 · 연구 플랫폼',
    category: 'rehab',
    subcategory: '연구용 하지 외골격 · 오픈 플랫폼',
    tagline: '18 kg, 4개 능동 관절의 연구용 하지 외골격과 NI · maxon과 협력한 EXOPS 오픈 플랫폼. 외골격 제어 알고리즘 연구 · 교육용.',
    description: [
      'Fourier X2는 2019년 공개된 연구용 하지 외골격으로, 18 kg의 경량 구조에 고관절 · 무릎 4개의 능동 자유도를 갖추었습니다. 같은 해 National Instruments와 함께 출시한 EXOPS(Exoskeleton & Robotics Open Platform System)는 하드웨어 인터페이스와 제어 소프트웨어를 개방해 연구자가 자체 제어 알고리즘을 개발 · 검증할 수 있게 합니다.',
      '임상용은 ExoMotus M4로 세대 교체되었으나, EXOPS는 대학 · 연구소의 외골격 제어 · 인간-로봇 상호작용 연구 플랫폼으로 계속 제공됩니다. 재고 및 제조사 생산 여부에 따라 한정 공급됩니다.'
    ],
    launch: '2019',
    status: 'limited',
    featured: false,
    icon: 'exo',
    accent: '#4d7c0f',
    keywords: ['X2', 'EXOPS', '연구용', '외골격', '오픈 플랫폼', 'NI'],
    specs: [
      { label: '중량', value: '18 kg', short: '18 kg' },
      { label: '능동 자유도', value: '4 (고관절 · 무릎, 양측)', short: '능동 4 DoF' },
      { label: '플랫폼', value: 'EXOPS 오픈 플랫폼 (National Instruments 협력, maxon 파트너)', short: 'EXOPS 오픈 플랫폼' },
      { label: '용도', value: '외골격 제어 알고리즘 · 인간-로봇 상호작용 연구' }
    ],
    features: ['하드웨어 · 제어 SW 개방형 연구 플랫폼', '경량 18 kg 연구용 외골격', 'NI 기반 실시간 제어 개발 환경'],
    applications: ['대학 · 연구소 외골격 연구', '재활공학 교육', '제어 알고리즘 검증'],
    editions: [
      { name: 'X2 연구용 외골격 (플랫폼 미포함)', base: { amount: 300000, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '보도 가격 CNY 300,000~500,000 (2019~2020) 하한 기준', note: '재고 · 생산 여부 확인 후 공급' },
      { name: 'X2 + EXOPS 오픈 플랫폼 패키지', base: { amount: 800000, currency: 'CNY' }, factor: 1.25, basis: 'published', ref: '보도 가격 약 CNY 800,000 (2019~2020) 기준' }
    ],
    priceNote: '※ 2019~2020년 보도 가격을 기준으로 환산한 참고가이며, 현재 공급 가능 여부와 가격은 제조사 확인 후 견적으로 확정됩니다.',
    sources: [
      { label: 'EXOPS 발표 (Exoskeleton Report, 2019)', url: 'https://exoskeletonreport.com/2019/01/fourier-intelligence-announces-the-fourier-exoskeleton-robotics-open-platform-system-exops/' },
      { label: 'X2 가격 보도 (KrASIA)', url: 'https://kr-asia.com/robots-devices-give-patients-a-chance-to-walk-again-inside-chinas-startups' }
    ],
    leadTime: '재고 · 생산 여부 확인 후 안내',
    warranty: '본체 12개월 (제조사 표준)'
  }
];
