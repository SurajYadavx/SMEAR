/**
 * SMEAR PATHOLOGY — MAIN SCRIPT v3
 * 1.CONFIG  2.i18n  3.ScrollLock  4.ContactWiring  5.CatalogueUI
 * 6.TestCards  7.Carousels  8.Modal  9.Lightbox  10.FAQ
 * 11.Header  12.MobileNav  13.FadeIn  14.FooterYear  15.HeroVideo  16.JSONLD
 */

// 1. CONFIG
// Config values (CONTACT_PHONE, MAP_LAT, etc.) have been moved to src/config.js.

var _content = null;

// 2. SCROLL LOCK
var _scrollLockCount = 0;
var _scrollY = 0;
function lockScroll() {
  _scrollLockCount++;
  if (_scrollLockCount > 1) return;
  _scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + _scrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
}
function unlockScroll() {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount > 0) return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, _scrollY);
}
function preventTouchScroll(e) {
  var el = e.target;
  while (el && el !== document.body) {
    if (el.classList && (el.classList.contains('modal-card') || el.classList.contains('faq-answer'))) return;
    el = el.parentElement;
  }
  e.preventDefault();
}

// INIT
document.addEventListener('DOMContentLoaded', function () {
  initLanguagePicker();
  injectJSONLD();
  initHeroVideo();
});

// 3. i18n
var LANG_KEY = 'smear_lang';
function initLanguagePicker() {
  var saved = localStorage.getItem(LANG_KEY);
  var toggle = document.getElementById('lang-toggle');
  var toggleMob = document.getElementById('lang-toggle-mobile');
  if (toggle) toggle.addEventListener('click', switchLanguage);
  if (toggleMob) toggleMob.addEventListener('click', switchLanguage);
  if (saved === 'en' || saved === 'mr') { applyLanguage(saved); bootApp(); }
  else { showLangPopup(); }
}
function showLangPopup() {
  var popup = document.getElementById('lang-popup');
  if (!popup) return;
  popup.setAttribute('aria-hidden', 'false');
  popup.classList.add('is-visible');
  lockScroll();
  document.getElementById('lang-btn-mr').addEventListener('click', function () { chooseLang('mr'); });
  document.getElementById('lang-btn-en').addEventListener('click', function () { chooseLang('en'); });
}
function chooseLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  var popup = document.getElementById('lang-popup');
  if (popup) { popup.classList.remove('is-visible'); popup.setAttribute('aria-hidden', 'true'); }
  unlockScroll();
  applyLanguage(lang);
  bootApp();
}
function switchLanguage() {
  var current = localStorage.getItem(LANG_KEY) || 'en';
  var next = current === 'en' ? 'mr' : 'en';
  localStorage.setItem(LANG_KEY, next);
  applyLanguage(next);
  ['package-filters', 'concern-grid', 'catalogue-search-input'].forEach(function (id) {
    var el = document.getElementById(id); if (el) delete el.dataset.bound;
  });
  buildCatalogueUI(); buildTestCards(); buildFAQ();
}
function applyLanguage(lang) {
  _content = (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : window.CONTENT_EN;
  if (!_content) _content = window.CONTENT_EN;
  var htmlEl = document.getElementById('html-root');
  if (htmlEl) htmlEl.lang = _content.lang || lang;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var val = getNestedValue(_content, el.getAttribute('data-i18n'));
    if (val !== undefined && val !== null) {
      if (typeof val === 'string' && val.indexOf('\n') !== -1) el.innerHTML = val.replace(/\n/g, '<br>');
      else if (typeof val === 'string') el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(/\s+/).forEach(function (pair) {
      var parts = pair.split(':');
      if (parts.length !== 2) return;
      var val = getNestedValue(_content, parts[1].trim());
      if (val !== undefined && val !== null) el.setAttribute(parts[0].trim(), val);
    });
  });
}
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce(function (cur, k) { return (cur === null || cur === undefined) ? undefined : cur[k]; }, obj);
}

