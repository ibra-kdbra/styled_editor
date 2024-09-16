import React, { memo } from 'react';

import './editor.css';

import { Doc } from '@ibra-kdbra/editor-doc';
import { Paragraph } from '@ibra-kdbra/editor-paragraph';
import { Text } from '@ibra-kdbra/editor-text';

import { BlockQuote } from '@ibra-kdbra/editor-blockquote';
import { Bold } from '@ibra-kdbra/editor-bold';
import { Code } from '@ibra-kdbra/editor-code';
import { CodeBlock } from '@ibra-kdbra/editor-codeblock';
import { EnumList } from '@ibra-kdbra/editor-enum-list';
import { HardBreak } from '@ibra-kdbra/editor-hardbreak';
import { Heading } from '@ibra-kdbra/editor-heading';
import { HorizontalRule } from '@ibra-kdbra/editor-horizontal-rule';
import { Italic } from '@ibra-kdbra/editor-italic';
import { ItemList } from '@ibra-kdbra/editor-item-list';
import { Link } from '@ibra-kdbra/editor-link';
import { ListItem } from '@ibra-kdbra/editor-list-item';
import { MathBlock, MathBlockNodeView } from '@ibra-kdbra/editor-mathblock';
import { Strikethrough } from '@ibra-kdbra/editor-strikethrough';
import { Table, TableCell, TableHeader, TableNodeView, TableRow } from '@ibra-kdbra/editor-table';
import { TodoItem, TodoItemNodeView } from '@ibra-kdbra/editor-todo-item';
import { TodoList } from '@ibra-kdbra/editor-todo-list';
import { Underline } from '@ibra-kdbra/editor-underline';

import { TextAlign } from '@ibra-kdbra/editor-text-align';
import { TextColor } from '@ibra-kdbra/editor-text-color';
import { TextStyle } from '@ibra-kdbra/editor-text-style';

import { FontFamily } from '@ibra-kdbra/editor-font-family';
import { Highlight } from '@ibra-kdbra/editor-highlight';

import '@ibra-kdbra/editor-codeblock-syntax-highlight/style/codeblock-syntax-highlight.css';
import '@ibra-kdbra/editor-emoji/style/emoji.css';
import '@ibra-kdbra/editor-table/style/table.css';
import '@ibra-kdbra/editor-todo-item/style/todo-item.css';
import '@ibra-kdbra/editor-toggle-item/style/toggle-item.css';
import '@ibra-kdbra/editor/style/core.css';

import '@ibra-kdbra/editor-math/style/math.css';
import '@ibra-kdbra/editor-mathblock/style/mathblock.css';

import { EditorState } from 'prosemirror-state';

import { editorPropsToViewProps } from '@ibra-kdbra/editor';

import { ProseMirror } from '@ibra-kdbra/editor-react';

import { CodeMirrorNodeViewPlugins } from '@ibra-kdbra/editor-codemirror';
import { History } from '@ibra-kdbra/editor-history';
import { Node } from 'prosemirror-model';
import { defaultMarkdownParser } from './markdown';

export const replaceDoc = (state: EditorState, doc) =>
	EditorState.create({
		schema: state.schema,
		selection: state.selection,
		storedMarks: state.storedMarks,
		plugins: state.plugins,
		doc,
	});

export const ProseMirrorMarkdown = memo<{ content: string | Node; className: string; editable?: boolean }>(props => {
	const { content = '', className = '', editable = true } = props;
	const doc = React.useMemo(
		() => (content instanceof Node ? content : defaultMarkdownParser.parse(content)!),
		[content]
	);

	const [mount, setMount] = React.useState<HTMLElement | null>(null);
	const [editorState, setEditorState] = React.useState(
		() =>
			editorPropsToViewProps({
				doc: doc,
				extensions: [
					Text(),
					Paragraph(),
					Doc(),

					BlockQuote(),
					HorizontalRule(),
					Heading(),

					CodeBlock(),
					...CodeMirrorNodeViewPlugins,

					TodoItem({
						nodeView: props => new TodoItemNodeView(props),
					}),

					TodoList(),

					ListItem(),
					ItemList(),
					EnumList(),

					HardBreak(),

					Link(),
					Bold(),
					Code(),
					Strikethrough(),
					Italic(),
					Underline(),
					Highlight(),

					Table({
						nodeView: props => new TableNodeView(props),
					}),
					TableCell(),
					TableRow(),
					TableHeader(),

					MathBlock({
						nodeView: props => new MathBlockNodeView(props),
					}),

					TextStyle(),
					TextColor(),
					TextAlign(),
					FontFamily(),

					History(),
				],
			}).state!
	);

	React.useEffect(() => setEditorState(state => replaceDoc(state, doc)), [doc]);
	const isEditable = React.useCallback(() => editable, [editable]);

	return (
		<ProseMirror
			mount={mount}
			state={editorState}
			dispatchTransaction={tr => {
				setEditorState(state => state.apply(tr));
			}}
			editable={isEditable}
		>
			<div
				className={className}
				ref={setMount}
			/>
		</ProseMirror>
	);
});
