# Documentación — Respira Escazú

Documentación del sitio WordPress **Respira Escazú**: un tema **clásico** que renderiza
con **Timber v2 / Twig** y construye las páginas **apilando bloques nativos de Gutenberg**
(sin ACF), reutilizando el CSS/JS de la plantilla HTML **Realest** (Bootstrap 5, sin Tailwind).

El tema vive en [`../wp-content/themes/respira/`](../wp-content/themes/respira/).

## Mapa de la documentación

| Documento | Para qué |
|---|---|
| [arquitectura.md](arquitectura.md) | Cómo está armado el tema: Timber, bloques, build, estrategia de CSS/marca, render de páginas, "gotchas". |
| [construir-paginas.md](construir-paginas.md) | Cómo se arman páginas con bloques (flujo del editor) **y** la receta para crear un bloque nuevo. |
| [referencia-bloques.md](referencia-bloques.md) | Ficha de los **19 bloques** (qué hace cada uno, atributos, si es repeater/dinámico). |
| [contenido-cpts-customizer.md](contenido-cpts-customizer.md) | CPTs, taxonomía, meta fields (`_respira_*`), el Personalizador y el repeater de redes, botón WhatsApp. |
| [cronologia-desarrollo.md](cronologia-desarrollo.md) | Narrativa de **cómo se construyó** el sitio, por fases. |
| [registro-correcciones.md](registro-correcciones.md) | **Registro de correcciones/ajustes** pedidos durante el desarrollo y cómo se resolvieron. |

> ¿Vas a crear o extender un tema de este tipo desde cero? Mirá también la **skill**
> reutilizable en [`../.claude/skills/wordpress-timber-blocks/`](../.claude/skills/wordpress-timber-blocks/SKILL.md),
> que generaliza este método como un playbook.

## Resumen de la pila

- **WordPress clásico** (no Full Site Editing).
- **Timber v2** instalado por **Composer** (no como plugin) → plantillas **Twig** en `views/`.
- **Bloques nativos de Gutenberg**, todos **dinámicos** (`save: () => null` + `render.php`
  que llama a `Timber::render('blocks/<x>.twig')`). Se registran solos por autodiscovery.
- **CSS/JS de Realest** (Bootstrap 5 + GSAP/Swiper/WOW/AOS/Fancybox…). **Sin Tailwind.**
- **Marca** aplicada sobreescribiendo variables `:root` en
  [`assets/css/respira-brand.css`](../wp-content/themes/respira/assets/css/respira-brand.css)
  + `theme.json`. **No se recompila el SCSS** de la plantilla.
- **Contenido sin ACF**: CPTs (`proyecto`, `miembro`, `testimonio`, `amenidades`),
  taxonomía `proyecto_categoria`, meta boxes clásicos y el Personalizador.

## Comandos

```bash
# Desde wp-content/themes/respira/
composer install   # Timber
npm install        # dependencias de build
npm run build      # compila blocks/ -> build/blocks/ (solo el JS del editor)
npm run start      # build en watch (desarrollo)
```

## Marca (resumen)

- Paleta: **Café `#5A514B`** (primario), **Almendra `#F1F0EA`** (claro), Negro `#000000`, Blanco `#FFFFFF`.
- Tipografías: **Avenir** (cuerpo, con fallback Montserrat) y **Aboreto** (titulares).
- Fuente: *Manual de marca Respira Escazú* (PDF en [`../plantilla/`](../plantilla/)).

## Notas de mantenimiento

- El [`README.md`](../wp-content/themes/respira/README.md) y el
  [`CLAUDE.md`](../wp-content/themes/respira/CLAUDE.md) **del tema** describen bien la
  arquitectura, pero su "backlog de bloques" quedó desactualizado (listan bloques como
  pendientes cuando ya hay 19 construidos). **Esta carpeta `docs/` es la referencia viva.**
- El tema incluye un **gate de "sitio en construcción" por contraseña** en `functions.php`.
  La contraseña está configurada en ese archivo; por seguridad **no se transcribe aquí**
  (ver [contenido-cpts-customizer.md](contenido-cpts-customizer.md#gate-de-sitio-en-construcción)).
