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

$source = (string) ( $attributes['source'] ?? 'amenidades' );
$count  = max( 1, (int) ( $attributes['count'] ?? 6 ) );

$items = [];

// Modo dinámico: amenidades del CPT. Cada card enlaza a su propia página (el
// permalink de la amenidad), no al listado.
if ( 'amenidades' === $source ) {
	$posts = get_posts( [
		'post_type'   => 'amenidades',
		'numberposts' => $count,
		'orderby'     => 'menu_order date',
		'order'       => 'ASC',
	] );
	foreach ( $posts as $p ) {
		$thumb_id     = get_post_thumbnail_id( $p->ID );
		$icon_img_id  = (int) get_post_meta( $p->ID, '_respira_icon_image', true );
		$items[]      = [
			'icon'      => (string) get_post_meta( $p->ID, '_respira_icon', true ),
			'iconImage' => $icon_img_id ? (string) wp_get_attachment_image_url( $icon_img_id, 'medium' ) : '',
			'title'     => get_the_title( $p ),
			'link'      => (string) get_permalink( $p->ID ),
			'text'      => get_the_excerpt( $p ),
			'image'     => $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '',
			'alt'       => $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '',
		];
	}
}

// Modo manual, o fallback si el CPT no devolvió nada (conserva bloques ya insertados).
if ( 'manual' === $source || empty( $items ) ) {
	$items = [];
	foreach ( (array) ( $attributes['items'] ?? [] ) as $it ) {
		$items[] = [
			'icon'      => $it['icon'] ?? '',
			'iconImage' => $resolve( (string) ( $it['iconImageUrl'] ?? '' ) ),
			'title'     => $it['title'] ?? '',
			'link'      => $it['link'] ?? '',
			'text'      => $it['text'] ?? '',
			'image'     => $resolve( (string) ( $it['imageUrl'] ?? '' ) ),
			'alt'       => $it['imageAlt'] ?? '',
		];
	}
}

$context = Timber::context();
$context['subtitle']    = $attributes['subtitle'] ?? '';
$context['title']       = $attributes['title'] ?? '';
$context['description'] = $attributes['description'] ?? '';
$context['bg']          = $resolve( (string) ( $attributes['bgImageUrl'] ?? '' ) );
$context['bgAlt']    = $attributes['bgImageAlt'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-services-slider',
] );

Timber::render( 'blocks/services-slider.twig', $context );
