/**
 * Galería de proyecto (bloque respira/proyecto-niveles).
 *
 * Galería propia (no bxSlider) para soportar varias instancias por página
 * (listado por categoría): una imagen activa + tira de miniaturas. Al
 * seleccionar una miniatura se muestra la imagen de ese nivel y su descripción
 * (la descripción es dinámica: solo se ve la del nivel seleccionado).
 */
( function ( $ ) {
	'use strict';

	$( function () {
		$( '.proyecto-galeria' ).each( function () {
			var $g = $( this );
			var $proj = $g.closest( '.proyecto-niveles' );
			var $slides = $g.find( '.proyecto-galeria__stage .image-box' );
			var $thumbs = $g.find( '.thumb-box > li > a' );
			var $descs = $proj.find( '.proyecto-descripcion' );
			var $amens = $proj.find( '.proyecto-amenidades-nivel' );

			if ( ! $slides.length ) {
				return;
			}

			function activate( i ) {
				$slides.removeClass( 'is-active' ).eq( i ).addClass( 'is-active' );
				$thumbs.removeClass( 'active' ).eq( i ).addClass( 'active' );
				$descs.removeClass( 'is-active' ).eq( i ).addClass( 'is-active' );
				$amens.removeClass( 'is-active' ).eq( i ).addClass( 'is-active' );
			}

			$thumbs.on( 'click', function ( e ) {
				e.preventDefault();
				activate( $thumbs.index( this ) );
			} );

			activate( 0 );
		} );
	} );
}( jQuery ) );
