/* =====================================================================
   UIG 사이트 설정 — 연락처·가격 기준 등은 이 파일 한 곳만 수정하면 됩니다.
   (HTML 안의 data-cfg="키" 요소가 이 값으로 자동 채워집니다.)
   ===================================================================== */
window.UIG_CONFIG = {
  company: 'UIG',
  role: 'Fourier 공식 딜러 · Authorized Distributor (Korea)',

  /* --- 연락처 (실제 정보로 교체하세요) --- */
  email: 'sales@uig-robotics.kr',
  phone: '02-000-0000',
  phoneIntl: '+82-2-000-0000',
  address: '서울특별시 강남구 테헤란로 000, 0층',
  hours: '평일 09:00 – 18:00 (주말·공휴일 휴무)',
  bizNo: '000-00-00000',

  /* --- 가격표 기준 ---
     products.js 의 base 가격(CNY/USD)은 아래 환율로 원화 환산됩니다.
     환율을 바꾸면 사이트 전체 참고가가 자동으로 다시 계산됩니다. */
  priceDate: '2026년 9월 28일',
  fxCNY: 195,    // 1 CNY = 195 KRW
  fxUSD: 1400,   // 1 USD = 1,400 KRW

  /* --- 문의 폼 전송 방식 ---
     비워두면 방문자의 메일 앱(mailto)으로 내용이 전달됩니다.
     Formspree 등 폼 백엔드 URL을 넣으면 해당 주소로 POST 전송합니다.
     예) 'https://formspree.io/f/xxxxxxxx' */
  formEndpoint: ''
};
