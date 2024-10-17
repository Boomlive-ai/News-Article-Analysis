// const axios = require("axios");
// const { load } = require("cheerio");
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // Importing the Google Generative AI library

// const {  OpenAI } = require("openai");

// require("dotenv").config();


// const genAI = new GoogleGenerativeAI(`AIzaSyAVfaNvl6IxcXgCzCe-l7bwzEOtQbE1KRs`); // Initialize the client with your API key

// const fetchArticleContent = async (url) => {
//   try {
//     const response = await axios.get(url);
//     const htmlContent = response.data;
//     const $ = load(htmlContent);
//     let articleText = "";

//     $("article p").each((index, element) => {
//       articleText += $(element).text() + "\n";
//     });

//     if (!articleText) {
//       $("p").each((index, element) => {
//         articleText += $(element).text() + "\n";
//       });
//     }

//     return articleText.trim();
//   } catch (error) {
//     console.error("Error fetching article:", error);
//     throw new Error("Error fetching article content");
//   }
// };

// const summarizeArticle = async (articleText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the model you want to use
//     const prompt = `Summarize the following article:\n\n${articleText}`; // Prepare your prompt

//     const result = await model.generateContent([prompt]); // Call the method to generate content
//     const summary = result.response.text(); // Get the generated summary text
//     return summary;
//   } catch (error) {
//     console.error("Error summarizing article:", error);
//     throw new Error("Error summarizing article");
//   }
// };
// // Implement the checkSourceReliability function

// const checkSourceReliability = async (articleText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `Based on the following article content, evaluate the reliability of the source. Article content: ${articleText}`;

//     const result = await model.generateContent([prompt]);
//     const reliability = result.response.text();
//     return reliability;
//   } catch (error) {
//     console.error("Error assessing source reliability:", error);
//     return "Unable to assess reliability";
//   }
// };

// const analyzeSentiment = async (articleText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Prompts for each key to get one-word values
//     const prompts = {
//       Name: `Extract the full name of the individual or organization mentioned in the article. Respond with null if not stated: ${articleText}`,
//       Classification: `Provide the category of the entry (e.g., Person, News Channel, Politician, etc.) in one word. Respond with null if not stated: ${articleText}`,
//       ContentType: `Specify the format of the content (e.g., article, video, social media post) in one word. Respond with null if not stated: ${articleText}`,
//       Reason: `Justify the inclusion of the entry in one word. Respond with null if not stated: ${articleText}`,
//       TargetGroup: `Identify the intended audience for the misinformation in one word. Respond with null if not stated: ${articleText}`,
//       FavPolitical: `State the favored political affiliation in one word, or respond with null if not stated: ${articleText}`,
//       NonFavPolitical: `State the non-favored political affiliation in one word, or respond with null if not stated: ${articleText}`,
//       Platform: `Specify the specific news platform (e.g., NDTV, BBC, etc.) where the information was shared in one word full company name. Respond with null if not stated: ${articleText}`,
//       Target: `Identify who is being targeted by the claim in one word. Respond with null if not stated: ${articleText}`,
//       Sentiment: `State whether the claim is targeting positively, negatively, or neutrally in one word. Respond with null if not stated: ${articleText}`,
//       Topic: `Specify the topic of the claim (e.g., Baba Siddique murder, LS elections, India-Canada row) in one word. Respond with null if not stated: ${articleText}`,
//       Theme: `Identify the theme (politics, communal, sports, entertainment, international, religious) in one word, without asterisks or formatting. Respond with null if not stated: ${articleText}`,
//     };

//     // Collect results
//     const results = {};

//     // for (const [key, prompt] of Object.entries(prompts)) {
//     //   const result = await model.generateContent([prompt]);
//     //   const responseText = result.response.text().trim();

//     //   // Set to null if the response indicates no specific value
//     //   results[key] = (responseText.toLowerCase() === "null" || responseText === "") ? null : responseText.replace(/\*\*/g, '').trim();
//     // }

//         for (const [key, prompt] of Object.entries(prompts)) {
//       const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt,
//         max_tokens: 20,
//       });

//       const responseText = response.data.choices[0].text.trim();
//       results[key] = (responseText.toLowerCase() === "null" || responseText === "") ? null : responseText.replace(/\*\*/g, '').trim();
//     }

//     return results; // Return the structured JSON
//   } catch (error) {
//     console.error('Error analyzing sentiment:', error);
//     return null; // Handle error gracefully
//   }
// };

// const summarizeNews = async (req, res) => {
//   const { url, text } = req.body; // Expecting URL and text in the request body

//   // Check if both URL and text are empty
//   if (!url && !text) {
//     return res.status(400).json({ error: "Either URL or text is required" });
//   }

//   try {
//     let articleText;

