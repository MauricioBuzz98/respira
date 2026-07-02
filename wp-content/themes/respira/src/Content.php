<?php
/**
 * Custom Post Types + meta boxes (sin ACF) para contenido dinámico:
 * Proyectos, Equipo y Testimonios. Los bloques los consumen vía render.php.
 *
 * @package Respira
 */

declare(strict_types=1);

namespace Respira;

use WP_Post;
use WP_Term;

class Content {

	/** Prefijo de las meta keys. */
	public const PREFIX = '_respira_';

	/**
	 * Iconos disponibles (Font Awesome 6, presente en assets/css/fontawesome.css).
	 * ESPEJO de la lista JS en blocks/shared/icons.js (ICON_CHOICES): mantener
	 * ambas sincronizadas para que amenidades (CPT), niveles y puntos de interés
	 * (ubicación) ofrezcan exactamente los mismos iconos.
	 *
	 * @return array<int, array{icon:string,label:string}>
	 */
	public function icon_choices(): array {
		return [
			// Vivienda / interiores
			[ 'icon' => 'fa-solid fa-bed', 'label' => __( 'Dormitorio / Cama', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-bed-front', 'label' => __( 'Habitación', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-house-user', 'label' => __( 'Suite principal', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-person-dress', 'label' => __( 'Vestidor / Clóset', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-toilet', 'label' => __( 'Baño', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-bath', 'label' => __( 'Bañera / Tina', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-faucet', 'label' => __( 'Grifería', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-oven', 'label' => __( 'Cocina', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-sink', 'label' => __( 'Fregadero', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-blender', 'label' => __( 'Electrodomésticos', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-chair', 'label' => __( 'Comedor', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-tv', 'label' => __( 'Sala de TV', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-stairs', 'label' => __( 'Escaleras', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-door-closed', 'label' => __( 'Cuarto', 'respira' ) ],
			// Amenidades / áreas comunes
			[ 'icon' => 'fa-solid fa-person-swimming', 'label' => __( 'Piscina', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-hot-tub-person', 'label' => __( 'Jacuzzi', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-dumbbell', 'label' => __( 'Gimnasio', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-spa', 'label' => __( 'Spa / Bienestar', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-shower', 'label' => __( 'Duchas / Sauna', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-fire-flame-curved', 'label' => __( 'BBQ / Parrilla', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-baby-carriage', 'label' => __( 'Zona infantil', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-paw', 'label' => __( 'Pet friendly', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-user-shield', 'label' => __( 'Seguridad', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-video', 'label' => __( 'Cámaras / CCTV', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-square-parking', 'label' => __( 'Parqueo', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-charging-station', 'label' => __( 'Cargador EV', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-elevator', 'label' => __( 'Ascensor', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-wifi', 'label' => __( 'WiFi', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-laptop', 'label' => __( 'Coworking', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-couch', 'label' => __( 'Lounge / Sala', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-film', 'label' => __( 'Cine', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-gamepad', 'label' => __( 'Sala de juegos', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-bell-concierge', 'label' => __( 'Concierge', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-soap', 'label' => __( 'Lavandería', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-snowflake', 'label' => __( 'Aire acondicionado', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-solar-panel', 'label' => __( 'Panel solar', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-plug', 'label' => __( 'Energía', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-lightbulb', 'label' => __( 'Iluminación', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-warehouse', 'label' => __( 'Bodega', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-key', 'label' => __( 'Acceso / Llave', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-house', 'label' => __( 'Casa', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-door-open', 'label' => __( 'Entrada', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-wheelchair-move', 'label' => __( 'Accesible', 'respira' ) ],
			// Deporte / recreación
			[ 'icon' => 'fa-solid fa-bicycle', 'label' => __( 'Bici / Ciclovía', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-person-running', 'label' => __( 'Running', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-person-hiking', 'label' => __( 'Senderos', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-table-tennis-paddle-ball', 'label' => __( 'Tenis / Ping pong', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-futbol', 'label' => __( 'Fútbol', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-golf-ball-tee', 'label' => __( 'Golf', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-campground', 'label' => __( 'Fogata / Camping', 'respira' ) ],
			// Naturaleza / entorno
			[ 'icon' => 'fa-solid fa-tree', 'label' => __( 'Áreas verdes', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-leaf', 'label' => __( 'Naturaleza', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-seedling', 'label' => __( 'Jardín', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-sun', 'label' => __( 'Terraza / Sol', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-mountain', 'label' => __( 'Vista / Montaña', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-umbrella-beach', 'label' => __( 'Playa', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-droplet', 'label' => __( 'Agua', 'respira' ) ],
			// Puntos de interés (comercios y servicios)
			[ 'icon' => 'fa-solid fa-utensils', 'label' => __( 'Restaurantes', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-mug-hot', 'label' => __( 'Cafeterías', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-martini-glass', 'label' => __( 'Bares', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-wine-glass', 'label' => __( 'Vinos', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-bag-shopping', 'label' => __( 'Centros comerciales', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-cart-shopping', 'label' => __( 'Supermercados', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-store', 'label' => __( 'Tiendas', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-briefcase-medical', 'label' => __( 'Salud / Conveniencia', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-hospital', 'label' => __( 'Hospital', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-heart-pulse', 'label' => __( 'Clínica', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-stethoscope', 'label' => __( 'Consultorio', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-graduation-cap', 'label' => __( 'Educación', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-school', 'label' => __( 'Colegios', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-book', 'label' => __( 'Biblioteca', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-landmark', 'label' => __( 'Banco / Institución', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-church', 'label' => __( 'Iglesia', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-plane', 'label' => __( 'Aeropuerto', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-bus', 'label' => __( 'Transporte', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-car', 'label' => __( 'Auto / Vías', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-city', 'label' => __( 'Ciudad', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-location-dot', 'label' => __( 'General', 'respira' ) ],
			[ 'icon' => 'fa-solid fa-map-location-dot', 'label' => __( 'Mapa', 'respira' ) ],
		];
	}

	public function __construct() {
		add_action( 'init', [ $this, 'register_taxonomies' ], 9 );
		add_action( 'init', [ $this, 'register_post_types' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_meta_boxes' ] );
		add_action( 'save_post', [ $this, 'save_meta' ], 10, 2 );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_assets' ] );

		// Imagen de la categoría de proyecto (term meta).
		add_action( 'proyecto_categoria_add_form_fields', [ $this, 'term_add_image_field' ] );
		add_action( 'proyecto_categoria_edit_form_fields', [ $this, 'term_edit_image_field' ] );
		add_action( 'created_proyecto_categoria', [ $this, 'save_term_image' ] );
		add_action( 'edited_proyecto_categoria', [ $this, 'save_term_image' ] );
	}

	/**
	 * Encola los assets del admin:
	 *  - Amenidades (post.php/post-new.php): fuente flaticon + preview del ícono.
	 *  - Amenidades y Categorías de proyecto: selector de medios (wp.media) para
	 *    los campos tipo imagen.
	 */
	public function admin_assets( string $hook ): void {
		$screen = get_current_screen();
		if ( ! $screen ) {
			return;
		}

		$is_amenidad_edit = in_array( $hook, [ 'post.php', 'post-new.php' ], true ) && 'amenidades' === $screen->post_type;
		$is_term_edit     = in_array( $hook, [ 'edit-tags.php', 'term.php' ], true ) && 'proyecto_categoria' === ( $screen->taxonomy ?? '' );

		if ( ! $is_amenidad_edit && ! $is_term_edit ) {
			return;
		}

		// Selector de imagen (campos tipo 'image'): amenidades y categorías.
		wp_enqueue_media();
		wp_add_inline_script( 'jquery', $this->image_picker_js() );

		// Solo amenidades: Font Awesome + selector visual (grilla) con preview.
		if ( $is_amenidad_edit ) {
			wp_enqueue_style(
				'respira-fontawesome-admin',
				get_template_directory_uri() . '/assets/css/fontawesome.css',
				[],
				'1.0.0'
			);
			wp_add_inline_style( 'respira-fontawesome-admin', $this->icon_picker_css() );
			wp_add_inline_script( 'jquery', $this->icon_picker_js() );
		}
	}

	/** CSS del selector visual de iconos (grilla) del metabox de amenidades. */
	private function icon_picker_css(): string {
		return '.respira-icon-picker .respira-icon-grid{display:flex;flex-wrap:wrap;gap:6px;max-height:180px;overflow-y:auto;padding:2px;margin-bottom:8px;border:1px solid #e0ded8;border-radius:6px;background:#fff;}' .
			'.respira-icon-picker .respira-icon-btn{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;font-size:15px;color:#5A514B;border:1px solid #d0cdc6;background:#fff;}' .
			'.respira-icon-picker .respira-icon-btn.is-active{border:2px solid #5A514B;background:#efece6;}' .
			'.respira-icon-picker .respira-icon-input{max-width:320px;margin-bottom:6px;}' .
			'.respira-icon-picker .respira-icon-preview-chip{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#5A514B;color:#F1F0EA;font-size:14px;}';
	}

	/** JS (delegado) del selector visual de iconos: clic en grilla + preview en vivo. */
	private function icon_picker_js(): string {
		return "(function(){function sync(p){var box=p.closest('.respira-icon-picker');if(!box)return;var v=p.value.trim();" .
			"var chip=box.querySelector('.respira-icon-preview-chip i');if(chip){chip.className=v;}" .
			"box.querySelectorAll('.respira-icon-btn').forEach(function(b){b.classList.toggle('is-active',b.getAttribute('data-icon')===v);});}" .
			"document.addEventListener('click',function(e){var b=e.target.closest('.respira-icon-btn');if(!b)return;e.preventDefault();" .
			"var box=b.closest('.respira-icon-picker');var inp=box&&box.querySelector('.respira-icon-input');if(inp){inp.value=b.getAttribute('data-icon');sync(inp);}});" .
			"document.addEventListener('input',function(e){if(e.target&&e.target.classList.contains('respira-icon-input')){sync(e.target);}});})();";
	}

	/**
	 * JS (delegado por jQuery) del selector de imagen para los campos
	 * `.respira-image-field` (meta box de amenidades y formularios de categoría).
	 */
	private function image_picker_js(): string {
		return "(function($){function fld(el){return $(el).closest('.respira-image-field');}" .
			"$(document).on('click','.respira-image-select',function(e){e.preventDefault();var w=fld(this);" .
			"var frame=wp.media({title:'" . esc_js( __( 'Seleccionar imagen', 'respira' ) ) . "',button:{text:'" . esc_js( __( 'Usar imagen', 'respira' ) ) . "'},library:{type:'image'},multiple:false});" .
			"frame.on('select',function(){var a=frame.state().get('selection').first().toJSON();" .
			"w.find('input.respira-image-id').val(a.id);" .
			"var u=(a.sizes&&a.sizes.thumbnail)?a.sizes.thumbnail.url:a.url;" .
			"w.find('.respira-image-preview').html('<img src=\"'+u+'\" style=\"max-width:120px;height:auto;display:block;border:1px solid #ddd;border-radius:6px;\">');" .
			"w.find('.respira-image-remove').show();});frame.open();});" .
			"$(document).on('click','.respira-image-remove',function(e){e.preventDefault();var w=fld(this);" .
			"w.find('input.respira-image-id').val('');w.find('.respira-image-preview').empty();$(this).hide();});})(jQuery);";
	}

	/** Campo "Imagen" en el formulario de ALTA de categoría de proyecto. */
	public function term_add_image_field(): void {
		?>
		<div class="form-field respira-term-image">
			<label><?php esc_html_e( 'Imagen de la categoría', 'respira' ); ?></label>
			<span class="respira-image-field" style="display:block;">
				<input type="hidden" name="respira_term_image" class="respira-image-id" value="">
				<span class="respira-image-preview" style="display:block;margin-bottom:6px;"></span>
				<button type="button" class="button respira-image-select"><?php esc_html_e( 'Seleccionar imagen', 'respira' ); ?></button>
				<button type="button" class="button-link respira-image-remove" style="display:none;"><?php esc_html_e( 'Quitar imagen', 'respira' ); ?></button>
			</span>
			<p class="description"><?php esc_html_e( 'Se muestra en las cards del bloque Proyectos y como fondo del encabezado del listado de la categoría.', 'respira' ); ?></p>
		</div>
		<?php
	}

	/** Campo "Imagen" en el formulario de EDICIÓN de categoría de proyecto. */
	public function term_edit_image_field( WP_Term $term ): void {
		$att_id  = (int) get_term_meta( $term->term_id, self::PREFIX . 'image', true );
		$img_url = $att_id ? (string) wp_get_attachment_image_url( $att_id, 'medium' ) : '';
		?>
		<tr class="form-field respira-term-image">
			<th scope="row"><label><?php esc_html_e( 'Imagen de la categoría', 'respira' ); ?></label></th>
			<td>
				<span class="respira-image-field" style="display:block;">
					<input type="hidden" name="respira_term_image" class="respira-image-id" value="<?php echo esc_attr( (string) $att_id ); ?>">
					<span class="respira-image-preview" style="display:block;margin-bottom:6px;">
						<?php if ( '' !== $img_url ) : ?>
							<img src="<?php echo esc_url( $img_url ); ?>" style="max-width:200px;height:auto;display:block;border:1px solid #ddd;border-radius:6px;">
						<?php endif; ?>
					</span>
					<button type="button" class="button respira-image-select"><?php esc_html_e( 'Seleccionar imagen', 'respira' ); ?></button>
					<button type="button" class="button-link respira-image-remove" style="<?php echo $att_id ? '' : 'display:none;'; ?>"><?php esc_html_e( 'Quitar imagen', 'respira' ); ?></button>
				</span>
				<p class="description"><?php esc_html_e( 'Se muestra en las cards del bloque Proyectos y como fondo del encabezado del listado de la categoría.', 'respira' ); ?></p>
			</td>
		</tr>
		<?php
	}

	/**
	 * Guarda la imagen de la categoría (term meta). Los hooks created_/edited_
	 * de WP se disparan tras validar el nonce del formulario del término.
	 */
	public function save_term_image( int $term_id ): void {
		if ( ! current_user_can( 'manage_categories' ) ) {
			return;
		}
		if ( ! isset( $_POST['respira_term_image'] ) ) {
			return;
		}
		$att_id = absint( wp_unslash( $_POST['respira_term_image'] ) );
		if ( $att_id ) {
			update_term_meta( $term_id, self::PREFIX . 'image', $att_id );
		} else {
			delete_term_meta( $term_id, self::PREFIX . 'image' );
		}
	}

	/**
	 * Taxonomías personalizadas.
	 */
	public function register_taxonomies(): void {
		register_taxonomy( 'proyecto_categoria', [ 'proyecto' ], [
			'labels'            => [
				'name'          => __( 'Categorías de proyecto', 'respira' ),
				'singular_name' => __( 'Categoría de proyecto', 'respira' ),
				'menu_name'     => __( 'Categorías', 'respira' ),
				'all_items'     => __( 'Todas las categorías', 'respira' ),
				'add_new_item'  => __( 'Añadir categoría', 'respira' ),
				'edit_item'     => __( 'Editar categoría', 'respira' ),
				'search_items'  => __( 'Buscar categorías', 'respira' ),
			],
			'hierarchical'      => true,
			'public'            => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => [ 'slug' => 'tipo-proyecto' ],
		] );
	}

	/**
	 * Campos meta por tipo de contenido.
	 *
	 * @return array<string, array<string, array{label:string,type:string}>>
	 */
	public function fields(): array {
		return [
			'proyecto'   => [
				'subtitle' => [ 'label' => __( 'Subtítulo / categoría', 'respira' ), 'type' => 'text' ],
				'date'     => [ 'label' => __( 'Fecha', 'respira' ), 'type' => 'text' ],
				'client'   => [ 'label' => __( 'Cliente', 'respira' ), 'type' => 'text' ],
				'website'  => [ 'label' => __( 'Sitio web', 'respira' ), 'type' => 'text' ],
				'location' => [ 'label' => __( 'Ubicación', 'respira' ), 'type' => 'text' ],
				'value'    => [ 'label' => __( 'Valor', 'respira' ), 'type' => 'text' ],
			],
			'miembro'    => [
				'designation' => [ 'label' => __( 'Cargo', 'respira' ), 'type' => 'text' ],
				'facebook'    => [ 'label' => __( 'Facebook (URL)', 'respira' ), 'type' => 'url' ],
				'twitter'     => [ 'label' => __( 'Twitter / X (URL)', 'respira' ), 'type' => 'url' ],
				'instagram'   => [ 'label' => __( 'Instagram (URL)', 'respira' ), 'type' => 'url' ],
			],
			'testimonio' => [
				'designation' => [ 'label' => __( 'Cargo / empresa', 'respira' ), 'type' => 'text' ],
				'rating'      => [ 'label' => __( 'Estrellas (1-5)', 'respira' ), 'type' => 'number' ],
			],
			'amenidades' => [
				'icon'       => [ 'label' => __( 'Ícono', 'respira' ), 'type' => 'icon' ],
				'icon_image' => [ 'label' => __( 'Imagen (opcional, reemplaza al ícono)', 'respira' ), 'type' => 'image' ],
			],
		];
	}

	public function register_post_types(): void {
		register_post_type( 'proyecto', [
			'labels'       => $this->labels( __( 'Proyecto', 'respira' ), __( 'Proyectos', 'respira' ) ),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-portfolio',
			'menu_position'=> 20,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'proyectos' ],
		] );

		register_post_type( 'miembro', [
			'labels'       => $this->labels( __( 'Miembro', 'respira' ), __( 'Equipo', 'respira' ) ),
			'public'       => true,
			'has_archive'  => false,
			'menu_icon'    => 'dashicons-groups',
			'menu_position'=> 21,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'equipo' ],
		] );

		register_post_type( 'testimonio', [
			'labels'       => $this->labels( __( 'Testimonio', 'respira' ), __( 'Testimonios', 'respira' ) ),
			'public'       => true,
			'has_archive'  => false,
			'menu_icon'    => 'dashicons-format-quote',
			'menu_position'=> 22,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'testimonios' ],
		] );

		register_post_type( 'amenidades', [
			'labels'       => $this->labels( __( 'Amenidad', 'respira' ), __( 'Amenidades', 'respira' ) ),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-screenoptions',
			'menu_position'=> 23,
			'show_in_rest' => true,
			'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
			'rewrite'      => [ 'slug' => 'amenidades' ],
		] );

		// Flush de reglas de reescritura una sola vez tras registrar los CPTs,
		// para que sus URLs (/proyectos/, /amenidades/...) funcionen sin pasos manuales.
		if ( '4' !== get_option( 'respira_rewrite_version' ) ) {
			flush_rewrite_rules( false );
			update_option( 'respira_rewrite_version', '4' );
		}
	}

	/**
	 * Genera el set de labels de un CPT.
	 */
	private function labels( string $singular, string $plural ): array {
		return [
			'name'          => $plural,
			'singular_name' => $singular,
			'add_new'       => __( 'Añadir nuevo', 'respira' ),
			'add_new_item'  => sprintf( __( 'Añadir %s', 'respira' ), $singular ),
			'edit_item'     => sprintf( __( 'Editar %s', 'respira' ), $singular ),
			'new_item'      => sprintf( __( 'Nuevo %s', 'respira' ), $singular ),
			'view_item'     => sprintf( __( 'Ver %s', 'respira' ), $singular ),
			'search_items'  => sprintf( __( 'Buscar %s', 'respira' ), $plural ),
			'not_found'     => __( 'No se encontró nada', 'respira' ),
			'menu_name'     => $plural,
		];
	}

	public function add_meta_boxes(): void {
		foreach ( array_keys( $this->fields() ) as $cpt ) {
			add_meta_box(
				'respira_details_' . $cpt,
				__( 'Detalles', 'respira' ),
				[ $this, 'render_meta_box' ],
				$cpt,
				'normal',
				'high'
			);
		}
	}

	public function render_meta_box( WP_Post $post ): void {
		$fields = $this->fields()[ $post->post_type ] ?? [];
		if ( ! $fields ) {
			return;
		}
		wp_nonce_field( 'respira_save_meta', 'respira_meta_nonce' );

		echo '<div style="display:grid;gap:12px;max-width:640px;">';
		foreach ( $fields as $key => $cfg ) {
			$value = (string) get_post_meta( $post->ID, self::PREFIX . $key, true );
			$id    = 'respira_' . $key;
			printf( '<p style="margin:0;"><label for="%s" style="display:block;font-weight:600;margin-bottom:4px;">%s</label>', esc_attr( $id ), esc_html( $cfg['label'] ) );
			if ( 'number' === $cfg['type'] ) {
				printf(
					'<input type="number" min="0" max="5" step="1" id="%s" name="%s" value="%s" class="small-text">',
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( $value )
				);
			} elseif ( 'icon' === $cfg['type'] ) {
				echo '<span class="respira-icon-picker" style="display:block;">';
				// Grilla de iconos (glifos reales) para elegir con un clic.
				echo '<span class="respira-icon-grid">';
				foreach ( $this->icon_choices() as $ch ) {
					printf(
						'<button type="button" class="respira-icon-btn%1$s" data-icon="%2$s" title="%3$s" aria-label="%3$s"><i class="%2$s"></i></button>',
						$value === $ch['icon'] ? ' is-active' : '',
						esc_attr( $ch['icon'] ),
						esc_attr( $ch['label'] )
					);
				}
				echo '</span>';
				// Campo de texto (permite cualquier clase Font Awesome) + preview.
				printf(
					'<input type="text" id="%1$s" name="%2$s" value="%3$s" class="widefat respira-icon-input" placeholder="fa-solid fa-...">',
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( $value )
				);
				printf(
					'<span class="respira-icon-preview" style="display:inline-flex;align-items:center;gap:8px;"><span class="respira-icon-preview-chip"><i class="%s"></i></span><span class="description">%s</span></span>',
					esc_attr( $value ),
					esc_html__( 'Vista previa. Dejá el campo vacío para no mostrar ícono.', 'respira' )
				);
				echo '</span>';
			} elseif ( 'image' === $cfg['type'] ) {
				$att_id  = absint( $value );
				$img_url = $att_id ? (string) wp_get_attachment_image_url( $att_id, 'thumbnail' ) : '';
				printf( '<span class="respira-image-field" style="display:block;">' );
				printf(
					'<input type="hidden" id="%s" name="%s" value="%s" class="respira-image-id">',
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( (string) $att_id )
				);
				echo '<span class="respira-image-preview" style="display:block;margin-bottom:6px;">';
				if ( '' !== $img_url ) {
					printf( '<img src="%s" style="max-width:90px;height:auto;display:block;border:1px solid #ddd;border-radius:6px;">', esc_url( $img_url ) );
				}
				echo '</span>';
				printf(
					'<button type="button" class="button respira-image-select">%s</button> ',
					esc_html__( 'Seleccionar imagen', 'respira' )
				);
				printf(
					'<button type="button" class="button-link respira-image-remove" style="%s">%s</button>',
					$att_id ? '' : 'display:none;',
					esc_html__( 'Quitar imagen', 'respira' )
				);
				echo '</span>';
			} else {
				printf(
					'<input type="%s" id="%s" name="%s" value="%s" class="widefat">',
					esc_attr( 'url' === $cfg['type'] ? 'url' : 'text' ),
					esc_attr( $id ),
					esc_attr( self::PREFIX . $key ),
					esc_attr( $value )
				);
			}
			echo '</p>';
		}
		echo '</div>';
	}

	public function save_meta( int $post_id, WP_Post $post ): void {
		$fields = $this->fields()[ $post->post_type ] ?? [];
		if ( ! $fields ) {
			return;
		}
		if ( ! isset( $_POST['respira_meta_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['respira_meta_nonce'] ), 'respira_save_meta' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		foreach ( $fields as $key => $cfg ) {
			$meta_key = self::PREFIX . $key;
			$raw      = $_POST[ $meta_key ] ?? '';
			if ( 'number' === $cfg['type'] ) {
				$clean = (string) max( 0, min( 5, (int) $raw ) );
			} elseif ( 'image' === $cfg['type'] ) {
				$clean = (string) absint( $raw );
			} elseif ( 'url' === $cfg['type'] ) {
				$clean = esc_url_raw( wp_unslash( (string) $raw ) );
			} else {
				$clean = sanitize_text_field( wp_unslash( (string) $raw ) );
			}
			update_post_meta( $post_id, $meta_key, $clean );
		}
	}
}
