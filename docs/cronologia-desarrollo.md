# Cronología del desarrollo

Reconstrucción de **cómo se construyó** el sitio, a partir del historial de sesiones de
trabajo (junio 2026). Las correcciones puntuales tienen su propio detalle en
[registro-correcciones.md](registro-correcciones.md).

---

## Fase 0 — Setup y aplicación de marca (≈18 jun)

- **Pedido inicial**: adaptar una plantilla HTML (Realest) a WordPress, construyendo las
  páginas con **bloques Twig usando Timber instalado por Composer** (no como plugin). Hacer
  el setup inicial para poder construir páginas con bloques.
- Se montó el **tema clásico** con Timber v2, el toolchain de bloques (`@wordpress/scripts` +
  `webpack.config.js` con autodiscovery) y se migraron los assets de Realest.
- **Decisiones clave confirmadas con el cliente**: bloques nativos de Gutenberg dinámicos
  (sin ACF), conservar el CSS/JS de Realest (sin Tailwind), marca por override de variables
  `:root`.
- **Marca**: se ajustaron colores y tipografías según el *Manual de marca Respira Escazú*
  (PDF en `plantilla/`): Café `#5A514B`, Almendra `#F1F0EA`; Avenir (cuerpo) y Aboreto
  (titulares). Se creó `assets/css/respira-brand.css` + `theme.json`.

## Fase 1 — Bloques base (≈18 jun)

- Se construyó el **bloque Hero** como réplica fiel de la plantilla (carrusel Swiper, efectos
  y estilos) — el ejemplo genérico no servía.
- Se construyó el resto del set inicial de secciones de Realest como bloques, con compilación
  (`npm run build`) y **smoke test** del render Twig de todos los bloques.
- Bloques de esta tanda: hero, services, about, why-choose-us, awards, team, testimonials,
  faq, contact, blog, projects.

## Fase 2 — Más bloques (≈18 jun)

- A pedido del cliente (que ya iba probando), se sumaron: **pricing**, **productos** y la
  variante **services-slider**.
- Surgió y se resolvió el primer bug de integración: el **preloader quedaba activo** tras
  agregar estos bloques a `/home` (ver registro de correcciones).

## Fase 3 — Modelo de proyectos y categorización (≈18–23 jun)

- Se agregó **categorización de proyectos** (taxonomía `proyecto_categoria`, slug
  `/tipo-proyecto/`).
- Se diseñó el modelo de **proyecto con niveles**: un repeater de niveles (imagen +
  descripción por nivel) con **amenidades anidadas** (icono + texto) por nivel. La página de
  detalle/categoría se basó en la plantilla `shop-product-details.html` de Realest (quitando
  estrellas y precio), para listar los proyectos de una categoría.
- Iteraciones de diseño para que la página de proyectos **se pareciera a la plantilla base**;
  descripción de nivel **dinámica** (aparece al seleccionar la imagen del nivel); hero
  **integrado al navbar** (sin margen superior) en páginas internas.
- Ajuste del bloque **Hero**: se quitó la animación de zoom (Ken Burns); la imagen ocupa todo
  el área.

## Fase 4 — Contenido real e i18n (≈22–23 jun)

- Carga del contenido real del sitio a partir del documento `Textos pagina web de
  Respira.docx`, directamente en la base de datos, ajustando bloques/CPTs donde fue prudente.
- Ajuste de configuración del entorno: permitir **subir imágenes hasta 10 MB** (antes 2 MB).
- Revisión de **internacionalización** (un campo aparecía como "FUENTE" en la versión en
  inglés en vez de "SOURCE").

## Fase 5 — Pulido extenso de UI y bloques nuevos (≈25 jun)

Gran tanda de ajustes finos y nuevas capacidades:

- **Categorías de proyecto**: descripción visible en la tarjeta (50% desktop / 100% mobile);
  **imagen de categoría** mostrada en las tarjetas del bloque Proyectos y en el hero de la
  página de categoría.
- **Icono o imagen** en niveles y amenidades (subir imagen en lugar de elegir icono).
- **Amenidades (home)**: se quitó el número de cada tarjeta, se limitó el texto a 5 líneas con
  puntos suspensivos y se fijó el alto de las imágenes (object-fit cover) para igualar tarjetas.
- **Orden drag-and-drop**: primero para las categorías del bloque Proyectos y luego
  generalizado a **todos los repeaters** (módulo compartido `blocks/shared/repeater.js`).
- **Bloque Contacto**: lado izquierdo con título + redes sociales (repeater con icono/enlace);
  espacio del formulario vía **shortcode**.
- **Redes sociales configurables** (repeater) también en **header** y **footer** (solo icono).
- **Footer**: rediseño en una sola fila (logo, contacto, menú, logos adicionales), alineado a
  la izquierda en desktop y apilado en mobile (varias iteraciones); variante `footer-light`.
- **Colores**: bloque "¿Por qué elegirnos?" y "Servicios (slider)" pasados a fondo almendra +
  tipografía café; contraste corregido en hover de amenidades y en el breadcrumb.
- **FAQ**: textos y enlace del bloque "¿aún tienes preguntas?" editables; respuestas con
  listas (texto enriquecido); ajuste de alto de la columna de preguntas.
- **Bloque Respaldo**: nuevo, reutilizando un componente de la plantilla para logos/aliados.
- **Página interna (Ubicación)**: dos bloques nuevos — **page-hero** (hero editable con imagen
  + texto) y **ubicacion** (texto + mapa + puntos de interés por categoría).
- **Servicios (slider)**: se le agregó un campo de **descripción**.
- **Botón flotante de WhatsApp** (configurable en el Personalizador), sin chocar con el
  back-to-top; se quitó el texto "Loading" del preloader.
- **Galería**: bloque de galería tipo masonry con lightbox.

## Fase 6 — Documentación y skill (29 jun)

- Se generó esta carpeta `docs/` (registro de cómo se construyó el sitio + correcciones) y la
  **skill** reutilizable
  [`.claude/skills/wordpress-timber-blocks/`](../.claude/skills/wordpress-timber-blocks/SKILL.md),
  que generaliza el método como playbook.

---

> Las fechas son aproximadas (agrupan varias sesiones de trabajo del mismo día). El estado
> **actual** del código —no necesariamente el orden exacto— es la fuente de verdad; ver
> [referencia-bloques.md](referencia-bloques.md) y [arquitectura.md](arquitectura.md).