//     // If text is provided, use it directly
//     if (text) {
//       articleText = text;
//     }
//     // If URL is provided, fetch the article content
//     else if (url) {
//       articleText = await fetchArticleContent(url);
//     }
//     // const reliability = await checkSourceReliability(articleText);

//     // // Summarize the article text using the Google Generative AI
//     // const summary = await summarizeArticle(articleText);

//     const sentiment = await analyzeSentiment(articleText);

//     res.status(200).json({  sentiment }); // Send back the summary
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   summarizeNews,
// };











const axios = require("axios");
const { load } = require("cheerio");
const { OpenAI } = require("openai"); // Import OpenAI
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Importing the Google Generative AI library

require("dotenv").config();

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
  project: process.env.OPENAI_PROJECT,
  apiKey:  process.env.OPENAI_API_KEY, // Use the API key from the .env file
});


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Initialize the client with your API key

const fetchArticleContent = async (url) => {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    const $ = load(htmlContent);
    let articleText = "";

    $("article p").each((index, element) => {
      articleText += $(element).text() + "\n";
    });

    if (!articleText) {
      $("p").each((index, element) => {
        articleText += $(element).text() + "\n";
      });
    }
    console.log(articleText);
    
    return articleText.trim();
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Error("Error fetching article content");
  }
};

const summarizeArticle = async (articleText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the model you want to use
    const prompt = `Summarize the following article:\n\n${articleText}`; // Prepare your prompt

    const result = await model.generateContent([prompt]); // Call the method to generate content
    const summary = result.response.text(); // Get the generated summary text
    return summary;
  } catch (error) {
    console.error("Error summarizing article:", error);
    throw new Error("Error summarizing article");
  }
};
// Implement the checkSourceReliability function

