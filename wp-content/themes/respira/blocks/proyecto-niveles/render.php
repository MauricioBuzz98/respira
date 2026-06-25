<?php
/**
 * Render del bloque respira/proyecto-niveles.
 *
 * Reproduce el cuerpo "product-details" de Realest (galería + información),
 * sin estrellas ni precio. La galería muestra una imagen por nivel; la
 * descripción del nivel (contenido enriquecido) se muestra dinámicamente al
 * seleccionar su miniatura (ver assets/js/respira-proyectos.js).
 *
 * Se alimenta SOLO de sus atributos (no del post global) para poder
 * renderizarse dentro del loop de la plantilla de taxonomía.
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

$gallery   = [];
$amenities = [];

foreach ( (array) ( $attributes['items'] ?? [] ) as $level ) {
	// Amenidades del nivel -> lista combinada del proyecto.
	foreach ( (array) ( $level['amenities'] ?? [] ) as $amenity ) {
		$text = (string) ( $amenity['text'] ?? '' );
		if ( '' !== $text ) {
			$amenities[] = [
				'icon'     => (string) ( $amenity['icon'] ?? '' ),
				'imageUrl' => $resolve( (string) ( $amenity['imageUrl'] ?? '' ) ),
				'imageAlt' => (string) ( $amenity['imageAlt'] ?? '' ),
				'text'     => $text,
			];
		}
	}

	// Cada nivel con imagen es una "slide" + su descripción dinámica.
	$image = $resolve( (string) ( $level['imageUrl'] ?? '' ) );
	if ( '' === $image ) {
		continue;
	}

	$gallery[] = [
		'image'       => $image,
		'alt'         => (string) ( $level['imageAlt'] ?? '' ),
		'description' => wp_kses_post( (string) ( $level['description'] ?? '' ) ),
	];
}

$context                       = Timber::context();
$context['intro']              = wp_kses_post( (string) ( $attributes['intro'] ?? '' ) );
$context['gallery']            = $gallery;
$context['amenities_combined'] = $amenities;
$context['uid']                = uniqid( 'proy-' );
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-proyecto-niveles',
] );

Timber::render( 'blocks/proyecto-niveles.twig', $context );
