import { Mark, markInputRule } from '@ibra-kdbra/editor';
import { toggleMark } from 'prosemirror-commands';
export * from './markdown';

export const Italic = (options?: Partial<Mark>) =>
	Mark({
		name: 'italic',

		parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
		toDOM() {
			return ['em', 0];
		},

		inputRules({ markType }) {
			return [markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, markType)];
		},

		commands({ markType }) {
			return {
				italic: () => toggleMark(markType),
			};
		},

		keymap({ markType }) {
			return {
				'Mod-i': toggleMark(markType),
				'Mod-I': toggleMark(markType),
			};
		},

		...options,
	});

export default Italic;
