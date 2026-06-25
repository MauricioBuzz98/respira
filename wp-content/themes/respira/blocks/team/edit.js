import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';

const EMPTY_ITEM = {
	name: '',
	designation: '',
	link: '',
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
	facebook: '',
	twitter: '',
	instagram: '',
};

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, source, count, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-team-editor' } );
	const isDynamic = source === 'dynamic';

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
					<SelectControl
						label={ __( 'Origen del contenido', 'respira' ) }
						value={ source }
						options={ [
							{ label: __( 'Dinámico (CPT Equipo)', 'respira' ), value: 'dynamic' },
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
				</PanelBody>

				{ ! isDynamic && (
					<PanelBody title={ __( 'Miembros del equipo', 'respira' ) }>
						{ items.map( ( item, index ) => (
							<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ items.length }>
								<TextControl label={ __( 'Nombre', 'respira' ) } value={ item.name } onChange={ ( v ) => updateItem( index, { name: v } ) } />
								<TextControl label={ __( 'Cargo', 'respira' ) } value={ item.designation } onChange={ ( v ) => updateItem( index, { designation: v } ) } />
								<TextControl label={ __( 'Enlace (URL)', 'respira' ) } value={ item.link } onChange={ ( v ) => updateItem( index, { link: v } ) } />
								<TextControl label={ __( 'Facebook (URL)', 'respira' ) } value={ item.facebook } onChange={ ( v ) => updateItem( index, { facebook: v } ) } />
								<TextControl label={ __( 'Twitter (URL)', 'respira' ) } value={ item.twitter } onChange={ ( v ) => updateItem( index, { twitter: v } ) } />
								<TextControl label={ __( 'Instagram (URL)', 'respira' ) } value={ item.instagram } onChange={ ( v ) => updateItem( index, { instagram: v } ) } />
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => updateItem( index, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
										allowedTypes={ [ 'image' ] }
										value={ item.imageId }
										render={ ( { open } ) => (
											<Button variant="secondary" onClick={ open } style={ { marginTop: 4 } }>
												{ item.imageUrl ? __( 'Cambiar foto', 'respira' ) : __( 'Foto', 'respira' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
									{ __( 'Eliminar', 'respira' ) }
								</Button>
							</RepeaterRow>
						) ) }
						<Button variant="primary" onClick={ addItem }>{ __( 'Agregar miembro', 'respira' ) }</Button>
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
							{ __( 'Modo dinámico: en el front se mostrarán hasta', 'respira' ) } <strong>{ count }</strong> { __( 'miembros del CPT «Equipo». Crea/edita entradas en el menú Equipo.', 'respira' ) }
						</p>
					) : (
						<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 } }>
							{ items.map( ( item, index ) => (
								<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 12, textAlign: 'center' } }>
									{ item.imageUrl && <img src={ item.imageUrl } alt="" style={ { width: '100%', marginBottom: 8, borderRadius: 6 } } /> }
									<div style={ { fontWeight: 700 } }>{ item.name || '—' }</div>
									<div style={ { fontSize: 13, opacity: 0.7 } }>{ item.designation }</div>
								</div>
							) ) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}
