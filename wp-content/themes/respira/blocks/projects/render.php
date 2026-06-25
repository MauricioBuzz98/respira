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
	// Se traen todas y luego se aplica el orden manual antes de recortar a $count.
	$terms = get_terms( [
		'taxonomy'   => 'proyecto_categoria',
		'hide_empty' => true,
	] );

	if ( $terms && ! is_wp_error( $terms ) ) {
		// Orden manual definido en el bloque (array de term IDs). Las categorías
		// que no estén en el orden guardado se ubican al final (orden por nombre).
		$order = array_map( 'intval', (array) ( $attributes['categoryOrder'] ?? [] ) );
		if ( $order ) {
			$positions = array_flip( $order );
			usort( $terms, static function ( $a, $b ) use ( $positions ) {
				$pa = $positions[ $a->term_id ] ?? PHP_INT_MAX;
				$pb = $positions[ $b->term_id ] ?? PHP_INT_MAX;
				if ( $pa === $pb ) {
					return strcasecmp( $a->name, $b->name );
				}
				return $pa <=> $pb;
			} );
		}

		$terms = array_slice( $terms, 0, $count );

		foreach ( $terms as $term ) {
			$link = get_term_link( $term );

			// Imagen de la card: imagen propia de la categoría (term meta) y, si no
			// hay, el thumbnail del proyecto más reciente del término (fallback).
			$cat_img_id = (int) get_term_meta( $term->term_id, '_respira_image', true );
			if ( $cat_img_id ) {
				$image_id = $cat_img_id;
			} else {
				$rep      = get_posts( [
					'post_type'      => 'proyecto',
					'posts_per_page' => 1,
					'tax_query'      => [ [
						'taxonomy' => 'proyecto_categoria',
						'field'    => 'term_id',
						'terms'    => $term->term_id,
					] ],
				] );
				$image_id = $rep ? get_post_thumbnail_id( $rep[0]->ID ) : 0;
			}

			$items[] = [
				'subtitle'    => sprintf( _n( '%d proyecto', '%d proyectos', (int) $term->count, 'respira' ), (int) $term->count ),
				'title'       => $term->name,
				'description' => '' !== $term->description ? wpautop( $term->description ) : '',
				'link'        => is_wp_error( $link ) ? '' : $link,
				'imageUrl'    => $image_id ? (string) wp_get_attachment_image_url( $image_id, 'large' ) : '',
				'imageAlt'    => $image_id ? (string) get_post_meta( $image_id, '_wp_attachment_image_alt', true ) : '',
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
