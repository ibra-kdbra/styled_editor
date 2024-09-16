# Headless Editor

<div align="center">
 <a href="">
  <img width="632px" src="./demo.png" alt="image of editor demo" title="click to navigate to demo">
 </a>
</div>

This is a rich text editor built upon the [ProseMirror](https://prosemirror.net/) framework.
It is based off [tiptap](https://tiptap.dev/) and [rich-markdown-editor](https://github.com/outline/rich-markdown-editor).

## Usage

To use with plain JavaScript, pass in the DOM element where you'd want to mount as `place` and an array of extensions to use.

```js
import { Editor } from '@ibra-kdbra/editor';
import { Text } from '@ibra-kdbra/editor-text';
import { Paragraph } from '@ibra-kdbra/editor-paragraph';
import { Doc } from '@ibra-kdbra/editor-doc';
import '@ibra-kdbra/editor/style/core.css';

let place = document.querySelector('#editor');
let editor = new Editor({
 place,
 extensions: [Text(), Paragraph(), Doc()],
});
```

To use with React,

```tsx
import { Editor, editorPropsToViewProps } from '@ibra-kdbra/editor';
import { Text } from '@ibra-kdbra/editor-text';
import { Paragraph } from '@ibra-kdbra/editor-paragraph';
import { Doc } from '@ibra-kdbra/editor-doc';
import { ProseMirror } from '@ibra-kdbra/editor-react';
import '@ibra-kdbra/editor/style/core.css';

export const EditorDemo = React.memo(() => {
 const [mount, setMount] = React.useState<HTMLElement | null>(null);
 const [editorState] = React.useState(
  () =>
   editorPropsToViewProps({
    content: JSON.parse(localStorage.getItem('content')),
    extensions: [Text(), Paragraph(), Doc()],
   }).state
 );
 return (
  <ProseMirror
   mount={mount}
   defaultState={editorState}
   dispatchTransaction={function dispatch(this: EditorView, tr) {
    this.updateState(this.state.apply(tr));
    localStorage.setItem('content', JSON.stringify(this.state.doc.toJSON()));
   }}
  >
   <div ref={setMount} />
  </ProseMirror>
 );
});
```

### Similar Libraries

- [tiptap](https://tiptap.dev/)
- [prosekit](https://github.com/ocavue/prosekit)
- [remirror](https://github.com/remirror/remirror)
- [novel](https://github.com/steven-tey/novel)
- [rich-markdown-editor](https://github.com/outline/outline/tree/main/shared/editor)
- [stacks-editor](https://github.com/StackExchange/Stacks-Editor)
- [atlaskit](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-core/)
- [milkdown](https://github.com/Milkdown/milkdown)
