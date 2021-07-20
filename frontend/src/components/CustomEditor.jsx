import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';

const CustomEditor = () => {
  const context = React.useContext(StoreContext);

  const [editorState, setEditorState] = context.editorState;

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  React.useEffect(() => {
    console.log('changed');
  }, [editorState]);

  return (
    <div className="App">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </div>
  );
};

export default CustomEditor;
