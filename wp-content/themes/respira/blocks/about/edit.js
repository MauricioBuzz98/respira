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
	const {
		image1Id,
		image1Url,
		image2Id,
		image2Url,
		badgeText,
		subtitle,
		title,
		text,
		feature1Icon,
		feature1Title,
		feature1Text,
		feature2Icon,
		feature2Title,
		feature2Text,
		ctaLabel,
		ctaUrl,
		phoneLabel,
		phoneNumber,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'respira-about-editor',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Imágenes', 'respira' ) }>
					<p style={ { margin: '0 0 4px' } }><strong>{ __( 'Imagen 1', 'respira' ) }</strong></p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									image1Id: media.id,
									image1Url: media.url,
									image1Alt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ image1Id }
							render={ ( { open } ) => (
								<div>
									{ image1Url && (
										<img src={ image1Url } alt="" style={ { width: '100%', borderRadius: '4px', marginBottom: '8px' } } />
									) }
									<Button variant={ image1Url ? 'secondary' : 'primary' } onClick={ open }>
										{ image1Url ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ image1Url && (
										<Button
											isDestructive
											variant="link"
											onClick={ () => setAttributes( { image1Id: 0, image1Url: '', image1Alt: '' } ) }
											style={ { display: 'block', marginTop: '4px' } }
										>
											{ __( 'Quitar imagen', 'respira' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>

					<p style={ { margin: '12px 0 4px' } }><strong>{ __( 'Imagen 2', 'respira' ) }</strong></p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									image2Id: media.id,
									image2Url: media.url,
									image2Alt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ image2Id }
							render={ ( { open } ) => (
								<div>
									{ image2Url && (
										<img src={ image2Url } alt="" style={ { width: '100%', borderRadius: '4px', marginBottom: '8px' } } />
									) }
									<Button variant={ image2Url ? 'secondary' : 'primary' } onClick={ open }>
										{ image2Url ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ image2Url && (
										<Button
											isDestructive
											variant="link"
											onClick={ () => setAttributes( { image2Id: 0, image2Url: '', image2Alt: '' } ) }
											style={ { display: 'block', marginTop: '4px' } }
										>
											{ __( 'Quitar imagen', 'respira' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>

					<TextControl
						label={ __( 'Texto del badge', 'respira' ) }
						value={ badgeText }
						onChange={ ( v ) => setAttributes( { badgeText: v } ) }
						style={ { marginTop: '12px' } }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Encabezado', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Subtítulo', 'respira' ) }
						value={ subtitle }
						onChange={ ( v ) => setAttributes( { subtitle: v } ) }
					/>
					<TextareaControl
						label={ __( 'Título', 'respira' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
						rows={ 2 }
					/>
					<TextareaControl
						label={ __( 'Texto', 'respira' ) }
						value={ text }
						onChange={ ( v ) => setAttributes( { text: v } ) }
						rows={ 3 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Característica 1', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Ícono (clase flaticon)', 'respira' ) }
						value={ feature1Icon }
						onChange={ ( v ) => setAttributes( { feature1Icon: v } ) }
					/>
					<TextControl
						label={ __( 'Título', 'respira' ) }
						value={ feature1Title }
						onChange={ ( v ) => setAttributes( { feature1Title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Texto', 'respira' ) }
						value={ feature1Text }
						onChange={ ( v ) => setAttributes( { feature1Text: v } ) }
						rows={ 2 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Característica 2', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Ícono (clase flaticon)', 'respira' ) }
						value={ feature2Icon }
						onChange={ ( v ) => setAttributes( { feature2Icon: v } ) }
					/>
					<TextControl
						label={ __( 'Título', 'respira' ) }
						value={ feature2Title }
						onChange={ ( v ) => setAttributes( { feature2Title: v } ) }
					/>
					<TextareaControl
						label={ __( 'Texto', 'respira' ) }
						value={ feature2Text }
						onChange={ ( v ) => setAttributes( { feature2Text: v } ) }
						rows={ 2 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Botón y teléfono', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Texto del botón', 'respira' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL del botón', 'respira' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
					<TextControl
						label={ __( 'Etiqueta del teléfono', 'respira' ) }
						value={ phoneLabel }
						onChange={ ( v ) => setAttributes( { phoneLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Número de teléfono', 'respira' ) }
						value={ phoneNumber }
						onChange={ ( v ) => setAttributes( { phoneNumber: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					<div style={ { display: 'flex', gap: 16, flexWrap: 'wrap' } }>
						<div style={ { flex: '0 0 40%', minWidth: 160 } }>
							{ image1Url && <img src={ image1Url } alt="" style={ { width: '100%', borderRadius: 6, marginBottom: 8 } } /> }
							{ image2Url && <img src={ image2Url } alt="" style={ { width: '70%', borderRadius: 6 } } /> }
							{ badgeText && (
								<div style={ { marginTop: 8, display: 'inline-block', background: '#0d6efd', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 13 } }>
									{ badgeText }
								</div>
							) }
						</div>
						<div style={ { flex: '1 1 50%', minWidth: 220 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700, marginTop: 4 } }>{ title }</div> }
							{ text && <div style={ { marginTop: 8, color: '#555' } }>{ text }</div> }

							<div style={ { marginTop: 12 } }>
								{ ( feature1Title || feature1Text ) && (
									<div style={ { display: 'flex', gap: 8, marginBottom: 8 } }>
										{ feature1Icon && <i className={ feature1Icon } style={ { fontSize: 24 } } /> }
										<div>
											<div style={ { fontWeight: 600 } }>{ feature1Title || '—' }</div>
											<div style={ { fontSize: 13, color: '#555' } }>{ feature1Text }</div>
										</div>
									</div>
								) }
								{ ( feature2Title || feature2Text ) && (
									<div style={ { display: 'flex', gap: 8 } }>
										{ feature2Icon && <i className={ feature2Icon } style={ { fontSize: 24 } } /> }
										<div>
											<div style={ { fontWeight: 600 } }>{ feature2Title || '—' }</div>
											<div style={ { fontSize: 13, color: '#555' } }>{ feature2Text }</div>
										</div>
									</div>
								) }
							</div>

							<div style={ { marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' } }>
								{ ctaLabel && (
									<span style={ { background: '#0d6efd', color: '#fff', padding: '8px 16px', borderRadius: 4, fontSize: 14 } }>
										{ ctaLabel }
									</span>
								) }
								{ phoneNumber && (
									<div style={ { fontSize: 13 } }>
										<div style={ { color: '#777' } }>{ phoneLabel }</div>
										<div style={ { fontWeight: 600 } }>{ phoneNumber }</div>
									</div>
								) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
