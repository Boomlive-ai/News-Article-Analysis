import React, { useState } from "react";
import ArticleSummarizer from "./components/ArticleSummarizer";
import Loader from "./components/Loader"; // Import the loader component
import ArticleReliabilityReport from "./components/ArticleReliabilityReport"; // Import your report component
import "./App.css";
import {
  localAnalyseSentiment,
  localSummarizeArticle,
  summarizeArticle,
  analyseSentiment,
} from "./services/summarizeArticle";
// import { checkSourceReliability } from './services/checkSourceReliability'; // Import your check reliability service

function App() {
  const [summary, setSummary] = useState("");
  const [reliabilityAssessment, setReliabilityAssessment] = useState(""); // State for reliability assessment
  const [loading, setLoading] = useState(false); // State for loading
  const [sentiment, setSentiment] = useState({});
  const handleSummarize = async (url, text) => {
    if (url || text) {
      setLoading(true); // Set loading to true before fetching
      try {
        const { summary, reliability } = await localSummarizeArticle(url, text);
        setSummary(summary);

        // Check the reliability of the source using the generated summary
        // const assessment = await checkSourceReliability(summary);
        setReliabilityAssessment(reliability);
      } catch (error) {
        console.log("Failed to summarize the article.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }
  };

  const handleSentiment = async (url, text) => {
    if (url || text) {
      setLoading(true); // Set loading to true before fetching
      try {
        const result = await localAnalyseSentiment(url, text);
        console.log(result); // Check what you receive from the backend
        // Directly set the result as the sentiment state
        setSentiment(result.sentiment); // Ensure result has the expected structure
      } catch (error) {
        console.log("Failed to analyze sentiment of the article.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }
  };

  return (
    <div className="App">
      <ArticleSummarizer
        onSummarize={handleSummarize}
        onSentiment={handleSentiment}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {sentiment.sentiment && ( // Check if sentiment and sentiment.classification exist
            <div className="summary-container">
              <h4 className="summary-title">Sentiment Analysis:</h4>
              <div className="sentiment-section">
                <div className="sentiment-item">
                  <strong>Classification:</strong>{" "}
                  {sentiment.sentiment.classification}
                </div>
                <div className="sentiment-item">
                  <strong>Justification:</strong>{" "}
                  {sentiment.sentiment.justification}
                </div>
              </div>
              <div className="target-section">
                <h4>Target:</h4>
                <ul>
                  <li>
                    <strong>Individuals:</strong>{" "}
                    {sentiment.target?.individuals?.join(", ") || "N/A"}
                  </li>
                  <li>
                    <strong>Organizations:</strong>{" "}
                    {sentiment.target?.organizations?.join(", ") || "N/A"}
                  </li>
                  <li>
                    <strong>Communities:</strong>{" "}
                    {sentiment.target?.communities?.join(", ") || "N/A"}
                  </li>
                </ul>
              </div>
              <div className="sentiment-item">
                {/* Check if sourceofclaim is an array, use .join() if it is, otherwise display it as is */}
                <strong>Source:</strong>{" "}
                {Array.isArray(sentiment.sourceofclaim)
                  ? sentiment.sourceofclaim.join(", ")
                  : sentiment.sourceofclaim || "N/A"}
              </div>
              <div className="sentiment-item">
                <strong>Topic:</strong> {sentiment.topic || "N/A"}
              </div>
              <div className="sentiment-item">
                <strong>Themes:</strong> {sentiment.themes?.join(", ") || "N/A"}
              </div>
              <div className="sentiment-item">
                <strong>Location:</strong> {sentiment.location || "N/A"}
              </div>
            </div>
          )}

          {summary && (
            <div className="summary-container">
              <h4 className="summary-title">Summary:</h4>
              <p>{summary}</p>
            </div>
          )}
          {reliabilityAssessment && (
            <ArticleReliabilityReport
              summary={summary}
              reliabilityAssessment={reliabilityAssessment}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
