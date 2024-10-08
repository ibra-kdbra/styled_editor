import { Node } from '@ibra-kdbra/editor';
import { InputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

import { isEmojiSupported } from 'is-emoji-supported';

import emojiRegex from 'emoji-regex';

const SHORT_EMOJI_REGEXP = /(\p{EPres}|\p{ExtPict})/gu;
const EMOJI_REGEXP = emojiRegex();

const SHORTCODE_INPUT_REGEXP = /:([a-zA-Z0-9_+-]+):$/;
const sHORTCODE_PASTE_REGEXP = /:([a-zA-Z0-9_+-]+):/g;

function unicodeToEmojiSource(unicode: string) {
	return `https://brianhung.info/EmojiPicker/assets/twemoji.064e717d.svg#${unicode}`;
}

function nativeEmojiToUnicode(nativeEmoji: string) {
	return raw(nativeEmoji)
		.split(' ')
		.map(val => parseInt(val).toString(16))
		.join('-');
}

function raw(input) {
	if (input.length === 1) {
		return input.charCodeAt(0).toString();
	} else if (input.length > 1) {
		const pairs = [];
		for (var i = 0; i < input.length; i++) {
			// high surrogate
			if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
				// low surrogate
				if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {
					pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000);
				}
			} else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
				// modifiers and joiners
				pairs.push(input.charCodeAt(i));
			}
		}
		return pairs.join(' ');
	}
	return '';
}

export const Emoji = (options?: Partial<Node>) =>
	Node({
		name: 'emoji',

		attrs: { char: {} },
		inline: true,
		group: 'inline',
		draggable: false,
		selectable: false,
		parseDOM: [
			{
				tag: '.emoji',
				getAttrs: (dom: HTMLImageElement) => {
					return { char: dom.getAttribute('alt') };
				},
			},
		],

		toDOM: (node: PMNode) => {
			// TODO: use native representation if twemoji not available

			options.useNativeEmojis;

			isEmojiSupported(emoji.emoji);

			let emoji = shortcodeToEmoji(node.attrs.name, options.emojis);
			if (emoji) {
				return [
					'img',
					{
						class: 'emoji',
						'data-name': node.attrs.name,
						draggable: 'false',
						alt: node.attrs.name,
						src: unicodeToEmojiSource(nativeEmojiToUnicode(node.attrs.name)),
					},
				];
			} else {
				return [
					'span',
					{
						class: 'emoji',
						'data-name': node.attrs.name,
					},
					`:${node.attrs.name}:`,
				];
			}
		},

		inputRules({ nodeType }) {
			return [
				new InputRule(EMOJI_REGEXP, (state, match: RegExpExecArray, start, end) => {
					const [char] = match;
					console.log('char', char, char.length, match, start, end);
					return state.tr.replaceWith(start, end, nodeType.create({ char }));
				}),
			];
		},

		plugins() {
			return [
				new Plugin({
					props: {
						// Replaces emoji text chars with node repesentation.
						transformPasted: (slice: Slice): Slice => {
							return new Slice(textToEmoji(slice.content), slice.openStart, slice.openEnd);
						},
					},
				}),
			];
		},

		...options,
	});

import { Fragment, Slice } from 'prosemirror-model';

function textToEmoji(fragment: Fragment): Fragment {
	var parsed: PMNode[] = [];
	fragment.forEach((child: PMNode) => {
		if (child.isText) {
			const text = child.text;
			var pos = 0,
				match: RegExpExecArray;
			while ((match = EMOJI_REGEXP.exec(text))) {
				var start = match.index;
				var end = start + match[0].length;
				var emojiType = child.type.schema.nodes.emoji;
				// copy across the text from before the match
				if (start > 0 && start > pos) {
					parsed.push(child.cut(pos, start));
				}
				var emojiChar = text.slice(start, end);
				parsed.push(emojiType.create({ char: emojiChar }));
				pos = end;
			}
			// copy remaining text in text node
			if (pos < text.length) {
				parsed.push(child.cut(pos));
			}
		} else {
			parsed.push(child.copy(textToEmoji(child.content)));
		}
	});
	return Fragment.fromArray(parsed);
}

function emojiToText(fragment: Fragment): Fragment {
	var parsed: PMNode[] = [];
	fragment.forEach(function replaceEmojiWithText(child: PMNode) {
		if (child.type == child.type.schema.nodes.emoji) {
			var emojiChar = child.attrs.char;
			var textType = child.type.schema.nodes.text;
			parsed.push(textType.create(null, emojiChar));
		} else {
			parsed.push(child.copy(emojiToText(child.content)));
		}
	});
	return Fragment.fromArray(parsed);
}

function shortcodeToEmoji(shortcode, emojis) {
	return emojis.find(item => shortcode === item.name || item.shortcodes.includes(shortcode));
}
