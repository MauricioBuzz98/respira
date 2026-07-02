<?php
/**
 * Herramienta de migración de CONFIGURACIÓN del sitio (Herramientas → Respira
 * Migración). Exporta/importa los theme_mods del Customizer + una lista corta
 * de opciones seguras, como un archivo JSON.
 *
 * Pensada para el flujo de deploy: subir el .zip del sitio (código + uploads,
 * sin wp-config) y luego, en producción, importar este JSON para replicar la
 * configuración del Customizer sin cargar la base de datos a mano.
 *
 * Qué NO cubre (a propósito): páginas, posts, CPTs, menús y medios → esos se
 * migran con Herramientas → Exportar / Importar nativo de WordPress (WXR), que
 * reasigna IDs y remapea imágenes destacadas de forma segura.
 *
 * Seguridad: solo administradores (manage_options), con nonce en cada acción.
 * En import se reemplaza la URL del sitio de origen por la de destino (para que
 * las imágenes guardadas como URL absoluta funcionen en prod) y se omiten los
 * mods dependientes de IDs (p. ej. nav_menu_locations), que no son portables.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

class Migration {

	private const PAGE_SLUG   = 'respira-migracion';
	private const CAP         = 'manage_options';
	private const NONCE_EXP   = 'respira_export_config';
	private const NONCE_IMP   = 'respira_import_config';
	private const FORMAT      = 2; // versión del formato del JSON.
	private const MAX_BYTES   = 5242880; // 5 MB.

	/** theme_mods que NO se importan por depender de IDs del sitio de origen. */
	private const MOD_BLACKLIST = [
		'nav_menu_locations',  // ubicaciones de menú (IDs de términos, no portables)
		'custom_css_post_id',  // ID del post de CSS adicional
		'sidebars_widgets',    // widgets (IDs)
	];

	/** Opciones seguras (independientes de IDs) que se incluyen en el paquete. */
	private const OPTION_WHITELIST = [
		'blogname',
		'blogdescription',
		'timezone_string',
		'gmt_offset',
		'date_format',
		'time_format',
		'start_of_week',
	];

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'register_page' ] );
		add_action( 'admin_post_respira_export_config', [ $this, 'handle_export' ] );
		add_action( 'admin_post_respira_import_config', [ $this, 'handle_import' ] );
	}

	public function register_page(): void {
		add_management_page(
			__( 'Respira — Migración', 'respira' ),
			__( 'Respira — Migración', 'respira' ),
			self::CAP,
			self::PAGE_SLUG,
			[ $this, 'render_page' ]
		);
	}

	// ---------------------------------------------------------------------
	// Vista
	// ---------------------------------------------------------------------

	public function render_page(): void {
		if ( ! current_user_can( self::CAP ) ) {
			return;
		}

		$notice = isset( $_GET['respira_msg'] ) ? sanitize_key( wp_unslash( $_GET['respira_msg'] ) ) : '';
		$detail = isset( $_GET['respira_detail'] ) ? sanitize_text_field( wp_unslash( $_GET['respira_detail'] ) ) : '';

		echo '<div class="wrap">';
		echo '<h1>' . esc_html__( 'Respira — Migración de configuración', 'respira' ) . '</h1>';

		if ( 'imported' === $notice ) {
			echo '<div class="notice notice-success is-dismissible"><p>'
				. esc_html__( 'Configuración importada correctamente.', 'respira' )
				. ( $detail ? ' ' . esc_html( $detail ) : '' )
				. '</p></div>';
		} elseif ( '' !== $notice ) {
			echo '<div class="notice notice-error is-dismissible"><p>'
				. esc_html( $this->error_text( $notice ) )
				. ( $detail ? ' ' . esc_html( $detail ) : '' )
				. '</p></div>';
		}

		// --- Exportar ----------------------------------------------------
		echo '<div class="card" style="max-width:820px;margin-top:20px;">';
		echo '<h2>' . esc_html__( '1. Exportar configuración (sitio de origen)', 'respira' ) . '</h2>';
		echo '<p>' . esc_html__( 'Descarga un archivo JSON con la configuración del Customizer (botón del header, datos de contacto, redes, imágenes del footer, banner de amenidades, etc.) y algunas opciones generales del sitio.', 'respira' ) . '</p>';
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		echo '<input type="hidden" name="action" value="respira_export_config">';
		wp_nonce_field( self::NONCE_EXP );
		submit_button( __( 'Descargar configuración (.json)', 'respira' ), 'primary', 'submit', false );
		echo '</form>';
		echo '</div>';

		// --- Importar ----------------------------------------------------
		echo '<div class="card" style="max-width:820px;margin-top:20px;">';
		echo '<h2>' . esc_html__( '2. Importar configuración (sitio de destino / producción)', 'respira' ) . '</h2>';
		echo '<p>' . esc_html__( 'Subí el archivo JSON exportado desde el otro entorno. Se sobrescriben las opciones incluidas en el archivo; el resto queda intacto. Las URLs del sitio de origen se reemplazan automáticamente por las de este sitio.', 'respira' ) . '</p>';
		echo '<p><strong>' . esc_html__( 'Antes de importar', 'respira' ) . ':</strong> ' . esc_html__( 'subí el .zip del sitio (código + uploads) para que las imágenes existan, y migrá páginas/posts con Herramientas → Importar (WordPress). Este paso NO toca menús ni contenido.', 'respira' ) . '</p>';
		echo '<form method="post" enctype="multipart/form-data" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
		echo '<input type="hidden" name="action" value="respira_import_config">';
		wp_nonce_field( self::NONCE_IMP );
		echo '<p><input type="file" name="respira_config_file" accept="application/json,.json" required></p>';
		echo '<p><label><input type="checkbox" name="respira_confirm" value="1" required> '
			. esc_html__( 'Entiendo que esto sobrescribe la configuración del sitio con la del archivo.', 'respira' )
			. '</label></p>';
		submit_button( __( 'Importar configuración', 'respira' ), 'primary', 'submit', false );
		echo '</form>';
		echo '</div>';

		echo '</div>';
	}

	private function error_text( string $code ): string {
		$map = [
			'nonce'    => __( 'La verificación de seguridad falló. Recargá e intentá de nuevo.', 'respira' ),
			'cap'      => __( 'No tenés permisos para esta acción.', 'respira' ),
			'upload'   => __( 'Hubo un problema al subir el archivo.', 'respira' ),
			'toobig'   => __( 'El archivo es demasiado grande.', 'respira' ),
			'json'     => __( 'El archivo no es un JSON válido.', 'respira' ),
			'format'   => __( 'El archivo no es un export de configuración de Respira.', 'respira' ),
			'noconfirm'=> __( 'Marcá la casilla de confirmación para continuar.', 'respira' ),
		];
		return $map[ $code ] ?? __( 'Ocurrió un error.', 'respira' );
	}

	// ---------------------------------------------------------------------
	// Exportar
	// ---------------------------------------------------------------------

	public function handle_export(): void {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( esc_html__( 'Sin permisos.', 'respira' ) );
		}
		check_admin_referer( self::NONCE_EXP );

		$mods = get_theme_mods();
		if ( ! is_array( $mods ) ) {
			$mods = [];
		}
		// Quita los mods no portables.
		foreach ( self::MOD_BLACKLIST as $key ) {
			unset( $mods[ $key ] );
		}

		$options = [];
		foreach ( self::OPTION_WHITELIST as $name ) {
			$value = get_option( $name, null );
			if ( null !== $value ) {
				$options[ $name ] = $value;
			}
		}

		$payload = [
			'_respira_migration' => true,
			'format'             => self::FORMAT,
			'exported_at'        => current_time( 'mysql' ),
			'source_url'         => home_url(),
			'theme'              => (string) get_option( 'stylesheet' ),
			'theme_mods'         => $mods,
			'options'            => $options,
		];

		$json     = (string) wp_json_encode( $payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
		$filename = 'respira-config-' . gmdate( 'Ymd-His' ) . '.json';

		nocache_headers();
		header( 'Content-Type: application/json; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
		header( 'Content-Length: ' . strlen( $json ) );
		echo $json; // phpcs:ignore WordPress.Security.EscapeOutput -- JSON de descarga.
		exit;
	}

	// ---------------------------------------------------------------------
	// Importar
	// ---------------------------------------------------------------------

	public function handle_import(): void {
		if ( ! current_user_can( self::CAP ) ) {
			$this->redirect_back( 'cap' );
		}
		check_admin_referer( self::NONCE_IMP );

		if ( empty( $_POST['respira_confirm'] ) ) {
			$this->redirect_back( 'noconfirm' );
		}

		if ( empty( $_FILES['respira_config_file'] ) || ! isset( $_FILES['respira_config_file']['error'] ) ) {
			$this->redirect_back( 'upload' );
		}

		$file = $_FILES['respira_config_file']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- se valida abajo.
		if ( UPLOAD_ERR_OK !== (int) $file['error'] ) {
			$this->redirect_back( 'upload' );
		}
		if ( (int) $file['size'] > self::MAX_BYTES ) {
			$this->redirect_back( 'toobig' );
		}

		$tmp = isset( $file['tmp_name'] ) ? (string) $file['tmp_name'] : '';
		if ( '' === $tmp || ! is_uploaded_file( $tmp ) ) {
			$this->redirect_back( 'upload' );
		}

		$raw = (string) file_get_contents( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data = json_decode( $raw, true );
		if ( ! is_array( $data ) ) {
			$this->redirect_back( 'json' );
		}
		if ( empty( $data['_respira_migration'] ) ) {
			$this->redirect_back( 'format' );
		}

		// Reemplazo de URL: origen -> este sitio (para imágenes/links absolutos).
		$from = isset( $data['source_url'] ) ? untrailingslashit( (string) $data['source_url'] ) : '';
		$to   = untrailingslashit( home_url() );

		// --- theme_mods --------------------------------------------------
		$mods_applied = 0;
		if ( ! empty( $data['theme_mods'] ) && is_array( $data['theme_mods'] ) ) {
			foreach ( $data['theme_mods'] as $key => $value ) {
				$key = (string) $key;
				if ( is_numeric( $key ) || in_array( $key, self::MOD_BLACKLIST, true ) ) {
					continue;
				}
				if ( '' !== $from ) {
					$value = $this->replace_url( $value, $from, $to );
				}
				set_theme_mod( $key, $value );
				++$mods_applied;
			}
		}

		// --- options (solo whitelist) ------------------------------------
		$opts_applied = 0;
		if ( ! empty( $data['options'] ) && is_array( $data['options'] ) ) {
			foreach ( $data['options'] as $name => $value ) {
				$name = (string) $name;
				if ( ! in_array( $name, self::OPTION_WHITELIST, true ) ) {
					continue;
				}
				if ( '' !== $from ) {
					$value = $this->replace_url( $value, $from, $to );
				}
				update_option( $name, $value );
				++$opts_applied;
			}
		}

		$detail = sprintf(
			/* translators: 1: cantidad de ajustes del Customizer, 2: cantidad de opciones */
			__( '%1$d ajustes del Customizer y %2$d opciones aplicadas.', 'respira' ),
			$mods_applied,
			$opts_applied
		);
		$this->redirect_back( 'imported', $detail );
	}

	/**
	 * Reemplaza recursivamente la URL de origen por la de destino en todos los
	 * strings (incluye valores dentro de arrays y de strings JSON como el de
	 * redes sociales).
	 *
	 * @param mixed  $value Valor del mod/opción.
	 * @param string $from  URL de origen (sin barra final).
	 * @param string $to    URL de destino (sin barra final).
	 * @return mixed
	 */
	private function replace_url( $value, string $from, string $to ) {
		if ( is_string( $value ) ) {
			return str_replace( $from, $to, $value );
		}
		if ( is_array( $value ) ) {
			foreach ( $value as $k => $v ) {
				$value[ $k ] = $this->replace_url( $v, $from, $to );
			}
		}
		return $value;
	}

	private function redirect_back( string $msg, string $detail = '' ): void {
		$args = [ 'page' => self::PAGE_SLUG, 'respira_msg' => $msg ];
		if ( '' !== $detail ) {
			$args['respira_detail'] = $detail;
		}
		wp_safe_redirect( add_query_arg( $args, admin_url( 'tools.php' ) ) );
		exit;
	}
}
