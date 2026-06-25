<?php
/**
 * Render del bloque respira/page-hero (hero editable de página).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$tpl_uri = get_template_directory_uri();

// Resuelve la URL de la imagen: absoluta se deja; relativa se prefija con la
// carpeta de imágenes del tema. Si no hay imagen, usa el banner por defecto.
$image = (string) ( $attributes['imageUrl'] ?? '' );
if ( '' !== $image && ! preg_match( '#^(https?:)?//#', $image ) && ! str_starts_with( $image, '/' ) ) {
	$image = $tpl_uri . '/assets/images/' . ltrim( $image, '/' );
}
if ( '' === $image ) {
	$image = $tpl_uri . '/assets/images/resource/page-title.jpg';
}

$text = (string) ( $attributes['text'] ?? '' );

$context              = Timber::context();
$context['image']     = $image;
$context['imageAlt']  = $attributes['imageAlt'] ?? '';
$context['subtitle']  = $attributes['subtitle'] ?? '';
$context['title']     = $attributes['title'] ?? '';
$context['text']      = '' !== $text ? wpautop( $text ) : '';
$context['ctaLabel']  = $attributes['ctaLabel'] ?? '';
$context['ctaUrl']    = $attributes['ctaUrl'] ?? '';
$context['align']     = ( 'left' === ( $attributes['align'] ?? 'center' ) ) ? 'left' : 'center';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-page-hero align-' . $context['align'],
] );

Timber::render( 'blocks/page-hero.twig', $context );
