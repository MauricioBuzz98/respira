import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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
const EMPTY_LEVEL = { imageId: 0, imageUrl: '', imageAlt: '', description: '', amenities: [] };

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

	// --- Repetidor anidado de amenidades por nivel ------------------------
	const updateAmenity = ( li, ai, patch ) => {
		const amenities = ( items[ li ].amenities || [] ).map( ( a, i ) => ( i === ai ? { ...a, ...patch } : a ) );
		updateLevel( li, { amenities } );
	};
	const addAmenity = ( li ) => {
		const amenities = [ ...( items[ li ].amenities || [] ), { ...EMPTY_AMENITY } ];
		updateLevel( li, { amenities } );
	};
	const removeAmenity = ( li, ai ) => {
		const amenities = ( items[ li ].amenities || [] ).filter( ( _, i ) => i !== ai );
		updateLevel( li, { amenities } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Ayuda', 'respira' ) } initialOpen={ true }>
					<p>
						{ __(
							'Agregá un nivel por cada imagen. La descripción admite formato (negrita, cursiva, enlaces) y se muestra al seleccionar la miniatura del nivel en el front.',
							'respira'
						) }
					</p>
					<p>
						{ __(
							'En cada amenidad podés elegir un icono o, si lo preferís, subir una imagen. Cuando hay imagen, esta reemplaza al icono.',
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
					<div
						key={ li }
						className="respira-nivel-edit"
						style={ { border: '1px solid #c2c1c1', borderRadius: 8, padding: 16, marginBottom: 16 } }
					>
						<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
							<strong>{ __( 'Nivel', 'respira' ) } #{ li + 1 }</strong>
							<Button isDestructive variant="link" onClick={ () => removeLevel( li ) }>
								{ __( 'Eliminar nivel', 'respira' ) }
							</Button>
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
								<RichText
									tagName="div"
									className="respira-nivel-desc"
									value={ level.description }
									onChange={ ( v ) => updateLevel( li, { description: v } ) }
									placeholder={ __( 'Descripción del nivel…', 'respira' ) }
								/>
							</div>
						</div>

						<div style={ { marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e0e0e0' } }>
							<em>{ __( 'Amenidades', 'respira' ) }</em>
							{ ( level.amenities || [] ).map( ( amenity, ai ) => (
								<div key={ ai } style={ { display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 } }>
									<div style={ { flex: '0 0 180px' } }>
										<SelectControl
											label={ __( 'Icono', 'respira' ) }
											value={ amenity.icon }
											options={ ICON_OPTIONS }
											onChange={ ( v ) => updateAmenity( li, ai, { icon: v } ) }
											disabled={ !! amenity.imageUrl }
											help={ amenity.imageUrl ? __( 'Usando imagen', 'respira' ) : undefined }
										/>
									</div>
									<div style={ { flex: '0 0 auto' } }>
										<MediaUploadCheck>
											<MediaUpload
												onSelect={ ( media ) => updateAmenity( li, ai, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || '' } ) }
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
															<Button variant="link" isDestructive onClick={ () => updateAmenity( li, ai, { imageId: 0, imageUrl: '', imageAlt: '' } ) }>
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
											onChange={ ( v ) => updateAmenity( li, ai, { text: v } ) }
										/>
									</div>
									<Button isDestructive variant="link" onClick={ () => removeAmenity( li, ai ) }>
										{ __( 'Quitar', 'respira' ) }
									</Button>
								</div>
							) ) }
							<Button variant="secondary" onClick={ () => addAmenity( li ) }>
								{ __( 'Agregar amenidad', 'respira' ) }
							</Button>
						</div>
					</div>
				) ) }

				<Button variant="primary" onClick={ addLevel }>{ __( 'Agregar nivel', 'respira' ) }</Button>
			</div>
		</>
	);
}
