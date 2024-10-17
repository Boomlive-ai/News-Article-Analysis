// import React, { useState } from 'react';

// const ArticleSummarizer = ({ onSummarize }) => {
//   const [articleURL, setArticleURL] = useState('');
//   const [articleText, setArticleText] = useState('');

//   const handleSummarize = () => {
//     if (articleURL || articleText) {
//       onSummarize(articleURL, articleText);
//     } else {
//       console.log('Please provide a URL or text.');
//     }
//   };

//   return (
//     <div>
//       <h3>News Article Summarizer</h3>
//       <input
//         type="text"
//         placeholder="Enter Article URL"
//         value={articleURL}
//         onChange={(e) => setArticleURL(e.target.value)}
//       />
//       <textarea
//         placeholder="Or paste the article text"
//         value={articleText}
//         onChange={(e) => setArticleText(e.target.value)}
//       />
//       <button onClick={handleSummarize}>Summarize</button>
//     </div>
//   );
// };

// export default ArticleSummarizer;
import React, { useState } from 'react';

const ArticleSummarizer = ({ onSummarize, onSentiment }) => {
  const [articleURL, setArticleURL] = useState('');
  const [articleText, setArticleText] = useState('');

  // Function to handle pasting from clipboard
  const handlePasteFromClipboard = async (setState) => {
    try {
      const text = await navigator.clipboard.readText();
      setState(text);
    } catch (err) {
      console.log('Failed to read clipboard contents.');
    }
  };

  const handleSummarize = () => {
    if (articleURL || articleText) {
      onSummarize(articleURL, articleText);
    } else {
      console.log('Please provide a URL or text.');
    }
  };


  const handleSentiment = () => {
    if (articleURL || articleText) {
      onSentiment(articleURL, articleText);
    } else {
      console.log('Please provide a URL or text.');
    }
  };
  return (
    <div>
      <h3>News Article Summarizer</h3>
      <input
        type="text"
        placeholder="Click to paste or enter the Article URL"
        value={articleURL}
        onChange={(e) => setArticleURL(e.target.value)}
        onClick={() => handlePasteFromClipboard(setArticleURL)} // Pasting URL from clipboard
      />
      <textarea
        placeholder="Click to paste or enter the article text"
        value={articleText}
        onChange={(e) => setArticleText(e.target.value)}
        onClick={() => handlePasteFromClipboard(setArticleText)} // Pasting text from clipboard
      />
      <button onClick={handleSummarize}>Summarize</button>
      <button onClick={handleSentiment}>Analyze Sentiment</button>

    </div>
  );
};

export default ArticleSummarizer;