const checkSourceReliability = async (articleText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Based on the following article content, evaluate the reliability of the source. Article content: ${articleText}`;

    const result = await model.generateContent([prompt]);
    const reliability = result.response.text();
    return reliability;
  } catch (error) {
    console.error("Error assessing source reliability:", error);
    return "Unable to assess reliability";
  }
};

// const fetchArticleContent = async (url) => {
//   try {
//     const response = await axios.get(url);
//     const htmlContent = response.data;
//     const $ = load(htmlContent);
//     let articleText = "";

//     $("article p").each((index, element) => {
//       articleText += $(element).text() + "\n";
//     });

//     if (!articleText) {
//       $("p").each((index, element) => {
//         articleText += $(element).text() + "\n";
//       });
//     }

//     return articleText.trim();
//   } catch (error) {
//     console.error("Error fetching article:", error);
//     throw new Error("Error fetching article content");
//   }
// };

const analyzeSentiment = async (articleText) => {
  try {
    // const prompts = {
    //   Target: `Target: Identify the name of the primary subject or individual targeted by the claim in the article. Provide only the name of the target, without any additional details or descriptions just breif about target in two words, note the target mentioned should be correct. Article content: ${articleText}`,
      
    //   Sentiment: `Analyze the overall sentiment of the article based on how the subject is portrayed. Is it positive, negative, or neutral? Respond in 1-2 lines with a brief justification. Ensure that any personal details, such as the individual's status, are not assumed and are fact-checked. Article content: ${articleText}`,
      
    //   Topic: `Summarize the main topic of the article in one sentence, focusing on the key event or claim. Ensure all personal details mentioned are accurate and not assumed. Article content: ${articleText}`,
      
    //   Theme: `Identify the main theme of the article in 1-2 words (e.g., "misinformation," "politics"). Focus on the central subject matter. Article content: ${articleText}`,
      
    //   Location: `Provide the location relevant to the key event. Do not assume any locations or details unless explicitly mentioned. If no specific city is mentioned, provide the country or region related to the event in one sentence only. Article content: ${articleText}`,
    // };
    
    


  //   const prompts = {
  //     Target: `Identify the primary subject of the claim in the article. Provide the name of the target and a brief 2-3 word description for clarity (e.g., "Narendra Modi - The Prime Minister"). If the claim targets a broader group, specify that as well. Article content: ${articleText}`,
  
  //     Sentiment: `As an expert analyst from a fact-checking organization, analyze the sentiment regarding how the **false claim** or **misinformation** is portrayed. Is the sentiment towards the claim positive, negative, or neutral? Respond with one word: "Positive," "Negative," or "Neutral." Then provide a justification with specific examples or quotes from the article (1-2 sentences). Be aware of nuances like sarcasm or mixed feelings. Article content: ${articleText}`,
  
  //     Topic: `Summarize the main topic of the article in one clear sentence, focusing on the key event or claim. Ensure accuracy and do not include assumed personal details. Highlight any significant context that informs the topic. Article content: ${articleText}`,
  
  //     Theme: `Identify the main theme of the article in 1-2 words from the following categories: "international," "political," "crime," "entertainment," "economic," "social," "religious," "environmental," or "cultural." Multiple themes may be present; specify if applicable. Article content: ${articleText}`,
  
  //     Location: `Provide the specific location relevant to the key event discussed in the article. If no specific city is mentioned, state the country or region associated with the event. Include any relevant context that clarifies the location. Article content: ${articleText}`,
  // };
  
  const prompts = {
    // Target: `Provide the name who is being targeted by the claim and describe the target as an individual,community, group, organization, or entity, including relevant roles or affiliations, the response should be wrapped and phrased in one sentence (e.g., "Sudarshan News - Media Outlet, Narendra Modi - The Prime Minister, Hindu Community, Muslim community, Sikh Community") . Article content: ${articleText}`,
    Target: `Analyze the article from all perspectives and identify all entities being targeted by the claim, including individuals, organizations, and communities. Mention any relevant communities, individuals, and organizations specifically targeted, and format your response clearly, using separate lines for each type. The format should be: "Community: [Community Name] - [Description], Individual: [Name] - [Role], Organization: [Name] - [Description]." Ensure the response includes all relevant targets and is complete. Article content: ${articleText}.
`,

 
    Sentiment: `As a sentiment-analyzing expert in a top-tier organization, evaluate the sentiment conveyed by the claim in the article. Classify the sentiment as Positive, Negative, or Neutral, focusing on the affected communities. Your justification should highlight any emotional or social impact and it should be phrased in just one line, including potential harm caused by the false claims and also if article shows multiple sentiments it can be showed providing justification. Phrase your response as follows: (Positive, Negative, or Neutral) - Justification(one liner justification). Article content: ${articleText}`,



    Topic: `As a topic-analysing expert in a top-tier, generate a concise and informative title that encapsulates the key theme of the article. The title should reflect the context of misinformation surrounding the vandalism claims and indicate the fact-checking nature of the content. Article content: ${articleText}.`,
  
    Theme: `As a Fact-checking expert analyst in a top-tier organisation identify the primary theme(s) related to the claim from the categories (politics, communal, sports, entertainment, international, religious). , The Response should be single word like (politics, communal, sports, entertainment, international, religious), note if article has two or more themese then show it using seperated comma","(for eg. communal, politcal). Article content: ${articleText}`,
  
    Location: `Identify the specific location(s) relevant to the false claim (city, region, country), the response should be like (city, region, country) (eg, Mumbai, Maharashtra) . Article content: ${articleText}`,
  
    // // Optional additional prompts
    // ClaimType: `Classify the false claim as Misleading, Fabricated, Manipulated Media, or Other (specify). Article content: ${articleText}`,
  
    // Evidence: `Evaluate the credibility and reliability of evidence presented in the article to support or refute the claim. Article content: ${articleText}`,
  
    // PotentialImpact: `Assess the potential consequences of the false claim on public opinion, policy, or social discourse. Article content: ${articleText}`,
  };
    const results = {};

    for (const [key, prompt] of Object.entries(prompts)) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or "gpt-4" if needed
        messages: [
          {
            role: "system",
            content: "You are a top-tier analyst from a world-renowned news organization like the New York Times. Your expertise in analyzing and fact-checking news is unmatched. Ensure that all personal details are accurate and fact-checked, and do not assume or infer information not explicitly mentioned in the article. Focus on providing concise, accurate analysis in 1-2 lines.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 40, // Reduce token limit for tighter control
      });

      const responseText = response.choices[0].message.content.trim();
      results[key] = responseText.toLowerCase() === "null"
        ? null
        : responseText.replace(/\*\*/g, "").trim();
    }

    return results; // Return the structured JSON
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return null; // Handle error gracefully
  }
};





// const analyzeSentiment = async (articleText) => {
//   try {
//     const prompts = {
//       Target: `As a leading analyst from The New York Times, analyze the following article and identify who or what is being targeted by the claim or information presented. Provide the target in a few words (e.g., "NASA and Boeing," "local government"). No additional explanation needed. Article content: ${articleText}`,
//       Sentiment: `As a top-tier analyst, assess the sentiment of the following article. Determine whether the overall tone of the claim or information presented is positive, negative, or neutral. Respond with one word only ("positive," "negative," or "neutral"). Ensure accuracy based on the article's content, without additional commentary. Article content: ${articleText}`,
//       Topic: `Read the following article and, as a leading reporter, identify the main topic or central event it discusses. Provide a meaningful topic in a few words (e.g., "Boeing Starliner mission," "India-Canada relations"). Ensure clarity without extra formatting. Article content: ${articleText}`,
//       Theme: `As a skilled analyst from a major publication, analyze the following article and determine its overall theme based on the content. Provide the theme in one or two words (e.g., "politics," "international," "technology"). Ensure the response is meaningful and accurately reflects the article’s content, without additional text. Article content: ${articleText}`,
//       Location: `As a top journalist, extract the location mentioned within the article. If a specific city is mentioned, format it as "City, State, Country" (e.g., "Mumbai, Maharashtra, India"). If only a country is mentioned, provide just the country name (e.g., "India"). If no specific location is mentioned, infer the most likely country based on context. Provide a clear response without extra commentary. Article content: ${articleText}`,
//     };

