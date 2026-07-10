<?php
/**
 * Control del Personalizador: repetidor de redes sociales (icono + enlace).
 *
 * Guarda un JSON en un único theme_mod. Site.php lo decodifica a options.socials
 * para footer y header (se muestra solo el icono, sin texto).
 *
 * Se renderiza en el servidor (filas actuales) y un script delegado
 * (Customizer::customize_controls_assets) maneja agregar/quitar/editar filas.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

use WP_Customize_Control;

class Social_Repeater_Control extends WP_Customize_Control {

	/** @var string */
	public $type = 'respira_socials';

	/**
	 * Iconos disponibles (clase Font Awesome => etiqueta).
	 *
	 * @return array<string,string>
	 */
	public static function icon_options(): array {
		return [
			'fab fa-facebook-f'  => 'Facebook',
			'fab fa-instagram'   => 'Instagram',
			'fab fa-whatsapp'    => 'WhatsApp',
			'fas fa-envelope'    => 'Email',
			'fab fa-waze'        => 'Waze',
			'fab fa-twitter'     => 'Twitter / X',
			'fab fa-linkedin-in' => 'LinkedIn',
			'fab fa-youtube'     => 'YouTube',
			'fab fa-tiktok'      => 'TikTok',
			'fab fa-pinterest-p' => 'Pinterest',
			'fas fa-phone'       => 'Teléfono',
		];
	}

	public function render_content(): void {
		$icons = self::icon_options();
		$items = json_decode( (string) $this->value(), true );
		if ( ! is_array( $items ) ) {
			$items = [];
		}

		// Genera las <option> del select de iconos, marcando la seleccionada.
		$build_options = static function ( string $selected ) use ( $icons ): string {
			$out = '';
			foreach ( $icons as $val => $label ) {
				$out .= sprintf(
					'<option value="%s"%s>%s</option>',
					esc_attr( $val ),
					selected( $selected, $val, false ),
					esc_html( $label )
				);
			}
			return $out;
		};

		$row_style   = 'display:flex;gap:6px;align-items:center;margin-bottom:6px;';
		$del_style   = 'color:#b32d2e;font-size:18px;line-height:1;text-decoration:none;';
		$move_style  = 'flex:0 0 auto;display:inline-flex;flex-direction:column;line-height:1;';
		$arrow_style = 'cursor:pointer;color:#787c82;font-size:11px;line-height:1;text-decoration:none;padding:1px 2px;';
		?>
		<span class="customize-control-title"><?php echo esc_html( (string) $this->label ); ?></span>
		<?php if ( $this->description ) : ?>
			<span class="description customize-control-description"><?php echo esc_html( (string) $this->description ); ?></span>
		<?php endif; ?>

		<input type="hidden" class="respira-socials-value" <?php $this->link(); ?> value="<?php echo esc_attr( (string) $this->value() ); ?>">

		<ul class="respira-socials-rows" style="margin:10px 0;padding:0;list-style:none;">
			<?php foreach ( $items as $item ) : ?>
				<li class="respira-socials-row" style="<?php echo esc_attr( $row_style ); ?>">
					<span class="r-move" style="<?php echo esc_attr( $move_style ); ?>">
						<a href="#" class="r-up" title="<?php esc_attr_e( 'Subir', 'respira' ); ?>" style="<?php echo esc_attr( $arrow_style ); ?>">&#9650;</a>
						<a href="#" class="r-down" title="<?php esc_attr_e( 'Bajar', 'respira' ); ?>" style="<?php echo esc_attr( $arrow_style ); ?>">&#9660;</a>
					</span>
					<select class="r-icon" style="flex:0 0 96px;width:96px;max-width:96px;"><?php echo $build_options( (string) ( $item['icon'] ?? '' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></select>
					<input type="url" class="r-link" placeholder="https://..." value="<?php echo esc_url( (string) ( $item['link'] ?? '' ) ); ?>" style="flex:1;min-width:0;">
					<a href="#" class="r-del" title="<?php esc_attr_e( 'Quitar', 'respira' ); ?>" style="<?php echo esc_attr( $del_style ); ?>">&times;</a>
				</li>
			<?php endforeach; ?>
		</ul>
		<button type="button" class="button respira-socials-add"><?php esc_html_e( 'Agregar red social', 'respira' ); ?></button>

		<script type="text/html" class="respira-socials-tpl">
			<li class="respira-socials-row" style="<?php echo esc_attr( $row_style ); ?>">
				<span class="r-move" style="<?php echo esc_attr( $move_style ); ?>">
					<a href="#" class="r-up" title="<?php esc_attr_e( 'Subir', 'respira' ); ?>" style="<?php echo esc_attr( $arrow_style ); ?>">&#9650;</a>
					<a href="#" class="r-down" title="<?php esc_attr_e( 'Bajar', 'respira' ); ?>" style="<?php echo esc_attr( $arrow_style ); ?>">&#9660;</a>
				</span>
				<select class="r-icon" style="flex:0 0 96px;width:96px;max-width:96px;"><?php echo $build_options( '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></select>
				<input type="url" class="r-link" placeholder="https://..." value="" style="flex:1;min-width:0;">
				<a href="#" class="r-del" title="<?php esc_attr_e( 'Quitar', 'respira' ); ?>" style="<?php echo esc_attr( $del_style ); ?>">&times;</a>
			</li>
		</script>
		<?php
	}
}
