import React from 'react';
import {
	StyleSheet,
	View
} from 'react-native';

const styles = StyleSheet.create( {
	base: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
} );

export default function ButtonGroup( props ) {
	return (
		<View
			style={ [ styles.base, props.style ] }
		>
			{ props.children }
		</View>
	);
}
