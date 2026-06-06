export default async function homePage(ctx) {
  const { root, go, onCleanup } = ctx;
  const cleanup = [];
  let isDead = false;
  const markDead = () => { isDead = true; };
  const safeRun = (fn) => { if (isDead) return; try { fn(); } catch (e) { console.warn(e); } };

  // ═══════════════════════════════════════════════════
  // 1. META & SEO
  // ═══════════════════════════════════════════════════
  const setMeta = (name, content) => {
    let el = document.head.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  };
  const setMetaProperty = (property, content) => {
    let el = document.head.querySelector(`meta[property="${property}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.setAttribute('content', content);
  };
  setMeta('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
  setMeta('theme-color', '#0F2854');
  setMeta('description', 'OraaSlayer - المنصة العربية الأولى للأنمي');
  setMetaProperty('og:title', 'OraaSlayer | الرئيسية');
  setMetaProperty('og:description', 'المنصة العربية الأولى للأنمي');
  document.title = 'OraaSlayer | الرئيسية';
  window.scrollTo({ top: 0, behavior: 'instant' });

  // ═══════════════════════════════════════════════════
  // 2. FONT LOADING
  // ═══════════════════════════════════════════════════
  if (!document.getElementById('font-cairo')) {
    const link = document.createElement('link');
    link.id = 'font-cairo';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap';
    document.head.appendChild(link);
  }

  // ═══════════════════════════════════════════════════
  // 3. HTML + CSS (full layout, fixed)
  // ═══════════════════════════════════════════════════
  root.innerHTML = `
<style>
  :root {
    --c1: #0F2854; --c2: #1C4D8D; --c3: #4988C4; --c4: #BDE8F5;
    --gold: #FFCA28; --gold-soft: rgba(255, 202, 40, 0.15);
    --text: #FFFFFF; --text-dim: rgba(255, 255, 255, 0.82);
    --bg-card: rgba(15, 40, 84, 0.6); --border-subtle: rgba(189, 232, 245, 0.15);
    --role-vip: #FFCA28; --role-admin: #FF5C7A; --role-manager: #5CD6FF;
    --role-staff: #B78BFF; --role-member: #7BA6FF; --role-guest: #B6C2D1;
    --role-accent: var(--role-guest); --role-accent-soft: rgba(182, 194, 209, 0.28);
    --header-h: clamp(56px, 7vw, 68px);
    --footer-h: clamp(64px, 8.5vw, 76px);
    --sidebar-w: clamp(220px, 20vw, 280px);
    --content-max: 1500px;
    --page-pad: clamp(0.5rem, 1.5vw, 1.2rem);
    --card-min: clamp(140px, 18vw, 185px);
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --app-height: 100dvh;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { scroll-behavior: smooth; width: 100%; max-width: 100%; }
  body {
    font-family: 'Cairo', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    color: var(--text); direction: rtl;
    min-height: var(--app-height); overflow-x: hidden;
    background-color: var(--c1);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%; text-size-adjust: 100%;
    touch-action: pan-y; overscroll-behavior-y: auto;
  }
  img, video, iframe, canvas, svg { max-width: 100%; height: auto; display: block; }
  button, a, input, .anime-card, .slide, .user-profile, .menu-btn, .nav-item,
  .ds-link, .ms-link, .dot, .close-btn, .filter-toggle-btn, .slider-nav, .account-action,
  .fp-chip, .fp-apply, .fp-reset, .suggestion-item, .search-clear, .dts-close, .logo-link {
    touch-action: manipulation; -webkit-user-select: none; user-select: none;
  }

  /* ===== Background ===== */
  .animated-bg {
    position: fixed; inset: 0; z-index: -2;
    background:
      radial-gradient(1100px circle at 15% 15%, rgba(73,136,196,0.2), transparent 35%),
      radial-gradient(900px circle at 85% 10%, rgba(255,202,40,0.1), transparent 28%),
      linear-gradient(160deg, var(--c1) 0%, #0a1a3a 40%, var(--c2) 70%, #0d2248 100%);
    will-change: background-position;
  }
  .pixel-container { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; display: none; }
  @media (min-width: 768px) {
    .pixel-container { display: block; }
    .animated-bg {
      background:
        radial-gradient(1100px circle at 15% 15%, rgba(73,136,196,0.2), transparent 35%),
        radial-gradient(900px circle at 85% 10%, rgba(255,202,40,0.1), transparent 28%),
        linear-gradient(-45deg, var(--c1), var(--c2), var(--c3), var(--c4));
      background-size: 400% 400%;
      animation: gradientFlow 25s ease infinite;
    }
  }
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .pixel { position: absolute; background: rgba(189,232,245,0.1); bottom: -150px; border-radius: 4px; animation: floatUp 30s linear infinite; contain: layout style paint; will-change: transform; }
  .pixel:nth-child(1) { left: 10%; width: 40px; height: 40px; animation-delay: 0s; opacity: 0.3; }
  .pixel:nth-child(2) { left: 40%; width: 25px; height: 25px; animation-delay: 8s; }
  .pixel:nth-child(3) { left: 70%; width: 35px; height: 35px; animation-delay: 15s; opacity: 0.25; }
  @keyframes floatUp {
    0% { transform: translate3d(0,0,0) rotate(0); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translate3d(0,-1100px,0) rotate(360deg); opacity: 0; }
  }

  /* ===== Skip Link ===== */
  .skip-nav {
    position: absolute; top: -100px; left: 0;
    background: var(--gold); color: #000;
    padding: 8px 16px; z-index: 10000;
    font-weight: 800; transition: top 0.2s;
    border-radius: 0 0 8px 0;
  }
  .skip-nav:focus { top: 0; }

  /* ===== Header ===== */
  .main-header {
    position: fixed; top: 0; left: 0; right: 0;
    height: calc(var(--header-h) + var(--safe-top));
    padding-top: var(--safe-top);
    background: rgba(10, 26, 58, 0.55);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    display: flex; align-items: center; justify-content: space-between;
    gap: 0.6rem; padding-inline: var(--page-pad);
    z-index: 1000;
    contain: layout paint style;
    transition: background 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .main-header::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,202,40,0.45), transparent);
    pointer-events: none; opacity: 0; transition: opacity 0.3s ease;
  }
  .main-header--scrolled { background: rgba(8, 20, 48, 0.95); box-shadow: 0 8px 32px rgba(0,0,0,0.55); border-bottom-color: rgba(255,255,255,0.08); }
  .main-header--scrolled::after { opacity: 1; }
  .header-flex { display: flex; align-items: center; gap: 0.7rem; min-width: 0; }
  .menu-btn {
    width: 40px; height: 40px; border-radius: 13px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--c4);
    transition: all 0.2s var(--ease-out); flex-shrink: 0;
  }
  @media (min-width: 1024px) { .menu-btn { display: none; } }
  .menu-btn:active { transform: scale(0.94); background: rgba(255,255,255,0.15); }
  .menu-btn svg { width: 20px; height: 20px; stroke-width: 2; }
  .logo-link { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; min-width: 0; transition: opacity 0.2s; }
  .logo-link:active { opacity: 0.7; }
  .logo-text {
    font-size: clamp(0.95rem, 2vw, 1.25rem); font-weight: 900;
    color: var(--c4); text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: clamp(110px, 30vw, 260px); letter-spacing: 0.2px;
  }
  .slider-toggle-btn {
    width: 40px; height: 40px; border-radius: 13px;
    background: rgba(255,202,40,0.1); border: 1px solid rgba(255,202,40,0.2);
    display: none; align-items: center; justify-content: center;
    cursor: pointer; color: var(--gold);
    transition: all 0.25s var(--ease-out); flex-shrink: 0; position: relative;
  }
  .slider-toggle-btn:hover { background: rgba(255,202,40,0.2); transform: translateY(-1px); }
  .slider-toggle-btn:active { transform: scale(0.94); }
  .slider-toggle-btn svg { width: 20px; height: 20px; stroke-width: 2; }
  .slider-toggle-btn.active { background: rgba(255,202,40,0.28); box-shadow: 0 0 16px rgba(255,202,40,0.3); border-color: rgba(255,202,40,0.4); }
  @media (min-width: 1024px) { .slider-toggle-btn { display: flex; } }

  /* ===== Desktop News Slider ===== */
  .desktop-top-slider {
    position: fixed; top: calc(var(--header-h) + var(--safe-top) + 6px);
    left: 10px; right: calc(var(--sidebar-w) + 10px);
    background: rgba(10, 28, 60, 0.92);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(189,232,245,0.12);
    z-index: 999; padding: 12px var(--page-pad);
    transform: translate3d(0, -20px, 0) scale(0.98);
    opacity: 0; visibility: hidden;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    display: none; box-shadow: 0 16px 48px rgba(0,0,0,0.6);
    border-radius: 18px; pointer-events: none;
  }
  @media (min-width: 1024px) {
    .desktop-top-slider { display: block; }
    .desktop-top-slider.open { transform: translate3d(0,0,0) scale(1); opacity: 1; visibility: visible; pointer-events: auto; }
  }
  .dts-inner { max-width: var(--content-max); margin: 0 auto; display: flex; align-items: center; gap: 16px; }
  .dts-label { font-size: 0.72rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
  .dts-track { flex: 1; overflow: hidden; position: relative; mask-image: linear-gradient(to left, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(to left, transparent, black 8%, black 92%, transparent); }
  .dts-content { display: flex; gap: 20px; animation: dtsScroll 35s linear infinite; width: max-content; will-change: transform; }
  @keyframes dtsScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .dts-item { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 999px; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); white-space: nowrap; cursor: pointer; transition: all 0.2s ease; }
  .dts-item:hover { background: rgba(255,202,40,0.12); border-color: rgba(255,202,40,0.3); color: var(--gold); }
  .dts-item .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #66ff9a; box-shadow: 0 0 10px rgba(102,255,154,0.8); animation: pulse-glow 1.5s infinite; }
  .dts-close { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-dim); transition: all 0.2s; flex-shrink: 0; }
  .dts-close:hover { background: rgba(255,92,122,0.18); color: #FF5C7A; border-color: rgba(255,92,122,0.3); }

  /* ===== User Profile (header) ===== */
  .user-profile {
    display: flex; align-items: center; flex-direction: row; gap: 0.6rem;
    padding: 5px 10px 5px 12px; border-radius: 999px;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    cursor: pointer;
    border: 1.5px solid var(--role-accent-soft);
    transition: all 0.25s var(--ease-out);
    position: relative; max-width: min(42vw, 320px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
  .user-profile:hover {
    background: rgba(0,0,0,0.4);
    border-color: var(--role-accent);
    box-shadow: 0 0 0 2px var(--role-accent-soft), 0 10px 28px rgba(0,0,0,0.3), 0 0 20px var(--role-accent-soft);
    transform: translateY(-1px);
  }
  .avatar-wrap {
    width: 36px; height: 36px; border-radius: 50%;
    overflow: hidden; border: 2px solid var(--role-accent);
    box-shadow: 0 0 14px var(--role-accent-soft);
    flex-shrink: 0; background: rgba(255,255,255,0.08);
    transition: box-shadow 0.3s ease;
  }
  .user-profile:hover .avatar-wrap { box-shadow: 0 0 20px var(--role-accent-soft), 0 0 30px rgba(255,202,40,0.1); }
  .avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .user-details { display: flex; flex-direction: column; min-width: 0; line-height: 1.05; }
  .user-line { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; }
  .user-name { font-size: 0.84rem; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: clamp(70px, 12vw, 120px); text-shadow: 0 0 8px var(--role-accent-soft); transition: text-shadow 0.3s ease; }
  .role-badge { display: inline-flex; align-items: center; justify-content: center; padding: 3px 9px; border-radius: 999px; font-size: 0.58rem; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; border: 1px solid transparent; white-space: nowrap; line-height: 1; box-shadow: 0 6px 16px rgba(0,0,0,0.14); }
  .role-badge.role-vip { background: rgba(255,202,40,0.18); color: var(--role-vip); border-color: rgba(255,202,40,0.4); }
  .role-badge.role-admin { background: rgba(255,92,122,0.18); color: var(--role-admin); border-color: rgba(255,92,122,0.4); }
  .role-badge.role-manager { background: rgba(92,214,255,0.18); color: var(--role-manager); border-color: rgba(92,214,255,0.4); }
  .role-badge.role-staff { background: rgba(183,139,255,0.18); color: var(--role-staff); border-color: rgba(183,139,255,0.4); }
  .role-badge.role-member { background: rgba(123,166,255,0.18); color: var(--role-member); border-color: rgba(123,166,255,0.4); }
  .role-badge.role-guest { background: rgba(182,194,209,0.14); color: var(--role-guest); border-color: rgba(182,194,209,0.25); }
  .user-role { font-size: 0.62rem; color: rgba(255,255,255,0.72); font-weight: 600; white-space: nowrap; margin-top: 2px; text-align: right; }

  /* ===== Account Popover ===== */
  .account-popover {
    position: fixed; top: calc(var(--header-h) + var(--safe-top) + 10px);
    inset-inline-end: var(--page-pad); width: min(92vw, 350px);
    opacity: 0; visibility: hidden;
    transform: translate3d(0, -12px, 0) scale(0.97);
    transform-origin: top left;
    transition: opacity 0.25s ease, transform 0.28s var(--ease-spring), visibility 0.25s;
    z-index: 1600; direction: rtl; text-align: right;
  }
  @media (min-width: 1024px) { .account-popover { transform-origin: top right; } }
  .account-popover.show { opacity: 1; visibility: visible; transform: translate3d(0,0,0) scale(1); }
  .account-card {
    background: rgba(8,20,48,0.94);
    border: 1.5px solid var(--role-accent-soft);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border-radius: 22px; box-shadow: 0 28px 70px rgba(0,0,0,0.55), 0 0 20px var(--role-accent-soft);
    overflow: hidden; direction: rtl; text-align: right;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .account-head {
    display: flex; align-items: center; flex-direction: row; gap: 12px;
    padding: 16px;
    background: radial-gradient(800px circle at 25% 10%, rgba(255,255,255,0.08), transparent 35%), linear-gradient(135deg, color-mix(in srgb, var(--role-accent) 20%, transparent), rgba(255,202,40,0.05));
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .account-avatar {
    width: 56px; height: 56px; border-radius: 18px; overflow: hidden; flex-shrink: 0;
    border: 2.5px solid var(--role-accent);
    box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 0 18px var(--role-accent-soft);
  }
  .account-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .account-meta { min-width: 0; flex: 1; }
  .account-meta .name { font-size: 1rem; font-weight: 900; color: #fff; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 12px var(--role-accent-soft); }
  .account-meta .sub { font-size: 0.72rem; color: rgba(255,255,255,0.72); margin-top: 2px; }
  .account-meta .badge-row { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
  .account-actions { padding: 12px; display: grid; gap: 8px; }
  .account-action {
    display: flex; align-items: center; flex-direction: row; gap: 10px;
    width: 100%; border: 0; border-radius: 15px;
    padding: 13px 14px; text-decoration: none; color: #fff;
    cursor: pointer; font-family: inherit; font-weight: 800; font-size: 0.9rem;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.15s ease, background 0.18s ease, border-color 0.18s ease, opacity 0.15s ease;
    text-align: right;
  }
  .account-action:hover { background: rgba(189,232,245,0.12); border-color: rgba(255,202,40,0.22); transform: translateY(-1px); }
  .account-action svg { width: 18px; height: 18px; flex-shrink: 0; }
  .account-action.primary { background: linear-gradient(180deg, rgba(255,202,40,0.95), rgba(255,180,20,0.95)); color: #08111f; border-color: transparent; box-shadow: 0 4px 14px rgba(255,202,40,0.25); }
  .account-action.danger { background: rgba(255,92,122,0.14); color: #ff8aa0; border-color: rgba(255,92,122,0.22); }
  .account-action.danger:hover { background: rgba(255,92,122,0.22); }
  .account-action.locked { opacity: 0.55; cursor: not-allowed; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.05); transform: none !important; }
  .action-label { flex: 1; min-width: 0; }
  .locked-tag { font-size: 0.62rem; font-weight: 800; color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 3px 7px; border-radius: 999px; white-space: nowrap; }
  .account-foot { padding: 12px 16px 16px; font-size: 0.68rem; color: rgba(255,255,255,0.45); border-top: 1px solid rgba(255,255,255,0.05); }

  /* ===== News Ticker ===== */
  .news-ticker {
    background: rgba(10, 25, 50, 0.35);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    margin: 0 var(--page-pad); border-radius: 13px;
    padding: 8px 0; overflow: hidden; border: 1px solid rgba(255,202,40,0.08);
    contain: layout paint;
  }
  .ticker-content {
    display: inline-block; white-space: nowrap;
    animation: tickerScroll 35s linear infinite;
    font-size: 0.8rem; font-weight: 700; color: var(--gold);
    padding-left: 100%; will-change: transform;
    text-shadow: 0 0 8px rgba(255,202,40,0.15);
  }
  @keyframes tickerScroll { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-100%,0,0); } }

  /* ===== Main content area ===== */
  .main-content {
    padding-top: calc(var(--header-h) + var(--safe-top));
    padding-bottom: calc(var(--footer-h) + var(--safe-bottom) + 12px);
    min-height: var(--app-height); transition: none;
  }
  @media (min-width: 1024px) {
    .main-content { padding-right: var(--sidebar-w); padding-bottom: 0; min-height: 100vh; }
  }

  /* ===== Hero / Slider ===== */
  .hero-section { padding: 0; opacity: 0; transition: opacity 0.5s var(--ease-out); }
  .hero-section.ready { opacity: 1; }
  .hero-shell { margin: 0; overflow: hidden; position: relative; background: var(--c1); border: none; box-shadow: none; border-radius: 0; }
  .slider-container {
    position: relative; width: 100%; height: clamp(180px, 42vw, 420px);
    overflow: hidden; background: rgba(15,40,84,0.5);
    contain: strict; touch-action: pan-y; isolation: isolate;
  }
  .slider-skeleton {
    width: 100%; height: 100%;
    background: linear-gradient(90deg, rgba(15,40,84,0.6) 0%, rgba(28,77,141,0.6) 50%, rgba(15,40,84,0.6) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end; padding: 20px;
  }
  .slider-skeleton-text { width: 100%; }
  .slider-skeleton-line { height: 14px; border-radius: 6px; background: rgba(255,255,255,0.08); margin-bottom: 8px; animation: pulse 1.4s ease infinite; }
  .slider-skeleton-line.w60 { width: 60%; }
  .slider-skeleton-line.w40 { width: 40%; height: 10px; }
  @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .slider-track { display: flex; height: 100%; transition: transform 0.65s cubic-bezier(0.45,0,0.55,1); will-change: transform; transform: translate3d(0,0,0); position: relative; z-index: 2; direction: ltr; }
  .slide { flex: 0 0 100%; position: relative; cursor: pointer; overflow: hidden; -webkit-user-select: none; user-select: none; contain: layout style paint; }
  .slide::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,16,36,1) 0%, rgba(6,16,36,0.65) 35%, rgba(6,16,36,0.2) 60%, transparent 80%); pointer-events: none; z-index: 2; }
  .slide-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: saturate(1.1) contrast(1.05); pointer-events: none; transition: transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94); will-change: transform; }
  .slide:hover .slide-media { transform: scale(1.05); }
  .slide-content { position: absolute; bottom: 20px; right: 20px; left: 20px; z-index: 5; transform: translateZ(0); }
  .slide-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 0.62rem; font-weight: 800; background: rgba(255,202,40,0.95); color: #000; margin-left: 4px; box-shadow: 0 2px 6px rgba(255,202,40,0.3); }
  .slide-title { font-size: clamp(1.02rem, 2vw, 1.25rem); font-weight: 900; color: #fff; margin-bottom: 5px; text-shadow: 0 2px 12px rgba(0,0,0,0.65); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .slide-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .slide-meta-chip { display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 999px; font-size: 0.58rem; font-weight: 800; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.86); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .slider-dots { position: absolute; bottom: 10px; left: 50%; transform: translate3d(-50%, 0, 0); display: flex; gap: 8px; z-index: 10; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: width 0.3s var(--ease-out), background 0.3s; padding: 0; will-change: width; }
  .dot.active { background: var(--gold); width: 22px; border-radius: 4px; box-shadow: 0 0 12px var(--gold); }

  .slider-nav {
    position: absolute; top: 50%; transform: translate3d(0, -50%, 0);
    z-index: 15; width: 46px; height: 46px; border-radius: 50%;
    background: rgba(10, 28, 60, 0.7);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; opacity: 0;
    transition: opacity 0.25s ease, background 0.2s, transform 0.2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
    will-change: opacity, transform;
  }
  .slider-container:hover .slider-nav { opacity: 1; }
  .slider-nav:hover { background: rgba(255,202,40,0.35); border-color: rgba(255,202,40,0.5); }
  .slider-nav:active { transform: translate3d(0, -50%, 0) scale(0.9); }
  .slider-nav.prev { right: auto; left: 12px; }
  .slider-nav.next { right: 12px; left: auto; }
  .slider-nav svg { width: 22px; height: 22px; color: #fff; stroke-width: 2; transition: color 0.2s ease; pointer-events: none; }
  .slider-nav:hover svg { color: var(--gold); }
  @media (max-width: 768px) {
    .slider-nav { opacity: 0.8; pointer-events: auto; width: 36px; height: 36px; border-radius: 12px; }
    .slider-nav.prev { left: 8px; } .slider-nav.next { right: 8px; }
    .slider-nav svg { width: 18px; height: 18px; }
  }

  /* ===== Search & Filter (sticky) ===== */
  .search-filter-sticky {
    position: sticky; top: calc(var(--header-h) + var(--safe-top));
    z-index: 50;
    background: rgba(10, 25, 55, 0.7);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    padding-top: 0.8rem; padding-bottom: 0.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    contain: layout style;
  }
  .search-section { padding: 0 var(--page-pad); position: relative; }
  .search-wrapper { position: relative; display: flex; gap: 10px; }
  .search-input-container { flex: 1; position: relative; }
  .search-input {
    width: 100%; padding: 12px 42px 12px 42px; border-radius: 16px;
    border: 1.5px solid rgba(255,255,255,0.08);
    background: rgba(15,40,84,0.4); color: white;
    font-family: 'Cairo'; font-size: clamp(1rem, 2vw, 1.05rem);
    font-weight: 600; outline: none;
    transition: all 0.2s var(--ease-out);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .search-input::placeholder { color: rgba(255,255,255,0.45); }
  .search-input:focus { border-color: rgba(255,202,40,0.6); background: rgba(15,40,84,0.55); box-shadow: 0 0 20px rgba(255,202,40,0.12), inset 0 0 20px rgba(255,202,40,0.03); }
  .search-icon { position: absolute; right: 14px; top: 50%; transform: translate3d(0, -50%, 0); color: var(--gold); pointer-events: none; }
  .search-spinner {
    position: absolute; left: 12px; top: 50%;
    transform: translate3d(0, -50%, 0); width: 18px; height: 18px;
    border: 2px solid rgba(189,232,245,0.2); border-top-color: var(--gold);
    border-radius: 50%; animation: spin 0.6s linear infinite;
    display: none; will-change: transform;
  }
  .search-spinner.active { display: block; }
  .search-clear { position: absolute; left: 38px; top: 50%; transform: translate3d(0, -50%, 0); background: none; border: none; color: rgba(255,255,255,0.35); cursor: pointer; font-size: 1.15rem; padding: 4px; display: none; transition: color 0.2s ease; }
  .search-clear:hover { color: white; }
  .search-clear.active { display: block; }
  @keyframes spin { to { transform: translate3d(0, -50%, 0) rotate(360deg); } }

  .filter-toggle-btn {
    width: 48px; height: 48px; border-radius: 16px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--c4);
    transition: all 0.2s var(--ease-out); flex-shrink: 0;
    box-shadow: 0 8px 22px rgba(0,0,0,0.1); position: relative;
  }
  .filter-toggle-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--gold); color: var(--gold); }
  .filter-toggle-btn.has-filters::after { content: ''; position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 8px var(--gold); }

  /* ===== Filter Popover ===== */
  .filter-popover {
    position: absolute; top: 110%; left: 0;
    width: min(95vw, 380px);
    background: rgba(10, 25, 55, 0.95);
    backdrop-filter: blur(36px) saturate(180%);
    -webkit-backdrop-filter: blur(36px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(255,202,40,0.08);
    opacity: 0; visibility: hidden;
    transform: translate3d(0, -10px, 0) scale(0.98);
    transform-origin: top left;
    transition: all 0.25s var(--ease-out);
    z-index: 150; overflow: hidden; contain: layout style;
  }
  .filter-popover.show { opacity: 1; visibility: visible; transform: translate3d(0,0,0) scale(1); }
  .fp-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .fp-title { font-size: 0.95rem; font-weight: 800; color: #fff; }
  .fp-reset { background: none; border: none; color: var(--gold); font-family: 'Cairo'; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s; padding: 4px 8px; }
  .fp-reset:hover { opacity: 0.8; }
  .fp-body { padding: 16px 20px; max-height: 50vh; overflow-y: auto; }
  .fp-group { margin-bottom: 16px; }
  .fp-group:last-child { margin-bottom: 0; }
  .fp-label { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 8px; display: block; }
  .fp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); gap: 8px; }
  .fp-chip { padding: 8px 6px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); font-family: 'Cairo'; font-size: 0.74rem; font-weight: 700; cursor: pointer; text-align: center; transition: all 0.2s var(--ease-out); }
  .fp-chip:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }
  .fp-chip.active { background: rgba(255,202,40,0.15); color: var(--gold); border-color: rgba(255,202,40,0.4); box-shadow: 0 0 12px rgba(255,202,40,0.1); }
  .fp-footer { padding: 12px 20px 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  .fp-apply { width: 100%; padding: 12px; border-radius: 16px; background: linear-gradient(180deg, rgba(255,202,40,0.95), rgba(255,180,20,0.95)); color: #08111f; border: none; font-family: 'Cairo'; font-size: 0.95rem; font-weight: 800; cursor: pointer; transition: transform 0.15s, box-shadow 0.2s; }
  .fp-apply:active { transform: scale(0.97); }
  .fp-apply:hover { box-shadow: 0 6px 20px rgba(255,202,40,0.35); }

  /* ===== Suggestions ===== */
  #suggestionsBox {
    position: absolute; top: 100%; left: 0; right: 0;
    background: rgba(10, 25, 60, 0.95);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 0 0 16px 16px;
    max-height: min(340px, 48vh); overflow-y: auto;
    display: none; z-index: 100;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5); contain: layout style;
  }
  #suggestionsBox.active { display: block; animation: fadeInDown 0.2s var(--ease-out); }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .suggestion-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; cursor: pointer;
    transition: background 0.15s;
    text-decoration: none; color: inherit;
    width: 100%; border: 0; background: transparent; text-align: right;
  }
  .suggestion-item:hover, .suggestion-item.active { background: rgba(255,255,255,0.06); }
  .suggestion-img { width: 38px; height: 54px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background: rgba(255,255,255,0.05); }
  .suggestion-info { flex: 1; min-width: 0; }
  .suggestion-title { font-size: 0.8rem; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .suggestion-meta { font-size: 0.62rem; color: var(--c4); display: flex; gap: 8px; margin-top: 2px; }

  /* ===== Anime Grid ===== */
  .anime-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
    gap: clamp(10px, 1.4vw, 16px);
    padding: 0.5rem var(--page-pad) 1rem;
    max-width: var(--content-max); margin: 0 auto;
    align-items: stretch;
  }
  @media (min-width: 768px) { .anime-grid { gap: 14px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); } }
  @media (min-width: 1280px) { .anime-grid { grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); } }
  @media (min-width: 1440px) { .anime-grid { grid-template-columns: repeat(auto-fit, minmax(185px, 1fr)); } }

  .anime-card {
    position: relative; border-radius: 20px; overflow: hidden;
    aspect-ratio: 2/3; cursor: pointer;
    background: linear-gradient(180deg, rgba(18,43,88,0.88) 0%, rgba(9,18,40,0.95) 100%);
    border: 1px solid rgba(189,232,245,0.1);
    box-shadow: 0 10px 28px rgba(0,0,0,0.3);
    opacity: 0; transform: translate3d(0, 12px, 0) scale(0.98);
    transition: transform 0.28s var(--ease-spring), box-shadow 0.28s ease, border-color 0.28s ease, opacity 0.35s ease;
    content-visibility: auto; contain: layout style paint;
    contain-intrinsic-size: 180px 270px;
    min-width: 0; min-height: 0;
  }
  .anime-card.visible { opacity: 1; transform: translate3d(0,0,0) scale(1); }
  .anime-card:hover {
    transform: translate3d(0, -8px, 0) scale(1.04);
    border-color: var(--gold);
    box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,202,40,0.25), 0 0 30px rgba(255,202,40,0.1);
    z-index: 2;
  }
  .anime-card:active { transform: scale(0.97); transition-duration: 0.1s; }
  .anime-card .card-image {
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0; background: rgba(0,0,0,0.2);
    transform: scale(1.01);
    transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
    will-change: transform, opacity;
  }
  .anime-card .card-image.loaded, .anime-card .card-image.failed { opacity: 1; }
  .anime-card:hover .card-image { transform: scale(1.08); }
  .anime-card .card-glow {
    position: absolute; inset: 0;
    background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(255,202,40,0.18), transparent 50%);
    opacity: 0; transition: opacity 0.2s ease; pointer-events: none; z-index: 3;
  }
  .anime-card:hover .card-glow { opacity: 1; }
  body.is-scrolling .anime-card .card-glow, body.is-scrolling .anime-card:hover .card-glow { display: none; }
  .anime-card .card-overlay {
    position: absolute; inset: auto 0 0 0;
    padding: 14px 10px 10px;
    background: linear-gradient(to top, rgba(6,16,36,0.98) 0%, rgba(6,16,36,0.85) 50%, rgba(6,16,36,0) 100%);
    z-index: 4; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    transition: backdrop-filter 0.2s ease;
  }
  .anime-card:hover .card-overlay { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  .anime-card .card-title {
    font-size: 0.82rem; font-weight: 800; color: #fff; line-height: 1.3; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    text-shadow: 0 2px 8px rgba(0,0,0,0.92);
  }
  .anime-card .card-meta { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; align-items: center; }
  .anime-card .card-chip { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 999px; font-size: 0.58rem; font-weight: 800; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.08); }
  .anime-card .card-chip.score { background: linear-gradient(135deg, rgba(255,202,40,0.95), rgba(255,180,20,0.9)); color: #08111f; border-color: transparent; box-shadow: 0 4px 12px rgba(255,202,40,0.25); }
  .anime-card .live-badge {
    position: absolute; top: 10px; left: 10px; z-index: 5;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px; border-radius: 999px;
    background: rgba(0,0,0,0.6); color: #fff;
    font-size: 0.62rem; font-weight: 800;
    border: 1px solid rgba(102,255,154,0.35);
    white-space: nowrap; box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  }
  .anime-card .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #66ff9a; box-shadow: 0 0 14px rgba(102,255,154,1); flex-shrink: 0; animation: pulse-glow 1.5s infinite; }
  @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 8px rgba(102,255,154,0.7); } 50% { box-shadow: 0 0 18px rgba(102,255,154,1); } }
  .anime-card .card-fallback { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg, rgba(15,40,84,0.94), rgba(9,18,40,0.98)); color: rgba(255,255,255,0.78); font-size: 0.72rem; font-weight: 700; text-align: center; padding: 16px; opacity: 0; transition: opacity 0.2s ease; pointer-events: none; }
  .anime-card[data-error="1"] .card-fallback { opacity: 1; }

  .no-results, .soft-fail { grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--c4); font-size: 1rem; font-weight: 600; }
  .soft-fail { border: 1px solid rgba(189,232,245,0.12); border-radius: 20px; background: rgba(10,25,60,0.48); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
  .soft-fail button { margin-top: 12px; padding: 10px 18px; border: 0; border-radius: 14px; background: var(--gold); color: #000; font-weight: 800; cursor: pointer; touch-action: manipulation; font-family: 'Cairo'; transition: transform 0.15s, box-shadow 0.2s; }
  .soft-fail button:hover { box-shadow: 0 6px 20px rgba(255,202,40,0.35); }
  .soft-fail button:active { transform: scale(0.97); }

  /* ===== Bottom Nav (mobile only) ===== */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: calc(var(--footer-h) + var(--safe-bottom));
    padding-bottom: var(--safe-bottom);
    background: rgba(10, 28, 60, 0.75);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    display: flex; align-items: center; justify-content: space-around;
    z-index: 999; border-top: 1px solid rgba(189,232,245,0.22);
    box-shadow: 0 -10px 30px rgba(0,0,0,0.35);
    contain: layout paint;
  }
  @media (min-width: 1024px) { .bottom-nav { display: none; } }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 6px 0; text-decoration: none;
    color: rgba(255,255,255,0.45);
    transition: color 0.25s var(--ease-out), transform 0.2s;
    position: relative; min-height: 48px;
  }
  .nav-item:active { transform: scale(0.92); }
  .nav-item.active { color: var(--gold); }
  .nav-item.active::before {
    content: ''; position: absolute; top: -1px;
    width: 28px; height: 3px; background: var(--gold);
    border-radius: 0 0 5px 5px; box-shadow: 0 0 14px var(--gold);
    animation: navPop 0.35s var(--ease-spring);
  }
  @keyframes navPop { 0% { width: 0; opacity: 0; } 100% { width: 28px; opacity: 1; } }
  .nav-icon-wrap { width: 44px; height: 28px; display: flex; align-items: center; justify-content: center; transition: transform 0.25s var(--ease-spring); }
  .nav-item svg { width: 22px; height: 22px; transition: all 0.3s var(--ease-out); stroke-width: 1.8; }
  .nav-item.active svg { filter: drop-shadow(0 0 10px var(--gold)); transform: scale(1.12); }
  .nav-label { font-size: 0.6rem; font-weight: 700; }

  /* ===== Desktop Sidebar (only on desktop) ===== */
  .desktop-sidebar {
    position: fixed; top: 0; right: 0;
    width: var(--sidebar-w); height: 100vh;
    background: rgba(8, 20, 45, 0.85);
    backdrop-filter: blur(32px) saturate(150%);
    -webkit-backdrop-filter: blur(32px) saturate(150%);
    border-left: 1px solid rgba(189,232,245,0.18);
    box-shadow: -6px 0 30px rgba(0,0,0,0.45);
    z-index: 998; display: none;
    flex-direction: column;
    padding-top: calc(var(--header-h) + var(--safe-top) + 10px);
    overflow-y: auto;
    contain: layout style;
  }
  @media (min-width: 1024px) { .desktop-sidebar { display: flex; } }
  .ds-header { padding: 18px 20px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ds-header h3 { font-size: 0.75rem; font-weight: 700; color: var(--text-dim); opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
  .ds-nav { padding: 12px 10px; flex: 1; }
  .ds-link {
    display: flex; align-items: center; flex-direction: row; gap: 12px;
    padding: 11px 14px; margin-bottom: 2px;
    color: rgba(255,255,255,0.55);
    text-decoration: none; font-size: 0.88rem; font-weight: 600;
    border-radius: 13px;
    transition: all 0.2s var(--ease-out); text-align: right;
  }
  .ds-link:hover { background: rgba(189,232,245,0.08); color: white; transform: translateX(-3px); }
  .ds-link.active { background: rgba(255,202,40,0.12); color: var(--gold); border: 1px solid rgba(255,202,40,0.18); box-shadow: 0 0 14px rgba(255,202,40,0.06); }
  .ds-link svg { width: 20px; height: 20px; color: var(--c3); flex-shrink: 0; stroke-width: 1.8; transition: color 0.2s; }
  .ds-link.active svg { color: var(--gold); filter: drop-shadow(0 0 4px rgba(255,202,40,0.4)); }
  .ds-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.7rem; color: rgba(255,255,255,0.3); text-align: center; }

  /* ===== Mobile Sidebar ===== */
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1499; opacity: 0; visibility: hidden; transition: 0.35s; }
  .sidebar-overlay.show { opacity: 1; visibility: visible; }
  .mobile-sidebar {
    position: fixed; top: 0; right: 0;
    width: min(86vw, 320px); height: 100%;
    background: rgba(8, 20, 50, 0.96);
    backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
    z-index: 1500; transform: translate3d(100%, 0, 0);
    transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
    overflow-y: auto;
    border-left: 1px solid rgba(255,202,40,0.38);
    box-shadow: -8px 0 30px rgba(0,0,0,0.55);
  }
  .mobile-sidebar.open { transform: translate3d(0, 0, 0); }
  .ms-header { padding: 1.5rem 1rem; background: linear-gradient(180deg, var(--c2), rgba(28,77,141,0.85)); color: white; display: flex; flex-direction: row; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); }
  .ms-header h2 { font-size: 1.15rem; font-weight: 800; }
  .close-btn { background: none; border: none; color: white; cursor: pointer; font-size: 1.4rem; padding: 6px; transition: transform 0.2s, color 0.2s; min-width: 36px; min-height: 36px; display: flex; align-items: center; justify-content: center; }
  .close-btn:hover { color: var(--gold); }
  .close-btn:active { transform: scale(0.9); }
  .ms-link {
    display: flex; align-items: center; flex-direction: row; gap: 10px;
    padding: 13px 1rem; color: var(--text-dim);
    text-decoration: none; font-weight: 600; font-size: 0.9rem;
    transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.03);
    text-align: right; min-height: 48px;
  }
  .ms-link:hover { background: rgba(255,202,40,0.1); color: var(--gold); padding-right: 1.8rem; }
  .ms-link svg { width: 20px; height: 20px; color: var(--gold); stroke-width: 1.8; }

  /* ===== Responsive tuning ===== */
  @media (max-width: 768px) {
    .user-details { display: none; }
    .slider-container { height: clamp(180px, 48vw, 320px); }
    .anime-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
    .slide-content { bottom: 10px; right: 10px; left: 10px; }
    .slide-title { font-size: 0.95rem; }
    .slide-meta-chip { font-size: 0.52rem; padding: 3px 6px; }
  }
  @media (max-width: 560px) {
    .logo-text { max-width: 28vw; }
    .user-profile { padding: 5px 8px; }
    .account-popover { inset-inline: 0.5rem; width: auto; }
    .slider-container { height: clamp(170px, 52vw, 240px); }
  }
  @media (max-width: 480px) {
    .main-header { padding-inline: 0.5rem; }
    .menu-btn { width: 38px; height: 38px; }
    .logo-text { font-size: 0.92rem; }
    .slider-container { height: clamp(160px, 52vw, 220px); }
    .anime-grid { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
    .search-input { font-size: 0.95rem; }
    .slide-badge { font-size: 0.55rem; padding: 3px 7px; }
    .slider-dots { bottom: 6px; gap: 6px; }
    .dot { width: 6px; height: 6px; }
    .dot.active { width: 18px; }
  }
  @media (max-width: 360px) {
    .logo-text { display: none; }
    .anime-grid { grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); }
    .slider-container { height: 160px; }
  }
  button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
    .animated-bg, .pixel, .ticker-content { animation: none !important; }
    .pixel { display: none; }
  }
