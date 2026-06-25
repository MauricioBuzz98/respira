<?php
/**
 * Render del bloque respira/respaldo (sección centrada: título + logo + texto + logo).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$text = (string) ( $attributes['text'] ?? '' );

$context                  = Timber::context();
$context['subtitle']      = $attributes['subtitle'] ?? '';
$context['title']         = $attributes['title'] ?? '';
$context['text']          = '' !== $text ? wpautop( $text ) : '';
$context['logoTopUrl']    = $attributes['logoTopUrl'] ?? '';
$context['logoTopAlt']    = $attributes['logoTopAlt'] ?? '';
$context['logoBottomUrl'] = $attributes['logoBottomUrl'] ?? '';
$context['logoBottomAlt'] = $attributes['logoBottomAlt'] ?? '';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-respaldo',
] );

Timber::render( 'blocks/respaldo.twig', $context );
