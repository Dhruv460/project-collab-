// MarkdownRenderer.jsx
import React from 'react';
import {marked} from 'marked'

const MarkdownRenderer = ({ markdownText }) => {
  const createMarkup = () => {
    return { __html: marked(markdownText) };
  };

  return <div dangerouslySetInnerHTML={createMarkup()} />;
};

export default MarkdownRenderer;
