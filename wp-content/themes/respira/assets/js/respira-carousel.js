/**
 * Carrusel de imágenes genérico (bloque respira/carrusel).
 *
 * Inicializa un Swiper POR instancia (no por selector global) para que varios
 * carruseles en la misma página no peleen por las flechas/puntos: cada control
 * se busca relativo a su propio contenedor (ver gotcha de instancias múltiples).
 * El tiempo entre slides viene en data-autoplay-delay (ms). Con un solo slide se
 * desactivan loop y autoplay para que Swiper no se quede en blanco.
 */
( function () {
	'use strict';

	function initOne( el ) {
		if ( ! el || el.swiper ) {
			return; // ya inicializado
		}

		var delay = parseInt( el.getAttribute( 'data-autoplay-delay' ), 10 );
		if ( ! delay || delay < 1 ) {
			delay = 6000;
		}

		var slides = el.querySelectorAll( '.swiper-slide' ).length;
		var multiple = slides > 1;

		var options = {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: multiple,
			speed: 700,
			grabCursor: true,
			autoplay: multiple
				? {
					delay: delay,
					disableOnInteraction: false,
					pauseOnMouseEnter: false,
				}
				: false,
		};

		if ( '0' !== el.getAttribute( 'data-arrows' ) ) {
			var next = el.querySelector( '.swiper-button-next' );
			var prev = el.querySelector( '.swiper-button-prev' );
			if ( next && prev ) {
				options.navigation = { nextEl: next, prevEl: prev };
			}
		}

		if ( '0' !== el.getAttribute( 'data-dots' ) ) {
			var pagination = el.querySelector( '.swiper-pagination' );
			if ( pagination ) {
				options.pagination = { el: pagination, clickable: true };
			}
		}

		// eslint-disable-next-line no-new
		new window.Swiper( el, options );
	}

	function init() {
		if ( 'function' !== typeof window.Swiper ) {
			return;
		}
		var sliders = document.querySelectorAll( '.respira-carrusel__slider' );
		for ( var i = 0; i < sliders.length; i++ ) {
			initOne( sliders[ i ] );
		}
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
}() );
