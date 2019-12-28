import { Asset } from 'expo-asset';
import React from 'react';
import {
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { WebView } from 'react-native-webview';

import Formatter from './Formatter';
import Toolbar from './Toolbar';
import { EditorStatus, UpdateStatusEvent } from './types';

const editorHtml = require( './assets/editor/editor.html' );
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

export interface EditorChildrenProps {
	onCommand( ...args ): void;
	onShowFormat(): void;
}

interface EditorProps {
	children( props: EditorChildrenProps ): JSX.Element;
	toolbarStyle: StyleProp<ViewStyle>;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
	static defaultProps = {
		children: props => <Toolbar { ...props } />,
		toolbarStyle: null,
	}

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
		const { children } = this.props;

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
				<Formatter
					status={ this.state.textStatus }
					style={ this.props.toolbarStyle }
					visible={ this.state.showingFormat }
					onCommand={ this.onCommand }
					onDismiss={ this.onDismissToolbar }
					onFormat={ this.onFormat }
				/>
				{ ! this.state.showingFormat ? (
					<KeyboardAccessoryView
						avoidKeyboard
						hideBorder
						inSafeAreaView
						style={ styles.toolbar }
					>
						{ children( {
							onCommand: this.onCommand,
							onShowFormat: this.onShowFormat,
						} ) }
					</KeyboardAccessoryView>
				) : null }
			</>
		);
	}
}
