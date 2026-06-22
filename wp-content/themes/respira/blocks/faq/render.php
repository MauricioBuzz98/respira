<?php
/**
 * Render del bloque respira/faq (FAQ acordeón).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['subtitle']  = $attributes['subtitle'] ?? '';
$context['title']     = $attributes['title'] ?? '';
$context['text']      = $attributes['text'] ?? '';
$context['infoTitle'] = $attributes['infoTitle'] ?? '';
$context['infoText']  = $attributes['infoText'] ?? '';
$context['ctaLabel']  = $attributes['ctaLabel'] ?? '';
$context['ctaUrl']    = $attributes['ctaUrl'] ?? '';
$context['items']     = $attributes['items'] ?? [];

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-faq',
] );

Timber::render( 'blocks/faq.twig', $context );
