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
	}

	/**
	 * Campos del Personalizador. Cada uno = un theme_mod editable.
	 *
	 * @return array<string, array{label:string,default:string,type:string,sanitize:string}>
	 */
	private function fields(): array {
		return [
			'respira_cta_label'      => [ 'label' => __( 'Botón header — texto', 'respira' ),   'default' => 'Get In Touch', 'type' => 'text',  'sanitize' => 'sanitize_text_field' ],
			'respira_cta_url'        => [ 'label' => __( 'Botón header — enlace', 'respira' ),   'default' => '#',            'type' => 'url',   'sanitize' => 'esc_url_raw' ],
			'respira_address'        => [ 'label' => __( 'Dirección', 'respira' ),               'default' => '1901 Thornridge Cir. Shiloh, Hawaii 81063', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_email'          => [ 'label' => __( 'Email', 'respira' ),                   'default' => 'needhelp@company.com', 'type' => 'email', 'sanitize' => 'sanitize_email' ],
			'respira_phone'          => [ 'label' => __( 'Teléfono', 'respira' ),                'default' => '+ (123) 456-7890', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_hours'          => [ 'label' => __( 'Horario', 'respira' ),                 'default' => 'Mon - Fri: 09.00am - 10.00 pm', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
			'respira_footer_tagline' => [ 'label' => __( 'Footer — tagline', 'respira' ),        'default' => 'Get the latest inspiration & insights', 'type' => 'text', 'sanitize' => 'sanitize_text_field' ],
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
	}
}
