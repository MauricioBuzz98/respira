import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow, DragHandle, ReorderArrows } from '../shared/repeater';

// Iconos disponibles del set flaticon-set-realestate (assets/css/flaticon-set-realestate.css).
const ICON_OPTIONS = [
	'flaticon-set-agreement',
	'flaticon-set-property',
	'flaticon-set-residential',
	'flaticon-set-contract',
	'flaticon-set-construction',
	'flaticon-set-investment',
	'flaticon-set-building',
	'flaticon-set-investment-1',
	'flaticon-set-building-1',
	'flaticon-set-development',
	'flaticon-set-investment-2',
	'flaticon-set-property-1',
	'flaticon-set-building-2',
	'flaticon-set-hook',
	'flaticon-set-consulting',
	'flaticon-set-location',
	'flaticon-set-building-plan',
	'flaticon-set-accomodation',
	'flaticon-set-management',
	'flaticon-set-house-design',
	'flaticon-set-blueprint',
	'flaticon-set-urban-planning',
	'flaticon-set-technical-drawing',
	'flaticon-set-architect',
	'flaticon-set-3d',
	'flaticon-set-architecture',
	'flaticon-set-construction-1',
	'flaticon-set-pencil-and-ruler',
	'flaticon-set-tripod',
	'flaticon-set-engineer',
].map( ( cls ) => ( { label: cls.replace( 'flaticon-set-', '' ), value: cls } ) );

const EMPTY_AMENITY = { icon: 'flaticon-set-property', text: '', imageId: 0, imageUrl: '', imageAlt: '' };
const EMPTY_LEVEL = { name: '', imageId: 0, imageUrl: '', imageAlt: '', description: '', amenities: [] };

// La descripción es texto plano (se respetan los saltos de línea). El contenido
// antiguo pudo guardarse como HTML (<br>, listas); esto lo normaliza a texto
// plano para mostrarlo en el textarea sin etiquetas visibles.
const toPlainText = ( value ) => {
	const str = value || '';
	if ( ! /<[a-z][\s\S]*>/i.test( str ) ) {
		return str; // ya es texto plano: se respeta tal cual (incluidas líneas en blanco).
	}
	return str
		.replace( /<li[^>]*>/gi, '' )
		.replace( /<\/li>|<br\s*\/?>|<\/p>\s*<p[^>]*>/gi, '\n' )
		.replace( /<\/?[^>]+>/g, '' )
		.replace( /&amp;/g, '&' )
		.replace( /&lt;/g, '<' )
		.replace( /&gt;/g, '>' )
		.replace( /&nbsp;/g, ' ' )
		.trim();
};

/**
 * Editor de un nivel (imagen + descripción + repetidor de amenidades).
 * Es un componente propio para poder usar useReorder() con las amenidades de
 * este nivel (los hooks no pueden llamarse dentro de un map en el padre).
 */
