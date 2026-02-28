# Architecture doc — translations (i18n)

This folder holds one JavaScript file per language. Each file defines a global object that is merged into `window.ARCH_I18N` in `../index.html`.

## Current languages

- **en.js** — English (`window.ARCH_I18N_EN`)
- **ru.js** — Russian (`window.ARCH_I18N_RU`)
- **fi.js** — Finnish (`window.ARCH_I18N_FI`)

## Adding a new language

1. **Copy an existing file** (e.g. `en.js`) and rename it to the new locale code (e.g. `de.js` for German).

2. **Change the global variable name** at the top and bottom of the file:
   - `window.ARCH_I18N_EN` → `window.ARCH_I18N_DE` (or your locale).

3. **Translate all strings** in the object: `meta`, `nav`, `toc`, and every entry under `sections` (same keys and structure as in `en.js`).

4. **Register the language in `../index.html`:**
   - Add a script tag:  
     `<script src="i18n/de.js"></script>`
   - Add the locale to the merge script:  
     `window.ARCH_I18N = { en: ..., ru: ..., fi: ..., de: window.ARCH_I18N_DE };`
   - Add a button in the language switcher:  
     `<button class="lang-btn" type="button" data-lang-switch="de">DE</button>`

5. **Optional:** Add `tocTitle` and `langLabel` in `meta` for the new language (e.g. "Inhalt", "Sprache" for German).

## Structure (same for every language)

- `meta`: `title`, `subtitle`, `badge`, `langLabel`, `tocTitle`
- `nav`: short labels for top nav links (`purpose`, `layers`, `routes`, `catalogFlow`, `telegramFlow`, `merchantFlow`, `glossary`)
- `toc`: longer labels for the left sidebar (same keys)
- `sections`: one object per section; each has `id`, `title`, and section-specific fields (`tagline`, `paragraphs`, `pills`, `diagramTitle`, `diagram`, `cards`, `muted`, `paragraphsAfter`, `items` for glossary)

Keep the same keys and structure so the render script in `index.html` can build the page for any language.
