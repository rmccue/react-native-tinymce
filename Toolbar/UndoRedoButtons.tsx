import icons from '@rmccue/sfsymbols';
import React from 'react';

import Button from './Button';
import { EditorChildrenProps } from '../types';

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
