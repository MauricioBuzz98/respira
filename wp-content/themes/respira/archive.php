<?php
/**
 * Plantilla de archivos (categorias, etiquetas, fechas, CPT).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context          = Timber::context();
$context['posts'] = Timber::get_posts();
$context['title'] = __( 'Archivo', 'respira' );

if ( is_day() ) {
	$context['title'] = __( 'Archivo: ', 'respira' ) . get_the_date( 'D M Y' );
} elseif ( is_month() ) {
	$context['title'] = __( 'Archivo: ', 'respira' ) . get_the_date( 'M Y' );
} elseif ( is_year() ) {
	$context['title'] = __( 'Archivo: ', 'respira' ) . get_the_date( 'Y' );
} elseif ( is_tag() ) {
	$context['title'] = single_tag_title( '', false );
} elseif ( is_category() ) {
	$context['title'] = single_cat_title( '', false );
} elseif ( is_post_type_archive() ) {
	$context['title'] = post_type_archive_title( '', false );
}

Timber::render( [ 'archive-' . get_post_type() . '.twig', 'archive.twig' ], $context );
