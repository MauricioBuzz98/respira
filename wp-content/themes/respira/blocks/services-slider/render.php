<?php
/**
 * Render del bloque respira/services-slider (services-section-two de Realest).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$tpl_uri = get_template_directory_uri();

// Resuelve URLs: absolutas se dejan; relativas se prefijan con la carpeta de
// imágenes del tema (defaults de la plantilla).
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
foreach ( (array) ( $attributes['items'] ?? [] ) as $it ) {
	$items[] = [
		'icon'  => $it['icon'] ?? '',
		'title' => $it['title'] ?? '',
		'link'  => $it['link'] ?? '',
		'text'  => $it['text'] ?? '',
		'image' => $resolve( (string) ( $it['imageUrl'] ?? '' ) ),
		'alt'   => $it['imageAlt'] ?? '',
	];
}

$context = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['bg']       = $resolve( (string) ( $attributes['bgImageUrl'] ?? '' ) );
$context['bgAlt']    = $attributes['bgImageAlt'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-services-slider',
] );

Timber::render( 'blocks/services-slider.twig', $context );
