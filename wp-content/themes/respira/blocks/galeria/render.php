<?php
/**
 * Render del bloque respira/galeria (galería de fotos estilo masonry + lightbox).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$images = [];
foreach ( (array) ( $attributes['images'] ?? [] ) as $img ) {
	$id  = (int) ( $img['imageId'] ?? 0 );
	$url = (string) ( $img['imageUrl'] ?? '' );

	// Imagen mostrada (tamaño "large") y versión completa para el lightbox.
	$display = $id ? (string) wp_get_attachment_image_url( $id, 'large' ) : $url;
	$full    = $id ? (string) wp_get_attachment_image_url( $id, 'full' ) : $url;

	if ( '' === $display ) {
		continue;
	}

	$alt = (string) ( $img['imageAlt'] ?? '' );
	if ( '' === $alt && $id ) {
		$alt = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
	}

	$images[] = [
		'display' => $display,
		'full'    => $full ?: $display,
		'alt'     => $alt,
		'caption' => (string) ( $img['caption'] ?? '' ),
	];
}

$text    = (string) ( $attributes['text'] ?? '' );
$columns = max( 2, min( 5, (int) ( $attributes['columns'] ?? 3 ) ) );

$context             = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['text']     = '' !== $text ? wpautop( $text ) : '';
$context['columns']  = $columns;
$context['images']   = $images;

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-galeria',
] );

Timber::render( 'blocks/galeria.twig', $context );
