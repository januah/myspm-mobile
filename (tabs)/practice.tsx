import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: 'calculator' as const, color: Colors.subjectMath },
  { id: 'addmath', label: 'Add Maths', icon: 'function-variant' as const, color: Colors.subjectAddMath },
  { id: 'science', label: 'Science', icon: 'flask' as const, color: Colors.subjectScience },
  { id: 'bio', label: 'Biology', icon: 'leaf' as const, color: Colors.subjectBio },
  { id: 'chem', label: 'Chemistry', icon: 'atom' as const, color: Colors.subjectChem },
  { id: 'physics', label: 'Physics', icon: 'lightning-bolt' as const, color: Colors.subjectPhysics },
  { id: 'sejarah', label: 'Sejarah', icon: 'book-open-variant' as const, color: Colors.subjectSejarah },
  { id: 'bm', label: 'Bahasa Melayu', icon: 'translate' as const, color: Colors.subjectBM },
  { id: 'english', label: 'English', icon: 'alphabetical' as const, color: Colors.subjectEnglish },
];

const TOPICS: Record<string, string[]> = {
  math: ['Probability', 'Algebra', 'Statistics', 'Geometry', 'Trigonometry'],
  addmath: ['Integration', 'Differentiation', 'Progressions', 'Functions'],
  science: ['Forces & Motion', 'Light & Optics', 'Electricity', 'Heat'],
  bio: ['Cell Biology', 'Ecology', 'Genetics', 'Nutrition'],
  chem: ['Chemical Bonding', 'Acids & Bases', 'Electrochemistry', 'Carbon Compounds'],
  physics: ["Newton's Laws", 'Waves', 'Nuclear Physics', 'Electromagnetism'],
  sejarah: ['Kemerdekaan', 'Tamadun Awal', 'Nasionalisme', 'Perlembagaan'],
  bm: ['Tatabahasa', 'Karangan', 'Komsas', 'Rumusan'],
  english: ['Grammar', 'Comprehension', 'Essay Writing', 'Literature'],
};

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
const QUESTION_COUNTS = [5, 10, 15, 20] as const;

export default function PracticeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<typeof DIFFICULTIES[number]>('Medium');
  const [selectedCount, setSelectedCount] = useState<typeof QUESTION_COUNTS[number]>(10);

  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const currentTopics = selectedSubject ? TOPICS[selectedSubject] || [] : [];
  const canStart = selectedSubject && selectedTopic;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('navigation.practice')}</Text>
        <Text style={styles.subtitle}>{t('practice.subtitle')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('practice.subject')}</Text>
        <View style={styles.subjectGrid}>
          {SUBJECTS.map((subject) => {
            const isSelected = selectedSubject === subject.id;
            return (
              <Pressable
                key={subject.id}
                style={[
                  styles.subjectCard,
                  isSelected && { borderColor: subject.color, backgroundColor: subject.color + '10' },
                ]}
                onPress={() => {
                  setSelectedSubject(subject.id);
                  setSelectedTopic(null);
                }}
              >
                <View style={[styles.subjectIcon, { backgroundColor: subject.color + '15' }]}>
                  <MaterialCommunityIcons name={subject.icon} size={20} color={subject.color} />
                </View>
                <Text style={[styles.subjectLabel, isSelected && { color: subject.color, fontFamily: 'Inter_600SemiBold' }]}>
                  {subject.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {selectedSubject && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('practice.topic')}</Text>
          <View style={styles.topicList}>
            {currentTopics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <Pressable
                  key={topic}
                  style={[styles.topicChip, isSelected && styles.topicChipSelected]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Text style={[styles.topicText, isSelected && styles.topicTextSelected]}>
                    {topic}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('practice.difficulty')}</Text>
        <View style={styles.optionRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = selectedDifficulty === d;
            const diffColor = d === 'Easy' ? Colors.success : d === 'Medium' ? Colors.warning : Colors.error;
            return (
              <Pressable
                key={d}
                style={[styles.optionChip, isSelected && { borderColor: diffColor, backgroundColor: diffColor + '10' }]}
                onPress={() => setSelectedDifficulty(d)}
              >
                <Text style={[styles.optionText, isSelected && { color: diffColor, fontFamily: 'Inter_600SemiBold' }]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('practice.numQuestions')}</Text>
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
        onPress={() => {
          router.push({
            pathname: '/practice-session',
            params: {
              subject: selectedSubject!,
              topic: selectedTopic!,
              difficulty: selectedDifficulty,
              count: String(selectedCount),
            },
          });
        }}
      >
        <Ionicons name="play" size={20} color="#fff" />
        <Text style={styles.startText}>{t('practice.startPractice')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.text },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 4 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginBottom: 12 },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  subjectIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subjectLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.text, textAlign: 'center' },
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  topicText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  topicTextSelected: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  countChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  countChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  countText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  countTextSelected: { color: Colors.primary },
  startButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonDisabled: { opacity: 0.4 },
  startText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
});