// BOOT APP
function bootApp() {
  wireContactLinks();
  wireStaticContactBlocks();
  wireMapLinks();
  buildCatalogueUI();
  buildTestCards();
  buildGalleryCarousel();
  buildReviewsCarousel();
  buildFAQ();
  initHeader();
  initMobileNav();
  initModal();
  initLeadInquiry();
  initLightbox();
  initScrollFadeIn();
  initCarouselDrag();
  setFooterYear();
}

// 4. CONTACT WIRING
function wireContactLinks() {
  ['#header-call-btn','#hero-call-btn','#mobile-call-btn','#modal-call-btn','#contact-cta-call','#footer-call-btn','#bottom-bar-call-btn','#call-float'].forEach(function (sel) {
    var el = document.querySelector(sel); if (el) el.href = CONTACT_PHONE_TEL;
  });
  ['#header-wa-btn','#hero-wa-btn','#mobile-wa-btn','#modal-wa-btn','#contact-cta-wa','#footer-wa-btn','#contact-wa-link','.whatsapp-float','#bottom-bar-wa-btn'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.href = CONTACT_WHATSAPP_URL; el.setAttribute('target','_blank'); el.setAttribute('rel','noopener noreferrer'); });
  });
  ['#header-email-btn','#contact-email-link','#footer-email-btn','#mobile-email-btn','#contact-cta-email'].forEach(function (sel) {
    var el = document.querySelector(sel); if (el) el.href = CONTACT_EMAIL_HREF;
  });
}
function wireStaticContactBlocks() {
  var pl = document.getElementById('contact-phone-link');
  if (pl) { pl.textContent = CONTACT_PHONE_DISPLAY; pl.href = CONTACT_PHONE_TEL; }
  var fp = document.getElementById('footer-phone-display');
  if (fp) fp.textContent = CONTACT_PHONE_DISPLAY;
  var ho = document.getElementById('contact-hours');
  if (ho) ho.textContent = LAB_HOURS;
  document.querySelectorAll('.email-display').forEach(function (el) { el.textContent = CONTACT_EMAIL; el.href = CONTACT_EMAIL_HREF; });
}
function wireMapLinks() {
  var iframe = document.getElementById('contact-map-iframe');
  if (iframe) iframe.src = MAP_EMBED_URL;
  ['#contact-directions-btn','#footer-directions-btn','.contact-directions-link','#map-directions-btn'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.href = MAP_DIRECTIONS_URL; el.setAttribute('target','_blank'); el.setAttribute('rel','noopener noreferrer'); });
  });
  var seeAll = document.getElementById('reviews-see-all-btn');
  if (seeAll) seeAll.href = MAP_SHARE_URL;
}

// VIEW MORE
function getViewLimit(type) {
  var d = VIEW_MORE_DEFAULTS[type] || { mobile: 6, desktop: 8 };
  return window.innerWidth >= 768 ? d.desktop : d.mobile;
}
function renderViewMoreUI(containerId, items, renderFn, type) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var limit = getViewLimit(type), total = items.length, expanded = false;
  function vmLabel(k, fb) { return getNestedValue(_content, 'viewMore.' + k) || fb; }
  function doRender() {
    var count = expanded ? total : Math.min(limit, total);
    container.innerHTML = '';
    items.slice(0, count).forEach(function (item) { container.appendChild(renderFn(item)); });
    if (window._fadeObserver) container.querySelectorAll('.fade-in').forEach(function (el) { window._fadeObserver.observe(el); });
  }
  doRender();
  var wrapId = containerId + '-vm-wrap';
  var existing = document.getElementById(wrapId); if (existing) existing.remove();
  if (total <= limit) return;
  var wrap = document.createElement('div'); wrap.id = wrapId; wrap.className = 'view-more-wrap';
  var countEl = document.createElement('p'); countEl.className = 'view-more-count';
  var btn = document.createElement('button'); btn.className = 'btn btn--outline view-more-btn';
  wrap.appendChild(countEl); wrap.appendChild(btn);
  function updateWrap() {
    var shown = expanded ? total : Math.min(limit, total);
    countEl.textContent = vmLabel('showing','Showing {shown} of {total}').replace('{shown}',shown).replace('{total}',total);
    btn.textContent = expanded ? vmLabel('viewLess','View Less') : vmLabel('viewMore','View More');
  }
  updateWrap();
  btn.addEventListener('click', function () { expanded = !expanded; doRender(); updateWrap(); });
  container.parentNode.insertBefore(wrap, container.nextSibling);
}

