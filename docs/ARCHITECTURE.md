# Architecture

Technical deep-dive into how `slash-web` is built, and how the replica was reverse-engineered from the live product.

## 1. How the replica was built (reverse-engineering pipeline)

The target — `https://demo.slash.com/platinum` — is a Next.js 14 app behind a demo auto-login. A server-side fetch of the page returns only a partially hydrated shell, so static HTML alone was not enough. The pipeline used:

| Stage | Tool | Output |
| --- | --- | --- |
| Route discovery | `/_next/static/<buildId>/_buildManifest.js` | Full list of 60+ app routes (`/[slug]/cards`, `/[slug]/payments`, …) |
| Hydrated DOM | Playwright + `chromium_headless_shell` | 6.3 MB of fully rendered markup for `/platinum` |
| Feature extraction | Playwright click-through | The 23-step product tour, chapter by chapter, with each step's title, body, and target route |
| Per-route data | Playwright → `innerText` + DOM | Real demo values: 860 transactions, 17 cards, 8 bills, 15 recipients, $5,775,801.15 cash balance, … |
| Design tokens | `/_next/static/css/a7aa6f654b7ed395.css` | 2141 CSS custom properties (oklch palette, radii, typography scale) |
| Fonts | 29 `*.ttf` under `/assets/fonts` + `/build/fonts` | Inter (variable 100–900), Archivo, AktivGroteskExtended, IBMPlexMono |
| Icons | Inline `<svg><title>…</title>` extraction | 66 exact SVG bodies, including the Slash mark |

## 2. Token reuse instead of eyeballing

The site's compiled Tailwind v4 bundle is shipped verbatim as `src/styles/slash.css`. That single file carries:

- the `@theme` token layer (all colors expressed in `oklch()`),
- semantic aliases such as `--background-color-surface-subtle` → `--color-light-product-neutral-200`,
- typography classes (`.typography-body-medium` → 14px / weight 525 / Inter),
- the full utility set (`bg-surface-neutral`, `rounded-border-radius-md`, `shadow-drop-shadow-sm`, …).

`src/styles/app.css` layers the replica's own components **on top of those tokens** — it never hardcodes a color. Result: the replica's palette is literally the product's palette, and light/dark both work by swapping the token source.

### Typography scale actually used

| Class | Size / weight | Used for |
| --- | --- | --- |
| `typography-body-medium` | 14px / 525 / 20px lh | table cells, buttons, nav labels |
| `typography-body-regular` | 14px / 450 / 20px lh | secondary row text |
| `typography-caption-medium` | 12.5px / 525 | chips, meta lines |
| `typography-title-regular` | 15px / 600 | card titles |
| `typography-h1-medium` | 34px / 600 | the big cash-balance figure |
| `typography-number-*` | tabular figures | every monetary value |

## 3. Layout geometry

Measured from the live app at 1440×1000 and reproduced exactly:

- Sidebar: **280 px**, collapsible to **57 px** (icon-only), `position: sticky`, own scroll.
- Main: `padding: 8px 8px 0 0`, wrapping a **white panel** with a 12 px top radius and a 1 px neutral border that runs off the bottom edge.
- Page header: **64 px**, 20 px horizontal gutter.
- Tab bar: **46 px**, 26 px gaps, 2 px active underline pinned to the bar's bottom border.
- Toolbar: 34 px pill controls, 14 px vertical padding, bottom hairline.
- Table: 42 px sticky header (13 px / 525), **58 px** data rows, 12 px column gaps, hairline row separators.
- Date group headers in transaction/payment lists: 26 px chip on a 3-step surface.

## 4. Application state

`src/store/index.tsx` is a single React context that plays the role of the API layer.

```
DB {
  accounts, virtualAccounts, cards, cardGroups, cardRequests,
  transactions, paymentRequests, queuedPayments, upcomingPayments, sentPayments,
  bills, invoices, invoiceSeries, expenses, recipients, achAuths,
  documents, users, actionItems, wallets, cryptoAssets, apiKeys,
  activityLog, cardPolicies, approvalPolicies, accountingEntries,
  cashback, referrals, settings
}
```

