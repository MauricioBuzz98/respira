# Arquitectura del tema Respira

> Tema WordPress **clásico** (no FSE) que renderiza con **Timber v2 / Twig** y arma las
> páginas **apilando bloques nativos de Gutenberg**, sobre el CSS/JS de la plantilla
> **Realest** (Bootstrap 5). **Sin Tailwind, sin ACF.**

## 1. Visión general

```
Petición → plantilla PHP raíz (page.php, single.php, …)
         → Timber::context() + Timber::render('<x>.twig')
         → views/<x>.twig  (extiende views/base.twig: header + footer globales)
         → {{ post.content }}  ← aquí Gutenberg pinta los bloques
              cada bloque es dinámico: render.php → Timber::render('blocks/<x>.twig')
```

- El **diseño** viene de Realest: su CSS y su bundle JS se encolan tal cual.
- El **contenido** lo arma el editor con bloques de la categoría **"Respira"**.
- La **marca** se aplica por encima, sobreescribiendo variables CSS (no se toca el SCSS).

## 2. Estructura de carpetas

```
wp-content/themes/respira/
├── functions.php          # boot de Timber, menús, enqueue, autodiscovery de bloques, gate
├── theme.json             # paleta + fuentes (para el editor)
├── composer.json          # timber/timber (PSR-4: Respira\ -> src/)
├── package.json           # @wordpress/scripts + build de bloques
├── webpack.config.js      # autodiscovery de blocks/*/index.js + copia block.json/render.php
├── src/                   # clases PHP (namespace Respira\)
│   ├── Site.php           # contexto global de Twig (menús, logo, options.*, redes, whatsapp)
│   ├── Content.php        # CPTs, taxonomía, meta boxes (sin ACF)
│   ├── Customizer.php     # Personalizador (datos de contacto, CTA, footer, whatsapp, redes)
│   └── Social_Repeater_Control.php  # control custom del Personalizador (repeater de redes)
├── *.php                  # index, front-page, page, single, archive, search, 404,
│                          # taxonomy-proyecto_categoria, single-amenidades  → Timber::render
├── assets/                # css/ js/ fonts/ images/ de Realest + respira-brand.css
├── views/                 # plantillas Twig
│   ├── base.twig          # layout maestro (preloader, back-to-top, whatsapp, header/footer)
│   ├── partials/          # header.twig, footer.twig (globales, NO son bloques)
│   ├── *.twig             # page, single, single-proyecto, taxonomy-…, archive-amenidades, …
│   └── blocks/            # 1 .twig por bloque (hero.twig, services.twig, …) — 19 en total
├── blocks/                # FUENTE de los bloques (compila a build/blocks/)
│   ├── shared/repeater.js # helper de drag-and-drop reutilizado por los repeaters
│   └── <x>/               # block.json + index.js + edit.js + render.php
└── build/                 # salida compilada (la que register_block_type() lee)
```

## 3. Timber / Twig

- Instalado por **Composer** (`timber/timber ^2.1`), no como plugin → viaja con el tema.
- `functions.php` hace `require vendor/autoload.php`, `Timber::init()` y registra `views/`
  vía el filtro `timber/locations`.
- Las plantillas raíz PHP son finas: arman el contexto y delegan al `.twig`.
  - `page.twig` extiende `base.twig` y vuelca `{{ post.content }}` → ahí salen los bloques.
  - `single-proyecto.twig`, `taxonomy-proyecto_categoria.twig`, `single-amenidades.twig`,
    `archive-amenidades.twig` son las vistas de los CPTs/taxonomía.
- **Regla**: en Twig no se llaman funciones PHP directas; se usa `{{ function('nombre') }}`
  o se inyecta el dato desde [`src/Site.php`](../wp-content/themes/respira/src/Site.php)
  (filtro `timber/context`), disponible como `{{ options.* }}`, `{{ menu_primary }}`, etc.

## 4. Bloques nativos de Gutenberg (patrón)

Cada bloque es **dinámico**: no guarda HTML en la base de datos, lo genera el front.

```
blocks/<x>/block.json   apiVersion 3, name "respira/<x>", category "respira", render: render.php
blocks/<x>/index.js     registerBlockType(..., { edit, save: () => null })
blocks/<x>/edit.js       UI del editor (InspectorControls, MediaUpload, repeaters)
blocks/<x>/render.php    arma $context desde $attributes y llama a Timber::render
views/blocks/<x>.twig    markup con las clases reales de Realest + {{ wrapper_attributes|raw }}
```

Patrones transversales (detallados en
[referencia-bloques.md](referencia-bloques.md) y la
[skill](../.claude/skills/wordpress-timber-blocks/SKILL.md)):

- **Repeater**: atributo array `items` + helpers `addItem`/`updateItem`/`removeItem` y
  `MediaUpload` por item. 14 de los 19 bloques usan repeater.
- **Repeater anidado**: `proyecto-niveles` tiene `items[]` (niveles) y cada nivel su
  `amenities[]`.
- **Orden drag-and-drop**: módulo compartido
  [`blocks/shared/repeater.js`](../wp-content/themes/respira/blocks/shared/repeater.js)
  (`useReorder`, `RepeaterRow`, `DragHandle`, `ReorderArrows`) — arrastre por manija +
  flechas ↑/↓ accesibles.
