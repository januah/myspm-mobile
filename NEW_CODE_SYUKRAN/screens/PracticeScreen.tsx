import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, Play } from "lucide-react-native";

import { colors } from "../constants/colors";

const MOCK_SUBJECTS = [
  { id: "math", label: "Mathematics", color: colors.primary },
  { id: "bm", label: "Bahasa Melayu", color: colors.success },
  { id: "en", label: "English", color: colors.warning },
  { id: "science", label: "Science", color: colors.secondary },
  { id: "sejarah", label: "Sejarah", color: colors.error },
];

const MOCK_TOPICS: Record<string, string[]> = {
  math: ["Algebra", "Calculus", "Probability", "Statistics"],
  bm: ["Karangan", "Komsas", "Tatabahasa"],
  en: ["Essay", "Comprehension", "Grammar"],
  science: ["Physics", "Chemistry", "Biology"],
  sejarah: ["Kemerdekaan", "Perang Dunia", "Tamadun"],
};

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QUESTION_COUNTS = [5, 10, 15, 20] as const;

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === "web" ? 67 : 0;
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof DIFFICULTIES)[number]>("Medium");
  const [selectedCount, setSelectedCount] = useState<(typeof QUESTION_COUNTS)[number]>(10);

  const currentTopics = selectedSubject ? MOCK_TOPICS[selectedSubject] ?? [] : [];
  const canStart = !!selectedSubject && !!selectedTopic;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>Choose your subject and start learning</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject</Text>
        <View style={styles.subjectGrid}>
          {MOCK_SUBJECTS.map((subject) => {
            const isSelected = selectedSubject === subject.id;
            return (
              <Pressable
                key={subject.id}
                style={[
                  styles.subjectCard,
                  isSelected && { borderColor: subject.color, backgroundColor: subject.color + "20" },
                ]}
                onPress={() => {
                  setSelectedSubject(subject.id);
                  setSelectedTopic(null);
                }}
              >
                <View style={[styles.subjectIcon, { backgroundColor: subject.color + "25" }]}>
                  <BookOpen size={20} color={subject.color} />
                </View>
                <Text style={[styles.subjectLabel, isSelected && { color: subject.color, fontWeight: "600" }]}>
                  {subject.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {selectedSubject && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic</Text>
          <View style={styles.topicList}>
            {currentTopics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <Pressable
                  key={topic}
                  style={[styles.topicChip, isSelected && styles.topicChipSelected]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Text style={[styles.topicText, isSelected && styles.topicTextSelected]}>{topic}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty</Text>
        <View style={styles.optionRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = selectedDifficulty === d;
            const diffColor =
              d === "Easy" ? colors.success : d === "Medium" ? colors.warning : colors.error;
            return (
              <Pressable
                key={d}
                style={[
                  styles.optionChip,
                  isSelected && { borderColor: diffColor, backgroundColor: diffColor + "20" },
                ]}
                onPress={() => setSelectedDifficulty(d)}
              >
                <Text style={[styles.optionText, isSelected && { color: diffColor, fontWeight: "600" }]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Questions</Text>
        <View style={styles.optionRow}>
          {QUESTION_COUNTS.map((c) => {
            const isSelected = selectedCount === c;
            return (
              <Pressable
                key={c}
                style={[styles.countChip, isSelected && styles.countChipSelected]}
                onPress={() => setSelectedCount(c)}
              >
                <Text style={[styles.countText, isSelected && styles.countTextSelected]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.startButton, !canStart && styles.startButtonDisabled]}
        disabled={!canStart}
      >
        <Play size={20} color="#fff" />
        <Text style={styles.startText}>Start Practice</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 12 },
  subjectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  subjectCard: {
    width: "31%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  subjectIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  subjectLabel: { fontSize: 11, fontWeight: "500", color: colors.text, textAlign: "center" },
  topicList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicChipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  topicText: { fontSize: 13, fontWeight: "500", color: colors.textSecondary },
  topicTextSelected: { color: colors.primary, fontWeight: "600" },
  optionRow: { flexDirection: "row", gap: 10 },
  optionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  optionText: { fontSize: 14, fontWeight: "500", color: colors.textSecondary },
  countChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  countChipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  countText: { fontSize: 16, fontWeight: "600", color: colors.textSecondary },
  countTextSelected: { color: colors.primary },
  startButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startButtonDisabled: { opacity: 0.4 },
  startText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
