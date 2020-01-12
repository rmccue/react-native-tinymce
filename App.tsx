import * as Font from 'expo-font';
import React from 'react';
import {
	Button,
	SafeAreaView,
	StyleSheet,
	View
} from 'react-native';

import Editor from './Editor';
import EditorProvider from './Provider';
import Tools from './Tools';

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
		// content: '<p>Hello world!</p>',
		content: '',
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
			<EditorProvider>
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
							placeholder="Start writing…"
							value={ this.state.content }
						/>

						<Tools />
					</View>
				</SafeAreaView>
			</EditorProvider>
		);
	}
}
