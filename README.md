# CAPCOM: Storm Watch

A NASA Space Apps Challenge 2026 entry for **Build a Junior Astronaut Mission Trainer**.
Kids aged 7–12 play CAPCOM, the person who talks to the crew by radio. Real space weather from NASA records
(solar storms on the Moon, a planet-wide dust storm on Mars) hits imagined bases. Players weigh radiation shielding, power, food, communication delay
and mission goals, and every choice has a cost.

| Level | Real event (NASA DONKI) | What the player learns |
|---|---|---|
| 0 | Real Moon (LRO colour + LOLA elevation), the nine Artemis III south-pole regions | Choosing a base site: sunlight and power vs. ice vs. easy landing and radio |
| 1 | 10 Sept 2017, X8.2 flare | Fast particles arrive in minutes, so get the crew under thick walls |
| 2 | 10–13 May 2024, G5 storm, two waves | Long storms: shelter mass vs. running out of power, waiting out the second wave |
| 3 | 23 July 2012 near miss (~3,000 km/s, missed Earth) | Read NASA's real forecast map, power the greenhouse (food), then a labelled "what if" |
| 4 | June 2018 global dust storm, Mars (Opportunity's last signal) | Solar power vs. life support, and a 12-minute radio delay: write rules in advance |

Levels open in order: pass one (crew safe) to unlock the next. A short How to play screen comes before Level 1.

The storms and their dates are real archived NASA data. The crews, bases and meter numbers are part of the game
(**game points**, not real measurements), and the game says so on screen.

**Full explanation from A to Z: [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md).**

## Project structure

```
index.html            page skeleton
css/style.css         all styles (desktop and phone layouts)
js/core.js            namespace, assets, game state, base sites
js/data/lines.js      every spoken line (generated from tools/lines.json)
js/audio.js           voice clips, with browser speech as a fallback
js/ui.js              HUD, subtitles, answer cards, NASA cards, overlays
js/world.js           three.js scene: globe, Moon and Mars surfaces, base, crew, rover, storms
js/sol.js             SOL the robot guide (3D model + code animation)
js/levels/level0-4.js one file per level
js/menu.js            level menu, debrief, certificate, live NASA panel, About the data
js/main.js            start-up and the game clock
api/donki.js          Vercel function: fetches NASA DONKI on the server (keeps the API key secret)
assets/               voices (MP3), NASA media, SOL model
vendor/               three.js r128 + GLTFLoader (MIT)
tools/build_single.py builds the single-page versions into dist/
tools/make_voices.py  regenerates the voices with Kokoro TTS
vercel.json           security headers
```

## Run it on your computer

Any static server works (opening `index.html` directly from disk will not load the 3D model):

```
python -m http.server 8000
```

Then open http://localhost:8000. Everything works except the "Today's real Sun (LIVE)" panel, which needs the
`/api/donki` function (see Vercel below). It shows an honest message instead of made-up numbers.

## Single-page version

```
python tools/build_single.py
```

Creates `dist/capcom-storm-watch.html` (three.js from a CDN) and `dist/capcom-storm-watch-offline.html`
(everything inside one file, works without internet). Each is under 16 MB.

## Put it online with Vercel (free)

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project → Import** the repository. Framework preset: **Other**. No build command.
3. **Settings → Environment Variables**: add `NASA_API_KEY` with your key from https://api.nasa.gov (all environments). Redeploy.
4. Open the `*.vercel.app` link. The live panel now shows the last 30 days of real NASA space weather.

Or from a terminal in this folder: `npx vercel` (first time), set the variable with `npx vercel env add NASA_API_KEY`, then `npx vercel --prod`.

## Security

- The NASA API key lives only in the Vercel environment variable. It is never in the page, the repository or the
  single-page files. The function returns only dates, speeds and Kp values, and never echoes the key.
- `vercel.json` sets a strict Content-Security-Policy (scripts only from this site), `nosniff`, a referrer policy,
  HSTS and a permissions policy that blocks camera, microphone and location.
- No accounts, no tracking, no personal data. Stars are saved only in the player's own browser.
- Text from NASA is escaped before it is shown.

## Data and credits

See [CREDITS.md](CREDITS.md). NASA does not endorse this game.