//     const results = {};

//     for (const [key, prompt] of Object.entries(prompts)) {
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo", // or "gpt-4" if you want to use that
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert analyst from a leading news organization.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         max_tokens: 50, // Allow for more comprehensive responses
//       });

//       const responseText = response.choices[0].message.content.trim();
//       results[key] =
//         responseText.toLowerCase() === "null"
//           ? null
//           : responseText.replace(/\*\*/g, "").trim();
//     }

//     return results; // Return the structured JSON
//   } catch (error) {
//     console.error("Error analyzing sentiment:", error);
//     return null; // Handle error gracefully
//   }
// };

// const analyzeSentiment = async (articleText) => {
//   try {
//     const prompts = {
//       Target: `Analyze the following article and identify who or what is being targeted by the claim or information presented. Provide the target in **one or two words only** (e.g., "government," "voters," "media," "opposition"). Do not include any explanatory text, and ensure the response is based on a clear understanding of the article's content. Avoid returning "null." Article content: ${articleText}`,
//       Sentiment: `Analyze the sentiment of the following article and determine whether the overall tone of the claim or information presented is positive, negative, or neutral. Respond with one word only ("positive," "negative," or "neutral"). Ensure the response is accurate based on the article's content, and do not respond with "null." Article content: ${articleText}`,
//       Topic: `Read the following article and identify the main topic or central event it discusses, focusing on the primary character, issue, or situation. Provide a concise, meaningful topic in a few words (e.g., "Baba Siddique murder," "LS elections," "India-Canada row"). Ensure the response is clear, without repetition or extra formatting. Do not prepend the word "Topic" in your response. Article content: ${articleText}`,
//       Theme: `Analyze the following article and determine its overall theme based on its content. Provide the theme in **one word** (e.g., "politics," "international," "sports," "entertainment," "crime," "religious"). Ensure the response is meaningful, based on a clear understanding of the article’s content, and do not return "null." Avoid any asterisks or additional formatting. Article content: ${articleText}`,
//       Location: `Analyze the following article and extract the location mentioned within. If a specific city is mentioned, provide the format "City, State, Country" (e.g., "Mumbai, Maharashtra, India"). If only a country is mentioned, provide just the country name (e.g., "India"). If no specific location is mentioned, infer and suggest the most likely country based on the article's context. Ensure the response is clear and without additional explanatory text. Article content: ${articleText}`,
//     };

//     const results = {};

//     for (const [key, prompt] of Object.entries(prompts)) {
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo", // or "gpt-4" if you want to use that
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an expert in extracting structured data from text.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         max_tokens: 20,
//       });

//       const responseText = response.choices[0].message.content.trim();
//       results[key] =
//         responseText.toLowerCase() === "null"
//           ? null
//           : responseText.replace(/\*\*/g, "").trim();
//     }

//     return results; // Return the structured JSON
//   } catch (error) {
//     console.error("Error analyzing sentiment:", error);
//     return null; // Handle error gracefully
//   }
// };

const extractSentimentFromNews = async (req, res) => {
  const { url, text } = req.body;

  // Check if both URL and text are empty
  if (!url && !text) {
    return res.status(400).json({ error: "Either URL or text is required" });
  }


  try {
    let articleText;

    // If text is provided, use it directly
    if (text) {
      articleText = text;
    }
    // If URL is provided, fetch the article content
    else if (url) {
      articleText = await fetchArticleContent(url);
    }

    const sentiment = await analyzeSentiment(articleText);

    res.status(200).json({ sentiment }); // Send back the sentiment analysis
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const summarizeNews = async (req, res) => {
  const { url, text } = req.body; // Expecting URL and text in the request body

  // Check if both URL and text are empty
  if (!url && !text) {
    return res.status(400).json({ error: "Either URL or text is required" });
  }

  try {
    let articleText;

    // If text is provided, use it directly
    if (text) {
      articleText = text;
    }
    // If URL is provided, fetch the article content
    else if (url) {
      articleText = await fetchArticleContent(url);
    }

    const reliability = await checkSourceReliability(articleText);

    // Summarize the article text using the Google Generative AI
    const summary = await summarizeArticle(articleText);
    res.status(200).json({ summary, reliability }); // Send back the sentiment analysis
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  summarizeNews,
  extractSentimentFromNews
};
