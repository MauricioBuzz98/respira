<?php
/**
 * Plantilla de resultados de busqueda.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context                = Timber::context();
$context['posts']       = Timber::get_posts();
$context['search_term'] = get_search_query();

Timber::render( 'search.twig', $context );
