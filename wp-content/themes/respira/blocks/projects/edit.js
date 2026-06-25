import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';

const EMPTY_ITEM = { subtitle: '', title: '', link: '', imageId: 0, imageUrl: '', imageAlt: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, source, count, category, categoryOrder, items } = attributes;
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
	const itemsReorder = useReorder( items, ( next ) => setAttributes( { items: next } ) );

	const categoryLabel = () => {
		const found = ( terms || [] ).find( ( t ) => t.slug === category );
		return found ? found.name : __( 'todas', 'respira' );
	};

	// Lista de categorías ordenada según categoryOrder (array de IDs). Las que no
	// estén en el orden guardado se agregan al final (orden natural por nombre).
	const orderedTerms = useMemo( () => {
		const list = terms || [];
		const order = categoryOrder || [];
		const byId = new Map( list.map( ( t ) => [ t.id, t ] ) );
		const ordered = [];
		order.forEach( ( id ) => {
			if ( byId.has( id ) ) {
				ordered.push( byId.get( id ) );
				byId.delete( id );
			}
		} );
		byId.forEach( ( t ) => ordered.push( t ) );
		return ordered;
	}, [ terms, categoryOrder ] );

	const [ dragIndex, setDragIndex ] = useState( null );

	const persistOrder = ( arr ) => setAttributes( { categoryOrder: arr.map( ( t ) => t.id ) } );

	const moveItem = ( from, to ) => {
		if ( to < 0 || to >= orderedTerms.length || from === to ) {
			return;
		}
		const arr = [ ...orderedTerms ];
		const [ moved ] = arr.splice( from, 1 );
		arr.splice( to, 0, moved );
		persistOrder( arr );
	};

	const handleDrop = ( to ) => {
		if ( dragIndex !== null ) {
			moveItem( dragIndex, to );
		}
		setDragIndex( null );
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

				{ isCategories && (
					<PanelBody title={ __( 'Orden de las categorías', 'respira' ) }>
						<p style={ { fontSize: 12, opacity: 0.7, marginTop: 0 } }>
							{ __( 'Arrastrá para reordenar (o usá las flechas). Sólo se mostrarán las primeras según la cantidad configurada.', 'respira' ) }
						</p>
						{ ! terms ? (
							<p style={ { fontSize: 13 } }>{ __( 'Cargando categorías…', 'respira' ) }</p>
						) : orderedTerms.length === 0 ? (
							<p style={ { fontSize: 13 } }>{ __( 'No hay categorías con proyectos publicados.', 'respira' ) }</p>
						) : (
							<ul style={ { listStyle: 'none', margin: 0, padding: 0 } }>
								{ orderedTerms.map( ( term, index ) => (
									<li
										key={ term.id }
										draggable
										onDragStart={ () => setDragIndex( index ) }
										onDragOver={ ( e ) => e.preventDefault() }
										onDrop={ () => handleDrop( index ) }
										onDragEnd={ () => setDragIndex( null ) }
										style={ {
											display: 'flex',
											alignItems: 'center',
											gap: 6,
											padding: '6px 8px',
											marginBottom: 4,
											border: '1px solid #e0e0e0',
											borderRadius: 4,
											background: dragIndex === index ? '#f1f0ea' : '#fff',
											cursor: 'grab',
										} }
									>
										<span aria-hidden="true" style={ { opacity: 0.5, cursor: 'grab' } }>⠿</span>
										<span style={ { flex: 1, fontSize: 13 } }>
											<strong>{ index + 1 }.</strong> { term.name }
										</span>
										<Button
											icon="arrow-up-alt2"
											label={ __( 'Subir', 'respira' ) }
											size="small"
											disabled={ index === 0 }
											onClick={ () => moveItem( index, index - 1 ) }
										/>
										<Button
											icon="arrow-down-alt2"
											label={ __( 'Bajar', 'respira' ) }
											size="small"
											disabled={ index === orderedTerms.length - 1 }
											onClick={ () => moveItem( index, index + 1 ) }
										/>
									</li>
								) ) }
							</ul>
						) }
						{ ( categoryOrder && categoryOrder.length > 0 ) && (
							<Button variant="link" isDestructive onClick={ () => setAttributes( { categoryOrder: [] } ) }>
								{ __( 'Restablecer orden', 'respira' ) }
							</Button>
						) }
					</PanelBody>
				) }

				{ isManual && (
					<PanelBody title={ __( 'Proyectos', 'respira' ) }>
						{ items.map( ( item, index ) => (
							<RepeaterRow key={ index } reorder={ itemsReorder } index={ index } count={ items.length }>
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
							</RepeaterRow>
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
