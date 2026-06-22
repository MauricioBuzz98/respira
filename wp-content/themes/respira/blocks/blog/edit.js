import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, ctaLabel, ctaUrl, postsCount } = attributes;
	const blockProps = useBlockProps( { className: 'respira-blog-editor' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) }>
					<TextControl
						label={ __( 'Subtítulo', 'respira' ) }
						value={ subtitle }
						onChange={ ( v ) => setAttributes( { subtitle: v } ) }
					/>
					<TextControl
						label={ __( 'Título', 'respira' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Botón', 'respira' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Texto del botón', 'respira' ) }
						value={ ctaLabel }
						onChange={ ( v ) => setAttributes( { ctaLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL del botón', 'respira' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Entradas', 'respira' ) } initialOpen={ false }>
					<TextControl
						type="number"
						label={ __( 'Cantidad de entradas', 'respira' ) }
						value={ postsCount }
						onChange={ ( v ) => setAttributes( { postsCount: parseInt( v, 10 ) || 0 } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { border: '1px dashed #c2c1c1', borderRadius: 8, padding: 24, textAlign: 'center' } }>
					{ subtitle && (
						<div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 } }>
							{ subtitle }
						</div>
					) }
					{ title && (
						<div style={ { fontSize: 22, fontWeight: 700, marginBottom: 8 } }>{ title }</div>
					) }
					<div style={ { color: '#555' } }>
						{ __( 'Se mostrarán las últimas', 'respira' ) } { postsCount } { __( 'entradas.', 'respira' ) }
					</div>
				</div>
			</div>
		</>
	);
}
