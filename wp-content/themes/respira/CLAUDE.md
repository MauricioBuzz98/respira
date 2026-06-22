# Tema Respira — reglas para Claude

## Qué es
Tema WordPress **clásico** (no FSE). Renderiza con **Timber v2 / Twig**. Las páginas se
construyen con **bloques nativos de Gutenberg** (sin ACF). El diseño viene de la plantilla
**Realest** (Bootstrap 5 + CSS propio). **No usar Tailwind.**

## Comandos
```
composer install   # Timber
npm install        # deps de build
npm run build      # compila blocks/ -> build/blocks/
npm run start      # build en watch
```

## Carpetas
- `blocks/<x>/`        → fuente del bloque: block.json + index.js + edit.js + render.php
- `build/blocks/<x>/`  → salida compilada; `register_block_type()` apunta aquí (autodiscovery)
- `views/`             → plantillas Twig (registradas vía `timber/locations`)
- `views/blocks/<x>.twig` → plantilla Twig de cada bloque dinámico
- `views/partials/`    → header.twig, footer.twig (globales, NO son bloques)
- `src/`               → clases PHP PSR-4 (`Respira\`), p. ej. `Site.php`
- `assets/`            → css/ js/ fonts/ images/ de Realest (se encolan en functions.php)

## Reglas de bloques
- DO: `block.json` con `apiVersion: 3`; bloque **dinámico** (`save: () => null`).
- DO: `render.php` arma `$context` y llama `Timber::render('blocks/<x>.twig', $context)`.
- DO: aplicar `get_block_wrapper_attributes()` al elemento raíz del .twig (`{{ wrapper_attributes|raw }}`).
- DO: usar las **clases CSS de Realest** en el .twig (theme-btn, sec-title, auto-container, row-cols-*, etc.).
- DO: `__()` de `@wordpress/i18n` para textos del editor; textdomain `respira`.
- NO: Tailwind, ACF, shortcodes.
- NO: webpack manual fuera de `webpack.config.js` (extiende @wordpress/scripts).

## Naming
- bloque: `respira/<kebab>`
- clase CSS del wrapper: `wp-block-respira-<kebab>`
- función PHP: `respira_<snake>`

## Render de páginas
- Las `*.php` raíz hacen `Timber::context()` + `Timber::render([...], $context)`.
- `page.twig` extiende `base.twig` y vuelca `{{ post.content }}` (ahí salen los bloques).
- Contexto global (menús, logo, theme) se inyecta en `src/Site.php` vía filtro `timber/context`.

## CSS / JS
- El front carga `assets/css/bootstrap.min.css` + `assets/css/style.css` (este @importa libs y Google Fonts).
- El bundle JS de Realest (jQuery, Swiper, GSAP, WOW, AOS…) se encola en el footer, en orden.
- Mantener `assets/css/` y `assets/fonts/` como **hermanos** (los @import usan `../fonts/`).
