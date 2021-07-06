import React from 'react';
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../utils/store';
import 'react-toastify/dist/ReactToastify.css';

const LogoutBtn = () => {
  const context = React.useContext(StoreContext);
  const { authToken, setLoggedIn } = context;

  const history = useHistory();

  const handleClick = async () => {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    };

    const route = 'auth/logout';
    const res = await fetch(route, payload);
    if (res.error) {
      toast.error(`Error: ${res.error}`);
    } else {
      setLoggedIn(false);
      localStorage.clear();
      history.push('/');
      history.push('/Login');
    }
  };

  return (
    <Button color="tomato" ml={4} onClick={handleClick}>
      Logout
    </Button>
  );
};

export default LogoutBtn;
