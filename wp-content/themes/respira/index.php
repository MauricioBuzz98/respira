<?php
/**
 * Plantilla de respaldo (listado de entradas).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context          = Timber::context();
$context['posts'] = Timber::get_posts();

Timber::render( 'index.twig', $context );
