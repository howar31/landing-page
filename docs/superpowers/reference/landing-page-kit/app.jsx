/* eslint-disable */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#a78bfa",
  "accent2": "#60a5fa",
  "glowIntensity": 1.6,
  "density": "regular",
  "fontScale": 1,
  "showAvatar": true,
  "showNowPlaying": true,
  "showStatus": true,
  "showNow": true,
  "showProjects": true,
  "showWriting": true,
  "showToolbox": true,
  "showGuestbook": true,
  "showFooter": true,
  "projectStyle": "list",
  "greeting": "Hi there",
  "tagline": "Web developer · open-source tinkerer",
  "city": "The Pale Blue Dot 🌌",
  "statusText": "Available · The Pale Blue Dot",
  "signoff": "— Howar31",
  "latinFont": "Inter"
}/*EDITMODE-END*/;

const PROJECTS = [
  { year: '2026', title: 'hype-sign', pinned: true,
    lang: { name: 'TypeScript', color: '#60a5fa' },
    desc: 'Fully-offline PWA LED display. Customizable scrolling marquee for events, venues, and impromptu pickup-line emergencies.',
    tags: ['react', 'vite', 'pwa', 'offline-first'],
    href: 'https://lab.howar31.com/hype-sign/' },
  { year: '2025', title: '早餐計算機', pinned: false,
    lang: { name: 'TypeScript', color: '#60a5fa' },
    desc: 'A breakfast-shop POS calculator built on Bun + Hono. Cashier-speed, offline-first, runs on a 10-year-old Android tablet.',
    tags: ['bun', 'hono', 'private'] },
  { year: '2024', title: 'howar31-blog', pinned: false,
    lang: { name: 'SCSS', color: '#c084fc' },
    desc: 'Hugo theme for my own blog. Bilingual zh-TW/en, full-text search, lightbox, hint blocks. The CSS that other UI kits in this system get distilled from.',
    tags: ['hugo', 'scss', 'static'],
    href: 'https://blog.howar31.com' },
  { year: '2023', title: '星際公民 中文社群網', pinned: false,
    lang: { name: 'Next.js', color: '#a78bfa' },
    desc: 'Star Citizen Traditional-Chinese community hub. Custom CMS, game-data pipeline, and forums that survive a flight-loop server wipe.',
    tags: ['next.js', 'cloud'] },
  { year: '2022', title: 'docker-toolkit', pinned: false,
    lang: { name: 'Bash', color: '#34d399' },
    desc: 'Internal CLI for spinning up reproducible dev environments across mac/linux team members. Used daily by ~6 people.',
    tags: ['bash', 'docker', 'private'] },
];

const POSTS = [
  { date: 'Apr 22, 2026', title: '為什麼我又寫了一個 LED 跑馬燈',
    excerpt: '一個關於 hype-sign 為何要做 offline-first，以及為什麼 PWA 是被低估的選擇。',
    lang: 'zh-TW', mins: 7 },
  { date: 'Mar 03, 2026', title: 'Bun + Hono on a 10-year-old tablet',
    excerpt: 'A breakfast-shop POS that boots in 1.2s. Notes on what survives, what doesn\u2019t, and why JIT was the wrong fight.',
    lang: 'EN', mins: 12 },
  { date: 'Jan 18, 2026', title: 'Subset .woff2 體積壓縮筆記',
    excerpt: 'Noto Sans TC 從 22 MB 壓到 480 KB 的 一份操作筆記，含字型編輯器設定、HarfBuzz 指令與踩過的雷。',
    lang: 'zh-TW', mins: 9 },
  { date: 'Nov 11, 2025', title: 'Why I still write Hugo in 2026',
    excerpt: 'Three years after I considered switching, a sober look at static-site fatigue and the cost of \u201cmodern\u201d.',
    lang: 'EN', mins: 6 },
];

