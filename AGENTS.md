# AGENTS.md — Monitor Diario

## Project Overview

Vanilla JS/HTML/CSS single-page dashboard ("Monitor Diario") with no framework, no bundler, no package manager. Displays daily info for Argentina: clock, savings tracker, dollar rates, weather, train status, holidays. Three source files: `index.html` (263 lines), `js/app.js` (1216 lines), `css/style.css` (1151 lines).

## Commands

This project has **no build, lint, test, or CI commands**. There is no `package.json`, `Makefile`, linter config, or test framework.

- **To view**: open `index.html` in a browser (or use `npx serve .` / `python3 -m http.server 8000`)
- **Deployment**: the project is served as static files; no build step needed

## Code Style Guidelines

### JavaScript (`js/app.js`)

**Formatting:**
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Template literals (backticks) for interpolation
- No trailing commas in objects/arrays
- One blank line between function declarations

**Naming:**
- `UPPER_SNAKE_CASE` for constants / configuration values (e.g., `API_DOLAR`, `FETCH_TIMEOUT`, `WMO_CODES`, `DIAS`, `MESES`)
- `camelCase` for functions (e.g., `renderClima`, `cargarDolar`, `toggleSeccion`, `escapeHtml`)
- `camelCase` for variables (e.g., `datosDolar`, `abortController`, `toolboxAbierta`)
- `let` for mutable top-level state, `const` for everything else; no `var`
- Arrow functions preferred over `function` keyword

**Types:**
- Plain JavaScript — no TypeScript, no JSDoc annotations
- No type checking

**Imports / Modules:**
- No ES modules; `js/app.js` is loaded via `<script defer>` in `index.html`
- All code lives in global scope
- No imports, no exports

**Error handling:**
- API calls: `try/catch` around `fetch` with `AbortController`
- `AbortError` is silently swallowed: `if (error.name === 'AbortError') return;`
- Other errors: `console.error(...)` then render a `.card-error` in the DOM
- `localStorage` reads/writes: wrapped in `try/catch` with empty `catch` (silent failure)
- Pattern:
  ```js
  try {
    const respuesta = await fetchConTimeout(url, signal);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    // process...
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Context:', error);
    contenedor.innerHTML = '<div class="card card-error">...</div>';
  }
  ```

**DOM & HTML generation:**
- Use `innerHTML` with template literals to build HTML strings
- Always escape user/API data with `escapeHtml()` helper before interpolation
- `id` attributes for element references, stored in `let` variables via `document.getElementById()`
- DOM IDs use `kebab-case`

**Fetch pattern:**
- `fetchConTimeout(url, signal)` utility wraps `fetch` with `AbortController` timeout
- `signal` is the `AbortController.signal` passed from caller
- Multiple simultaneous fetches use `Promise.allSettled` for resilience

### HTML (`index.html`)

- `<script defer>` (not at end of body or async)
- Semantic HTML5: `<header>`, `<main>`, `<section>`, `<footer>`, `<aside>`
- `aria-*` attributes for interactive controls
- `sr-only` class for screen-reader-only content
- Google Fonts (Inter) preconnected in `<head>`
- External CSS via `<link>`, no inline styles
- Responsive viewport meta tag

### CSS (`css/style.css`)

**Architecture:**
- Design tokens as CSS custom properties on `:root` (spacing, radius, typography, colors)
- 8px grid system for all spacing (`--space-{0..6}`)
- Modular typographic scale using `rem`/`em`
- 60-30-10 color distribution (base bg 60%, section titles 30%, accent 10%)
- WCAG AA 4.5:1 contrast ratio for all text/background pairs

**Naming (CSS):**
- `kebab-case` for classes, IDs, custom properties
- Descriptive class names: `.card-valor`, `.seccion-toggle`, `.barra-progreso`, `.toolbox-menu-item`

**Selectors:**
- Class selectors primarily; ID selectors for JavaScript hooks
- Low specificity; avoid `!important`
- BEM-like but not strict BEM

## Testing

No tests exist. No test framework is configured. Verify changes by opening `index.html` in a browser.

## OpenCode Agent Rules (in `.opencode/agents/`)

Three specialized agents are available. Invoke them via the Task tool with `subagent_type` matching the agent name:

- **`error_finder`** — Security & Quality Auditor. Static analysis for CVSS >= 7.0 vulnerabilities, cyclomatic complexity > 10, SemVer collisions. Reports findings as categorized list with `file:line`. Requires explicit confirmation before suggesting fixes.

- **`optimize_execution`** — Flow & Dependency Orchestrator. DAG-based task reordering for maximum parallelism. Identifies critical path (CPM), groups I/O vs CPU tasks. Marks parallelizable groups as `[EJECUCIÓN CONCURRENTE]`.

- **`visual-consistency`** — UI/UX Architecture & Visual Harmony. Enforces 8px grid, max 2 fonts, modular typographic scale, 60-30-10 color rule, WCAG AA 4.5:1 contrast. Outputs Design Tokens as CSS variables or JSON.

## Git Conventions

- Commit messages on `main` branch only
- Messages use format: `version_number: description` (e.g., `1.11.0: calculadora de porcentaje`)
- No tags, no branches, no PRs
- Single `index.html` file reference: line numbers for any suggestions
