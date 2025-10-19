const https = require('https');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Download file from URL as buffer
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
  });
};

// Convert buffer to base64 data part (kept same for compatibility)
const fileToGenerativePart = (buffer, mimeType) => {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    }
  };
};

// Analyze medical report using OpenAI (instead of Gemini)
exports.analyzeReport = async (fileUrl, reportType) => {
  try {
    let mimeType = 'image/jpeg';
    if (fileUrl.toLowerCase().endsWith('.pdf')) {
      mimeType = 'application/pdf';
    } else if (fileUrl.toLowerCase().endsWith('.png')) {
      mimeType = 'image/png';
    }

    // Download the file
    const fileBuffer = await downloadFile(fileUrl);
    const imagePart = fileToGenerativePart(fileBuffer, mimeType);

    // Prompt (same as original)
    const prompt = `You are a helpful medical assistant. Analyze this ${reportType} medical report and provide:

1. A summary in English (2-3 sentences)
2. A summary in Roman Urdu (2-3 sentences) - use simple Roman Urdu that everyone can understand
3. List any abnormal or concerning values found
4. Suggest 3-5 important questions the patient should ask their doctor
5. List 3-5 foods to avoid based on this report
6. List 3-5 foods that are beneficial to eat
7. Suggest 2-3 simple home remedies (if applicable)

Format your response EXACTLY as JSON:
{
  "english": "summary here",
  "urdu": "Roman Urdu mein summary",
  "abnormalValues": ["value1", "value2"],
  "questionsForDoctor": ["question1", "question2"],
  "foodsToAvoid": ["food1", "food2"],
  "foodsToEat": ["food1", "food2"],
  "homeRemedies": ["remedy1", "remedy2"]
}

IMPORTANT: 
- Keep summaries simple and easy to understand
- For Roman Urdu, use simple conversational style
- Always mention if values are within normal range or not
- Be encouraging but realistic
- Return ONLY valid JSON, no extra text`;

    // Send request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast GPT-4 model
      messages: [
        { role: "system", content: "You are a medical report analysis assistant." },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0].message.content;

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    // Add disclaimer
    analysisData.disclaimer =
      'This AI analysis is for informational purposes only. Always consult your doctor before making any medical decisions. / Yeh AI analysis sirf samajhne ke liye hai, ilaaj ke liye nahi. Apne doctor se zaroor mashwara karen.';

    return analysisData;
  } catch (error) {
    console.error('OpenAI analysis error:', error);

    // Fallback response (unchanged)
    return {
      english: 'Unable to analyze report automatically. Please consult your doctor for detailed interpretation.',
      urdu: 'Report ka analysis nahi ho saka. Apne doctor se milkar is report ko samjhen.',
      abnormalValues: [],
      questionsForDoctor: [
        'What do these results mean for my health?',
        'Do I need any follow-up tests?',
        'Are there any lifestyle changes I should make?'
      ],
      foodsToAvoid: [],
      foodsToEat: [],
      homeRemedies: [],
      disclaimer:
        'This AI analysis is for informational purposes only. Always consult your doctor before making any medical decisions. / Yeh AI analysis sirf samajhne ke liye hai, ilaaj ke liye nahi. Apne doctor se zaroor mashwara karen.'
    };
  }
};
