<?php
/**
 * Plantilla 404.
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

Timber::render( '404.twig', Timber::context() );
