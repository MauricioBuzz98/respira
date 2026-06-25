import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';

const EMPTY_ITEM = { title: '', link: '', price: '', rating: 5, imageId: 0, imageUrl: '', imageAlt: '' };
const isFullUrl = ( url ) => !! url && /^https?:\/\//.test( url );

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, cartUrl, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-productos-editor' } );

	const updateItem = ( index, patch ) => {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { items: next } );
	};
	const addItem = () => setAttributes( { items: [ ...items, { ...EMPTY_ITEM } ] } );
	const removeItem = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	const reorder = useReorder( items, ( next ) => setAttributes( { items: next } ) );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<TextControl label={ __( 'URL del carrito', 'respira' ) } value={ cartUrl } onChange={ ( v ) => setAttributes( { cartUrl: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Productos', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ items.length }>
							<TextControl label={ __( 'Nombre', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />
							<TextControl label={ __( 'Precio', 'respira' ) } value={ item.price } onChange={ ( v ) => updateItem( index, { price: v } ) } />
							<TextControl label={ __( 'Enlace (URL)', 'respira' ) } value={ item.link } onChange={ ( v ) => updateItem( index, { link: v } ) } />
							<TextControl
								type="number"
								label={ __( 'Estrellas (0-5)', 'respira' ) }
								value={ item.rating }
								min={ 0 }
								max={ 5 }
								onChange={ ( v ) => updateItem( index, { rating: parseInt( v, 10 ) || 0 } ) }
							/>
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
								{ __( 'Eliminar producto', 'respira' ) }
							</Button>
						</RepeaterRow>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar producto', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title ) && (
						<div style={ { marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
						</div>
					) }
					<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 } }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 12, textAlign: 'center' } }>
								{ isFullUrl( item.imageUrl ) && <img src={ item.imageUrl } alt="" style={ { width: '100%', borderRadius: 6, marginBottom: 8 } } /> }
								<div style={ { fontWeight: 600 } }>{ item.title || '—' }</div>
								<div style={ { color: '#5A514B', fontWeight: 700 } }>{ item.price }</div>
								<div style={ { color: '#FFAA18' } }>{ '★'.repeat( Math.max( 0, Math.min( 5, item.rating || 0 ) ) ) }</div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
