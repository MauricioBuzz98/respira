<?php
/**
 * Plantilla de paginas.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();

$templates = [ 'page-' . $context['post']->post_name . '.twig', 'page.twig' ];

Timber::render( $templates, $context );
