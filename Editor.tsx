import { Asset } from 'expo-asset';
import React from 'react';
import {
	EmitterSubscription,
	Keyboard,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import Formatter from './Formatter';
import Toolbar from './Toolbar';
import { EditorEvent, EditorStatus } from './types';

/**
 * Time to debounce a keyboard show event.
 *
 * Experimentally tested on an iPhone 11 Pro, most events take 10-25ms to
 * execute, while some outliers occur around 50ms, with occasional events a
 * bit higher when lag occurs.
 *
 * 100ms should be plenty to cover all events including outliers.
 */
const KEYBOARD_DEBOUNCE = 100;

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
	/**
	 * Render prop for the toolbar.
	 */
	children( props: EditorChildrenProps ): JSX.Element;

	/**
	 * Initial HTML content for the editor.
	 */
	value?: string;

	/**
	 * Styles to apply to the formatter.
	 */
	toolbarStyle: StyleProp<ViewStyle>;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
	static defaultProps: EditorProps = {
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
			undo: {
				hasUndo: false,
				hasRedo: false,
			},
		},
	}

	private keyboardShowListener: EmitterSubscription = null;
	private keyboardHideListener: EmitterSubscription = null;
	private keyboardTimer: number = null;
	private resolveContent: ( content: string ) => void = null;
	private webref = null;

	componentDidMount() {
		this.keyboardShowListener = Keyboard.addListener( 'keyboardWillShow', this.onKeyboardShow );
		this.keyboardHideListener = Keyboard.addListener( 'keyboardDidHide', this.onKeyboardHide );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.value !== this.props.value ) {
			this.onUpdateContent( this.props.value );
		}
	}

	componentWillUnmount() {
		this.keyboardShowListener.remove();
		this.keyboardHideListener.remove();
	}

	public async getContent() {
		return new Promise( ( resolve, reject ) => {
			this.resolveContent = resolve;

			this.webref.injectJavaScript( `
				window.ReactNativeWebView.postMessage( JSON.stringify( {
					type: 'getContent',
					payload: {
						html: tinymce.activeEditor.getContent(),
					},
				} ) );
			` );
		} );
	}

	protected setWebViewRef = ref => {
		this.webref = ref;
	}

	/**
	 * Hide the formatting pane, but debounce the event.
	 *
	 * When formatting is applied, TinyMCE internally triggers focus on the
	 * contenteditable element, which triggers the keyboard. We then
	 * hide it as soon as possible via the .blur() call in onCommand.
	 *
	 * By debouncing the event, we leave enough time for TinyMCE to do its
	 * magic. For "real" keyboard events (i.e. user moves cursor or selects
	 * another field), the keyboard takes ~250ms to show anyway, so a slight
	 * delay doesn't have a huge visual impact.
	 *
	 * @see KEYBOARD_DEBOUNCE
	 */
	protected onKeyboardShow = e => {
		this.keyboardTimer = window.setTimeout( () => {
			this.keyboardTimer = null;
			this.onDebouncedKeyboardShow( e );
		}, KEYBOARD_DEBOUNCE );
	}

	/**
	 * Cancel any keyboard timers if set.
	 */
	protected onKeyboardHide = e => {
		if ( this.keyboardTimer ) {
			window.clearTimeout( this.keyboardTimer );
		}
	}

	/**
	 * Hide the formatting pane if the keyboard is shown.
	 *
	 * @see onKeyboardShow
	 */
	protected onDebouncedKeyboardShow = e => {
		if ( this.state.showingFormat ) {
			this.setState( {
				showingFormat: false,
			} );
		}
	}

	protected onMessage = ( event: WebViewMessageEvent ) => {
		const data: EditorEvent = JSON.parse( event.nativeEvent.data );
		switch ( data.type ) {
			case 'updateStatus':
				this.setState( {
					textStatus: data.payload,
				} );
				break;

			case 'getContent':
				if ( ! this.resolveContent ) {
					return;
				}

				this.resolveContent( data.payload.html );
				break;

			default:
				return;
		}
	}

	protected onShowFormat = () => {
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

	protected onDismissToolbar = () => {
		this.setState( {
			showingFormat: false,
		} );

		this.webref.injectJavaScript( `
			// Refocus the editor.
			tinymce.activeEditor.focus();
		` );
	}

	protected onCommand = ( commandId: string, showUI?: boolean, value?: string ) => {
		const args = [ commandId, showUI, value ];
		this.webref.injectJavaScript( `
			// Execute the command first.
			tinymce.activeEditor.execCommand(
				...${ JSON.stringify( args ) }
			);

			// Hide the keyboard again.
			document.activeElement.blur();
		` );
	}

	protected onFormat = format => {
		this.onCommand(
			'mceToggleFormat',
			false,
			format
		);
	}

	protected onUpdateContent = ( content: string ) => {
		if ( ! this.webref ) {
			return;
		}

		this.webref.injectJavaScript( `
			tinymce.activeEditor.setContent( ${ JSON.stringify( content ) } );
		` );
	}

	protected getInitScript() {
		return `
			// Initialize the editor.
			const init = {
				content: ${ JSON.stringify( this.props.value ) },
			};
			const editor = tinymce.activeEditor;

			// If we have content, initialize the editor.
			if ( init.content ) {
				editor.setContent( init.content );
			}

			// Ensure string evaluates to true.
			true;
		`;
	}

	render() {
		const { children } = this.props;

		return (
			<>
				<View style={ styles.container }>
					<WebView
						ref={ this.setWebViewRef }
						hideKeyboardAccessoryView={ true }
						injectedJavaScript={ this.getInitScript() }
						keyboardDisplayRequiresUserAction={ false }
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

				<KeyboardAccessoryView
					avoidKeyboard
					hideBorder
					inSafeAreaView
					style={ styles.toolbar }
				>
					{ ( ! this.state.showingFormat && ! this.state.showingLink ) ? (
						children( {
							onCommand: this.onCommand,
							onShowFormat: this.onShowFormat,
							onShowLink: this.onShowLink,
						} )
					) : null }
				</KeyboardAccessoryView>
			</>
		);
	}
}
