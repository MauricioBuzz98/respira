<?php
/**
 * Render del bloque respira/productos (featured-products de Realest, sin filtro MixItUp).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$tpl_uri = get_template_directory_uri();

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
	$rating = (int) ( $it['rating'] ?? 0 );
	$items[] = [
		'title'  => $it['title'] ?? '',
		'link'   => $it['link'] ?? '',
		'price'  => $it['price'] ?? '',
		'rating' => max( 0, min( 5, $rating ) ),
		'image'  => $resolve( (string) ( $it['imageUrl'] ?? '' ) ),
		'alt'    => $it['imageAlt'] ?? '',
	];
}

$context = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['cart_url'] = $attributes['cartUrl'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-productos',
] );

Timber::render( 'blocks/productos.twig', $context );
