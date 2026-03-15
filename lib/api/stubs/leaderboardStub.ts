import type { LeaderboardEntry, SchoolRanking } from "../types";

export const SCHOOL_LEADERS_STUB: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Johnson",
    xp: 4250,
    streak: 23,
    avatar: "SJ",
  },
  {
    rank: 2,
    name: "Alex Chen",
    xp: 3890,
    streak: 18,
    avatar: "AC",
  },
  {
    rank: 3,
    name: "Emma Williams",
    xp: 3650,
    streak: 15,
    avatar: "EW",
  },
  {
    rank: 4,
    name: "James Brown",
    xp: 3420,
    streak: 12,
    avatar: "JB",
  },
  {
    rank: 5,
    name: "Olivia Davis",
    xp: 3210,
    streak: 10,
    avatar: "OD",
  },
  {
    rank: 6,
    name: "Liam Martinez",
    xp: 2980,
    streak: 8,
    avatar: "LM",
  },
  {
    rank: 7,
    name: "Sophia Garcia",
    xp: 2750,
    streak: 6,
    avatar: "SG",
  },
  {
    rank: 8,
    name: "Noah Taylor",
    xp: 2510,
    streak: 4,
    avatar: "NT",
  },
];

export const SCHOOL_RANKING_STUB: SchoolRanking[] = [
  {
    rank: 1,
    name: "Central High School",
    averageXP: 2890,
    studentCount: 450,
    color: "#FF6B6B",
  },
  {
    rank: 2,
    name: "Riverside Academy",
    averageXP: 2650,
    studentCount: 380,
    color: "#4ECDC4",
  },
  {
    rank: 3,
    name: "Westfield College",
    averageXP: 2420,
    studentCount: 520,
    color: "#FFE66D",
  },
];
