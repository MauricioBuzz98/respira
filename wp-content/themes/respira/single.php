<?php
/**
 * Plantilla de entrada individual.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();

Timber::render( [ 'single-' . $context['post']->post_type . '.twig', 'single.twig' ], $context );