</style>

<a href="#mainContent" class="skip-nav">تخطي للمحتوى</a>
<div class="animated-bg"></div>
<div class="pixel-container"><span class="pixel"></span><span class="pixel"></span><span class="pixel"></span></div>

<header class="main-header" id="mainHeader">
  <div class="header-flex">
    <button class="menu-btn" id="menuBtn" aria-label="القائمة" type="button"><i data-lucide="menu"></i></button>
    <a data-link="/" href="/" class="logo-link"><span class="logo-text">OraaSlayer</span></a>
  </div>
  <div class="header-flex">
    <button class="slider-toggle-btn" id="sliderToggleBtn" aria-label="الإشعارات" type="button" title="آخر الأخبار"><i data-lucide="bell"></i></button>
    <div class="user-profile" id="userProfile" role="button" aria-label="حساب المستخدم" tabindex="0" aria-expanded="false">
      <div class="avatar-wrap"><img id="headerAvatar" src="https://i.ibb.co/YRShYmn/avatar.png" alt="الصورة" width="36" height="36" loading="eager" decoding="async"></div>
      <div class="user-details">
        <div class="user-line"><span class="user-name" id="userName">زائر</span><span class="role-badge role-guest" id="roleBadge">GUEST</span></div>
        <span class="user-role" id="roleLabel">اضغط للدخول</span>
      </div>
    </div>
  </div>
