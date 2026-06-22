<?php
/**
 * Render del bloque respira/projects (galería de proyectos).
 *
 * Modos (atributo "source"):
 *   - all         -> todos los proyectos (CPT proyecto).
 *   - category    -> proyectos de una categoría (taxonomía proyecto_categoria).
 *   - categories  -> lista de categorías (cada tarjeta enlaza a su listado).
 *   - manual      -> ítems definidos a mano en el bloque.
 *   - dynamic     -> (compatibilidad) = "category" si hay categoría, si no "all".
 *
 * Si un modo dinámico no devuelve nada, cae a los ítems manuales (fallback).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$source   = (string) ( $attributes['source'] ?? 'all' );
$category = (string) ( $attributes['category'] ?? '' );
$count    = max( 1, (int) ( $attributes['count'] ?? 6 ) );

// Compatibilidad con bloques antiguos: "dynamic" = por categoría o todos.
if ( 'dynamic' === $source ) {
	$source = '' !== $category ? 'category' : 'all';
}

$items = [];

if ( 'categories' === $source ) {
	// Lista de categorías: una tarjeta por término, enlazando a su listado.
	$terms = get_terms( [
		'taxonomy'   => 'proyecto_categoria',
		'hide_empty' => true,
		'number'     => $count,
	] );

	if ( $terms && ! is_wp_error( $terms ) ) {
		foreach ( $terms as $term ) {
			// Imagen representativa: thumbnail del proyecto más reciente del término.
			$rep      = get_posts( [
				'post_type'      => 'proyecto',
				'posts_per_page' => 1,
				'tax_query'      => [ [
					'taxonomy' => 'proyecto_categoria',
					'field'    => 'term_id',
					'terms'    => $term->term_id,
				] ],
			] );
			$thumb_id = $rep ? get_post_thumbnail_id( $rep[0]->ID ) : 0;
			$link     = get_term_link( $term );

			$items[] = [
				'subtitle' => sprintf( _n( '%d proyecto', '%d proyectos', (int) $term->count, 'respira' ), (int) $term->count ),
				'title'    => $term->name,
				'link'     => is_wp_error( $link ) ? '' : $link,
				'imageUrl' => $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '',
				'imageAlt' => $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '',
			];
		}
	}
} elseif ( 'all' === $source || 'category' === $source ) {
	// Proyectos del CPT (todos, o filtrados por categoría).
	$query = [
		'post_type'   => 'proyecto',
		'numberposts' => $count,
		'orderby'     => 'menu_order date',
		'order'       => 'ASC',
	];

	if ( 'category' === $source && '' !== $category ) {
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
		$terms    = get_the_terms( $p->ID, 'proyecto_categoria' );
		$cat_name = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';
		$subtitle = '' !== $cat_name ? $cat_name : (string) get_post_meta( $p->ID, '_respira_subtitle', true );

		$items[] = [
			'subtitle' => $subtitle,
			'title'    => get_the_title( $p ),
			'link'     => get_permalink( $p ),
			'imageUrl' => $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '',
			'imageAlt' => $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '',
		];
	}
}

// Modo manual, o fallback si el modo dinámico no devolvió nada.
if ( 'manual' === $source || empty( $items ) ) {
	$items = $attributes['items'] ?? [];
}

$context             = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-projects',
] );

Timber::render( 'blocks/projects.twig', $context );
