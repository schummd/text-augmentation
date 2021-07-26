import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';
import styled from 'styled-components';

const DraftWrapper = styled.div`
  height: 540px;
`

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
    <DraftWrapper>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </DraftWrapper>
  );
};

export default CustomEditor;
