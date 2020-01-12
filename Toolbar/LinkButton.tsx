import React from 'react';

import Button from './Button';
import icons from '../icons';
import { EditorChildrenProps } from '../Editor';

export default function FormatButton( props: EditorChildrenProps ) {
	return (
		<Button
			fallback="↩"
			icon={ icons.link }
			label="Link"
			onPress={ () => props.onShowLink() }
		/>
	);
}
