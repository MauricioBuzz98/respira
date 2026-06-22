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

	// Compatibilidad: el valor antiguo "dynamic" se interpreta según haya o no categoría.
	const effectiveSource = source === 'dynamic' ? ( category ? 'category' : 'all' ) : source;
	const isManual = effectiveSource === 'manual';
	const isCategory = effectiveSource === 'category';
	const isCategories = effectiveSource === 'categories';

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

	const categoryLabel = () => {
		const found = ( terms || [] ).find( ( t ) => t.slug === category );
		return found ? found.name : __( 'todas', 'respira' );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Qué mostrar', 'respira' ) }>
					<SelectControl
						label={ __( 'Listado', 'respira' ) }
						value={ effectiveSource }
						options={ [
							{ label: __( 'Todos los proyectos', 'respira' ), value: 'all' },
							{ label: __( 'Proyectos de una categoría', 'respira' ), value: 'category' },
							{ label: __( 'Lista de categorías', 'respira' ), value: 'categories' },
							{ label: __( 'Manual', 'respira' ), value: 'manual' },
						] }
						onChange={ ( v ) => setAttributes( { source: v } ) }
					/>

					{ ! isManual && (
						<TextControl
							type="number"
							label={ isCategories ? __( 'Cantidad de categorías', 'respira' ) : __( 'Cantidad de proyectos', 'respira' ) }
							value={ count }
							min={ 1 }
							onChange={ ( v ) => setAttributes( { count: parseInt( v, 10 ) || 1 } ) }
						/>
					) }

					{ isCategory && (
						<SelectControl
							label={ __( 'Categoría', 'respira' ) }
							value={ category }
							options={ termOptions }
							onChange={ ( v ) => setAttributes( { category: v } ) }
						/>
					) }
				</PanelBody>

				{ isManual && (
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
					{ isManual ? (
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
					) : (
						<p style={ { fontSize: 13, background: '#f1f0ea', color: '#5A514B', padding: 10, borderRadius: 4, margin: 0 } }>
							{ isCategories
								? <>{ __( 'Modo: lista de categorías. Se mostrarán hasta', 'respira' ) } <strong>{ count }</strong> { __( 'categorías de proyecto (cada tarjeta enlaza a su listado).', 'respira' ) }</>
								: isCategory
									? <>{ __( 'Modo: proyectos de la categoría', 'respira' ) } <strong>«{ categoryLabel() }»</strong> ({ __( 'hasta', 'respira' ) } <strong>{ count }</strong>).</>
									: <>{ __( 'Modo: todos los proyectos del CPT «Proyectos» (hasta', 'respira' ) } <strong>{ count }</strong>).</>
							}
						</p>
					) }
				</div>
			</div>
		</>
	);
}
