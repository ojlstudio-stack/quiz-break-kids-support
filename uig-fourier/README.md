# UIG × Fourier 공식 딜러 웹사이트

Fourier(傅利叶) 휴머노이드 · 핵심 부품 · 재활 로봇 전 라인업을 소개하고, 공식 딜러 참고 가격표와 견적 문의를 제공하는 정적(Static) 웹사이트입니다. 빌드 도구 없이 HTML · CSS · JavaScript만으로 구성되어 GitHub Pages, Netlify, 일반 웹호스팅 어디에나 그대로 올릴 수 있습니다.

## 페이지 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 홈 — 히어로, 제품군, 주요 제품, UIG 강점, 도입 절차, 적용 분야, Fourier 소개 |
| `about.html` | 회사소개 — 공식 딜러십 안내, UIG 개요 · 서비스 범위, Fourier 기업 소개 · 연혁 |
| `products.html` | 제품 카탈로그 — 카테고리 필터 · 검색 (`?cat=humanoid` / `component` / `rehab`) |
| `product.html?id=…` | 제품 상세 — 개요, 특징, 사양표, 에디션별 참고가, 납기 · 보증, 참고 자료 |
| `pricing.html` | 전체 가격표 — 카테고리별 표, 가격 기준 범례, CSV 다운로드, 인쇄 · PDF 저장, 가격 정책 |
| `support.html` | 고객지원 — 보증 · A/S 절차, 설치 · 교육, 유지보수 플랜, 순정 부품, FAQ |
| `contact.html` | 문의 — 견적 · 데모 · 제휴 문의 양식 (`?product=gr-3&type=demo` 로 사전 선택 가능) |

```
uig-fourier/
├── index.html · about.html · products.html · product.html · pricing.html · support.html · contact.html
├── assets/
│   ├── css/style.css        디자인 토큰 · 레이아웃 · 컴포넌트 · 반응형 · 인쇄 스타일
│   ├── js/config.js         ★ 연락처 · 환율 · 가격 기준일 · 폼 전송 설정 (가장 먼저 수정)
│   ├── js/products.js       ★ 제품 · 사양 · 가격 데이터 (카테고리 3개, 제품 26개)
│   ├── js/main.js           공통 스크립트 (렌더링 · 가격 계산 · 필터 · 폼)
│   └── img/                 로고 · 파비콘 (SVG)
└── README.md
```

## 1. 가장 먼저 수정할 것 — `assets/js/config.js`

```js
email: 'sales@uig-robotics.kr',   // 실제 영업 이메일
phone: '02-000-0000',             // 실제 대표 번호
phoneIntl: '+82-2-000-0000',
address: '서울특별시 …',
hours: '평일 09:00 – 18:00 …',
bizNo: '000-00-00000',            // 사업자등록번호
priceDate: '2026년 9월 28일',      // 가격표 기준일
fxCNY: 195,                       // 1 CNY = ? KRW
fxUSD: 1400,                      // 1 USD = ? KRW
formEndpoint: ''                  // Formspree 등 폼 백엔드 URL (비우면 mailto)
```

HTML 안의 `data-cfg="email"` 같은 요소는 페이지 로드 시 이 값으로 자동 치환되므로, 연락처는 이 파일 한 곳만 바꾸면 모든 페이지에 반영됩니다. (HTML에 적힌 기본값은 자바스크립트가 꺼진 환경을 위한 예비 텍스트이니 함께 바꿔두면 좋습니다.)

## 2. 가격 데이터 구조 — `assets/js/products.js`

각 제품의 `editions` 배열이 가격표의 행이 됩니다.

```js
editions: [
  {
    name: 'GR-3 표준형',
    base: { amount: 100000, currency: 'USD' }, // 공개된 기준 가격
    factor: 1.1,                               // 기준가 → 국내 참고가 환산 계수
    basis: 'published',                        // 'published' | 'estimate'
    ref: '해외 공식 리셀러 판매가 US$100,000 기준',
    note: '12-DoF 핸드 ×2, 듀얼 배터리 포함'
  },
  { name: '연구기관 패키지', note: '기관 할인' }, // base·krw 없음 → "견적 문의"
  { name: '오픈소스 설계 자료', free: true }      // → "무상 · 오픈소스"
]
```

* **원화 참고가 = `base.amount` × 환율(`config.js`) × `factor`**, 자동으로 반올림됩니다. 환율만 바꾸면 사이트 전체가 다시 계산됩니다.
* `factor`는 수입 통관 · 운송 · 인증 · 설치 · 교육 비용과 딜러 마진을 반영한 계수입니다. 현재 값: 해외 리셀러 판매가(USD) 기준 **1.10**, 중국 내 조달 · 소매가(CNY) 기준 **1.25**.
* **UIG 확정 공급가를 넣으려면 `krw: 154000000` 처럼 숫자를 직접 지정**하세요. `krw`가 있으면 환율 계산을 무시하고 그 금액을 표시합니다.
* `basis`가 `'published'`면 "공개가 기준", `'estimate'`면 "UIG 예상가" 태그가 붙습니다.
* 제품 카드에는 `specs[].short`가 있는 항목 중 앞 3개가 칩으로 표시됩니다.

