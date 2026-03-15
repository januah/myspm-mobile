import type { Teacher, TeacherPost } from "../types";

export const TEACHERS_STUB: Teacher[] = [
  {
    id: "teacher-1",
    name: "Mr. Johnson",
    avatar: "MJ",
    postCount: 12,
  },
  {
    id: "teacher-2",
    name: "Ms. Smith",
    avatar: "MS",
    postCount: 8,
  },
  {
    id: "teacher-3",
    name: "Dr. Williams",
    avatar: "DW",
    postCount: 15,
  },
  {
    id: "teacher-4",
    name: "Prof. Brown",
    avatar: "PB",
    postCount: 10,
  },
];

export const TEACHER_POSTS_STUB: TeacherPost[] = [
  {
    teacher: "Mr. Johnson",
    title: "Tips for solving probability problems",
    time: "2 hours ago",
    content: "Today we discussed conditional probability...",
    postCount: 12,
  },
  {
    teacher: "Ms. Smith",
    title: "Assignment 5: Grammar exercises",
    time: "5 hours ago",
    content: "Please complete pages 34-36 in your workbook...",
    postCount: 8,
  },
];
