<?php
/**
 * Custom Post Types + meta boxes (sin ACF) para contenido dinámico:
 * Proyectos, Equipo y Testimonios. Los bloques los consumen vía render.php.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

use WP_Post;

class Content {

	/** Prefijo de las meta keys. */
	public const PREFIX = '_respira_';

	public function __construct() {
		add_action( 'init', [ $this, 'register_taxonomies' ], 9 );
		add_action( 'init', [ $this, 'register_post_types' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_meta_boxes' ] );
		add_action( 'save_post', [ $this, 'save_meta' ], 10, 2 );
	}

	/**
	 * Taxonomías personalizadas.
	 */
	public function register_taxonomies(): void {
		register_taxonomy( 'proyecto_categoria', [ 'proyecto' ], [
			'labels'            => [
				'name'          => __( 'Categorías de proyecto', 'respira' ),
				'singular_name' => __( 'Categoría de proyecto', 'respira' ),
				'menu_name'     => __( 'Categorías', 'respira' ),
				'all_items'     => __( 'Todas las categorías', 'respira' ),
				'add_new_item'  => __( 'Añadir categoría', 'respira' ),
				'edit_item'     => __( 'Editar categoría', 'respira' ),
				'search_items'  => __( 'Buscar categorías', 'respira' ),
			],
			'hierarchical'      => true,
			'public'            => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => [ 'slug' => 'tipo-proyecto' ],
		] );
	}

	/**
	 * Campos meta por tipo de contenido.
	 *
	 * @return array<string, array<string, array{label:string,type:string}>>
	 */
	public function fields(): array {
		return [
			'proyecto'   => [
				'subtitle' => [ 'label' => __( 'Subtítulo / categoría', 'respira' ), 'type' => 'text' ],
				'date'     => [ 'label' => __( 'Fecha', 'respira' ), 'type' => 'text' ],
				'client'   => [ 'label' => __( 'Cliente', 'respira' ), 'type' => 'text' ],
				'website'  => [ 'label' => __( 'Sitio web', 'respira' ), 'type' => 'text' ],
				'location' => [ 'label' => __( 'Ubicación', 'respira' ), 'type' => 'text' ],
				'value'    => [ 'label' => __( 'Valor', 'respira' ), 'type' => 'text' ],
			],
			'miembro'    => [
				'designation' => [ 'label' => __( 'Cargo', 'respira' ), 'type' => 'text' ],
				'facebook'    => [ 'label' => __( 'Facebook (URL)', 'respira' ), 'type' => 'url' ],
				'twitter'     => [ 'label' => __( 'Twitter / X (URL)', 'respira' ), 'type' => 'url' ],
				'instagram'   => [ 'label' => __( 'Instagram (URL)', 'respira' ), 'type' => 'url' ],
			],
			'testimonio' => [
				'designation' => [ 'label' => __( 'Cargo / empresa', 'respira' ), 'type' => 'text' ],
				'rating'      => [ 'label' => __( 'Estrellas (1-5)', 'respira' ), 'type' => 'number' ],
			],
			'amenidades' => [
				'icon' => [ 'label' => __( 'Ícono (clase flaticon/FontAwesome)', 'respira' ), 'type' => 'text' ],
			],
		];
	}

	public function register_post_types(): void {
		register_post_type( 'proyecto', [
			'labels'       => $this->labels( __( 'Proyecto', 'respira' ), __( 'Proyectos', 'respira' ) ),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-portfolio',
			'menu_position'=> 20,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'proyectos' ],
		] );

		register_post_type( 'miembro', [
			'labels'       => $this->labels( __( 'Miembro', 'respira' ), __( 'Equipo', 'respira' ) ),
			'public'       => true,
			'has_archive'  => false,
			'menu_icon'    => 'dashicons-groups',
			'menu_position'=> 21,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'equipo' ],
		] );

		register_post_type( 'testimonio', [
			'labels'       => $this->labels( __( 'Testimonio', 'respira' ), __( 'Testimonios', 'respira' ) ),
			'public'       => true,
			'has_archive'  => false,
			'menu_icon'    => 'dashicons-format-quote',
			'menu_position'=> 22,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'testimonios' ],
		] );

		register_post_type( 'amenidades', [
			'labels'       => $this->labels( __( 'Amenidad', 'respira' ), __( 'Amenidades', 'respira' ) ),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-screenoptions',
			'menu_position'=> 23,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'amenidades' ],
		] );

		// Flush de reglas de reescritura una sola vez tras registrar los CPTs,
		// para que sus URLs (/proyectos/, /amenidades/...) funcionen sin pasos manuales.
		if ( '4' !== get_option( 'respira_rewrite_version' ) ) {
			flush_rewrite_rules( false );
			update_option( 'respira_rewrite_version', '4' );
		}
	}

	/**
	 * Genera el set de labels de un CPT.
	 */
	private function labels( string $singular, string $plural ): array {
		return [
			'name'          => $plural,
			'singular_name' => $singular,
			'add_new'       => __( 'Añadir nuevo', 'respira' ),
			'add_new_item'  => sprintf( __( 'Añadir %s', 'respira' ), $singular ),
			'edit_item'     => sprintf( __( 'Editar %s', 'respira' ), $singular ),
			'new_item'      => sprintf( __( 'Nuevo %s', 'respira' ), $singular ),
			'view_item'     => sprintf( __( 'Ver %s', 'respira' ), $singular ),
			'search_items'  => sprintf( __( 'Buscar %s', 'respira' ), $plural ),
			'not_found'     => __( 'No se encontró nada', 'respira' ),
			'menu_name'     => $plural,
		];
	}

	public function add_meta_boxes(): void {
		foreach ( array_keys( $this->fields() ) as $cpt ) {
			add_meta_box(
				'respira_details_' . $cpt,
				__( 'Detalles', 'respira' ),
				[ $this, 'render_meta_box' ],
				$cpt,
				'normal',
				'high'
			);
		}
	}

	public function render_meta_box( WP_Post $post ): void {
		$fields = $this->fields()[ $post->post_type ] ?? [];
		if ( ! $fields ) {
			return;
		}
		wp_nonce_field( 'respira_save_meta', 'respira_meta_nonce' );

		echo '<div style="display:grid;gap:12px;max-width:640px;">';
		foreach ( $fields as $key => $cfg ) {
			$value = (string) get_post_meta( $post->ID, self::PREFIX . $key, true );
			$id    = 'respira_' . $key;
			printf( '<p style="margin:0;"><label for="%s" style="display:block;font-weight:600;margin-bottom:4px;">%s</label>', esc_attr( $id ), esc_html( $cfg['label'] ) );
			if ( 'number' === $cfg['type'] ) {
				printf(
					'<input type="number" min="0" max="5" step="1" id="%s" name="%s" value="%s" class="small-text">',
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( $value )
				);
			} else {
				printf(
					'<input type="%s" id="%s" name="%s" value="%s" class="widefat">',
					esc_attr( 'url' === $cfg['type'] ? 'url' : 'text' ),
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( $value )
				);
			}
			echo '</p>';
		}
		echo '</div>';
	}

	public function save_meta( int $post_id, WP_Post $post ): void {
		$fields = $this->fields()[ $post->post_type ] ?? [];
		if ( ! $fields ) {
			return;
		}
		if ( ! isset( $_POST['respira_meta_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['respira_meta_nonce'] ), 'respira_save_meta' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		foreach ( $fields as $key => $cfg ) {
			$meta_key = self::PREFIX . $key;
			$raw      = $_POST[ $meta_key ] ?? '';
			if ( 'number' === $cfg['type'] ) {
				$clean = (string) max( 0, min( 5, (int) $raw ) );
			} elseif ( 'url' === $cfg['type'] ) {
				$clean = esc_url_raw( wp_unslash( (string) $raw ) );
			} else {
				$clean = sanitize_text_field( wp_unslash( (string) $raw ) );
			}
			update_post_meta( $post_id, $meta_key, $clean );
		}
	}
}
