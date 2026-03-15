import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useScanQuestion, useGradeAnswer } from '@/lib/hooks/useScan';

export default function ScanResultScreen() {
  const { imageUri, mode, questionId } = useLocalSearchParams<{ imageUri: string; mode: string; questionId?: string }>();
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const isScan = mode === 'scan';
  const scanMutation = useScanQuestion();
  const gradeMutation = useGradeAnswer();

  useEffect(() => {
    if (imageUri) {
      if (isScan) {
        scanMutation.mutate({ imageUri });
      } else if (questionId) {
        gradeMutation.mutate({ imageUri, questionId });
      }
    }
  }, [imageUri, mode, questionId]);

  const loading = isScan ? scanMutation.isPending : gradeMutation.isPending;
  const scanData = isScan ? scanMutation.data : null;
  const gradeData = !isScan ? gradeMutation.data : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>{isScan ? 'AI Solution' : 'AI Grading'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {isScan ? 'Analyzing question...' : 'Grading your answer...'}
          </Text>
          <Text style={styles.loadingSubtext}>Our AI is working on it</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
          {imageUri && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            </View>
          )}

          {isScan && scanData ? (
            <>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="text-box-search-outline" size={18} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Detected Question</Text>
                </View>
                <Text style={styles.questionText}>{scanData.question}</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={Colors.accent} />
                  <Text style={styles.cardTitle}>Step-by-Step Solution</Text>
                </View>
                {scanData.solution?.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepDot}>
                      <Text style={styles.stepNum}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
                {scanData.answer && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <Text style={styles.answerText}>{scanData.answer}</Text>
                  </View>
                )}
              </View>

              {scanData.similarQuestions && scanData.similarQuestions.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Feather name="link" size={16} color={Colors.xp} />
                    <Text style={styles.cardTitle}>Similar Questions</Text>
                  </View>
                  {scanData.similarQuestions.map((q, idx) => (
                    <Pressable key={idx} style={styles.similarItem}>
                      <Text style={styles.similarText}>{q}</Text>
                      <Feather name="arrow-right" size={14} color={Colors.primary} />
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          ) : !isScan && gradeData ? (
            <>
              <View style={styles.scoreCard}>
                <View style={[styles.scoreCircle, {
                  borderColor: gradeData.score / gradeData.total >= 0.6 ? Colors.success : Colors.error,
                }]}>
                  <Text style={styles.scoreValue}>{gradeData.score}</Text>
                  <Text style={styles.scoreTotal}>/ {gradeData.total}</Text>
                </View>
                <Text style={styles.scoreFeedback}>{gradeData.feedback}</Text>
              </View>

              {gradeData.missingPoints && gradeData.missingPoints.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Feather name="alert-circle" size={16} color={Colors.warning} />
                    <Text style={styles.cardTitle}>Missing Key Points</Text>
                  </View>
                  {gradeData.missingPoints.map((point, idx) => (
                    <View key={idx} style={styles.missingRow}>
                      <View style={styles.missingDot} />
                      <Text style={styles.missingText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
      )}
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  loadingSubtext: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  content: { paddingHorizontal: 20 },
  imagePreview: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 20,
  },
  previewImage: { width: '100%', height: '100%' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  questionText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.text, lineHeight: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.primary },
  stepText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.text, lineHeight: 20, paddingTop: 2 },
  answerBox: {
    marginTop: 8,
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.success },
  answerText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.success },
  similarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  similarText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: { fontSize: 36, fontFamily: 'Inter_700Bold', color: Colors.text },
  scoreTotal: { fontSize: 16, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  scoreFeedback: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  missingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  missingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.warning, marginTop: 6 },
  missingText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.text, lineHeight: 20 },
});
