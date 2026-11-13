# CAPCOM: Storm Watch — Project Guide (A to Z)

Everything about the project in one place: what it is, how it answers the NASA Space Apps 2026 challenge, how each level works,
which NASA data it uses, how the code is built, and how to run, change and deploy it.

- **Live game:** https://capcom-storm-watch.vercel.app/
- **Challenge:** NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer*
- **Team:** Badya University, Egypt (5 members)

---

## 1. The idea in one paragraph

Kids aged 7–12 play **CAPCOM**, the person in Mission Control who talks to the crew by radio. Real space weather from NASA records
hits imagined bases on the Moon and Mars: three real solar storms and the 2018 dust storm that covered all of Mars. In every level the
player makes decisions for the crew. Each choice has a cost in **radiation dose**, **power** (which runs air and heat, the crew's
life support), **shelter walls**, **food** or **mission goals**. A robot guide called **SOL** and a junior astronaut called **Nour**
explain every term in plain words, every line is voiced, and after each level the player sees **what really happened**, with real
NASA photos, videos and links.

## 2. How we answer the challenge

| What the challenge asks | Where it is in the game |
|---|---|
| Kids 7–12 run a lunar or Martian outpost | Moon base (Levels 0–3) and Mars base (Level 4) |
| Life support | Power runs air and heat. Power at 0 = mission failed. Level 4 is all about keeping life support on |
| Radiation shielding | Shelter walls made of water bags, food boxes or Moon dirt (more mass = less dose). Levels 1, 2, 3 |
| Power budgeting | Every day in the shelter costs power (Level 2); greenhouse lamps (Level 3); solar power in a dust storm (Level 4) |
| Food production | The greenhouse harvest in Level 3 (full, half or no lamps); food boxes as shielding in Level 1 |
| Communication delay | Level 4: messages take 12 minutes, so the player writes rules in advance. Flat-plain site: radio static |
| A choice is never free | Every answer card shows its cost before you tap. The balance was tested (section 7) |
| Real NASA data, attributed in the tool | DONKI, OSDR, LRO/LOLA, Artemis III regions, SDO, STEREO, Enlil model, Opportunity, Curiosity, MRO. Credit line next to every image and video, plus an "About the data" screen |
| Don't present static data as live | Archived events carry their dates. Only "Today's real Sun" is live, and it says so |
| Explain terms (dose, sol, microgravity) | SOL explains dose, sol, tau (dusty sky) and Moon gravity (one sixth of Earth's) when they first appear |
| Browser, no download, no account | One web page; works on phones |
| Not too many systems | Two main meters (dose, power) plus shelter walls and mission stars |
| Stand out: link choices to current space weather | "Today's real Sun (LIVE)" shows the last 30 days from NASA DONKI and tells the player what it would mean for a Moon crew |
| Stand out: replayability | Random fact cards, random dose changes, three base sites, three stars per level |
| Stand out: explain the datasets | "About the data" screen, `CREDITS.md`, and this guide |

## 3. How to play

1. **Start mission** → SOL and Nour say hello (or press **Skip intro**).
2. **Level 0:** the real Moon (built from NASA maps) zooms to the south pole. Pick a base site.
3. **How to play** screen (once): four short rules.
   - **Dose** is radiation the crew soaks up. Keep it left of the white line.
   - **Power** runs the air and heat. If it hits 0, you lose.
   - Every card has a **cost**. Read the tags before you tap.
   - **Stars:** crew safe = 1, power left = 2, mission done = 3.
4. **Choose a storm.** Levels open in order: you must bring the crew home safe (1 star or more) to unlock the next one.
   Passed levels can be replayed any time. **Start over** erases the stars.
5. After all four levels: **certificate**.

The numbers on the meters are **game points**, not real measurements. The game says this on the HUD and in every result screen.

### The three base sites (Level 0)

| Site | Good | Cost | Effect in the Moon levels |
|---|---|---|---|
| Sunny ridge | Lots of sun | Far from ice | Start power 95, need 2 mission stars |
| Shadowed crater | Ice and science | Little sun | Start power 60, 1 mission star free |
| Flat plain | Easy landing, short drives | Low Earth = weak radio | Start power 80, drives 25% shorter, radio static costs time |

The nine names shown on this screen are NASA's real Artemis III candidate regions (October 2024). The three site types are game choices.

## 4. The levels

### Level 1 — Training Day · 10 September 2017 · Moon
- **Real event:** an X8.2 flare filmed by NASA SDO. A cloud left the Sun at about 2,650 km/s, and fast particles were detected
  near Earth 16 minutes later (DONKI).
- **Player's job:** a 16-minute countdown. Sami is outside with the rover. Bring him home (or let him grab a rock first), then
  thicken the shelter: water bags (best, costs time and a mission point), food boxes, or Moon dirt (Lina must go outside).
- **Lesson:** fast particles arrive in minutes; mass between you and the Sun protects you.

### Level 2 — The Big One · May 2024 · Moon
- **Real event:** the strongest geomagnetic storm in over 20 years (Kp 9 in DONKI), in waves over several days; particles returned on 13 May.
  NASA later found two new temporary radiation belts around Earth.
- **Player's job:** four days. Each day in the shelter costs power for air and heat. Choose between fixing the antenna,
  stocking the shelter, heater vs. radio, fixing the solar tower outside, and the trap on day 4: "It's quiet, can we go out?"
- **Lesson:** long storms are a power marathon, and a quiet sky is not always a safe sky.

### Level 3 — The Near Miss · 23 July 2012 · Moon
- **Real event:** one of the fastest clouds ever seen (about 3,000 km/s, the fastest STEREO had observed) hit NASA's STEREO-A
  spacecraft and **missed Earth and the Moon**. NASA scientists said it was at least as strong as the 1859 Carrington storm, and that one week
  earlier Earth would have been in its path.
- **Player's job:**
  1. Before the forecast: hide now, call Earth for a forecast, or keep working.
  2. Read NASA's **real forecast model map** (CCMC Enlil): is the red cloud coming to us? (Nour can ask SOL how to read it.)
  3. **Food:** harvest week. Full, half or no greenhouse lamps (OSDR OSD-772: plants grown in space need light, and light needs power).
  4. A clearly labelled **"What if?"**: the same cloud aimed at us. Build the shelter fast.
- **Lesson:** forecasts save power and food; panic costs, and so does ignoring the danger.

### Level 4 — Dark Skies · June 2018 · Mars
- **Real event:** a dust storm grew until it covered all of Mars. Over NASA's solar-powered Opportunity rover the dust level (tau)
  reached about 10.8 on 10 June 2018. That day it sent its last signal; NASA declared the mission complete in February 2019,
  after almost 15 years on a 90-day plan. Curiosity, which is nuclear-powered, kept working.
- **Player's job:** messages take 12 minutes, so the player writes three rules for Dr. Omar in advance:
  1. When the sky gets dark: stop experiments, keep working while there is light, or wait for Earth's answer.
  2. When power is short, what gets power first: air and heaters, the radio, or experiments.
  3. If the battery gets very low: sleep and wake up to check (like Opportunity), keep calling Earth, or drive to a nuclear-powered rover.
  Then five sols play out on their own as the sky darkens (tau 3 → 11) and clears.
- **Lesson:** solar power depends on the sky; life support comes first; with a long delay, good rules matter more than fast messages.

## 5. Characters

| Character | Role |
|---|---|
| **SOL** | Robot guide and narrator (the team's own 3D model). Explains terms and the real science |
| **Nour** | Junior astronaut, about 9 years old. Asks the questions kids ask; sometimes offers an "idea card" (which also has a cost) |
| **Sami** | Moon base commander |
| **Lina** | Moon base engineer (shelter, greenhouse) |
| **Dr. Omar** | Mars base crew |

The crews and bases are imagined. The events, dates and numbers in the "What really happened" panels are real.

## 6. NASA data used

| Source | Used for |
|---|---|
| **DONKI** (Space Weather Database) | Dates, cloud speeds, particle events and storm strength; the live panel (last 30 days) |
| **OSDR** (Open Science Data Repository) | OSD-340 (space radiation and blood-forming cells), OSD-772 (plants grown on the ISS) |
| **CGI Moon Kit** (LRO colour, LOLA elevation) | The real 3D Moon in Level 0 |
| **Artemis III landing regions** (NASA, Oct 2024) | The nine south-pole names |
| **SDO** via NASA SVS | Level 1 flare video |
| **NASA SVS May 2024 storm** | Level 2 aurora video and new radiation belts |
| **STEREO-A**, **CCMC Enlil model**, NASA Science "Near Miss" | Level 3 video, forecast map and facts |
| **NASA JPL** (Opportunity, Curiosity), **PIA22521**, **PIA22487** (MRO) | Level 4 facts and images |
| Orion radiation protection, NASA Science | Why mass (water, food, soil) makes a shelter safer |
| NASA NTRS 20220013418 | Mars radio delay up to about 22 minutes one way |

Full links: `CREDITS.md` and the in-game "About the data" screen.

**Live vs. archived:** "Today's real Sun" calls our server function `/api/donki`, which asks NASA DONKI for the last 30 days. Everything
else is archived NASA data shown with its date. If NASA can't be reached, the panel says so and shows no numbers.

## 7. Game design and balance

- **Meters:** Dose (with a limit line), Power, Shelter walls (0–3), Mission stars. All are game points.
- **Rules of the world:**
  - More mass in the walls = less dose. Inside dose = storm strength ÷ (1 + walls).
  - Being outside during particles = a big dose.
  - Every day costs power for air and heat. Power at 0 = failed.
  - On Mars, the solar power you get depends on the dust (tau).
- **Stars:** 1 = crew safe (dose under the limit and power above 0), 2 = also enough power left, 3 = also the mission goal.
- **Balance testing:** each level was played 20 times by a bot choosing at random:

  | Level | Pass rate with random choices |
  |---|---|
  | 1 (tutorial) | about 65% |
  | 2 | about 50% |
  | 3 | about 50% |
  | 4 | about 45% |

  Before balancing, every random run passed. Now careless play fails about half the time, and thoughtful play passes.
- **Replayability:** random fact cards, small random dose changes, three sites, three stars, and the stuck/what-if moments.
- **Failure is not punishing:** "Try again" is one tap, and SOL gives a tip for next time.

## 8. How the code is built

```
index.html            page skeleton (HUD, subtitles, answer cards, overlays)
css/style.css         all styles, desktop and phone layouts
js/core.js            namespace CC, asset list, game state (CC.G), base sites, saving stars
js/data/lines.js      every spoken line, generated from tools/lines.json
js/audio.js           plays the voice clips (browser speech only as a fallback)
js/ui.js              HUD, CC.say (subtitles + voice queue), CC.ask (answer cards with costs), cards, overlays
js/world.js           three.js scene: Moon globe, Moon and Mars surfaces, base, crew, rover, storms, dust
js/sol.js             SOL the robot (3D model + code animation)
js/levels/level0-4.js one file per level
js/menu.js            level menu (unlocks), How to play, result screen, certificate, live panel, About the data
js/main.js            start-up and the real-time game clock
api/donki.js          Vercel server function: fetches NASA DONKI with the secret key
vendor/               three.js r128 + GLTFLoader (MIT), kept locally so the page loads no outside scripts
assets/               voices (MP3), NASA media, SOL model
tools/                build_single.py, make_voices.py, lines.json
vercel.json           security headers
```

- **Dialogue engine:** `CC.say(['line_id', ...], next)` shows the subtitle, plays the voice and moves on.
  `CC.ask([{label, cost, reply, next}, ...])` shows the answer cards. The cost is applied when tapped.
- **Levels** are short functions chained together: intro → decision → consequence → result (`CC.debrief`).
- **Voices:** generated offline with Kokoro TTS (Apache-2.0), one MP3 per line.

## 9. Run, change and deploy

**Run locally:** `python -m http.server 8000` in the project folder, then open http://localhost:8000.
Opening `index.html` by double-click will not load the 3D model; the page shows a hint if you do.

**Single-page version:** `python tools/build_single.py` → `dist/capcom-storm-watch.html` (three.js from a CDN) and
`dist/capcom-storm-watch-offline.html` (works with no internet). Both are under 16 MB.

**Change a spoken line:**
1. Edit `tools/lines.json`.
2. Run `tools/make_voices.py <line_id>` to regenerate the voice.
3. Regenerate `js/data/lines.js` from `tools/lines.json` (same format: `CC.LINES = {...}`).

**Deploy (Vercel):**
1. Push to GitHub.
2. In Vercel, import the repository with Framework **Other** and no build command.
3. Add `NASA_API_KEY` under **Settings → Environment Variables**.
4. Every `git push` updates the live link. You can roll back from **Deployments → Promote to Production**.

## 10. Security and privacy

- The NASA API key lives only in Vercel's environment variable. It is never in the page, the repository or the single-page files.
  The server function returns only dates, speeds and Kp values.
- `vercel.json` sets a strict Content-Security-Policy (scripts only from our own site), `nosniff`, a referrer policy, HSTS and
  a permissions policy (no camera, microphone or location).
- No accounts, no tracking, no personal data. Stars are saved only in the player's own browser.
- Text that comes from NASA's API is escaped before it is shown.

## 11. Accessibility

- Every line is voiced and subtitled, with Replay and Next buttons and a mute button.
- Large tap targets, keyboard focus outlines, phone layout, and reduced motion respected.
- Plain language; scientific words are explained the first time they appear.

## 12. Testing we did

- Automated play-through of every level to the certificate, plus Start over and level unlocking.
- Random-choice balance runs (section 7).
- Screenshots on desktop and phone sizes to check that nothing overlaps.
- A check that every line has a voice clip and every voice clip has a line.
- The live API was checked on the deployed site (no key in the response).

## 13. Ideas for later

- Arabic voice and subtitles.
- A teacher page with discussion questions for each level.
- Use today's live DONKI data to start a "storm of the day" level.

## 14. FAQ for judges

- **Are the meter numbers real?** No. They are game points from the player's choices. The events, dates and facts in "What really happened" are real.
- **Is anything live?** Yes: "Today's real Sun", from NASA DONKI through our server.
- **Why a "what if" in Level 3?** The real July 2012 cloud missed us. NASA itself says a week earlier it would have hit Earth, so we let
  players practise that case, and the game labels it as imagined.
- **Does NASA endorse this?** No. We use NASA's open data and credit every source.
