# Contributing

Thanks for helping improve **slash-web** — a faithful, fully interactive replica of the Slash banking dashboard demo (`demo.slash.com/platinum`).

## Getting started

```bash
git clone https://github.com/<owner>/slash-web.git
cd slash-web
pnpm install
pnpm dev            # http://localhost:5173/platinum
```

Requires Node 18+ and pnpm 8+.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server on port 5173 with HMR |
| `pnpm build` | Production bundle → `dist/` |
| `pnpm preview` | Serve the built bundle on port 4173 |

## Project layout

```
src/
  styles/app.css        component styles built on the product design tokens
  styles/slash.css      product token/utilities layer (do not hand-edit)
  styles/slash-b.css    secondary product stylesheet
  data/seed.ts          demo data + domain types
  data/icons.json       extracted SVG icons
  store/index.tsx       global state, business actions, persistence
  components/ui.tsx     shared primitives
  components/shell.tsx  sidebar, entity menu, toasts, settings nav
  tour/Tour.tsx         23-step product tour engine
  pages/                one file per screen
public/                 fonts, _redirects, _headers
docs/                   architecture, features, deployment, screenshots
```

## Conventions

- **Never hardcode colours.** Use the token variables (`var(--ink)`, `var(--surface-2)`, `var(--gold-9)`, …) or the utility classes from `slash.css`. New tokens go in `src/styles/app.css` under the `:root` / `html.dark` blocks so light and dark stay in sync.
- **Every button must do something.** If a flow is simulated, say so in the toast copy — no dead buttons.
- **New state goes through the store.** Add a typed record to `src/data/seed.ts`, a named action in `src/store/index.tsx`, and log it to `activityLog` when it is auditable.
- **Follow the geometry.** 280 px sidebar, 64 px header, 46 px tabs, 42 px table head, 58 px rows, 12 px column gaps. Deviations break the visual match with the original.
- **Keep the routing mirror.** New screens should live at the same path the product uses (`/platinum/...`) so deep links and the tour keep working.

## Adding a page

1. Create `src/pages/<Name>Page.tsx` exporting a default component.
2. Render it inside `<div className="panel">` with `<PageHead>` and, where relevant, `<Tabs>`.
3. Register the route in `src/App.tsx`.
4. If it belongs in the sidebar, add it to `src/components/shell.tsx`.
5. Document it in `docs/FEATURES.md`.

## Adding a tour step

Append to `STEPS` in `src/tour/Tour.tsx`:

```ts
{
  chapter: 'Payments',
  title: 'Short imperative title',
  text: 'One or two sentences describing what the user can do here.',
  route: '/platinum/payments?paymentsTab=queued',
  target: '[data-tour="payments-tabs"]',   // optional spotlight
  hint: 'Inspect highlighted area',          // optional
}
```

Add `data-tour="…"` to the element you want spotlighted. The step counter is derived from the chapter, so no manual numbering is needed.

## Style guide

- Buttons: `<Btn primary | ghost | sm | danger>`; icons via `<Icon name="…" />`.
- Status chips: `<StatusChip status="…" />` — add new mappings there so colours stay consistent.
- Tables: `<Table cols="…" head={…}>` with `<TRow cols="…">`; use `minmax()` so columns flex without breaking the layout.
- Amounts: always `<Amount value={…} />` so sign/colour rules are applied in one place.

## Commit messages

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `perf`.

## Before opening a pull request

```bash
pnpm build          # must succeed
```

Then confirm the affected screens manually — the fastest check is to open the page in the browser, click through the flow, and compare against the corresponding screenshot in `docs/screenshots/`.

## License

MIT — see [LICENSE](../LICENSE). The bundled product stylesheet and webfonts in `public/` are included solely to reproduce the original interface faithfully; they remain the property of their respective owners.
