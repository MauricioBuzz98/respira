<?php
/**
 * Respira theme — bootstrap.
 *
 * Tema clasico (no FSE) que renderiza con Timber/Twig y construye paginas con
 * bloques nativos de Gutenberg. El CSS/JS proviene de la plantilla "Realest"
 * (Bootstrap 5 + libs); no se usa Tailwind.
 *
 * @package Respira
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// 1. Autoloader de Composer (incluye Timber, usado por los render.php de bloques)
// ---------------------------------------------------------------------------
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
} else {
	add_action( 'admin_notices', function (): void {
		echo '<div class="error"><p><strong>Respira:</strong> Ejecuta <code>composer install</code> dentro del directorio del tema.</p></div>';
	} );
	return; // Sin Timber no hay nada que arrancar.
}

use Timber\Timber;

// ---------------------------------------------------------------------------
// 2. Inicializar Timber y registrar el directorio de vistas Twig
// ---------------------------------------------------------------------------
if ( class_exists( Timber::class ) ) {
	Timber::init();

	add_filter( 'timber/locations', function ( array $paths ): array {
		$paths[0][] = get_template_directory() . '/views';
		return $paths;
	} );

	// Clase Site: inyecta menus, logo y datos globales al contexto de Twig.
	if ( class_exists( \Respira\Site::class ) ) {
		new \Respira\Site();
	}
}

// Contenido dinámico: CPTs (Proyectos, Equipo, Testimonios) + meta boxes.
if ( class_exists( \Respira\Content::class ) ) {
	new \Respira\Content();
}

// Personalizador: controles para el botón del header y datos del header/footer.
if ( class_exists( \Respira\Customizer::class ) ) {
	new \Respira\Customizer();
}

// ---------------------------------------------------------------------------
// 3. Soporte del tema, menus y tamanos de imagen
// ---------------------------------------------------------------------------
add_action( 'after_setup_theme', function (): void {
	load_theme_textdomain( 'respira', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );

	register_nav_menus( [
		'primary' => __( 'Menu principal', 'respira' ),
		'footer'  => __( 'Menu del footer', 'respira' ),
	] );
} );

// ---------------------------------------------------------------------------
// 4. Assets del front (CSS + JS de la plantilla Realest)
//    Solo se ejecuta en el front; el editor no carga este bundle.
// ---------------------------------------------------------------------------
add_action( 'wp_enqueue_scripts', function (): void {
	$uri = get_template_directory_uri();
	$dir = get_template_directory();

	$ver = static function ( string $rel ) use ( $dir ): string {
		$path = $dir . $rel;
		return file_exists( $path ) ? (string) filemtime( $path ) : '1.0.0';
	};

	// --- Estilos ---------------------------------------------------------
	// Orden de la plantilla: bootstrap.min.css primero; style.css despues
	// (style.css hace @import de fontawesome, swiper, aos, etc. y de las
	// Google Fonts). Mantener css/ y fonts/ como hermanos en /assets/.
	wp_enqueue_style( 'respira-bootstrap', $uri . '/assets/css/bootstrap.min.css', [], $ver( '/assets/css/bootstrap.min.css' ) );
	wp_enqueue_style( 'respira-style', $uri . '/assets/css/style.css', [ 'respira-bootstrap' ], $ver( '/assets/css/style.css' ) );

	// Fuentes de marca: Aboreto (titulares) + Montserrat (fallback de Avenir).
	wp_enqueue_style( 'respira-fonts', 'https://fonts.googleapis.com/css2?family=Aboreto&family=Montserrat:wght@300;400;500;600;700&display=swap', [], null );

	// Override de marca (paleta + tipografias). Debe ir DESPUES de style.css.
	wp_enqueue_style( 'respira-brand', $uri . '/assets/css/respira-brand.css', [ 'respira-style' ], $ver( '/assets/css/respira-brand.css' ) );

	// Estilos del formulario de contacto en Forminator: replican el look de la
	// plantilla (.form-clt / .theme-btn) y fuerzan por encima de Forminator y
	// Elementor. Solo se encola si Forminator está activo. Debe ir DESPUES de
	// respira-brand.css para usar sus variables de marca.
	if ( class_exists( 'Forminator' ) ) {
		wp_enqueue_style( 'respira-forminator', $uri . '/assets/css/forminator-respira.css', [ 'respira-brand' ], $ver( '/assets/css/forminator-respira.css' ) );

		// Comportamiento del mensaje de éxito (overlay + fade + auto-restaurar).
		// Depende de jQuery (la plantilla ya lo encola en el footer).
		wp_enqueue_script( 'respira-forminator', $uri . '/assets/js/respira-forminator.js', [ 'jquery' ], $ver( '/assets/js/respira-forminator.js' ), true );
	}

	// --- Scripts ---------------------------------------------------------
	// Reemplazamos el jQuery del core por el de la plantilla (la plantilla
	// usa el global `$` y depende de ese jQuery). Se cargan todos en el footer
	// en el mismo orden que index.html, encadenados por dependencias para
	// garantizar la secuencia.
	wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', $uri . '/assets/js/jquery.js', [], $ver( '/assets/js/jquery.js' ), true );

	// [ handle, archivo ] en orden; cada uno depende del anterior.
	$bundle = [
		[ 'respira-popper',               'popper.min.js' ],
		[ 'respira-bootstrap-js',         'bootstrap.min.js' ],
		[ 'respira-fancybox',             'jquery.fancybox.js' ],
		[ 'respira-jquery-ui',            'jquery-ui.js' ],
		[ 'respira-wow',                  'wow.js' ],
		[ 'respira-select2',              'select2.min.js' ],
		[ 'respira-appear',               'appear.js' ],
		[ 'respira-bxslider',             'bxslider.js' ],
		[ 'respira-knob',                 'knob.js' ],
		[ 'respira-swiper',               'swiper.min.js' ],
		[ 'respira-aos',                  'aos.js' ],
		[ 'respira-gsap',                 'gsap.min.js' ],
		[ 'respira-scrolltrigger',        'ScrollTrigger.min.js' ],
		[ 'respira-splittype',            'splitType.js' ],
		[ 'respira-gsap-scroll-smoother', 'gsap-scroll-smoother.js' ],
		[ 'respira-gsap-scroll-to',       'gsap-scroll-to-plugin.js' ],
		[ 'respira-gsap-splittext',       'SplitText.min.js' ],
		[ 'respira-custom-gsap',          'custom-gsap.js' ],
		[ 'respira-script',               'script.js' ],
	];

	$prev = 'jquery';
	foreach ( $bundle as [ $handle, $file ] ) {
		$rel = '/assets/js/' . $file;
		wp_enqueue_script( $handle, $uri . $rel, [ $prev ], $ver( $rel ), true );
		$prev = $handle;
	}
	wp_enqueue_script( 'jquery' ); // asegurar que el jQuery de la plantilla se encola.

	// Galerías de proyectos (bloque respira/proyecto-niveles): init por instancia.
	// Solo en el single de proyecto y en el listado por categoría.
	if ( is_singular( 'proyecto' ) || is_tax( 'proyecto_categoria' ) ) {
		wp_enqueue_script( 'respira-proyectos', $uri . '/assets/js/respira-proyectos.js', [ 'respira-script' ], $ver( '/assets/js/respira-proyectos.js' ), true );
	}

	// Red de seguridad para el preloader: aunque algún script de la plantilla
	// lance un error y aborte (script.js es un único IIFE), este script inline
	// corre en su propia etiqueta y oculta el preloader al cargar (o a los 5s),
	// evitando que la página quede bloqueada. Los errores siguen en consola.
	wp_add_inline_script(
		'respira-script',
		"(function(){function h(){var p=document.querySelector('.preloader');if(p){p.style.transition='opacity .4s ease';p.style.opacity='0';setTimeout(function(){if(p){p.style.display='none';}},450);}}window.addEventListener('load',h);setTimeout(h,5000);})();"
	);
} );

// ---------------------------------------------------------------------------
// 5. Estilos del editor (aproxima el look del front dentro de Gutenberg)
// ---------------------------------------------------------------------------
add_action( 'after_setup_theme', function (): void {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bootstrap.min.css' );
	add_editor_style( 'assets/css/style.css' );
	// Font Awesome como editor-style propio: el @import de fontawesome.css dentro
	// de style.css lo descarta el procesador de editor-styles, así que la fuente
	// no llega al canvas (iframe). Cargarla directo asegura los glifos dentro del
	// editor (p. ej. el selector de iconos del bloque proyecto-niveles).
	add_editor_style( 'assets/css/fontawesome.css' );
	add_editor_style( 'https://fonts.googleapis.com/css2?family=Aboreto&family=Montserrat:wght@300;400;500;600;700&display=swap' );
	add_editor_style( 'assets/css/respira-brand.css' );
} );

// Font Awesome dentro del panel del editor: los InspectorControls se renderizan
// FUERA del canvas (iframe), por lo que add_editor_style no los alcanza. Encolar
// la hoja permite previsualizar los iconos en los controles de los bloques.
add_action( 'enqueue_block_editor_assets', function (): void {
	$rel = '/assets/css/fontawesome.css';
	$dir = get_template_directory();
	$ver = file_exists( $dir . $rel ) ? (string) filemtime( $dir . $rel ) : '1.0.0';
	wp_enqueue_style( 'respira-fontawesome-editor', get_template_directory_uri() . $rel, [], $ver );
} );

// ---------------------------------------------------------------------------
// 6. Registro automatico de bloques compilados (build/blocks/*/block.json)
// ---------------------------------------------------------------------------
add_action( 'init', function (): void {
	$build_dir = get_template_directory() . '/build/blocks';

	if ( ! is_dir( $build_dir ) ) {
		return;
	}

	foreach ( glob( $build_dir . '/*/block.json' ) as $block_json ) {
		register_block_type( dirname( $block_json ) );
	}
} );

