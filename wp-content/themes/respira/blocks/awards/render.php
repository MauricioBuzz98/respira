<?php
/**
 * Render del bloque respira/awards (premios y reconocimientos).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['text']     = $attributes['text'] ?? '';
$context['image']    = [
	'url' => $attributes['imageUrl'] ?? '',
	'alt' => $attributes['imageAlt'] ?? '',
];
$context['items']    = $attributes['items'] ?? [];

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-awards',
] );

Timber::render( 'blocks/awards.twig', $context );
