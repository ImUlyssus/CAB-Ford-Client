import React from 'react';

const StyleText = (text) => {
  if (typeof text !== 'string') {
    return text; // Return non-string values as is
  }

  const newText = text.trim()
    .replace(/\[br]/gi, '<br />')
    .replace(/\[b](.*?)\[\/b]/gi, '<strong>$1</strong>')
    .replace(/\[c](.*?)\[\/c]/gi, '<div style="text-align: center;">$1</div>');

  // Wrap the list items in a <ul> tag
  const formattedText = newText.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default StyleText;
