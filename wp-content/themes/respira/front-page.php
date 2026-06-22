<?php
/**
 * Portada del sitio (pagina estatica asignada como "Pagina de inicio").
 *
 * Renderiza los bloques apilados en esa pagina (hero, servicios, etc.).
 * Si se muestran las ultimas entradas como portada, delega en index.php.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

if ( 'posts' === get_option( 'show_on_front' ) ) {
	require get_template_directory() . '/index.php';
	return;
}

$context         = Timber::context();
$context['post'] = Timber::get_post();

$templates = [ 'front-page.twig', 'page-' . $context['post']->post_name . '.twig', 'page.twig' ];

Timber::render( $templates, $context );
