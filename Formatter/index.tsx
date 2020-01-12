import icons from '@rmccue/sfsymbols';
import React from 'react';
import {
	Animated,
	LayoutAnimation,
	ScrollView,
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

import Group from './Group';
import GroupButton from './GroupButton';
import ParagraphFormatButton from './ParagraphFormatButton';
import Icon from '../Icon';
import { EditorStatus } from '../types';

const HEIGHT_BUMPER = 15;
const HEIGHT_SAFE_AREA = 20;
const HEIGHT_TOOLBAR = 220;
const PADDING_Y = 20;
const SHADOW_RADIUS = 10;
const SHADOW_OFFSET = 10;

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
			height: 0 - SHADOW_OFFSET,
		},
		shadowOpacity: 0.2,
		shadowRadius: SHADOW_RADIUS,

		position: 'absolute',
		left: 0,
		right: 0,
	},
	hidden: {
		bottom: 0 - PADDING_Y - HEIGHT_TOOLBAR - HEIGHT_BUMPER - HEIGHT_SAFE_AREA - SHADOW_RADIUS - SHADOW_OFFSET,
	},
	visible: {
		bottom: 0 - HEIGHT_BUMPER - HEIGHT_SAFE_AREA,
	},
	topRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	closer: {
		paddingLeft: 10,
		alignSelf: 'stretch',
		alignItems: 'center',
		flexDirection: 'row',
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
	style: StyleProp<ViewStyle>;
	visible: boolean;
	onCommand: ( ...args: Array<string | boolean | null> ) => void;
	onDismiss: () => void;
	onFormat: ( type: string ) => void;
}

export default class Toolbar extends React.Component<ToolbarProps> {
	state = {
		bottomOffset: new Animated.Value( styles.hidden.bottom ),
	}

	componentDidUpdate( prevProps: ToolbarProps ) {
		if ( prevProps.visible !== this.props.visible ) {
			Animated.timing(
				this.state.bottomOffset,
				{
					toValue: this.props.visible ? styles.visible.bottom : styles.hidden.bottom,
					duration: 250,
				}
			).start();
		}
	}

	render() {
		const { status, style, onCommand, onDismiss, onFormat } = this.props;

		const combinedStyle = [
			styles.container,
			{
				bottom: this.state.bottomOffset,
			},
			style,
		];

		return (
			<Animated.View
				style={ combinedStyle }
			>
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
						<Icon
							fallback="X"
							icon={ icons.xmark }
							style={ { fontSize: 18 } }
						/>
					</TouchableOpacity>
				</View>
				<Group>
					<GroupButton
						first
						icon={ icons.bold }
						selected={ status.bold }
						label="Bold"
						text="B"
						textStyle={ { fontWeight: 'bold' } }
						onPress={ () => onCommand( 'Bold' ) }
					/>
					<GroupButton
						icon={ icons.italic }
						selected={ status.italic }
						label="Italic"
						text="I"
						textStyle={ { fontStyle: 'italic' } }
						onPress={ () => onCommand( 'Italic' ) }
					/>
					<GroupButton
						selected={ status.underline }
						icon={ icons.underline }
						label="Underline"
						text="U"
						textStyle={ { textDecorationLine: 'underline' } }
						onPress={ () => onCommand( 'Underline' ) }
					/>
					<GroupButton
						last
						selected={ status.strikethrough }
						icon={ icons.strikethrough }
						label="Strikethrough"
						text="S"
						textStyle={ { textDecorationLine: 'line-through' } }
						onPress={ () => onCommand( 'Strikethrough' ) }
					/>
				</Group>
				<View style={ styles.lists }>
					<Group
						style={ styles.listType }
					>
						<GroupButton
							first
							label="UL"
							selected={ status.paraType === 'ul' }
							icon={ icons['list.bullet'] }
							text="•"
							onPress={ () => onCommand( 'InsertUnorderedList' ) }
						/>
						<GroupButton
							selected={ status.paraType === 'ol' }
							label="UL"
							icon={ icons['list.number'] }
							text="1."
							onPress={ () => onCommand( 'InsertOrderedList' ) }
						/>
						<GroupButton
							icon={ icons['list.dash'] }
							last
							text="UL"
						/>
					</Group>
					<Group
						style={ styles.listIndent }
					>
						<GroupButton
							first
							label="Outdent"
							icon={ icons['decrease.indent'] }
							text="⇤"
							onPress={ () => onCommand( 'outdent' ) }
						/>
						<GroupButton
							last
							icon={ icons['increase.indent'] }
							label="Indent"
							text="⇥"
							onPress={ () => onCommand( 'indent' ) }
						/>
					</Group>
				</View>
			</Animated.View>
		);
	}
}