// 5. CATALOGUE UI
function buildCatalogueUI() {
  var lang = (_content && _content.lang) ? _content.lang : 'en';
  var packageData = (window.PACKAGE_DATA && window.PACKAGE_DATA[lang]) || [];
  var testData = (window.TESTS_CATALOGUE && window.TESTS_CATALOGUE[lang]) || [];
  var searchInput = document.getElementById('catalogue-search-input');
  var filterWrap = document.getElementById('package-filters');
  var concernGrid = document.getElementById('concern-grid');
  var packageGrid = document.getElementById('package-grid');
  var testGrid = document.getElementById('test-grid');
  if (!searchInput && !filterWrap && !packageGrid && !testGrid) return;
  if (searchInput) searchInput.value = '';

  function label(k, fb) { return getNestedValue(_content, 'tests.' + k) || fb; }
  var pfLabels = getNestedValue(_content,'tests.packageFilters') || ['All','Full Body','Diabetes','Thyroid','Heart','Women','Senior'];
  var hcLabels = getNestedValue(_content,'tests.healthConcerns') || ['Diabetes','Thyroid','Fever & Infection','Heart','Liver','Kidney','Vitamins',"Women's Health",'Anemia','Urine & Stool'];
  var activeFilter = 'all', activeSearch = '';

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function matches(item) {
    var text = [item.name,item.tagline||'',item.concern||'',(item.highlights||[]).join(' '),item.description||''].join(' ').toLowerCase();
    var fk = activeFilter === 'all' ? null : activeFilter.toLowerCase();
    return (!fk||(item.concern||'').toLowerCase()===fk) && (!activeSearch||text.indexOf(activeSearch)!==-1);
  }

  function makePackageCard(item) {
    var el = document.createElement('article');
    el.className = 'catalogue-card catalogue-card--package fade-in';
    el.dataset.id = item.id;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.setAttribute('aria-label', esc(item.name) + ' \u2014 \u20b9' + item.price);
    el.innerHTML = '<div class="catalogue-card__visual" aria-hidden="true"><div class="catalogue-card__badge">'+esc(item.sticker||'')+'</div><span>'+esc(item.sample||'')+'</span></div>'
      +'<div class="catalogue-card__content"><div class="catalogue-card__topline"><span class="catalogue-card__chip">'+esc(item.concern||'')+'</span><span class="catalogue-card__meta">'+(item.params||0)+' '+label('parameterCount','tests')+'</span></div>'
      +'<h4>'+esc(item.name)+'</h4><p>'+esc(item.tagline||'')+'</p>'
      +'<div class="catalogue-card__footer"><strong>\u20b9'+item.price+'</strong><span>'+label('details','Details')+' \u2192</span></div></div>';
    function openThis() { var f=packageData.find(function(p){return p.id===item.id;}); if(f) openCatalogueItem(f,'package'); }
    el.addEventListener('click',openThis);
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openThis();}});
    return el;
  }

  function makeTestCard(item) {
    var el = document.createElement('article');
    el.className = 'catalogue-card catalogue-card--test fade-in';
    el.dataset.id = item.id;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.setAttribute('aria-label', esc(item.name)+' \u2014 \u20b9'+item.price);
    el.innerHTML = '<div class="catalogue-card__content"><div class="catalogue-card__topline"><span class="catalogue-card__chip">'+esc(item.category||item.concern||'')+'</span><span class="catalogue-card__meta">'+esc(item.reports||'')+'</span></div>'
      +'<h4>'+esc(item.name)+'</h4><p>'+esc(item.description||'')+'</p>'
      +'<div class="catalogue-card__footer"><strong>\u20b9'+item.price+'</strong><span>'+label('details','Details')+' \u2192</span></div></div>';
    function openThis() { var f=testData.find(function(t){return t.id===item.id;}); if(f) openCatalogueItem(f,'test'); }
    el.addEventListener('click',openThis);
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openThis();}});
    return el;
  }

  function renderCatalogueGrid() {
    var vp=packageData.filter(matches), vt=testData.filter(matches);
    if (packageGrid) {
      if (vp.length===0) { packageGrid.innerHTML='<div class="catalogue-empty">'+label('noPackages','No packages found.')+'</div>'; var vm=document.getElementById('package-grid-vm-wrap'); if(vm)vm.remove(); }
      else { packageGrid.innerHTML=''; renderViewMoreUI('package-grid',vp,makePackageCard,'packages'); }
    }
    if (testGrid) {
      if (activeSearch || activeFilter !== 'all') {
        if (vt.length===0) { testGrid.innerHTML='<div class="catalogue-empty">'+label('noTests','No tests found.')+'</div>'; var vmT=document.getElementById('test-grid-vm-wrap'); if(vmT)vmT.remove(); }
        else { testGrid.innerHTML=''; renderViewMoreUI('test-grid',vt,makeTestCard,'tests'); }
      } else {
        buildTestCards();
      }
    }
  }

  if (filterWrap && !filterWrap.dataset.bound) {
    filterWrap.innerHTML = pfLabels.map(function(fl,i){return '<button class="catalogue-filter'+(i===0?' is-active':'')+'" data-filter="'+esc(fl)+'">'+esc(fl)+'</button>';}).join('');
    filterWrap.addEventListener('click',function(e){
      var btn=e.target.closest('.catalogue-filter'); if(!btn) return;
      filterWrap.querySelectorAll('.catalogue-filter').forEach(function(b){b.classList.toggle('is-active',b===btn);});
      activeFilter=(btn.dataset.filter===pfLabels[0])?'all':btn.dataset.filter; renderCatalogueGrid();
    });
    filterWrap.dataset.bound='1';
  }
  if (concernGrid && !concernGrid.dataset.bound) {
    concernGrid.innerHTML = hcLabels.map(function(c){return '<button class="concern-chip" data-filter="'+esc(c)+'">'+esc(c)+'</button>';}).join('');
    concernGrid.addEventListener('click',function(e){
      var chip=e.target.closest('.concern-chip'); if(!chip) return;
      activeFilter=chip.dataset.filter;
      if(filterWrap) filterWrap.querySelectorAll('.catalogue-filter').forEach(function(b){b.classList.toggle('is-active',b.dataset.filter===pfLabels[0]);});
      renderCatalogueGrid();
    });
    concernGrid.dataset.bound='1';
  }
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.addEventListener('input',function(){activeSearch=searchInput.value.trim().toLowerCase(); renderCatalogueGrid();});
    searchInput.dataset.bound='1';
  }
  renderCatalogueGrid();
}

