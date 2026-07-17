<?php
/**
 * Controles del Personalizador (Apariencia → Personalizar) para los datos
 * editables del header/footer que consume src/Site.php (options.*).
 *
 * Los IDs coinciden con los theme_mods que lee Site.php; los defaults también,
 * para preservar el comportamiento actual.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

use WP_Customize_Manager;

class Customizer {

	public function __construct() {
		add_action( 'customize_register', [ $this, 'register' ] );
		add_action( 'customize_controls_enqueue_scripts', [ $this, 'customize_controls_assets' ] );
	}

	/**
	 * Campos del Personalizador. Cada uno = un theme_mod editable.
	 *
	 * @return array<string, array{label:string,default:string|bool,type:string,sanitize:string}>
	 */
	private function fields(): array {
		return [
			'respira_show_breadcrumbs' => [ 'label' => __( 'Mostrar migas de pan (breadcrumbs) en páginas internas', 'respira' ), 'default' => false, 'type' => 'checkbox', 'sanitize' => 'wp_validate_boolean' ],
			'respira_cta_label'      => [ 'label' => __( 'Botón header — texto', 'respira' ),   'default' => 'Get In Touch', 'type' => 'text',  'sanitize' => 'sanitize_text_field' ],
			'respira_cta_url'        => [ 'label' => __( 'Botón header — enlace', 'respira' ),   'default' => '#',            'type' => 'url',   'sanitize' => 'esc_url_raw' ],
			'respira_address'        => [ 'label' => __( 'Dirección', 'respira' ),               'default' => '1901 Thornridge Cir. Shiloh, Hawaii 81063', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_email'          => [ 'label' => __( 'Email', 'respira' ),                   'default' => 'needhelp@company.com', 'type' => 'email', 'sanitize' => 'sanitize_email' ],
			'respira_phone'          => [ 'label' => __( 'Teléfono', 'respira' ),                'default' => '+ (123) 456-7890', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_hours'          => [ 'label' => __( 'Horario', 'respira' ),                 'default' => 'Mon - Fri: 09.00am - 10.00 pm', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_footer_tagline' => [ 'label' => __( 'Footer — tagline', 'respira' ),        'default' => 'Get the latest inspiration & insights', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_whatsapp'       => [ 'label' => __( 'WhatsApp flotante — número o enlace', 'respira' ), 'default' => '', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_whatsapp_msg'   => [ 'label' => __( 'WhatsApp — mensaje predeterminado (botón flotante y bloques contacto/faq)', 'respira' ), 'default' => '', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
		];
	}

	public function register( WP_Customize_Manager $wp_customize ): void {
		$wp_customize->add_section( 'respira_general', [
			'title'       => __( 'Respira — Datos del sitio', 'respira' ),
			'description' => __( 'Botón del header, datos de contacto y textos del header/footer.', 'respira' ),
			'priority'    => 30,
		] );

		foreach ( $this->fields() as $id => $cfg ) {
			$wp_customize->add_setting( $id, [
				'default'           => $cfg['default'],
				'type'              => 'theme_mod',
				'sanitize_callback' => $cfg['sanitize'],
				'transport'         => 'refresh',
			] );

			$wp_customize->add_control( $id, [
				'label'   => $cfg['label'],
				'section' => 'respira_general',
				'type'    => $cfg['type'],
			] );
		}

		// Footer: dos imagenes pequenas a la derecha de los enlaces.
		$footer_images = [
			'respira_footer_image_1' => __( 'Footer — imagen 1 (a la derecha de los enlaces)', 'respira' ),
			'respira_footer_image_2' => __( 'Footer — imagen 2 (a la derecha de los enlaces)', 'respira' ),
		];

		foreach ( $footer_images as $id => $label ) {
			$wp_customize->add_setting( $id, [
				'default'           => '',
				'type'              => 'theme_mod',
				'sanitize_callback' => 'esc_url_raw',
				'transport'         => 'refresh',
			] );

			$wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, $id, [
				'label'   => $label,
				'section' => 'respira_general',
			] ) );
		}

		// Amenidades (listado): imagen del banner superior (page-title).
		$wp_customize->add_section( 'respira_amenidades', [
			'title'       => __( 'Respira — Amenidades (listado)', 'respira' ),
			'description' => __( 'Imagen del banner superior en la página que lista las amenidades.', 'respira' ),
			'priority'    => 31,
		] );

		$wp_customize->add_setting( 'respira_amenidades_banner', [
			'default'           => '',
			'type'              => 'theme_mod',
			'sanitize_callback' => 'esc_url_raw',
			'transport'         => 'refresh',
		] );

		$wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, 'respira_amenidades_banner', [
			'label'       => __( 'Banner del listado de amenidades', 'respira' ),
			'description' => __( 'Si se deja vacío se usa la imagen por defecto de la plantilla.', 'respira' ),
			'section'     => 'respira_amenidades',
		] ) );

		// Redes sociales (repetidor: icono + enlace). Se muestran solo los iconos
		// en el footer y en el header (menú móvil). Se guarda como JSON.
		require_once __DIR__ . '/Social_Repeater_Control.php';

		$socials_default = (string) wp_json_encode( [
			[ 'icon' => 'fab fa-whatsapp', 'link' => '#' ],
			[ 'icon' => 'fas fa-envelope', 'link' => '#' ],
			[ 'icon' => 'fab fa-facebook-f', 'link' => '#' ],
			[ 'icon' => 'fab fa-instagram', 'link' => '#' ],
		] );

		$wp_customize->add_setting( 'respira_socials', [
			'default'           => $socials_default,
			'type'              => 'theme_mod',
			'sanitize_callback' => [ $this, 'sanitize_socials' ],
			'transport'         => 'refresh',
		] );

		$wp_customize->add_control( new Social_Repeater_Control( $wp_customize, 'respira_socials', [
			'label'       => __( 'Redes sociales (footer y header)', 'respira' ),
			'description' => __( 'Cada red muestra solo su icono. Definí el icono y el enlace.', 'respira' ),
			'section'     => 'respira_general',
		] ) );
	}

	/**
	 * Sanitiza el JSON del repetidor de redes: valida cada fila (icono permitido
	 * + URL) y devuelve un JSON limpio.
	 *
	 * @param mixed $value
	 * @return string
	 */
	public function sanitize_socials( $value ): string {
		$decoded = json_decode( (string) $value, true );
		if ( ! is_array( $decoded ) ) {
			return '[]';
		}
		$allowed = Social_Repeater_Control::icon_options();
		$clean   = [];
		foreach ( $decoded as $row ) {
			$icon = isset( $row['icon'] ) ? sanitize_text_field( (string) $row['icon'] ) : '';
			$link = isset( $row['link'] ) ? esc_url_raw( (string) $row['link'] ) : '';
			if ( ! isset( $allowed[ $icon ] ) || ( '' === $link ) ) {
				continue;
			}
			$clean[] = [ 'icon' => $icon, 'link' => $link ];
		}
		return (string) wp_json_encode( $clean );
	}

	/**
	 * Script (delegado) que maneja el repetidor de redes en el Personalizador.
	 */
	public function customize_controls_assets(): void {
		$js = <<<'JS'
( function ( $ ) {
	function controlOf( el ) { return el.closest( '.customize-control' ); }
	function sync( control ) {
		var data = [];
		control.querySelectorAll( '.respira-socials-row' ).forEach( function ( row ) {
			var icon = row.querySelector( '.r-icon' ).value;
			var link = row.querySelector( '.r-link' ).value;
			if ( icon && link ) { data.push( { icon: icon, link: link } ); }
		} );
		var hidden = control.querySelector( '.respira-socials-value' );
		hidden.value = JSON.stringify( data );
		$( hidden ).trigger( 'change' );
	}
	// Reordenar con flechas: el orden de las filas en el DOM es el que sync()
	// persiste, así que Site.php respeta ese orden.
	$( document ).on( 'click', '.respira-socials-add', function ( e ) {
		e.preventDefault();
		var control = controlOf( this );
		var tpl = control.querySelector( '.respira-socials-tpl' ).innerHTML;
		control.querySelector( '.respira-socials-rows' ).insertAdjacentHTML( 'beforeend', tpl );
		sync( control );
	} );
	$( document ).on( 'click', '.respira-socials-row .r-del', function ( e ) {
		e.preventDefault();
		var control = controlOf( this );
		this.closest( '.respira-socials-row' ).remove();
		sync( control );
	} );
	$( document ).on( 'click', '.respira-socials-row .r-up', function ( e ) {
		e.preventDefault();
		var row = this.closest( '.respira-socials-row' );
		var prev = row.previousElementSibling;
		if ( prev ) {
			row.parentNode.insertBefore( row, prev );
			sync( controlOf( this ) );
		}
	} );
	$( document ).on( 'click', '.respira-socials-row .r-down', function ( e ) {
		e.preventDefault();
		var row = this.closest( '.respira-socials-row' );
		var next = row.nextElementSibling;
		if ( next ) {
			row.parentNode.insertBefore( next, row );
			sync( controlOf( this ) );
		}
	} );
	$( document ).on( 'change', '.respira-socials-row .r-icon, .respira-socials-row .r-link', function () {
		sync( controlOf( this ) );
	} );
} )( jQuery );
JS;
		wp_add_inline_script( 'customize-controls', $js );
	}
}
