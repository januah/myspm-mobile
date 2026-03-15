// Domain Models
export interface Subject {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation?: string;
  tip?: string;
}

export interface PracticeSessionRequest {
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}

export interface PracticeSessionResponse {
  sessionId: string;
  questions: Question[];
  metadata: {
    subject: string;
    topic: string;
    difficulty: string;
    totalQuestions: number;
  };
}

export interface ExamQuestion extends Question {
  subject?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  avatar: string;
}

export interface SchoolRanking {
  rank: number;
  name: string;
  averageXP: number;
  studentCount: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  school: string;
  formLevel: string;
  totalXP: number;
  dayStreak: number;
  questionsAnswered: number;
}

export interface ScanResponse {
  question: string;
  solution: string[];
  answer: string;
  similarQuestions?: string[];
}

export interface GradingResponse {
  score: number;
  total: number;
  feedback: string;
  missingPoints: string[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface SubjectProgress {
  name: string;
  score: number;
  color: string;
}

export interface TeacherPost {
  teacher: string;
  title: string;
  time: string;
  content?: string;
  postCount?: number;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  postCount?: number;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
}

export interface SessionMetadata {
  subject: string;
  topic: string;
  difficulty: string;
  totalQuestions: number;
}
