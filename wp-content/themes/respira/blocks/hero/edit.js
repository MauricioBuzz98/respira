import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const EMPTY_SLIDE = {
	bgImageId: 0, bgImageUrl: '', bgImageAlt: '',
	title: '', text: '',
	ratingValue: '4.8', ratingText: '',
	circleText: 'MY PROJECTS · MY PROJECTS ·',
	sideImageId: 0, sideImageUrl: '', sideImageAlt: '',
};

const isFullUrl = ( url ) => !! url && /^https?:\/\//.test( url );

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-hero-editor' } );

	const updateItem = ( index, patch ) => {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { items: next } );
	};
	const addItem = () => setAttributes( { items: [ ...items, { ...EMPTY_SLIDE } ] } );
	const removeItem = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slides del carrusel', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>{ __( 'Slide', 'respira' ) } #{ index + 1 }</strong>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateItem( index, { bgImageId: media.id, bgImageUrl: media.url, bgImageAlt: media.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ item.bgImageId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open } style={ { marginTop: 4 } }>
											{ item.bgImageUrl ? __( 'Cambiar fondo', 'respira' ) : __( 'Imagen de fondo', 'respira' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>

							<TextControl label={ __( 'Título', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />
							<TextareaControl label={ __( 'Texto', 'respira' ) } value={ item.text } onChange={ ( v ) => updateItem( index, { text: v } ) } rows={ 3 } />
							<TextControl label={ __( 'Texto circular', 'respira' ) } value={ item.circleText } onChange={ ( v ) => updateItem( index, { circleText: v } ) } />
							<TextControl label={ __( 'Rating (valor)', 'respira' ) } value={ item.ratingValue } onChange={ ( v ) => updateItem( index, { ratingValue: v } ) } />
							<TextControl label={ __( 'Rating (texto)', 'respira' ) } value={ item.ratingText } onChange={ ( v ) => updateItem( index, { ratingText: v } ) } />

							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateItem( index, { sideImageId: media.id, sideImageUrl: media.url, sideImageAlt: media.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ item.sideImageId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open } style={ { marginTop: 4 } }>
											{ item.sideImageUrl ? __( 'Cambiar imagen lateral', 'respira' ) : __( 'Imagen lateral', 'respira' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>

							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar slide', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar slide', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					<p style={ { margin: '0 0 8px', fontWeight: 600 } }>
						{ __( 'Hero / Carrusel', 'respira' ) } — { items.length } { __( 'slide(s)', 'respira' ) }
					</p>
					<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 } }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { position: 'relative', minHeight: 120, borderRadius: 6, overflow: 'hidden', background: '#222', color: '#fff', padding: 12, display: 'flex', alignItems: 'flex-end' } }>
								{ isFullUrl( item.bgImageUrl ) && (
									<img src={ item.bgImageUrl } alt="" style={ { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 } } />
								) }
								<div style={ { position: 'relative' } }>
									<div style={ { fontWeight: 700, fontSize: 14 } }>{ item.title || __( '(sin título)', 'respira' ) }</div>
									{ ! isFullUrl( item.bgImageUrl ) && item.bgImageUrl && (
										<small style={ { opacity: 0.7 } }>{ __( 'Imagen del tema:', 'respira' ) } { item.bgImageUrl }</small>
									) }
								</div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
