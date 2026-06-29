# Modelo de contenido: CPTs, taxonomía, meta y Personalizador

Todo el contenido estructurado se maneja **sin ACF**: tipos de contenido y meta boxes
clásicos en [`src/Content.php`](../wp-content/themes/respira/src/Content.php), datos globales
del sitio en el **Personalizador** (`src/Customizer.php`) e inyectados a Twig por
[`src/Site.php`](../wp-content/themes/respira/src/Site.php).

## 1. Custom Post Types (CPTs)

Registrados en `Content.php` (en `init`). Meta keys con prefijo **`_respira_`**.

| CPT | Slug | Meta fields (`_respira_*`) | Lo consume |
|---|---|---|---|
| `proyecto` | `/proyectos/` | `subtitle`, `date`, `client`, `website`, `location`, `value` | bloque **Proyectos**, `single-proyecto.twig`, `taxonomy-…` |
| `miembro` | `/equipo/` | `designation`, `facebook`, `twitter`, `instagram` | bloque **Equipo** |
| `testimonio` | `/testimonios/` | `designation`, `rating` (1–5) | bloque **Testimonios** |
| `amenidades` | `/amenidades/` | `icon` (clase flaticon) **o** `icon_image` (imagen) | bloque **Servicios (slider)**, `archive-amenidades.twig`, `single-amenidades.twig` |

- Soportan `title`, `editor`, `thumbnail`, `excerpt` (según corresponda) y `page-attributes`
  (para ordenar manualmente con el campo *Orden*).
- Las **rewrite rules** se vacían **una sola vez** (opción tipo `respira_rewrite_version`)
  para que los slugs nuevos funcionen sin entrar a *Ajustes → Enlaces permanentes*.

## 2. Taxonomía `proyecto_categoria`

- Jerárquica, pública, slug **`/tipo-proyecto/`**. Agrupa proyectos por tipo (casas,
  departamentos, etc.).
- **Term meta** `_respira_image`: imagen de la categoría. Se muestra en cada tarjeta del
  bloque **Proyectos (galería)** (imagen a la derecha, contenido a la izquierda; en mobile la
  imagen va debajo) y en el **hero** de la página de categoría.
- La **descripción** del término se muestra debajo del hero en la página de categoría
  (`/tipo-proyecto/{categoria}/` → `taxonomy-proyecto_categoria.twig`).
- Campos de imagen de término: hooks `created_proyecto_categoria` / `edited_proyecto_categoria`.

## 3. Meta boxes (sin ACF)

- `add_meta_boxes` + `save_post`, con UI propia en `Content::render_meta_box()`.
- El selector de imagen usa `wp.media` (se encola `wp_enqueue_media()` + CSS de flaticon en el
  admin vía `admin_enqueue_scripts`).
- **Amenidad**: se puede elegir un **icono** del set flaticon (≈30 clases del set realestate)
  **o** subir una **imagen** que lo reemplaza.

## 4. Personalizador (Apariencia → Personalizar → Respira)

Sección `respira_general`. Los valores se inyectan a Twig como `{{ options.* }}` desde
`Site.php`. Campos (theme mods):

| Campo (theme mod) | Uso |
|---|---|
| `respira_cta_label` / `respira_cta_url` | Botón CTA del header |
| `respira_address` | Dirección |
| `respira_email` | Email (`options.email`) |
| `respira_phone` | Teléfono (`options.phone` + `options.phone_tel` para enlace `tel:`) |
| `respira_hours` | Horario |
| `respira_footer_tagline` | Texto/tagline del footer |
| `respira_footer_image_1` / `_2` | Logos/imágenes adicionales del footer |
| `respira_whatsapp` | Número o URL del **botón flotante de WhatsApp** |
| `respira_whatsapp_msg` | Mensaje predeterminado de WhatsApp (opcional) |
| `respira_socials` | **Repeater de redes sociales** (JSON: icono + enlace) |

### 4.1 Repeater de redes sociales (control custom)
- Implementado en
  [`src/Social_Repeater_Control.php`](../wp-content/themes/respira/src/Social_Repeater_Control.php)
  (extiende `WP_Customize_Control`, type `respira_socials`).
- UI: filas con **selector de icono** + **input de URL** + botón eliminar, y botón "Agregar
  red social". Iconos soportados (≈11): Facebook, Instagram, WhatsApp, Email, Waze, Twitter,
  LinkedIn, YouTube, TikTok, Pinterest, Teléfono.
- Se guarda como JSON y `Site.php` lo decodifica a `options.socials` (con defaults si está
  vacío). Se muestra en **header** y **footer** (solo el icono, sin texto).
- *Nota de desarrollo*: el selector se ajustó para que sea más compacto y no tape el campo de
  URL (ver [registro-correcciones.md](registro-correcciones.md)).

### 4.2 Botón flotante de WhatsApp
- Se renderiza en `views/base.twig` (`<a class="respira-wa-float">`) solo si
  `options.whatsapp_url` tiene valor.
- `Site::whatsapp_url()` arma el enlace: si el valor es URL la usa tal cual; si es número, arma
  `https://wa.me/<números>` (+ mensaje opcional). Posicionado abajo a la derecha, sin chocar
  con el back-to-top.

## 5. Contexto global de Twig (`Site.php`)

`src/Site.php` extiende `Timber\Site` y, vía el filtro `timber/context`, expone:
- `options.*` — todos los campos del Personalizador de arriba.
- `menu_primary` / `menu_footer` — los menús (ubicaciones registradas: *Menú principal* y
  *Menú del footer* en **Apariencia → Menús**).
- `site_logo` — logo personalizado (`custom_logo`).
- `theme` — objeto de tema (para rutas a `assets/`).

## 6. Plantillas de los CPTs / taxonomía

| Plantilla PHP raíz | Twig | Muestra |
|---|---|---|
| `single.php` (→ `single-proyecto.twig`) | `views/single-proyecto.twig` | Detalle de un proyecto (meta + breadcrumb + contenido + bloque niveles) |
| `taxonomy-proyecto_categoria.php` | `views/taxonomy-proyecto_categoria.twig` | Listado de proyectos de una categoría, con hero (imagen de la categoría) + descripción |
| `single-amenidades.php` | `views/single-amenidades.twig` | Detalle de una amenidad |
| (archive) | `views/archive-amenidades.twig` | Listado del CPT amenidades (tarjetas de igual altura) |

## 7. Gate de "sitio en construcción"

`functions.php` incluye un **bloqueo del sitio por contraseña** (sección dedicada) mientras el
sitio está en desarrollo:
- Redirige (HTTP 503) a un formulario de contraseña a las visitas no autorizadas.
- **Bypass** para usuarios logueados/administradores; guarda una cookie de preview por ~7 días.

> 🔒 **Seguridad**: la contraseña está escrita en claro dentro de `functions.php`. **No se
> transcribe en esta documentación.** Para entornos productivos conviene mover el secreto a
> una constante en `wp-config.php` (fuera del repositorio versionado) o eliminar el gate.
