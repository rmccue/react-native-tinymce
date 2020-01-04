import tinymce from 'tinymce';

// Import appropriate dependencies.
import 'tinymce/plugins/lists';

let status = {
	bold: false,
	italic: false,
	underline: false,
	strikethrough: false,
	paraType: 'p',
	undo: {
		hasUndo: false,
		hasRedo: false,
	},
};
const sendStatus = () => {
	if ( window.ReactNativeWebView ) {
		window.ReactNativeWebView.postMessage( JSON.stringify( {
			type: 'updateStatus',
			payload: status,
		} ) );
	}
};

const CORE_CSS = `
	.mce-content-body.empty {
		position: relative;
	}
	.mce-content-body.empty::before {
		opacity: 0.35;
		display: block;
		position: absolute;
		content: attr( data-placeholder );
	}
`;

window.init = config => {
	const textarea = document.getElementById( 'editor' );

	tinymce.init( {
		target: textarea,

		// Remove all UI.
		menubar: false,
		statusbar: false,
		toolbar: false,
		theme: false,
		skin: false,

		// Reset content styles.
		content_css: false,
		content_style: CORE_CSS + ( config.content_style || '' ),

		// No need for inputs.
		hidden_input: false,

		// Add some basic plugins.
		plugins: [
			'lists',
		],
	} ).then( editors => {
		const editor = editors[0];
		window.tinyEditor = editor;

		// Add our custom class to the editor container.
		editor.editorContainer.className = 'editor-wrap';

		editor.on( 'NodeChange', api => {
			// Find the nearest list item.
			for ( let i = 0; i < api.parents.length; i++ ) {
				if ( api.parents[ i ].tagName !== 'LI' ) {
					continue;
				}

				// Found a list item, check the parent.
				const parentIndex = i + 1;
				if ( parentIndex >= api.parents.length ) {
					continue;
				}

				const parent = api.parents[ parentIndex ];
				switch ( parent.tagName ) {
					case 'UL':
					case 'OL':
						status = {
							...status,
							paraType: parent.tagName.toLowerCase(),
						};
						sendStatus();
						break;

					default:
						break;
				}
			}
		} );

		const formats = [
			'bold',
			'italic',
			'underline',
			'strikethrough',
		];
		formats.forEach( format => {
			editor.formatter.formatChanged( format, value => {
				status = {
					...status,
					[ format ]: value,
				};
				sendStatus();
			}, true );
		} );

		const paraType = [
			'p',
			'blockquote',
			'h1',
			'h2',
			'pre',
			'UL',
			'OL',
		];
		paraType.forEach( type => {
			editor.formatter.formatChanged( type, value => {
				if ( ! value ) {
					return;
				}

				status = {
					...status,
					paraType: type,
				};
				sendStatus();
			} );
		} );

		// Subscribe to undo/redo state.
		editor.on( 'Undo Redo AddUndo TypingUndo ClearUndos SwitchMode', () => {
			status = {
				...status,
				undo: {
					hasUndo: editor.undoManager.hasUndo(),
					hasRedo: editor.undoManager.hasRedo(),
				},
			};
			sendStatus();
		} );

		if ( config.placeholder ) {
			editor.getBody().dataset.placeholder = config.placeholder;
		}

		// If we have content, initialize the editor.
		if ( config.content && config.content.length > 0 ) {
			editor.setContent( config.content );
		} else {
			editor.getBody().classList.add( 'empty' );
			editor.once( 'focus', () => {
				editor.getBody().classList.remove( 'empty' );
			} );
		}
	} );
};
