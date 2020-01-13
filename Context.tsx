import React, { Context } from 'react';
import { WebViewMessageEvent } from 'react-native-webview';

import { EditorState } from './types';

export interface ContextValue {
	state: EditorState;
	getContent: () => Promise<string>;
	setWebViewRef: ( ref: any ) => void;
	onCommand: ( commandId: string, showUI?: boolean, value?: string ) => void;
	onDismissToolbar: () => void;
	onFormat: ( format: string ) => void;
	onMessage: ( event: WebViewMessageEvent ) => void;
	onShowFormat: () => void;
	onShowLink: () => void;
	onUpdateContent: ( content: string ) => void;
}

export const defaultValue: ContextValue = {
	state: {
		// showingFormat: false,
		showingFormat: false,
		showingLink: false,
		// showingLink: true,
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
			link: {
				href: null,
				target: null,
			},
		},
	},
	getContent: null,
	setWebViewRef: null,
	onCommand: null,
	onDismissToolbar: null,
	onFormat: null,
	onMessage: null,
	onShowFormat: null,
	onShowLink: null,
	onUpdateContent: null,
};

const EditorContext: Context<ContextValue> = React.createContext( defaultValue );
export default EditorContext;
