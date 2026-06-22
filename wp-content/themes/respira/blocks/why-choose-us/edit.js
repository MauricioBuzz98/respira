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
		imageId,
		imageUrl,
		subtitle,
		title,
		text,
		listItems,
		ctaLabel,
		ctaUrl,
	} = attributes;

	const blockProps = useBlockProps( { className: 'respira-why-choose-us-editor' } );

	const updateItem = ( index, value ) => {
		const next = listItems.map( ( it, i ) => ( i === index ? value : it ) );
		setAttributes( { listItems: next } );
	};
	const addItem = () => setAttributes( { listItems: [ ...listItems, '' ] } );
	const removeItem = ( index ) =>
		setAttributes( { listItems: listItems.filter( ( _, i ) => i !== index ) } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Imagen', 'respira' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageId: media.id,
									imageUrl: media.url,
									imageAlt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<div>
									{ imageUrl && (
										<img
											src={ imageUrl }
											alt=""
											style={ { width: '100%', borderRadius: '4px', marginBottom: '8px' } }
										/>
									) }
									<Button variant={ imageUrl ? 'secondary' : 'primary' } onClick={ open }>
										{ imageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ imageUrl && (
										<Button
											isDestructive
											variant="link"
											onClick={ () =>
												setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } )
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

				<PanelBody title={ __( 'Lista de beneficios', 'respira' ) }>
					{ listItems.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>#{ index + 1 }</strong>
							<TextControl
								label={ __( 'Texto', 'respira' ) }
								value={ item }
								onChange={ ( v ) => updateItem( index, v ) }
							/>
							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar ítem', 'respira' ) }</Button>
				</PanelBody>

				<PanelBody title={ __( 'Botón', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Texto', 'respira' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL', 'respira' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } }>
					<div>
						{ imageUrl ? (
							<img src={ imageUrl } alt="" style={ { width: '100%', borderRadius: 6 } } />
						) : (
							<div style={ { background: '#eee', borderRadius: 6, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' } }>
								{ __( 'Imagen', 'respira' ) }
							</div>
						) }
					</div>
					<div>
						{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
						{ title && <div style={ { fontSize: 22, fontWeight: 700, margin: '6px 0' } }>{ title }</div> }
						{ text && <p style={ { margin: '0 0 10px' } }>{ text }</p> }
						<ul style={ { listStyle: 'none', padding: 0, margin: 0 } }>
							{ listItems.map( ( item, index ) => (
								<li key={ index } style={ { display: 'flex', gap: 8, marginBottom: 6 } }>
									<span>✓</span>
									<span>{ item || '—' }</span>
								</li>
							) ) }
						</ul>
						{ ctaLabel && (
							<div style={ { marginTop: 12, fontWeight: 600 } }>{ ctaLabel } →</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
