/**
 * Config de webpack para los bloques.
 *
 * Extiende la config de @wordpress/scripts y:
 *  1. Auto-descubre cada blocks/<nombre>/index.js como entry point.
 *  2. Copia block.json, render.php y view.js (si existe) a build/blocks/<nombre>/
 *     para que register_block_type() los encuentre alli.
 *
 * NOTA: aqui NO hay Tailwind/PostCSS. Los estilos del front provienen de la
 * plantilla Realest (assets/css), encolados desde functions.php.
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path          = require( 'path' );
const { globSync }  = require( 'glob' );
const CopyPlugin    = require( 'copy-webpack-plugin' );

const blockEntries = Object.fromEntries(
	globSync( 'blocks/*/index.js' ).map( ( file ) => {
		const norm      = file.replace( /\\/g, '/' );
		const blockName = path.basename( path.dirname( norm ) );
		return [ `blocks/${ blockName }/index`, path.resolve( __dirname, norm ) ];
	} )
);

module.exports = {
	...defaultConfig,
	entry: {
		...blockEntries,
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js',
	},
	plugins: [
		...( defaultConfig.plugins ?? [] ),
		new CopyPlugin( {
			patterns: [
				{ from: 'blocks/*/block.json',  to: '[path][name][ext]' },
				{ from: 'blocks/*/render.php',  to: '[path][name][ext]', noErrorOnMissing: true },
				{ from: 'blocks/*/view.js',     to: '[path][name][ext]', noErrorOnMissing: true },
			],
		} ),
	],
};
