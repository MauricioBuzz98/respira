<?php
/**
 * Render del bloque respira/ubicacion (ubicación: texto + mapa + puntos de interés).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

// Mapa: acepta el código <iframe> completo o sólo la URL de inserción (src).
$map = trim( (string) ( $attributes['mapEmbed'] ?? '' ) );
if ( '' === $map ) {
	$map_html = '';
} elseif ( false !== stripos( $map, '<iframe' ) ) {
	$map_html = $map; // El admin pegó el iframe completo.
} else {
	$map_html = sprintf(
		'<iframe class="ubicacion-map-frame" src="%s" width="100%%" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
		esc_url( $map )
	);
}

// Categorías: cada "places" (texto multilínea) se convierte en array de lugares.
$categories = [];
foreach ( (array) ( $attributes['categories'] ?? [] ) as $c ) {
	$lines  = preg_split( '/\r\n|\r|\n/', (string) ( $c['places'] ?? '' ) );
	$places = [];
	foreach ( (array) $lines as $line ) {
		$line = trim( $line );
		if ( '' !== $line ) {
			$places[] = $line;
		}
	}
	$categories[] = [
		'title'  => (string) ( $c['title'] ?? '' ),
		'places' => $places,
	];
}

$text = (string) ( $attributes['text'] ?? '' );

$context               = Timber::context();
$context['subtitle']   = $attributes['subtitle'] ?? '';
$context['title']      = $attributes['title'] ?? '';
$context['text']       = '' !== $text ? wpautop( $text ) : '';
$context['mapHtml']    = $map_html;
$context['poisTitle']  = $attributes['poisTitle'] ?? '';
$context['categories'] = $categories;

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-ubicacion',
] );

Timber::render( 'blocks/ubicacion.twig', $context );
