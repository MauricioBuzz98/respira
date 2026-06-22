<?php
/**
 * Render del bloque respira/services (grid de servicios).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['items']    = $attributes['items'] ?? [];

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-services',
] );

Timber::render( 'blocks/services.twig', $context );
