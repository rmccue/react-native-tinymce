import React from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

import { EditorChildrenProps } from '../Editor';
import FormatButton from './FormatButton';

const styles = StyleSheet.create( {
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
} );

export default function Toolbar( props: EditorChildrenProps ) {
	return (
		<View style={ styles.container }>
			<FormatButton
				{ ...props }
			/>
		</View>
	);
}
