# Registro de correcciones y ajustes

Correcciones, bugs y ajustes pedidos durante el desarrollo, con su resolución y los archivos
involucrados. Reconstruido del historial de sesiones; **verificado contra el código actual**.

Estado: ✅ implementado · ⚠️ parcial / fuera del tema · 🔁 cambió de criterio durante el proceso.

---

## Bloques y front-end

### ✅ Preloader que quedaba activo
- **Pedido**: el preloader no se quitaba tras agregar bloques a `/home`.
- **Resolución**: además del JS de Realest, se agregó un **fallback** que oculta el preloader
  en `window.load` y, por seguridad, tras ~5s.
- **Archivos**: [`functions.php`](../wp-content/themes/respira/functions.php) (script inline,
  ~líneas 145–152), `assets/js/script.js`,
  [`assets/css/respira-brand.css`](../wp-content/themes/respira/assets/css/respira-brand.css)
  (`.preloader`, ~líneas 100–108).

### ✅ Texto "Loading" del preloader
- **Pedido**: quitar el texto "loading" del preloader.
- **Resolución**: neutralizado por CSS (no se imprime el texto).
- **Archivos**: `assets/css/respira-brand.css`, `assets/css/style.css`.

### ✅ Hero sin animación de zoom
- **Pedido**: quitar la animación de zoom in/out (Ken Burns) del hero; que la imagen ocupe
  todo el área.
- **Resolución**: se removió la animación; imagen fija a tamaño completo.
- **Archivos**: [`views/blocks/hero.twig`](../wp-content/themes/respira/views/blocks/hero.twig),
  `assets/css/respira-brand.css` (overrides del hero).

### ✅ Hero integrado al navbar en páginas internas
- **Pedido**: que el hero de páginas internas/categoría no deje margen por encima del navbar.
- **Resolución**: ajuste de posicionamiento del hero/`page-title` en esas vistas.
- **Archivos**: `assets/css/respira-brand.css`,
  [`views/taxonomy-proyecto_categoria.twig`](../wp-content/themes/respira/views/taxonomy-proyecto_categoria.twig).

### ✅ "¿Por qué elegirnos?" — colores de marca
- **Pedido**: fondo negro → beige (almendra), tipografía café.
- **Resolución**: override de fondo y color.
- **Archivos**: `assets/css/respira-brand.css` (sección `why-choose-us`, ~734–746).

### ✅ "Servicios (slider)" — colores + descripción
- **Pedido**: fondo verdoso → beige, tipografía café (revisar botones); y agregar un campo de
  **descripción** visible en el front.
- **Resolución**: override de colores; atributo `description` agregado al bloque y al Twig.
- **Archivos**: `assets/css/respira-brand.css` (~748–774),
  [`blocks/services-slider/edit.js`](../wp-content/themes/respira/blocks/services-slider/edit.js),
  [`views/blocks/services-slider.twig`](../wp-content/themes/respira/views/blocks/services-slider.twig).

### ✅ Breadcrumb con bajo contraste
- **Pedido**: en páginas de detalle el breadcrumb se confundía con el fondo del hero.
- **Resolución**: color de fuente más claro (almendra/blanco) sobre el hero.
- **Archivos**: `assets/css/respira-brand.css` (sección breadcrumb, ~845–858).

---

## Proyectos, niveles y amenidades

### 🔁✅ Descripción de nivel: listas → revert → dinámica
- **Pedido (1)**: permitir listas (numeradas/desordenadas) en la descripción de cada nivel.
- **Cambio de criterio**: "volvé atrás lo de la descripción, luego vemos cómo resolverlo".
- **Pedido (2)**: cambiar la descripción a **contenido enriquecido** y hacerla **dinámica**
  (que aparezca solo al seleccionar la imagen de ese nivel).
- **Resolución**: descripción por nivel como texto enriquecido; en el front se muestra solo la
  del nivel activo.
- **Archivos**: [`blocks/proyecto-niveles/`](../wp-content/themes/respira/blocks/proyecto-niveles/),
  [`assets/js/respira-proyectos.js`](../wp-content/themes/respira/assets/js/respira-proyectos.js).

### ✅ Bug: las amenidades siempre mostraban las del último nivel
- **Pedido**: al cambiar de nivel cambiaba la descripción pero **no** las amenidades (mostraba
  siempre las del último). Tras un primer intento, dejó de mostrar las de los primeros niveles.
- **Causa raíz**: el contenedor de amenidades por nivel necesitaba **texto para mostrarse**;
  el render filtra amenidades vacías y los grupos se activan por índice.
- **Resolución**: `respira-proyectos.js` activa **por índice** la imagen, la descripción **y**
  las amenidades del nivel seleccionado (clase `.is-active`); el render genera un contenedor de
  amenidades por nivel.
