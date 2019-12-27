export interface EditorStatus {
	bold: boolean;
	italic: boolean;
	underline: boolean;
	strikethrough: boolean;
	paraType: 'p' | 'blockquote' | 'h1' | 'h2' | 'pre' | 'ul' | 'ol';
}

export interface EditorEvent {
	type: string;
	payload: object;
}

export interface UpdateStatusEvent extends EditorEvent {
	type: 'updateStatus';
	payload: EditorStatus;
}
