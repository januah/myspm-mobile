import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useExamQuestions } from '@/lib/hooks/useExam';

export default function ExamModeScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const { data: questions = [], isLoading } = useExamQuestions();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [finished, setFinished] = useState(false);

  // Initialize answers array when questions load
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top + webTopPadding }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Exam Mode</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.examIntro}>
          <Text style={styles.examTitle}>No exam available</Text>
          <Pressable style={styles.startExamBtn} onPress={() => router.back()}>
            <Text style={styles.startExamText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Exam Mode</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.examIntro}>
          <View style={styles.examIconBox}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.examTitle}>Mathematics Paper 1</Text>
          <Text style={styles.examMeta}>{questions.length} Questions | 1 Hour</Text>
          <View style={styles.examInfoRow}>
            <View style={styles.examInfoItem}>
              <Feather name="clock" size={16} color={Colors.textSecondary} />
              <Text style={styles.examInfoText}>Timer enabled</Text>
            </View>
            <View style={styles.examInfoItem}>
              <Feather name="bar-chart-2" size={16} color={Colors.textSecondary} />
              <Text style={styles.examInfoText}>Results after</Text>
            </View>
          </View>
          <Pressable style={styles.startExamBtn} onPress={() => setStarted(true)}>
            <Text style={styles.startExamText}>Start Exam</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (finished) {
    const score = answers.reduce<number>((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding + 20 }]}>
        <View style={styles.resultContainer}>
          <View style={[styles.resultCircle, { borderColor: percent >= 60 ? Colors.success : Colors.error }]}>
            <Text style={styles.resultPercent}>{percent}%</Text>
          </View>
          <Text style={styles.resultScore}>{score}/{questions.length} correct</Text>
          <Text style={styles.resultTitle}>{percent >= 80 ? 'Excellent!' : percent >= 60 ? 'Well done!' : 'Keep trying!'}</Text>
          <Pressable style={styles.reviewBtn} onPress={() => router.back()}>
            <Text style={styles.reviewText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const question = questions[currentIndex];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.examTopBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.timerBox}>
          <Feather name="clock" size={14} color={timeLeft < 300 ? Colors.error : Colors.textSecondary} />
          <Text style={[styles.timerText, timeLeft < 300 && { color: Colors.error }]}>{formatTime(timeLeft)}</Text>
        </View>
        <Text style={styles.answeredText}>{answered}/{questions.length}</Text>
      </View>

      <View style={styles.navDots}>
        {questions.map((_, idx) => (
          <Pressable
            key={idx}
            style={[
              styles.navDot,
              idx === currentIndex && styles.navDotActive,
              answers[idx] !== null && styles.navDotAnswered,
            ]}
            onPress={() => setCurrentIndex(idx)}
          >
            <Text style={[
              styles.navDotText,
              idx === currentIndex && styles.navDotTextActive,
              answers[idx] !== null && styles.navDotTextAnswered,
            ]}>{idx + 1}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.examContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionNum}>Question {currentIndex + 1}</Text>
        <Text style={styles.questionText}>{question.text}</Text>
        <View style={styles.optionsContainer}>
          {question.options.map((opt, idx) => {
            const isSelected = answers[currentIndex] === idx;
            return (
              <Pressable
                key={idx}
                style={[styles.examOption, isSelected && styles.examOptionSelected]}
                onPress={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentIndex] = idx;
                  setAnswers(newAnswers);
                }}
              >
                <View style={[styles.optionLetter, isSelected && { backgroundColor: Colors.primary + '20' }]}>
                  <Text style={[styles.optionLetterText, isSelected && { color: Colors.primary }]}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && { color: Colors.primary }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.examBottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={styles.prevBtn}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((i) => i - 1)}
        >
          <Feather name="chevron-left" size={18} color={currentIndex === 0 ? Colors.textTertiary : Colors.text} />
        </Pressable>
        {currentIndex === questions.length - 1 ? (
          <Pressable style={styles.finishBtn} onPress={() => setFinished(true)}>
            <Text style={styles.finishText}>Finish Exam</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.nextNavBtn} onPress={() => setCurrentIndex((i) => i + 1)}>
            <Text style={styles.nextNavText}>Next</Text>
            <Feather name="chevron-right" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}\u2082 3 = 1.585, find the value of log\u2082 12.',
    options: ['2.585', '3.585', '4.170', '2.000'],
    correct: 1,
  },
  {
    id: 2,
    text: 'Simplify: (2x + 3)(x - 4)',
    options: ['2x\u00B2 - 5x - 12', '2x\u00B2 + 5x - 12', '2x\u00B2 - 8x + 3', '2x\u00B2 - 11x - 12'],
    correct: 0,
  },
  {
    id: 3,
    text: 'The gradient of the tangent to the curve y = x\u00B3 - 3x at point (1, -2) is:',
    options: ['0', '3', '-3', '6'],
    correct: 0,
  },
  {
    id: 4,
    text: 'Find the sum of the first 10 terms of the arithmetic progression 3, 7, 11, ...',
    options: ['210', '200', '180', '220'],
    correct: 0,
  },
  {
    id: 5,
    text: 'If sin \u03B8 = 3/5, and \u03B8 is in the first quadrant, find cos \u03B8.',
    options: ['4/5', '3/4', '5/3', '5/4'],
    correct: 0,
  },
];

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Exam Mode</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.examIntro}>
          <View style={styles.examIconBox}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.examTitle}>Mathematics Paper 1</Text>
          <Text style={styles.examMeta}>{questions.length} Questions | 1 Hour</Text>
          <View style={styles.examInfoRow}>
            <View style={styles.examInfoItem}>
              <Feather name="clock" size={16} color={Colors.textSecondary} />
              <Text style={styles.examInfoText}>Timer enabled</Text>
            </View>
            <View style={styles.examInfoItem}>
              <Feather name="bar-chart-2" size={16} color={Colors.textSecondary} />
              <Text style={styles.examInfoText}>Results after</Text>
            </View>
          </View>
          <Pressable style={styles.startExamBtn} onPress={() => setStarted(true)}>
            <Text style={styles.startExamText}>Start Exam</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (finished) {
    const score = answers.reduce<number>((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding + 20 }]}>
        <View style={styles.resultContainer}>
          <View style={[styles.resultCircle, { borderColor: percent >= 60 ? Colors.success : Colors.error }]}>
            <Text style={styles.resultPercent}>{percent}%</Text>
          </View>
          <Text style={styles.resultScore}>{score}/{questions.length} correct</Text>
          <Text style={styles.resultTitle}>{percent >= 80 ? 'Excellent!' : percent >= 60 ? 'Well done!' : 'Keep trying!'}</Text>
          <Pressable style={styles.reviewBtn} onPress={() => router.back()}>
            <Text style={styles.reviewText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const question = questions[currentIndex];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.examTopBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.timerBox}>
          <Feather name="clock" size={14} color={timeLeft < 300 ? Colors.error : Colors.textSecondary} />
          <Text style={[styles.timerText, timeLeft < 300 && { color: Colors.error }]}>{formatTime(timeLeft)}</Text>
        </View>
        <Text style={styles.answeredText}>{answered}/{questions.length}</Text>
      </View>

      <View style={styles.navDots}>
        {questions.map((_, idx) => (
          <Pressable
            key={idx}
            style={[
              styles.navDot,
              idx === currentIndex && styles.navDotActive,
              answers[idx] !== null && styles.navDotAnswered,
            ]}
            onPress={() => setCurrentIndex(idx)}
          >
            <Text style={[
              styles.navDotText,
              idx === currentIndex && styles.navDotTextActive,
              answers[idx] !== null && styles.navDotTextAnswered,
            ]}>{idx + 1}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.examContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionNum}>Question {currentIndex + 1}</Text>
        <Text style={styles.questionText}>{question.text}</Text>
        <View style={styles.optionsContainer}>
          {question.options.map((opt, idx) => {
            const isSelected = answers[currentIndex] === idx;
            return (
              <Pressable
                key={idx}
                style={[styles.examOption, isSelected && styles.examOptionSelected]}
                onPress={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentIndex] = idx;
                  setAnswers(newAnswers);
                }}
              >
                <View style={[styles.optionLetter, isSelected && { backgroundColor: Colors.primary + '20' }]}>
                  <Text style={[styles.optionLetterText, isSelected && { color: Colors.primary }]}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && { color: Colors.primary }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.examBottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={styles.prevBtn}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((i) => i - 1)}
        >
          <Feather name="chevron-left" size={18} color={currentIndex === 0 ? Colors.textTertiary : Colors.text} />
        </Pressable>
        {currentIndex === questions.length - 1 ? (
          <Pressable style={styles.finishBtn} onPress={() => setFinished(true)}>
            <Text style={styles.finishText}>Finish Exam</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.nextNavBtn} onPress={() => setCurrentIndex((i) => i + 1)}>
            <Text style={styles.nextNavText}>Next</Text>
            <Feather name="chevron-right" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  examIntro: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  examIconBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  examTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  examMeta: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, marginTop: 6 },
  examInfoRow: { flexDirection: 'row', gap: 24, marginTop: 20 },
  examInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  examInfoText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  startExamBtn: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  startExamText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  examTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  answeredText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  navDots: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  navDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDotActive: { backgroundColor: Colors.primary },
  navDotAnswered: { backgroundColor: Colors.accentLight, borderWidth: 1, borderColor: Colors.accent },
  navDotText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  navDotTextActive: { color: '#fff' },
  navDotTextAnswered: { color: Colors.accent },
  examContent: { paddingHorizontal: 20, paddingBottom: 120 },
  questionNum: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary, marginBottom: 8 },
  questionText: { fontSize: 17, fontFamily: 'Inter_600SemiBold', color: Colors.text, lineHeight: 25 },
  optionsContainer: { marginTop: 24, gap: 10 },
  examOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  examOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.textSecondary },
  optionText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text },
  examBottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  prevBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextNavBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 48,
  },
  nextNavText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  finishBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  finishText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  resultCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resultPercent: { fontSize: 38, fontFamily: 'Inter_700Bold', color: Colors.text },
  resultScore: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  resultTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text, marginTop: 8 },
  reviewBtn: {
    marginTop: 28,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  reviewText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
});
