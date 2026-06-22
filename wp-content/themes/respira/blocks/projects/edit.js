import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const EMPTY_ITEM = { subtitle: '', title: '', link: '', imageId: 0, imageUrl: '', imageAlt: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, source, count, category, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-projects-editor' } );
	const isDynamic = source === 'dynamic';

	// Categorías del CPT proyecto para el selector de filtro.
	const terms = useSelect(
		( select ) => select( coreStore ).getEntityRecords( 'taxonomy', 'proyecto_categoria', { per_page: -1, _fields: 'id,name,slug' } ),
		[]
	);
	const termOptions = [ { label: __( 'Todas las categorías', 'respira' ), value: '' } ].concat(
		( terms || [] ).map( ( t ) => ( { label: t.name, value: t.slug } ) )
	);

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
					<SelectControl
						label={ __( 'Origen del contenido', 'respira' ) }
						value={ source }
						options={ [
							{ label: __( 'Dinámico (CPT Proyectos)', 'respira' ), value: 'dynamic' },
							{ label: __( 'Manual', 'respira' ), value: 'manual' },
						] }
						onChange={ ( v ) => setAttributes( { source: v } ) }
					/>
					{ isDynamic && (
						<TextControl
							type="number"
							label={ __( 'Cantidad a mostrar', 'respira' ) }
							value={ count }
							min={ 1 }
							onChange={ ( v ) => setAttributes( { count: parseInt( v, 10 ) || 1 } ) }
						/>
					) }
					{ isDynamic && (
						<SelectControl
							label={ __( 'Filtrar por categoría', 'respira' ) }
							value={ category }
							options={ termOptions }
							onChange={ ( v ) => setAttributes( { category: v } ) }
						/>
					) }
				</PanelBody>

				{ ! isDynamic && (
					<PanelBody title={ __( 'Proyectos', 'respira' ) }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
								<strong>#{ index + 1 }</strong>
								<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ item.subtitle } onChange={ ( v ) => updateItem( index, { subtitle: v } ) } />
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
						<Button variant="primary" onClick={ addItem }>{ __( 'Agregar proyecto', 'respira' ) }</Button>
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title ) && (
						<div style={ { textAlign: 'center', marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
						</div>
					) }
					{ isDynamic ? (
						<p style={ { fontSize: 13, background: '#f1f0ea', color: '#5A514B', padding: 10, borderRadius: 4, margin: 0 } }>
							{ __( 'Modo dinámico: en el front se mostrarán hasta', 'respira' ) } <strong>{ count }</strong> { __( 'proyectos del CPT «Proyectos». Crea/edita entradas en el menú Proyectos.', 'respira' ) }
						</p>
					) : (
						<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 } }>
							{ items.map( ( item, index ) => (
								<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' } }>
									{ item.imageUrl && <img src={ item.imageUrl } alt="" style={ { width: '100%', display: 'block' } } /> }
									<div style={ { padding: 12 } }>
										{ item.subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 11, opacity: 0.7 } }>{ item.subtitle }</div> }
										<div style={ { fontWeight: 600, marginTop: 4 } }>{ item.title || '—' }</div>
									</div>
								</div>
							) ) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}
