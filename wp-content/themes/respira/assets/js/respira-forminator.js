/**
 * Respira × Forminator — comportamiento del mensaje de éxito.
 *
 * Al enviar el formulario con éxito (evento `forminator:form:submit:success`):
 *   1. Desvanece los campos (clase `respira-fields-hidden`), conservando la
 *      altura del formulario para que el overlay lo cubra por completo.
 *   2. Convierte el `.forminator-response-message` en un overlay a pantalla
 *      completa del formulario y lo hace aparecer con fade.
 *   3. Tras unos segundos, desvanece el mensaje y vuelve a mostrar los campos
 *      (formulario reseteado), listo para un nuevo envío.
 *
 * Toda la parte visual (posición, fade, colores) vive en forminator-respira.css.
 */
(function ($) {
	'use strict';

	// Tiempo que el mensaje permanece visible (ms) y duración del fade (debe
	// coincidir con la transición de .respira-overlay en el CSS).
	var DISPLAY_MS = 5000;
	var FADE_MS = 350;

	$(document).on('forminator:form:submit:success', '.forminator-custom-form', function () {
		var $form = $(this);
		var $msg = $form.find('.forminator-response-message').first();

		if (!$msg.length) {
			return;
		}

		// Cancela un ciclo anterior si el usuario reenvía antes de que termine.
		var pending = $form.data('respiraMsgTimers');
		if (pending) {
			clearTimeout(pending.hide);
			clearTimeout(pending.reset);
		}

		// 1 + 2: ocultar campos y montar el overlay.
		$form.addClass('respira-fields-hidden');
		$msg.addClass('respira-overlay');

		// Forzar reflow para que la transición de opacidad se dispare.
		// eslint-disable-next-line no-unused-expressions
		$msg[0].offsetHeight;
		$msg.addClass('respira-overlay--visible');

		// 3: programar el fade-out y la restauración del formulario.
		var timers = {};
		timers.hide = setTimeout(function () {
			$msg.removeClass('respira-overlay--visible');

			timers.reset = setTimeout(function () {
				$msg
					.removeClass('respira-overlay forminator-show forminator-success')
					.attr('aria-hidden', 'true')
					.empty();
				$form.removeClass('respira-fields-hidden');

				// Reset de seguridad (Forminator ya resetea en thankyou, pero
				// esto cubre cualquier campo que quede con valor).
				if ($form[0] && typeof $form[0].reset === 'function') {
					$form[0].reset();
				}
				$form.removeData('respiraMsgTimers');
			}, FADE_MS);
		}, DISPLAY_MS);

		$form.data('respiraMsgTimers', timers);
	});
})(jQuery);