</header>

<div class="desktop-top-slider" id="desktopTopSlider">
  <div class="dts-inner">
    <span class="dts-label"><i data-lucide="radio" style="width:14px;height:14px;"></i>آخر الأخبار</span>
    <div class="dts-track">
      <div class="dts-content" id="dtsContent">
        <span class="dts-item"><span class="live-dot"></span>Solo Leveling Season 2 يتصدر المشاهدات عالمياً 2025</span>
        <span class="dts-item">🔥 One Piece يُقترب من نهاية أرك Egghead</span>
        <span class="dts-item">✨ Dandadan يحصد جائزة أفضل أنمي خارق للطبيعة</span>
        <span class="dts-item">🏆 Kaiju No. 8 الموسم الثاني قادم في 2025</span>
        <span class="dts-item"><span class="live-dot"></span>Chainsaw Man الموسم الثاني يُعرض حالياً</span>
        <span class="dts-item">🎁 فعاليات حصرية داخل المنصة لجميع الأعضاء</span>
        <span class="dts-item"><span class="live-dot"></span>Solo Leveling Season 2 يتصدر المشاهدات عالمياً 2025</span>
        <span class="dts-item">🔥 One Piece يُقترب من نهاية أرك Egghead</span>
        <span class="dts-item">✨ Dandadan يحصد جائزة أفضل أنمي خارق للطبيعة</span>
        <span class="dts-item">🏆 Kaiju No. 8 الموسم الثاني قادم في 2025</span>
        <span class="dts-item"><span class="live-dot"></span>Chainsaw Man الموسم الثاني يُعرض حالياً</span>
        <span class="dts-item">🎁 فعاليات حصرية داخل المنصة لجميع الأعضاء</span>
      </div>
    </div>
    <button class="dts-close" id="dtsCloseBtn" aria-label="إغلاق" type="button"><i data-lucide="x" style="width:16px;height:16px"></i></button>
  </div>