const TOOLS = [
  { label: 'TypeScript',  color: '#60a5fa' },
  { label: 'Node · Bun',  color: '#34d399' },
  { label: 'Next.js',     color: '#a78bfa' },
  { label: 'Hugo',        color: '#fb7185' },
  { label: 'Tailwind',    color: '#22d3ee' },
  { label: 'PostgreSQL',  color: '#818cf8' },
  { label: 'AWS · GCP',   color: '#fbbf24' },
  { label: 'Docker',      color: '#60a5fa' },
  { label: 'Neovim',      color: '#34d399' },
  { label: 'Cherry MX Reds', color: '#f472b6' },
  { label: 'A good ☕',    color: '#a78bfa' },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const densityGap = t.density === 'compact' ? 36 : t.density === 'comfy' ? 80 : 56;

  const latinStack = t.latinFont === 'System'
    ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial'
    : `"${t.latinFont}"`;
  const fontFamily = `${latinStack}, "Noto Sans TC", sans-serif`;

  return (
    <>
      <AmbientGlow glowColor={t.accent} glowColor2={t.accent2} intensity={t.glowIntensity} />
      <div style={{ ...app.page, fontSize: 16 * t.fontScale, fontFamily }}>
        <TopBar showStatus={t.showStatus} statusText={t.statusText} accent={t.accent} accent2={t.accent2} />
        <main className="__appgrid" style={app.grid}>
          <IdentityCard
            showAvatar={t.showAvatar}
            showNowPlaying={t.showNowPlaying}
            tagline={t.tagline}
            city={t.city}
            accent={t.accent}
            accent2={t.accent2}
          />

          <div style={app.feed}>
            <IntroLetter greeting={t.greeting} signoff={t.signoff} accent={t.accent} />

            {t.showNow && (
              <section style={{ ...app.section, marginTop: densityGap }}>
                <SectionTitle kicker="// now" title="What I'm up to this week" accent={t.accent} />
                <NowSection />
              </section>
            )}

            {t.showProjects && (
              <section style={{ ...app.section, marginTop: densityGap }}>
                <SectionTitle kicker="// works" title="Things I've made" count={PROJECTS.length} accent={t.accent} />
                {t.projectStyle === 'cards' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
                    {PROJECTS.map(p => <ProjectRow key={p.title} {...p} card />)}
                  </div>
                ) : (
                  <div style={app.projectList}>
                    {PROJECTS.map(p => <ProjectRow key={p.title} {...p} />)}
                  </div>
                )}
                <a href="https://github.com/howar31" style={{ ...app.seeMore, color: t.accent, borderColor: t.accent + '66' }}>
                  see the rest on github ↗
                </a>
              </section>
            )}

            {t.showWriting && (
              <section style={{ ...app.section, marginTop: densityGap }}>
                <SectionTitle kicker="// writing" title="From the blog" count={42} accent={t.accent} />
                <div>
                  {POSTS.map(p => <PostRow key={p.title} {...p} />)}
                </div>
                <a href="https://blog.howar31.com" style={{ ...app.seeMore, color: t.accent, borderColor: t.accent + '66' }}>
                  read all 42 posts ↗
                </a>
              </section>
            )}

            {t.showToolbox && (
              <section style={{ ...app.section, marginTop: densityGap }}>
                <SectionTitle kicker="// toolbox" title="Tools I keep returning to" accent={t.accent} />
                <Toolbox items={TOOLS} />
                <p style={app.toolboxNote}>
                  Not a manifesto. I&rsquo;ll happily learn yours over a coffee.
                </p>
              </section>
            )}

            {t.showGuestbook && (
              <section style={{ ...app.section, marginTop: densityGap }}>
                <GuestbookCTA accent={t.accent} accent2={t.accent2} />
              </section>
            )}

            {t.showFooter && <SiteFooter />}
          </div>
        </main>
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakColor label="Accent" value={t.accent}
          options={['#a78bfa','#60a5fa','#34d399','#fb7185','#fbbf24','#22d3ee']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakColor label="Accent 2" value={t.accent2}
          options={['#60a5fa','#a78bfa','#22d3ee','#34d399','#f472b6','#fbbf24']}
          onChange={(v) => setTweak('accent2', v)} />
        <TweakSlider label="Glow intensity" value={t.glowIntensity} min={0} max={3} step={0.1}
          onChange={(v) => setTweak('glowIntensity', v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={['compact','regular','comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSlider label="Font scale" value={t.fontScale} min={0.85} max={1.25} step={0.05}
          onChange={(v) => setTweak('fontScale', v)} />
        <TweakSelect label="Latin font" value={t.latinFont}
          options={['Inter', 'IBM Plex Sans', 'Geist', 'System', 'Noto Sans TC']}
          onChange={(v) => setTweak('latinFont', v)} />
        <TweakRadio label="Projects" value={t.projectStyle} options={['list','cards']}
          onChange={(v) => setTweak('projectStyle', v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="Avatar" value={t.showAvatar} onChange={(v) => setTweak('showAvatar', v)} />
        <TweakToggle label="Status pill" value={t.showStatus} onChange={(v) => setTweak('showStatus', v)} />
        <TweakToggle label="Now playing" value={t.showNowPlaying} onChange={(v) => setTweak('showNowPlaying', v)} />
        <TweakToggle label="Now list" value={t.showNow} onChange={(v) => setTweak('showNow', v)} />
        <TweakToggle label="Projects" value={t.showProjects} onChange={(v) => setTweak('showProjects', v)} />
        <TweakToggle label="Writing" value={t.showWriting} onChange={(v) => setTweak('showWriting', v)} />
        <TweakToggle label="Toolbox" value={t.showToolbox} onChange={(v) => setTweak('showToolbox', v)} />
        <TweakToggle label="Guestbook" value={t.showGuestbook} onChange={(v) => setTweak('showGuestbook', v)} />
        <TweakToggle label="Footer" value={t.showFooter} onChange={(v) => setTweak('showFooter', v)} />

        <TweakSection label="Copy" />
        <TweakText label="Greeting" value={t.greeting} onChange={(v) => setTweak('greeting', v)} />
        <TweakText label="Tagline" value={t.tagline} onChange={(v) => setTweak('tagline', v)} />
        <TweakText label="City" value={t.city} onChange={(v) => setTweak('city', v)} />
        <TweakText label="Status" value={t.statusText} onChange={(v) => setTweak('statusText', v)} />
        <TweakText label="Sign-off" value={t.signoff} onChange={(v) => setTweak('signoff', v)} />
      </TweaksPanel>
    </>
  );
}

const app = {
  page: { position: 'relative', zIndex: 1, minHeight: '100vh' },
  grid: { maxWidth: 1180, margin: '0 auto',
    padding: '40px 32px 0',
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: 56, alignItems: 'start' },
  feed: { minWidth: 0, paddingTop: 4 },
  section: { marginTop: 56 },
  projectList: { display: 'flex', flexDirection: 'column', gap: 4 },
  seeMore: { display: 'inline-block', marginTop: 18,
    fontFamily: 'var(--font-mono)', fontSize: 13,
    textDecoration: 'none', borderBottom: '1px dashed' },
  toolboxNote: { marginTop: 16, fontSize: 13.5,
    color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' },
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