### 현재 가격의 근거 (2026-09-28 조사)

Fourier는 휴머노이드의 공식 판매가를 공개하지 않습니다. 사이트의 참고가는 아래 공개 자료를 기준으로 했으며, 각 제품 상세 페이지의 "참고 자료"와 `sources` 필드에 출처가 있습니다.

| 제품 | 기준 가격 | 출처 성격 |
|---|---|---|
| GR-3 | US$100,000 | 해외 리셀러 판매가 (리셀러별 US$80,000~125,000, 중국 보도 CNY 115,000~200,000+ 편차 큼) |
| GR-3C | US$85,000 | 해외 리셀러 판매가 |
| GR-2 | US$125,000 | 해외 리셀러 판매가 |
| N1 완제품 | US$40,000 | 해외 리셀러 판매가 |
| FDH-6 핸드 | CNY 4,999 | **제조사 공식 소비자가** (유일한 공식 가격) |
| ExoMotus M4 | CNY 1,175,000 | 중국 병원 공공조달 낙찰가 (2024.12) |
| ArmMotus M2 Pro | CNY 368,000 | 중국 병원 공공조달 낙찰가 (2023.10) |
| CycleMotus 가정용 페달 | S$750 (≈US$580) | 싱가포르 소매가 |
| X2 / X2 + EXOPS | CNY 300,000 / 800,000 | 2019~2020 언론 보도 |
| 그 외 (GR-1, GRW, GR Mini, GR Nano, EMU, M1A, M1W, Galileo, RehabHub, OTParvos, DualMotus, PelmaMotus, BalanceMotus, 소아 라인, FSA, 12-DoF 핸드) | — | 공개 가격 없음 → "견적 문의" |

**Fourier와 딜러 계약 후 실제 공급가를 받으면 `krw` 값으로 교체하는 것을 권장합니다.**

## 3. 제품 추가 · 수정

`window.UIG_PRODUCTS` 배열에 객체를 추가하면 카탈로그 · 가격표 · 문의 폼 선택지에 자동 반영됩니다. 필수 필드: `id`(URL용, 영문), `code`(카드 배지), `name`, `category`(`humanoid` | `component` | `rehab`), `tagline`, `editions`. 아이콘은 `icon` 필드에 `humanoid · compact · care · wheel · hand · glove · actuator · exo · arm · walk · cycle · balance · platform · kit · hub` 중 하나를 지정합니다.

## 4. 제품 이미지 교체

현재 제품 카드와 상세 페이지는 저작권 문제가 없는 선 아이콘 일러스트를 사용합니다. Fourier 딜러 미디어 킷의 공식 이미지를 받으면:

1. `assets/img/products/gr-3.jpg` 처럼 저장하고
2. `main.js`의 `productCard()`와 `initProductDetail()`에서 `icon(p.icon)` 부분을 `<img src="assets/img/products/…">`로 바꾸거나, 제품 객체에 `image` 필드를 추가해 조건부로 렌더링하면 됩니다.

## 5. 배포

* **GitHub Pages**: 저장소 Settings → Pages에서 브랜치를 선택하면 `https://<계정>.github.io/<저장소>/uig-fourier/` 에서 열립니다. 모든 링크가 상대 경로라 하위 폴더에서도 그대로 동작합니다.
* **루트로 이동 / 별도 저장소**: `uig-fourier/` 폴더 내용을 통째로 옮기면 됩니다. 별도 수정 불필요.
* **커스텀 도메인**: 저장소 루트에 `CNAME` 파일을 두고 DNS를 연결하세요.
* 문의 폼은 기본적으로 방문자의 메일 앱(mailto)을 엽니다. 서버 없이 접수함을 받으려면 [Formspree](https://formspree.io) 등에서 엔드포인트를 만들어 `config.js`의 `formEndpoint`에 넣으세요.

## 6. 게시 전 확인 사항

* **공식 딜러 표기**: "공식 딜러 / Authorized Distributor" 문구와 딜러 배지는 Fourier와의 딜러(총판) 계약이 체결된 뒤에 게시해야 합니다. 계약 전 게시는 표시 · 광고의 공정화에 관한 법률상 문제가 될 수 있습니다.
* **상표 · 이미지**: Fourier 로고와 제품 사진은 딜러 계약에 따른 사용 허락 범위 안에서만 사용하세요. 현재 사이트에는 Fourier 로고를 넣지 않았습니다.
* **의료기기 광고**: 재활 · 의료 로봇은 국내 의료기기 허가 상태와 광고 심의 규정(의료기기법)을 확인한 뒤 효능 · 효과 표현을 조정하세요.
* **가격 · 보증 · 유지보수 정책**: `pricing.html`, `support.html`의 포함 범위, 결제 조건, 보증 기간, 유지보수 플랜은 UIG 표준 정책 초안입니다. 실제 계약 조건에 맞게 수정하세요.
* **플레이스홀더**: 이메일 · 전화 · 주소 · 사업자등록번호는 모두 임시값입니다.
