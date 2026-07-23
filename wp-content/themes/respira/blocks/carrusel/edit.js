import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	RangeControl,
	SelectControl,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';

const EMPTY_SLIDE = {
	bgImageId: 0, bgImageUrl: '', bgImageAlt: '',
	title: '',
};

const isFullUrl = ( url ) => !! url && /^https?:\/\//.test( url );

export default function Edit( { attributes, setAttributes } ) {
	const {
		items, autoplayDelay, height, contentAlign,
		showOverlay, overlayOpacity, showArrows, showDots,
	} = attributes;
	const blockProps = useBlockProps( { className: 'respira-carrusel-editor' } );

	const updateItem = ( index, patch ) => {
		const next = items.map( ( it, i ) => ( i === index ? { ...it, ...patch } : it ) );
		setAttributes( { items: next } );
	};
	const addItem = () => setAttributes( { items: [ ...items, { ...EMPTY_SLIDE } ] } );
	const removeItem = ( index ) => setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	const reorder = useReorder( items, ( next ) => setAttributes( { items: next } ) );

	// Agrega varias imágenes de una (cada una crea un slide sin texto).
	const addImages = ( media ) => {
		const additions = ( Array.isArray( media ) ? media : [ media ] ).map( ( m ) => ( {
			...EMPTY_SLIDE,
			bgImageId: m.id,
			bgImageUrl: m.url,
			bgImageAlt: m.alt || '',
		} ) );
		setAttributes( { items: [ ...items, ...additions ] } );
	};

	const justify = contentAlign === 'left' ? 'flex-start' : 'center';
	const textAlign = contentAlign === 'left' ? 'left' : 'center';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Ajustes del carrusel', 'respira' ) } initialOpen={ true }>
					<RangeControl
						label={ __( 'Tiempo entre slides (segundos)', 'respira' ) }
						value={ autoplayDelay }
						onChange={ ( v ) => setAttributes( { autoplayDelay: v || 1 } ) }
						min={ 1 }
						max={ 30 }
						step={ 1 }
						help={ __( 'Cuánto se muestra cada slide antes de pasar al siguiente.', 'respira' ) }
					/>
					<RangeControl
						label={ __( 'Altura (px)', 'respira' ) }
						value={ height }
						onChange={ ( v ) => setAttributes( { height: v || 300 } ) }
						min={ 200 }
						max={ 900 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Flechas de navegación', 'respira' ) }
						checked={ showArrows }
						onChange={ ( v ) => setAttributes( { showArrows: v } ) }
					/>
					<ToggleControl
						label={ __( 'Puntos indicadores', 'respira' ) }
						checked={ showDots }
						onChange={ ( v ) => setAttributes( { showDots: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Overlay', 'respira' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Mostrar overlay oscuro', 'respira' ) }
						checked={ showOverlay }
						onChange={ ( v ) => setAttributes( { showOverlay: v } ) }
						help={ __( 'Oscurece las imágenes para que el texto se lea mejor. Desactivalo para un carrusel de solo imágenes.', 'respira' ) }
					/>
					{ showOverlay && (
						<RangeControl
							label={ __( 'Intensidad del overlay (%)', 'respira' ) }
							value={ overlayOpacity }
							onChange={ ( v ) => setAttributes( { overlayOpacity: v === undefined ? 45 : v } ) }
							min={ 0 }
							max={ 90 }
							step={ 5 }
						/>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Contenido', 'respira' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Alineación del texto', 'respira' ) }
						value={ contentAlign }
						options={ [
							{ label: __( 'Centrado', 'respira' ), value: 'center' },
							{ label: __( 'Izquierda', 'respira' ), value: 'left' },
						] }
						onChange={ ( v ) => setAttributes( { contentAlign: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Slides', 'respira' ) } initialOpen={ true }>
					{ items.map( ( item, index ) => (
						<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ items.length } label={ `${ __( 'Slide', 'respira' ) } #${ index + 1 }` }>
							{ item.bgImageUrl && (
								<img src={ item.bgImageUrl } alt="" style={ { width: '100%', borderRadius: 4, marginBottom: 8, display: 'block' } } />
							) }
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateItem( index, { bgImageId: media.id, bgImageUrl: media.url, bgImageAlt: media.alt || '' } ) }
									allowedTypes={ [ 'image' ] }
									value={ item.bgImageId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open }>
											{ item.bgImageUrl ? __( 'Cambiar imagen', 'respira' ) : __( 'Seleccionar imagen', 'respira' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>

							<TextControl label={ __( 'Título (opcional)', 'respira' ) } value={ item.title } onChange={ ( v ) => updateItem( index, { title: v } ) } />

							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar slide', 'respira' ) }
							</Button>
						</RepeaterRow>
					) ) }
					<div style={ { display: 'flex', gap: 8, marginTop: 8 } }>
						<Button variant="secondary" onClick={ addItem }>{ __( 'Agregar slide vacío', 'respira' ) }</Button>
						<MediaUploadCheck>
							<MediaUpload
								multiple
								addToGallery
								allowedTypes={ [ 'image' ] }
								onSelect={ addImages }
								render={ ( { open } ) => (
									<Button variant="primary" onClick={ open }>{ __( 'Agregar imágenes', 'respira' ) }</Button>
								) }
							/>
						</MediaUploadCheck>
					</div>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					<p style={ { margin: '0 0 8px', fontWeight: 600 } }>
						{ __( 'Carrusel de imágenes', 'respira' ) } — { items.length } { __( 'slide(s)', 'respira' ) }
					</p>
					{ items.length === 0 ? (
						<p style={ { fontSize: 13, background: '#f1f0ea', color: '#5A514B', padding: 12, borderRadius: 4, textAlign: 'center', margin: 0 } }>
							{ __( 'Agregá imágenes con «Agregar imágenes» del panel lateral.', 'respira' ) }
						</p>
					) : (
						<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 } }>
							{ items.map( ( item, index ) => (
								<div key={ index } style={ { position: 'relative', minHeight: 140, borderRadius: 6, overflow: 'hidden', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: justify, padding: 14 } }>
									{ isFullUrl( item.bgImageUrl ) && (
										<img src={ item.bgImageUrl } alt="" style={ { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } } />
									) }
									{ showOverlay && (
										<div style={ { position: 'absolute', inset: 0, background: `rgba(0,0,0,${ ( overlayOpacity || 0 ) / 100 })` } } />
									) }
									<div style={ { position: 'relative', textAlign, maxWidth: '100%' } }>
										{ item.title
											? <div style={ { fontWeight: 700, fontSize: 16, lineHeight: 1.15 } }>{ item.title }</div>
											: <span style={ { opacity: 0.6, fontSize: 12 } }>{ __( '(solo imagen)', 'respira' ) }</span>
										}
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
