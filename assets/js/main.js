/* Minakshee Narayankar — portfolio interactions. No dependencies. */
(() => {
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  };

  /* ---------- Theme ---------- */
  const themeBtn = $('.theme-toggle');
  const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  const metaThemes = $$('meta[name="theme-color"]');
  const effectiveTheme = () => root.dataset.theme || (mqDark.matches ? 'dark' : 'light');

  const syncTheme = () => {
    const dark = effectiveTheme() === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    if (root.dataset.theme) metaThemes.forEach((m) => m.setAttribute('content', dark ? '#0F0F0E' : '#F3F0E8'));
  };

  themeBtn.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncTheme();
  });
  mqDark.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- Header: border on scroll ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu-toggle');
  const nav = $('#primary-nav');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* ---------- Scroll spy ---------- */
  const navLinks = $$('a[href^="#"]', nav);
  if ('IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        const link = byId.get(entry.target.id);
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Hero metric count-up ---------- */
  const countUp = () => $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const final = el.textContent;
    const duration = 1200;
    // lock the final width so the unit beside the number does not move while counting
    el.style.display = 'inline-block';
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? (target * eased).toFixed(decimals) : final;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  if (!reduceMotion) {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(countUp);
    else countUp();
  }

  /* ---------- Experience accordions ---------- */
  const setTrack = (track, open) => {
    track.dataset.open = String(open);
    $('.track-btn', track).setAttribute('aria-expanded', String(open));
  };
  $$('.track').forEach((track) => {
    setTrack(track, track.dataset.default !== 'closed');
    $('.track-btn', track).addEventListener('click', () => setTrack(track, track.dataset.open !== 'true'));
  });

  /* ---------- Tech badge cross-highlighting ---------- */
  const setHighlight = (key, on) => {
    $$(`[data-tech="${key}"]`).forEach((el) => el.classList.toggle('is-hl', on));
  };
  $$('[data-tech]').forEach((el) => {
    const key = el.dataset.tech;
    el.addEventListener('mouseenter', () => setHighlight(key, true));
    el.addEventListener('mouseleave', () => setHighlight(key, false));
    el.addEventListener('focus', () => setHighlight(key, true));
    el.addEventListener('blur', () => setHighlight(key, false));
  });

  /* Skill tags jump to where the skill was used: projects first, then experience. */
  const flash = (el) => {
    el.classList.remove('is-flash');
    void el.offsetWidth; // restart the animation
    el.classList.add('is-flash');
  };
  $$('#skills .tag[data-tech]').forEach((tag) => {
    const key = tag.dataset.tech;
    const target = $(`#work [data-tech="${key}"]`) || $(`#experience [data-tech="${key}"]`);
    if (!target) return;
    const label = tag.textContent.trim();
    tag.classList.add('is-linked');
    tag.setAttribute('role', 'button');
    tag.tabIndex = 0;
    tag.setAttribute('aria-label', `${label}: show where I used it`);

    const go = () => {
      const track = target.closest('.track');
      if (track && track.dataset.open !== 'true') setTrack(track, true);
      const block = target.closest('article, .track, .tl-item') || target;
      block.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      setHighlight(key, true);
      flash(block);
      setTimeout(() => setHighlight(key, false), 1600);
    };
    tag.addEventListener('click', go);
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  /* ---------- Placeholder links ---------- */
  $$('a[data-placeholder]').forEach((a) => {
    a.setAttribute('aria-disabled', 'true');
    a.addEventListener('click', (e) => { e.preventDefault(); toast('Link coming soon'); });
  });

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        toast('Email copied to clipboard');
      } catch (e) {
        toast('Copy failed, so use the email link instead');
      }
    });
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
