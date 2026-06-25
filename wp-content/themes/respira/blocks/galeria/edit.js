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
	RangeControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, columns, images } = attributes;
	const blockProps = useBlockProps( { className: 'respira-galeria-editor' } );

	const updateImage = ( index, patch ) => {
		const next = images.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { images: next } );
	};
	const removeImage = ( index ) => setAttributes( { images: images.filter( ( _, i ) => i !== index ) } );
	const reorder = useReorder( images, ( next ) => setAttributes( { images: next } ) );

	// Agrega varias imágenes a la vez (las anexa, conservando orden y pies de foto).
	const addImages = ( media ) => {
		const additions = ( Array.isArray( media ) ? media : [ media ] ).map( ( m ) => ( {
			imageId: m.id,
			imageUrl: m.url,
			imageAlt: m.alt || '',
			caption: m.caption || '',
		} ) );
		setAttributes( { images: [ ...images, ...additions ] } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) } initialOpen={ true }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } rows={ 3 } />
				</PanelBody>

				<PanelBody title={ __( 'Disposición', 'respira' ) } initialOpen={ true }>
					<RangeControl
						label={ __( 'Columnas (desktop)', 'respira' ) }
						value={ columns }
						onChange={ ( v ) => setAttributes( { columns: v || 3 } ) }
						min={ 2 }
						max={ 5 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Imágenes', 'respira' ) } initialOpen={ true }>
					{ images.map( ( img, index ) => (
						<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ images.length }>
							{ img.imageUrl && (
								<img src={ img.imageUrl } alt="" style={ { width: '100%', borderRadius: 4, marginBottom: 8, display: 'block' } } />
							) }
							<TextControl
								label={ __( 'Pie de foto (opcional)', 'respira' ) }
								value={ img.caption }
								onChange={ ( v ) => updateImage( index, { caption: v } ) }
							/>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( m ) => updateImage( index, { imageId: m.id, imageUrl: m.url, imageAlt: m.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ img.imageId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open }>{ __( 'Cambiar imagen', 'respira' ) }</Button>
									) }
								/>
							</MediaUploadCheck>
							<Button isDestructive variant="link" onClick={ () => removeImage( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar', 'respira' ) }
							</Button>
						</RepeaterRow>
					) ) }
					<MediaUploadCheck>
						<MediaUpload
							multiple
							addToGallery
							allowedTypes={ [ 'image' ] }
							onSelect={ addImages }
							render={ ( { open } ) => (
								<Button variant="primary" onClick={ open }>{ __( 'Agregar imágenes', 'respira' ) }</Button>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					<div style={ { textAlign: 'center', marginBottom: 16 } }>
						{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
						{ title && <div style={ { fontSize: 24, fontWeight: 700 } }>{ title }</div> }
						{ text && <div style={ { fontSize: 15, color: '#555', marginTop: 6, maxWidth: 600, marginInline: 'auto', fontStyle: 'italic' } }>{ text }</div> }
					</div>

					{ images.length === 0 ? (
						<p style={ { fontSize: 13, background: '#f1f0ea', color: '#5A514B', padding: 12, borderRadius: 4, textAlign: 'center', margin: 0 } }>
							{ __( 'Agregá imágenes con el botón «Agregar imágenes» del panel lateral.', 'respira' ) }
						</p>
					) : (
						<div style={ { columnCount: Math.min( columns, 4 ), columnGap: 12 } }>
							{ images.map( ( img, index ) => (
								img.imageUrl && (
									<img
										key={ index }
										src={ img.imageUrl }
										alt={ img.imageAlt || '' }
										style={ { width: '100%', borderRadius: 8, marginBottom: 12, breakInside: 'avoid', display: 'block' } }
									/>
								)
							) ) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}
