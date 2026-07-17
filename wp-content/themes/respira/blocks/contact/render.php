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

$context['social_title'] = $attributes['socialTitle'] ?? '';
$context['subtitle'] = $attributes['subtitle'] ?? '';
$context['title']    = $attributes['title'] ?? '';
$context['text']     = $attributes['text'] ?? '';
$context['socials']  = array_map(
	static function ( $s ) {
		// Al enlace de WhatsApp se le agrega el mensaje predeterminado del
		// Personalizador (el mismo del botón flotante). El resto de las redes
		// quedan intactas: append_whatsapp_message() solo toca enlaces de WhatsApp.
		$s['link'] = \Respira\Site::append_whatsapp_message( (string) ( $s['link'] ?? '' ) );
		return $s;
	},
	array_values( array_filter(
		(array) ( $attributes['socials'] ?? [] ),
		static fn ( $s ) => '' !== (string) ( $s['text'] ?? '' ) || '' !== (string) ( $s['link'] ?? '' )
	) )
);

// Formulario: si se define un shortcode, se renderiza ese; si no, el marcador estático.
$shortcode             = trim( (string) ( $attributes['formShortcode'] ?? '' ) );
$context['form_html']  = '' !== $shortcode ? do_shortcode( $shortcode ) : '';

$context['wrapper_attributes'] = get_block_wrapper_attributes( [
	'class' => 'respira-contact',
] );

Timber::render( 'blocks/contact.twig', $context );
