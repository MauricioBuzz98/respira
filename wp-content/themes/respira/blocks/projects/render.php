<?php
/**
 * Render del bloque respira/projects (galería de proyectos).
 * source = "dynamic" consulta el CPT "proyecto"; "manual" usa los items del bloque.
 * Si el modo dinámico no devuelve nada, cae a los items manuales.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$source = $attributes['source'] ?? 'dynamic';
$items  = [];

if ( 'dynamic' === $source ) {
	$query = [
		'post_type'   => 'proyecto',
		'numberposts' => max( 1, (int) ( $attributes['count'] ?? 6 ) ),
		'orderby'     => 'menu_order date',
		'order'       => 'ASC',
	];

	// Filtro por categoría (taxonomía proyecto_categoria), si se eligió una.
	$category = (string) ( $attributes['category'] ?? '' );
	if ( '' !== $category ) {
		$query['tax_query'] = [ [
			'taxonomy' => 'proyecto_categoria',
			'field'    => 'slug',
			'terms'    => $category,
		] ];
	}

	$posts = get_posts( $query );
	foreach ( $posts as $p ) {
		$thumb_id = get_post_thumbnail_id( $p->ID );

		// Subtítulo de la tarjeta = primera categoría asignada; si no hay, el meta.
		$terms     = get_the_terms( $p->ID, 'proyecto_categoria' );
		$cat_name  = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';
		$subtitle  = '' !== $cat_name ? $cat_name : (string) get_post_meta( $p->ID, '_respira_subtitle', true );

		$items[] = [
			'subtitle' => $subtitle,
			'title'    => get_the_title( $p ),
			'link'     => get_permalink( $p ),
			'imageUrl' => $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '',
			'imageAlt' => $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '',
		];
	}
}

// Fallback a items manuales (modo manual o CPT vacío).
if ( empty( $items ) ) {
	$items = $attributes['items'] ?? [];
}

$context = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-projects',
] );

Timber::render( 'blocks/projects.twig', $context );
