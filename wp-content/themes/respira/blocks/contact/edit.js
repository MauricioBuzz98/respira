import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, bgImageId, bgImageUrl } = attributes;

	const blockProps = useBlockProps( {
		className: 'respira-contact-editor',
	} );

	const previewStyle = {
		position: 'relative',
		minHeight: '320px',
		borderRadius: '8px',
		overflow: 'hidden',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '40px',
		color: '#fff',
		backgroundColor: '#222',
		backgroundImage: bgImageUrl ? `url(${ bgImageUrl })` : 'none',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};

	const overlayStyle = {
		position: 'absolute',
		inset: 0,
		background: 'rgba(0,0,0,0.45)',
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Imagen de fondo', 'respira' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									bgImageId: media.id,
									bgImageUrl: media.url,
									bgImageAlt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ bgImageId }
							render={ ( { open } ) => (
								<div>
									{ bgImageUrl && (
										<img
											src={ bgImageUrl }
											alt=""
											style={ { width: '100%', borderRadius: '4px', marginBottom: '8px' } }
										/>
									) }
									<Button variant={ bgImageUrl ? 'secondary' : 'primary' } onClick={ open }>
										{ bgImageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ bgImageUrl && (
										<Button
											isDestructive
											variant="link"
											onClick={ () =>
												setAttributes( { bgImageId: 0, bgImageUrl: '', bgImageAlt: '' } )
											}
											style={ { display: 'block', marginTop: '4px' } }
										>
											{ __( 'Quitar imagen', 'respira' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={ __( 'Encabezado', 'respira' ) }>
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
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ previewStyle }>
					<div style={ overlayStyle } />
					<div style={ { position: 'relative', maxWidth: '480px', width: '100%' } }>
						{ subtitle && (
							<div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>
								{ subtitle }
							</div>
						) }
						{ title && (
							<div style={ { fontSize: 24, fontWeight: 700, margin: '4px 0 8px' } }>
								{ title }
							</div>
						) }
						{ text && <div style={ { opacity: 0.85, marginBottom: 16 } }>{ text }</div> }

						<div style={ { background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: 8, padding: 16 } }>
							<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } }>
								<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
								<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
								<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
								<div style={ { background: 'rgba(255,255,255,0.15)', height: 32, borderRadius: 4 } } />
								<div style={ { gridColumn: '1 / -1', background: 'rgba(255,255,255,0.15)', height: 64, borderRadius: 4 } } />
							</div>
							<div style={ { marginTop: 12, background: '#1c8a5b', color: '#fff', display: 'inline-block', padding: '8px 16px', borderRadius: 4, fontWeight: 600 } }>
								{ __( 'Enviar mensaje', 'respira' ) }
							</div>
							<div style={ { marginTop: 8, fontSize: 11, opacity: 0.7 } }>
								{ __( 'Formulario de marcador (estático)', 'respira' ) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
