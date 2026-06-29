# Referencia de bloques (19)

Todos los bloques están en la categoría **"Respira"** del editor. Cada uno tiene
`blocks/<x>/{block.json,index.js,edit.js,render.php}` + `views/blocks/<x>.twig`, y es
**dinámico** (`save: () => null`; el HTML lo genera Twig en el front).

Convenciones de esta tabla:
- **Repeater** = tiene una lista de items editables (con orden drag-and-drop).
- **Dinámico** = puede consultar un CPT / las entradas del blog.

| # | Nombre (`name`) | Título en editor | Repeater | Dinámico (origen) |
|---|---|---|:--:|---|
| 1 | `respira/hero` | Hero / Banner (carrusel) | ✅ slides | — |
| 2 | `respira/about` | Nosotros | — | — |
| 3 | `respira/services` | Servicios (grid) | ✅ items | — |
| 4 | `respira/services-slider` | Servicios (slider) | ✅ items | ✅ CPT `amenidades` |
| 5 | `respira/projects` | Proyectos (galería) | ✅ items | ✅ CPT `proyecto` + taxonomía |
| 6 | `respira/team` | Equipo (slider) | ✅ items | ✅ CPT `miembro` |
| 7 | `respira/testimonials` | Testimonios (slider) | ✅ items | ✅ CPT `testimonio` |
| 8 | `respira/pricing` | Precios / Planes | ✅ items | — |
| 9 | `respira/faq` | FAQ (acordeón) | ✅ items | — |
| 10 | `respira/contact` | Contacto | ✅ socials | — |
| 11 | `respira/blog` | Blog / Noticias | — | ✅ entradas (`post`) |
| 12 | `respira/why-choose-us` | ¿Por qué elegirnos? | ✅ listItems | — |
| 13 | `respira/awards` | Premios y reconocimientos | ✅ items | — |
| 14 | `respira/productos` | Productos | ✅ items | — |
| 15 | `respira/respaldo` | Respaldo y experiencia | — | — |
| 16 | `respira/proyecto-niveles` | Proyecto – niveles | ✅ items + amenities (anidado) | — |
| 17 | `respira/page-hero` | Hero de página | — | — |
| 18 | `respira/ubicacion` | Ubicación | ✅ categories | — |
| 19 | `respira/galeria` | Galería | ✅ images | — |

## Fichas

### 1. `respira/hero` — Hero / Banner (carrusel)
Carrusel principal (Swiper, clase `banner-h1-slider`), fiel a la plantilla. Atributos:
`items[]` (slides con `bgImageId`, `title`, `text`, `ratingValue`, `circleText`, `sideImageId`).
Se le quitó la animación de zoom (Ken Burns): la imagen ocupa todo el área.

### 2. `respira/about` — Nosotros
Sección con 2 imágenes, badge, dos features (icono+título+texto), CTA y teléfono.
Atributos: `image1Id`, `badgeText`, `subtitle`, `title`, `text`, `feature1Icon/Title/Text`,
`feature2Icon/Title/Text`, `ctaLabel`, `ctaUrl`, `phoneLabel`, `phoneNumber`.

### 3. `respira/services` — Servicios (grid)
Cuadrícula de servicios. `subtitle`, `title`, `items[]` (`icon` flaticon, `title`, `link`,
`imageId`/`imageUrl`/`imageAlt`). Plantilla canónica del patrón repeater.

### 4. `respira/services-slider` — Servicios (slider)
Variante slider (Swiper `service-h1-slider`). `subtitle`, `title`, **`description`**, `source`
(`amenidades`/`manual`), `count`, `bgImage*`, `items[]` (`icon`,`title`,`link`,`text`,`image`).
En "amenidades" consulta el CPT `amenidades`. Colores ajustados a fondo almendra + tipografía café.

### 5. `respira/projects` — Proyectos (galería)
Galería dinámica de proyectos. `subtitle`, `title`, `source`
(`all`/`category`/`categories`/`manual`/`dynamic`), `count`, `category`, **`categoryOrder[]`**
(orden manual drag-and-drop de categorías), `items[]` (manuales). En modo `categories` lista
las categorías como tarjetas (con imagen a la derecha y descripción); en `category` filtra por
la taxonomía `proyecto_categoria`. Fallback a items manuales.

