import { Node } from '@ibra-kdbra/editor';
export const TitleDoc = (options?: Partial<Node>) =>
	Node({
		name: 'titledoc',
		content: 'title block+',
		...options,
	});
