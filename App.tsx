import * as Font from 'expo-font';
import React from 'react';
import {
	Button,
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

export default class App extends React.Component {
	state = {
		content: '<p>Hello world!</p>',
	}

	editor: Editor = null;

	componentDidMount() {
		Font.loadAsync( {
			'sfsymbols': require( './assets/SFSymbolsFallback.ttf' ),
		} );
	}

	getContent = async () => {
		const content = await this.editor.getContent();
		console.log( content );
	}

	render() {
		return (
			<SafeAreaView style={ styles.safeArea }>
				<View
					style={ styles.container }
				>
					<Button
						title="Get Content"
						onPress={ this.getContent }
					/>
					<Editor
						ref={ ref => this.editor = ref }
						value={ this.state.content }
					/>
				</View>
			</SafeAreaView>
		);
	}
}
