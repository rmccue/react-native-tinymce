import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import EditorContext from './Context';
import Formatter from './Formatter';
import Link from './Link';
import Toolbar from './Toolbar';
import { EditorChildrenProps } from './types';

const styles = StyleSheet.create( {
	toolbar: {
		height: 50,
		backgroundColor: '#f2f2f7',
	},
} );

interface ToolsProps {
	/**
	 * Styles to apply to the formatter.
	 */
	formatterStyle?: StyleProp<ViewStyle>;

	/**
	 * Render prop for the toolbar.
	 */
	children( props: EditorChildrenProps ): JSX.Element;
}

export default function Tools( props: ToolsProps ) {
	return (
		<EditorContext.Consumer>
			{ context => (
				<>
					<Formatter
						status={ context.state.textStatus }
						style={ props.formatterStyle }
						visible={ context.state.showingFormat }
						onCommand={ context.onCommand }
						onDismiss={ context.onDismissToolbar }
						onFormat={ context.onFormat }
					/>

					{ context.state.showingLink ? (
						<Link
							status={ context.state.textStatus }
							onCommand={ context.onCommand }
							onDismiss={ context.onDismissToolbar }
							onFormat={ context.onFormat }
						/>
					) : (
						<KeyboardAccessoryView
							avoidKeyboard
							hideBorder
							inSafeAreaView
							style={ styles.toolbar }
						>
							{ ! context.state.showingFormat ? (
								props.children( {
									onCommand: context.onCommand,
									onShowFormat: context.onShowFormat,
									onShowLink: context.onShowLink,
								} )
							) : null }
						</KeyboardAccessoryView>
					) }
				</>
			) }
		</EditorContext.Consumer>
	);
}

Tools.defaultProps = {
	children: props => <Toolbar { ...props } />,
	formatterStyle: null,
} as ToolsProps;