- Every mutation is a named action (`createCard`, `decidePayment`, `sendMoney`, `setBillStatus`, `createInvoice`, `decideExpense`, `addRecipient`, `decideAch`, `inviteUser`, `addApiKey`, `addVirtualAccount`, `transfer`, `deposit`, `syncAccounting`, `convertCrypto`, `addPolicy`, …) — 40+ in total.
- Actions also append to `activityLog`, mirroring the product's audit trail, and raise a toast.
- State persists to `localStorage` under `slash-platinum-db-v1`; `Reset demo data` restores the pristine seed.
- `settings.tourDone` gates the one-time welcome modal.

## 5. Tour engine

`src/tour/Tour.tsx` implements the 23-step walkthrough:

1. `STEPS[]` — chapter, title, body, target route, optional CSS target for the spotlight.
2. `TourProvider` — owns `state ∈ {hidden, welcome, active, complete}` and `step`; navigating a step pushes the target route.
3. `useRect(selector)` — rAF loop measuring the highlight target, so the spotlight follows layout changes.
4. The dim layer is drawn as a `box-shadow: 0 0 0 9999px` spread from the target rect, producing a true "hole" without a second element.
5. `ChaptersButton` — chapter jump menu (7 chapters), `jump(i)` moves to any chapter's first step.

## 6. Component inventory (`src/components/ui.tsx`)

`Icon` (Phosphor + extracted SVGs) · `SlashMark` · `Btn` · `IconBtn` · `Pill` · `Chip` · `PageHead` · `Tabs` · `SearchBox` · `Select` · `Toggle` · `Table`/`TRow`/`Th`/`DateRow` · `Amount` · `Avatar` · `MerchantTile` · `Modal` · `Drawer` · `Menu` · `Empty` · `AreaChart` · `KV` · `StatusChip`.

`AreaChart` is hand-written SVG (no chart library): gradient-filled area, 1.8 px stroke, crosshair + tooltip on hover, absolutely-positioned axis ticks.

## 7. Routing map

Every demo route is mirrored 1:1 so bookmarks and the tour's deep links work.

```
/platinum                                  Home
/platinum/action-center                    Action Center
/platinum/cards                            Cards · Groups · Card Requests
/platinum/transactions                     Transactions
/platinum/payments                         Payment requests · Queued · Upcoming · Sent
/platinum/payments/bills                   Bills
/platinum/payments/recipients              Recipients
/platinum/payments/ach-authorizations      ACH Debits
/platinum/invoices                         Invoicing · Recurring
/platinum/reimbursements                   Reimbursements
/platinum/account/cash                     Cash account
/platinum/account/secured                  Secured card
/platinum/treasury                         Treasury
/platinum/account/capital                  Capital
/platinum/analytics/reports/general-analytics
/platinum/accounting                       Accounting status tabs
/platinum/accounting/bills                 Bill-level accounting
/platinum/accounting/settings/general      Connection & sync
/platinum/accounting/settings/mappings     Mapping settings
/platinum/wallets                          Wallets
/platinum/documents                        Entity documents
/platinum/referrals                         Refer to earn
/platinum/move-money                       Move Money
/platinum/settings/business-details
/platinum/settings/users
/platinum/settings/security
/platinum/settings/policies
/platinum/settings/api-management
/platinum/settings/activity-log
```

## 8. Deployment

Static SPA → Cloudflare Pages.

- `public/_redirects` → `/*  /index.html  200` makes deep links resolve to the SPA shell.
- `public/_headers` sets immutable caching for `/assets`, `/build` (fonts) and baseline security headers.
- `vite build` emits `dist/` (~12 MB, of which 4.7 MB is the font set).
- `wrangler pages deploy dist --project-name=slash-platinum-demo` performs a Direct Upload.

## 9. Known trade-offs

| Area | Production app | This replica |
| --- | --- | --- |
| Backend | Next.js server actions + GraphQL | Local reducer + `localStorage` |
| Data volume | 860 rows, server pagination | Seed rows + client-side filter/sort/export |
| Payments rails | Real ACH/Wire via banking partners | Simulated approval state machine |
| KYC / Plaid / Stripe | Live SDKs | Local flows with toasts |
| Accounting | Real QuickBooks OAuth | Local connection panel + mapping editor |
| Auth | Session + 2FA | Demo persona, no auth |

None of these change the shape of the product: the approval chain, card lifecycle, spend controls, and accounting workflow behave the same way a user would experience them.
