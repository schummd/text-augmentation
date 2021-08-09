import React from 'react';
import Backend from '../backend.json';
import { EditorState } from 'draft-js';

export const StoreContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
const Context = ({ children }) => {
  const backendPort = 'BACKEND_PORT' in Backend ? Backend.BACKEND_PORT : 5000;
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [page, setPage] = React.useState('/login');
  const [myReads, setMyReads] = React.useState([]);
  const [singularRead, setSingularRead] = React.useState('');
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const [search, setSearch] = React.useState(false);
  const [header, setHeader] = React.useState('News Feed')
  const [usersHeader, setUsersHeader] = React.useState('Users')


  const blankEditorState = () => {
    return EditorState.createEmpty();
  };

  const store = {
    urlBase: `http://localhost:${backendPort}`,
    token: [token, setToken],
    username: [username, setUsername],
    pageState: [page, setPage],
    myReads: [myReads, setMyReads],
    search: [search, setSearch],
    header: [header, setHeader],
    usersHeader: [usersHeader, setUsersHeader],
    singularRead: [singularRead, setSingularRead],
    editorState: [editorState, setEditorState],
    blankEditorState,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default Context;
