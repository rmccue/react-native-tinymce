const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require( 'html-webpack-inline-source-plugin' );
const path = require('path');

module.exports = {
	entry: './assets-src/editor.js',
	output: {
		filename: 'editor.js',
		path: path.resolve( __dirname, 'assets/editor' ),
	},
	performance: {
		hints: false,
	},
	plugins: [
		new HtmlWebpackPlugin( {
			inlineSource: '.(js|css)$',
			filename: 'editor.html',
			template: 'assets-src/editor.html',
			minify: {
				collapseWhitespace: true,
				minifyCSS: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			},
		} ),
		new HtmlWebpackInlineSourcePlugin(),

		// Remove the unused JS file.
		new CleanWebpackPlugin( {
			protectWebpackAssets: false,
			cleanAfterEveryBuildPatterns: [
				'*.js',
			],
		} ),
	],
};
