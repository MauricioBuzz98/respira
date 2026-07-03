<?php
/**
 * Render del bloque respira/proyecto-niveles.
 *
 * Reproduce el cuerpo "product-details" de Realest (galería + información),
 * sin estrellas ni precio. La galería muestra una imagen por nivel; la
 * descripción y las amenidades del nivel se muestran dinámicamente al
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

$gallery = [];

foreach ( (array) ( $attributes['items'] ?? [] ) as $level ) {
	// Cada nivel con imagen es una "slide" + su descripción y amenidades.
	$image = $resolve( (string) ( $level['imageUrl'] ?? '' ) );
	if ( '' === $image ) {
		continue;
	}

	// Amenidades de ESTE nivel (cambian al seleccionar la miniatura).
	$level_amenities = [];
	foreach ( (array) ( $level['amenities'] ?? [] ) as $amenity ) {
		$text = (string) ( $amenity['text'] ?? '' );
		if ( '' !== $text ) {
			$level_amenities[] = [
				'icon'        => (string) ( $amenity['icon'] ?? '' ),
				'imageUrl'    => $resolve( (string) ( $amenity['imageUrl'] ?? '' ) ),
				'imageAlt'    => (string) ( $amenity['imageAlt'] ?? '' ),
				// Se respetan los saltos de línea: se escapa y luego \n -> <br>.
				'text'        => nl2br( esc_html( $text ) ),
				'marginClass' => (string) ( $amenity['marginClass'] ?? '' ),
			];
		}
	}

	// La descripción es texto plano y se respetan los saltos de línea. El
	// contenido antiguo pudo guardarse como HTML (<br>, listas): se normaliza
	// a texto plano antes de escapar y convertir los \n en <br>.
	$description = (string) ( $level['description'] ?? '' );
	$description = preg_replace( '#<br\s*/?>#i', "\n", $description );
	$description = preg_replace( '#</(li|p)>#i', "\n", $description );
	$description = wp_strip_all_tags( $description );
	$description = trim( html_entity_decode( $description, ENT_QUOTES ) );
	$description = nl2br( esc_html( $description ) );

	$gallery[] = [
		'image'       => $image,
		'alt'         => (string) ( $level['imageAlt'] ?? '' ),
		'name'        => (string) ( $level['name'] ?? '' ),
		'description' => $description,
		'amenities'   => $level_amenities,
	];
}

$context                       = Timber::context();
$context['intro']              = wp_kses_post( (string) ( $attributes['intro'] ?? '' ) );
$context['thumbs_right']       = ! empty( $attributes['thumbsRight'] );
$context['gallery']            = $gallery;
$context['uid']                = uniqid( 'proy-' );
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-proyecto-niveles',
] );

Timber::render( 'blocks/proyecto-niveles.twig', $context );
