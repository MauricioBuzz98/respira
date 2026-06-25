import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Iconos disponibles para cada red/contacto (Font Awesome cargado por el tema).
const SOCIAL_ICONS = [
	{ label: 'WhatsApp', value: 'fab fa-whatsapp' },
	{ label: 'Email', value: 'fas fa-envelope' },
	{ label: 'Facebook', value: 'fab fa-facebook-f' },
	{ label: 'Waze', value: 'fab fa-waze' },
	{ label: 'Instagram', value: 'fab fa-instagram' },
	{ label: 'Teléfono', value: 'fas fa-phone' },
];

const EMPTY_SOCIAL = { text: '', link: '', icon: 'fab fa-whatsapp' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, socials = [] } = attributes;

	const blockProps = useBlockProps( { className: 'respira-contact-editor' } );

	const updateSocial = ( i, patch ) => {
		const next = socials.map( ( s, idx ) => ( idx === i ? { ...s, ...patch } : s ) );
		setAttributes( { socials: next } );
	};
	const addSocial = () => setAttributes( { socials: [ ...socials, { ...EMPTY_SOCIAL } ] } );
	const removeSocial = ( i ) => setAttributes( { socials: socials.filter( ( _, idx ) => idx !== i ) } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Subtítulo', 'respira' ) }
						value={ subtitle }
						onChange={ ( v ) => setAttributes( { subtitle: v } ) }
					/>
					<TextControl
						label={ __( 'Título', 'respira' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Texto', 'respira' ) }
						value={ text }
						onChange={ ( v ) => setAttributes( { text: v } ) }
						rows={ 3 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Redes / contacto', 'respira' ) } initialOpen={ true }>
					{ socials.map( ( s, i ) => (
						<div
							key={ i }
							style={ { border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 12 } }
						>
							<SelectControl
								label={ __( 'Icono', 'respira' ) }
								value={ s.icon }
								options={ SOCIAL_ICONS }
								onChange={ ( v ) => updateSocial( i, { icon: v } ) }
							/>
							<TextControl
								label={ __( 'Texto', 'respira' ) }
								value={ s.text }
								onChange={ ( v ) => updateSocial( i, { text: v } ) }
							/>
							<TextControl
								label={ __( 'Enlace', 'respira' ) }
								value={ s.link }
								onChange={ ( v ) => updateSocial( i, { link: v } ) }
							/>
							<Button isDestructive variant="link" onClick={ () => removeSocial( i ) }>
								{ __( 'Quitar', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addSocial }>
						{ __( 'Agregar red/contacto', 'respira' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { display: 'flex', gap: 24, flexWrap: 'wrap', border: '1px solid #e0e0e0', borderRadius: 8, padding: 24 } }>
					{ /* Izquierda: título + redes */ }
					<div style={ { flex: '1 1 240px', minWidth: 0 } }>
						{ subtitle && (
							<div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, color: '#5A514B', marginBottom: 4 } }>
								{ subtitle }
							</div>
						) }
						{ title && (
							<div style={ { fontSize: 24, fontWeight: 700, marginBottom: 8 } }>{ title }</div>
						) }
						{ text && <div style={ { opacity: 0.8, marginBottom: 16 } }>{ text }</div> }

						<ul style={ { listStyle: 'none', margin: '16px 0 0', padding: 0 } }>
							{ socials.length === 0 && (
								<li style={ { opacity: 0.6, fontStyle: 'italic' } }>
									{ __( 'Agregá redes/contacto desde el panel lateral.', 'respira' ) }
								</li>
							) }
							{ socials.map( ( s, i ) => (
								<li key={ i } style={ { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 } }>
									<span
										style={ {
											width: 40,
											height: 40,
											borderRadius: '50%',
											background: '#5A514B',
											color: '#F1F0EA',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										} }
									>
										<i className={ s.icon }></i>
									</span>
									<span>{ s.text || s.link || __( '(sin texto)', 'respira' ) }</span>
								</li>
							) ) }
						</ul>
					</div>

					{ /* Derecha: marcador del formulario */ }
					<div style={ { flex: '1 1 280px', minWidth: 0, background: '#5A514B', borderRadius: 8, padding: 20 } }>
						<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } }>
							<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
							<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
							<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
							<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
							<div style={ { gridColumn: '1 / -1', background: 'rgba(255,255,255,0.15)', height: 64, borderRadius: 4 } } />
						</div>
						<div style={ { marginTop: 12, background: '#F1F0EA', color: '#5A514B', display: 'inline-block', padding: '8px 16px', borderRadius: 4, fontWeight: 600 } }>
							{ __( 'Enviar mensaje', 'respira' ) }
						</div>
						<div style={ { marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)' } }>
							{ __( 'Formulario de marcador (estático)', 'respira' ) }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
