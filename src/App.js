import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import { api, API_KEY, IMG_BASE, BACK_BASE, DET_BASE, SPORTS, SPORT_CATS, PLANS, NAV_TABS, SECTION_CFG, getEndpoints } from './data';

/* ─── PARTICLES ─── */
function useParticles() {
  useEffect(() => {
    const cv = document.getElementById('pcv');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf;
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1 + 0.3, sp: Math.random() * 0.2 + 0.04, op: Math.random() * 0.45 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      stars.forEach(s => {
        s.y += s.sp;
        if (s.y > cv.height) { s.y = 0; s.x = Math.random() * cv.width; }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.op})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
}

/* ─── REVEAL ─── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─── LOADING SCREEN ─── */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-logo">CINEVERSE</div>
      <div className="loading-bar"><div className="loading-fill" /></div>
    </div>
  );
}

/* ─── TOAST ─── */
function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }

/* ─── LOGIN MODAL ─── */
function LoginModal({ onClose, onLogin }) {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [plan, setPlan] = useState('super');

  const go = () => {
    if (tab === 'login') { if (!email) return; onLogin({ name: email.split('@')[0] || 'User', email, plan: 'super' }); }
    else if (tab === 'register') { if (!name || !email) return; setTab('plans'); }
    else onLogin({ name, email, plan });
  };

  return (
    <div className="ov" onClick={e => e.target.className === 'ov' && onClose()}>
      <div className="mb">
        <button className="mx" onClick={onClose}>✕</button>
        <div className="mlogo">CINEVERSE</div>
        <div className="msub">India's Premium Streaming Platform</div>
        {tab !== 'plans' && (
          <div className="mtabs">
            <button className={`mtab${tab === 'login' ? ' on' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`mtab${tab === 'register' ? ' on' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>
        )}
        {tab === 'login' && <>
          <div className="ig"><label className="il">Email</label><input className="ii" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="ig"><label className="il">Password</label><input className="ii" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} /></div>
          <button className="bp" onClick={go}>▶ Sign In</button>
          <div className="dor">or continue with</div>
          <div className="sb2">
            <button className="soc" onClick={() => onLogin({ name: 'Google User', email: 'g@google.com', plan: 'super' })}>🌐 Google</button>
            <button className="soc" onClick={() => onLogin({ name: 'Apple User', email: 'a@apple.com', plan: 'super' })}>🍎 Apple</button>
          </div>
        </>}
        {tab === 'register' && <>
          <div className="ig"><label className="il">Full Name</label><input className="ii" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="ig"><label className="il">Email</label><input className="ii" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="ig"><label className="il">Password</label><input className="ii" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} /></div>
          <button className="bp" onClick={go}>Continue to Plans →</button>
        </>}
        {tab === 'plans' && <>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 19, letterSpacing: 1, marginBottom: 4 }}>Choose Your Plan</div>
          <div className="plans">
            {PLANS.map(p => (
              <div key={p.id} className={`pc${plan === p.id ? ' on' : ''}`} onClick={() => setPlan(p.id)}>
                <div><div className="pn">{p.n}</div><div className="pd">{p.d}</div></div>
                <div className="pp">{p.p}</div>
              </div>
            ))}
          </div>
          <button className="bp" onClick={go}>🚀 Start Watching</button>
        </>}
      </div>
    </div>
  );
}