</div>

<div class="account-popover" id="accountPopover" aria-hidden="true">
  <div class="account-card" id="accountCard">
    <div class="account-head">
      <div class="account-avatar"><img id="popoverAvatar" src="https://i.ibb.co/YRShYmn/avatar.png" alt="الصورة"></div>
      <div class="account-meta">
        <div class="name" id="popoverName">زائر</div>
        <div class="sub" id="popoverSub">أنت غير مسجل الدخول</div>
        <div class="badge-row"><span class="role-badge role-guest" id="popoverRoleBadge">GUEST</span></div>
      </div>
    </div>
    <div class="account-actions" id="accountActions"></div>
    <div class="account-foot" id="accountFoot">OraaSlayer</div>
  </div>
</div>

<div class="main-content" id="mainContent">
  <section class="hero-section" id="heroSection">
    <div class="hero-shell">
      <div class="slider-container" id="sliderContainer">
        <div class="slider-skeleton" id="sliderSkeleton">
          <div class="slider-skeleton-text">
            <div class="slider-skeleton-line w60"></div>
            <div class="slider-skeleton-line w40"></div>
          </div>
        </div>
        <div class="slider-track" id="sliderTrack" style="display:none;"></div>
        <div class="slider-nav prev" id="sliderPrev" aria-label="السلايد السابق"><i data-lucide="chevron-right"></i></div>
        <div class="slider-nav next" id="sliderNext" aria-label="السلايد التالي"><i data-lucide="chevron-left"></i></div>
        <div class="slider-dots" id="sliderDots"></div>
      </div>
    </div>
  </section>

  <div class="news-ticker"><div class="ticker-content" id="tickerContent">🚀 أحدث أخبار الأنمي: الموسم الثاني من Solo Leveling يتصدر المشاهدات عالمياً • 🔥 أرك Egghead في One Piece يقترب من نهايته المأساوية • ✨ Dandadan يحصد جوائز أفضل أنمي خارق • 🏆 Kaiju No. 8 يؤكد الموسم الثاني لعام 2025 • ⚡ Chainsaw Man الموسم الثاني متوفر الآن</div></div>

  <div class="search-filter-sticky" id="searchFilterSticky">
    <section class="search-section">
      <div class="search-wrapper">
        <div class="search-input-container">
          <input type="text" class="search-input" id="searchInput" placeholder="ابحث عن أنمي..." autocomplete="off" aria-label="بحث">
          <i data-lucide="search" class="search-icon"></i>
          <button class="search-clear" id="searchClear" type="button" aria-label="مسح البحث">×</button>
          <div class="search-spinner" id="searchSpinner"></div>
          <div id="suggestionsBox"></div>
        </div>
        <button class="filter-toggle-btn" id="filterToggleBtn" type="button" aria-label="الفلاتر"><i data-lucide="sliders-horizontal"></i></button>
        <div class="filter-popover" id="filterPopover">
          <div class="fp-header"><span class="fp-title">الفلاتر</span><button class="fp-reset" id="filterResetBtn" type="button">إعادة تعيين</button></div>
          <div class="fp-body">
            <div class="fp-group"><span class="fp-label">النوع (Genre)</span>
              <div class="fp-grid" id="genreFilters">
                <button class="fp-chip active" data-filter="genre" data-value="">الكل</button>
                <button class="fp-chip" data-filter="genre" data-value="Action">أكشن</button>
                <button class="fp-chip" data-filter="genre" data-value="Romance">رومانسي</button>
                <button class="fp-chip" data-filter="genre" data-value="Comedy">كوميدي</button>
                <button class="fp-chip" data-filter="genre" data-value="Fantasy">فانتازيا</button>
                <button class="fp-chip" data-filter="genre" data-value="Sci-Fi">خيال علمي</button>
                <button class="fp-chip" data-filter="genre" data-value="Horror">رعب</button>
                <button class="fp-chip" data-filter="genre" data-value="Drama">دراما</button>
                <button class="fp-chip" data-filter="genre" data-value="Sports">رياضي</button>
                <button class="fp-chip" data-filter="genre" data-value="Slice of Life">شريحة حياة</button>
              </div>
            </div>
            <div class="fp-group"><span class="fp-label">الصيغة (Format)</span>
              <div class="fp-grid" id="formatFilters">
                <button class="fp-chip active" data-filter="format" data-value="">الكل</button>
                <button class="fp-chip" data-filter="format" data-value="TV">مسلسل</button>
                <button class="fp-chip" data-filter="format" data-value="MOVIE">فيلم</button>
                <button class="fp-chip" data-filter="format" data-value="OVA">أوفا</button>
                <button class="fp-chip" data-filter="format" data-value="ONA">أونا</button>
                <button class="fp-chip" data-filter="format" data-value="SPECIAL">حلقة خاصة</button>
              </div>
            </div>
          </div>
          <div class="fp-footer"><button class="fp-apply" id="filterApplyBtn" type="button">تطبيق الفلاتر</button></div>
        </div>
      </div>
    </section>
  </div>

  <main class="anime-grid" id="animeGrid"></main>
