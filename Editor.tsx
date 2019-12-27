import { Asset } from 'expo-asset';
import React from 'react';
import {
	Button,
	StyleSheet,
	View
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'
import { WebView } from 'react-native-webview';

import Toolbar from './Toolbar';
import { EditorStatus, UpdateStatusEvent } from './types';

const editorHtml = require( './assets/editor.html' );
const editorUri = Asset.fromModule( editorHtml ).uri;

const styles = StyleSheet.create( {
	container: {
		flex: 1,
	},
	webView: {
		flex: 0,
		height: 300,
		backgroundColor: '#fff',
	},
	toolbar: {
		height: 50,
		backgroundColor: '#f2f2f7',
	},
} );

interface EditorState {
	showingFormat: boolean;
	textStatus: EditorStatus;
}

export default class Editor extends React.Component {
	state: EditorState = {
		showingFormat: false,
		textStatus: {
			bold: false,
			italic: false,
			underline: false,
			strikethrough: false,
			paraType: 'p',
		},
	}

	webref = null;

	setWebViewRef = ref => {
		this.webref = ref;
	}

	onMessage = event => {
		const data: UpdateStatusEvent = JSON.parse( event.nativeEvent.data );
		switch ( data.type ) {
			case 'updateStatus':
				this.setState( {
					textStatus: data.payload,
				} );

			default:
				return;
		}
	}

	onShowFormat = () => {
		if ( ! this.webref ) {
			return;
		}

		// Hide the keyboard.
		this.webref.injectJavaScript( "document.activeElement.blur()" );

		// Show the formatting tools.
		this.setState( {
			showingFormat: true,
		} );
	}

	onDismissToolbar = () => {
		this.setState( {
			showingFormat: false,
		} );

		this.webref.injectJavaScript( `
			// Refocus the editor.
			tinymce.activeEditor.focus();
		` );
	}

	onCommand = ( ...args ) => {
		this.webref.injectJavaScript( `
			// Execute the command first.
			tinymce.activeEditor.execCommand(
				...${ JSON.stringify( args ) }
			);

			// Hide the keyboard again.
			document.activeElement.blur();
		` );
	}

	onFormat = format => {
		this.webref.injectJavaScript( `
			// Execute the command first.
			tinymce.activeEditor.execCommand( 'mceToggleFormat', false, ${ JSON.stringify( format ) } );

			// Hide the keyboard again.
			document.activeElement.blur();
		` );
	}

	render() {
		return (
			<>
				<View style={ styles.container }>
					<WebView
						ref={ this.setWebViewRef }
						hideKeyboardAccessoryView={ true }
						originWhitelist={['*']}
						scrollEnabled={ false }
						source={ { uri: editorUri } }
						style={ styles.webView }
						onMessage={ this.onMessage }
					/>
				</View>
				<KeyboardAccessoryView
					alwaysVisible
					avoidKeyboard
					hideBorder
					inSafeAreaView
					style={ styles.toolbar }
				>
					{ this.state.showingFormat ? (
						<Toolbar
							status={ this.state.textStatus }
							onCommand={ this.onCommand }
							onDismiss={ this.onDismissToolbar }
							onFormat={ this.onFormat }
						/>
					) : (
						<Button
							title="Format"
							onPress={ this.onShowFormat }
						/>
					) }
				</KeyboardAccessoryView>
			</>
		);
	}
}
