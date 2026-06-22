<?php
/**
 * Render del bloque respira/pricing (pricing-section-four de Realest).
 *
 * @package Respira
 */

declare(strict_types=1);

use Timber\Timber;

/** @var array $attributes */

$items = [];
foreach ( (array) ( $attributes['items'] ?? [] ) as $it ) {
	// Las características se editan como texto (una por línea) y aquí se parten en array.
	$features = array_values( array_filter( array_map(
		'trim',
		preg_split( '/\r\n|\r|\n/', (string) ( $it['features'] ?? '' ) )
	), static fn ( $f ) => '' !== $f ) );

	$items[] = [
		'planTitle' => $it['planTitle'] ?? '',
		'currency'  => $it['currency'] ?? '$',
		'amount'    => $it['amount'] ?? '',
		'period'    => $it['period'] ?? '',
		'features'  => $features,
		'ctaLabel'  => $it['ctaLabel'] ?? '',
		'ctaUrl'    => $it['ctaUrl'] ?? '',
	];
}

$context = Timber::context();
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['items']    = $items;
$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-pricing',
] );

Timber::render( 'blocks/pricing.twig', $context );
