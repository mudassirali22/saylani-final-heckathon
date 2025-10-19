// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const getGeminiModel = () => {
//   return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// };

// module.exports = { getGeminiModel };


//////////////
const OpenAI = require('openai');

// Initialize OpenAI client using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// For compatibility with previous Gemini structure
const getGeminiModel = () => {
  // Return the OpenAI client instance to keep naming consistent
  return openai;
};

module.exports = { getGeminiModel };
