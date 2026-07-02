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

/**
 * Ícono por defecto según el nombre de la categoría. Sólo se usa como fallback
 * cuando el bloque no trae un ícono definido (p. ej. contenido guardado antes de
 * agregar el campo). Si el editor define un ícono, ese tiene prioridad.
 */
$guess_icon = static function ( string $title ): string {
	$t = function_exists( 'mb_strtolower' ) ? mb_strtolower( $title ) : strtolower( $title );
	$map = [
		'restaurante'  => 'fa-solid fa-utensils',
		'café'         => 'fa-solid fa-mug-hot',
		'cafe'         => 'fa-solid fa-mug-hot',
		'cafetería'    => 'fa-solid fa-mug-hot',
		'cafeteria'    => 'fa-solid fa-mug-hot',
		'salud'        => 'fa-solid fa-briefcase-medical',
		'conveniencia' => 'fa-solid fa-briefcase-medical',
		'hospital'     => 'fa-solid fa-briefcase-medical',
		'clínica'      => 'fa-solid fa-briefcase-medical',
		'comercial'    => 'fa-solid fa-bag-shopping',
		'comercio'     => 'fa-solid fa-bag-shopping',
		'plaza'        => 'fa-solid fa-bag-shopping',
		'mall'         => 'fa-solid fa-bag-shopping',
	];
	foreach ( $map as $needle => $icon ) {
		if ( false !== strpos( $t, $needle ) ) {
			return $icon;
		}
	}
	return 'fa-solid fa-location-dot';
};

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
	$title = (string) ( $c['title'] ?? '' );
	$icon  = trim( (string) ( $c['icon'] ?? '' ) );
	if ( '' === $icon ) {
		$icon = $guess_icon( $title );
	}
	$categories[] = [
		'title'  => $title,
		'icon'   => $icon,
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
