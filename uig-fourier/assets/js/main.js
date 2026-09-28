/* =====================================================================
   UIG × Fourier — 공통 스크립트
   - 설정값 채우기, 내비게이션
   - 제품 카드 / 상세 / 가격표 / 문의 폼 렌더링 (assets/js/products.js 데이터 사용)
   - 가격 계산: base(CNY/USD) × 환율(config.js) × factor → 원화 참고가
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.UIG_CONFIG || {};
  var PRODUCTS = window.UIG_PRODUCTS || [];
  var CATS = window.UIG_CATEGORIES || {};
  var CAT_ORDER = Object.keys(CATS);
  var FX = { KRW: 1, CNY: Number(CFG.fxCNY) || 0, USD: Number(CFG.fxUSD) || 0 };

  /* ------------------------------------------------------------------
     helpers
     ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n) { return Number(n).toLocaleString('ko-KR'); }
  function won(n) { return n == null ? '-' : num(n) + '원'; }
  function wonCompact(n) {
    if (n == null) return '-';
    n = Number(n);
    if (n >= 1e8) {
      var eok = Math.floor(n / 1e8);
      var man = Math.round((n % 1e8) / 1e4);
      return eok + '억' + (man ? ' ' + num(man) + '만' : '') + '원';
    }
    if (n >= 1e4) return num(Math.round(n / 1e4)) + '만원';
    return num(n) + '원';
  }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function catLabel(key) { return (CATS[key] && CATS[key].label) || key; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var BASIS = {
    published: { label: '공개가 기준', cls: 'tag-blue', short: '공개 가격을 환율 · 수입비용 반영해 환산' },
    estimate: { label: 'UIG 예상가', cls: 'tag-amber', short: '공개 가격 없음 · UIG 예상' },
    free: { label: '무상 · 오픈소스', cls: 'tag-green', short: '제조사 라이선스 조건에 따라 무상' },
    quote: { label: '견적 문의', cls: 'tag-gray', short: '구성 · 수량에 따라 개별 견적' }
  };
  var STATUS = {
    shipping: { label: '판매 중', cls: 'tag-green' },
    'new': { label: '신제품', cls: 'tag-blue' },
    preorder: { label: '사전 예약', cls: 'tag-amber' },
    opensource: { label: '오픈소스', cls: 'tag-blue' },
    limited: { label: '한정 공급', cls: 'tag-amber' },
    discontinued: { label: '단종', cls: 'tag-gray' }
  };
  function tagOf(map, key) { var m = map[key]; return m ? '<span class="tag ' + m.cls + '">' + esc(m.label) + '</span>' : ''; }

  /* ------------------------------------------------------------------
     line icons (currentColor)
     ------------------------------------------------------------------ */
  var SVG_OPEN = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICONS = {
    humanoid: '<circle cx="32" cy="11" r="6"/><rect x="21" y="20" width="22" height="20" rx="5"/><path d="M21 25l-9 9 2 11"/><path d="M43 25l9 9-2 11"/><path d="M26 40l-2 16-6 4"/><path d="M38 40l2 16 6 4"/><path d="M28 28h8"/>',
    compact: '<rect x="23" y="6" width="18" height="14" rx="5"/><path d="M28 12h8"/><rect x="21" y="23" width="22" height="18" rx="5"/><path d="M21 27l-8 8 2 9"/><path d="M43 27l8 8-2 9"/><path d="M27 41l-1 13-5 4"/><path d="M37 41l1 13 5 4"/>',
    hand: '<path d="M20 36V16a3 3 0 0 1 6 0v16"/><path d="M26 30V10a3 3 0 0 1 6 0v20"/><path d="M32 30V12a3 3 0 0 1 6 0v18"/><path d="M38 33V18a3 3 0 0 1 6 0v18"/><path d="M20 36l-5-6a3 3 0 0 1 4-4l1 1"/><path d="M20 36c0 12 6 18 14 18s10-6 10-14"/>',
    glove: '<path d="M20 34V16a3 3 0 0 1 6 0v14"/><path d="M26 28V10a3 3 0 0 1 6 0v18"/><path d="M32 28V12a3 3 0 0 1 6 0v16"/><path d="M38 31V18a3 3 0 0 1 6 0v16"/><path d="M20 34l-5-6a3 3 0 0 1 4-4l1 1"/><path d="M20 34c0 10 5 16 14 16s10-5 10-12"/><path d="M18 56h30"/><path d="M22 44h20"/>',
    actuator: '<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="7"/><path d="M32 14V7M32 57v-7M14 32H7M57 32h-7"/><path d="M19 19l-4-4M49 49l-4-4M45 19l4-4M19 45l-4 4"/>',
    exo: '<path d="M20 10h24"/><path d="M22 10v18l-5 20 3 8"/><path d="M42 10v18l5 20-3 8"/><circle cx="22" cy="28" r="3"/><circle cx="42" cy="28" r="3"/><circle cx="17" cy="48" r="3"/><circle cx="47" cy="48" r="3"/><path d="M12 56h12M40 56h12"/><path d="M26 16h12"/>',
    arm: '<path d="M8 54h26"/><path d="M21 54V36"/><circle cx="21" cy="32" r="4"/><path d="M24 30l17-13"/><circle cx="44" cy="15" r="4"/><path d="M47 18l8 10"/><path d="M53 30l6-2"/><path d="M12 48h18"/>',
    cycle: '<circle cx="16" cy="44" r="10"/><circle cx="48" cy="44" r="10"/><path d="M16 44l10-20h14l8 20"/><path d="M26 24l-4-8h8"/><path d="M40 24l6-10h6"/><path d="M26 24l8 20"/>',
    walk: '<circle cx="34" cy="10" r="5"/><path d="M34 15l-4 16 8 6 4 14"/><path d="M30 31l-8 8-6 12"/><path d="M34 21l10 4 6 8"/><path d="M8 56h48"/>',
    balance: '<circle cx="32" cy="11" r="5"/><path d="M32 16v16M22 25h20M32 32l-8 14M32 32l8 14"/><path d="M10 54l44-6"/><path d="M28 58h8"/>',
    platform: '<rect x="8" y="12" width="48" height="32" rx="4"/><path d="M24 54h16M32 44v10"/><circle cx="22" cy="28" r="3"/><circle cx="42" cy="21" r="3"/><circle cx="41" cy="35" r="3"/><path d="M25 27l14-5M25 30l13 4"/>',
    kit: '<path d="M8 20l24-10 24 10-24 10z"/><path d="M8 20v22l24 10 24-10V20"/><path d="M32 30v22"/><path d="M20 15l24 10"/>',
    hub: '<rect x="8" y="8" width="20" height="20" rx="4"/><rect x="36" y="8" width="20" height="20" rx="4"/><rect x="8" y="36" width="20" height="20" rx="4"/><rect x="36" y="36" width="20" height="20" rx="4"/><path d="M28 18h8M18 28v8M46 28v8M28 46h8"/>',
    wheel: '<rect x="20" y="8" width="24" height="20" rx="6"/><path d="M26 16h12"/><rect x="18" y="30" width="28" height="16" rx="5"/><circle cx="24" cy="52" r="5"/><circle cx="40" cy="52" r="5"/><path d="M12 36l6 4M52 36l-6 4"/>',
    care: '<circle cx="32" cy="12" r="6"/><rect x="21" y="21" width="22" height="20" rx="5"/><path d="M21 26l-9 8 3 10"/><path d="M43 26l9 8-3 10"/><path d="M26 41l-2 15-5 4"/><path d="M38 41l2 15 5 4"/><path d="M32 27l-3-3a2.5 2.5 0 0 1 3-3.5 2.5 2.5 0 0 1 3 3.5z"/>'
  };
  function icon(name) { return SVG_OPEN + (ICONS[name] || ICONS.humanoid) + '</svg>'; }
  window.UIG_ICON = icon;

  /* ------------------------------------------------------------------
     price engine
     ------------------------------------------------------------------ */
  function roundKRW(v) {
    if (v >= 1e9) return Math.round(v / 1e7) * 1e7;   // 10억 이상: 천만 단위
    if (v >= 1e8) return Math.round(v / 1e6) * 1e6;   // 1억 이상: 백만 단위
    if (v >= 1e7) return Math.round(v / 1e5) * 1e5;   // 1천만 이상: 십만 단위
    if (v >= 1e6) return Math.round(v / 1e4) * 1e4;   // 1백만 이상: 만 단위
    return Math.round(v / 1e3) * 1e3;
  }
  /* 에디션의 원화 참고가: krw 지정값 > base×환율×factor > null(견적) */
  function krwOf(e) {
    if (!e) return null;
    if (typeof e.krw === 'number') return e.krw;
    if (e.base && typeof e.base.amount === 'number' && FX[e.base.currency]) {
      return roundKRW(e.base.amount * FX[e.base.currency] * (typeof e.factor === 'number' ? e.factor : 1));
    }
    return null;
  }
  function basisOf(e) {
    if (e.free) return 'free';
    if (krwOf(e) != null) return e.basis || 'estimate';
    return 'quote';
  }
  function editionPriceText(e) {
    if (e.free) return '무상 제공';
    var k = krwOf(e);
    return k == null ? '견적 문의' : won(k);
  }
  function priceInfo(p) {
    var eds = p.editions || [];
    var priced = eds.filter(function (e) { return krwOf(e) != null && !e.free; });
    if (!priced.length) {
      if (eds.some(function (e) { return e.free; })) return { text: '무상 · 오픈소스', basis: 'free', hasPrice: false };
      return { text: '견적 문의', basis: 'quote', hasPrice: false };
    }
    var min = Math.min.apply(null, priced.map(function (e) { return krwOf(e); }));
    var basis = priced.some(function (e) { return (e.basis || 'estimate') === 'published'; }) ? 'published' : 'estimate';
    return { text: wonCompact(min) + (eds.length > 1 ? '~' : ''), basis: basis, hasPrice: true, min: min };
  }
  window.UIG_PRICE = { krwOf: krwOf, priceInfo: priceInfo };

  /* ------------------------------------------------------------------
     product card
     ------------------------------------------------------------------ */
  function productCard(p) {
    var pi = priceInfo(p);
    var chips = (p.specs || []).filter(function (s) { return s.short; }).slice(0, 3).map(function (s) { return '<li>' + esc(s.short) + '</li>'; }).join('');
    var href = 'product.html?id=' + encodeURIComponent(p.id);
    return '' +
      '<article class="pcard">' +
        '<a class="pcard-media" style="--tile:' + esc(p.accent || '#1d5cff') + '" href="' + href + '" aria-label="' + esc(p.name) + '">' +
          '<span class="pcard-model">' + esc(p.code || p.name) + '</span>' +
          '<span class="pcard-status">' + tagOf(STATUS, p.status) + '</span>' +
          '<span class="pcard-icon">' + icon(p.icon) + '</span>' +
        '</a>' +
        '<div class="pcard-body">' +
          '<div class="pcard-cat">' + esc(catLabel(p.category)) + (p.subcategory ? ' · ' + esc(p.subcategory) : '') + '</div>' +
          '<h3><a href="' + href + '">' + esc(p.name) + '</a></h3>' +
          '<p class="pcard-tag">' + esc(p.tagline) + '</p>' +
          '<ul class="chips">' + chips + '</ul>' +
          '<div class="pcard-foot">' +
            '<div><span class="price-label">공식 딜러 참고가 (VAT 별도)</span>' +
              '<div class="price-line"><span class="price-value' + (pi.hasPrice ? '' : ' quote') + '">' + esc(pi.text) + '</span>' + tagOf(BASIS, pi.basis) + '</div></div>' +
            '<a class="btn btn-primary btn-sm" href="contact.html?product=' + encodeURIComponent(p.id) + '">견적</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* ------------------------------------------------------------------
     global init: config fill, nav
     ------------------------------------------------------------------ */
  function fillConfig() {
    $$('[data-cfg]').forEach(function (el) {
      var key = el.getAttribute('data-cfg');
      var v = CFG[key];
      if (v == null || v === '') return;
      el.textContent = typeof v === 'number' ? num(v) : v;
      if (el.tagName === 'A') {
        if (key === 'email') el.setAttribute('href', 'mailto:' + v);
        if (key === 'phone') el.setAttribute('href', 'tel:' + String(CFG.phoneIntl || v).replace(/[^+\d]/g, ''));
      }
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function initNav() {
    var btn = $('.nav-toggle'), nav = $('.site-nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var here = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    if (here === '') here = 'index';
    if (here === 'product') here = 'products';
    $$('.site-nav a[href]').forEach(function (a) {
      var t = a.getAttribute('href').replace(/[?#].*$/, '').replace(/\.html$/, '');
      if (t === here && !a.classList.contains('btn')) a.classList.add('active');
    });
  }

  /* ------------------------------------------------------------------
     home: featured products
     ------------------------------------------------------------------ */
  function initFeatured() {
    var box = $('#featured-products');
    if (!box) return;
    var list = PRODUCTS.filter(function (p) { return p.featured; }).slice(0, 6);
    box.innerHTML = list.map(productCard).join('') || '<div class="empty">제품 데이터를 불러오지 못했습니다.</div>';
    var cnt = $('#product-count');
    if (cnt) cnt.textContent = PRODUCTS.length;
  }

  /* ------------------------------------------------------------------
     catalog (products.html)
     ------------------------------------------------------------------ */
  function initCatalog() {
    var grid = $('#catalog-grid');
    if (!grid) return;
    var chipsBox = $('#catalog-filters'), search = $('#catalog-search'), count = $('#catalog-count');
    var state = { cat: qs('cat') || 'all', q: '' };
    if (state.cat !== 'all' && !CATS[state.cat]) state.cat = 'all';

    var chips = [{ key: 'all', label: '전체' }].concat(CAT_ORDER.map(function (k) { return { key: k, label: CATS[k].label }; }));
    chipsBox.innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip-btn' + (c.key === state.cat ? ' active' : '') + '" data-cat="' + esc(c.key) + '">' + esc(c.label) + '</button>';
    }).join('');

    function render() {
      var q = state.q.trim().toLowerCase();
      var list = PRODUCTS.filter(function (p) {
        if (state.cat !== 'all' && p.category !== state.cat) return false;
        if (!q) return true;
        var hay = [p.name, p.code, p.tagline, p.subcategory, p.series, (p.keywords || []).join(' ')].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      grid.innerHTML = list.map(productCard).join('') || '<div class="empty" style="grid-column:1/-1">조건에 맞는 제품이 없습니다.</div>';
      if (count) count.textContent = list.length + '개 제품' + (state.cat !== 'all' ? ' · ' + catLabel(state.cat) : '');
      $$('.chip-btn', chipsBox).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-cat') === state.cat); });
      var title = $('#catalog-title');
      if (title) title.textContent = state.cat === 'all' ? 'Fourier 전체 제품' : catLabel(state.cat);
      var desc = $('#catalog-desc');
      if (desc) desc.textContent = state.cat === 'all' ? 'UIG가 정식 수입 · 공급하는 Fourier 전 라인업입니다.' : (CATS[state.cat].desc || '');
    }
    chipsBox.addEventListener('click', function (e) {
      var b = e.target.closest('.chip-btn');
      if (!b) return;
      state.cat = b.getAttribute('data-cat');
      var url = new URL(location.href);
      if (state.cat === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', state.cat);
      history.replaceState(null, '', url);
      render();
    });
    if (search) search.addEventListener('input', function () { state.q = search.value; render(); });
    render();
  }

  /* ------------------------------------------------------------------
     product detail (product.html?id=...)
     ------------------------------------------------------------------ */
  function initProductDetail() {
    var root = $('#product-detail');
    if (!root) return;
    var p = byId(qs('id') || '');
    if (!p) {
      root.innerHTML = '<div class="container section"><div class="empty">제품을 찾을 수 없습니다. <a href="products.html">제품 목록으로 이동</a></div></div>';
      return;
    }
    document.title = p.name + ' | UIG · Fourier 공식 딜러';
    var pi = priceInfo(p);
    var quoteHref = 'contact.html?product=' + encodeURIComponent(p.id);

    var editionsHtml = (p.editions || []).map(function (e) {
      return '<div class="edition"><div><strong>' + esc(e.name) + '</strong>' + (e.note ? '<small>' + esc(e.note) + '</small>' : '') + '</div>' +
        '<div class="ed-price">' + esc(editionPriceText(e)) + (e.ref ? '<small>' + esc(e.ref) + '</small>' : '') + '<div>' + tagOf(BASIS, basisOf(e)) + '</div></div></div>';
    }).join('');

    var specsHtml = (p.specs || []).map(function (s) { return '<tr><th>' + esc(s.label) + '</th><td>' + esc(s.value) + '</td></tr>'; }).join('');
    var featuresHtml = (p.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    var appsHtml = (p.applications || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    var descHtml = (p.description || []).map(function (d) { return '<p>' + esc(d) + '</p>'; }).join('');
    var sourcesHtml = (p.sources || []).map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>'; }).join(' · ');
    var related = PRODUCTS.filter(function (o) { return o.category === p.category && o.id !== p.id; }).slice(0, 3);

    root.innerHTML = '' +
      '<section class="page-hero"><div class="container">' +
        '<div class="breadcrumb"><a href="index.html">홈</a> › <a href="products.html">제품</a> › <a href="products.html?cat=' + esc(p.category) + '">' + esc(catLabel(p.category)) + '</a> › ' + esc(p.name) + '</div>' +
        '<div class="eyebrow">' + esc(p.series || catLabel(p.category)) + '</div>' +
        '<h1>' + esc(p.name) + '</h1>' +
        '<p>' + esc(p.tagline) + '</p>' +
        '<div class="mt-2" style="display:flex;gap:8px;flex-wrap:wrap">' + tagOf(STATUS, p.status) + (p.launch ? '<span class="tag" style="background:rgba(255,255,255,.12);color:#fff">출시 ' + esc(p.launch) + '</span>' : '') + (p.subcategory ? '<span class="tag" style="background:rgba(255,255,255,.12);color:#fff">' + esc(p.subcategory) + '</span>' : '') + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="container"><div class="detail-grid">' +
        '<div>' +
          '<div class="detail-hero-visual" style="--tile:' + esc(p.accent || '#1d5cff') + '">' + icon(p.icon) + '<span class="note">제품 이미지: 제조사 공식 미디어 킷 이미지로 교체 예정</span></div>' +
          '<h2>제품 개요</h2>' + descHtml +
          (featuresHtml ? '<h3 class="mt-4">주요 특징</h3><ul class="feature-list">' + featuresHtml + '</ul>' : '') +
          (appsHtml ? '<h3 class="mt-4">주요 적용 분야</h3><ul class="chips">' + appsHtml + '</ul>' : '') +
          (specsHtml ? '<h3 class="mt-4">주요 사양</h3><table class="specs-table">' + specsHtml + '</table>' : '') +
          (p.priceNote ? '<p class="mt-3 muted" style="font-size:14px">' + esc(p.priceNote) + '</p>' : '') +
          (sourcesHtml ? '<p class="sources mt-3">참고 자료: ' + sourcesHtml + '</p>' : '') +
        '</div>' +
        '<aside>' +
          '<div class="price-card">' +
            '<div class="price-card-head"><span class="price-label">공식 딜러 참고가 (VAT 별도)</span><span class="price-value">' + esc(pi.text) + '</span><div class="mt-1">' + tagOf(BASIS, pi.basis) + '</div></div>' +
            '<div class="price-card-body">' +
              (editionsHtml ? '<div>' + editionsHtml + '</div>' : '') +
              '<table class="kv mt-2">' +
                (p.leadTime ? '<tr><th>납기</th><td>' + esc(p.leadTime) + '</td></tr>' : '') +
                (p.warranty ? '<tr><th>보증</th><td>' + esc(p.warranty) + '</td></tr>' : '') +
                '<tr><th>포함</th><td>본체 · 기본 구성품, 수입 통관, 국내 운송 · 설치, 기본 운용 교육</td></tr>' +
                '<tr><th>기준</th><td>' + esc(CFG.priceDate || '') + ' · 1 CNY = ' + num(FX.CNY) + '원 · 1 USD = ' + num(FX.USD) + '원</td></tr>' +
              '</table>' +
              '<div class="mt-3" style="display:grid;gap:10px">' +
                '<a class="btn btn-primary btn-block" href="' + quoteHref + '">견적 요청</a>' +
                '<a class="btn btn-outline btn-block" href="' + quoteHref + '&type=demo">데모 · 시연 신청</a>' +
                '<a class="btn btn-outline btn-block" href="pricing.html#' + esc(p.category) + '">전체 가격표 보기</a>' +
              '</div>' +
              '<p class="form-note mt-2">참고가는 환율 · 옵션 · 수량 · 설치 조건에 따라 달라질 수 있으며, 정식 견적서로 확정됩니다.</p>' +
            '</div>' +
          '</div>' +
        '</aside>' +
      '</div>' +
      (related.length ? '<div class="mt-4"><div class="section-head row"><div><div class="eyebrow">Related</div><h2>함께 보는 제품</h2></div><a class="btn btn-outline" href="products.html?cat=' + esc(p.category) + '">' + esc(catLabel(p.category)) + ' 전체 보기</a></div><div class="pgrid">' + related.map(productCard).join('') + '</div></div>' : '') +
      '</div></section>';
  }

  /* ------------------------------------------------------------------
     price list (pricing.html)
     ------------------------------------------------------------------ */
  function initPricing() {
    var root = $('#price-tables');
    if (!root) return;

    var html = '';
    CAT_ORDER.forEach(function (key) {
      var list = PRODUCTS.filter(function (p) { return p.category === key; });
      if (!list.length) return;
      var rows = '';
      list.forEach(function (p) {
        var eds = p.editions && p.editions.length ? p.editions : [{ name: '기본 구성' }];
        var specSummary = (p.specs || []).filter(function (s) { return s.short; }).slice(0, 4).map(function (s) { return s.short; }).join(' · ');
        eds.forEach(function (e, i) {
          rows += '<tr>' +
            (i === 0 ? '<td class="pname" rowspan="' + eds.length + '"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a><small>' + esc(p.subcategory || '') + '</small></td>' : '') +
            '<td>' + esc(e.name) + (e.note ? '<br><small>' + esc(e.note) + '</small>' : '') + '</td>' +
            (i === 0 ? '<td class="spec-summary" rowspan="' + eds.length + '">' + esc(specSummary) + '</td>' : '') +
            '<td class="pprice">' + esc(editionPriceText(e)) + (e.ref ? '<small>' + esc(e.ref) + '</small>' : '') + '</td>' +
            '<td>' + tagOf(BASIS, basisOf(e)) + '</td>' +
            (i === 0 ? '<td rowspan="' + eds.length + '">' + esc(p.leadTime || '문의') + '<br><small>' + esc(p.warranty || '') + '</small></td>' : '') +
            '<td><a class="btn btn-outline btn-sm" href="contact.html?product=' + encodeURIComponent(p.id) + '">견적</a></td>' +
          '</tr>';
        });
      });
      html += '<div id="' + esc(key) + '" class="cat-title"><span class="ic">' + icon(CATS[key].icon || 'humanoid') + '</span><h2>' + esc(CATS[key].label) + '</h2><small>' + list.length + '개 모델</small></div>' +
        '<div class="table-wrap"><table class="price-table"><thead><tr>' +
        '<th>제품</th><th>구성 / 에디션</th><th>주요 사양</th><th>참고가 (KRW, VAT 별도)</th><th>가격 기준</th><th>납기 / 보증</th><th></th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    });
    root.innerHTML = html || '<div class="empty">가격 데이터를 불러오지 못했습니다.</div>';

    var total = $('#price-total');
    if (total) total.textContent = PRODUCTS.length;

    var legend = $('#price-legend');
    if (legend) legend.innerHTML = Object.keys(BASIS).map(function (k) { return '<span>' + tagOf(BASIS, k) + esc(BASIS[k].short) + '</span>'; }).join('');

    var csvBtn = $('#download-csv');
    if (csvBtn) csvBtn.addEventListener('click', function () {
      var lines = [['카테고리', '제품', '구성/에디션', '참고가(KRW, VAT별도)', '가격 기준', '기준 가격 출처', '납기', '보증', '비고']];
      PRODUCTS.forEach(function (p) {
        var eds = p.editions && p.editions.length ? p.editions : [{ name: '기본 구성' }];
        eds.forEach(function (e) {
          var k = krwOf(e);
          lines.push([catLabel(p.category), p.name, e.name, e.free ? '무상' : (k == null ? '견적 문의' : k), BASIS[basisOf(e)].label, e.ref || '', p.leadTime || '', p.warranty || '', e.note || '']);
        });
      });
      lines.push([]);
      lines.push(['기준일', CFG.priceDate || '', '환율', '1 CNY = ' + num(FX.CNY) + ' KRW', '1 USD = ' + num(FX.USD) + ' KRW', '모든 가격은 부가세 별도 참고가이며 정식 견적서로 확정됩니다.']);
      var csv = '﻿' + lines.map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'UIG_Fourier_price_list.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    var printBtn = $('#print-page');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  }

  /* ------------------------------------------------------------------
     contact form (contact.html)
     ------------------------------------------------------------------ */
  function initContact() {
    var form = $('#quote-form');
    if (!form) return;
    var sel = form.querySelector('[name="product"]');
    if (sel) {
      CAT_ORDER.forEach(function (k) {
        var og = document.createElement('optgroup');
        og.label = CATS[k].label;
        PRODUCTS.filter(function (p) { return p.category === k; }).forEach(function (p) { og.appendChild(new Option(p.name, p.id)); });
        sel.appendChild(og);
      });
      var pre = qs('product');
      if (pre && byId(pre)) sel.value = pre;
    }
    var typeSel = form.querySelector('[name="type"]');
    if (typeSel && qs('type')) typeSel.value = qs('type');

    var status = $('#form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form), d = {};
      fd.forEach(function (v, k) { d[k] = v; });
      var prod = byId(d.product);
      var typeLabel = d.type === 'demo' ? '데모 신청' : d.type === 'partner' ? '파트너 제휴' : d.type === 'info' ? '제품 문의' : '견적 문의';
      var subject = '[' + typeLabel + '] ' + (prod ? prod.name : '제품 미정') + ' - ' + (d.org || d.name);
      var body = [
        '문의 유형: ' + typeLabel,
        '관심 제품: ' + (prod ? prod.name : '미정 / 상담 후 결정'),
        '도입 수량: ' + (d.qty || ''),
        '',
        '성함: ' + (d.name || ''),
        '기관 · 회사: ' + (d.org || ''),
        '이메일: ' + (d.email || ''),
        '연락처: ' + (d.phone || ''),
        '용도: ' + (d.purpose || ''),
        '',
        '문의 내용:',
        d.message || ''
      ].join('\n');

      if (CFG.formEndpoint) {
        fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ _subject: subject, product_name: prod ? prod.name : '' }, d)) })
          .then(function (r) { if (!r.ok) throw new Error('send failed'); form.reset(); showStatus('문의가 접수되었습니다. 1영업일 내에 담당자가 연락드리겠습니다.'); })
          .catch(function () { showStatus('전송에 실패했습니다. ' + (CFG.email || '') + ' 로 직접 메일을 보내주세요.'); });
      } else {
        location.href = 'mailto:' + (CFG.email || '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        showStatus('메일 앱이 열립니다. 내용을 확인한 후 전송해 주세요. 메일 앱이 열리지 않으면 ' + (CFG.email || '') + ' 로 직접 보내주세요.');
      }
    });
    function showStatus(msg) { if (status) { status.textContent = msg; status.classList.remove('hidden'); } }
  }

  document.addEventListener('DOMContentLoaded', function () {
    fillConfig();
    initNav();
    initFeatured();
    initCatalog();
    initProductDetail();
    initPricing();
    initContact();
  });
})();
