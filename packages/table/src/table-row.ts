import { Node } from '@ibra-kdbra/editor';
export const TableRow = (options?: Partial<Node>) =>
	Node({
		name: 'tablerow',
		content: '(tablecell|tableheader)*',
		tableRole: 'tablerow',
		parseDOM: [{ tag: 'tr' }],
		toDOM() {
			return ['tr', 0];
		},
		...options,
	});
