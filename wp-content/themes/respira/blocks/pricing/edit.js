import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const EMPTY_ITEM = { planTitle: '', currency: '$', amount: '', period: '', features: '', ctaLabel: 'Reservar', ctaUrl: '' };

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, items } = attributes;
	const blockProps = useBlockProps( { className: 'respira-pricing-editor' } );

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
				</PanelBody>

				<PanelBody title={ __( 'Planes', 'respira' ) }>
					{ items.map( ( item, index ) => (
						<div key={ index } style={ { borderBottom: '1px solid #e0e0e0', paddingBottom: 12, marginBottom: 12 } }>
							<strong>#{ index + 1 }</strong>
							<TextControl label={ __( 'Nombre del plan', 'respira' ) } value={ item.planTitle } onChange={ ( v ) => updateItem( index, { planTitle: v } ) } />
							<TextControl label={ __( 'Moneda', 'respira' ) } value={ item.currency } onChange={ ( v ) => updateItem( index, { currency: v } ) } />
							<TextControl label={ __( 'Monto', 'respira' ) } value={ item.amount } onChange={ ( v ) => updateItem( index, { amount: v } ) } />
							<TextControl label={ __( 'Periodo', 'respira' ) } value={ item.period } onChange={ ( v ) => updateItem( index, { period: v } ) } />
							<TextareaControl
								label={ __( 'Características (una por línea)', 'respira' ) }
								value={ item.features }
								onChange={ ( v ) => updateItem( index, { features: v } ) }
								rows={ 5 }
							/>
							<TextControl label={ __( 'Texto del botón', 'respira' ) } value={ item.ctaLabel } onChange={ ( v ) => updateItem( index, { ctaLabel: v } ) } />
							<TextControl label={ __( 'Enlace del botón (URL)', 'respira' ) } value={ item.ctaUrl } onChange={ ( v ) => updateItem( index, { ctaUrl: v } ) } />
							<Button isDestructive variant="link" onClick={ () => removeItem( index ) } style={ { display: 'block', marginTop: 4 } }>
								{ __( 'Eliminar plan', 'respira' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>{ __( 'Agregar plan', 'respira' ) }</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 16 } }>
					{ ( subtitle || title ) && (
						<div style={ { textAlign: 'center', marginBottom: 12 } }>
							{ subtitle && <div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>{ subtitle }</div> }
							{ title && <div style={ { fontSize: 22, fontWeight: 700 } }>{ title }</div> }
						</div>
					) }
					<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 } }>
						{ items.map( ( item, index ) => (
							<div key={ index } style={ { border: '1px solid #eee', borderRadius: 8, padding: 16, textAlign: 'center' } }>
								<div style={ { fontWeight: 600 } }>{ item.planTitle || '—' }</div>
								<div style={ { fontSize: 26, fontWeight: 700, margin: '6px 0' } }>
									<sup>{ item.currency }</sup>{ item.amount } <span style={ { fontSize: 12, fontWeight: 400 } }>{ item.period }</span>
								</div>
								<ul style={ { listStyle: 'none', padding: 0, fontSize: 13, textAlign: 'left' } }>
									{ ( item.features || '' ).split( '\n' ).filter( Boolean ).map( ( f, i ) => (
										<li key={ i }>✓ { f }</li>
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
