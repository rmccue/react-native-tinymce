import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';

export interface ButtonProps {
	icon: string;
	label: string;
	onPress(): void;
}

const styles = StyleSheet.create( {
	button: {
		flex: 1,
	},
	buttonText: {
		padding: 8,
		fontSize: 20,
		fontFamily: 'sfsymbols',
		color: '#007aff',
		textAlign: 'center',
	},
} );

export default function FormatButton( props: ButtonProps ) {
	return (
		<TouchableOpacity
			accessibilityLabel={ props.label }
			accessibilityRole="button"
			style={ styles.button }
			onPress={ props.onPress }
		>
			<Text
				style={ styles.buttonText }
			>
				{ props.icon }
			</Text>
		</TouchableOpacity>
	);
}
