import React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import Icon from '../Icon';

const styles = StyleSheet.create( {
	base: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginLeft: 2,
	},
	first: {
		marginLeft: 0,
		borderTopLeftRadius: 7,
		borderBottomLeftRadius: 7,
	},
	last: {
		borderTopRightRadius: 7,
		borderBottomRightRadius: 7,
	},
	selected: {
		backgroundColor: '#ff9000',
	},
	text: {
		fontSize: 20,
	},
	selectedText: {
		color: '#fff',
	},
} );

export default function ButtonGroupButton( props ) {
	const style = [
		styles.base,
		props.first && styles.first,
		props.last && styles.last,
		props.selected && styles.selected,
		props.style,
	];

	const textStyle = [
		styles.text,
		props.selected && styles.selectedText,
	];

	return (
		<TouchableOpacity
			accessibilityLabel={ props.label }
			style={ style }
			onPress={ props.onPress }
		>
			<Icon
				fallback={ props.text }
				fallbackStyle={ props.textStyle }
				icon={ props.icon }
				style={ textStyle }
			/>
		</TouchableOpacity>
	);
};
