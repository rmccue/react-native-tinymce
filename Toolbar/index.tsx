import React from 'react';
import {
	LayoutAnimation,
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

const HEIGHT_BUMPER = 15;
const HEIGHT_SAFE_AREA = 20;
const HEIGHT_TOOLBAR = 220;
const PADDING_Y = 20;

const styles = StyleSheet.create( {
	container: {
		height: HEIGHT_TOOLBAR + HEIGHT_BUMPER + HEIGHT_SAFE_AREA,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: PADDING_Y,
		paddingBottom: PADDING_Y + HEIGHT_BUMPER + HEIGHT_SAFE_AREA,
		backgroundColor: '#f2f2f7',

		shadowColor: '#8e8e93',
		shadowOffset: {
			width: 0,
			height: -10,
		},
		shadowOpacity: 0.2,
		shadowRadius: 10,

		position: 'absolute',
		left: 0,
		right: 0,
	},
	hidden: {
		bottom: 0 - PADDING_Y - HEIGHT_TOOLBAR - HEIGHT_BUMPER - HEIGHT_SAFE_AREA,
	},
	visible: {
		bottom: 0 - HEIGHT_BUMPER - HEIGHT_SAFE_AREA,
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
	visible: boolean;
	onCommand: ( ...args: Array<string | boolean | null> ) => void;
	onDismiss: () => void;
	onFormat: ( type: string ) => void;
}

export default class Toolbar extends React.Component<ToolbarProps> {
	componentDidUpdate() {
		LayoutAnimation.configureNext(
			LayoutAnimation.create(
				250,
				LayoutAnimation.Types.keyboard,
				LayoutAnimation.Properties.scaleXY,
			)
		);
	}

	render() {
		const { status, onCommand, onDismiss, onFormat } = this.props;

		const combinedStyle = [
			styles.container,
			this.props.visible ? styles.visible : styles.hidden,
		];

		return (
			<View style={ combinedStyle }>
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
						style={ styles.closer }
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
							text="􀋶"
							textStyle={ { fontFamily: 'sfsymbols' } }
							onPress={ () => onCommand( 'outdent' ) }
						/>
						<GroupButton
							last
							text="􀋵"
							textStyle={ { fontFamily: 'sfsymbols' } }
							onPress={ () => onCommand( 'indent' ) }
						/>
					</Group>
				</View>
			</View>
		);
	}
}
