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
	plugins: [
		new HtmlWebpackPlugin( {
			inlineSource: '.(js|css)$',
			filename: 'editor.html',
			template: 'assets-src/editor.html',
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