### 6. `respira/team` — Equipo (slider)
Slider de miembros (CPT `miembro`). `subtitle`, `title`, `source` (`dynamic`/`manual`),
`count`, `items[]` (`name`, `designation`, `link`, `image`, `facebook`, `twitter`, `instagram`).

### 7. `respira/testimonials` — Testimonios (slider)
Slider de testimonios (CPT `testimonio`). `subtitle`, `title`, `source`, `count`,
`items[]` (`text`, `name`, `designation`, `image`, `rating`).

### 8. `respira/pricing` — Precios / Planes
Tabla de planes. `subtitle`, `title`, `items[]` (`planTitle`, `currency`, `amount`, `period`,
`features` —texto, una característica por línea—, `ctaLabel`, `ctaUrl`).

### 9. `respira/faq` — FAQ (acordeón)
Acordeón de preguntas. `subtitle`, `title`, `text`, **`infoTitle`/`infoText`/`ctaLabel`/`ctaUrl`**
(bloque "¿aún tienes preguntas?", editable), `items[]` (`question`, `answer`). La respuesta
admite **texto enriquecido** (listas) y se imprime con `|raw`.

### 10. `respira/contact` — Contacto
Lado izquierdo con título + **redes sociales** (repeater `socials[]`: `icon`, `link`, `text`;
incluye whatsapp, email, facebook, waze). Lado derecho: **shortcode** del formulario
(`formShortcode`). `bgImage*`, `subtitle`, `title`, `text`.

### 11. `respira/blog` — Blog / Noticias
Sección dinámica: muestra las últimas entradas reales del blog. `subtitle`, `title`,
`ctaLabel`, `ctaUrl`, `postsCount`.

### 12. `respira/why-choose-us` — ¿Por qué elegirnos?
Imagen + texto + lista de beneficios + CTA. `imageId/Url/Alt`, `subtitle`, `title`, `text`,
`listItems[]` (strings), `ctaLabel`, `ctaUrl`. Fondo cambiado a almendra y tipografía café.

### 13. `respira/awards` — Premios y reconocimientos
Imagen lateral + lista de premios. `subtitle`, `title`, `text`, `image*`, `items[]`
(`year`, `title`, `status` —Winner/Mentioned—, `link`).

### 14. `respira/productos` — Productos
Cuadrícula de productos estáticos. `subtitle`, `title`, `cartUrl`, `items[]` (`title`, `link`,
`price`, `rating`, `image*`). *Nota: sin filtro MixItUp (esa lib no está en el bundle del
front). Para una tienda real, usar WooCommerce.*

### 15. `respira/respaldo` — Respaldo y experiencia
Sección centrada para aliados/respaldo. `subtitle`, `title`, `text`, `logoTop*`, `logoBottom*`.
Reusa componentes `sec-title` + `auto-container` de la plantilla.

### 16. `respira/proyecto-niveles` — Proyecto – niveles
**Repeater anidado**: `intro` + `items[]` (niveles: `image*`, `description` —texto
enriquecido—, `amenities[]` con `icon` flaticon **o** imagen + `text`). Renderiza el layout
"product details" de Realest (galería + lista de amenidades). En el front, al cambiar de nivel
(miniatura) cambian dinámicamente la imagen, la descripción **y** las amenidades de ese nivel
(`assets/js/respira-proyectos.js`).

### 17. `respira/page-hero` — Hero de página
Hero editable para encabezar páginas internas (no la home). `imageId/Url/Alt`, `subtitle`,
`title`, `text`, `ctaLabel`, `ctaUrl`, `align` (center/left/right). Overlay + border-radius.

### 18. `respira/ubicacion` — Ubicación
Texto + Google Maps embebido + puntos de interés agrupados por categoría. `subtitle`, `title`,
`text`, `mapEmbed` (HTML del iframe), `poisTitle`, `categories[]` (`title`, `places` —lista—).

### 19. `respira/galeria` — Galería
Galería tipo masonry (CSS columns) con lightbox Fancybox y zoom al hover. `subtitle`, `title`,
`text`, `columns` (número), `images[]`.

---

> Los nombres exactos de atributos pueden variar levemente; la fuente de verdad es el
> `block.json` y el `edit.js` de cada bloque en
> [`wp-content/themes/respira/blocks/`](../wp-content/themes/respira/blocks/).
