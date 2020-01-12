import { Asset } from 'expo-asset';
import React from 'react';
import {
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';

import EditorContext from './Context';

const editorHtml = require( './assets/editor/editor.html' );
const editorUri = Asset.fromModule( editorHtml ).uri;

const styles = StyleSheet.create( {
	webView: {
		flex: 1,
		backgroundColor: '#fff',
	},
} );

interface EditorProps {
	/**
	 * CSS to apply to the HTML content inside the editor.
	 *
	 * https://www.tiny.cloud/docs/configure/content-appearance/#content_style
	 */
	contentCss?: string;

	/**
	 * Placeholder text to show in the field.
	 */
	placeholder?: string;

	/**
	 * Styles to apply to the web view.
	 */
	style?: StyleProp<ViewStyle>;

	/**
	 * Initial HTML content for the editor.
	 */
	value?: string;
}

export default class Editor extends React.Component<EditorProps> {
	declare context: React.ContextType<typeof EditorContext>;
	static contextType = EditorContext;

	static defaultProps: EditorProps = {
		contentCss: 'body { font-family: sans-serif; }',
		style: null,
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.value !== this.props.value ) {
			this.context.onUpdateContent( this.props.value );
		}
	}

	protected getInitScript() {
		const config = {
			content: this.props.value,
			content_style: this.props.contentCss,
			placeholder: this.props.placeholder || null,
		};

		return `
			// Initialize the editor.
			const initConfig = ${ JSON.stringify( config ) };
			window.init( initConfig );

			// Ensure string evaluates to true.
			true;
		`;
	}

	public async getContent(): Promise<string> {
		return await this.context.getContent();
	}

	render() {
		return (
			<WebView
				ref={ this.context.setWebViewRef }
				hideKeyboardAccessoryView={ true }
				injectedJavaScript={ this.getInitScript() }
				keyboardDisplayRequiresUserAction={ false }
				originWhitelist={['*']}
				scrollEnabled={ false }
				source={ { uri: editorUri } }
				style={ StyleSheet.flatten( [ styles.webView, this.props.style ] ) }
				onMessage={ this.context.onMessage }
			/>
		);
	}
}
