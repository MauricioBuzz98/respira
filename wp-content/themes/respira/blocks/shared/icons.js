/**
 * Lista de iconos compartida (Font Awesome 6, presente en la fuente del tema en
 * assets/css/fontawesome.css) + componente <IconPicker> reutilizable.
 *
 * La usan los bloques respira/ubicacion y respira/proyecto-niveles, y su versión
 * PHP espejo la usa el metabox del CPT Amenidades.
 *
 * IMPORTANTE: mantener esta lista sincronizada con Respira\Content::icon_choices()
 * (src/Content.php) para que amenidades (CPT), niveles (bloque) y puntos de
 * interés (ubicación) ofrezcan exactamente los mismos iconos.
 *
 * @package Respira
 */

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// { icon: 'clase Font Awesome', label: 'guía en el selector' }
export const ICON_CHOICES = [
	// Vivienda / interiores
	{ icon: 'fa-solid fa-bed', label: __( 'Dormitorio / Cama', 'respira' ) },
	{ icon: 'fa-solid fa-bed-front', label: __( 'Habitación', 'respira' ) },
	{ icon: 'fa-solid fa-house-user', label: __( 'Suite principal', 'respira' ) },
	{ icon: 'fa-solid fa-person-dress', label: __( 'Vestidor / Clóset', 'respira' ) },
	{ icon: 'fa-solid fa-toilet', label: __( 'Baño', 'respira' ) },
	{ icon: 'fa-solid fa-bath', label: __( 'Bañera / Tina', 'respira' ) },
	{ icon: 'fa-solid fa-faucet', label: __( 'Grifería', 'respira' ) },
	{ icon: 'fa-solid fa-oven', label: __( 'Cocina', 'respira' ) },
	{ icon: 'fa-solid fa-sink', label: __( 'Fregadero', 'respira' ) },
	{ icon: 'fa-solid fa-blender', label: __( 'Electrodomésticos', 'respira' ) },
	{ icon: 'fa-solid fa-chair', label: __( 'Comedor', 'respira' ) },
	{ icon: 'fa-solid fa-tv', label: __( 'Sala de TV', 'respira' ) },
	{ icon: 'fa-solid fa-stairs', label: __( 'Escaleras', 'respira' ) },
	{ icon: 'fa-solid fa-door-closed', label: __( 'Cuarto', 'respira' ) },
	// Amenidades / áreas comunes
	{ icon: 'fa-solid fa-person-swimming', label: __( 'Piscina', 'respira' ) },
	{ icon: 'fa-solid fa-hot-tub-person', label: __( 'Jacuzzi', 'respira' ) },
	{ icon: 'fa-solid fa-dumbbell', label: __( 'Gimnasio', 'respira' ) },
	{ icon: 'fa-solid fa-spa', label: __( 'Spa / Bienestar', 'respira' ) },
	{ icon: 'fa-solid fa-shower', label: __( 'Duchas / Sauna', 'respira' ) },
	{ icon: 'fa-solid fa-fire-flame-curved', label: __( 'BBQ / Parrilla', 'respira' ) },
	{ icon: 'fa-solid fa-baby-carriage', label: __( 'Zona infantil', 'respira' ) },
	{ icon: 'fa-solid fa-paw', label: __( 'Pet friendly', 'respira' ) },
	{ icon: 'fa-solid fa-user-shield', label: __( 'Seguridad', 'respira' ) },
	{ icon: 'fa-solid fa-video', label: __( 'Cámaras / CCTV', 'respira' ) },
	{ icon: 'fa-solid fa-square-parking', label: __( 'Parqueo', 'respira' ) },
	{ icon: 'fa-solid fa-charging-station', label: __( 'Cargador EV', 'respira' ) },
	{ icon: 'fa-solid fa-elevator', label: __( 'Ascensor', 'respira' ) },
	{ icon: 'fa-solid fa-wifi', label: __( 'WiFi', 'respira' ) },
	{ icon: 'fa-solid fa-laptop', label: __( 'Coworking', 'respira' ) },
	{ icon: 'fa-solid fa-couch', label: __( 'Lounge / Sala', 'respira' ) },
	{ icon: 'fa-solid fa-film', label: __( 'Cine', 'respira' ) },
	{ icon: 'fa-solid fa-gamepad', label: __( 'Sala de juegos', 'respira' ) },
	{ icon: 'fa-solid fa-bell-concierge', label: __( 'Concierge', 'respira' ) },
	{ icon: 'fa-solid fa-soap', label: __( 'Lavandería', 'respira' ) },
	{ icon: 'fa-solid fa-snowflake', label: __( 'Aire acondicionado', 'respira' ) },
	{ icon: 'fa-solid fa-solar-panel', label: __( 'Panel solar', 'respira' ) },
	{ icon: 'fa-solid fa-plug', label: __( 'Energía', 'respira' ) },
	{ icon: 'fa-solid fa-lightbulb', label: __( 'Iluminación', 'respira' ) },
	{ icon: 'fa-solid fa-warehouse', label: __( 'Bodega', 'respira' ) },
	{ icon: 'fa-solid fa-key', label: __( 'Acceso / Llave', 'respira' ) },
	{ icon: 'fa-solid fa-house', label: __( 'Casa', 'respira' ) },
	{ icon: 'fa-solid fa-door-open', label: __( 'Entrada', 'respira' ) },
	{ icon: 'fa-solid fa-wheelchair-move', label: __( 'Accesible', 'respira' ) },
	// Deporte / recreación
	{ icon: 'fa-solid fa-bicycle', label: __( 'Bici / Ciclovía', 'respira' ) },
	{ icon: 'fa-solid fa-person-running', label: __( 'Running', 'respira' ) },
	{ icon: 'fa-solid fa-person-hiking', label: __( 'Senderos', 'respira' ) },
	{ icon: 'fa-solid fa-table-tennis-paddle-ball', label: __( 'Tenis / Ping pong', 'respira' ) },
	{ icon: 'fa-solid fa-futbol', label: __( 'Fútbol', 'respira' ) },
	{ icon: 'fa-solid fa-golf-ball-tee', label: __( 'Golf', 'respira' ) },
	{ icon: 'fa-solid fa-campground', label: __( 'Fogata / Camping', 'respira' ) },
	// Naturaleza / entorno
	{ icon: 'fa-solid fa-tree', label: __( 'Áreas verdes', 'respira' ) },
	{ icon: 'fa-solid fa-leaf', label: __( 'Naturaleza', 'respira' ) },
	{ icon: 'fa-solid fa-seedling', label: __( 'Jardín', 'respira' ) },
	{ icon: 'fa-solid fa-sun', label: __( 'Terraza / Sol', 'respira' ) },
	{ icon: 'fa-solid fa-mountain', label: __( 'Vista / Montaña', 'respira' ) },
	{ icon: 'fa-solid fa-umbrella-beach', label: __( 'Playa', 'respira' ) },
	{ icon: 'fa-solid fa-droplet', label: __( 'Agua', 'respira' ) },
	// Puntos de interés (comercios y servicios)
	{ icon: 'fa-solid fa-utensils', label: __( 'Restaurantes', 'respira' ) },
	{ icon: 'fa-solid fa-mug-hot', label: __( 'Cafeterías', 'respira' ) },
	{ icon: 'fa-solid fa-martini-glass', label: __( 'Bares', 'respira' ) },
	{ icon: 'fa-solid fa-wine-glass', label: __( 'Vinos', 'respira' ) },
	{ icon: 'fa-solid fa-bag-shopping', label: __( 'Centros comerciales', 'respira' ) },
	{ icon: 'fa-solid fa-cart-shopping', label: __( 'Supermercados', 'respira' ) },
	{ icon: 'fa-solid fa-store', label: __( 'Tiendas', 'respira' ) },
	{ icon: 'fa-solid fa-briefcase-medical', label: __( 'Salud / Conveniencia', 'respira' ) },
	{ icon: 'fa-solid fa-hospital', label: __( 'Hospital', 'respira' ) },
	{ icon: 'fa-solid fa-heart-pulse', label: __( 'Clínica', 'respira' ) },
	{ icon: 'fa-solid fa-stethoscope', label: __( 'Consultorio', 'respira' ) },
	{ icon: 'fa-solid fa-graduation-cap', label: __( 'Educación', 'respira' ) },
	{ icon: 'fa-solid fa-school', label: __( 'Colegios', 'respira' ) },
	{ icon: 'fa-solid fa-book', label: __( 'Biblioteca', 'respira' ) },
	{ icon: 'fa-solid fa-landmark', label: __( 'Banco / Institución', 'respira' ) },
	{ icon: 'fa-solid fa-church', label: __( 'Iglesia', 'respira' ) },
	{ icon: 'fa-solid fa-plane', label: __( 'Aeropuerto', 'respira' ) },
	{ icon: 'fa-solid fa-bus', label: __( 'Transporte', 'respira' ) },
	{ icon: 'fa-solid fa-car', label: __( 'Auto / Vías', 'respira' ) },
	{ icon: 'fa-solid fa-city', label: __( 'Ciudad', 'respira' ) },
	{ icon: 'fa-solid fa-location-dot', label: __( 'General', 'respira' ) },
	{ icon: 'fa-solid fa-map-location-dot', label: __( 'Mapa', 'respira' ) },
];

