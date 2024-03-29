/* eslint-disable max-len */
export type AccordionData = {
  id: string;
  title: string;
  body: string;
};

export const ACCORDION_DATA: AccordionData[] = [
  {
    id: 'panel1',
    title: 'What is ChatGPT?',
    body: 'ChatGPT is a large language model developed by OpenAI. It is a type of artificial intelligence designed to understand and generate human-like language. Specifically, it uses a neural network architecture called the GPT (Generative Pretrained Transformer) to analyze and generate text in response to natural language inputs from users. ChatGPT has been trained on vast amounts of text data from the internet, books, and other sources, allowing it to understand a wide range of topics and respond in a coherent and informative way.',
  },
  {
    id: 'panel2',
    title: 'What is Leet ChatGPT?',
    body: 'A browser extension that improves your leetcode/hacker-rank experience by providing instant feedback, guidance and help powered by ChatGPT. Never get stuck on a question.',
  },
  {
    id: 'panel3',
    title: 'Is LeetChatGPT free to use?',
    body: 'Yes, this extension if free to use.',
  },
  {
    id: 'panel4',
    title: 'What are question platforms supported?',
    body: 'Currently support: Leetcode, Hacker-rank',
  },
  {
    id: 'panel5',
    title: 'Do I need a ChatGPT/OpenAI account?',
    body: 'Yes, ChatGPT/OpenAI account is needed in order to use this extension. You can get an account today for free at chat.openai.com.',
  },
];

export const FEATURES = [
  '🧩 Supports both leetcode and hacker-rank questions',
  '⏳ Timer Mode: Get feedback and help for your current solution when a timer runs out',
  '🖐️ Manual Mode: Get feedback for your current solution towards a brute-force or optimal solution on demand',
  '💬 Ask follow-up questions (chat with ChatGPT)',
  '🏆 Streak system for motivation',
  '🎯 Customizable reminders for constistent problem solving goals',
  '📜 Conversation history kept locally',
  '👥 Export and share conversations as png, pdf or markdown',
  '🎨 Markdown rendering and Code highlights',
  '🔓 Supports both ChatGPT and ChatGPT Plus (models: gpt-3.5-turbo, gpt-4, gpt-4-32k)',
];
