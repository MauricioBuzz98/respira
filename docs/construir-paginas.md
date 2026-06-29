# Construir páginas con bloques

Dos públicos en este documento: **editores de contenido** (cómo armar/editar páginas) y
**desarrolladores** (cómo crear un bloque nuevo).

---

## Parte A — Para editores de contenido

### A.1 Crear una página
1. **Páginas → Añadir nueva**. Ponle título (p. ej. "Inicio", "Ubicación").
2. Para la portada: **Ajustes → Lectura → Tu página de inicio → Una página estática** y
   elegí la página. La portada usa `front-page.php`.
3. En el editor, agregá bloques de la categoría **"Respira"** (botón `+` → categoría Respira).

El **header y el footer** no se editan por página: son globales. Sus datos (logo, menús,
contacto, redes) se configuran en **Apariencia → Personalizar → Respira** y en
**Apariencia → Menús** (ver [contenido-cpts-customizer.md](contenido-cpts-customizer.md)).

### A.2 Configurar un bloque
- Cada bloque tiene su **panel lateral** (icono de engranaje) con sus opciones y, en muchos,
  los campos editables están **en línea** dentro del bloque.
- **Listas repetibles** (servicios, planes, FAQ, redes, niveles, POIs…): usá
  **"Agregar item"** para sumar filas y el botón de **eliminar** en cada una.
- **Reordenar** items: arrastrá desde la **manija ⠿** de cada fila, o usá las flechas
  **↑ / ↓**. El orden se respeta en el front.
- **Imágenes**: botón "Elegir/Cambiar imagen" (biblioteca de medios de WordPress).
- **Icono o imagen** (niveles y amenidades): podés elegir un icono del set o subir una
  imagen; si subís imagen, esta reemplaza al icono.

### A.3 Bloques que muestran contenido automáticamente (CPTs)
Algunos bloques pueden mostrar contenido cargado en otra parte del panel:
- **Proyectos (galería)**, **Equipo**, **Testimonios** y **Servicios (slider)** tienen un
  selector de **origen** (dinámico vs. manual). En "dinámico" listan el CPT correspondiente
  (Proyectos, Miembros, Testimonios, Amenidades). Si el CPT está vacío, muestran los items
  manuales de respaldo.
- **Blog/Noticias** muestra automáticamente las últimas entradas del blog.

Para que la sección de proyectos por categoría funcione, cargá **Proyectos** y asignales una
**categoría de proyecto** (taxonomía con su imagen y descripción).

### A.4 Formulario de contacto
El bloque **Contacto** deja un espacio para el formulario: pegá el **shortcode** de tu plugin
de formularios (CF7, Forminator, etc.) en el campo correspondiente. El tema no trae backend
de formularios propio.

---

## Parte B — Para desarrolladores: crear un bloque nuevo

> Versión copiable con todo el código en la **skill**:
> [`.claude/skills/wordpress-timber-blocks/references/crear-bloque.md`](../.claude/skills/wordpress-timber-blocks/references/crear-bloque.md).

### B.1 Receta
1. **Identificá la sección** en la plantilla Realest (`plantilla/…`) y sus clases CSS.
2. Creá `blocks/<nombre>/`:
   - `block.json` — `apiVersion: 3`, `name: "respira/<nombre>"`, `category: "respira"`,
     `attributes`, `supports`, `editorScript: "file:./index.js"`, `render: "file:render.php"`.
   - `index.js` — `registerBlockType(metadata.name, { edit, save: () => null })` (dinámico).
   - `edit.js` — UI del editor (`InspectorControls`, `MediaUpload`, `TextControl`…).
   - `render.php` — arma `$context` desde `$attributes` y llama
     `Timber::render('blocks/<nombre>.twig', $context)`.
3. Creá `views/blocks/<nombre>.twig` con el markup real de esa sección y
   `{{ wrapper_attributes|raw }}` en el elemento raíz.
4. `npm run build` (o `npm run start`). El bloque se registra solo (autodiscovery).
5. Probalo en una página: revisá **editor** y **front**.

### B.2 Convenciones
- Bloque: `respira/<kebab>` · clase del wrapper: `wp-block-respira-<kebab>`.
- Función PHP: `respira_<snake>` · meta keys: `_respira_<campo>`.
- Twig del bloque: `views/blocks/<kebab>.twig` (mismo `<kebab>` que la carpeta).
- Textos del editor envueltos en `__( 'texto', 'respira' )`.

### B.3 Reglas (de [`CLAUDE.md`](../wp-content/themes/respira/CLAUDE.md))
- **SÍ**: bloque dinámico (`save: () => null`); `get_block_wrapper_attributes()` en la raíz
  del Twig; **clases CSS de Realest** (theme-btn, sec-title, auto-container, row-cols-*…);
  `__()` con textdomain `respira`.
- **NO**: Tailwind, ACF, shortcodes propios para armar layout; webpack manual fuera de
  `webpack.config.js`.

### B.4 Si la sección repite items
Usá el patrón de repeater + el módulo compartido de orden
[`blocks/shared/repeater.js`](../wp-content/themes/respira/blocks/shared/repeater.js):
```js
import { useReorder, RepeaterRow } from '../shared/repeater';
const reorder = useReorder( items, ( next ) => setAttributes({ items: next }) );
```
Mirá [`blocks/services/`](../wp-content/themes/respira/blocks/services/) como plantilla
canónica de un repeater simple, y
[`blocks/proyecto-niveles/`](../wp-content/themes/respira/blocks/proyecto-niveles/) para un
repeater **anidado** (niveles con amenidades).

### B.5 Si la sección sale de un CPT
Agregá atributos `source` (`dynamic`/`manual`) y `count`; en `render.php` consultá el CPT con
`get_posts()` y **mapeá a la misma estructura** que esperan los items manuales, con fallback.
Ejemplos: [`blocks/projects/`](../wp-content/themes/respira/blocks/projects/),
[`blocks/team/`](../wp-content/themes/respira/blocks/team/),
[`blocks/testimonials/`](../wp-content/themes/respira/blocks/testimonials/).

### B.6 Si la sección usa un slider/JS de la plantilla
Reusá la **clase** que el `script.js` de Realest inicializa (p. ej. `banner-h1-slider`,
`team-h1-slider`, `testi-h1-slider`, `service-h1-slider`). Para listados con varias
instancias en la misma página, escribí un init propio que itere `.each()` y opere relativo a
cada bloque (ver `assets/js/respira-proyectos.js`).
