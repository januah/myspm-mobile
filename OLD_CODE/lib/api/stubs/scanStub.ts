import type { ScanResponse, GradingResponse } from "../types";

export const SCAN_RESPONSE_STUB: ScanResponse = {
  question:
    "What is the probability of rolling a 6 on a standard six-sided die?",
  solution: [
    "A standard die has 6 equally likely outcomes.",
    "Only one outcome is a 6.",
    "Therefore, the probability is 1/6.",
  ],
  answer: "1/6",
  similarQuestions: [
    "Probability of getting heads on a coin flip",
    "Probability of drawing an ace from a deck",
  ],
};

export const UPLOAD_RESPONSE_STUB: GradingResponse = {
  score: 18,
  total: 20,
  feedback:
    "Great work! Your solution shows a good understanding of the concept. Pay attention to the explanation steps.",
  missingPoints: [
    "Could have mentioned the uniform distribution aspect",
  ],
};