/**
 * Selector visual de iconos: grilla clicable (glifos reales) + campo de texto
 * para escribir cualquier clase + vista previa del ícono activo.
 *
 * @param {Object}   props
 * @param {string}   props.value    Clase Font Awesome actual.
 * @param {Function} props.onChange Recibe la nueva clase.
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.help]   Texto de ayuda del campo de texto.
 */
export function IconPicker( { value, onChange, disabled = false, help } ) {
	return (
		<div style={ { opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' } }>
			<div style={ { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.7, marginBottom: 6 } }>
				{ __( 'Ícono — elegí uno o escribí la clase', 'respira' ) }
			</div>
			<div style={ { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, maxHeight: 168, overflowY: 'auto', padding: 2 } }>
				{ ICON_CHOICES.map( ( opt ) => {
					const active = value === opt.icon;
					return (
						<button
							type="button"
							key={ opt.icon }
							onClick={ () => onChange( opt.icon ) }
							title={ `${ opt.label } — ${ opt.icon }` }
							aria-label={ opt.label }
							aria-pressed={ active }
							style={ {
								width: 34,
								height: 34,
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 6,
								cursor: 'pointer',
								fontSize: 15,
								color: '#5A514B',
								border: active ? '2px solid #5A514B' : '1px solid #d0cdc6',
								background: active ? '#efece6' : '#fff',
							} }
						>
							<i className={ opt.icon } aria-hidden="true" />
						</button>
					);
				} ) }
			</div>
			<TextControl
				label={ __( 'Clase Font Awesome del ícono', 'respira' ) }
				value={ value }
				onChange={ onChange }
				help={ help || __( 'Se llena al elegir arriba. Podés escribir cualquier clase, p. ej. fa-solid fa-tree. Más iconos en fontawesome.com/icons.', 'respira' ) }
			/>
			{ value && (
				<div style={ { display: 'flex', alignItems: 'center', gap: 8, margin: '-4px 0 10px', fontSize: 12, color: '#5A514B' } }>
					<span style={ {
						width: 30,
						height: 30,
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '50%',
						background: '#5A514B',
						color: '#F1F0EA',
						fontSize: 14,
					} }>
						<i className={ value } aria-hidden="true" />
					</span>
					<span>{ __( 'Vista previa', 'respira' ) }</span>
				</div>
			) }
		</div>
	);
}
