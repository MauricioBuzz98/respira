import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function LogoPicker( { label, id, url, onSelect, onRemove } ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ onSelect }
				allowedTypes={ [ 'image' ] }
				value={ id }
				render={ ( { open } ) => (
					<div style={ { marginBottom: 16 } }>
						<strong style={ { display: 'block', marginBottom: 6 } }>{ label }</strong>
						{ url && (
							<img src={ url } alt="" style={ { maxWidth: 180, height: 'auto', display: 'block', marginBottom: 6 } } />
						) }
						<Button variant={ url ? 'secondary' : 'primary' } onClick={ open }>
							{ url ? __( 'Cambiar logo', 'respira' ) : __( 'Seleccionar logo', 'respira' ) }
						</Button>
						{ url && (
							<Button isDestructive variant="link" onClick={ onRemove } style={ { marginLeft: 8 } }>
								{ __( 'Quitar', 'respira' ) }
							</Button>
						) }
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, title, text, logoTopId, logoTopUrl, logoBottomId, logoBottomUrl } = attributes;

	const blockProps = useBlockProps( { className: 'respira-respaldo-editor' } );

	const placeholder = ( w, h ) => ( {
		width: w,
		height: h,
		margin: '0 auto',
		border: '1px dashed #bbb',
		borderRadius: 6,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Encabezado', 'respira' ) } initialOpen={ true }>
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
					<TextareaControl
						label={ __( 'Texto', 'respira' ) }
						value={ text }
						onChange={ ( v ) => setAttributes( { text: v } ) }
						rows={ 4 }
						help={ __( 'Separá los párrafos con una línea en blanco.', 'respira' ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Logos', 'respira' ) } initialOpen={ true }>
					<LogoPicker
						label={ __( 'Logo superior', 'respira' ) }
						id={ logoTopId }
						url={ logoTopUrl }
						onSelect={ ( m ) => setAttributes( { logoTopId: m.id, logoTopUrl: m.url, logoTopAlt: m.alt || '' } ) }
						onRemove={ () => setAttributes( { logoTopId: 0, logoTopUrl: '', logoTopAlt: '' } ) }
					/>
					<LogoPicker
						label={ __( 'Logo inferior', 'respira' ) }
						id={ logoBottomId }
						url={ logoBottomUrl }
						onSelect={ ( m ) => setAttributes( { logoBottomId: m.id, logoBottomUrl: m.url, logoBottomAlt: m.alt || '' } ) }
						onRemove={ () => setAttributes( { logoBottomId: 0, logoBottomUrl: '', logoBottomAlt: '' } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { textAlign: 'center', padding: '48px 20px', border: '1px solid #e0e0e0', borderRadius: 8 } }>
					{ subtitle && (
						<div style={ { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, color: '#5A514B', marginBottom: 6 } }>
							{ subtitle }
						</div>
					) }
					{ title && <div style={ { fontSize: 30, fontWeight: 700, marginBottom: 28 } }>{ title }</div> }

					{ logoTopUrl ? (
						<img src={ logoTopUrl } alt="" style={ { maxHeight: 100, width: 'auto', margin: '0 auto 28px' } } />
					) : (
						<div style={ { ...placeholder( 170, 90 ), marginBottom: 28 } } />
					) }

					{ text && (
						<div style={ { maxWidth: 620, margin: '0 auto 28px', color: '#5A514B', lineHeight: 1.7, whiteSpace: 'pre-line' } }>
							{ text }
						</div>
					) }

					{ logoBottomUrl ? (
						<img src={ logoBottomUrl } alt="" style={ { maxHeight: 100, width: 'auto', margin: '0 auto' } } />
					) : (
						<div style={ placeholder( 220, 90 ) } />
					) }
				</div>
			</div>
		</>
	);
}
