# Tema Respira

Tema WordPress **clásico** que renderiza con **Timber v2 (Twig)** y construye las páginas
**apilando bloques nativos de Gutenberg**. El diseño proviene de la plantilla HTML
**Realest** (Bootstrap 5 + estilos propios). **No usa Tailwind ni ACF.**

## Requisitos

- PHP ≥ 8.1
- WordPress ≥ 6.7
- Composer 2.x
- Node ≥ 18 y npm (para compilar el JS del editor de los bloques)

## Instalación

```bash
# 1. Dependencias PHP (Timber)
composer install

# 2. Dependencias JS y build de los bloques
npm install
npm run build      # produccion (genera /build/blocks/...)
# npm run start    # desarrollo con recompilacion automatica
```

Luego, en `wp-admin → Apariencia → Temas`, activa **Respira**.

Para que el menú aparezca: `Apariencia → Menús`, crea un menú y asígnalo a la
ubicación **"Menú principal"** (y opcionalmente **"Menú del footer"**).

## Cómo se construyen las páginas

1. Crea una página en WordPress (p. ej. "Inicio") y, en *Ajustes → Lectura*,
   asígnala como *Página de inicio* si es la portada.
2. En el editor de bloques, agrega bloques de la categoría **"Respira"**
   (por ahora: *Hero / Banner*) y configúralos.
3. El front renderiza esos bloques con sus plantillas Twig y los estilos de Realest.

Header y footer **no** son bloques: son parciales Twig globales
(`views/partials/header.twig`, `footer.twig`) presentes en todas las páginas.

## Estructura

```
respira/
├── functions.php            # boot de Timber, menus, enqueue de assets, registro de bloques
├── theme.json               # paleta + fuentes (editor)
├── composer.json            # timber/timber
├── package.json             # @wordpress/scripts + build de bloques
├── webpack.config.js        # auto-descubre blocks/*/index.js
├── src/Site.php             # contexto global de Twig (menus, logo, theme)
├── *.php                    # index, front-page, page, single, archive, search, 404 → Timber::render
├── assets/                  # css/ js/ fonts/ images/ de la plantilla Realest
├── views/                   # plantillas Twig
│   ├── base.twig            # layout maestro
│   ├── partials/            # header.twig, footer.twig
│   ├── *.twig               # page, single, index, archive, search, 404
│   └── blocks/              # 1 .twig por bloque (hero.twig, ...)
└── blocks/                  # fuente de bloques (compila a build/blocks/)
    └── hero/                # block.json, index.js, edit.js, render.php
```

## Crear un bloque nuevo (receta)

Para convertir una sección de Realest en bloque:

1. Crea `blocks/<nombre>/`:
   - `block.json` — `apiVersion: 3`, `name: "respira/<nombre>"`, `category: "respira"`,
     `attributes`, `supports`, `editorScript: "file:./index.js"`, `render: "file:render.php"`.
   - `index.js` — registra el bloque (`save: () => null`, es dinámico).
   - `edit.js` — UI del editor (`InspectorControls`, `MediaUpload`, `TextControl`…).
   - `render.php` — arma `$context` desde `$attributes` y llama
     `Timber::render( 'blocks/<nombre>.twig', $context )`.
2. Crea `views/blocks/<nombre>.twig` con el markup/clases de esa sección de Realest.
3. `npm run build` (o `npm run start`). El bloque se registra solo (autodiscovery en `functions.php`).

Convenciones de nombres: bloque `respira/<kebab>`, clase CSS `wp-block-respira-<kebab>`.

## Backlog de bloques (secciones de Realest)

hero ✓ · servicios (grid) · about · servicios (slider) · proyectos ·
why-choose-us · awards/stats · equipo · testimonios · FAQ · contacto · blog ·
pricing · productos.

## Notas / pendientes

- **jQuery**: el tema reemplaza el jQuery del core por el de la plantilla
  (`assets/js/jquery.js`) en el front, porque los plugins de Realest usan el global `$`.
  Si aparecen conflictos con otros plugins, revisar `functions.php` (sección 4).
- **Formularios** (contacto, cotización): los manejadores PHP de la plantilla no se
  migraron; usar un plugin de formularios o endpoints propios.
- El código fuente SCSS de Realest queda disponible en la plantilla original por si
  se necesita recompilar estilos.
```
