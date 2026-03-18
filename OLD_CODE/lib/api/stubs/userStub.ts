import type { Achievement, SubjectProgress, UserProfile } from "../types";

export const USER_PROFILE_STUB: UserProfile = {
  id: "user-001",
  name: "You",
  school: "Central High School",
  formLevel: "Form 4",
  totalXP: 2456,
  dayStreak: 7,
  questionsAnswered: 156,
};

export const ACHIEVEMENTS_STUB: Achievement[] = [
  {
    id: "achievement-1",
    title: "First Step",
    icon: "🎯",
    color: "#FF6B6B",
    earned: true,
  },
  {
    id: "achievement-2",
    title: "Week Warrior",
    icon: "🔥",
    color: "#FFD93D",
    earned: true,
  },
  {
    id: "achievement-3",
    title: "Perfect Score",
    icon: "⭐",
    color: "#6BCB77",
    earned: true,
  },
  {
    id: "achievement-4",
    title: "Century Club",
    icon: "💯",
    color: "#4D96FF",
    earned: false,
  },
  {
    id: "achievement-5",
    title: "Master of All",
    icon: "👑",
    color: "#FFB6C1",
    earned: false,
  },
  {
    id: "achievement-6",
    title: "Speed Demon",
    icon: "⚡",
    color: "#FF8C42",
    earned: false,
  },
];

export const SUBJECT_PROGRESS_STUB: SubjectProgress[] = [
  {
    name: "Mathematics",
    score: 78,
    color: "#FF6B6B",
  },
  {
    name: "English",
    score: 85,
    color: "#4ECDC4",
  },
  {
    name: "Science",
    score: 72,
    color: "#FFE66D",
  },
  {
    name: "History",
    score: 88,
    color: "#95E1D3",
  },
  {
    name: "Geography",
    score: 75,
    color: "#F38181",
  },
];
