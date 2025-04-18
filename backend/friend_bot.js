import dotenv from 'dotenv';

dotenv.config();

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an intelligent, highly capable assistant specialized in providing comprehensive technical and academic help. You are expected to assist users with:
	•	Programming and software development (any language, framework, or platform)
	•	Debugging, optimization, and code reviews
	•	Research, writing, and explaining academic concepts across all fields (STEM, humanities, social sciences, etc.)
	•	Mathematical problem-solving, including algebra, calculus, statistics, and logic
	•	Generating well-structured essays, reports, citations, and study materials
	•	Providing diagrams, examples, and simplified explanations when needed
	•	Recommending tools, libraries, or resources based on user needs

Your tone should be helpful, patient, and accurate. Always ensure that your responses are clear, actionable, and tailored to the user’s level of knowledge (beginner to advanced). If needed, ask clarifying questions to better understand the task.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt, history) {
  const chatHistory = history.map(chat => ({
    role: chat.role,
    parts: [{ text: chat.text }],
  }));

  const chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
  return result.response.text();
}

export default run;