function openCatalogueItem(item, kind) {
  var payload = Object.assign({},item);
  if (kind==='package') {
    var details=[[getNestedValue(_content,'tests.packageWho')||'Who it suits',item.who],[getNestedValue(_content,'tests.packageWhy')||'What it checks',item.why],[getNestedValue(_content,'tests.packagePrep')||'Preparation',item.prep]];
    payload.fullDesc=payload.fullDesc||details.filter(function(d){return d[1];}).map(function(d){return d[0]+': '+d[1];}).join('\n\n');
  }
  payload.fullDesc=payload.fullDesc||item.description||item.name;
  payload.shortDesc=payload.shortDesc||payload.tagline||payload.description||item.name;
  payload.image=payload.image||'';
  openModal(payload);
}

// 6. TEST CARDS
function buildTestCards() {
  var grid = document.getElementById('test-grid'); if (!grid) return;
  grid.innerHTML = '';
  var tests = (_content && _content.testData) ? _content.testData : (window.CONTENT_EN ? window.CONTENT_EN.testData : []);
  var vdLabel = getNestedValue(_content,'tests.viewDetails') || 'View details';
  tests.forEach(function(test) {
    var card = document.createElement('article');
    card.className='test-card fade-in'; card.setAttribute('role','listitem'); card.setAttribute('tabindex','0');
    card.dataset.testId=test.id;
    card.innerHTML='<div class="test-card__img-wrap">'
      +'<img class="test-card__img" src="'+test.image+'" alt="'+test.name+' test at Smear Pathology" loading="lazy"'
      +' onerror="this.style.display=\'none\';this.parentElement.querySelector(\'.test-card__img-placeholder\').style.display=\'flex\'" />'
      +'<div class="test-card__img-placeholder" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">'
      +'<circle cx="24" cy="20" r="8" stroke="currentColor" stroke-width="1.5" opacity=".5"/>'
      +'<path d="M8 40c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>'
      +'</svg></div></div>'
      +'<div class="test-card__body"><h3 class="test-card__name">'+test.name+'</h3>'
      +'<p class="test-card__short">'+test.shortDesc+'</p>'
      +'<div class="test-card__footer"><span class="test-card__price">\u20b9'+test.price+'</span>'
      +'<span class="test-card__cta">'+vdLabel
      +'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      +'</span></div></div>';
    card.addEventListener('click',function(){openModal(test);});
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(test);}});
    grid.appendChild(card);
  });
  if (window._fadeObserver) grid.querySelectorAll('.fade-in').forEach(function(el){window._fadeObserver.observe(el);});
}