function LevelEditor( { level, li, count, levelReorder, updateLevel, removeLevel } ) {
	const amenities = level.amenities || [];
	const amenityReorder = useReorder( amenities, ( next ) => updateLevel( li, { amenities: next } ) );

	const updateAmenity = ( ai, patch ) => {
		const next = amenities.map( ( a, i ) => ( i === ai ? { ...a, ...patch } : a ) );
		updateLevel( li, { amenities: next } );
	};
	const addAmenity = () => updateLevel( li, { amenities: [ ...amenities, { ...EMPTY_AMENITY } ] } );
	const removeAmenity = ( ai ) => updateLevel( li, { amenities: amenities.filter( ( _, i ) => i !== ai ) } );

	return (
		<div
			{ ...levelReorder.dropProps( li ) }
			className="respira-nivel-edit"
			style={ {
				border: '1px solid #c2c1c1',
				borderRadius: 8,
				padding: 16,
				marginBottom: 16,
				background: levelReorder.dragIndex === li ? '#f1f0ea' : '#fff',
			} }
		>
			<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
				<span style={ { display: 'flex', alignItems: 'center', gap: 4 } }>
					<DragHandle reorder={ levelReorder } index={ li } />
					<strong>{ level.name ? level.name : `${ __( 'Nivel', 'respira' ) } #${ li + 1 }` }</strong>
				</span>
				<span style={ { display: 'flex', alignItems: 'center', gap: 4 } }>
					<ReorderArrows index={ li } count={ count } move={ levelReorder.move } />
					<Button isDestructive variant="link" onClick={ () => removeLevel( li ) }>
						{ __( 'Eliminar nivel', 'respira' ) }
					</Button>
				</span>
			</div>

			<div style={ { marginTop: 12 } }>
				<TextControl
					label={ __( 'Nombre del nivel', 'respira' ) }
					value={ level.name || '' }
					onChange={ ( v ) => updateLevel( li, { name: v } ) }
					placeholder={ __( 'Ej. Planta baja, Segundo piso, Terraza…', 'respira' ) }
				/>
			</div>

			<div style={ { display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' } }>
				<div style={ { flex: '0 0 200px' } }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => updateLevel( li, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
							allowedTypes={ [ 'image' ] }
							value={ level.imageId }
							render={ ( { open } ) => (
								<div>
									{ level.imageUrl && (
										<img
											src={ level.imageUrl }
											alt=""
											style={ { width: '100%', borderRadius: 6, cursor: 'pointer', display: 'block', marginBottom: 8 } }
											onClick={ open }
										/>
									) }
									<Button variant="secondary" onClick={ open }>
										{ level.imageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
									</Button>
									{ level.imageUrl && (
										<Button
											variant="link"
											isDestructive
											style={ { marginLeft: 8 } }
											onClick={ () => updateLevel( li, { imageId: 0, imageUrl: '', imageAlt: '' } ) }
										>
											{ __( 'Quitar', 'respira' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>
				<div style={ { flex: '1 1 260px' } }>
					<TextareaControl
						label={ __( 'Descripción del nivel', 'respira' ) }
						hideLabelFromVision
						className="respira-nivel-desc"
						value={ toPlainText( level.description ) }
						onChange={ ( v ) => updateLevel( li, { description: v } ) }
						placeholder={ __( 'Descripción del nivel (se respetan los saltos de línea)…', 'respira' ) }
						rows={ 8 }
					/>
				</div>
			</div>

			<div style={ { marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e0e0e0' } }>
				<em>{ __( 'Amenidades', 'respira' ) }</em>
				{ amenities.map( ( amenity, ai ) => (
					<RepeaterRow key={ ai } reorder={ amenityReorder } index={ ai } count={ amenities.length }>
						<div style={ { display: 'flex', gap: 8, alignItems: 'flex-end' } }>
							<div style={ { flex: '0 0 180px' } }>
								<SelectControl
									label={ __( 'Icono', 'respira' ) }
									value={ amenity.icon }
									options={ ICON_OPTIONS }
									onChange={ ( v ) => updateAmenity( ai, { icon: v } ) }
									disabled={ !! amenity.imageUrl }
									help={ amenity.imageUrl ? __( 'Usando imagen', 'respira' ) : undefined }
								/>
							</div>
							<div style={ { flex: '0 0 auto' } }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => updateAmenity( ai, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
										allowedTypes={ [ 'image' ] }
										value={ amenity.imageId }
										render={ ( { open } ) =>
											amenity.imageUrl ? (
												<div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } }>
													<img
														src={ amenity.imageUrl }
														alt=""
														title={ __( 'Cambiar imagen', 'respira' ) }
														style={ { width: 40, height: 40, objectFit: 'contain', cursor: 'pointer', border: '1px solid #ddd', borderRadius: 6 } }
														onClick={ open }
													/>
													<Button variant="link" isDestructive onClick={ () => updateAmenity( ai, { imageId: 0, imageUrl: '', imageAlt: '' } ) }>
														{ __( 'Quitar img', 'respira' ) }
													</Button>
												</div>
											) : (
												<Button variant="secondary" onClick={ open }>
													{ __( 'Imagen', 'respira' ) }
												</Button>
											)
										}
									/>
								</MediaUploadCheck>
							</div>
							<div style={ { flex: 1 } }>
								<TextControl
									label={ __( 'Texto', 'respira' ) }
									value={ amenity.text }
									onChange={ ( v ) => updateAmenity( ai, { text: v } ) }
								/>
							</div>
							<Button isDestructive variant="link" onClick={ () => removeAmenity( ai ) }>
								{ __( 'Quitar', 'respira' ) }
							</Button>
						</div>
					</RepeaterRow>
				) ) }
				<Button variant="secondary" onClick={ addAmenity }>
					{ __( 'Agregar amenidad', 'respira' ) }
				</Button>
			</div>
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { intro, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-proyecto-niveles-editor' } );

	// --- Repetidor de niveles ---------------------------------------------
	const updateLevel = ( index, patch ) => {
		const next = items.map( ( lvl, i ) => ( i === index ? { ...lvl, ...patch } : lvl ) );
		setAttributes( { items: next } );
	};
	const addLevel = () => setAttributes( { items: [ ...items, { ...EMPTY_LEVEL, amenities: [] } ] } );
	const removeLevel = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );

	const levelReorder = useReorder( items, ( next ) => setAttributes( { items: next } ) );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Ayuda', 'respira' ) } initialOpen={ true }>
					<p>
						{ __(
							'Agregá un nivel por cada imagen. La descripción es texto plano y se respetan los saltos de línea. Se muestra al seleccionar la miniatura del nivel en el front.',
							'respira'
						) }
					</p>
					<p>
						{ __(
							'En cada amenidad podés elegir un icono o, si lo preferís, subir una imagen. Cuando hay imagen, esta reemplaza al icono.',
							'respira'
						) }
					</p>
					<p>
						{ __(
							'Podés reordenar niveles y amenidades arrastrando desde la manija (⠿) o con las flechas ↑/↓.',
							'respira'
						) }
					</p>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName="p"
					className="respira-proyecto-intro"
					value={ intro }
					onChange={ ( v ) => setAttributes( { intro: v } ) }
					placeholder={ __( 'Introducción del proyecto (opcional)…', 'respira' ) }
				/>

				{ items.map( ( level, li ) => (
					<LevelEditor
						key={ li }
						level={ level }
						li={ li }
						count={ items.length }
						levelReorder={ levelReorder }
						updateLevel={ updateLevel }
						removeLevel={ removeLevel }
					/>
				) ) }

				<Button variant="primary" onClick={ addLevel }>{ __( 'Agregar nivel', 'respira' ) }</Button>
			</div>
		</>
	);
}
