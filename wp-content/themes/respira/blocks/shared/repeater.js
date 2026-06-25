/**
 * Utilidades compartidas para reordenar items de los repeaters de los bloques.
 *
 * Replica el patrón del bloque Proyectos (orden de categorías): se arrastra
 * desde la manija (no toda la fila, para no interferir con los campos de texto)
 * y la fila completa actúa como zona de drop. Incluye flechas ↑/↓ como
 * respaldo accesible.
 *
 * Uso típico en un edit.js:
 *
 *   import { useReorder, RepeaterRow } from '../shared/repeater';
 *   const reorder = useReorder( items, ( next ) => setAttributes( { items: next } ) );
 *   ...
 *   { items.map( ( item, index ) => (
 *     <RepeaterRow key={ index } reorder={ reorder } index={ index } count={ items.length }>
 *       ...campos del item...
 *     </RepeaterRow>
 *   ) ) }
 *
 * @package Respira
 */
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Hook de reordenamiento para un array.
 *
 * @param {Array}    list    Array actual de items.
 * @param {Function} setList Setter que recibe el nuevo array.
 * @return {Object} { dragIndex, move, handleProps, dropProps }
 */
export function useReorder( list, setList ) {
	const [ dragIndex, setDragIndex ] = useState( null );

	const move = ( from, to ) => {
		if ( from === to || to < 0 || to >= list.length ) {
			return;
		}
		const next = [ ...list ];
		const [ moved ] = next.splice( from, 1 );
		next.splice( to, 0, moved );
		setList( next );
	};

	const handleProps = ( index ) => ( {
		draggable: true,
		onDragStart: ( e ) => {
			setDragIndex( index );
			e.dataTransfer.effectAllowed = 'move';
			try {
				e.dataTransfer.setData( 'text/plain', String( index ) );
			} catch ( err ) {
				// Algunos navegadores no permiten setData aquí; el drag igual funciona.
			}
		},
		onDragEnd: () => setDragIndex( null ),
	} );

	const dropProps = ( index ) => ( {
		onDragOver: ( e ) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
		},
		onDrop: ( e ) => {
			e.preventDefault();
			if ( dragIndex !== null ) {
				move( dragIndex, index );
			}
			setDragIndex( null );
		},
	} );

	return { dragIndex, move, handleProps, dropProps };
}

const HANDLE_STYLE = {
	cursor: 'grab',
	opacity: 0.5,
	padding: '0 6px',
	fontSize: 16,
	lineHeight: 1,
	userSelect: 'none',
};

/** Manija de arrastre (⠿). Sólo este elemento es arrastrable. */
export function DragHandle( { reorder, index } ) {
	return (
		<span
			{ ...reorder.handleProps( index ) }
			title={ __( 'Arrastrar para reordenar', 'respira' ) }
			aria-hidden="true"
			style={ HANDLE_STYLE }
		>
			⠿
		</span>
	);
}

/** Botones ↑/↓ para reordenar (respaldo accesible del drag & drop). */
export function ReorderArrows( { index, count, move } ) {
	return (
		<>
			<Button
				icon="arrow-up-alt2"
				label={ __( 'Subir', 'respira' ) }
				size="small"
				disabled={ index === 0 }
				onClick={ () => move( index, index - 1 ) }
			/>
			<Button
				icon="arrow-down-alt2"
				label={ __( 'Bajar', 'respira' ) }
				size="small"
				disabled={ index === count - 1 }
				onClick={ () => move( index, index + 1 ) }
			/>
		</>
	);
}

/**
 * Contenedor de un item de repeater con manija de arrastre, número y flechas.
 * Los `children` son los campos del item (incluido su botón de eliminar).
 *
 * @param {Object}      props
 * @param {Object}      props.reorder  Resultado de useReorder().
 * @param {number}      props.index    Posición del item.
 * @param {number}      props.count    Total de items.
 * @param {string}      [props.label]  Etiqueta del encabezado (por defecto «#N»).
 * @param {*}           props.children Campos del item.
 */
export function RepeaterRow( { reorder, index, count, label, children } ) {
	return (
		<div
			{ ...reorder.dropProps( index ) }
			style={ {
				border: '1px solid #e0e0e0',
				borderRadius: 6,
				padding: 12,
				marginBottom: 12,
				background: reorder.dragIndex === index ? '#f1f0ea' : '#fff',
			} }
		>
			<div style={ { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 } }>
				<DragHandle reorder={ reorder } index={ index } />
				<strong style={ { flex: 1, fontSize: 12 } }>{ label || `#${ index + 1 }` }</strong>
				<ReorderArrows index={ index } count={ count } move={ reorder.move } />
			</div>
			{ children }
		</div>
	);
}
