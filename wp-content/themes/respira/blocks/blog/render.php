<?php
/**
 * Render del bloque respira/blog (sección de blog dinámica).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$context = Timber::context();

$context['subtitle'] = $attributes['subtitle'] ?? 'News & Articles';
$context['title']    = $attributes['title'] ?? 'Últimas noticias';
$context['ctaLabel'] = $attributes['ctaLabel'] ?? 'Ver todas';
$context['ctaUrl']   = $attributes['ctaUrl'] ?? '';

$context['posts'] = Timber::get_posts( [
	'post_type'      => 'post',
	'posts_per_page' => $attributes['postsCount'] ?? 3,
] );

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-blog',
] );

Timber::render( 'blocks/blog.twig', $context );
