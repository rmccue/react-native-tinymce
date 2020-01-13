import icons from '@rmccue/sfsymbols';
import React from 'react';

import Button from './Button';
import { EditorChildrenProps } from '../types';

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
