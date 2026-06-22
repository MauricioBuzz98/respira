import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const EMPTY_ITEM = { icon: '', title: '', link: '', text: '', imageId: 0, imageUrl: '', imageAlt: '' };
const isFullUrl = ( url ) => !! url && /^https?:\/\//.test( url );

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, bgImageId, bgImageUrl, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-services-slider-editor' } );

	const updateItem = ( index, patch ) => {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { items: next } );
	};
	const addItem = () => setAttributes( { items: [ ...items, { ...EMPTY_ITEM } ] } );
	const removeItem = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { bgImageId: media.id, bgImageUrl: media.url, bgImageAlt: media.alt || '' } ) }
							allowedTypes={ [ 'image' ] }
							value={ bgImageId }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open } style={ { marginTop: 4 } }>
									{ bgImageUrl ? __( 'Cambiar fondo', 'respira' ) : __( 'Imagen de fondo', 'respira' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={ __( 'Servicios', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>#{ index + 1 }</strong>
							<TextControl label={ __( 'Ícono (clase flaticon)', 'respira' ) } value={ item.icon } onChange={ ( v ) => updateItem( index, { icon: v } ) } />
							<TextControl label={ __( 'Título', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />
							<TextControl label={ __( 'Enlace (URL)', 'respira' ) } value={ item.link } onChange={ ( v ) => updateItem( index, { link: v } ) } />
							<TextareaControl label={ __( 'Texto', 'respira' ) } value={ item.text } onChange={ ( v ) => updateItem( index, { text: v } ) } rows={ 2 } />
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateItem( index, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ item.imageId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open } style={ { marginTop: 4 } }>
											{ item.imageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Imagen', 'respira' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar servicio', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16, background: '#222', color: '#fff' } }>
					{ ( subtitle || title ) && (
						<div style={ { marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, opacity: 0.8 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
						</div>
					) }
					<div style={ { display: 'flex', gap: 12, overflowX: 'auto' } }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { minWidth: 200, border: '1px solid #444', borderRadius: 8, padding: 12 } }>
								<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
									{ item.icon && <i className={ item.icon } style={ { fontSize: 24 } } /> }
									<span style={ { opacity: 0.5 } }>{ String( index + 1 ).padStart( 2, '0' ) }</span>
								</div>
								<div style={ { fontWeight: 600, marginTop: 6 } }>{ item.title || '—' }</div>
								<div style={ { fontSize: 12, opacity: 0.7 } }>{ item.text }</div>
								{ isFullUrl( item.imageUrl ) && <img src={ item.imageUrl } alt="" style={ { width: '100%', marginTop: 8, borderRadius: 6 } } /> }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