</div>

<nav class="desktop-sidebar" aria-label="القائمة الجانبية">
  <div class="ds-header"><h3>القائمة</h3></div>
  <div class="ds-nav">
    <a data-link="/" href="/" class="ds-link active"><i data-lucide="home"></i> الرئيسية</a>
    <a data-link="/newsanime" href="/newsanime" class="ds-link"><i data-lucide="newspaper"></i> أخبار الأنمي</a>
    <a data-link="/new" href="/new" class="ds-link"><i data-lucide="palette"></i> المبدعين</a>
    <a data-link="/event_gacha/spin" href="/event_gacha/spin" class="ds-link"><i data-lucide="gift"></i> هدايا و أحداث</a>
    <a data-link="/favorites" href="/favorites" class="ds-link"><i data-lucide="heart"></i> المفضلة</a>
    <a data-link="/chat" href="/chat" class="ds-link"><i data-lucide="message-circle"></i> الدردشة</a>
    <a data-link="/redeem_cd" href="/redeem_cd" class="ds-link"><i data-lucide="ticket"></i> شحن كود</a>
    <a data-link="/download" href="/download" class="ds-link"><i data-lucide="download"></i> تحميل التطبيق</a>
    <a data-link="/about" href="/about" class="ds-link"><i data-lucide="info"></i> عن المنصة</a>
    <a data-link="/policy" href="/policy" class="ds-link"><i data-lucide="shield"></i> سياسة الخصوصية</a>
  </div>
  <div class="ds-footer">OraaSlayer &copy; 2026</div>
