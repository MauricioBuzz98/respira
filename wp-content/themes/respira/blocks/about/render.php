<?php
/**
 * Render del bloque respira/about (sección Nosotros).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['image1Url'] = $attributes['image1Url'] ?? '';
$context['image1Alt'] = $attributes['image1Alt'] ?? '';
$context['image2Url'] = $attributes['image2Url'] ?? '';
$context['image2Alt'] = $attributes['image2Alt'] ?? '';

$context['badgeText'] = $attributes['badgeText'] ?? 'Equipo experto';
$context['subtitle']  = $attributes['subtitle'] ?? 'About our company';
$context['title']     = $attributes['title'] ?? '';
$context['text']      = $attributes['text'] ?? '';

$context['feature1Icon']  = $attributes['feature1Icon'] ?? 'flaticon-set-pencil-and-ruler';
$context['feature1Title'] = $attributes['feature1Title'] ?? '';
$context['feature1Text']  = $attributes['feature1Text'] ?? '';
$context['feature2Icon']  = $attributes['feature2Icon'] ?? 'flaticon-set-architect';
$context['feature2Title'] = $attributes['feature2Title'] ?? '';
$context['feature2Text']  = $attributes['feature2Text'] ?? '';

$context['ctaLabel']    = $attributes['ctaLabel'] ?? 'Leer más';
$context['ctaUrl']      = $attributes['ctaUrl'] ?? '';
$context['phoneLabel']  = $attributes['phoneLabel'] ?? 'Llámanos';
$context['phoneNumber'] = $attributes['phoneNumber'] ?? '';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-about',
] );

Timber::render( 'blocks/about.twig', $context );