// 7. GALLERY & REVIEWS CAROUSELS
function buildGalleryCarousel() {
  var track = document.getElementById('gallery-track');
  if (!track || GALLERY_IMAGES.length === 0) return;
  var ph = document.getElementById('gallery-placeholder'); if (ph) ph.remove();
  GALLERY_IMAGES.forEach(function(item) {
    var wrap=document.createElement('div'); wrap.className='gallery-photo'; wrap.dataset.src=item.src; wrap.dataset.alt=item.alt;
    var img=document.createElement('img'); img.src=item.src; img.alt=item.alt; img.loading='lazy'; img.setAttribute('draggable','false');
    wrap.appendChild(img); track.appendChild(wrap);
    wrap.addEventListener('click',function(){openLightbox(item.src,item.alt);});
  });
  initCarouselAutoScroll('gallery-track','gallery-prev','gallery-next');
}
function buildReviewsCarousel() {
  var track = document.getElementById('reviews-track'); if (!track) return;
  if (REVIEW_IMAGES.length===0) { initCarouselAutoScroll('reviews-track','reviews-prev','reviews-next',3500); return; }
  REVIEW_IMAGES.forEach(function(item) {
    var card=document.createElement('div'); card.className='review-screenshot-card';
    var img=document.createElement('img'); img.src=item.src; img.alt=item.alt; img.loading='lazy'; img.setAttribute('draggable','false');
    card.appendChild(img); track.appendChild(card);
  });
  initCarouselAutoScroll('reviews-track','reviews-prev','reviews-next',3500);
}
function initCarouselAutoScroll(trackId,prevId,nextId,intervalMs) {
  intervalMs=intervalMs||3000;
  var track=document.getElementById(trackId),prevBtn=document.getElementById(prevId),nextBtn=document.getElementById(nextId);
  if (!track) return;
  var timer=null,isPaused=false;
  function getStep(){var f=track.firstElementChild;return f?f.offsetWidth+20:300;}
  function scrollBy(dir){track.scrollBy({left:dir*getStep(),behavior:'smooth'});}
  function autoScroll(){if(isPaused)return;if(track.scrollLeft+track.clientWidth>=track.scrollWidth-4){track.scrollTo({left:0,behavior:'smooth'});}else{scrollBy(1);}}
  function startTimer(){timer=setInterval(autoScroll,intervalMs);}
  function stopTimer(){clearInterval(timer);timer=null;}
  track.addEventListener('mouseenter',function(){isPaused=true;stopTimer();});
  track.addEventListener('mouseleave',function(){isPaused=false;startTimer();});
  track.addEventListener('touchstart',function(){isPaused=true;stopTimer();},{passive:true});
  track.addEventListener('touchend',function(){isPaused=false;setTimeout(startTimer,1200);});
  if(prevBtn)prevBtn.addEventListener('click',function(){scrollBy(-1);stopTimer();setTimeout(startTimer,2000);});
  if(nextBtn)nextBtn.addEventListener('click',function(){scrollBy(1);stopTimer();setTimeout(startTimer,2000);});
  startTimer();
}
function initCarouselDrag() {
  document.querySelectorAll('.carousel-track').forEach(function(track) {
    var isDown=false,startX=0,scrollLeft=0;
    track.addEventListener('mousedown',function(e){isDown=true;track.style.cursor='grabbing';startX=e.pageX-track.offsetLeft;scrollLeft=track.scrollLeft;});
    track.addEventListener('mouseleave',function(){isDown=false;track.style.cursor='grab';});
    track.addEventListener('mouseup',function(){isDown=false;track.style.cursor='grab';});
    track.addEventListener('mousemove',function(e){if(!isDown)return;e.preventDefault();track.scrollLeft=scrollLeft-(e.pageX-track.offsetLeft-startX)*1.5;});
  });
}

