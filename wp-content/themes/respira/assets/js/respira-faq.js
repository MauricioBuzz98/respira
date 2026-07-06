/**
 * FAQ (bloque respira/faq): botón "Ver más" en móvil.
 *
 * En móvil el bloque muestra solo las 3 primeras preguntas (las demás llevan la
 * clase .faq-extra y se ocultan por CSS). Este handler alterna la clase
 * .is-expanded en el .faq-box para revelar/ocultar el resto y cambia el rótulo
 * del botón entre "Ver más" y "Ver menos" (data-more / data-less del markup).
 */
( function ( $ ) {
	'use strict';

	$( function () {
		$( document ).on( 'click', '.faq-ver-mas', function () {
			var $btn = $( this );
			var expanded = $btn.closest( '.faq-box' ).toggleClass( 'is-expanded' ).hasClass( 'is-expanded' );
			var label = expanded ? $btn.data( 'less' ) : $btn.data( 'more' );
			if ( label ) {
				$btn.find( '.faq-ver-mas__label' ).text( label );
			}
			$btn.attr( 'aria-expanded', expanded ? 'true' : 'false' );
		} );
	} );
}( window.jQuery ) );
