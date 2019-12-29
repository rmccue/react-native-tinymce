import React from 'react';

import Button from './Button';
import { EditorChildrenProps } from '../Editor';
import icons from '../icons';

export default function FormatButton( props: EditorChildrenProps ) {
	return (
		<>
			<Button
				fallback="↩"
				icon={ icons['arrow.uturn.left'] }
				label="Undo"
				onPress={ () => props.onCommand( 'undo' ) }
			/>
			<Button
				fallback="↪"
				icon={ icons['arrow.uturn.right'] }
				label="Redo"
				onPress={ () => props.onCommand( 'redo' ) }
			/>
		</>
	);
}
