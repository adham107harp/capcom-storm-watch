/* Vercel serverless function: GET /api/donki
   Fetches the last 30 days of NASA DONKI space-weather events on the server, so the NASA API key
   stays in the NASA_API_KEY environment variable and never reaches the browser.
   Returns only the few fields the game shows: { fetched, cme:[{time,speed}], sep:[{time}], gst:[{time,kp}] } */
'use strict';

const BASE = 'https://api.nasa.gov/DONKI/';

function day(d) { return d.toISOString().slice(0, 10); }

async function getJSON(path, params) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error('DONKI ' + path + ' answered ' + r.status);
    const text = await r.text();
    return text.trim() ? JSON.parse(text) : [];
  } finally { clearTimeout(timer); }
}

function cmeSpeed(c) {
  const list = Array.isArray(c.cmeAnalyses) ? c.cmeAnalyses : [];
  const best = list.find(a => a && a.isMostAccurate) || list[0];
  return best && typeof best.speed === 'number' ? Math.round(best.speed) : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); res.status(405).json({ error: 'GET only' }); return; }
  const key = process.env.NASA_API_KEY || 'DEMO_KEY';
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 864e5);
  const p = { startDate: day(start), endDate: day(end), api_key: key };
  try {
    const [cme, sep, gst] = await Promise.all([getJSON('CME', p), getJSON('SEP', p), getJSON('GST', p)]);
    const out = {
      fetched: end.toISOString(),
      cme: (Array.isArray(cme) ? cme : []).map(c => ({ time: String(c.startTime || ''), speed: cmeSpeed(c) })),
      sep: (Array.isArray(sep) ? sep : []).map(s => ({ time: String(s.eventTime || '') })),
      gst: (Array.isArray(gst) ? gst : []).map(g => {
        const kps = (g.allKpIndex || []).map(k => Number(k.kpIndex)).filter(n => !isNaN(n));
        return { time: String(g.startTime || ''), kp: kps.length ? Math.max.apply(null, kps) : null };
      })
    };
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(out);
  } catch (e) {
    /* never echo the key or the upstream URL */
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'NASA DONKI could not be reached right now.' });
  }
};