// 8. MODAL
function initModal() {
  var overlay=document.getElementById('test-modal'),closeBtn=document.getElementById('modal-close');
  if(!overlay)return;
  closeBtn.addEventListener('click',closeModal);
  overlay.addEventListener('click',function(e){if(e.target===overlay)closeModal();});
  overlay.addEventListener('touchmove',preventTouchScroll,{passive:false});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.getAttribute('aria-hidden')==='false')closeModal();});
}
function initLeadInquiry() {
  var overlay=document.getElementById('lead-inquiry-overlay');
  var closeButton=document.getElementById('lead-inquiry-close');
  var form=document.getElementById('lead-inquiry-form');
  if(!overlay||!closeButton||!form||overlay.dataset.bound)return;
  overlay.dataset.bound='1';

  function closePrompt() {
    if(overlay.getAttribute('aria-hidden')==='true')return;
    overlay.setAttribute('aria-hidden','true');
    unlockScroll();
  }
  function openPrompt() {
    overlay.setAttribute('aria-hidden','false');
    lockScroll();
    document.getElementById('lead-inquiry-name').focus();
  }

  closeButton.addEventListener('click',closePrompt);
  overlay.addEventListener('click',function(e){if(e.target===overlay)closePrompt();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closePrompt();});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.reportValidity())return;
    var name=document.getElementById('lead-inquiry-name').value.trim();
    var phone=document.getElementById('lead-inquiry-phone').value.trim();
    var message='Hi, I have a question about your services. My name is '+name+' and my contact number is '+phone+'.';
    var url='https://wa.me/91'+CONTACT_PHONE+'?text='+encodeURIComponent(message);
    window.open(url,'_blank','noopener,noreferrer');
    closePrompt();
  });

  try { if(sessionStorage.getItem('smear_lead_prompt_seen')==='1')return; } catch(e) {}
  var triggerAt=0.48+Math.random()*0.2;
  function maybeOpenPrompt() {
    var scrollable=document.documentElement.scrollHeight-window.innerHeight;
    if(scrollable<=0||window.scrollY/scrollable<triggerAt)return;
    if(document.querySelector('.modal-overlay[aria-hidden="false"]'))return;
    try { sessionStorage.setItem('smear_lead_prompt_seen','1'); } catch(e) {}
    window.removeEventListener('scroll',maybeOpenPrompt);
    openPrompt();
  }
  window.addEventListener('scroll',maybeOpenPrompt,{passive:true});
}
function openModal(test) {
  var overlay=document.getElementById('test-modal'); if(!overlay)return;
  document.getElementById('modal-title').textContent=test.name;
  document.getElementById('modal-price').textContent=(getNestedValue(_content,'tests.startingFrom')||'Starting from')+' \u20b9'+test.price;
  document.getElementById('modal-desc').textContent=test.fullDesc;
  document.getElementById('modal-call-btn').href=CONTACT_PHONE_TEL;
  var bm=getNestedValue(_content,'tests.bookingMessage')||"Hi, I'd like to book {test} at Smear Pathology.";
  var waBtn=document.getElementById('modal-wa-btn');
  waBtn.href='https://wa.me/91'+CONTACT_PHONE+'?text='+encodeURIComponent(bm.replace('{test}',test.name));
  waBtn.setAttribute('target','_blank');
  var imgEl=document.getElementById('modal-img'),imgPh=document.getElementById('modal-img-placeholder');
  if(test.image){imgEl.src=test.image;imgEl.alt=test.name;imgEl.style.display='block';imgPh.style.display='none';imgEl.onerror=function(){imgEl.style.display='none';imgPh.style.display='flex';};}
  else{imgEl.style.display='none';imgPh.style.display='flex';}
  overlay.setAttribute('aria-hidden','false');
  lockScroll();
  setTimeout(function(){var c=document.getElementById('modal-close');if(c)c.focus();},80);
}
function closeModal() {
  var overlay=document.getElementById('test-modal'); if(!overlay)return;
  overlay.setAttribute('aria-hidden','true'); unlockScroll();
}

