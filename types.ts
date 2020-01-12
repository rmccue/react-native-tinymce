export interface EditorStatus {
	bold: boolean;
	italic: boolean;
	underline: boolean;
	strikethrough: boolean;
	paraType: 'p' | 'blockquote' | 'h1' | 'h2' | 'pre' | 'ul' | 'ol';
	undo: {
		hasUndo: boolean,
		hasRedo: boolean,
	},
	link: {
		href: string | null;
		target: string | null;
	}
}

export interface BaseEditorEvent {
	type: string;
	payload: object;
}

export interface UpdateStatusEvent extends BaseEditorEvent {
	type: 'updateStatus';
	payload: EditorStatus;
}

export interface GetContentEvent extends BaseEditorEvent {
	type: 'getContent';
	payload: {
		html: string;
	}
}

export type EditorEvent = UpdateStatusEvent | GetContentEvent;

export interface EditorChildrenProps {
	onCommand( commandId: string, showUI?: boolean, value?: any ): void;
	onShowFormat(): void;
	onShowLink(): void;
}

export interface EditorState {
	showingFormat: boolean;
	showingLink: boolean;
	textStatus: EditorStatus;
}
