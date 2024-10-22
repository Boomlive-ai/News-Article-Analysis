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
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from the .env file
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
    // console.log(articleText);

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

// const analyzeSentiment = async (articleText) => {
//   try {
//     // const prompts = {
//     //   Target: `Target: Identify the name of the primary subject or individual targeted by the claim in the article. Provide only the name of the target, without any additional details or descriptions just breif about target in two words, note the target mentioned should be correct. Article content: ${articleText}`,

//     //   Sentiment: `Analyze the overall sentiment of the article based on how the subject is portrayed. Is it positive, negative, or neutral? Respond in 1-2 lines with a brief justification. Ensure that any personal details, such as the individual's status, are not assumed and are fact-checked. Article content: ${articleText}`,

//     //   Topic: `Summarize the main topic of the article in one sentence, focusing on the key event or claim. Ensure all personal details mentioned are accurate and not assumed. Article content: ${articleText}`,

//     //   Theme: `Identify the main theme of the article in 1-2 words (e.g., "misinformation," "politics"). Focus on the central subject matter. Article content: ${articleText}`,

//     //   Location: `Provide the location relevant to the key event. Do not assume any locations or details unless explicitly mentioned. If no specific city is mentioned, provide the country or region related to the event in one sentence only. Article content: ${articleText}`,
//     // };

//     //   const prompts = {
//     //     Target: `Identify the primary subject of the claim in the article. Provide the name of the target and a brief 2-3 word description for clarity (e.g., "Narendra Modi - The Prime Minister"). If the claim targets a broader group, specify that as well. Article content: ${articleText}`,

//     //     Sentiment: `As an expert analyst from a fact-checking organization, analyze the sentiment regarding how the **false claim** or **misinformation** is portrayed. Is the sentiment towards the claim positive, negative, or neutral? Respond with one word: "Positive," "Negative," or "Neutral." Then provide a justification with specific examples or quotes from the article (1-2 sentences). Be aware of nuances like sarcasm or mixed feelings. Article content: ${articleText}`,

//     //     Topic: `Summarize the main topic of the article in one clear sentence, focusing on the key event or claim. Ensure accuracy and do not include assumed personal details. Highlight any significant context that informs the topic. Article content: ${articleText}`,

//     //     Theme: `Identify the main theme of the article in 1-2 words from the following categories: "international," "political," "crime," "entertainment," "economic," "social," "religious," "environmental," or "cultural." Multiple themes may be present; specify if applicable. Article content: ${articleText}`,

//     //     Location: `Provide the specific location relevant to the key event discussed in the article. If no specific city is mentioned, state the country or region associated with the event. Include any relevant context that clarifies the location. Article content: ${articleText}`,
//     // };
//     const prompts = {
//       Target: `Analyze the article and identify the **specific entities** directly implicated in the incident related to the claim. Provide only the **relevant and main targets** in the specified format:
//       - **Individual**: [Name].
//       - **Organization**: [Name].
//       - **Community**: [Community Name].
//       Article content: ${articleText}.`,

//       Sentiment: `Evaluate the **overall sentiment** toward the identified targets in the article. Classify it as Positive, Negative, or Neutral, providing a **justification** for your classification in a few words. If multiple sentiments are present, focus on identifying the sentiment that is most prominently expressed in the article, while briefly noting any additional sentiments. Ensure your assessment remains neutral. Format your response as:
// -[Positive, Negative, or Neutral] – [One-liner justification].
// If applicable, note any additional sentiments briefly.
// Article content: ${articleText}.`,

//       Topic: `Create a **concise title** that summarizes the claim or main topic of the article, highlighting that it has been fact-checked. The title should reflect the core **claim**. Format as:
//       "[Claim or Event] Misrepresented in [Context/Event]."
//       Article content: ${articleText}.`,

//       Theme: `Identify and categorize the primary theme(s) of the article from the following categories: politics, communal, sports, entertainment, international, religious. If multiple themes are present, list them separated by commas. Format your response as:
//       -[theme1, theme2].
//       Article content: ${articleText}.`,

//       Location: `Identify the **precise location** of the incident related to the claim (e.g., city, region, country). If no specific location is mentioned, state "No specific location mentioned." Format your response as:
//       - [City, Region, Country].
//       Article content: ${articleText}.`,
//     };

//     const results = {};

