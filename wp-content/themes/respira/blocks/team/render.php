<?php
/**
 * Render del bloque respira/team (slider de equipo).
 * source = "dynamic" consulta el CPT "miembro"; "manual" usa los items del bloque.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$source = $attributes['source'] ?? 'dynamic';
$items  = [];

if ( 'dynamic' === $source ) {
	$posts = get_posts( [
		'post_type'   => 'miembro',
		'numberposts' => max( 1, (int) ( $attributes['count'] ?? 8 ) ),
		'orderby'     => 'menu_order date',
		'order'       => 'ASC',
	] );
	foreach ( $posts as $p ) {
		$thumb_id = get_post_thumbnail_id( $p->ID );
		$items[]  = [
			'name'        => get_the_title( $p ),
			'designation' => (string) get_post_meta( $p->ID, '_respira_designation', true ),
			'link'        => get_permalink( $p ),
			'imageUrl'    => $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '',
			'imageAlt'    => $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '',
			'facebook'    => (string) get_post_meta( $p->ID, '_respira_facebook', true ),
			'twitter'     => (string) get_post_meta( $p->ID, '_respira_twitter', true ),
			'instagram'   => (string) get_post_meta( $p->ID, '_respira_instagram', true ),
		];
	}
}

if ( empty( $items ) ) {
	$items = $attributes['items'] ?? [];
}

$context = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-team',
] );

Timber::render( 'blocks/team.twig', $context );
