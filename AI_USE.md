# Use of Artificial Intelligence

NASA Space Apps Challenge 2026, project **CAPCOM: Storm Watch**.
This page says where AI tools were used, and where they were not.

## Where AI was used

| What | Tool | How it was used |
|---|---|---|
| Game code (HTML, CSS, JavaScript, the Vercel function `api/donki.js`, the build script in `tools/`) | Claude, by Anthropic (via Claude Code) | The AI wrote and edited the code from the team's instructions. The team decided the idea, the levels and the rules, ran the game, tested it in the browser and asked for fixes. |
| Spoken lines and on-screen text (`tools/lines.json`, `js/data/lines.js`) | Claude, by Anthropic | The AI drafted the dialogue and short texts. The team chose the story and checked the facts against the NASA sources in `CREDITS.md`. |
| All voices in `assets/` (every spoken line in the game) | Kokoro TTS (open-source text-to-speech model, Apache-2.0) | **AI-generated speech.** Made offline with `tools/make_voices.py`. No real person's voice was recorded or cloned. |
| Voice-over in the 30-second demo video | Kokoro TTS | **AI-generated speech.** The pictures in the video are recordings of the game itself. |
| Project description, project guide (`docs/PROJECT_GUIDE.md`), README, this file | Claude, by Anthropic | Drafted by the AI from the team's project, reviewed by the team. |

## Where AI was not used

- **NASA data.** Dates, speeds, storm strengths and facts come from NASA sources (DONKI, OSDR, SVS, JPL, NTRS and others, listed in [CREDITS.md](CREDITS.md)). The AI did not make them up.
- **NASA photos and videos.** They are real NASA media. They were not generated or changed by AI.
- **The 3D robot SOL.** Model made by the team.

## Changes to NASA media

- `assets/media/l3_map.jpg` is NASA's Enlil forecast image (NASA SVS 4167) with text labels added by the team ("EARTH + MOON", "THE CLOUD", "SUN"). The game says on screen that the labels were added by us.
- Other NASA images and videos were only resized or compressed.

## What is imagined (not AI, not NASA)

The crews (Sami, Lina, Dr. Omar), the junior astronaut Nour, the bases, and the meter numbers ("game points") are fictional game design. The game says so on screen. Real storms and real dates are used; the people in them are not real.

## Human responsibility

The team is responsible for the final project. Facts were checked against the sources in `CREDITS.md`, and the game was played through to the end on the live site before submission.