//     for (const [key, prompt] of Object.entries(prompts)) {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4", // or "gpt-4" if needed gpt-3.5-turbo
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a top-tier analyst from a world-renowned news organization like the New York Times. Your expertise in analyzing and fact-checking news is unmatched. Ensure that all personal details are accurate and fact-checked, and do not assume or infer information not explicitly mentioned in the article. Focus on providing concise, accurate analysis in 1-2 lines.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         max_tokens: 100, // Reduce token limit for tighter control
//         temperature: 0.3,
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

const analyzeSentiment = async (articleText) => {
  try {
    const combinedPrompt = `Filter the original content from boom analysis it shouldnt consider any analysis performed by noom and analyze the following article from a user’s perspective, focusing exclusively on the claims made by the original sources cited within the article. Exclude any fact-check sections and do not consider the BOOM article itself as a source or target. Pay particular attention to the claims made by other organizations or posts on platforms such as Instagram, Twitter, Facebook, and YouTube mentioned within the claim section. Provide results in a structured JSON format.
Article content: ${articleText}.

1. **Identify Specific Targets**:
   - Determine individuals, organizations, or communities that users might perceive as **negatively implicated** in the claims made by the original sources.
   - **Ignore any claims made by BOOM or claims that merely quote or reference the original claim** in the article. Only consider the original sources.
   - **Do not include organizations, individuals, or communities that are sources of claims as targets**.



2. **User Sentiment Analysis**:
   - Classify the overall sentiment users might feel towards the identified targets as **Positive**, **Negative**, or **Neutral**.
   - Justification is not necessary; focus on sentiment alone.

3. **Concise Title**:
   - Create a clear title summarizing the user’s perspective on the claims from the original sources.

4. **Identify Themes**:
   - List themes relevant to user interests or concerns, such as politics, communal issues, or public safety.

5. **Location Detail**:
   - Specify the exact location mentioned in the article or state "No specific location mentioned."

6. **Analyze Social Media Posts**:
   - If relevant, extract and analyze any claims made in social media posts linked within the article's claim section.

Return the results in this JSON format and note if source of claim has same entity as targets it shouldn't add them as targets:
{
  "target": {
    "individuals": ["Name1", "Name n", or null], // if considered a negative entity from the user’s perspective and **target is not source of article claim** or else null
    "organizations": [null if value of sourceofclaim is similar],  // **it shouldn't consider the original source as target** and only if considered a negative entity from the user’s perspective and **target is not source of article claim** or else null
    "communities": ["Community1", "Communityn" or null] // if considered a negative entity from the user’s perspective and **target is not source of article claim** or else null
  },
  
  "sourceofclaim": "**mention organization who provided the claim**",
  
  "sentiment": {
    "classification": "Positive/Negative/Neutral",
    "justification": "One Line Justification for the sentiment"
  },
  
  "topic": "Your concise title.",
  "themes": ["Theme1", "Theme2"],
  "location": "City, Region, Country" 
}

- Note it should set organizations in target as null that is "organizations": [null] if value of sourceofclaim is similar For Eg: "organizations": ["Sudarshan News", "Kreately Media"] and "sourceofclaim": "Multiple sources including Sudarshan News, Kreately Media, and NDTV Rajasthan"

- Note "sourceofclaim" key shouldnt add boom as value that is "sourceofclaim": "Boom" , it should check fro where boom has taken reference like social media account, post and any news media company who are providing claims and that should be added as "sourceofclaim" value.

- Note Topic should be based on the complete depiction of what orignal article source is comprehending

- Note all the analysis should be done ignoring Fact-check section analysis done in article , the nalaysis solely should be based on original claims of referenced content by boom.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-3.5-turbo or gpt-4
      messages: [
        {
          role: "system",
          content:
            "You are an analyst focusing on user perspectives. Focus mainly on the claims made by original sources cited in the article, excluding BOOM's own claims and fact-checking conclusions. Provide concise results in JSON format.",
        },
        { role: "user", content: combinedPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.1,
    });

    const responseText = response.choices[0].message.content.trim();
    console.log(responseText);

    const cleanedText = responseText.replace(/```json\n|\n```/g, "");
    results = JSON.parse(cleanedText);

    return results;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return null;
  }
};

// Function to parse the combined response
const parseResponse = (responseText) => {
  // Implement logic to parse the response into your desired structure
  // Example logic:
  const results = {};

  // Split and parse the response as per your output requirements
  // For example, using regex or string methods to extract relevant parts

  return results;
};

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
    console.log(
      "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4"
    );

    console.log(articleText);
    console.log(
      "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4"
    );

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
  extractSentimentFromNews,
};
