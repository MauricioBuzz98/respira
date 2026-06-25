import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const EMPTY_ITEM = { question: '', answer: '' };

export default function Edit( { attributes, setAttributes } ) {
	const {
		subtitle,
		title,
		text,
		infoTitle,
		infoText,
		ctaLabel,
		ctaUrl,
		items,
	} = attributes;

	const blockProps = useBlockProps( { className: 'respira-faq-editor' } );

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
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } rows={ 3 } />
				</PanelBody>

				<PanelBody title={ __( 'Caja de información (¿Aún tienes preguntas?)', 'respira' ) } initialOpen={ true }>
					<TextControl label={ __( 'Título', 'respira' ) } value={ infoTitle } onChange={ ( v ) => setAttributes( { infoTitle: v } ) } />
					<TextareaControl label={ __( 'Texto', 'respira' ) } value={ infoText } onChange={ ( v ) => setAttributes( { infoText: v } ) } rows={ 3 } />
					<TextControl label={ __( 'Texto del botón', 'respira' ) } value={ ctaLabel } onChange={ ( v ) => setAttributes( { ctaLabel: v } ) } />
					<TextControl label={ __( 'URL del botón', 'respira' ) } value={ ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Preguntas', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>#{ index + 1 }</strong>
							<TextControl label={ __( 'Pregunta', 'respira' ) } value={ item.question } onChange={ ( v ) => updateItem( index, { question: v } ) } />
							<TextareaControl label={ __( 'Respuesta', 'respira' ) } value={ item.answer } onChange={ ( v ) => updateItem( index, { answer: v } ) } rows={ 3 } />
							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar pregunta', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title || text ) && (
						<div style={ { marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
							{ text && <div style={ { fontSize: 14, opacity: 0.8 } }>{ text }</div> }
						</div>
					) }
					<div>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 8 } }>
								<div style={ { fontWeight: 600, display: 'flex', justifyContent: 'space-between' } }>
									<span>{ item.question || '—' }</span>
									<i className="fa-solid fa-chevron-down" />
								</div>
								{ item.answer && <div style={ { fontSize: 14, opacity: 0.8, marginTop: 6 } }>{ item.answer }</div> }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