- **Icono o imagen**: campos `icon` (clase flaticon) + `imageId`/`imageUrl`; el editor
  desactiva el icono cuando hay imagen.
- **Dinámico desde CPT**: atributo `source` (`dynamic`/`manual`) + `count`; consulta el CPT
  y, si está vacío, cae a items manuales (la home nunca queda en blanco).
- **Resolución de imágenes**: en `render.php`, las rutas relativas se prefijan con
  `get_template_directory_uri().'/assets/images/'` y las absolutas pasan tal cual.

## 5. Build (solo el JS del editor)

- [`webpack.config.js`](../wp-content/themes/respira/webpack.config.js) extiende
  `@wordpress/scripts`: `globSync('blocks/*/index.js')` arma los entries y
  `copy-webpack-plugin` copia `block.json` y `render.php` a `build/`.
- `functions.php` registra cada bloque en `init` recorriendo `build/blocks/*/block.json`
  con `register_block_type()` (**autodiscovery**: no hay registro a mano).
- `npm run build` / `npm run start`. **Los estilos del front NO los compila webpack**:
  son los CSS de Realest + `respira-brand.css`, encolados desde `functions.php`.

## 6. CSS y estrategia de marca

- El front carga `assets/css/bootstrap.min.css` + `assets/css/style.css` (este `@importa`
  libs y Google Fonts) y, **al final**,
  [`assets/css/respira-brand.css`](../wp-content/themes/respira/assets/css/respira-brand.css).
- `respira-brand.css` (~1100+ líneas) **sobreescribe las variables `:root`** de Realest con
  la paleta y fuentes de marca, y añade overrides puntuales por bloque (footer, preloader,
  hero, proyecto-niveles, services-slider, why-choose-us, contacto, galería, breadcrumb,
  amenidades, botón WhatsApp, etc.). **No se recompila el SCSS** de la plantilla.
- `theme.json` declara la misma paleta y fuentes para que el editor de bloques muestre los
  colores de marca.
- **Importante**: mantener `assets/css/` y `assets/fonts/` como hermanos (los `@import`
  usan rutas `../fonts/`).

Marca: Café `#5A514B` (primario), Almendra `#F1F0EA` (claro), Negro, Blanco.
Tipografías: **Avenir** (cuerpo; stack `"Avenir Next","Avenir","Montserrat"`, Montserrat de
Google como fallback porque Avenir es comercial) y **Aboreto** (titulares, Google Fonts).

## 7. Modelo de contenido (sin ACF)

Definido en [`src/Content.php`](../wp-content/themes/respira/src/Content.php). Resumen
(detalle en [contenido-cpts-customizer.md](contenido-cpts-customizer.md)):

- **CPTs**: `proyecto`, `miembro`, `testimonio`, `amenidades`.
- **Taxonomía**: `proyecto_categoria` (jerárquica, slug `/tipo-proyecto/`), con term meta
  `_respira_image` (imagen de categoría) y su descripción.
- **Meta boxes clásicos**, meta keys con prefijo `_respira_` (p. ej. proyecto: `subtitle`,
  `date`, `client`, `website`, `location`, `value`). Amenidad: `icon` (flaticon) **o**
  `icon_image`.

## 8. Render de páginas, header/footer y elementos globales

- `views/base.twig` es el layout maestro: `page-wrapper`, **preloader**, **back-to-top**,
  **botón flotante de WhatsApp** (si está configurado) e `include` de header/footer.
- **Header y footer son parciales Twig globales** (`views/partials/`), no bloques: aparecen
  en todas las páginas. El footer usa la variante `footer-light` con 4 columnas.
- Datos globales (menús, logo, contacto, redes, whatsapp) se inyectan desde `src/Site.php`.

## 9. "Gotchas" y notas de operación

- **jQuery**: en el front, el tema reemplaza el jQuery del core por
  `assets/js/jquery.js` (la plantilla usa el global `$`). Vigilar conflictos con plugins.
- **Preloader**: además del JS de Realest, hay un **fallback** inline en `functions.php`
  que lo oculta en `window.load` o tras ~5s. El texto "Loading" se neutraliza por CSS.
- **Galerías por categoría**: `assets/js/respira-proyectos.js` implementa una galería propia
  (no bxSlider) que opera **relativa a cada bloque** para soportar varias instancias por
  página, y activa por índice la imagen + descripción + amenidades del nivel seleccionado.
- **Formularios**: los handlers PHP de Realest no se migraron. El bloque de contacto acepta
  un **shortcode** (`formShortcode`) para usar un plugin de formularios.
- **Subida de imágenes**: el límite (10 MB) es **configuración del entorno**
  (`upload_max_filesize`/`post_max_size` en php.ini / panel de Herd), **no** del tema.
- **i18n**: los textos del editor usan `__( …, 'respira' )`. No se incluyen archivos
  `.po/.mo` compilados; una versión completa en inglés requeriría generarlos.
- **Gate de "sitio en construcción"**: `functions.php` protege el sitio con contraseña
  (bypass para usuarios logueados). La contraseña está en el archivo; **no se documenta
  aquí** por seguridad.
