import { Node } from '@ibra-kdbra/editor';
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
export const Doc = (options?: Partial<Node>) =>
	Node({
		name: 'doc',
		content: 'block+',
		marks: 'link',
		...options,
	});

export default Doc;
