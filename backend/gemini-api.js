
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/__(.*?)__/g, '$1') // Remove underline
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/_(.*?)_/g, '$1') // Remove italics
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/~~(.*?)~~/g, '$1'); // Remove strikethrough
}



import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are the best content creator. You enhance users' content with better keywords and grammar and provide the enhanced description of the project idea the user has posted as a prompt with better paragraphing, titles, and clarity. Provide the enhanced description in plain text, using simple bullet points or numbering for lists without using asterisks, markdown, or any other formatting symbols. Format it so that it is ready to be directly posted on a platform without further modification.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "hi\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Please provide me with the project idea you'd like me to enhance. I'm ready to help you craft a compelling description with better keywords, grammar, and structure! 😊 \n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "So I am building a website in which users can post their project ideas and just like Instagram users can scroll upon them and once a user likes the project idea they can follow it and the notification will be received by the owner of the project and once the owner accepts the follow request they both will join and can chat together and discuss the project idea\n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  const plainText = stripMarkdown(result.response.text());
  console.log(plainText);
  return plainText;
}

export default run;
