import React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import Icon from '../Icon';

export interface ButtonProps {
	fallback?: string;
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
			<Icon
				fallback={ props.fallback || props.label }
				icon={ props.icon }
				style={ styles.buttonText }
			/>
		</TouchableOpacity>
	);
}
