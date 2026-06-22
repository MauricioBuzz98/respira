<?php
/**
 * Plantilla de detalle de una Amenidad (CPT amenidades).
 *
 * Inyecta el listado completo de amenidades para el sidebar (estilo
 * service-details de Realest) y delega el render en single-amenidades.twig.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context               = Timber::context();
$context['post']       = Timber::get_post();
$context['amenidades'] = Timber::get_posts( [
	'post_type'      => 'amenidades',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
] );

Timber::render( [ 'single-amenidades.twig', 'single.twig' ], $context );
