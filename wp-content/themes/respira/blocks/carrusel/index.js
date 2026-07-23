import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

// Bloque dinamico: save() devuelve null. El front lo renderiza render.php (Timber/Twig).
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
