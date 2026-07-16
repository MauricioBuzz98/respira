/**
 * Hero (bloque respira/hero): igualar la altura de todos los slides del
 * carrusel al slide más alto.
 *
 * Los slides del banner-h1-slider no llevan una altura fija: cada uno mide lo
 * que mide su contenido, así que un slide con párrafo descriptivo queda más
 * alto que otro que solo tiene el titular y la imagen se ve "cortada". Swiper
 * arma el .swiper-wrapper como flex con box-sizing:content-box, y en ese layout
 * align-items:stretch no estira los slides (se comprobó), por lo que hay que
 * calcular la altura del .inner-block más alto y aplicarla como min-height a
 * todos. La imagen de fondo (bg-image height:100%) cubre entonces la altura
 * igualada. El min-height se aplica sin transición: animarlo dejaría el slide
 * corto más bajo durante la animación y se vería el recorte al hacer swipe.
 *
 * El recálculo al redimensionar es lo delicado: Swiper fija el ancho de cada
 * slide con estilos inline y lo actualiza en su propio ciclo, así que medir en
 * el resize de window (o incluso en el evento de Swiper + rAF) puede caer antes
 * de que el texto refloje a su altura final → se mide de menos y queda recorte.
 * La forma fiable es un ResizeObserver sobre los .inner-block: dispara DESPUÉS
 * de que el layout se estabiliza, justo cuando un slide crece más allá de su
 * min-height (el caso que genera el recorte). Una guarda de reentrancia evita
 * el bucle infinito con nuestras propias escrituras de min-height. Además se
 * recalcula en los eventos de Swiper y en window.load para ajustar también
 * cuando el contenido se achica.
 */
( function () {
	'use strict';

	function equalize( ctx ) {
		var blocks = ctx.blocks;
		if ( ! blocks.length ) {
			return;
		}

		// Ignorar los ResizeObserver que disparen nuestras propias escrituras.
		ctx.applying = true;

		// 1) Reset: medir la altura natural, sin el min-height anterior.
		var i;
		for ( i = 0; i < blocks.length; i++ ) {
			blocks[ i ].style.minHeight = '';
		}

		// 2) Altura del más alto.
		var tallest = 0;
		for ( i = 0; i < blocks.length; i++ ) {
			var h = blocks[ i ].getBoundingClientRect().height;
			if ( h > tallest ) {
				tallest = h;
			}
		}

		// 3) Aplicarla a todos.
		if ( tallest ) {
			var value = Math.ceil( tallest ) + 'px';
			for ( i = 0; i < blocks.length; i++ ) {
				blocks[ i ].style.minHeight = value;
			}
		}

		// Liberar la guarda en el frame siguiente, ya procesadas nuestras
		// mutaciones por el observer.
		window.requestAnimationFrame( function () {
			ctx.applying = false;
		} );
	}

	// rAF con anti-rebote por slider: agrupa ráfagas de disparos en un solo
	// reflujo y corre después del layout actual.
	function scheduler( ctx ) {
		return function () {
			if ( ctx.pending ) {
				return;
			}
			ctx.pending = true;
			window.requestAnimationFrame( function () {
				ctx.pending = false;
				equalize( ctx );
			} );
		};
	}

	function bind( slider ) {
		var ctx = {
			slider: slider,
			blocks: slider.querySelectorAll( '.banner-block .inner-block' ),
			applying: false,
			pending: false,
		};
		if ( ! ctx.blocks.length ) {
			return function () {};
		}

		var run = scheduler( ctx );

		// Fuente principal: el tamaño real de los slides tras estabilizar el
		// layout (reflujo de texto, cambio de ancho de Swiper, etc.). El
		// callback corre DESPUÉS del layout y ANTES del paint, así que igualar
		// aquí de forma síncrona mete la corrección en el mismo frame y no se
		// llega a pintar el recorte. La guarda (ctx.applying) evita reprocesar
		// nuestras propias escrituras de min-height.
		if ( 'function' === typeof window.ResizeObserver ) {
			var ro = new window.ResizeObserver( function () {
				if ( ! ctx.applying ) {
					equalize( ctx );
				}
			} );
			for ( var i = 0; i < ctx.blocks.length; i++ ) {
				ro.observe( ctx.blocks[ i ] );
			}
		}

		// Disparos adicionales para recomputar también al achicar el contenido
		// (cuando el slide no supera el min-height y el observer no dispara).
		var swiper = slider.swiper;
		if ( swiper && 'function' === typeof swiper.on ) {
			swiper.on( 'resize', run );
			swiper.on( 'update', run );
			swiper.on( 'imagesReady', run );
		} else {
			window.addEventListener( 'resize', run );
			window.addEventListener( 'orientationchange', run );
		}

		run();
		return run;
	}

	function init() {
		var sliders = document.querySelectorAll( '.respira-hero .banner-h1-slider' );
		if ( ! sliders.length ) {
			return;
		}

		var runs = [];
		var i;
		for ( i = 0; i < sliders.length; i++ ) {
			runs.push( bind( sliders[ i ] ) );
		}

		// Recalcular tras la carga completa (fuentes/imágenes) por si cambian
		// las alturas respecto al primer cálculo.
		window.addEventListener( 'load', function () {
			for ( var j = 0; j < runs.length; j++ ) {
				runs[ j ]();
			}
		} );
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
}() );
