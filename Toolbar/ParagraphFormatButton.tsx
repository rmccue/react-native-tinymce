import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create( {
	base: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		borderTopLeftRadius: 7,
		borderBottomLeftRadius: 7,
		borderTopRightRadius: 7,
		borderBottomRightRadius: 7,
	},
	selected: {
		backgroundColor: '#ff9000',
	},
	text: {
		fontSize: 16,
	},
	selectedText: {
		color: '#fff',
	},
} );

export default function ParagraphFormatButton( props ) {
	const style = [
		styles.base,
		props.selected && styles.selected,
		props.style,
	];

	const textStyle = [
		styles.text,
		props.selected && styles.selectedText,
		props.textStyle,
	];

	return (
		<TouchableOpacity
			style={ style }
			onPress={ props.onPress }
		>
			<Text
				style={ textStyle }
			>
				{ props.text }
			</Text>
		</TouchableOpacity>
	);
}
