import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { StoreContext } from '../utils/store';
import styled from 'styled-components';

const DraftWrapper = styled.div`
  height: 545px;
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
        wrapperStyle={{
          border: '1px solid gray',
          padding: '1rem',
          overflow: 'hidden',
          height: '100%',
        }}
        editorStyle={{
          backgroundColor: '#fff',
          border: '1px solid gray',
          padding: '1rem',
          overflow: 'auto',
          height: '83%',
        }}
        toolbarStyle={{
          border: '1px solid gray',
        }}
      />
    </DraftWrapper>
  );
};

export default CustomEditor;
