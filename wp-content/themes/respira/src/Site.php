<?php
/**
 * Clase Site de Timber: inyecta datos globales al contexto de todas las vistas Twig.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

use Timber\Site as TimberSite;
use Timber\Timber;

class Site extends TimberSite {

	public function __construct() {
		add_filter( 'timber/context', [ $this, 'add_to_context' ] );
		parent::__construct();
	}

	/**
	 * Variables disponibles en TODAS las plantillas Twig.
	 *
	 * @param array $context Contexto global de Timber.
	 * @return array
	 */
	public function add_to_context( array $context ): array {
		$context['site'] = $this;

		// Menus (devuelven null si no hay menu asignado a la ubicacion).
		$context['menu_primary'] = Timber::get_menu( 'primary' );
		$context['menu_footer']  = Timber::get_menu( 'footer' );

		// Tema (para construir rutas a assets en Twig: {{ theme.link }}/assets/...).
		$context['theme'] = $this->theme;

		// Logo personalizado (Apariencia > Personalizar). Null si no se ha definido.
		$logo_id              = (int) get_theme_mod( 'custom_logo' );
		$context['site_logo'] = $logo_id ? Timber::get_image( $logo_id ) : null;

		// Datos editables del header/footer (Personalizador). Se exponen como
		// variables para no llamar get_theme_mod() dentro de Twig.
		$phone                  = get_theme_mod( 'respira_phone', '+ (123) 456-7890' );
		$context['options']     = [
			'address'        => get_theme_mod( 'respira_address', '1901 Thornridge Cir. Shiloh, Hawaii 81063' ),
			'email'          => get_theme_mod( 'respira_email', 'needhelp@company.com' ),
			'phone'          => $phone,
			'phone_tel'      => preg_replace( '/[^0-9+]/', '', (string) $phone ),
			'hours'          => get_theme_mod( 'respira_hours', 'Mon - Fri: 09.00am - 10.00 pm' ),
			'cta_label'      => get_theme_mod( 'respira_cta_label', 'Get In Touch' ),
			'cta_url'        => get_theme_mod( 'respira_cta_url', '#' ),
			'footer_tagline' => get_theme_mod( 'respira_footer_tagline', 'Get the latest inspiration & insights' ),
			'footer_image_1' => get_theme_mod( 'respira_footer_image_1', '' ),
			'footer_image_2' => get_theme_mod( 'respira_footer_image_2', '' ),
			'socials'        => $this->socials(),
		];

		return $context;
	}

	/**
	 * Redes sociales (repetidor del Personalizador) como lista de [icon, link].
	 * Se usan en footer y header (solo icono, sin texto).
	 *
	 * @return array<int, array{icon:string,link:string}>
	 */
	private function socials(): array {
		$raw     = get_theme_mod( 'respira_socials', '' );
		$decoded = json_decode( (string) $raw, true );

		if ( ! is_array( $decoded ) || empty( $decoded ) ) {
			// Default: hasta que se configure desde el Personalizador.
			return [
				[ 'icon' => 'fab fa-whatsapp', 'link' => '#' ],
				[ 'icon' => 'fas fa-envelope', 'link' => '#' ],
				[ 'icon' => 'fab fa-facebook-f', 'link' => '#' ],
				[ 'icon' => 'fab fa-instagram', 'link' => '#' ],
			];
		}

		$out = [];
		foreach ( $decoded as $row ) {
			$icon = (string) ( $row['icon'] ?? '' );
			$link = (string) ( $row['link'] ?? '' );
			if ( '' !== $icon ) {
				$out[] = [ 'icon' => $icon, 'link' => $link ];
			}
		}
		return $out;
	}
}