- **Archivos**: `assets/js/respira-proyectos.js` (`activate(i)`, ~25–30),
  `blocks/proyecto-niveles/render.php`, `assets/css/respira-brand.css`
  (`.proyecto-amenidades-nivel.is-active`, ~188–213).

### ✅ Selector de icono **o** imagen (niveles y amenidades)
- **Pedido**: en niveles y amenidades, poder subir una **imagen** en lugar de elegir un icono.
- **Resolución**: campos `icon` + `imageId`/`imageUrl`; el icono se desactiva cuando hay imagen
  (`disabled={ !! imageUrl }`) y el Twig renderiza condicional. En el CPT `amenidades`, meta
  `icon_image`.
- **Archivos**: [`blocks/proyecto-niveles/edit.js`](../wp-content/themes/respira/blocks/proyecto-niveles/edit.js),
  `views/blocks/proyecto-niveles.twig`,
  [`src/Content.php`](../wp-content/themes/respira/src/Content.php).

### ✅ Bug: no se podía cambiar la imagen del nivel
- **Pedido**: en el bloque de niveles, el `MediaUpload` del nivel no permitía cambiar la imagen.
- **Resolución**: corregido el selector de imagen por nivel.
- **Archivos**: `blocks/proyecto-niveles/edit.js`.

### ✅ Amenidades (home): número, texto y altura de imagen
- **Pedido**: que la imagen se viera cuando se carga como imagen; **quitar el número** de cada
  tarjeta; **limitar el texto a 5 líneas** con puntos suspensivos; fijar el **alto de la
  imagen** (cover) para igualar tarjetas.
- **Resolución**: CSS con `-webkit-line-clamp: 5`, imagen a alto fijo con `object-fit: cover`,
  número oculto, render de la imagen del icono.
- **Archivos**: `assets/css/respira-brand.css` (~288–345).

### ✅ Categorías de proyecto: imagen + descripción
- **Pedido**: agregar **descripción** visible en la tarjeta de categoría (50% desktop / 100%
  mobile) y una **imagen** de categoría, mostrada en las tarjetas del bloque Proyectos (imagen
  a la derecha, contenido a la izquierda; mobile imagen abajo) y en el **hero** de la página de
  categoría. También: mostrar la descripción de la categoría **después del hero** en
  `/tipo-de-proyecto/`.
- **Resolución**: term meta `_respira_image`; descripción del término en la vista; bloque
  Proyectos en modo `categories`.
- **Archivos**: `src/Content.php` (term meta),
  [`blocks/projects/render.php`](../wp-content/themes/respira/blocks/projects/render.php),
  `views/taxonomy-proyecto_categoria.twig`, `assets/css/respira-brand.css`.

### ✅ Espaciado en tarjetas de categoría
- **Pedido**: demasiada separación entre título, descripción y botón "ver más".
- **Resolución**: ajuste de márgenes.
- **Archivos**: `assets/css/respira-brand.css`.

---

## Repeaters y edición

### ✅ Orden drag-and-drop en todos los repeaters
- **Pedido**: poder ordenar las categorías del bloque Proyectos **arrastrando**; luego,
  generalizar el reordenamiento a **todos los repeaters** de los bloques custom.
- **Resolución**: módulo compartido con `useReorder` + `RepeaterRow`/`DragHandle`/`ReorderArrows`
  (arrastre por manija + flechas accesibles); el bloque Proyectos persiste `categoryOrder`.
- **Archivos**: [`blocks/shared/repeater.js`](../wp-content/themes/respira/blocks/shared/repeater.js),
  `blocks/projects/` y los demás `edit.js`.

---

## Contacto, header y footer

### ✅ Bloque Contacto: redes + shortcode de formulario
- **Pedido**: lado izquierdo con título + **redes sociales** (repeater: texto, enlace, icono —
  whatsapp, email, facebook, waze). Espacio del formulario con opción de **shortcode**.
- **Resolución**: atributos `socials[]` y `formShortcode` en el bloque.
- **Archivos**: [`blocks/contact/`](../wp-content/themes/respira/blocks/contact/),
  `views/blocks/contact.twig`.
- **Sub-ajustes**: "se está viendo mal" → correcciones de layout; en mobile, redes **alineadas**
  (no centradas). (`assets/css/respira-brand.css`).

### ✅ Redes sociales configurables en header y footer
- **Pedido**: que los enlaces de redes del header y footer sean configurables por repeater
  (solo icono, sin texto).
