import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const createTextObject = (text_title, text_body) => {
  return { text_title, text_body };
};

export const fetchDefinition = async (urlBase, token, word) => {
  try {
    const payload = {
      method: `GET`,
      url: `${urlBase}/definition/${word}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    const result = await axios(payload);
    const resData = result.data;

    console.log('definition response:');
    console.log(resData);

    const { Definition } = resData;
    return Definition;
  } catch (error) {
    console.log(error);
    toast.error('Error retrieving definition');
  }
};

export const parsedPdfToHtml = (data, formState) => {
  const { abstractText, authors, references, sections, title, year } = data;

  const parsedTitleAndYear = formState.title
    ? `<h2>${title} (${year})</h2>`
    : '';

  const parsedAbstract = formState.abstract
    ? `<h3>Abstract</h3><p>${abstractText}</p>`
    : '';

  const parsedAuthors = formState.authors
    ? `<h3>Authors</h3><p>${authors
        .map((author) => author.name)
        .join(', ')}</p>`
    : '';

  const sectionsOfInterest = sections.filter((section) =>
    section.hasOwnProperty('heading')
  );

  const parsedSections = formState.body
    ? sectionsOfInterest
        .map((section) => `<h3>${section.heading}</h3><p>${section.text}</p>`)
        .join('')
    : '';

  const parsedReferences = formState.references
    ? `<h3>References</h3>
  ${references
    .map(
      (reference) =>
        `<p>
        ${reference.authors.join(', ')}, ${reference.year}, ${
          reference.title
        }, ${reference.venue}
        </p>`
    )
    .join('')}`
    : '';

  return `${parsedTitleAndYear}
          ${parsedAuthors}
          ${parsedAbstract}
          ${parsedSections}
          ${parsedReferences}`;
};

export const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
};

export const dataUrlToFile = async (dataUrl) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], 'original_pdf.pdf', {
    type: 'application/pdf',
  });
  return file;
};

export const getSummary = async (textToAnalyse, token) => {
  try {
    const payload = {
      method: 'POST',
      url: `/summary/`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      data: { text_body: textToAnalyse },
    };
    console.log(payload);
    const res = await axios(payload);
    const resData = res.data;
    const { summary } = resData;
    return summary;
  } catch (error) {
    return;
  }
};

export const getKeywords = async (textToAnalyse, token) => {
  try {
    const payload = {
      method: 'POST',
      url: `/keywords/`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      data: { text_body: textToAnalyse },
    };
    console.log(payload);
    const res = await axios(payload);
    const resData = res.data;
    const { keywords } = resData;
    return keywords;
  } catch (error) {
    return;
  }
};

export const getArticles = async (username) => {
  try {
    const payload = {
      method: 'GET',
      url: `/text/fetchall/${username}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(payload);
    const res = await axios(payload);
    const resData = res.data;
    console.log(resData);
    if (resData.status === 'success') {
      console.log('success');
    } else {
      toast.warn(`${resData.message}`);
    }
    const { data } = resData;
    return data;
  } catch (error) {
    toast.error('Error retrieving Reads from server.');
  }
};

export const postToScienceParse = async (rawBase64Data) => {
  try {
    const payload = {
      method: `POST`,
      url: `/parse/`,
      headers: {
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      data: rawBase64Data,
    };

    const res = await axios(payload);
    const resData = res.data;
    console.log(resData);
    if (resData.status === 'success') {
      toast.success(`${resData.message}`);
      return resData;
    } else {
      toast.warn(`${resData.message}`);
    }
  } catch (error) {
    console.log(error);
    toast.error('Error connecting to parser.');
  }
};
