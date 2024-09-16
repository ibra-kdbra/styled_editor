import MarkdownIt from 'markdown-it';

import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown';

import * as blockquote from '@ibra-kdbra/editor-blockquote';
import * as codeblock from '@ibra-kdbra/editor-codeblock';
import * as doc from '@ibra-kdbra/editor-doc';
import * as enumList from '@ibra-kdbra/editor-enum-list';
import * as hardBreak from '@ibra-kdbra/editor-hardbreak';
import * as heading from '@ibra-kdbra/editor-heading';
import * as horizontalRule from '@ibra-kdbra/editor-horizontal-rule';
import * as image from '@ibra-kdbra/editor-image';
import * as itemList from '@ibra-kdbra/editor-item-list';
import * as listItem from '@ibra-kdbra/editor-list-item';
import * as paragraph from '@ibra-kdbra/editor-paragraph';
import * as text from '@ibra-kdbra/editor-text';

import { schemaFromExtensions } from '@ibra-kdbra/editor';
import * as bold from '@ibra-kdbra/editor-bold';
import * as code from '@ibra-kdbra/editor-code';
import * as italic from '@ibra-kdbra/editor-italic';
import * as link from '@ibra-kdbra/editor-link';
import * as underline from '@ibra-kdbra/editor-underline';

const imports = [
	doc,
	blockquote,
	codeblock,
	heading,
	horizontalRule,
	itemList,
	enumList,
	listItem,
	paragraph,
	image,
	hardBreak,
	text,
	bold,
	italic,
	link,
	code,
	underline,
];

const schema = schemaFromExtensions(
	imports.map(i => i.default()),
	'doc'
);

export const defaultMarkdownSerializer = new MarkdownSerializer(
	{
		blockquote: blockquote.toMarkdown,
		codeblock: codeblock.toMarkdown,
		heading: heading.toMarkdown,
		horizontalrule: horizontalRule.toMarkdown,
		itemlist: itemList.toMarkdown,
		enumlist: enumList.toMarkdown,
		listitem: listItem.toMarkdown,
		paragraph: paragraph.toMarkdown,
		image: image.toMarkdown,
		hardbreak: hardBreak.toMarkdown,
		text: text.toMarkdown,
	},
	{
		bold: bold.toMarkdown,
		italic: italic.toMarkdown,
		link: link.toMarkdown,
		code: code.toMarkdown,
		underline: underline.toMarkdown,
	},
	{
		strict: false,
	}
);

const tokensList = [
	blockquote.fromMarkdown,
	codeblock.fromMarkdown,
	heading.fromMarkdown,
	horizontalRule.fromMarkdown,
	itemList.fromMarkdown,
	enumList.fromMarkdown,
	listItem.fromMarkdown,
	paragraph.fromMarkdown,
	image.fromMarkdown,
	hardBreak.fromMarkdown,
	bold.fromMarkdown,
	italic.fromMarkdown,
	link.fromMarkdown,
	code.fromMarkdown,
	underline.fromMarkdown,
];

const tokens = tokensList.reduce((tokens, token) => ({ ...tokens, ...token }), {});
const tokenizer = MarkdownIt('commonmark', { html: false });

export const defaultMarkdownParser = new MarkdownParser(schema, tokenizer, tokens);
export const createMarkdownParser = (schema: any) => new MarkdownParser(schema, tokenizer, tokens);
