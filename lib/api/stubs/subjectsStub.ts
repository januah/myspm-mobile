import type { Subject } from "../types";

export const SUBJECTS_STUB: Subject[] = [
  {
    id: "math",
    label: "Mathematics",
    icon: "calculator",
    color: "#FF6B6B",
  },
  {
    id: "english",
    label: "English",
    icon: "book",
    color: "#4ECDC4",
  },
  {
    id: "science",
    label: "Science",
    icon: "flask",
    color: "#FFE66D",
  },
  {
    id: "history",
    label: "History",
    icon: "scroll",
    color: "#95E1D3",
  },
  {
    id: "geography",
    label: "Geography",
    icon: "globe",
    color: "#F38181",
  },
  {
    id: "languages",
    label: "Languages",
    icon: "speech",
    color: "#AA96DA",
  },
  {
    id: "arts",
    label: "Arts",
    icon: "palette",
    color: "#FCBAD3",
  },
  {
    id: "pe",
    label: "P.E.",
    icon: "dumbbell",
    color: "#A8D8EA",
  },
];

export const TOPICS_STUB: Record<string, string[]> = {
  math: ["Probability", "Algebra", "Statistics", "Geometry", "Trigonometry"],
  english: ["Grammar", "Literature", "Composition", "Poetry", "Shakespeare"],
  science: ["Physics", "Chemistry", "Biology", "Anatomy", "Botany"],
  history: ["Medieval", "Renaissance", "Industrial", "Modern", "Ancient"],
  geography: ["Physical", "Human", "Economic", "Cartography", "Tourism"],
  languages: ["Vocabulary", "Grammar", "Conversation", "Writing", "Listening"],
  arts: ["Painting", "Sculpture", "Design", "History", "Techniques"],
  pe: ["Athletics", "Team Sports", "Fitness", "Gymnastics", "Health"],
};