// 9. LIGHTBOX
function initLightbox() {
  var lb=document.getElementById('lightbox'),closeBtn=document.getElementById('lightbox-close');
  if(!lb)return;
  closeBtn.addEventListener('click',closeLightbox);
  lb.addEventListener('click',function(e){if(e.target===lb)closeLightbox();});
  lb.addEventListener('touchmove',preventTouchScroll,{passive:false});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.getAttribute('aria-hidden')==='false')closeLightbox();});
}
function openLightbox(src,alt) {
  var lb=document.getElementById('lightbox'),img=document.getElementById('lightbox-img');
  if(!lb||!img)return; img.src=src; img.alt=alt; lb.setAttribute('aria-hidden','false'); lockScroll();
}
function closeLightbox() {
  var lb=document.getElementById('lightbox'); if(!lb)return; lb.setAttribute('aria-hidden','true'); unlockScroll();
}

// 10. FAQ
function buildFAQ() {
  var list=document.getElementById('faq-list'); if(!list)return;
  list.innerHTML='';
  var items=getNestedValue(_content,'faq.items')||[];
  items.forEach(function(item,i) {
    var el=document.createElement('div'); el.className='faq-item fade-in'; el.setAttribute('role','listitem');
    var btnId='faq-btn-'+i,bodyId='faq-body-'+i;
    el.innerHTML='<button class="faq-question" id="'+btnId+'" aria-expanded="false" aria-controls="'+bodyId+'">'
      +'<span class="faq-question__text">'+item.q+'</span>'
      +'<span class="faq-question__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>'
      +'</button><div class="faq-answer" id="'+bodyId+'" role="region" aria-labelledby="'+btnId+'" hidden><p>'+item.a+'</p></div>';
    var btn=el.querySelector('.faq-question'),body=el.querySelector('.faq-answer');
    btn.addEventListener('click',function(){
      var isOpen=btn.getAttribute('aria-expanded')==='true';
      list.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(function(ob){if(ob!==btn){ob.setAttribute('aria-expanded','false');var bd=document.getElementById(ob.getAttribute('aria-controls'));if(bd)bd.hidden=true;}});
      btn.setAttribute('aria-expanded',String(!isOpen)); body.hidden=isOpen;
    });
    list.appendChild(el);
  });
  if(window._fadeObserver)list.querySelectorAll('.fade-in').forEach(function(el){window._fadeObserver.observe(el);});
}

