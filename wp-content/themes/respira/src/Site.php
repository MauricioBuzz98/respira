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
		// Enlaces legales de la barra inferior (politica de privacidad, terminos, etc.).
		$context['menu_legal']   = Timber::get_menu( 'legal' );

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
			'whatsapp_url'   => $this->whatsapp_url(),
			// Migas de pan (breadcrumbs) en páginas internas. Por defecto ocultas;
			// se muestran con el switch del Personalizador.
			'show_breadcrumbs' => (bool) get_theme_mod( 'respira_show_breadcrumbs', false ),
		];

		return $context;
	}

	/**
	 * Enlace del botón flotante de WhatsApp. El campo del Personalizador acepta
	 * un número (se arma el enlace wa.me) o un enlace completo (se usa tal cual).
	 * Devuelve '' si no está configurado (entonces el botón no se muestra).
	 */
	private function whatsapp_url(): string {
		$raw = trim( (string) get_theme_mod( 'respira_whatsapp', '' ) );
		if ( '' === $raw ) {
			return '';
		}

		// Si ya es un enlace, se respeta tal cual; si no, se interpreta como
		// número: solo dígitos y se arma el enlace wa.me.
		if ( preg_match( '#^https?://#i', $raw ) ) {
			$url = esc_url_raw( $raw );
		} else {
			$digits = preg_replace( '/\D/', '', $raw );
			if ( '' === $digits ) {
				return '';
			}
			$url = 'https://wa.me/' . $digits;
		}

		// Mensaje predeterminado (?text=): se agrega tanto si el campo es un
		// número como si es un enlace completo. Si el enlace ya trae su propio
		// text= se respeta y no se pisa.
		$msg = trim( (string) get_theme_mod( 'respira_whatsapp_msg', '' ) );
		if ( '' !== $msg && ! preg_match( '/[?&]text=/i', $url ) ) {
			$sep  = ( false === strpos( $url, '?' ) ) ? '?' : '&';
			$url .= $sep . 'text=' . rawurlencode( $msg );
		}

		return $url;
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
