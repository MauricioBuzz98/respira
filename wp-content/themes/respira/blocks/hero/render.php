<?php
/**
 * Render del bloque respira/hero (carrusel banner-section de Realest).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$tpl_uri = get_template_directory_uri();

// Resuelve URLs: deja pasar absolutas (http / //) y rutas raíz; prefija las
// relativas con la carpeta de imágenes del tema (defaults de la plantilla).
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
	$items[] = [
		'bg'          => $resolve( (string) ( $slide['bgImageUrl'] ?? '' ) ),
		'bgAlt'       => $slide['bgImageAlt'] ?? '',
		'title'       => $slide['title'] ?? '',
		'text'        => $slide['text'] ?? '',
		'ratingValue' => $slide['ratingValue'] ?? '',
		'ratingText'  => $slide['ratingText'] ?? '',
		'circleText'  => $slide['circleText'] ?? '',
		'side'        => $resolve( (string) ( $slide['sideImageUrl'] ?? '' ) ),
		'sideAlt'     => $slide['sideImageAlt'] ?? '',
	];
}

$context = Timber::context();
$context['items'] = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-hero',
] );

Timber::render( 'blocks/hero.twig', $context );