// 11. HEADER
function initHeader() {
  var header=document.getElementById('site-header'); if(!header)return;
  window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>8);},{passive:true});
}

// 12. MOBILE NAV
var _mobileNavOpen=false,_mobileNavInitialised=false;
function initMobileNav() {
  if(_mobileNavInitialised)return; _mobileNavInitialised=true;
  var hamburger=document.getElementById('hamburger'),nav=document.getElementById('mobile-nav'),overlay=document.getElementById('mobile-nav-overlay');
  if(!hamburger||!nav)return;
  function openNav() {
    _mobileNavOpen=true; hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded','true');
    nav.setAttribute('aria-hidden','false'); nav.classList.add('is-open');
    if(overlay){overlay.style.display='block';setTimeout(function(){overlay.style.opacity='1';},10);}
    lockScroll(); var first=nav.querySelector('a,button'); if(first)first.focus();
  }
  function closeNav() {
    _mobileNavOpen=false; hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
    nav.setAttribute('aria-hidden','true'); nav.classList.remove('is-open');
    if(overlay){overlay.style.opacity='0';setTimeout(function(){overlay.style.display='none';},250);}
    unlockScroll(); hamburger.focus();
  }
  hamburger.addEventListener('click',function(){if(_mobileNavOpen)closeNav();else openNav();});
  nav.querySelectorAll('a,.mobile-nav__link').forEach(function(link){link.addEventListener('click',closeNav);});
  if(overlay)overlay.addEventListener('click',closeNav);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&_mobileNavOpen)closeNav();});
  window.addEventListener('resize',function(){if(_mobileNavOpen&&window.innerWidth>=768)closeNav();},{passive:true});
}

// 13. FADE IN
function initScrollFadeIn() {
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.fade-in').forEach(function(el){el.classList.add('visible');});return;}
  window._fadeObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');window._fadeObserver.unobserve(entry.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.fade-in').forEach(function(el){window._fadeObserver.observe(el);});
}

// 14. FOOTER YEAR
function setFooterYear() {
  var el=document.getElementById('footer-year'); if(el)el.textContent=new Date().getFullYear();
}

// 15. HERO VIDEO
function initHeroVideo() {
  var video=document.getElementById('hero-video'); if(!video)return;
  var saveData=(navigator.connection&&navigator.connection.saveData);
  var reducedMotion=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);
  if(saveData||reducedMotion){video.style.display='none';return;}
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)video.play().catch(function(){});else video.pause();});},{threshold:0.1}).observe(video);
  }else{video.play().catch(function(){});}
}

// 16. JSON-LD
function injectJSONLD() {
  if(document.getElementById('jsonld-lab'))return;
  var schema={
    '@context':'https://schema.org','@type':'MedicalBusiness',
    'name':'Smear Pathology',
    'description':'Diagnostic pathology and microbiology laboratory in Indapur, Pune, Maharashtra.',
    'url':'https://smearpathology.in','logo':'https://smearpathology.inpublic/assets/logo/logo.png',
    'telephone':'+917410745222','email':CONTACT_EMAIL,
    'address':{'@type':'PostalAddress','streetAddress':'Indapur','addressLocality':'Indapur','addressRegion':'Maharashtra','postalCode':'413106','addressCountry':'IN'},
    'geo':{'@type':'GeoCoordinates','latitude':MAP_LAT,'longitude':MAP_LNG},
    'openingHoursSpecification':[
      {'@type':'OpeningHoursSpecification','dayOfWeek':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'opens':'07:00','closes':'21:00'},
      {'@type':'OpeningHoursSpecification','dayOfWeek':['Sunday'],'opens':'08:00','closes':'14:00'}
    ],
    'hasMap':MAP_SHARE_URL,'medicalSpecialty':'Pathology',
    'founder':{'@type':'Person','name':'Pradip S. Jadhav'}
  };
  var script=document.createElement('script'); script.id='jsonld-lab'; script.type='application/ld+json';
  script.textContent=JSON.stringify(schema); document.head.appendChild(script);
}
