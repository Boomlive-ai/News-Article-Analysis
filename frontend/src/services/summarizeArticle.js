// services/summarizeArticle.js
import axios from 'axios';

export const summarizeArticle = async (url, text) => {
  try {
    const response = await axios.post('https://nas-lovat.vercel.app/api/summarize', {
      url,
      text,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error summarizing article:', error);
    throw new Error('Error summarizing article');
  }
};



export const localSummarizeArticle = async (url, text) => {
  try {
    const response = await axios.post('https://news-article-analysis.vercel.app/api/summarize', {
      url,
      text,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error summarizing article:', error);
    throw new Error('Error summarizing article');
  }
};


export const localAnalyseSentiment = async (url, text) => {
  try {
    const response = await axios.post('https://news-article-analysis.vercel.app/api/sentiment', {
      url,
      text,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analysing the sentiment of article:', error);
    throw new Error('Error analysing the sentiment of article:', error);
  }
};
