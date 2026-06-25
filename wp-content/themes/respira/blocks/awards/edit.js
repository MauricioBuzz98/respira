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
import { useReorder, RepeaterRow } from '../shared/repeater';

const EMPTY_ITEM = { year: '', title: '', status: '', link: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, imageId, imageUrl, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-awards-editor' } );

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
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } rows={ 3 } />
				</PanelBody>

				<PanelBody title={ __( 'Imagen lateral', 'respira' ) }>
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
											onClick={ () => setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } ) }
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

				<PanelBody title={ __( 'Premios', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ items.length }>
							<TextControl label={ __( 'Año', 'respira' ) } value={ item.year } onChange={ ( v ) => updateItem( index, { year: v } ) } />
							<TextControl label={ __( 'Título', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />
							<TextControl label={ __( 'Estado (ej. Winner)', 'respira' ) } value={ item.status } onChange={ ( v ) => updateItem( index, { status: v } ) } />
							<TextControl label={ __( 'Enlace (URL)', 'respira' ) } value={ item.link } onChange={ ( v ) => updateItem( index, { link: v } ) } />
							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar', 'respira' ) }
							</Button>
						</RepeaterRow>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar premio', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title ) && (
						<div style={ { marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
							{ text && <div style={ { fontSize: 13, color: '#555', marginTop: 4 } }>{ text }</div> }
						</div>
					) }
					<div style={ { display: 'flex', gap: 16, alignItems: 'flex-start' } }>
						{ imageUrl && (
							<img src={ imageUrl } alt="" style={ { width: 120, flex: '0 0 auto', borderRadius: 6 } } />
						) }
						<div style={ { flex: 1 } }>
							{ items.map( ( item, index ) => (
								<div key={ index } style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '8px 0' } }>
									<div>
										<div style={ { fontSize: 12, color: '#888' } }>{ item.year || '—' }</div>
										<div style={ { fontWeight: 600 } }>{ item.title || '—' }</div>
									</div>
									<div style={ { fontSize: 13, color: '#555' } }>{ item.status }</div>
								</div>
							) ) }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
