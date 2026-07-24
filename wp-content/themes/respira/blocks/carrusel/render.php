<?php
/**
 * Render del bloque respira/carrusel (carrusel de imágenes genérico con Swiper).
 *
 * Cada slide es una imagen de fondo con texto opcional (subtítulo, título,
 * texto y botón). El overlay y el tiempo entre slides son configurables.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$tpl_uri = get_template_directory_uri();

// Resuelve URLs: deja pasar absolutas (http / //) y rutas raíz; prefija las
// relativas con la carpeta de imágenes del tema.
$resolve = static function ( string $url ) use ( $tpl_uri ): string {
	if ( '' === $url ) {
		return '';
	}
	if ( preg_match( '#^(https?:)?//#', $url ) || str_starts_with( $url, '/' ) ) {
		return $url;
	}
	return $tpl_uri . '/assets/images/' . ltrim( $url, '/' );
};

$items = [];
foreach ( (array) ( $attributes['items'] ?? [] ) as $slide ) {
	$id  = (int) ( $slide['bgImageId'] ?? 0 );
	$url = (string) ( $slide['bgImageUrl'] ?? '' );

	// Preferí la URL "large" del adjunto (mejor peso); cae a la URL guardada.
	$bg = $id ? (string) wp_get_attachment_image_url( $id, 'large' ) : $resolve( $url );
	if ( '' === $bg ) {
		$bg = $resolve( $url );
	}

	$alt = (string) ( $slide['bgImageAlt'] ?? '' );
	if ( '' === $alt && $id ) {
		$alt = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
	}

	$title = (string) ( $slide['title'] ?? '' );

	// Skip slides sin imagen y sin título (item vacío del repeater).
	if ( '' === $bg && '' === $title ) {
		continue;
	}

	$items[] = [
		'bg'      => $bg,
		'bgAlt'   => $alt,
		'title'   => $title,
		'hasText' => ( '' !== $title ),
	];
}

// Tiempo entre slides: el editor lo configura en segundos; Swiper lo espera en ms.
$autoplay_delay = max( 1, (int) ( $attributes['autoplayDelay'] ?? 6 ) ) * 1000;
$height         = max( 200, (int) ( $attributes['height'] ?? 600 ) );
$height_tablet  = max( 150, (int) ( $attributes['heightTablet'] ?? 500 ) );
$height_mobile  = max( 150, (int) ( $attributes['heightMobile'] ?? 400 ) );
$align          = ( 'left' === ( $attributes['contentAlign'] ?? 'center' ) ) ? 'left' : 'center';
$show_overlay   = (bool) ( $attributes['showOverlay'] ?? true );
$overlay_alpha  = max( 0, min( 90, (int) ( $attributes['overlayOpacity'] ?? 45 ) ) ) / 100;

$context                   = Timber::context();
$context['items']          = $items;
$context['autoplay_delay'] = $autoplay_delay;
$context['height']         = $height;
$context['height_tablet']  = $height_tablet;
$context['height_mobile']  = $height_mobile;
$context['show_overlay']   = $show_overlay;
$context['overlay_alpha']  = $overlay_alpha;
$context['show_arrows']    = (bool) ( $attributes['showArrows'] ?? true );
$context['show_dots']      = (bool) ( $attributes['showDots'] ?? true );

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-carrusel align-' . $align,
] );

Timber::render( 'blocks/carrusel.twig', $context );
