/* eslint-disable */
const { useState, useEffect } = React;

/* -----------------------------------------------------------------------
 * AmbientGlow — two drifting radial gradients behind everything.
 * (Kept from previous version — this is the brand's signature move.)
 * --------------------------------------------------------------------- */
function AmbientGlow({ glowColor = '#8b5cf6', glowColor2 = '#a855f7', intensity = 1 }) {
  if (intensity <= 0) return null;
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  };
  const [r1,g1,b1] = hexToRgb(glowColor);
  const [r2,g2,b2] = hexToRgb(glowColor2);
  // Mid-blend color for the third blob
  const r3 = Math.round((r1+r2)/2), g3 = Math.round((g1+g2)/2), b3 = Math.round((b1+b2)/2);
  return (
    <div aria-hidden style={ambientGlow.wrap}>
      <div style={{ ...ambientGlow.blob, ...ambientGlow.blob1,
        background: `radial-gradient(circle, rgba(${r1},${g1},${b1},${0.55*intensity}), rgba(${r1},${g1},${b1},${0.18*intensity}) 40%, transparent 70%)` }} />
      <div style={{ ...ambientGlow.blob, ...ambientGlow.blob2,
        background: `radial-gradient(circle, rgba(${r2},${g2},${b2},${0.45*intensity}), rgba(${r2},${g2},${b2},${0.15*intensity}) 45%, transparent 70%)` }} />
      <div style={{ ...ambientGlow.blob, ...ambientGlow.blob3,
        background: `radial-gradient(circle, rgba(${r3},${g3},${b3},${0.35*intensity}), transparent 65%)` }} />
      <div style={{ ...ambientGlow.blob, ...ambientGlow.blob4,
        background: `radial-gradient(circle, rgba(${r1},${g1},${b1},${0.30*intensity}), transparent 70%)` }} />
      <div aria-hidden style={{ ...ambientGlow.scanline,
        background: `linear-gradient(180deg, transparent, rgba(${r1},${g1},${b1},${0.04*intensity}) 50%, transparent)` }} />
    </div>
  );
}
const ambientGlow = {
  wrap: { position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(90px)',
    willChange: 'transform, opacity' },
  blob1: { top: '-12%', left: '38%', width: 700, height: 700,
    animation: 'glowDrift1 18s ease-in-out infinite, glowPulse1 7s ease-in-out infinite' },
  blob2: { bottom: '-18%', left: '-8%', width: 620, height: 620,
    animation: 'glowDrift2 22s ease-in-out infinite, glowPulse2 9s ease-in-out infinite' },
  blob3: { top: '30%', right: '-10%', width: 520, height: 520,
    animation: 'glowDrift3 26s ease-in-out infinite, glowPulse1 11s ease-in-out infinite' },
  blob4: { top: '60%', left: '20%', width: 380, height: 380,
    animation: 'glowDrift4 16s ease-in-out infinite, glowPulse2 6s ease-in-out infinite' },
  scanline: { position: 'absolute', inset: 0,
    animation: 'glowScan 14s linear infinite', mixBlendMode: 'screen' },
};

/* -----------------------------------------------------------------------
 * TopBar — minimal: just a wordmark + tiny right-side links.
 * Personal sites usually skip a heavy nav.
 * --------------------------------------------------------------------- */
