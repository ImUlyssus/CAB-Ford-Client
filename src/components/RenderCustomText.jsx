import React from 'react';

function RenderCustomText({ content }) {
  const parseText = (text) => {
    return text
      .replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
      .replace(/\[\*\](.*?)(\[br\]|$)/g, '<li>$1</li>')
      .replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align:center;">$1</div>')
      .replace(/\[br\]/g, '<br>');  // Convert [br] to <br> for new lines
  };

  return (
    <div
      dangerouslySetInnerHTML={{ __html: parseText(content) }}
      className="text-white"
    />
  );
}

export default RenderCustomText;
