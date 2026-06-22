<?php
/**
 * Render del bloque respira/why-choose-us (¿Por qué elegirnos?).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['imageUrl']  = $attributes['imageUrl'] ?? '';
$context['imageAlt']  = $attributes['imageAlt'] ?? '';
$context['subtitle']  = $attributes['subtitle'] ?? '';
$context['title']     = $attributes['title'] ?? '';
$context['text']      = $attributes['text'] ?? '';
$context['listItems'] = $attributes['listItems'] ?? [];
$context['ctaLabel']  = $attributes['ctaLabel'] ?? '';
$context['ctaUrl']    = $attributes['ctaUrl'] ?? '';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-why-choose-us',
] );

Timber::render( 'blocks/why-choose-us.twig', $context );
