<?php
/**
 * Listado de proyectos por categoría (taxonomía proyecto_categoria).
 *
 * Cada proyecto del término se muestra con el cuerpo product-details (que vive
 * en su contenido, vía el bloque respira/proyecto-niveles), uno debajo del otro
 * y separados por una línea horizontal.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

$context          = Timber::context();
$context['term']  = Timber::get_term();
$context['posts'] = Timber::get_posts();

Timber::render( [ 'taxonomy-proyecto_categoria.twig', 'archive.twig' ], $context );
