# Font files needed here

The design system (SOW point #2) is built around three commercial typefaces that must be supplied by the client with a valid web-embedding license:

| Role | Typeface | Expected file(s) |
|---|---|---|
| Primary / display (headings, brand) | **TS Safaa** | `TSSafaa-Regular.woff2`, `TSSafaa-Bold.woff2` |
| Secondary / body — English | **Century Gothic** | `CenturyGothic-Regular.woff2`, `CenturyGothic-Bold.woff2` |
| Secondary / body — Arabic | **Bukra** | `Bukra-Regular.woff2`, `Bukra-Bold.woff2` |

Never substitute Montserrat or Chivo for these.

Until the licensed files are dropped in here, `@font-face` declarations in `src/app/globals.css` point at these paths but will silently fail to load (404) and the system-font fallback stack takes over — the site still renders correctly, just not in the final typefaces. Once the files are added, no code changes are needed; the fonts will start rendering automatically.

Preferred format: `.woff2` (smallest, universally supported). If only `.otf`/`.ttf` are available, convert with a tool such as `fonttools` or an online woff2 converter, or say so and this can be scripted here.
