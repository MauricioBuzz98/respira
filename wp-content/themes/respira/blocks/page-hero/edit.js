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
	SelectControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { imageId, imageUrl, subtitle, title, text, ctaLabel, ctaUrl, align } = attributes;
	const blockProps = useBlockProps( { className: 'respira-page-hero-editor' } );

	const justify = align === 'left' ? 'flex-start' : 'center';
	const textAlign = align === 'left' ? 'left' : 'center';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Imagen de fondo', 'respira' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<div>
									{ imageUrl && (
										<img src={ imageUrl } alt="" style={ { width: '100%', borderRadius: 4, marginBottom: 8 } } />
									) }
									<Button variant={ imageUrl ? 'secondary' : 'primary' } onClick={ open }>
										{ imageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ imageUrl && (
										<Button isDestructive variant="link" onClick={ () => setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } ) } style={ { display: 'block', marginTop: 4 } }>
											{ __( 'Quitar imagen', 'respira' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={ __( 'Contenido', 'respira' ) } initialOpen={ true }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } rows={ 4 } />
					<SelectControl
						label={ __( 'Alineación del contenido', 'respira' ) }
						value={ align }
						options={ [
							{ label: __( 'Centrado', 'respira' ), value: 'center' },
							{ label: __( 'Izquierda', 'respira' ), value: 'left' },
						] }
						onChange={ ( v ) => setAttributes( { align: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Botón', 'respira' ) } initialOpen={ false }>
					<TextControl label={ __( 'Texto del botón', 'respira' ) } value={ ctaLabel } onChange={ ( v ) => setAttributes( { ctaLabel: v } ) } />
					<TextControl label={ __( 'URL del botón', 'respira' ) } value={ ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } />
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					style={ {
						position: 'relative',
						minHeight: 320,
						borderRadius: 8,
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: justify,
						padding: 40,
						backgroundColor: '#5A514B',
						backgroundImage: imageUrl ? `url(${ imageUrl })` : 'none',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					} }
				>
					<div style={ { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' } } />
					<div style={ { position: 'relative', maxWidth: 720, textAlign, color: '#fff' } }>
						{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, marginBottom: 8 } }>{ subtitle }</div> }
						{ title && <div style={ { fontSize: 40, fontWeight: 700, lineHeight: 1.1 } }>{ title }</div> }
						{ text && <div style={ { marginTop: 12, fontSize: 16, opacity: 0.9 } }>{ text }</div> }
						{ ctaLabel && (
							<div style={ { marginTop: 16, display: 'inline-block', background: '#F1F0EA', color: '#5A514B', padding: '10px 20px', borderRadius: 4, fontWeight: 600 } }>
								{ ctaLabel }
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
