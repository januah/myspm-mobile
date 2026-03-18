import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
import { usePracticeQuestions } from '@/lib/hooks/usePractice';

export default function PracticeSessionScreen() {
  const { subject, topic, difficulty, count } = useLocalSearchParams<{
    subject: string;
    topic: string;
    difficulty: string;
    count: string;
  }>();
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const { data: questionData, isLoading } = usePracticeQuestions({
    subject: subject || '',
    topic: topic || '',
    difficulty: (difficulty as any) || 'Medium',
    count: parseInt(count || '10', 10),
  });

  const questions = questionData?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top + webTopPadding }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top + webTopPadding }]}>
        <Text style={styles.questionText}>No questions available</Text>
        <Pressable style={styles.doneBtn} onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.doneText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.correct) {
      setScore((s) => s + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const percent = Math.round((score / total) * 100);
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopPadding + 20 }]}>
        <View style={styles.resultContainer}>
          <View style={[styles.resultCircle, { borderColor: percent >= 60 ? Colors.success : Colors.error }]}>
            <Text style={styles.resultPercent}>{percent}%</Text>
            <Text style={styles.resultLabel}>{score}/{total} correct</Text>
          </View>
          <Text style={styles.resultTitle}>
            {percent >= 80 ? 'Excellent!' : percent >= 60 ? 'Good job!' : 'Keep practicing!'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {topic} - {difficulty}
          </Text>
          <View style={styles.resultActions}>
            <Pressable style={styles.retryBtn} onPress={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setScore(0);
              setFinished(false);
            }}>
              <Feather name="refresh-cw" size={16} color={Colors.primary} />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
            <Pressable style={styles.doneBtn} onPress={() => router.back()}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{total}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((opt, idx) => {
            let optStyle = styles.optionDefault;
            let textStyle = styles.optionTextDefault;
            if (showResult) {
              if (idx === question.correct) {
                optStyle = styles.optionCorrect;
                textStyle = styles.optionTextCorrect;
              } else if (idx === selectedAnswer && idx !== question.correct) {
                optStyle = styles.optionWrong;
                textStyle = styles.optionTextWrong;
              }
            } else if (idx === selectedAnswer) {
              optStyle = styles.optionSelected;
              textStyle = styles.optionTextSelected;
            }

            return (
              <Pressable
                key={idx}
                style={[styles.option, optStyle]}
                onPress={() => !showResult && setSelectedAnswer(idx)}
                disabled={showResult}
              >
                <View style={[styles.optionLetter, showResult && idx === question.correct && { backgroundColor: Colors.success + '20' }]}>
                  <Text style={[styles.optionLetterText, showResult && idx === question.correct && { color: Colors.success }]}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text style={[styles.optionText, textStyle]}>{opt}</Text>
                {showResult && idx === question.correct && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                )}
                {showResult && idx === selectedAnswer && idx !== question.correct && (
                  <Ionicons name="close-circle" size={20} color={Colors.error} />
                )}
              </Pressable>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <Ionicons name="bulb-outline" size={18} color={Colors.warning} />
              <Text style={styles.explanationTitle}>Explanation</Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
            <View style={styles.tipBox}>
              <Text style={styles.tipLabel}>AI Tip</Text>
              <Text style={styles.tipText}>{question.tip}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {!showResult ? (
          <Pressable
            style={[styles.submitBtn, selectedAnswer === null && styles.submitBtnDisabled]}
            disabled={selectedAnswer === null}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit Answer</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex < total - 1 ? 'Next Question' : 'See Results'}
            </Text>
            <Feather name="arrow-right" size={18} color="#fff" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  progressBarOuter: { flex: 1, height: 6, backgroundColor: Colors.surfaceAlt, borderRadius: 3, overflow: 'hidden' },
  progressBarInner: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  counter: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  questionContent: { paddingHorizontal: 20, paddingBottom: 120 },
  questionText: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.text, lineHeight: 26, marginTop: 12 },
  optionsContainer: { marginTop: 24, gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  optionDefault: { backgroundColor: Colors.surface, borderColor: Colors.border },
  optionSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  optionCorrect: { backgroundColor: Colors.successLight, borderColor: Colors.success },
  optionWrong: { backgroundColor: Colors.errorLight, borderColor: Colors.error },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.textSecondary },
  optionText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  optionTextDefault: { color: Colors.text },
  optionTextSelected: { color: Colors.primary },
  optionTextCorrect: { color: Colors.success },
  optionTextWrong: { color: Colors.error },
  explanationCard: {
    marginTop: 20,
    backgroundColor: Colors.warningLight,
    borderRadius: 16,
    padding: 16,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  explanationTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  explanationText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.text, lineHeight: 21 },
  tipBox: {
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
  },
  tipLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.primary, marginBottom: 4 },
  tipText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 19 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.background },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  nextBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  resultCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resultPercent: { fontSize: 40, fontFamily: 'Inter_700Bold', color: Colors.text },
  resultLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  resultTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.text },
  resultSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 4 },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 32, width: '100%' },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  retryText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  doneBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
  doneText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#fff' },
});
