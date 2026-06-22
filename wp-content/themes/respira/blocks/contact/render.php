<?php
/**
 * Render del bloque respira/contact (sección de contacto con formulario estático).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['subtitle']   = $attributes['subtitle'] ?? '';
$context['title']      = $attributes['title'] ?? '';
$context['text']       = $attributes['text'] ?? '';
$context['bgImageUrl'] = $attributes['bgImageUrl'] ?? '';
$context['bgImageAlt'] = $attributes['bgImageAlt'] ?? '';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-contact',
] );

Timber::render( 'blocks/contact.twig', $context );
