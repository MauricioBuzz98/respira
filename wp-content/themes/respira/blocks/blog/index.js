import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

// Bloque dinámico: save() devuelve null. El front lo renderiza render.php (Timber/Twig).
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
