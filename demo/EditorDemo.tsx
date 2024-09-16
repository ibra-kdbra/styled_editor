import React, { memo } from 'react';
import ContextMenu from './contextmenu';
import Toolbar from './EditorToolbar';

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
import { History } from '@ibra-kdbra/editor-history';
import { HorizontalRule } from '@ibra-kdbra/editor-horizontal-rule';
import { Image } from '@ibra-kdbra/editor-image';
import { Italic } from '@ibra-kdbra/editor-italic';
import { ItemList } from '@ibra-kdbra/editor-item-list';
import { Link } from '@ibra-kdbra/editor-link';
import { ListItem } from '@ibra-kdbra/editor-list-item';
import { MathBlock, MathBlockCodeMirrorNodeViewPlugin } from '@ibra-kdbra/editor-mathblock';
import { Strikethrough } from '@ibra-kdbra/editor-strikethrough';
import { Table, TableCell, TableHeader, TableNodeView, TableRow } from '@ibra-kdbra/editor-table';
import { TodoItem, TodoItemNodeViewPlugin } from '@ibra-kdbra/editor-todo-item';
import { TodoList } from '@ibra-kdbra/editor-todo-list';
import { Underline } from '@ibra-kdbra/editor-underline';

import { TextAlign } from '@ibra-kdbra/editor-text-align';
import { TextColor } from '@ibra-kdbra/editor-text-color';
import { TextStyle } from '@ibra-kdbra/editor-text-style';

import { FontFamily } from '@ibra-kdbra/editor-font-family';
import { Highlight } from '@ibra-kdbra/editor-highlight';

import { CodeMirrorNodeViewPlugins } from '@ibra-kdbra/editor-codemirror';

import { Mermaid, MermaidNodeViewPlugin } from '@ibra-kdbra/editor-mermaid';

import '@ibra-kdbra/editor-codeblock-syntax-highlight/style/codeblock-syntax-highlight.css';
import '@ibra-kdbra/editor-emoji/style/emoji.css';
import '@ibra-kdbra/editor-table/style/table.css';
import '@ibra-kdbra/editor-todo-item/style/todo-item.css';
import '@ibra-kdbra/editor-toggle-item/style/toggle-item.css';
import '@ibra-kdbra/editor/style/core.css';

import '@ibra-kdbra/editor-math/style/math.css';
import '@ibra-kdbra/editor-mathblock/style/mathblock.css';

import { DefaultKeymap, editorPropsToViewProps } from '@ibra-kdbra/editor';

import EditorWordCount from './EditorWordCount';

import { ProseMirror } from '@ibra-kdbra/editor-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { EditorView } from 'prosemirror-view';
import { DragMenu } from './DragMenu';
import EditorCommandMenu from './EditorCommandMenu';
import { AutocompleteCommands } from './EditorCommandMenu/autocomplete-commands-plugin';
import EditorFloatingToolbar from './EditorFloatingToolbar';
import { WindowView } from './WindowView';

import {
	PointerMovePlugin,
	PseudoSelectionViewBlur,
	SelectionChangePointerPlugin,
	ViewFocusPlugin,
} from './ViewPlugins';

export const EditorDemo = memo(() => {
	const [mount, setMount] = React.useState<HTMLElement | null>(null);

	const [editorState, setEditorState] = React.useState(
		() =>
			editorPropsToViewProps({
				content: JSON.parse(localStorage.getItem('content')),
				extensions: [
					Text(),
					Paragraph(),
					Doc(),

					BlockQuote(),
					HorizontalRule(),
					Heading(),

					Mermaid(),
					MermaidNodeViewPlugin(),

					CodeBlock(),
					...CodeMirrorNodeViewPlugins,

					TodoItem(),
					TodoItemNodeViewPlugin(),

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

					Image(),

					History(),

					Table({
						nodeView: props => new TableNodeView(props),
					}),
					TableCell(),
					TableRow(),
					TableHeader(),

					MathBlock(),
					MathBlockCodeMirrorNodeViewPlugin(),

					DefaultKeymap(),

					TextStyle(),
					TextColor(),
					TextAlign(),
					FontFamily(),

					PointerMovePlugin,
					SelectionChangePointerPlugin,
					ViewFocusPlugin,
					PseudoSelectionViewBlur({ style: 'background: rgba(45, 170, 219, 0.3);' }),

					AutocompleteCommands,
				],
			}).state!
	);

	return (
		<div className="py-8">
			<div
				className="mx-auto max-w-screen-md space-y-2 rounded-sm border-2 border-gray-200"
				id="editor"
			>
				<ProseMirror
					mount={mount}
					state={editorState}
					dispatchTransaction={function dispatch(this: EditorView, tr) {
						setEditorState(state => state.apply(tr));
						localStorage.setItem('content', JSON.stringify(tr.doc.toJSON()));
					}}
				>
					<Toolbar className="sticky top-0 flex items-center space-x-2 rounded-md bg-white px-4 py-2 [overflow-x:overlay] [&_button]:shrink-0" />
					<ContextMenu>
						<div
							className="p-4"
							ref={setMount}
						/>
					</ContextMenu>
					<EditorCommandMenu />
					<EditorFloatingToolbar />
					<EditorWordCount
						state={editorState}
						setState={setEditorState}
					/>
					<DragMenu />
					<WindowView />
					{/* <CodeBlockLangSelect /> */}
				</ProseMirror>
			</div>
			<a
				href="https://github.com/ibra-kdbra/styled_editor"
				className="fixed bottom-4 right-4 block h-8 w-8 rounded-full bg-white"
				title="view source code on GitHub"
				target="_blank"
			>
				<GitHubLogoIcon className="h-8 w-8" />
			</a>
		</div>
	);
});
