import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const EMPTY_ITEM = { icon: '', title: '', link: '', imageId: 0, imageUrl: '', imageAlt: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-services-editor' } );

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
				</PanelBody>

				<PanelBody title={ __( 'Servicios', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>#{ index + 1 }</strong>
							<TextControl label={ __( 'Ícono (clase flaticon)', 'respira' ) } value={ item.icon } onChange={ ( v ) => updateItem( index, { icon: v } ) } />
							<TextControl label={ __( 'Título', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />
							<TextControl label={ __( 'Enlace (URL)', 'respira' ) } value={ item.link } onChange={ ( v ) => updateItem( index, { link: v } ) } />
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
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title ) && (
						<div style={ { textAlign: 'center', marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
						</div>
					) }
					<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 } }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 12, textAlign: 'center' } }>
								{ item.icon && <i className={ item.icon } style={ { fontSize: 28 } } /> }
								<div style={ { fontWeight: 600, marginTop: 6 } }>{ item.title || '—' }</div>
								{ item.imageUrl && <img src={ item.imageUrl } alt="" style={ { width: '100%', marginTop: 8, borderRadius: 6 } } /> }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