</nav>

<div class="sidebar-overlay" id="overlay"></div>
<aside class="mobile-sidebar" id="mobileSidebar" aria-label="القائمة">
  <div class="ms-header">
    <h2>القائمة</h2>
    <button class="close-btn" id="closeSidebar" aria-label="إغلاق" type="button"><i data-lucide="x"></i></button>
  </div>
  <nav style="padding:0.5rem 0;">
    <a data-link="/" href="/" class="ms-link"><i data-lucide="home"></i> الرئيسية</a>
    <a data-link="/newsanime" href="/newsanime" class="ms-link"><i data-lucide="newspaper"></i> أخبار الأنمي</a>
    <a data-link="/new" href="/new" class="ms-link"><i data-lucide="palette"></i> المبدعين</a>
    <a data-link="/event_gacha/spin" href="/event_gacha/spin" class="ms-link"><i data-lucide="gift"></i> هدايا و أحداث</a>
    <a data-link="/favorites" href="/favorites" class="ms-link"><i data-lucide="heart"></i> المفضلة</a>
    <a data-link="/chat" href="/chat" class="ms-link"><i data-lucide="message-circle"></i> الدردشة</a>
    <a data-link="/redeem_cd" href="/redeem_cd" class="ms-link"><i data-lucide="ticket"></i> شحن كود</a>
    <a data-link="/download" href="/download" class="ms-link"><i data-lucide="download"></i> تحميل التطبيق</a>
    <a data-link="/about" href="/about" class="ms-link"><i data-lucide="info"></i> عن المنصة</a>
    <a data-link="/policy" href="/policy" class="ms-link"><i data-lucide="shield"></i> سياسة الخصوصية</a>
  </nav>
</aside>

<footer class="bottom-nav" aria-label="التنقل السفلي">
  <a data-link="/" href="/" class="nav-item active"><div class="nav-icon-wrap"><i data-lucide="home"></i></div><span class="nav-label">الرئيسية</span></a>
  <a data-link="/newsanime" href="/newsanime" class="nav-item"><div class="nav-icon-wrap"><i data-lucide="newspaper"></i></div><span class="nav-label">أخبار</span></a>
  <a data-link="/event_gacha/spin" href="/event_gacha/spin" class="nav-item"><div class="nav-icon-wrap"><i data-lucide="gift"></i></div><span class="nav-label">هدايا</span></a>
  <a data-link="/chat" href="/chat" class="nav-item"><div class="nav-icon-wrap"><i data-lucide="message-circle"></i></div><span class="nav-label">دردشة</span></a>
  <a data-link="/profile" href="/profile" class="nav-item"><div class="nav-icon-wrap"><i data-lucide="user"></i></div><span class="nav-label">حسابي</span></a>
