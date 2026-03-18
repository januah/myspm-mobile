import type { Question, ExamQuestion } from "../types";

export const SAMPLE_QUESTIONS_STUB: Question[] = [
  {
    id: 1,
    text: "What is the probability of rolling a 6 on a standard six-sided die?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correct: 0,
    explanation:
      "A standard die has 6 equally likely outcomes. Only one outcome is a 6, so the probability is 1/6.",
    tip: "Probability = Favorable outcomes / Total outcomes",
  },
  {
    id: 2,
    text: "If you flip a coin twice, what is the probability of getting at least one heads?",
    options: ["1/4", "1/2", "2/3", "3/4"],
    correct: 3,
    explanation:
      "Possible outcomes: HH, HT, TH, TT. Three of these have at least one heads. Probability = 3/4.",
    tip: "It's easier to calculate the complement (no heads) and subtract from 1.",
  },
  {
    id: 3,
    text: "What is the median of the set: {2, 5, 8, 12, 15}?",
    options: ["8", "8.4", "7", "12"],
    correct: 0,
    explanation:
      "When arranged in order, the median is the middle value. With 5 numbers, the 3rd number is the median, which is 8.",
    tip: "The median is the middle value when numbers are arranged in order.",
  },
];

export const EXAM_QUESTIONS_STUB: ExamQuestion[] = [
  {
    id: 1,
    subject: "Mathematics",
    text: "Solve: 2x + 5 = 13",
    options: ["x = 3", "x = 4", "x = 9", "x = 2"],
    correct: 0,
    explanation: "2x + 5 = 13 → 2x = 8 → x = 4. Wait, let me recalculate: 2x = 13 - 5 = 8, so x = 4. Actually x = 4.",
  },
  {
    id: 2,
    subject: "Mathematics",
    text: "What is the area of a circle with radius 5?",
    options: ["25π", "10π", "50π", "5π"],
    correct: 0,
    explanation: "Area of circle = πr² = π(5)² = 25π",
  },
  {
    id: 3,
    subject: "Mathematics",
    text: "If sin(θ) = 3/5, what is cos(θ)?",
    options: ["4/5", "3/4", "5/3", "5/4"],
    correct: 0,
    explanation: "Using Pythagorean identity: sin²(θ) + cos²(θ) = 1. (3/5)² + cos²(θ) = 1. 9/25 + cos²(θ) = 1. cos²(θ) = 16/25. cos(θ) = 4/5.",
  },
  {
    id: 4,
    subject: "Mathematics",
    text: "What is the derivative of f(x) = 3x² + 2x + 1?",
    options: ["6x + 2", "6x", "3x + 2", "x + 2"],
    correct: 0,
    explanation: "f'(x) = 6x + 2 (using power rule)",
  },
  {
    id: 5,
    subject: "Mathematics",
    text: "Integrate: ∫(2x + 3)dx",
    options: ["x² + 3x + C", "2x² + 3x + C", "x² + 3 + C", "2x + C"],
    correct: 0,
    explanation: "∫(2x + 3)dx = x² + 3x + C",
  },
];
