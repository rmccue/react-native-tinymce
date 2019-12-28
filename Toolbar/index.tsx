import React from 'react';
import { Button } from 'react-native';

export default function Toolbar( { onShowFormat } ) {
	return (
		<Button
			title="Format"
			onPress={ onShowFormat }
		/>
	);
}