</footer>`;

  // ═══════════════════════════════════════════════════
  // 4. STATE
  // ═══════════════════════════════════════════════════
  const state = {
    slider: { current: 0, total: 0, interval: null, paused: false, data: [] },
    search: { query: null, debounce: 0, suggestDebounce: 0, lastQuery: '' },
    scroll: { ticking: false, isScrolling: false, stopTimer: null },
    aegisEngine: null,
    mountedAt: Date.now(),
  };

  // ═══════════════════════════════════════════════════
  // 5. UTILITIES
  // ═══════════════════════════════════════════════════
  const $ = (sel) => root.querySelector(sel);
  const DEFAULT_AVATAR = 'https://i.ibb.co/YRShYmn/avatar.png';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
  const b64 = (v) => { try { return btoa(String(v)); } catch { const bytes = new TextEncoder().encode(String(v)); let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]); return btoa(bin); } };
  const slugify = (text) => String(text || '').toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const safeParse = (i, fb) => { if (i == null) return fb; if (typeof i !== 'string') return i; try { return JSON.parse(i); } catch { return fb; } };
  const hexToRgba = (hex, a = 0.28) => { const h = String(hex || '').replace('#', '').trim(); const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h.padEnd(6, '0').slice(0, 6); const n = parseInt(f, 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
  const vib = (p) => { try { navigator.vibrate?.(p); } catch {} };
  const raf = (fn) => requestAnimationFrame(fn);

  // ═══════════════════════════════════════════════════
  // 6. DOM CACHE
  // ═══════════════════════════════════════════════════
  const dom = {
    heroSection: $('#heroSection'),
    menuBtn: $('#menuBtn'),
    mobileSidebar: $('#mobileSidebar'),
    overlay: $('#overlay'),
    closeSidebarBtn: $('#closeSidebar'),
    userProfile: $('#userProfile'),
    accountPopover: $('#accountPopover'),
    accountCard: $('#accountCard'),
    popoverName: $('#popoverName'),
    popoverSub: $('#popoverSub'),
    popoverRoleBadge: $('#popoverRoleBadge'),
    popoverAvatar: $('#popoverAvatar'),
    accountActions: $('#accountActions'),
    accountFoot: $('#accountFoot'),
    userName: $('#userName'),
    roleLabel: $('#roleLabel'),
    roleBadge: $('#roleBadge'),
    headerAvatar: $('#headerAvatar'),
    mainHeader: $('#mainHeader'),
    mainContent: $('#mainContent'),
    sliderToggleBtn: $('#sliderToggleBtn'),
    desktopTopSlider: $('#desktopTopSlider'),
    dtsCloseBtn: $('#dtsCloseBtn'),
    sliderContainer: $('#sliderContainer'),
    sliderTrack: $('#sliderTrack'),
    sliderSkeleton: $('#sliderSkeleton'),
    sliderPrev: $('#sliderPrev'),
    sliderNext: $('#sliderNext'),
    sliderDots: $('#sliderDots'),
    searchInput: $('#searchInput'),
    searchClear: $('#searchClear'),
    searchSpinner: $('#searchSpinner'),
    suggestionsBox: $('#suggestionsBox'),
    filterBtn: $('#filterToggleBtn'),
    filterPop: $('#filterPopover'),
    filterApply: $('#filterApplyBtn'),
    filterReset: $('#filterResetBtn'),
    genreF: $('#genreFilters'),
    formatF: $('#formatFilters'),
    animeGrid: $('#animeGrid'),
    ticker: $('#tickerContent'),
  };

  if (dom.sliderTrack) {
    dom.sliderTrack.style.cssText += ';direction:ltr;will-change:transform;';
  }

  // ═══════════════════════════════════════════════════
  // 7. NAVIGATION
  // ═══════════════════════════════════════════════════
  const navHandler = (e) => {
    const link = e.target.closest('[data-link]');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    let path = link.getAttribute('data-link') || link.getAttribute('href');
    const watchMatch = String(path).match(/\/watch\?id=([^&]+)&ep=(.+)$/);
    if (watchMatch) path = `/watch/${watchMatch[1]}/${watchMatch[2]}`;
    if (typeof go === 'function') go(path);
  };
  root.addEventListener('click', navHandler);
  cleanup.push(() => root.removeEventListener('click', navHandler));

  if (dom.searchInput) {
    const preventEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); return false; } };
    dom.searchInput.addEventListener('keydown', preventEnter);
    cleanup.push(() => dom.searchInput.removeEventListener('keydown', preventEnter));
  }

  // ═══════════════════════════════════════════════════
  // 8. ROLE & UI HELPERS
  // ═══════════════════════════════════════════════════
  const normalizeRole = (r, loggedIn) => {
    const v = String(r || '').trim().toLowerCase();
    const roles = { vip: ['vip','premium'], admin: ['admin','administrator','adm'], manager: ['manager','manger','mgr'], staff: ['staff','staf'], member: ['member','user'] };
    for (const [key, aliases] of Object.entries(roles)) if (aliases.includes(v)) return key;
    return loggedIn ? 'member' : 'guest';
  };
  const roleMetaMap = {
    vip:     { badge: 'VIP',     cls: 'role-vip',     label: 'عضو مميز',    accent: '#FFCA28' },
    admin:   { badge: 'ADMIN',   cls: 'role-admin',   label: 'إداري',        accent: '#FF5C7A' },
    manager: { badge: 'MANAGER', cls: 'role-manager', label: 'مدير',         accent: '#5CD6FF' },
    staff:   { badge: 'STAFF',   cls: 'role-staff',   label: 'فريق العمل',   accent: '#B78BFF' },
    member:  { badge: 'MEMBER',  cls: 'role-member',  label: 'عضو',          accent: '#7BA6FF' },
    guest:   { badge: 'GUEST',   cls: 'role-guest',   label: 'اضغط للدخول', accent: '#B6C2D1' },
  };
  const getRoleMeta = (r, loggedIn) => { const key = normalizeRole(r, loggedIn); return { key, ...(roleMetaMap[key] || roleMetaMap.guest) }; };
  const setBadge = (el, meta) => { if (el) { el.textContent = meta.badge; el.className = `role-badge ${meta.cls}`; } };
  const applyTheme = (meta) => {
    const r = document.documentElement;
    r.style.setProperty('--role-accent', meta.accent);
    r.style.setProperty('--role-accent-soft', hexToRgba(meta.accent, 0.35));
    if (dom.userProfile) dom.userProfile.style.borderColor = hexToRgba(meta.accent, 0.50);
    if (dom.accountCard) dom.accountCard.style.borderColor = hexToRgba(meta.accent, 0.35);
  };

  // ═══════════════════════════════════════════════════
  // 9. POPOVER & SIDEBAR LOGIC
  // ═══════════════════════════════════════════════════
  const openSidebar = () => { dom.mobileSidebar?.classList.add('open'); dom.overlay?.classList.add('show'); raf(() => window.lucide?.createIcons?.()); };
  const closeSidebar = () => { dom.mobileSidebar?.classList.remove('open'); dom.overlay?.classList.remove('show'); };
  const closePopover = () => { dom.accountPopover?.classList.remove('show'); dom.accountPopover?.setAttribute('aria-hidden', 'true'); dom.userProfile?.setAttribute('aria-expanded', 'false'); };
  const togglePopover = () => { if (!dom.accountPopover) return; const isOpen = dom.accountPopover.classList.toggle('show'); dom.accountPopover.setAttribute('aria-hidden', isOpen ? 'false' : 'true'); dom.userProfile?.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); };
  const openDesktopSlider = () => { dom.desktopTopSlider?.classList.add('open'); dom.sliderToggleBtn?.classList.add('active'); };
  const closeDesktopSlider = () => { dom.desktopTopSlider?.classList.remove('open'); dom.sliderToggleBtn?.classList.remove('active'); };
  const toggleDesktopSlider = () => { if (dom.desktopTopSlider?.classList.contains('open')) closeDesktopSlider(); else openDesktopSlider(); };

  // ═══════════════════════════════════════════════════
  // 10. LOGOUT
  // ═══════════════════════════════════════════════════
  const handleLogout = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const btn = e.currentTarget;
    if (!btn || btn.disabled) return;
    btn.disabled = true; btn.style.opacity = '0.6';
    try {
      if (typeof firebase !== 'undefined' && firebase.auth) await firebase.auth().signOut();
      const m = await import('/api/auth.js').catch(() => null);
      if (m?.logout) await m.logout();
      if (window.__AUTH__) { window.__AUTH__.isLoggedIn = false; window.__AUTH__.user = null; window.__AUTH__.ready = true; }
      window.dispatchEvent(new CustomEvent('auth:changed', { detail: { isLoggedIn: false, displayName: 'زائر', role: 'guest', avatar: DEFAULT_AVATAR } }));
      closePopover();
    } catch (err) { console.error('[Home] Logout failed:', err); alert('فشل تسجيل الخروج. حاول مرة أخرى.'); }
    finally { btn.disabled = false; btn.style.opacity = '1'; }
  };

  // ═══════════════════════════════════════════════════
  // 11. APPLY UI (auth state)
  // ═══════════════════════════════════════════════════
  const setPopoverMode = (mode) => {
    if (!dom.accountActions) return;
    if (mode === 'logged') {
      dom.accountActions.innerHTML = `
        <a class="account-action primary" data-link="/profile" href="/profile"><i data-lucide="user-circle"></i><span class="action-label">الملف الشخصي</span></a>
        <a class="account-action" data-link="/store" href="/store"><i data-lucide="shopping-bag"></i><span class="action-label">المتجر</span></a>
        <button class="account-action danger" id="popoverLogoutBtn" type="button"><i data-lucide="log-out"></i><span class="action-label">تسجيل الخروج</span></button>`;
      dom.accountFoot.textContent = 'مرحباً بك داخل الحساب';
      const btn = dom.accountActions.querySelector('#popoverLogoutBtn');
      if (btn) btn.addEventListener('click', handleLogout);
    } else {
      dom.accountActions.innerHTML = `
        <a class="account-action primary" data-link="/login" href="/login"><i data-lucide="log-in"></i><span class="action-label">تسجيل الدخول</span></a>
        <a class="account-action" data-link="/register" href="/register"><i data-lucide="user-plus"></i><span class="action-label">إنشاء حساب</span></a>
        <button class="account-action locked" type="button" disabled><i data-lucide="shopping-bag"></i><span class="action-label">المتجر</span><span class="locked-tag">مغلق</span></button>
        <button class="account-action locked" type="button" disabled><i data-lucide="user-circle"></i><span class="action-label">الملف الشخصي</span><span class="locked-tag">مغلق</span></button>`;
      dom.accountFoot.textContent = 'أنشئ حساباً لفتح المتجر والبروفايل';
    }
    raf(() => window.lucide?.createIcons?.());
  };

  const applyUI = ({ in_, name, role, avatar }) => {
    if (isDead) return;
    const meta = getRoleMeta(role, in_);
    if (dom.userName) dom.userName.textContent = name || (in_ ? 'مستخدم' : 'زائر');
    if (dom.roleLabel) dom.roleLabel.textContent = in_ ? meta.label : 'اضغط للدخول';
    setBadge(dom.roleBadge, meta);
    if (dom.popoverName) dom.popoverName.textContent = name || (in_ ? 'مستخدم' : 'زائر');
    if (dom.popoverSub) dom.popoverSub.textContent = in_ ? meta.label : 'أنت غير مسجل الدخول';
    setBadge(dom.popoverRoleBadge, meta);
    const src = avatar || DEFAULT_AVATAR;
    if (dom.headerAvatar) dom.headerAvatar.src = src;
    if (dom.popoverAvatar) dom.popoverAvatar.src = src;
    applyTheme(meta);
    setPopoverMode(in_ ? 'logged' : 'guest');
  };
  applyUI({ in_: false, name: 'زائر', role: 'guest' });

  // ═══════════════════════════════════════════════════
  // 12. EVENT BINDINGS
  // ═══════════════════════════════════════════════════
  const hMenu = (e) => { e.preventDefault(); openSidebar(); };
  const hCloseSide = (e) => { e.preventDefault(); closeSidebar(); };
  const hOverlay = () => { closeSidebar(); closePopover(); closeDesktopSlider(); };
  const hProfile = (e) => { e.stopPropagation(); togglePopover(); };
  const hProfileKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePopover(); } };
  const hDocPop = (e) => { if (dom.userProfile && !dom.userProfile.contains(e.target) && dom.accountPopover && !dom.accountPopover.contains(e.target)) closePopover(); };
  const hSliderToggle = (e) => { e.stopPropagation(); toggleDesktopSlider(); };
  const hSliderClose = () => { closeDesktopSlider(); };
  const hVisible = () => {
    const hidden = document.hidden;
    state.slider.paused = hidden;
    if (dom.ticker) dom.ticker.style.animationPlayState = hidden ? 'paused' : 'running';
    if (hidden) stopSliderAutoplay();
    else if (state.slider.data.length) startSliderAutoplay();
  };

  dom.menuBtn?.addEventListener('pointerdown', hMenu);
  dom.closeSidebarBtn?.addEventListener('pointerdown', hCloseSide);
  dom.overlay?.addEventListener('pointerdown', hOverlay);
  dom.userProfile?.addEventListener('pointerdown', hProfile);
  dom.userProfile?.addEventListener('keydown', hProfileKey);
  document.addEventListener('pointerdown', hDocPop, { passive: true });
  dom.sliderToggleBtn?.addEventListener('pointerdown', hSliderToggle);
  dom.dtsCloseBtn?.addEventListener('pointerdown', hSliderClose);
  document.addEventListener('visibilitychange', hVisible, { passive: true });

  cleanup.push(
    () => dom.menuBtn?.removeEventListener('pointerdown', hMenu),
    () => dom.closeSidebarBtn?.removeEventListener('pointerdown', hCloseSide),
    () => dom.overlay?.removeEventListener('pointerdown', hOverlay),
    () => dom.userProfile?.removeEventListener('pointerdown', hProfile),
    () => dom.userProfile?.removeEventListener('keydown', hProfileKey),
    () => document.removeEventListener('pointerdown', hDocPop),
    () => dom.sliderToggleBtn?.removeEventListener('pointerdown', hSliderToggle),
    () => dom.dtsCloseBtn?.removeEventListener('pointerdown', hSliderClose),
    () => document.removeEventListener('visibilitychange', hVisible),
  );

  // ═══════════════════════════════════════════════════
  // 13. SLIDER
  // ═══════════════════════════════════════════════════
  let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;

  const updateSliderPosition = (index) => {
    if (!dom.sliderTrack || state.slider.total === 0) return;
    dom.sliderTrack.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    const dots = dom.sliderDots?.querySelectorAll('.dot');
    dots?.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  const goToSlide = (index) => { if (state.slider.total === 0) return; state.slider.current = ((index % state.slider.total) + state.slider.total) % state.slider.total; updateSliderPosition(state.slider.current); };
  const nextSlide = () => goToSlide(state.slider.current + 1);
  const prevSlide = () => goToSlide(state.slider.current - 1);
  const startSliderAutoplay = (interval = 5200) => {
    stopSliderAutoplay();
    if (!state.slider.data.length) return;
    state.slider.interval = setInterval(() => { if (!state.slider.paused && state.slider.data.length) nextSlide(); }, interval);
  };
  const stopSliderAutoplay = () => { if (state.slider.interval) { clearInterval(state.slider.interval); state.slider.interval = null; } };

  dom.sliderPrev?.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); stopSliderAutoplay(); prevSlide(); startSliderAutoplay(); });
  dom.sliderNext?.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); stopSliderAutoplay(); nextSlide(); startSliderAutoplay(); });

  dom.sliderContainer?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; stopSliderAutoplay(); }, { passive: true });
  dom.sliderContainer?.addEventListener('touchmove', (e) => { touchEndX = e.touches[0].clientX; touchEndY = e.touches[0].clientY; }, { passive: true });
  dom.sliderContainer?.addEventListener('touchend', () => { const dx = touchStartX - touchEndX; const dy = Math.abs(touchStartY - touchEndY); if (Math.abs(dx) > 50 && dy < 60) dx > 0 ? nextSlide() : prevSlide(); startSliderAutoplay(); });

  dom.sliderContainer?.addEventListener('mouseenter', stopSliderAutoplay);
  dom.sliderContainer?.addEventListener('mouseleave', () => state.slider.data.length && startSliderAutoplay());
  cleanup.push(
    () => dom.sliderContainer?.removeEventListener('mouseenter', stopSliderAutoplay),
    () => dom.sliderContainer?.removeEventListener('mouseleave', () => state.slider.data.length && startSliderAutoplay()),
  );

  // ═══════════════════════════════════════════════════
  // 14. SCROLL
  // ═══════════════════════════════════════════════════
  const onScroll = () => {
    if (state.scroll.ticking) return;
    state.scroll.ticking = true;
    raf(() => {
      dom.mainHeader?.classList.toggle('main-header--scrolled', window.scrollY > 50);
      if (!state.scroll.isScrolling) { state.scroll.isScrolling = true; document.body.classList.add('is-scrolling'); }
      clearTimeout(state.scroll.stopTimer);
      state.scroll.stopTimer = setTimeout(() => { state.scroll.isScrolling = false; document.body.classList.remove('is-scrolling'); }, 150);
      state.scroll.ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanup.push(() => window.removeEventListener('scroll', onScroll));

  // ═══════════════════════════════════════════════════
  // 15. AUTH STATE LISTENER
  // ═══════════════════════════════════════════════════
  const onAuthChanged = (e) => {
    if (isDead) return;
    const d = e.detail || {};
    applyUI({ in_: d.isLoggedIn, name: d.displayName || (d.isLoggedIn ? 'مستخدم' : 'زائر'), role: d.role || (d.isLoggedIn ? 'member' : 'guest'), avatar: d.avatar || DEFAULT_AVATAR });
  };
  window.addEventListener('auth:changed', onAuthChanged);
  cleanup.push(() => window.removeEventListener('auth:changed', onAuthChanged));

  // ═══════════════════════════════════════════════════
  // 16. ASYNC: LUCIDE
  // ═══════════════════════════════════════════════════
  const loadLucide = () => {
    if (window.lucide?.createIcons) { window.lucide.createIcons(); return; }
    let s = document.createElement('script');
    s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
    s.async = true; s.crossOrigin = 'anonymous';
    s.onload = () => safeRun(() => window.lucide?.createIcons?.());
    s.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js';
      s2.async = true;
      s2.onload = () => safeRun(() => window.lucide?.createIcons?.());
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  };
  loadLucide();

  // ═══════════════════════════════════════════════════
  // 17. ASYNC: AUTH
  // ═══════════════════════════════════════════════════
  import('/api/auth.js').then((m) => { if (isDead) return; if (m?.waitForAuth) m.waitForAuth(5000).catch(() => {}); }).catch((err) => console.warn('[Home] Auth:', err.message));

  // ═══════════════════════════════════════════════════
  // 18. ASYNC: AEGIS ENGINE
  // ═══════════════════════════════════════════════════
  dom.heroSection?.classList.add('ready');

  (async () => {
    if (isDead) return;
    try {
      let AegisEngineClass = window.AegisEngine;
      if (typeof AegisEngineClass !== 'function') {
        try {
          const mod = await import('/api/anilist.js');
          AegisEngineClass = mod?.AegisEngine || mod?.default || window.AegisEngine;
        } catch {}
      }
      if (typeof AegisEngineClass !== 'function') {
        AegisEngineClass = await new Promise((resolve) => {
          if (isDead) return resolve(null);
          if (typeof window.AegisEngine === 'function') return resolve(window.AegisEngine);
          const start = performance.now();
          const tick = () => {
            if (isDead) return resolve(null);
            if (typeof window.AegisEngine === 'function') return resolve(window.AegisEngine);
            if (performance.now() - start > 8000) return resolve(null);
            raf(tick);
          };
          tick();
        });
      }
      if (isDead) return;
      if (typeof AegisEngineClass === 'function') {
        const engine = new AegisEngineClass(root);
        if (typeof engine.go === 'function') {
          const safeGo = (path) => {
            const strPath = String(path || '');
            const watchMatch = strPath.match(/\/watch\?id=([^&]+)&ep=(.+)$/);
            if (watchMatch) go(`/watch/${watchMatch[1]}/${watchMatch[2]}`);
            else go(strPath);
          };
          engine.go = safeGo;
        }
        state.aegisEngine = engine;
        await engine.init();
        if (!isDead) console.log('[Home] ✅ AegisEngine ready');
      }
    } catch (err) {
      if (isDead) return;
      console.warn('[Home] ⚠️ AegisEngine failed:', err.message);
      const grid = dom.animeGrid;
      if (grid) {
        grid.innerHTML = `<div class="soft-fail" style="grid-column:1/-1;text-align:center;padding:40px 20px;"><p style="margin-bottom:14px;font-size:1rem;">⚠️ تعذر جلب بيانات الأنمي</p><button id="retryEngineBtn" style="padding:10px 20px;border-radius:12px;background:var(--gold);color:#000;border:none;font-weight:800;cursor:pointer;font-family:'Cairo';">إعادة المحاولة</button></div>`;
        grid.querySelector('#retryEngineBtn')?.addEventListener('click', () => go('/'));
      }
    }
  })();

  // ═══════════════════════════════════════════════════
  // 19. RESIZE
  // ═══════════════════════════════════════════════════
  const setAppHeight = () => { document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`); };
  setAppHeight();
  window.addEventListener('resize', setAppHeight, { passive: true });
  window.addEventListener('orientationchange', setAppHeight, { passive: true });
  cleanup.push(() => window.removeEventListener('resize', setAppHeight), () => window.removeEventListener('orientationchange', setAppHeight));

  // ═══════════════════════════════════════════════════
  // 20. CLEANUP
  // ═══════════════════════════════════════════════════
  const runCleanup = () => {
    markDead();
    stopSliderAutoplay();
    clearTimeout(state.scroll.stopTimer);
    for (const fn of cleanup) safeRun(fn);
    if (state.aegisEngine?.destroy) safeRun(() => state.aegisEngine.destroy());
  };
  if (typeof onCleanup === 'function') onCleanup(runCleanup);
  else window.addEventListener('beforeunload', runCleanup, { once: true });
}