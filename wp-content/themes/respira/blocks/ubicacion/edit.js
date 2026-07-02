import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useReorder, RepeaterRow } from '../shared/repeater';
import { IconPicker } from '../shared/icons';

const EMPTY_CATEGORY = { title: '', icon: 'fa-solid fa-location-dot', places: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, mapEmbed, poisTitle, categories } = attributes;
	const blockProps = useBlockProps( { className: 'respira-ubicacion-editor' } );

	const updateCategory = ( index, patch ) => {
		const next = categories.map( ( c, i ) => ( i === index ? { ...c, ...patch } : c ) );
		setAttributes( { categories: next } );
	};
	const addCategory = () => setAttributes( { categories: [ ...categories, { ...EMPTY_CATEGORY } ] } );
	const removeCategory = ( index ) => setAttributes( { categories: categories.filter( ( _, i ) => i !== index ) } );
	const reorder = useReorder( categories, ( next ) => setAttributes( { categories: next } ) );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) } initialOpen={ true }>
					<TextControl label={ __( 'Subtítulo', 'respira' ) } value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } />
					<TextControl label={ __( 'Título', 'respira' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } rows={ 4 } />
				</PanelBody>

				<PanelBody title={ __( 'Mapa', 'respira' ) } initialOpen={ true }>
					<TextareaControl
						label={ __( 'Embed de Google Maps', 'respira' ) }
						value={ mapEmbed }
						onChange={ ( v ) => setAttributes( { mapEmbed: v } ) }
						rows={ 4 }
						help={ __( 'Pegá la URL de inserción (src) o el código <iframe> completo de Google Maps. En Maps: Compartir → Insertar un mapa → Copiar HTML.', 'respira' ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Puntos de interés', 'respira' ) } initialOpen={ true }>
					<TextControl label={ __( 'Título de la sección', 'respira' ) } value={ poisTitle } onChange={ ( v ) => setAttributes( { poisTitle: v } ) } />
					{ categories.map( ( cat, index ) => (
						<RepeaterRow key={ index } reorder={ reorder } index={ index } count={ categories.length }>
							<TextControl label={ __( 'Categoría', 'respira' ) } value={ cat.title } onChange={ ( v ) => updateCategory( index, { title: v } ) } />
							<IconPicker value={ cat.icon } onChange={ ( v ) => updateCategory( index, { icon: v } ) } />
							<TextareaControl
								label={ __( 'Lugares (uno por línea)', 'respira' ) }
								value={ cat.places }
								onChange={ ( v ) => updateCategory( index, { places: v } ) }
								rows={ 6 }
							/>
							<Button isDestructive variant="link" onClick={ () => removeCategory( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar categoría', 'respira' ) }
							</Button>
						</RepeaterRow>
					) ) }
					<Button variant="primary" onClick={ addCategory }>{ __( 'Agregar categoría', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					<div style={ { textAlign: 'center', marginBottom: 12 } }>
						{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
						{ title && <div style={ { fontSize: 24, fontWeight: 700 } }>{ title }</div> }
						{ text && <div style={ { fontSize: 14, color: '#555', marginTop: 6, maxWidth: 680, marginInline: 'auto' } }>{ text }</div> }
					</div>

					<div style={ { background: '#e9e7df', borderRadius: 6, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A514B', marginBottom: 16 } }>
						{ mapEmbed ? __( '🗺️ Mapa de Google Maps (se muestra en el front)', 'respira' ) : __( 'Agregá el embed del mapa en el panel lateral', 'respira' ) }
					</div>

					{ poisTitle && <div style={ { fontWeight: 700, marginBottom: 8 } }>{ poisTitle }</div> }
					<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 } }>
						{ categories.map( ( cat, index ) => (
							<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 12 } }>
								<div style={ { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 6, color: '#5A514B' } }>
										{ cat.icon && <i className={ cat.icon } aria-hidden="true" style={ { width: 18, textAlign: 'center' } } /> }
										<span>{ cat.title || '—' }</span>
									</div>
								<ul style={ { margin: 0, paddingLeft: 16, fontSize: 13, color: '#555' } }>
									{ ( cat.places || '' ).split( '\n' ).map( ( p ) => p.trim() ).filter( Boolean ).map( ( p, i ) => (
										<li key={ i }>{ p }</li>
									) ) }
								</ul>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