- **Resolución**: control custom del Personalizador (`respira_socials`) inyectado a Twig.
- **Archivos**: [`src/Social_Repeater_Control.php`](../wp-content/themes/respira/src/Social_Repeater_Control.php),
  [`src/Customizer.php`](../wp-content/themes/respira/src/Customizer.php),
  `src/Site.php`, `views/partials/header.twig`, `views/partials/footer.twig`.
- **Sub-ajuste**: el selector del repeater era muy grande y tapaba el campo de URL → se hizo
  más compacto (CSS inline del control en `Customizer.php`).

### ✅ Rediseño del footer
- **Pedido (varias iteraciones)**: poner logo, contacto, menú y logos adicionales en **una sola
  fila**; contacto y menú **alineados a la izquierda**; en mobile, apilados; logos adicionales
  más grandes y de igual alto; en desktop, todo alineado arriba; variante clara.
- **Resolución**: layout `footer-light` con `.footer-main-row` (4 columnas) + reglas responsive.
- **Archivos**: `views/partials/footer.twig`, `assets/css/respira-brand.css`.

---

## Bloques nuevos pedidos durante el desarrollo

### ✅ Bloque "Respaldo y experiencia"
- **Pedido**: nuevo bloque para logos/aliados, reutilizando un componente de la plantilla para
  mantener la estética. (Sub-ajuste: reducir la fuente del título y ampliar el margen entre el
  texto y los logos.)
- **Archivos**: [`blocks/respaldo/`](../wp-content/themes/respira/blocks/respaldo/),
  `views/blocks/respaldo.twig`.

### ✅ Página "Ubicación": bloques `page-hero` y `ubicacion`
- **Pedido**: una página aparte del home con (1) un **hero editable** (imagen + texto) y (2) un
  bloque de **ubicación** (texto, mapa y puntos de interés por categoría).
- **Archivos**: [`blocks/page-hero/`](../wp-content/themes/respira/blocks/page-hero/),
  [`blocks/ubicacion/`](../wp-content/themes/respira/blocks/ubicacion/) + sus Twig.

### ✅ FAQ editable + listas
- **Pedido**: textos y enlace del bloque "¿aún tienes preguntas?" editables; que las respuestas
  acepten viñetas/listas; y que la columna de preguntas no quede mucho más alta que la izquierda.
- **Resolución**: atributos `infoTitle`/`infoText`/`ctaLabel`/`ctaUrl`; respuesta con texto
  enriquecido (`|raw`); ajuste de alto por CSS.
- **Archivos**: [`blocks/faq/`](../wp-content/themes/respira/blocks/faq/),
  `views/blocks/faq.twig`, `assets/css/respira-brand.css`.

### ✅ Botón flotante de WhatsApp
- **Pedido**: botón flotante abajo a la derecha, sin chocar con el back-to-top, con enlace
  configurable desde el Personalizador.
- **Resolución**: `<a class="respira-wa-float">` en `base.twig` (si hay `options.whatsapp_url`);
  `Site::whatsapp_url()` arma el enlace (número → `wa.me`); campo `respira_whatsapp` en el
  Personalizador.
- **Archivos**: [`views/base.twig`](../wp-content/themes/respira/views/base.twig) (~31–36),
  `src/Site.php`, `src/Customizer.php`, `assets/css/respira-brand.css`.

---

## Pendientes / fuera del tema

### ⚠️ Subida de imágenes hasta 10 MB
- **Pedido**: permitir subir imágenes de hasta 10 MB (antes 2 MB).
- **Estado**: es **configuración del entorno**, no del tema. No hay constante ni filtro en el
  código del tema. Se ajusta vía `upload_max_filesize` / `post_max_size` en php.ini / `.user.ini`
  o el panel de Herd/hosting.
- **Nota de despliegue**: documentar el valor en el entorno productivo; el tema no lo fuerza.

### ⚠️ i18n "FUENTE" → "SOURCE"
- **Pedido**: en la versión en inglés aparecía "FUENTE" en lugar de "SOURCE"; revisar casos
  similares.
- **Estado**: **parcial**. La sesión se interrumpió. Hoy los textos del editor usan
  `__( …, 'respira' )` (p. ej. la etiqueta "Origen del contenido" en
  `blocks/*/edit.js`), pero **no hay archivos `.po/.mo`** compilados en el tema. Una versión
  completa en inglés requiere generar la traducción (`.pot` → `.po` → `.mo`).
- **Archivos**: `blocks/team/edit.js`, `blocks/testimonials/edit.js`,
  `blocks/services-slider/edit.js`, `blocks/projects/edit.js`.

---

> Las referencias `archivo:línea` son orientativas (el código pudo moverse). La fuente de
> verdad es el archivo citado; para el detalle de cada bloque ver
> [referencia-bloques.md](referencia-bloques.md).