// ---------------------------------------------------------------------------
// 7. Categoria de bloques "Respira" (agrupa los bloques de la plantilla)
// ---------------------------------------------------------------------------
add_filter( 'block_categories_all', function ( array $categories ): array {
	array_unshift( $categories, [
		'slug'  => 'respira',
		'title' => __( 'Respira', 'respira' ),
		'icon'  => null,
	] );
	return $categories;
} );

// ---------------------------------------------------------------------------
// 8. Mostrar sitio en construcción
// ---------------------------------------------------------------------------
/*
add_action('template_redirect', function () {
    // Los administradores ven el sitio normal
    if (current_user_can('manage_options') || is_user_logged_in()) {
        return;
    }
    // No bloquear el login ni el admin
    if (is_admin() || $GLOBALS['pagenow'] === 'wp-login.php') {
        return;
    }

    status_header(503);
    header('Retry-After: 3600');
    nocache_headers();

    wp_die(
        '<h1>Sitio en construcción</h1><p>Estamos trabajando en algo nuevo. Volvé pronto.</p>',
        'En construcción',
        ['response' => 503]
    );
});
*/

// ---------------------------------------------------------------------------
// 9. Solicitar contraseña
// ---------------------------------------------------------------------------
add_action('template_redirect', function () {

    // --- CONFIGURACIÓN ---
    $clave_acceso = 'buzz)=respira#3s5';          // cambiá esto
    $nombre_cookie = 'sitio_preview';
    $dias_validez  = 7;                   // cuánto dura el acceso

    // 1. Los administradores logueados siempre ven el sitio
    if (current_user_can('manage_options') || is_user_logged_in()) {
        return;
    }

    // 2. No interferir con el login ni el admin
    if (is_admin() || $GLOBALS['pagenow'] === 'wp-login.php') {
        return;
    }

    // 3. Procesar el envío de la contraseña
    if (isset($_POST['preview_pass'])) {
        if (hash_equals($clave_acceso, (string) $_POST['preview_pass'])) {
            setcookie(
                $nombre_cookie,
                hash('sha256', $clave_acceso),
                time() + ($dias_validez * DAY_IN_SECONDS),
                COOKIEPATH ?: '/',
                COOKIE_DOMAIN,
                is_ssl(),
                true // HttpOnly
            );
            wp_safe_redirect(home_url());
            exit;
        } else {
            $error = 'Contraseña incorrecta.';
        }
    }

    // 4. Si ya tiene la cookie válida, dejarlo pasar
    if (
        isset($_COOKIE[$nombre_cookie]) &&
        hash_equals(hash('sha256', $clave_acceso), $_COOKIE[$nombre_cookie])
    ) {
        return;
    }

    // 5. Mostrar la pantalla de construcción con el formulario
    status_header(503);
    header('Retry-After: 3600');
    nocache_headers();

    $msg_error = !empty($error)
        ? '<p style="color:#c0392b;margin:0 0 1rem;">' . esc_html($error) . '</p>'
        : '';

    $html = '
    <div style="font-family:system-ui,sans-serif;max-width:420px;margin:15vh auto;text-align:center;padding:0 1rem;">
        <h1 style="font-size:1.6rem;margin-bottom:.5rem;">Sitio en construcción</h1>
        <p style="color:#666;margin-bottom:2rem;">Estamos trabajando en algo nuevo. Si tenés acceso, ingresá la contraseña.</p>
        ' . $msg_error . '
        <form method="post" action="">
            <input type="password" name="preview_pass" placeholder="Contraseña"
                style="width:100%;padding:.7rem;border:1px solid #ccc;border-radius:6px;margin-bottom:.8rem;font-size:1rem;">
            <button type="submit"
                style="width:100%;padding:.7rem;border:0;border-radius:6px;background:#111;color:#fff;font-size:1rem;cursor:pointer;">
                Entrar
            </button>
        </form>
    </div>';

    wp_die($html, 'En construcción', ['response' => 503]);
});