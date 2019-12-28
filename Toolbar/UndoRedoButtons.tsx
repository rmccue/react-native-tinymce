import React from 'react';

import Button from './Button';
import { EditorChildrenProps } from '../Editor';

export default function FormatButton( props: EditorChildrenProps ) {
	return (
		<>
			<Button
				icon="􀄼"
				label="Undo"
				onPress={ () => props.onCommand( 'undo' ) }
			/>
			<Button
				icon="􀄽"
				label="Redo"
				onPress={ () => props.onCommand( 'redo' ) }
			/>
		</>
	);
}