/* ─── HERO SLIDER ─── */
function HeroSlider({ onOpen, cat }) {
  const [movies, setMovies] = useState([]);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const url = (cat === 'webshow' || cat === 'serial')
      ? `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
      : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;
    api(url).then(d => { setMovies(d.results.slice(0, 7)); setIdx(0); });
  }, [cat]);

  const nxt = useCallback(() => setIdx(i => (i + 1) % movies.length), [movies.length]);
  const prv = useCallback(() => setIdx(i => (i - 1 + movies.length) % movies.length), [movies.length]);

  useEffect(() => {
    if (!movies.length) return;
    timer.current = setInterval(nxt, 5800);
    return () => clearInterval(timer.current);
  }, [movies.length, nxt]);

  const go = fn => { clearInterval(timer.current); fn(); timer.current = setInterval(nxt, 5800); };

  if (!movies.length) return (
    <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3, color: 'var(--muted)' }}>LOADING…</div>
    </div>
  );

  const m = movies[idx];
  const title = m.title || m.name || '';
  const year  = (m.release_date || m.first_air_date || '').slice(0, 4);
  const isTV  = !m.title;

  return (
    <div className="hero">
      {movies.map((mv, i) => (
        <div key={mv.id} className={`hs${i === idx ? ' on' : ''}`}
          style={{ backgroundImage: mv.backdrop_path ? `url(${BACK_BASE + mv.backdrop_path})` : 'none' }} />
      ))}
      <div className="hc" key={idx}>
        <div className="hey">
          <span className="hb1">{isTV ? 'SERIES' : 'MOVIE'}</span>
          <span className="hb2">{year}</span>
        </div>
        <h1 className="ht">{title}</h1>
        <p className="hd">{(m.overview || '').slice(0, 148)}{m.overview?.length > 148 ? '…' : ''}</p>
        <div className="hm">
          <span style={{ color: 'var(--gold)' }}>⭐ {m.vote_average?.toFixed(1)}</span>
          <span className="dot3" />
          <span>{year}</span>
        </div>
        <div className="ha">
          <button className="bpl" onClick={() => onOpen(m.id, isTV)}>▶ Watch Now</button>
          <button className="bwl">+ Watchlist</button>
        </div>
      </div>
      <button className="hn prev" onClick={() => go(prv)}>❮</button>
      <button className="hn next" onClick={() => go(nxt)}>❯</button>
      <div className="hdn">
        {movies.map((_, i) => <button key={i} className={`hd2${i === idx ? ' on' : ''}`} onClick={() => go(() => setIdx(i))} />)}
      </div>
    </div>
  );
}

/* ─── CARD ─── */
function Card({ item, tv, w, onClick }) {
  const [ok, setOk] = useState(false);
  const title  = tv ? (item.name || item.original_name) : (item.title || item.original_title);
  const year   = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const poster = w ? item.backdrop_path : item.poster_path;
  return (
    <div className={`cs${w ? ' w' : ''}`} onClick={() => onClick(item.id, tv)}>
      <div className="ci">
        <div className="csh" />
        {rating && <span className="cr2">⭐ {rating}</span>}
        {poster
          ? <img className={`cp${ok ? ' ok' : ''}`} src={IMG_BASE + poster} alt={title} loading="lazy" onLoad={() => setOk(true)} />
          : <div className="cph">{tv ? '📺' : '🎬'}</div>
        }
        <div className="cn">
          <div className="ct">{title}</div>
          <div className="cy">{year}</div>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ count = 8, w = false }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={`cs${w ? ' w' : ''}`}>
      <div className="ci sk">
        <div className="cph" />
        <div className="cn"><div className="sl2" /><div className="sl2 s" /></div>
      </div>
    </div>
  ));
}

/* ─── SECTION ─── */
function Section({ title, icon, movies, loading, tv, w, onMore, onOpen }) {
  return (
    <section className="sec rv">
      <div className="sh">
        <h2><span>{icon}</span> {title}</h2>
        {onMore && <button className="sm" onClick={onMore}>See all →</button>}
      </div>
      <div className="cr">
        {loading ? <Skeleton w={w} /> : movies.map(m => <Card key={m.id} item={m} tv={tv} w={w} onClick={onOpen} />)}
      </div>
    </section>
  );
}

/* ─── SPORTS ─── */
function SportsPage() {
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? SPORTS : SPORTS.filter(s => s.cat === filter);
  return (
    <div className="sec" style={{ paddingTop: 26 }}>
      <div className="sh"><h2>🏆 All Sports</h2></div>
      <div className="spf">
        {SPORT_CATS.map(c => <button key={c} className={`spp${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      <div className="spg">
        {list.map(s => (
          <div key={s.id} className="spc">
            {s.img ? <img className="spi" src={s.img} alt={s.title} loading="lazy" /> : <div className="spph">🏅</div>}
            {s.live && <span className="splv">● LIVE</span>}
            <span className="spct">{s.cat}</span>
            <div className="spb">
              <div className="sptl">{s.title}</div>
              {s.t1 && (
                <div className="spvs">
                  <div className="sptm">{s.t1}{s.s1 && <div className="spsc">{s.s1}</div>}</div>
                  <div className="spv">VS</div>
                  <div className="sptm">{s.t2}{s.s2 && <div className="spsc">{s.s2}</div>}</div>
                </div>
              )}
              <div className="sptm2">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── WATCHLIST ─── */
function WatchlistPage({ items, onOpen }) {
  return (
    <div className="sec" style={{ paddingTop: 26 }}>
      <div className="sh"><h2>🔖 My Watchlist</h2></div>
      {items.length === 0
        ? <div className="wle"><div className="wli">📋</div><h3>Your Watchlist is Empty</h3><p>Browse content and tap + Watchlist to save titles.</p></div>
        : <div className="cr">{items.map(it => <Card key={it.id} item={it} tv={it._tv} onClick={onOpen} />)}</div>
      }
    </div>
  );
}

/* ─── DETAIL PAGE ─── */
function DetailPage({ id, tv, onBack, onWL }) {
  const [item, setItem]     = useState(null);
  const [cred, setCred]     = useState(null);
  const [sim, setSim]       = useState([]);
  const [deepId, setDeepId] = useState(null);
  const [deepTv, setDeepTv] = useState(false);

  useEffect(() => {
    setItem(null);
    const base = tv ? 'tv' : 'movie';
    Promise.all([
      api(`https://api.themoviedb.org/3/${base}/${id}?api_key=${API_KEY}`),
      api(`https://api.themoviedb.org/3/${base}/${id}/credits?api_key=${API_KEY}`),
      api(`https://api.themoviedb.org/3/${base}/${id}/similar?api_key=${API_KEY}`),
    ]).then(([m, c, s]) => { setItem(m); setCred(c); setSim(s.results.slice(0, 10)); });
    window.scrollTo({ top: 0 });
  }, [id, tv]);

  if (deepId) return <DetailPage id={deepId} tv={deepTv} onBack={() => setDeepId(null)} onWL={onWL} />;

  if (!item) return (
    <div className="dw" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, color: 'var(--muted)' }}>LOADING…</div>
    </div>
  );

  const title = item.title || item.name;
  const year  = (item.release_date || item.first_air_date || '').slice(0, 4);
  const dir   = cred?.crew?.find(p => p.job === 'Director');
  const cast  = cred?.cast?.slice(0, 5).map(a => a.name).join(', ');
  const rt    = item.runtime || item.episode_run_time?.[0];

  return (
    <div className="dw">
      <div className="dbd" style={{ backgroundImage: item.backdrop_path ? `url(${BACK_BASE + item.backdrop_path})` : 'none' }} />
      <button className="dbk" onClick={onBack}>← Back</button>
      <div className="dbo">
        {item.poster_path && <div className="dpo"><img src={DET_BASE + item.poster_path} alt={title} /></div>}
        <div className="din2">
          <h1 className="dtl">{title}</h1>
          <div className="dgs">{item.genres?.map(g => <span key={g.id} className="dg">{g.name}</span>)}</div>
          <div className="dst">
            <div className="ds"><span className="dsv g">⭐ {item.vote_average?.toFixed(1)}</span><span className="dsl">Rating</span></div>
            <div className="ds"><span className="dsv">{year}</span><span className="dsl">Year</span></div>
            {rt && <div className="ds"><span className="dsv">{rt}m</span><span className="dsl">Runtime</span></div>}
            {item.budget > 0 && <div className="ds"><span className="dsv">${(item.budget / 1e6).toFixed(0)}M</span><span className="dsl">Budget</span></div>}
            {item.number_of_seasons && <div className="ds"><span className="dsv">{item.number_of_seasons}</span><span className="dsl">Seasons</span></div>}
          </div>
          <div className="dac">
            <button className="bpl">▶ Play Now</button>
            <button className="bwl" onClick={() => onWL({ ...item, _tv: tv })}>+ Watchlist</button>
          </div>
          <p className="dov">{item.overview}</p>
          <div className="dcr">
            {dir  && <div className="dr"><span className="dl">Director</span>{dir.name}</div>}
            {cast && <div className="dr"><span className="dl">Cast</span>{cast}</div>}
            {item.created_by?.length > 0 && <div className="dr"><span className="dl">Created By</span>{item.created_by.map(c => c.name).join(', ')}</div>}
          </div>
        </div>
      </div>
      {sim.length > 0 && (
        <div className="sec">
          <div className="sh"><h2>More Like This</h2></div>
          <div className="cr">
            {sim.map(m => <Card key={m.id} item={m} tv={tv} onClick={(sid, stv) => { setDeepId(sid); setDeepTv(stv); }} />)}
          </div>
        </div>
      )}
      <div className="ft"><span className="fl">CINEVERSE</span> · Powered by TMDB</div>
    </div>
  );
}

/* ══════════════════ MAIN APP ══════════════════ */
export default function App() {
  const [cat, setCat]   = useState('home');
  const [view, setView] = useState('browse');
  const [q, setQ]       = useState('');
  const [sugg, setSugg] = useState([]);
  const [srRes, setSrRes] = useState([]);
  const [detId, setDetId] = useState(null);
  const [detTv, setDetTv] = useState(false);
  const [user, setUser]   = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);
  const [wl, setWl]   = useState([]);
  const [toast, setToast] = useState('');
  const [prom, setProm]   = useState(true);
  const [data, setData]   = useState({});
  const [pages, setPages] = useState({});
  const [load, setLoad]   = useState({});
  const [ready, setReady] = useState(false);
  const deb = useRef(null);

  useParticles();
  useReveal();

  useEffect(() => { setTimeout(() => setReady(true), 1400); }, []);

  useEffect(() => {
    if (cat === 'sports' || cat === 'watchlist') return;
    const e = getEndpoints(cat, 1);
    if (!e) return;
    setLoad(p => ({ ...p, [cat]: true }));
    const keys = Object.keys(e);
    Promise.all(keys.map(k => api(e[k]))).then(res => {
      const obj = {};
      keys.forEach((k, i) => { obj[k] = res[i].results; });
      setData(p => ({ ...p, [cat]: obj }));
      const po = {};
      keys.forEach(k => { po[k] = 1; });
      setPages(p => ({ ...p, [cat]: po }));
      setLoad(p => ({ ...p, [cat]: false }));
    });
  }, [cat]);

  const showMsg = m => { setToast(m); setTimeout(() => setToast(''), 2600); };

  const loadMore = async sec => {
    const np = (pages[cat]?.[sec] || 1) + 1;
    const e = getEndpoints(cat, np);
    if (!e || !e[sec]) return;
    const d = await api(e[sec]);
    setData(p => ({ ...p, [cat]: { ...p[cat], [sec]: [...(p[cat]?.[sec] || []), ...d.results] } }));
    setPages(p => ({ ...p, [cat]: { ...p[cat], [sec]: np } }));
  };

  const handleInput = v => {
    setQ(v);
    clearTimeout(deb.current);
    if (!v.trim()) { setSugg([]); return; }
    deb.current = setTimeout(async () => {
      const d = await api(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(v)}`);
      setSugg(d.results.filter(r => r.media_type !== 'person').slice(0, 6));
    }, 320);
  };

  const doSearch = async () => {
    if (!q.trim()) return;
    setSugg([]);
    const d = await api(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(q)}`);
    setSrRes(d.results.filter(r => r.media_type !== 'person'));
    setView('search');
  };

  const openDetail = (id, tv = false) => { setDetId(id); setDetTv(tv); setView('detail'); setSugg([]); };

  const addWL = item => {
    if (wl.find(w => w.id === item.id)) { showMsg('Already in Watchlist'); return; }
    setWl(p => [item, ...p]);
    showMsg('✅ Added to Watchlist');
  };

  if (!ready) return <LoadingScreen />;

  const cd = data[cat] || {};
  const ld = load[cat];

  return (
    <div onClick={() => { if (showMenu) setShowMenu(false); }}>
      <Toast msg={toast} />

      {prom && !user && (
        <div className="promo">
          <span>🎬 Watch unlimited Movies, Shows &amp; Live Sports — Ad-free in 4K</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => { setShowLogin(true); setProm(false); }}>Upgrade Now</button>
            <span style={{ cursor: 'pointer', opacity: 0.6, fontSize: 17 }} onClick={() => setProm(false)}>✕</span>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className="nav">
        <div className="logo" onClick={() => { setCat('home'); setView('browse'); }}>CINEVERSE</div>
        <ul className="nc">
          {NAV_TABS.map(c => (
            <li key={c.id}>
              <button
                className={`nb${cat === c.id && view === 'browse' ? ' on' : ''}`}
                onClick={() => { setCat(c.id); setView('browse'); setSugg([]); }}
              >
                <span>{c.i}</span><span className="lbl">{c.l}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="nr">
          <div className="sw">
            <div className="si">
              <input value={q} onChange={e => handleInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search…" />
              {q && <button className="sx" onClick={() => { setQ(''); setSugg([]); }}>✕</button>}
              <button className="sbtn" onClick={doSearch}>🔍</button>
            </div>
            {sugg.length > 0 && (
              <ul className="sl">
                {sugg.map(m => (
                  <li key={m.id} onClick={() => openDetail(m.id, m.media_type === 'tv')}>
                    <span>{m.media_type === 'tv' ? '📺' : '🎬'}</span>
                    <span>{m.title || m.name} {(m.release_date || m.first_air_date || '').slice(0, 4) && `(${(m.release_date || m.first_air_date).slice(0, 4)})`}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {user ? (
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div className="av" onClick={() => setShowMenu(v => !v)}>{user.name?.[0]?.toUpperCase()}</div>
              {showMenu && (
                <div className="um">
                  <div style={{ padding: '7px 12px 3px', fontSize: 12, color: 'var(--muted)' }}>
                    <div style={{ color: 'var(--text)', fontWeight: 600 }}>{user.name}</div>
                    <div>{user.email}</div>
                    <div style={{ color: 'var(--cyan)', marginTop: 2 }}>🏅 {PLANS.find(p => p.id === user.plan)?.n || 'Free'} Plan</div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--bdr)', margin: '6px 0' }} />
                  <button className="ui" onClick={() => { setCat('watchlist'); setView('browse'); setShowMenu(false); }}>🔖 My Watchlist</button>
                  <button className="ui" onClick={() => showMsg('⚙️ Settings coming soon!')}>⚙️ Settings</button>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--bdr)', margin: '6px 0' }} />
                  <button className="ui red" onClick={() => { setUser(null); setShowMenu(false); showMsg('Signed out'); }}>⇠ Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="bln" onClick={() => setShowLogin(true)}>Sign In</button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); showMsg(`👋 Welcome, ${u.name}!`); }} />}

      {view === 'detail' && detId && <DetailPage id={detId} tv={detTv} onBack={() => setView('browse')} onWL={addWL} />}

      {view === 'search' && (
        <div className="ss">
          <h2>Results for "{q}" — {srRes.length} found</h2>
          {srRes.length
            ? <div className="cr">{srRes.map(m => <Card key={m.id} item={m} tv={m.media_type === 'tv'} onClick={openDetail} />)}</div>
            : <div className="nr2">No results. Try different keywords.</div>
          }
        </div>
      )}

      {view === 'browse' && (
        <main>
          {cat === 'sports' ? <SportsPage /> :
           cat === 'watchlist' ? <WatchlistPage items={wl} onOpen={openDetail} /> : (
            <>
              <HeroSlider onOpen={openDetail} cat={cat} />
              {(SECTION_CFG[cat] || []).map(sc => (
                <Section key={sc.k} title={sc.t} icon={sc.i} movies={cd[sc.k] || []} loading={ld} tv={sc.tv} w={sc.w} onMore={() => loadMore(sc.k)} onOpen={openDetail} />
              ))}
              <div className="ft">
                <div className="fl">CINEVERSE</div>
                <div>Movies · Web Shows · Serials · Live Sports</div>
                <div style={{ marginTop: 3 }}>© 2025 Cineverse · Powered by TMDB</div>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
