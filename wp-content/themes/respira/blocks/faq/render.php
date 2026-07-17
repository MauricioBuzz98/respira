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
// El botón de la caja de información apunta a WhatsApp: se le agrega el mensaje
// predeterminado del Personalizador (el mismo del botón flotante). Si la URL no
// es de WhatsApp, append_whatsapp_message() la devuelve intacta.
$context['ctaUrl']    = \Respira\Site::append_whatsapp_message( (string) ( $attributes['ctaUrl'] ?? '' ) );

// Formatea la respuesta (texto plano) a HTML: líneas que empiezan con "-", "*",
// "•" o "◦" se agrupan en una lista <ul>; el resto se vuelve párrafos.
$format_answer = static function ( string $text ): string {
	$text = trim( $text );
	if ( '' === $text ) {
		return '';
	}
	$lines     = preg_split( '/\r\n|\r|\n/', $text );
	$html      = '';
	$para      = [];
	$list_open = false;

	$flush_para = static function () use ( &$para, &$html ): void {
		if ( $para ) {
			$html .= '<p>' . implode( '<br>', array_map( 'esc_html', $para ) ) . '</p>';
			$para  = [];
		}
	};

	foreach ( $lines as $line ) {
		$t = trim( $line );
		if ( '' === $t ) {
			$flush_para();
			if ( $list_open ) {
				$html      .= '</ul>';
				$list_open  = false;
			}
			continue;
		}
		if ( preg_match( '/^[-*•◦·]\s+(.+)$/u', $t, $m ) ) {
			$flush_para();
			if ( ! $list_open ) {
				$html      .= '<ul class="faq-answer-list">';
				$list_open  = true;
			}
			$html .= '<li>' . esc_html( $m[1] ) . '</li>';
		} else {
			if ( $list_open ) {
				$html      .= '</ul>';
				$list_open  = false;
			}
			$para[] = $t;
		}
	}
	$flush_para();
	if ( $list_open ) {
		$html .= '</ul>';
	}
	return $html;
};

$items = [];
foreach ( (array) ( $attributes['items'] ?? [] ) as $it ) {
	$items[] = [
		'question' => (string) ( $it['question'] ?? '' ),
		'answer'   => $format_answer( (string) ( $it['answer'] ?? '' ) ),
	];
}
$context['items'] = $items;

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-faq',
] );

Timber::render( 'blocks/faq.twig', $context );
