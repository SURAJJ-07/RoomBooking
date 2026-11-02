/* =====================================================================
   मेरो संसार, मेरी उनी ❤️ — behaviour
   All text and photos come from js/config.js (window.BIRTHDAY_CONFIG).
   No libraries, no network calls, no tracking.

   Modules (in order):
     1. Helpers            6. Photo viewer      11. Finale
     2. Text + names       7. Love letter       12. Replay
     3. Photos             8. Cake + wish       13. Boot
     4. Particles          9. Confetti
     5. Gallery + reveals 10. Sound (music + chime)
   ===================================================================== */
(() => {
  'use strict';

  const C = window.BIRTHDAY_CONFIG;
  if (!C) {
    console.error('BIRTHDAY_CONFIG not found — check that js/config.js loads before js/script.js.');
    return;
  }

  /* ---------- 1. Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => min + Math.random() * (max - min);
  const toNepaliDigits = (v) => String(v).replace(/\d/g, (d) => '०१२३४५६७८९'[d]);
  const getPath = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), C);

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;
  const onMotionChange = (e) => { reduceMotion = e.matches; };
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
  else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

  const html = document.documentElement;
  const body = document.body;

  const state = {
    opening: false,
    opened: false,
    letterOpen: false,
    letterBusy: false,
    candlesOut: false,
    cakeBusy: false,
    finalePlayed: false,
    finaleRun: 0,
    musicReady: false,
    musicFailed: false,
    userMutedSound: false,
    resumeMusicOnShow: false
  };

  /** Jump to the top instantly (CSS smooth-scrolling would animate it). */
  function jumpToTop() {
    html.style.scrollBehavior = 'auto';
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
    catch (_) { window.scrollTo(0, 0); }
    // restore smooth scrolling for normal links a couple of frames later
    requestAnimationFrame(() => requestAnimationFrame(() => { html.style.scrollBehavior = ''; }));
  }

  /** Write text with "\n" turned into <br> — never uses innerHTML. */
  function setLines(el, text) {
    el.textContent = '';
    String(text).split('\n').forEach((line, i) => {
      if (i) el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(line));
    });
  }

  /* ---------- 2. Text + names ---------- */
  function bindText() {
    if (C.pageTitle) document.title = C.pageTitle;

    $$('[data-t]').forEach((el) => {
      const value = getPath(el.dataset.t);
      if (value == null || String(value).trim() === '') {
        el.hidden = true;
        return;
      }
      setLines(el, value);
    });

    const wife = (C.wifeName || '').trim();
    const sender = (C.senderName || '').trim();

    if (wife && C.hero.nameLine) {
      const nameEl = $('#hero-name');
      nameEl.textContent = C.hero.nameLine.replace('{name}', wife);
      nameEl.hidden = false;
    }
    if (sender) {
      ['#letter-sender', '#footer-sender'].forEach((sel) => {
        const el = $(sel);
        el.textContent = '— ' + sender;
        el.hidden = false;
      });
    }

    /* Letter: blank line = new paragraph */
    const letterBody = $('#letter-body');
    letterBody.textContent = '';
    String(C.letter.body || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((para) => {
        const p = document.createElement('p');
        setLines(p, para);
        letterBody.appendChild(p);
      });
  }

  /* ---------- 3. Photos ---------- */
  function getPhoto(n) {
    const p = C.photos && C.photos[n];
    if (!p) console.warn(`Photo ${n} is not defined in config.photos`);
    return p;
  }

  /**
   * Fill an <img> from a photo config entry.
   * - srcset lets phones use the lighter 1080px copy, big screens the original.
   * - width/height reserve space, so nothing jumps while loading.
   * - If the web copy is missing we fall back to the original;
   *   if the original is missing too, the frame shows a soft heart instead.
   */
  function applyPhoto(img, p, sizes) {
    if (!p) { markMissing(img); return; }
    img.alt = p.alt || '';
    img.width = p.width;
    img.height = p.height;
    if (p.focus) img.style.objectPosition = p.focus;
    if (p.web) {
      img.srcset = `${p.web} 1080w, ${p.file} ${p.width}w`;
      img.sizes = sizes;
      img.src = p.web;
    } else {
      img.src = p.file;
    }
    img.addEventListener('error', function onErr() {
      if (img.getAttribute('src') !== p.file) {
        console.warn(`Web copy missing, using original: ${p.file}`);
        img.removeAttribute('srcset');
        img.src = p.file;
        return;
      }
      img.removeEventListener('error', onErr);
      console.warn(`Photo not found: ${p.file}`);
      markMissing(img);
    });
  }

  function markMissing(img) {
    const frame = img.closest('[data-frame]') || img.parentElement;
    if (frame) frame.classList.add('is-missing');
    const btn = img.closest('button');
    if (btn) btn.disabled = true;
  }

  function setupPortraits() {
    const heroPhoto = getPhoto(C.hero.photo);
    const heroImg = $('#hero-img');
    $('#hero-arch').dataset.frame = '';
    if (heroPhoto) $('.hero__portrait').style.setProperty('--ar', (heroPhoto.width / heroPhoto.height).toFixed(4));
    applyPhoto(heroImg, heroPhoto, '(min-width: 900px) 440px, 74vw');

    const finPhoto = getPhoto(C.finale.photo);
    $('#finale-arch').dataset.frame = '';
    if (finPhoto) $('.finale__portrait').style.setProperty('--ar', (finPhoto.width / finPhoto.height).toFixed(4));
    applyPhoto($('#finale-img'), finPhoto, '(min-width: 900px) 360px, 64vw');
  }

  /* ---------- 4. Particles (CSS-animated, created once) ---------- */
  function makeDust(container, count, opacity = 0.7) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const d = rand(16, 30);
      s.className = 'dust';
      s.style.cssText =
        `--x:${rand(0, 100).toFixed(1)}%;--s:${rand(2, 4.2).toFixed(1)}px;--d:${d.toFixed(1)}s;` +
        `--delay:${(-rand(0, d)).toFixed(1)}s;--drift:${rand(-40, 40).toFixed(0)}px;--o:${(opacity * rand(0.5, 1)).toFixed(2)}`;
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  function makePetals(container, count) {
    if (!container || container.childElementCount) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const d = rand(12, 20);
      s.className = 'petal';
      s.style.cssText =
        `--x:${rand(-5, 100).toFixed(1)}%;--s:${rand(10, 16).toFixed(1)}px;--d:${d.toFixed(1)}s;` +
        `--delay:${(-rand(0, d)).toFixed(1)}s;--drift:${rand(-90, 90).toFixed(0)}px;opacity:${rand(0.55, 0.9).toFixed(2)}`;
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  /* ---------- 5. Gallery + scroll reveals ---------- */
  const galleryItems = (C.gallery && C.gallery.items) || [];
  let revealObserver = null;

  function buildGallery() {
    const list = $('#moments');
    const frag = document.createDocumentFragment();

    galleryItems.forEach((item, index) => {
      const p = getPhoto(item.photo);
      const layout = item.layout || 'split';
      const li = document.createElement('li');
      li.className = `moment moment--${layout}`;
      if (p) li.style.setProperty('--ar', (p.width / p.height).toFixed(4));

      const frame = document.createElement('div');
      frame.className = 'moment__frame';
      frame.dataset.frame = '';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'moment__open';
      btn.setAttribute('aria-label', `${C.viewer.open} ${item.title}`);
      btn.addEventListener('click', () => openViewer(index, btn));

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      applyPhoto(img, p, layout === 'wide' ? '(min-width: 900px) 1040px, 100vw' : '(min-width: 900px) 460px, 86vw');

      btn.appendChild(img);
      frame.appendChild(btn);

      const text = document.createElement('div');
      text.className = 'moment__text';
      const num = document.createElement('span');
      num.className = 'moment__num';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = toNepaliDigits(String(index + 1).padStart(2, '0'));
      const h3 = document.createElement('h3');
      h3.className = 'moment__title';
      h3.textContent = item.title;
      const line = document.createElement('p');
      line.className = 'moment__line';
      setLines(line, item.text);
      text.append(num, h3, line);

      li.append(frame, text);
      frag.appendChild(li);
    });

    list.appendChild(frag);
  }

  function setupReveals() {
    const targets = $$('.reveal, .moment');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => revealObserver.observe(t));
  }

  function resetReveals() {
    const targets = $$('.reveal, .moment');
    targets.forEach((t) => t.classList.remove('is-visible'));
    if (revealObserver) targets.forEach((t) => revealObserver.observe(t));
  }

  /* ---------- 6. Photo viewer ---------- */
  const viewer = $('#viewer');
  const viewerImg = $('#viewer-img');
  let viewerIndex = 0;
  let viewerTrigger = null;

  function showSlide(index) {
    const n = galleryItems.length;
    viewerIndex = (index + n) % n;
    const item = galleryItems[viewerIndex];
    const p = getPhoto(item.photo);
    const current = viewerIndex;

    $('#viewer-count').textContent = `${toNepaliDigits(viewerIndex + 1)} / ${toNepaliDigits(n)}`;
    $('#viewer-title').textContent = item.title;
    $('#viewer-text').textContent = item.text;
    if (!p) return;

    viewerImg.classList.add('is-changing');
    viewerImg.alt = p.alt || '';
    viewerImg.width = p.width;
    viewerImg.height = p.height;
    // Show the (already cached) web copy instantly, then swap in the full-quality original.
    viewerImg.onload = () => viewerImg.classList.remove('is-changing');
    viewerImg.onerror = () => viewerImg.classList.remove('is-changing');
    viewerImg.src = p.web || p.file;
    if (p.web) {
      const full = new Image();
      full.onload = () => { if (current === viewerIndex) viewerImg.src = p.file; };
      full.src = p.file;
    }
  }

  function openViewer(index, trigger) {
    viewerTrigger = trigger || null;
    showSlide(index);
    html.classList.add('is-viewer-open');
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    $('#viewer-close').focus();
  }

  function closeViewer() {
    if (typeof viewer.close === 'function') viewer.close();
    else { viewer.removeAttribute('open'); onViewerClosed(); }
  }

  function onViewerClosed() {
    html.classList.remove('is-viewer-open');
    if (viewerTrigger) viewerTrigger.focus({ preventScroll: true });
  }

  function setupViewer() {
    $('#viewer-close').addEventListener('click', closeViewer);
    $('#viewer-prev').addEventListener('click', () => showSlide(viewerIndex - 1));
    $('#viewer-next').addEventListener('click', () => showSlide(viewerIndex + 1));
    viewer.addEventListener('close', onViewerClosed);

    // Tap on empty space closes
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer || e.target.classList.contains('viewer__inner') || e.target.classList.contains('viewer__figure')) closeViewer();
    });
    viewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(viewerIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(viewerIndex + 1); }
    });

    // Swipe left / right
    let sx = 0, sy = 0, tracking = false;
    viewerImg.addEventListener('pointerdown', (e) => { tracking = true; sx = e.clientX; sy = e.clientY; });
    viewerImg.addEventListener('pointerup', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) showSlide(viewerIndex + (dx < 0 ? 1 : -1));
    });
    viewerImg.addEventListener('pointercancel', () => { tracking = false; });
    viewerImg.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* ---------- 7. Love letter ---------- */
  const envelopeWrap = $('#envelope-wrap');
  const envelope = $('#envelope');
  const letterBtn = $('#letter-btn');
  const paper = $('#letter-paper');

  function setLetterExpanded(v) {
    envelope.setAttribute('aria-expanded', String(v));
    letterBtn.setAttribute('aria-expanded', String(v));
  }

  async function openLetter() {
    if (state.letterOpen || state.letterBusy) return;
    state.letterBusy = true;
    setLetterExpanded(true);
    envelope.classList.add('is-open');
    await wait(reduceMotion ? 150 : 1500);
    envelopeWrap.classList.add('is-done');
    await wait(reduceMotion ? 0 : 450);
    envelopeWrap.hidden = true;
    paper.hidden = false;
    paper.classList.remove('is-folding', 'is-unfolded');
    paper.classList.add('is-unfolding');
    paper.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    paper.focus({ preventScroll: true });
    await wait(reduceMotion ? 50 : 1400);
    paper.classList.remove('is-unfolding');
    paper.classList.add('is-unfolded');
    state.letterOpen = true;
    state.letterBusy = false;
  }

  function resetLetterUI() {
    paper.hidden = true;
    paper.classList.remove('is-folding', 'is-unfolding', 'is-unfolded');
    envelopeWrap.hidden = false;
    envelopeWrap.classList.remove('is-done');
    envelope.classList.remove('is-open');
    setLetterExpanded(false);
    state.letterOpen = false;
    state.letterBusy = false;
  }

  async function closeLetter() {
    if (!state.letterOpen || state.letterBusy) return;
    state.letterBusy = true;
    paper.classList.add('is-folding');
    await wait(reduceMotion ? 50 : 650);
    resetLetterUI();
    envelopeWrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    letterBtn.focus({ preventScroll: true });
  }

  function setupLetter() {
    envelope.addEventListener('click', openLetter);
    letterBtn.addEventListener('click', openLetter);
    $('#letter-close').addEventListener('click', closeLetter);
  }

  /* ---------- 8. Cake + wish ---------- */
  const cakeStage = $('#cake-stage');
  const candleBtn = $('#candle-btn');
  const candleLabel = $('#candle-btn-label');
  const wishInner = $('#wish-inner');

  async function blowCandles() {
    state.cakeBusy = true;
    cakeStage.classList.add('is-blown');
    playChime();
    await wait(reduceMotion ? 60 : 420);
    if (!reduceMotion) {
      const r = $('#cake').getBoundingClientRect();
      burstConfetti(r.left + r.width / 2, r.top + r.height * 0.22);
    }
    wishInner.hidden = false;
    requestAnimationFrame(() => wishInner.classList.add('is-in'));
    setLines(candleLabel, C.cake.relightButton || C.cake.button);
    state.candlesOut = true;
    await wait(reduceMotion ? 100 : 900);
    state.cakeBusy = false;
  }

  function relightCandles() {
    cakeStage.classList.remove('is-blown');
    wishInner.classList.remove('is-in');
    wishInner.hidden = true;
    setLines(candleLabel, C.cake.button);
    state.candlesOut = false;
  }

  function setupCake() {
    candleBtn.addEventListener('click', () => {
      if (state.cakeBusy) return;
      if (state.candlesOut) relightCandles();
      else blowCandles();
    });
  }

  /* ---------- 9. Confetti (short burst, then the canvas is removed) ---------- */
  function burstConfetti(ox, oy) {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti';
    canvas.setAttribute('aria-hidden', 'true');
    body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#E8C98B', '#F4DCA6', '#E88CA7', '#F5CCD5', '#FFF3E8', '#C9577E', '#D7AE6A'];
    const count = W < 500 ? 120 : 180;
    const parts = [];
    for (let i = 0; i < count; i++) {
      const angle = (-90 + rand(-58, 58)) * Math.PI / 180;
      const speed = rand(6, 15) * (W < 500 ? 0.9 : 1.1);
      const r = Math.random();
      parts.push({
        x: ox + rand(-20, 20), y: oy + rand(-10, 10),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        g: rand(0.18, 0.28), rot: rand(0, Math.PI * 2), vr: rand(-0.2, 0.2),
        w: rand(6, 11), h: rand(3, 7), wob: rand(0, 10), wobS: rand(0.05, 0.12),
        shape: r < 0.14 ? 'heart' : r < 0.45 ? 'dot' : 'ribbon',
        color: colors[(Math.random() * colors.length) | 0]
      });
    }

    const heart = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.45, -s, 0, -s * 0.45);
      ctx.bezierCurveTo(s * 0.45, -s, s, -s * 0.3, 0, s * 0.35);
      ctx.fill();
    };

    const DURATION = 4200;
    const start = performance.now();
    let last = start;

    function frame(now) {
      const t = now - start;
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const fade = t > DURATION - 1200 ? Math.max(0, (DURATION - t) / 1200) : 1;
      let alive = 0;
      for (const p of parts) {
        p.vx *= Math.pow(0.985, dt);
        p.vy = p.vy * Math.pow(0.985, dt) + p.g * dt;
        if (p.vy > 3.2) p.vy = 3.2;              // gentle terminal velocity = slow, floaty fall
        p.wob += p.wobS * dt;
        p.x += (p.vx + Math.sin(p.wob) * 0.6) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 30) continue;
        alive++;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'dot') {
          ctx.beginPath(); ctx.arc(0, 0, p.h * 0.55, 0, Math.PI * 2); ctx.fill();
        } else if (p.shape === 'heart') {
          heart(p.w * 0.75);
        } else {
          ctx.scale(1, Math.abs(Math.cos(p.wob)) * 0.8 + 0.2);   // ribbon flutter
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      if (t < DURATION && alive > 0) requestAnimationFrame(frame);
      else canvas.remove();
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 10. Sound ---------- */
  const audio = $('#music');
  const musicBtn = $('#music-btn');
  const musicLabel = $('#music-label');
  let fadeTimer = null;

  function setMusicUI(playing) {
    musicBtn.setAttribute('aria-pressed', String(playing));
    musicLabel.textContent = playing ? C.music.pauseLabel : C.music.playLabel;
  }

  function fadeVolume(to, ms, done) {
    clearInterval(fadeTimer);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      try { audio.volume = Math.min(1, Math.max(0, from + (to - from) * (i / steps))); } catch (_) { /* iOS: volume is read-only */ }
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, 50);
  }

  function playMusic() {
    if (!C.music || !C.music.src || state.musicFailed) return;
    try { audio.volume = 0; } catch (_) {}
    const p = audio.play();
    setMusicUI(true);
    const onStarted = () => fadeVolume(C.music.volume ?? 0.5, 1800);
    if (p && typeof p.then === 'function') {
      p.then(onStarted).catch((err) => {
        // Autoplay refused or file unusable: stay quiet, keep the button usable.
        console.info('Music did not start:', err && err.name);
        setMusicUI(false);
      });
    } else onStarted();
  }

  function pauseMusic() {
    setMusicUI(false);
    fadeVolume(0, 400, () => audio.pause());
  }

  function setupMusic() {
    if (!C.music || !C.music.src) return;   // no file configured → no button, no request
    audio.src = C.music.src;
    audio.preload = 'metadata';
    setMusicUI(false);
    audio.addEventListener('loadedmetadata', () => {
      state.musicReady = true;
      if (state.opened) musicBtn.hidden = false;
    }, { once: true });
    audio.addEventListener('error', () => {
      state.musicFailed = true;
      musicBtn.hidden = true;
      console.warn(`Music file not found or unsupported: ${C.music.src}`);
    }, { once: true });
    audio.load();

    musicBtn.addEventListener('click', () => {
      if (audio.paused || musicBtn.getAttribute('aria-pressed') === 'false') {
        state.userMutedSound = false;
        playMusic();
      } else {
        state.userMutedSound = true;
        pauseMusic();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !audio.paused) { state.resumeMusicOnShow = true; audio.pause(); }
      else if (!document.hidden && state.resumeMusicOnShow) { state.resumeMusicOnShow = false; playMusic(); }
    });
  }

  /* Soft bell chime made in the browser — no audio file, no copyright. */
  let audioCtx = null;
  function playChime() {
    if (!C.sound || !C.sound.celebrationChime || state.userMutedSound) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      audioCtx = audioCtx || new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime + 0.02;
      const master = audioCtx.createGain();
      master.gain.value = 0.55;
      master.connect(audioCtx.destination);
      [783.99, 987.77, 1174.66, 1567.98].forEach((freq, i) => {
        const t = now + i * 0.12;
        [[freq, 0.09, 'sine'], [freq * 2.01, 0.025, 'sine'], [freq * 3, 0.01, 'triangle']].forEach(([f, peak, type]) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = type;
          osc.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
          osc.connect(g).connect(master);
          osc.start(t);
          osc.stop(t + 1.9);
        });
      });
    } catch (err) {
      console.info('Chime unavailable:', err && err.name);
    }
  }

  /* ---------- 11. Finale ---------- */
  const finale = $('#finale');

  function playFinale() {
    if (state.finalePlayed) return;
    state.finalePlayed = true;
    const run = ++state.finaleRun;
    finale.classList.add('is-playing');
    if (!reduceMotion) makePetals($('#finale-petals'), 9);
    // line 1 → a breath of silence → line 2 → headline → message → replay button
    const times = reduceMotion ? [200, 1900, 2700, 3200, 3700] : [700, 3600, 5200, 6400, 7600];
    $$('.finale__step', finale).forEach((step, i) => {
      setTimeout(() => { if (run === state.finaleRun) step.classList.add('is-in'); }, times[i] ?? times[times.length - 1]);
    });
  }

  function resetFinale() {
    state.finaleRun++;
    state.finalePlayed = false;
    finale.classList.remove('is-playing');
    $$('.finale__step', finale).forEach((s) => s.classList.remove('is-in'));
    $('#finale-petals').textContent = '';
  }

  function setupFinale() {
    if (!('IntersectionObserver' in window)) { playFinale(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting && state.opened) playFinale(); });
    }, { threshold: 0.3 });
    io.observe(finale);
  }

  /* ---------- 12. Opening + replay ---------- */
  const intro = $('#intro');
  const introBtn = $('#intro-btn');
  const main = $('#main');

  function lockPage(locked) {
    html.classList.toggle('is-locked', locked);
    if (locked) main.setAttribute('inert', '');
    else main.removeAttribute('inert');
    main.inert = locked;
  }

  async function openSurprise() {
    if (state.opening || state.opened) return;
    state.opening = true;

    // Music may only start inside a real tap — so this must run before any await.
    if (C.music && C.music.startOnOpen && C.music.src) { state.userMutedSound = false; playMusic(); }

    intro.classList.add('is-opening');
    await wait(reduceMotion ? 60 : 650);

    jumpToTop();
    lockPage(false);
    body.classList.add('is-open');
    intro.classList.add('is-leaving');

    await wait(reduceMotion ? 260 : 950);
    intro.hidden = true;
    intro.classList.remove('is-opening', 'is-leaving', 'is-skipped');
    state.opening = false;
    state.opened = true;
    if (state.musicReady && !state.musicFailed) musicBtn.hidden = false;
    $('#hero-title').focus({ preventScroll: true });
  }

  function replay() {
    resetLetterUI();
    relightCandles();
    resetFinale();
    if (viewer.open) closeViewer();

    state.opened = false;
    body.classList.remove('is-open');
    jumpToTop();
    lockPage(true);
    resetReveals();

    intro.hidden = false;           // display:none → visible restarts every CSS animation
    introBtn.focus({ preventScroll: true });
  }

  function setupIntro() {
    if (!reduceMotion) {
      makePetals($('#intro-petals'), 14);
      makeDust($('#intro-dust'), 22, 0.85);
      makeDust($('#ambient-dust'), 14, 0.5);
    }
    // Tap anywhere on the opening = show everything now (no forced waiting).
    intro.addEventListener('click', (e) => {
      if (!e.target.closest('#intro-btn')) intro.classList.add('is-skipped');
    });
    introBtn.addEventListener('click', openSurprise);
    $('#replay-btn').addEventListener('click', replay);
  }

  /* ---------- 13. Boot ---------- */
  function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    jumpToTop();
    lockPage(true);

    bindText();
    setupPortraits();
    buildGallery();
    setupReveals();
    setupViewer();
    setupLetter();
    setupCake();
    setupFinale();
    setupMusic();
    setupIntro();
  }

  boot();
})();
