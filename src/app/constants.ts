import { IUserStats } from '../interfaces';

export const CHATCLIENTS = {
  chatgpt: {
    name: 'ChatGPT',
  },
};

export const CHATGPT_HOME_URL = 'https://chat.openai.com/chat';

export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k'];

export const TIME_OPTIONS = ['10 min', '15 min', '20 min', '25 min', '30 min', '35 min'];

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'];

export const USER_STATS: IUserStats[] = [
  {
    id: 1,
    title: 'Sliding Window; Two Pointers',
    startDate: new Date(2023, 2, 29, 12, 0),
    endDate: new Date(2023, 2, 29, 15, 0),
    description:
      'hello world helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld',
    resourcesId: 1,
  },
  {
    id: 2,
    title: 'Two Pointers; Fast & Slow Pointers',
    startDate: new Date(2023, 2, 30, 12, 0),
    endDate: new Date(2023, 2, 30, 15, 0),
    description: 'hello world',
    resourcesId: 1,
  },
  {
    id: 3,
    title: 'Merge Intervals',
    startDate: new Date(2023, 2, 31, 12, 0),
    endDate: new Date(2023, 2, 31, 15, 0),
    description: 'helloworld',
    resourcesId: 1,
  },
  {
    id: 4,
    title: 'Breadth First Search',
    startDate: new Date(2023, 3, 2, 12, 0),
    endDate: new Date(2023, 3, 2, 15, 0),
    description: 'hello world',
    resourcesId: 1,
  },
  {
    id: 5,
    title: 'Depth First Search',
    startDate: new Date(2023, 3, 5, 12, 0),
    endDate: new Date(2023, 3, 5, 15, 0),
    description: 'hello world',
    resourcesId: 1,
  },
  {
    id: 6,
    title: 'Subsets; Two Heaps',
    startDate: new Date(2023, 3, 9, 12, 0),
    endDate: new Date(2023, 3, 9, 15, 0),
    description: 'hello world',
    resourcesId: 1,
  },
  {
    id: 7,
    title: 'Topological Sort; 0/1 Knapsack',
    startDate: new Date(2023, 3, 10, 12, 0),
    endDate: new Date(2023, 3, 10, 15, 0),
    description: 'hello world',
    resourcesId: 1,
  },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// export const STATS_TOPICS = [
//   {
//     topic: ,
//     id: ,
//     color
//   }
// ]

export const REMINDER_MESSAGES = [
  'The journey of a thousand miles begins with a single step, but the first step is always the hardest.',
  'Every time you face a challenge, you are one step closer to achieving your goals.',
  'Believe in your own abilities, trust your instincts, and never give up on yourself.',
  'Success is not about being perfect, it is about persevering through imperfections.',
  'Every time you overcome a challenge, you prove to yourself that you are capable of achieving anything.',
  'The biggest obstacle to success is often the fear of failure. Embrace failure as a necessary step towards success.',
  'The only person you are competing with is yourself. Strive to be better than you were yesterday.',
  'Do not be afraid to ask for help when you need it. Everyone needs a little support sometimes.',
  'Great things never come from comfort zones. Push yourself beyond your limits and see what you are truly capable of.',
  'The greatest rewards often come after the greatest challenges.',
  'Believe in yourself and the power of your dreams. You have everything you need to succeed within you.',
  'Success is not about being the best, it is about consistently working towards your goals.',
  'Everyday, you are building the strength and resilience needed to tackle even greater challenges.',
  'Success is not about achieving perfection, it is about consistently putting in the effort to improve.',
  'The greatest achievement is not in never failing, but in rising every time we fall.',
  'Your greatest strength is not in what you know, but in your willingness to learn and adapt.',
  'Everyday, you are growing and evolving into a stronger version of yourself.',
  'Success is not a destination, it is a continuous journey of growth and self-improvement.',
  'Every time you face a challenge, view it as an opportunity to learn and grow.',
  'The only true failure is giving up on your dreams. Keep pushing forward, no matter what.',
  'Success is not about being lucky, it is about consistently putting in the effort to create your own luck.',
  'The greatest obstacle to success is often the fear of failure. Embrace failure as a necessary step towards success.',
  'Believe in yourself and the power of your dreams. You have everything you need to succeed within you.',
  'Everyday, remember that you are building the strength and resilience needed to achieve your goals.',
  'Success is not about being perfect, it is about consistently putting in the effort to improve.',
  'Everyday, you are proving to yourself that you are capable of achieving anything.',
  'The only way to achieve greatness is to have the courage to take risks and embrace failure.',
  'Believe in yourself and your own abilities. You have the power to achieve anything you set your mind to.',
  'Every time you face a challenge, view it as an opportunity to learn and grow.',
  'Success is not about being the best, it is about consistently putting in the effort to improve and grow.',
];

export const TOPICS = [
  'Sliding Window',
  'Islands(Matrix Traversal)',
  'Two Pointers',
  'Fast & Slow Pointers',
  'Merge Intervals',
  'Cyclic Sort',
  'In-Place Reversal Linked List',
  'Breadth First Search',
  'Depth First Search',
  'Two Heaps',
  'Subsets',
  'Modified Binary Search',
  'Bitwise XOR',
  'Top K Elements',
  'K-way Merge',
  'Topological Sort',
  '0/1 Knapsack',
  'Fibonacci Numbers',
  'Recursion/Backtracking',
  'Palindromic Subsequence',
  'Longest Common Substring',
];
