import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: 'calculator' as const, color: Colors.subjectMath },
  { id: 'addmath', label: 'Add Maths', icon: 'function-variant' as const, color: Colors.subjectAddMath },
  { id: 'bio', label: 'Biology', icon: 'leaf' as const, color: Colors.subjectBio },
  { id: 'chem', label: 'Chemistry', icon: 'atom' as const, color: Colors.subjectChem },
  { id: 'physics', label: 'Physics', icon: 'lightning-bolt' as const, color: Colors.subjectPhysics },
  { id: 'sejarah', label: 'Sejarah', icon: 'book-open-variant' as const, color: Colors.subjectSejarah },
  { id: 'bm', label: 'Bahasa Melayu', icon: 'translate' as const, color: Colors.subjectBM },
  { id: 'english', label: 'English', icon: 'alphabetical' as const, color: Colors.subjectEnglish },
];

const TEACHERS = [
  { id: '1', name: 'Mr. Lim Wei Hong', subject: 'Add Maths' },
  { id: '2', name: 'Pn. Farah Nadia', subject: 'Chemistry' },
  { id: '3', name: 'En. Azman bin Yusof', subject: 'Sejarah' },
  { id: '4', name: 'Ms. Priya a/p Kumar', subject: 'Biology' },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const [step, setStep] = useState(0);
  const [formLevel, setFormLevel] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [followedTeachers, setFollowedTeachers] = useState<string[]>([]);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleTeacher = (id: string) => {
    setFollowedTeachers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      await AsyncStorage.setItem('user_profile', JSON.stringify({
        formLevel,
        subjects: selectedSubjects,
        school: selectedSchool || schoolSearch,
        teachers: followedTeachers,
      }));
      router.replace('/(tabs)');
    } catch {
      router.replace('/(tabs)');
    }
  };

  const canNext = () => {
    if (step === 1) return !!formLevel;
    if (step === 2) return selectedSubjects.length > 0;
    if (step === 3) return !!(selectedSchool || schoolSearch);
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeIcon}>
              <MaterialCommunityIcons name="school-outline" size={56} color={Colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to MySPM</Text>
            <Text style={styles.welcomeSubtitle}>Your AI-powered SPM exam trainer</Text>
            <Text style={styles.welcomeDesc}>
              Practice questions, simulate exams, scan answers with AI, and track your progress — all in one app.
            </Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What form are you in?</Text>
            <Text style={styles.stepSubtitle}>This helps us personalize your learning path</Text>
            <View style={styles.formOptions}>
              {['Form 4', 'Form 5'].map((level) => (
                <Pressable
                  key={level}
                  style={[styles.formCard, formLevel === level && styles.formCardSelected]}
                  onPress={() => setFormLevel(level)}
                >
                  <Text style={[styles.formText, formLevel === level && styles.formTextSelected]}>{level}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select your subjects</Text>
            <Text style={styles.stepSubtitle}>Choose the subjects you want to study</Text>
            <View style={styles.subjectGrid}>
              {SUBJECTS.map((s) => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    style={[styles.subjectCard, isSelected && { borderColor: s.color, backgroundColor: s.color + '10' }]}
                    onPress={() => toggleSubject(s.id)}
                  >
                    <View style={[styles.subjectIcon, { backgroundColor: s.color + '15' }]}>
                      <MaterialCommunityIcons name={s.icon} size={22} color={s.color} />
                    </View>
                    <Text style={[styles.subjectLabel, isSelected && { color: s.color, fontFamily: 'Inter_600SemiBold' }]}>
                      {s.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkMark, { backgroundColor: s.color }]}>
                        <Feather name="check" size={10} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Find your school</Text>
            <Text style={styles.stepSubtitle}>Connect with classmates on the leaderboard</Text>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color={Colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your school..."
                placeholderTextColor={Colors.textTertiary}
                value={schoolSearch}
                onChangeText={setSchoolSearch}
              />
            </View>
            {['SMK Taman Melawati', 'SMK Sri Aman', 'MRSM Langkawi'].filter(
              (s) => s.toLowerCase().includes(schoolSearch.toLowerCase())
            ).map((school) => (
              <Pressable
                key={school}
                style={[styles.schoolRow, selectedSchool === school && styles.schoolRowSelected]}
                onPress={() => setSelectedSchool(school)}
              >
                <Feather name="map-pin" size={16} color={selectedSchool === school ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.schoolText, selectedSchool === school && { color: Colors.primary }]}>
                  {school}
                </Text>
                {selectedSchool === school && <Feather name="check" size={16} color={Colors.primary} />}
              </Pressable>
            ))}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Follow teachers</Text>
            <Text style={styles.stepSubtitle}>Get practice sets and tips from your teachers</Text>
            {TEACHERS.map((t) => {
              const isFollowed = followedTeachers.includes(t.id);
              return (
                <View key={t.id} style={styles.teacherRow}>
                  <View style={styles.teacherAvatar}>
                    <Feather name="user" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.teacherInfo}>
                    <Text style={styles.teacherName}>{t.name}</Text>
                    <Text style={styles.teacherSubject}>{t.subject}</Text>
                  </View>
                  <Pressable
                    style={[styles.followBtn, isFollowed && styles.followBtnActive]}
                    onPress={() => toggleTeacher(t.id)}
                  >
                    <Text style={[styles.followText, isFollowed && styles.followTextActive]}>
                      {isFollowed ? 'Following' : 'Follow'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.progressRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {step > 0 && (
          <Pressable style={styles.backStepBtn} onPress={() => setStep((s) => s - 1)}>
            <Feather name="arrow-left" size={20} color={Colors.text} />
          </Pressable>
        )}
        <Pressable
          style={[styles.nextStepBtn, step === 0 && { flex: 1 }, !canNext() && styles.nextStepBtnDisabled]}
          disabled={!canNext()}
          onPress={() => {
            if (step < 4) setStep((s) => s + 1);
            else handleComplete();
          }}
        >
          <Text style={styles.nextStepText}>
            {step === 0 ? 'Get Started' : step === 4 ? 'Start Learning' : 'Continue'}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: Colors.surfaceAlt },
  progressDotActive: { backgroundColor: Colors.primary },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  welcomeIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  welcomeTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.text },
  welcomeSubtitle: { fontSize: 16, fontFamily: 'Inter_500Medium', color: Colors.primary, marginTop: 6 },
  welcomeDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  stepContent: { paddingHorizontal: 20, paddingTop: 16 },
  stepTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.text },
  stepSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 4, marginBottom: 24 },
  formOptions: { flexDirection: 'row', gap: 12 },
  formCard: {
    flex: 1,
    paddingVertical: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  formCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  formText: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  formTextSelected: { color: Colors.primary },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  subjectIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subjectLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text, flex: 1 },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  schoolRowSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  schoolText: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  teacherAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherInfo: { flex: 1, marginLeft: 12 },
  teacherName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  teacherSubject: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  followBtnActive: { backgroundColor: Colors.primary },
  followText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  followTextActive: { color: '#fff' },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  backStepBtn: {
    width: 48,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
  },
  nextStepBtnDisabled: { opacity: 0.4 },
  nextStepText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
});
