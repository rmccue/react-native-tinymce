import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	View
} from 'react-native';

import Editor from './Editor';

const styles = StyleSheet.create( {
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
	},
} );

export default function App() {
	return (
		<SafeAreaView style={ styles.safeArea }>
			<View
				style={ styles.container }
			>
				<Editor />
			</View>
		</SafeAreaView>
	);
}
