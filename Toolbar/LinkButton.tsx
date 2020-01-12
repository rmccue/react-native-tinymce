import React from 'react';
import symbols from '@rmccue/sfsymbols';

import Button from './Button';
import { EditorChildrenProps } from '../Editor';

export default function FormatButton( props: EditorChildrenProps ) {
	return (
		<Button
			fallback="↩"
			icon={ symbols.link }
			label="Link"
			onPress={ () => props.onShowLink() }
		/>
	);
}