function TopBar({ showStatus = true, statusText = 'Available · The Pale Blue Dot', accent = '#a78bfa', accent2 = '#60a5fa' }) {
  return (
    <header style={topBar.wrap}>
      <a href="#" style={topBar.brand}>
        <span style={{ ...topBar.dot, background: `linear-gradient(135deg,${accent2},${accent})`,
          boxShadow: `0 0 10px ${accent}99` }} />
        howar31
      </a>
      {showStatus && (
        <div style={topBar.right}>
          <span style={topBar.statusDot} />
          <span style={topBar.statusText}>{statusText}</span>
        </div>
      )}
    </header>
  );
}
const topBar = {
  wrap: { maxWidth: 1180, margin: '0 auto', padding: '28px 32px 0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-mono)', fontSize: 14, color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none', letterSpacing: '-0.01em' },
  dot: { width: 10, height: 10, borderRadius: '50%' },
  right: { display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#34d399',
    boxShadow: '0 0 8px rgba(52,211,153,0.7)' },
  statusText: { letterSpacing: '0.02em' },
};

/* -----------------------------------------------------------------------
 * IdentityCard — left rail. Avatar + name + bio + socials.
 * Sticky on desktop so it stays visible as the right column scrolls.
 * --------------------------------------------------------------------- */
function IdentityCard({ showAvatar = true, showNowPlaying = true,
  tagline = 'Web developer · open-source tinkerer',
  city = 'The Pale Blue Dot 🌌', accent = '#a78bfa', accent2 = '#60a5fa' }) {
  const socials = [
    { label: 'GitHub', href: 'https://github.com/howar31', icon: 'github' },
    { label: 'Blog', href: 'https://blog.howar31.com', icon: 'book-open' },
    { label: 'Email', href: 'mailto:hi@howar31.com', icon: 'mail' },
    { label: 'RSS', href: '#', icon: 'rss' },
  ];
  return (
    <aside style={idCard.wrap}>
      {showAvatar && (
        <div style={{ ...idCard.avatarFrame,
          background: `linear-gradient(135deg,${accent2},${accent})`,
          boxShadow: `0 0 24px ${accent}59` }}>
          <img src="../../assets/avatar-2025.jpg" alt="Howar31" style={idCard.avatar}/>
          <span style={{ ...idCard.heart, borderColor: accent, color: accent }}>♥</span>
        </div>
      )}
      <div style={idCard.handle}>@howar31</div>
      <h1 style={idCard.name}><span style={{ ...idCard.nameAccent,
        backgroundImage: `linear-gradient(to right,${accent2},${accent})` }}>Howar31</span></h1>
      <div style={idCard.role}>
        {tagline}<br/>
        Lives in <span style={idCard.subtle}>{city}</span>
      </div>

      <div style={idCard.metaRow}>
        <div style={idCard.metaCell}>
          <div style={idCard.metaLabel}>Since</div>
          <div style={idCard.metaValue}>1995</div>
        </div>
        <div style={idCard.metaCell}>
          <div style={idCard.metaLabel}>Repos</div>
          <div style={idCard.metaValue}>87</div>
        </div>
        <div style={idCard.metaCell}>
          <div style={idCard.metaLabel}>Posts</div>
          <div style={idCard.metaValue}>42</div>
        </div>
      </div>

      <div style={idCard.socials}>
        {socials.map(s => (
          <a key={s.label} href={s.href} style={idCard.socialBtn}>
            <img src={`https://unpkg.com/lucide-static@0.460.0/icons/${s.icon}.svg`}
              width="14" height="14" style={{ filter: 'invert(1) opacity(0.85)' }} alt=""/>
            {s.label}
          </a>
        ))}
      </div>

      {showNowPlaying && (
        <div style={{ ...idCard.now, background: accent2 + '0f', borderColor: accent2 + '26' }}>
          <div style={{ ...idCard.nowLabel, color: accent2 }}>♪ now playing</div>
          <div style={idCard.nowTitle}>lo-fi · 深夜 coding mix</div>
          <div style={idCard.nowMeter}>
            <span style={{ ...idCard.bar, background: `linear-gradient(to top,${accent2},${accent})`, height: 8, animationDelay: '0s' }} />
            <span style={{ ...idCard.bar, background: `linear-gradient(to top,${accent2},${accent})`, height: 14, animationDelay: '0.15s' }} />
            <span style={{ ...idCard.bar, background: `linear-gradient(to top,${accent2},${accent})`, height: 6, animationDelay: '0.3s' }} />
            <span style={{ ...idCard.bar, background: `linear-gradient(to top,${accent2},${accent})`, height: 12, animationDelay: '0.45s' }} />
            <span style={{ ...idCard.bar, background: `linear-gradient(to top,${accent2},${accent})`, height: 10, animationDelay: '0.6s' }} />
          </div>
        </div>
      )}
    </aside>
  );
}
const idCard = {
  wrap: { position: 'sticky', top: 28, alignSelf: 'start',
    padding: 28, borderRadius: 18,
    background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)' },
  avatarFrame: { position: 'relative', width: 132, height: 132, borderRadius: '50%',
    padding: 3 },
  avatar: { width: '100%', height: '100%', borderRadius: '50%', display: 'block',
    border: '3px solid rgb(2,6,23)', objectFit: 'cover' },
  heart: { position: 'absolute', right: -2, bottom: 6, width: 30, height: 30,
    borderRadius: '50%', background: 'rgb(2,6,23)', border: '2px solid',
    fontSize: 14, display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center' },
  handle: { marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' },
  name: { margin: '4px 0 0', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em',
    color: '#fff', lineHeight: 1.1 },
  nameAccent: { WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
  role: { marginTop: 12, fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)' },
  subtle: { color: 'rgba(255,255,255,0.85)' },
  metaRow: { marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
    gap: 8, padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)' },
  metaCell: { textAlign: 'center' },
  metaLabel: { fontFamily: 'var(--font-mono)', fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.45)' },
  metaValue: { marginTop: 4, fontSize: 18, fontWeight: 600, color: '#fff',
    fontVariantNumeric: 'tabular-nums' },
  socials: { marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 8 },
  socialBtn: { display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '9px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' },
  now: { marginTop: 18, padding: 14, borderRadius: 12, border: '1px solid' },
  nowLabel: { fontFamily: 'var(--font-mono)', fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.1em' },
  nowTitle: { marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  nowMeter: { marginTop: 10, display: 'flex', gap: 3, alignItems: 'flex-end',
    height: 16 },
  bar: { width: 3, borderRadius: 1.5,
    animation: 'meter 1.2s ease-in-out infinite' },
};

/* -----------------------------------------------------------------------
 * SectionTitle — small left-aligned label, never centered.
 * --------------------------------------------------------------------- */
function SectionTitle({ kicker, title, count, accent = '#a78bfa' }) {
  return (
    <div style={sectionTitle.wrap}>
      <div style={sectionTitle.kicker}>
        <span style={{ ...sectionTitle.dash, background: accent + 'b3' }} />
        {kicker}
      </div>
      <div style={sectionTitle.row}>
        <h2 style={sectionTitle.title}>{title}</h2>
        {count != null
          ? <span style={sectionTitle.count}>{String(count).padStart(2,'0')}</span>
          : null}
      </div>
    </div>
  );
}
const sectionTitle = {
  wrap: { marginBottom: 22 },
  kicker: { display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' },
  dash: { width: 22, height: 1 },
  row: { marginTop: 8, display: 'flex', alignItems: 'baseline',
    justifyContent: 'space-between', gap: 16 },
  title: { margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em',
    color: '#fff' },
  count: { fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.35)' },
};

/* -----------------------------------------------------------------------
 * IntroLetter — the "hi, I'm Howard" block. Letter-style copy, signed.
 * --------------------------------------------------------------------- */
function IntroLetter({ greeting = 'Hi there', signoff = '— Howar31', accent = '#a78bfa' }) {
  return (
    <article style={intro.wrap}>
      <div style={{ ...intro.greeting,
        backgroundImage: `linear-gradient(to right,#fff 30%,${accent})` }}>
        {greeting} <span style={intro.wave}>👋</span></div>
      <p style={intro.body}>
        I&rsquo;m Howar31 — a web developer from somewhere on this pale blue dot. I spend most of my days
        gluing together TypeScript and tiny servers, and most of my evenings
        building <em style={{ ...intro.em, color: accent }}>hype-sign</em>, a fully offline LED-display PWA
        that I&rsquo;d rather use than ship. I keep a slow-burning blog in
        <em style={{ ...intro.em, color: accent }}> 繁體中文</em> and English about whatever I&rsquo;ve
        recently broken.
      </p>
      <p style={intro.body}>
        This page is mostly an excuse to stay in touch — a card I keep
        updated. Nothing here is for sale.
      </p>
      <div style={intro.sign}>
        <div style={{ ...intro.signCursive, color: accent }}>{signoff}</div>
        <div style={intro.signMeta}>last touched · May 2026</div>
      </div>
    </article>
  );
}
const intro = {
  wrap: { padding: '28px 4px 0' },
  greeting: { fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em',
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    lineHeight: 1.1 },
  wave: { WebkitTextFillColor: 'initial', display: 'inline-block',
    transformOrigin: '70% 70%', animation: 'wave 2.4s ease-in-out infinite' },
  body: { marginTop: 18, fontSize: 17, lineHeight: 1.65,
    color: 'rgba(255,255,255,0.8)', maxWidth: 620 },
  em: { fontStyle: 'italic' },
  sign: { marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 14 },
  signCursive: { fontFamily: 'var(--font-kai), serif', fontSize: 22 },
  signMeta: { fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'rgba(255,255,255,0.4)' },
};

/* -----------------------------------------------------------------------
 * NowSection — what I'm doing right now (à la nownownow.com)
 * Three plain rows; no card chrome.
 * --------------------------------------------------------------------- */
function NowSection() {
  const items = [
    { dot: '#60a5fa', label: 'Building',  body: <>A breakfast-shop POS. Bun + Hono, hand-written receipt printer driver.</> },
    { dot: '#a78bfa', label: 'Reading',   body: <>“Designing Data-Intensive Applications” (re-read), 30% in.</> },
    { dot: '#34d399', label: 'Tinkering', body: <>A 0.1U Cherry MX board. Linear switches, lubed myself.</> },
    { dot: '#f59e0b', label: 'Avoiding',  body: <>Email. Sorry.</> },
  ];
  return (
    <ul style={now.list}>
      {items.map(it => (
        <li key={it.label} style={now.row}>
          <span style={{ ...now.dot, background: it.dot, boxShadow: `0 0 10px ${it.dot}99` }} />
          <span style={now.label}>{it.label}</span>
          <span style={now.body}>{it.body}</span>
        </li>
      ))}
    </ul>
  );
}
const now = {
  list: { listStyle: 'none', margin: 0, padding: 0,
    borderTop: '1px solid rgba(255,255,255,0.06)' },
  row: { display: 'grid',
    gridTemplateColumns: '20px 110px 1fr', alignItems: 'baseline', gap: 14,
    padding: '16px 4px',
    borderBottom: '1px solid rgba(255,255,255,0.06)' },
  dot: { width: 8, height: 8, borderRadius: '50%', justifySelf: 'center' },
  label: { fontFamily: 'var(--font-mono)', fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.6)' },
  body: { fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
};

/* -----------------------------------------------------------------------
 * ProjectRow — list-style, not card-grid. Shows year + title + tags + link.
 * --------------------------------------------------------------------- */
function ProjectRow({ year, title, lang, desc, tags, href, pinned }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href || '#'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...prow.wrap, background: hover ? 'rgba(15,23,42,0.6)' : 'transparent',
        borderColor: hover ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.06)' }}>
      <div style={prow.year}>{year}</div>
      <div style={prow.body}>
        <div style={prow.titleRow}>
          {pinned ? <span style={prow.pin}>★</span> : null}
          <span style={prow.title}>{title}</span>
          {lang ? <span style={{ ...prow.lang, background: lang.color + '22', color: lang.color }}>
            <span style={{ ...prow.langDot, background: lang.color }} />
            {lang.name}
          </span> : null}
        </div>
        <div style={prow.desc}>{desc}</div>
        <div style={prow.tags}>
          {(tags || []).map(t => <span key={t} style={prow.tag}>{t}</span>)}
        </div>
      </div>
      <div style={{ ...prow.arrow, transform: hover ? 'translateX(4px)' : 'none' }}>↗</div>
    </a>
  );
}
const prow = {
  wrap: { display: 'grid', gridTemplateColumns: '64px 1fr 24px',
    gap: 18, alignItems: 'start', padding: '18px 16px',
    borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
    color: 'inherit', textDecoration: 'none',
    transition: 'background 0.2s ease, border-color 0.2s ease' },
  year: { fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.4)', paddingTop: 4 },
  body: { minWidth: 0 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  pin: { color: '#fbbf24', fontSize: 14 },
  title: { fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' },
  lang: { display: 'inline-flex', alignItems: 'center', gap: 5,
    fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px',
    borderRadius: 999 },
  langDot: { width: 6, height: 6, borderRadius: '50%' },
  desc: { marginTop: 6, fontSize: 14.5, lineHeight: 1.55,
    color: 'rgba(255,255,255,0.7)' },
  tags: { marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' },
  tag: { fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px',
    borderRadius: 4, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.65)' },
  arrow: { color: 'rgba(167,139,250,0.7)', fontSize: 18, paddingTop: 4,
    transition: 'transform 0.2s ease' },
};

/* -----------------------------------------------------------------------
 * PostRow — blog post entries, list-style.
 * --------------------------------------------------------------------- */
function PostRow({ date, title, excerpt, lang, mins }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...post.wrap, color: hover ? '#fff' : 'rgba(255,255,255,0.85)' }}>
      <div style={post.date}>{date}</div>
      <div>
        <div style={post.title}>{title}</div>
        <div style={post.excerpt}>{excerpt}</div>
        <div style={post.meta}>
          <span>{lang}</span>
          <span style={post.metaDot}>·</span>
          <span>{mins} min read</span>
        </div>
      </div>
    </a>
  );
}
const post = {
  wrap: { display: 'grid', gridTemplateColumns: '110px 1fr', gap: 18,
    padding: '16px 0', textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    transition: 'color 0.2s ease' },
  date: { fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.4)', paddingTop: 3 },
  title: { fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' },
  excerpt: { marginTop: 6, fontSize: 14, lineHeight: 1.55,
    color: 'rgba(255,255,255,0.6)' },
  meta: { marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 8 },
  metaDot: { color: 'rgba(255,255,255,0.25)' },
};

/* -----------------------------------------------------------------------
 * Toolbox — small, dense pill grid. Not a "tech stack hero".
 * --------------------------------------------------------------------- */
function Toolbox({ items }) {
  return (
    <div style={tb.wrap}>
      {items.map(it => (
        <span key={it.label} style={tb.pill}>
          <span style={{ ...tb.dot, background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
const tb = {
  wrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '7px 12px', borderRadius: 999,
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)' },
  dot: { width: 7, height: 7, borderRadius: '50%' },
};

/* -----------------------------------------------------------------------
 * GuestbookCTA — friendly, low-pressure contact block.
 * --------------------------------------------------------------------- */
function GuestbookCTA({ accent = '#a78bfa', accent2 = '#60a5fa' }) {
  return (
    <div style={{ ...gb.wrap,
      background: `linear-gradient(135deg, ${accent2}14, ${accent}10)`,
      borderColor: accent + '33' }}>
      <div style={{ ...gb.kicker, color: accent }}>↳ Say hi</div>
      <div style={gb.body}>
        I read every email and most of the time I write back within a week.
        If it&rsquo;s about open source, the blog, or you just want to share
        a song — that&rsquo;s the right inbox.
      </div>
      <div style={gb.row}>
        <a href="mailto:hi@howar31.com" style={{ ...gb.primary,
          background: accent2 + '2e', borderColor: accent2 + '66' }}>hi@howar31.com</a>
        <span style={gb.or}>or</span>
        <a href="https://github.com/howar31" style={gb.ghost}>open an issue ↗</a>
      </div>
    </div>
  );
}
const gb = {
  wrap: { padding: 26, borderRadius: 16, border: '1px solid' },
  kicker: { fontFamily: 'var(--font-mono)', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: '0.14em' },
  body: { marginTop: 12, fontSize: 15, lineHeight: 1.6,
    color: 'rgba(255,255,255,0.85)', maxWidth: 540 },
  row: { marginTop: 18, display: 'flex', alignItems: 'center', gap: 12,
    flexWrap: 'wrap' },
  primary: { fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, letterSpacing: '0.01em',
    padding: '10px 18px', borderRadius: 10, color: '#fff',
    border: '1px solid', textDecoration: 'none' },
  or: { fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'rgba(255,255,255,0.4)' },
  ghost: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    borderBottom: '1px dashed rgba(255,255,255,0.3)' },
};

/* -----------------------------------------------------------------------
 * SiteFooter
 * --------------------------------------------------------------------- */
function SiteFooter() {
  return (
    <footer style={footer.wrap}>
      <div style={footer.col}>
        <div style={footer.muted}>© 1995 — 2026 Howar31.</div>
        <div style={footer.muted}>Crafted on the pale blue dot · Hugo + a lot of late nights.</div>
      </div>
      <div style={footer.col}>
        <div style={footer.muted}>v8.2.0 · last deploy May 5, 2026</div>
        <div style={footer.muted}>
          <span style={footer.live} /> 99.98% uptime · 60d
        </div>
      </div>
    </footer>
  );
}
const footer = {
  wrap: { marginTop: 64, padding: '28px 4px 40px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' },
  col: { display: 'flex', flexDirection: 'column', gap: 4 },
  muted: { fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'rgba(255,255,255,0.4)', display: 'inline-flex',
    alignItems: 'center', gap: 8 },
  live: { width: 6, height: 6, borderRadius: '50%', background: '#34d399',
    boxShadow: '0 0 6px #34d399' },
};

Object.assign(window, {
  AmbientGlow, TopBar, IdentityCard, SectionTitle, IntroLetter, NowSection,
  ProjectRow, PostRow, Toolbox, GuestbookCTA, SiteFooter,
});
