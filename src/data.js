export const API_KEY  = "6c1a9280b377500121d707e88e05e15d";
export const IMG_BASE = "https://image.tmdb.org/t/p/w500";
export const BACK_BASE= "https://image.tmdb.org/t/p/w1280";
export const DET_BASE = "https://image.tmdb.org/t/p/w342";

const cache = new Map();
export async function api(url) {
  if (cache.has(url)) return cache.get(url);
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  cache.set(url, d);
  return d;
}

export const SPORTS = [
  {id:"s1",title:"ICC Cricket World Cup 2025",cat:"Cricket",live:true, time:"LIVE",       t1:"IND",       t2:"AUS",     s1:"287/4",s2:"243/8",img:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=80"},
  {id:"s2",title:"FIFA Club World Cup",        cat:"Football",live:true, time:"67'",        t1:"Real Madrid",t2:"Man City",s1:"2",    s2:"1",   img:"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80"},
  {id:"s3",title:"Wimbledon 2025 – Men's Final",cat:"Tennis", live:false,time:"Tomorrow 3PM",t1:"Djokovic",  t2:"Alcaraz", s1:"",    s2:"",    img:"https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80"},
  {id:"s4",title:"NBA Finals Game 5",          cat:"Basketball",live:false,time:"Tonight 8PM",t1:"Lakers",   t2:"Celtics", s1:"",    s2:"",    img:"https://images.unsplash.com/photo-1546519638405-a88fae4d37aa?w=500&q=80"},
  {id:"s5",title:"Formula 1 – British GP",     cat:"Racing",  live:true, time:"LAP 42/52", t1:"Verstappen",t2:"Hamilton", s1:"P1",  s2:"P2",  img:"https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80"},
  {id:"s6",title:"IPL 2025 – Final",           cat:"Cricket", live:false,time:"Sun 7:30PM",t1:"MI",        t2:"CSK",     s1:"",    s2:"",    img:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80"},
  {id:"s7",title:"French Open – Women's Final",cat:"Tennis",  live:false,time:"Mon 2PM",   t1:"Swiatek",   t2:"Gauff",   s1:"",    s2:"",    img:"https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80"},
  {id:"s8",title:"UFC 302 Main Event",         cat:"MMA",     live:false,time:"Sat 10PM",  t1:"Jones",     t2:"Miocic",  s1:"",    s2:"",    img:"https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&q=80"},
];

export const SPORT_CATS = ["All","Cricket","Football","Tennis","Basketball","Racing","MMA"];

export const PLANS = [
  {id:"free",   n:"Free",       p:"₹0/mo",   d:"Ads, SD quality"},
  {id:"mobile", n:"Mobile",     p:"₹149/mo", d:"HD · 1 screen · Mobile only"},
  {id:"super",  n:"Super",      p:"₹299/mo", d:"Full HD · 3 screens · All devices"},
  {id:"premium",n:"Premium 4K", p:"₹499/mo", d:"4K Ultra HD · 4 screens · Dolby"},
];

export const NAV_TABS = [
  {id:"home",     l:"Home",      i:"🏠"},
  {id:"movies",   l:"Movies",    i:"🎬"},
  {id:"webshow",  l:"Web Shows", i:"🎭"},
  {id:"serial",   l:"Serials",   i:"📺"},
  {id:"sports",   l:"Sports",    i:"🏆"},
  {id:"watchlist",l:"Watchlist", i:"🔖"},
];

export const SECTION_CFG = {
  home:[
    {k:"popular",  t:"Most Popular",       i:"🔥",tv:false},
    {k:"trending", t:"Trending Now",        i:"📈",tv:false},
    {k:"bollywood",t:"Bollywood Hits",      i:"🎪",tv:false},
    {k:"series",   t:"Top Series",          i:"📺",tv:true, w:true},
  ],
  movies:[
    {k:"nowplaying",t:"Now Playing",        i:"▶️", tv:false},
    {k:"toprated",  t:"Top Rated",          i:"⭐", tv:false},
    {k:"upcoming",  t:"Coming Soon",        i:"🗓️",tv:false},
    {k:"bollywood", t:"Bollywood",          i:"🎪", tv:false},
  ],
  webshow:[
    {k:"popular",  t:"Popular Web Shows",   i:"🔥",tv:true,w:true},
    {k:"trending", t:"Trending Shows",       i:"📈",tv:true,w:true},
    {k:"toprated", t:"Critically Acclaimed", i:"🏅",tv:true,w:true},
  ],
  serial:[
    {k:"hindi",  t:"Hindi Serials",         i:"🇮🇳",tv:true,w:true},
    {k:"drama",  t:"Drama Series",           i:"🎭", tv:true},
    {k:"family", t:"Family Shows",           i:"👨‍👩‍👧", tv:true},
  ],
};

export function getEndpoints(cat, page) {
  const p = `&page=${page}`;
  const K = API_KEY;
  if (cat==="home") return {
    popular:   `https://api.themoviedb.org/3/movie/popular?api_key=${K}${p}`,
    trending:  `https://api.themoviedb.org/3/trending/movie/week?api_key=${K}${p}`,
    bollywood: `https://api.themoviedb.org/3/discover/movie?api_key=${K}&with_origin_country=IN&sort_by=popularity.desc${p}`,
    series:    `https://api.themoviedb.org/3/tv/top_rated?api_key=${K}${p}`,
  };
  if (cat==="movies") return {
    nowplaying:`https://api.themoviedb.org/3/movie/now_playing?api_key=${K}${p}`,
    toprated:  `https://api.themoviedb.org/3/movie/top_rated?api_key=${K}${p}`,
    upcoming:  `https://api.themoviedb.org/3/movie/upcoming?api_key=${K}${p}`,
    bollywood: `https://api.themoviedb.org/3/discover/movie?api_key=${K}&with_origin_country=IN${p}`,
  };
  if (cat==="webshow") return {
    popular:  `https://api.themoviedb.org/3/tv/popular?api_key=${K}${p}`,
    toprated: `https://api.themoviedb.org/3/tv/top_rated?api_key=${K}${p}`,
    trending: `https://api.themoviedb.org/3/trending/tv/week?api_key=${K}${p}`,
  };
  if (cat==="serial") return {
    hindi:  `https://api.themoviedb.org/3/discover/tv?api_key=${K}&with_origin_country=IN&sort_by=popularity.desc${p}`,
    drama:  `https://api.themoviedb.org/3/discover/tv?api_key=${K}&with_genres=18${p}`,
    family: `https://api.themoviedb.org/3/discover/tv?api_key=${K}&with_genres=10751${p}`,
  };
  return null;
}
