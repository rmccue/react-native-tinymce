import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import Group from './Group';
import GroupButton from './GroupButton';
import ParagraphFormatButton from './ParagraphFormatButton';
import { EditorStatus } from '../types';

const styles = StyleSheet.create( {
	container: {
		height: 180,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		marginBottom: 20,
	},
	topRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	paraType: {
		flex: 1,
	},
	lists: {
		flex: 1,
		flexDirection: 'row',
	},
	listType: {
		flex: 3,
	},
	listIndent: {
		flex: 2,
		marginLeft: 20,
	},
} );

interface ToolbarProps {
	status: EditorStatus;
	onCommand: ( ...args: Array<string | boolean | null> ) => void;
	onDismiss: () => void;
	onFormat: ( type: string ) => void;
}

export default function Toolbar( props: ToolbarProps ) {
	const { status, onCommand, onDismiss, onFormat } = props;

	return (
		<View style={ styles.container }>
			<View style={ styles.topRow }>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={ false }
					showsVerticalScrollIndicator={ false }
					style={ styles.paraType }
				>
					<ParagraphFormatButton
						selected={ status.paraType === 'h1' }
						text="Heading"
						textStyle={ { fontSize: 20, fontWeight: '700' } }
						onPress={ () => onFormat( 'h1' ) }
					/>
					<ParagraphFormatButton
						selected={ status.paraType === 'h2' }
						text="Subheading"
						textStyle={ { fontSize: 18, fontWeight: '600' } }
						onPress={ () => onFormat( 'h2' ) }
					/>
					<ParagraphFormatButton
						selected={ status.paraType === 'p' }
						text="Body"
						onPress={ () => onFormat( 'p' ) }
					/>
					<ParagraphFormatButton
						selected={ status.paraType === 'pre' }
						text="Monospaced"
						textStyle={ { fontFamily: 'Menlo', fontSize: 14 } }
						onPress={ () => onFormat( 'pre' ) }
					/>
				</ScrollView>
				<TouchableOpacity
					onPress={ onDismiss }
				>
					<Text
						style={ {
							fontFamily: 'sfsymbols',
							fontSize: 18,
						} }
					>
						􀆄
					</Text>
				</TouchableOpacity>
			</View>
			<Group>
				<GroupButton
					first
					selected={ status.bold }
					text="􀅓"
					textStyle={ { fontFamily: 'sfsymbols' } }
					onPress={ () => onCommand( 'Bold' ) }
				/>
				<GroupButton
					selected={ status.italic }
					text="􀅔"
					textStyle={ { fontFamily: 'sfsymbols' } }
					onPress={ () => onCommand( 'Italic' ) }
				/>
				<GroupButton
					selected={ status.underline }
					text="􀅕"
					textStyle={ { fontFamily: 'sfsymbols' } }
					onPress={ () => onCommand( 'Underline' ) }
				/>
				<GroupButton
					last
					selected={ status.strikethrough }
					text="􀅖"
					textStyle={ { fontFamily: 'sfsymbols' } }
					onPress={ () => onCommand( 'Strikethrough' ) }
				/>
			</Group>
			<View style={ styles.lists }>
				<Group
					style={ styles.listType }
				>
					<GroupButton
						first
						selected={ status.paraType === 'ul' }
						text="􀋱"
						textStyle={ { fontFamily: 'sfsymbols' } }
						onPress={ () => onCommand( 'InsertUnorderedList' ) }
					/>
					<GroupButton
						selected={ status.paraType === 'ol' }
						text="􀋴"
						textStyle={ { fontFamily: 'sfsymbols' } }
						onPress={ () => onCommand( 'InsertOrderedList' ) }
					/>
					<GroupButton
						last
						text="􀋲"
						textStyle={ { fontFamily: 'sfsymbols' } }
					/>
				</Group>
				<Group
					style={ styles.listIndent }
				>
					<GroupButton
						first
						text="["
						onPress={ () => onCommand( 'outdent' ) }
					/>
					<GroupButton
						last
						text="]"
						onPress={ () => onCommand( 'indent' ) }
					/>
				</Group>
			</View>
		</View>
	);
}
