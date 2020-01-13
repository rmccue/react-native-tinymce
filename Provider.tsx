import React, { ReactChild } from 'react';
import {
	EmitterSubscription,
	Keyboard,
} from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';

import EditorContext, { defaultValue, ContextValue } from './Context';
import { EditorEvent, EditorState } from './types';

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

interface ProviderProps {
	/**
	 * Render prop for the toolbar.
	 */
	children: ReactChild;
}

export default class Provider extends React.Component<ProviderProps, EditorState> {
	state: EditorState = defaultValue.state;

	private keyboardShowListener: EmitterSubscription = null;
	private keyboardHideListener: EmitterSubscription = null;
	private keyboardTimer: number = null;
	private resolveContent: ( content: string ) => void = null;
	private webref = null;

	componentDidMount() {
		this.keyboardShowListener = Keyboard.addListener( 'keyboardWillShow', this.onKeyboardShow );
		this.keyboardHideListener = Keyboard.addListener( 'keyboardDidHide', this.onKeyboardHide );
	}

	componentWillUnmount() {
		this.keyboardShowListener.remove();
		this.keyboardHideListener.remove();
	}

	public getContent = async (): Promise<string> => {
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
			showingLink: false,
		} );
	}

	protected onDismissToolbar = () => {
		this.setState( {
			showingFormat: false,
			showingLink: false,
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

	protected onShowLink = () => {
		if ( ! this.webref ) {
			return;
		}

		// Preserve selection.
		this.webref.injectJavaScript( "document.activeElement.blur()" );

		this.setState( {
			showingFormat: false,
			showingLink: true,
		} );
	}

	render() {
		const { children } = this.props;

		const value: ContextValue = {
			state: this.state,
			getContent: this.getContent,
			setWebViewRef: this.setWebViewRef,
			onCommand: this.onCommand,
			onDismissToolbar: this.onDismissToolbar,
			onFormat: this.onFormat,
			onMessage: this.onMessage,
			onShowFormat: this.onShowFormat,
			onShowLink: this.onShowLink,
			onUpdateContent: this.onUpdateContent,
		};

		return (
			<EditorContext.Provider value={ value }>
				{ children }
			</EditorContext.Provider>
		);
	}
}
