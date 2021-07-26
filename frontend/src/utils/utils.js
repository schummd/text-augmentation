import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


export const createTextObject = (text_title, text_body) => {
  return { text_title, text_body };
};


export const fetchDefinition = async (urlBase, token, word, setFunc) => {
  try {
    const payload = {
      method: `GET`,
      url: `${urlBase}/definition/${word}`,
      // url: `/definition/${word}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    const result = await axios(payload);
    const resData = result.data;

    console.log('definition response:')
    console.log(resData);

    setFunc(resData.Definition);

  } catch (error) {
    console.log(error)
    toast.error('Error retrieving definition');
  }  
};
