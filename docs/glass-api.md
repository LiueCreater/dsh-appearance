# Liue glass surface API

Give your plugin panel the same glass surface as `dsh-lifiwallpaper` ("Liue")
and let the user's Liue settings control its radius, tint and blur.

Version: **0.3.0** · package: `dsh-lifiwallpaper`

## Do I need a separate package?

No. The surface is a plain CSS contract (`--lifi-*` variables + one class),
injected by the Liue client at runtime. Adding a second npm package would
split the version you have to keep in sync with the settings UI, without
buying anything: the CSS cascade is already global. Everything stays in
`dsh-lifiwallpaper`.

## Option A — runtime class (recommended)

If the user has Liue enabled, just add the class:

```html
<section class="lifi-glass">…</section>
```

React:

```jsx
<section className="lifi-glass">…</section>
```

Liue injects the rules and keeps `--lifi-*` in sync with the user's
appearance settings (glass style, strength, radius, light/dark scheme).
Nothing else is required. If Liue is disabled the class is inert — your
element keeps its normal styling, which makes this a safe progressive
enhancement.

## Option B — copy `glass.css`

Bundle the published `dsh-lifiwallpaper/glass.css` (or copy the block) if you
want a fallback surface without depending on Liue at runtime. When Liue is
enabled its variables and the `data-dsh-ap-glass` state still override the
fallbacks, so the copy stays under the user's unified control.

## Contract

| Name | Type | Meaning |
| --- | --- | --- |
| `.lifi-glass` | class | Surface: tinted background, backdrop blur, 1px border, rounded corners, shadow. |
| `--lifi-surface-bg` | CSS color | Computed tint for the active light/dark scheme. |
| `--lifi-surface-border` | CSS color | Border color for the active scheme. |
| `--lifi-blur` | length | `0px` for translucent, larger for frosted/liquid. |
| `--lifi-radius` | length | The user's configured corner radius. |
| `data-lifi-glass` | attribute on `<html>` | Active mode: `translucent`, `frosted`, `liquid` or `none`. |
| `window.dshLifiGlass` | object | Feature detection: `{ version, surfaceClass, variables }`. |

Behavior:

- **Mode `none`** — Liue's own rule hides every `.lifi-glass` surface
  (transparent, no blur, no border), matching the user's choice.
- **Light/dark** — variables are recomputed on theme change; no extra work.
- **Region switches** (conversation/sidebar/panels/dialogs) only affect
  Liue's own chrome, not third-party `.lifi-glass` elements.
- **Radius/strength** — follow the user's sliders live.

## Rules of thumb

- Do not set your own `background`, `border-radius` or `backdrop-filter` on a
  `.lifi-glass` element; the class uses `!important` for those three so the
  user's settings win. Use inner elements for content-specific styling.
- Keep the element's own layout (`display`, padding, size); the class only
  paints the surface.
- Backdrop blur samples what is behind the element in the same stacking
  context. Do not put it inside a `transform`/`filter` ancestor with
  `isolation: isolate` if you need the wallpaper to blur.
- Nested `.lifi-glass` elements are allowed; use it for cards, not for every
  row.
- Feature-detect without importing anything:
  `if (window.dshLifiGlass) { … }`.

## Example

```jsx
function StatsCard({ children }) {
  return (
    <section
      className="lifi-glass"
      style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {children}
    </section>
  )
}
```

## Versioning

The class name and the four `--lifi-*` variables are a stable API from
0.3.0. Breaking changes will bump the minor version and be listed in the
changelog; additions stay backward compatible.
