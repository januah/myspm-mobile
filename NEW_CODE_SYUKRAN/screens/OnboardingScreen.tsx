import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  School,
  Search,
  User,
} from "lucide-react-native";

import { colors } from "../constants/colors";

const MOCK_SUBJECTS = [
  { id: "bm", label: "Bahasa Melayu", icon: "book-open", color: "#007AFF" },
  { id: "en", label: "English", icon: "book-open", color: "#34C759" },
  { id: "math", label: "Mathematics", icon: "book-open", color: "#FF9500" },
  { id: "science", label: "Science", icon: "book-open", color: "#AF52DE" },
  { id: "history", label: "Sejarah", icon: "book-open", color: "#E53935" },
];

const MOCK_SCHOOLS = [
  "SMK Taman Melawati",
  "SMK Sri Aman",
  "MRSM Langkawi",
];

const MOCK_TEACHERS = [
  { id: "t1", name: "Cikgu Ahmad", subject: "Mathematics" },
  { id: "t2", name: "Pn. Siti", subject: "Bahasa Melayu" },
  { id: "t3", name: "Mr. Raj", subject: "English" },
];

type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

export default function OnboardingScreen({
  navigation,
}: {
  navigation: { navigate: (name: keyof AuthStackParamList, params?: object) => void };
}) {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === "web" ? 67 : 0;
  const [step, setStep] = useState(0);

  const [formLevel, setFormLevel] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
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

  const handleComplete = () => {
    navigation.navigate("Login");
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
              <School size={56} color={colors.primary} />
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
              {["Form 4", "Form 5"].map((level) => (
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
              {MOCK_SUBJECTS.map((s) => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    style={[styles.subjectCard, isSelected && { borderColor: s.color, backgroundColor: s.color + "20" }]}
                    onPress={() => toggleSubject(s.id)}
                  >
                    <View style={[styles.subjectIcon, { backgroundColor: s.color + "25" }]}>
                      <School size={22} color={s.color} />
                    </View>
                    <Text style={[styles.subjectLabel, isSelected && { color: s.color, fontWeight: "600" }]}>
                      {s.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkMark, { backgroundColor: s.color }]}>
                        <Check size={10} color="#fff" />
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
              <Search size={18} color={colors.gray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your school..."
                placeholderTextColor={colors.gray}
                value={schoolSearch}
                onChangeText={setSchoolSearch}
              />
            </View>
            {MOCK_SCHOOLS.filter((s) =>
              s.toLowerCase().includes(schoolSearch.toLowerCase())
            ).map((school) => (
              <Pressable
                key={school}
                style={[styles.schoolRow, selectedSchool === school && styles.schoolRowSelected]}
                onPress={() => setSelectedSchool(school)}
              >
                <MapPin size={16} color={selectedSchool === school ? colors.primary : colors.darkGray} />
                <Text style={[styles.schoolText, selectedSchool === school && { color: colors.primary }]}>
                  {school}
                </Text>
                {selectedSchool === school && <Check size={16} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Follow teachers</Text>
            <Text style={styles.stepSubtitle}>Get practice sets and tips from your teachers</Text>
            {MOCK_TEACHERS.map((t) => {
              const isFollowed = followedTeachers.includes(t.id);
              return (
                <View key={t.id} style={styles.teacherRow}>
                  <View style={styles.teacherAvatar}>
                    <User size={18} color={colors.primary} />
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
                      {isFollowed ? "Following" : "Follow"}
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
            <ArrowLeft size={20} color={colors.darkText} />
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
            {step === 0 ? "Get Started" : step === 4 ? "Start Learning" : "Continue"}
          </Text>
          <ArrowRight size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
  },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: colors.lightGray },
  progressDotActive: { backgroundColor: colors.primary },
  welcomeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  welcomeIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  welcomeTitle: { fontSize: 28, fontWeight: "700", color: colors.darkText },
  welcomeSubtitle: { fontSize: 16, fontWeight: "500", color: colors.primary, marginTop: 6 },
  welcomeDesc: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  stepContent: { paddingHorizontal: 20, paddingTop: 16 },
  stepTitle: { fontSize: 24, fontWeight: "700", color: colors.darkText },
  stepSubtitle: { fontSize: 14, color: colors.darkGray, marginTop: 4, marginBottom: 24 },
  formOptions: { flexDirection: "row", gap: 12 },
  formCard: {
    flex: 1,
    paddingVertical: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  formCardSelected: { borderColor: colors.primary, backgroundColor: colors.lightGray },
  formText: { fontSize: 18, fontWeight: "600", color: colors.darkText },
  formTextSelected: { color: colors.primary },
  subjectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  subjectCard: {
    width: "47%",
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: "relative",
  },
  subjectIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  subjectLabel: { fontSize: 13, fontWeight: "500", color: colors.darkText, flex: 1 },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.darkText,
  },
  schoolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  schoolRowSelected: { borderColor: colors.primary, backgroundColor: colors.lightGray },
  schoolText: { flex: 1, fontSize: 14, fontWeight: "500", color: colors.darkText },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teacherAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  teacherInfo: { flex: 1, marginLeft: 12 },
  teacherName: { fontSize: 14, fontWeight: "600", color: colors.darkText },
  teacherSubject: { fontSize: 12, color: colors.darkGray, marginTop: 2 },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  followBtnActive: { backgroundColor: colors.primary },
  followText: { fontSize: 13, fontWeight: "600", color: colors.primary },
  followTextActive: { color: "#fff" },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  backStepBtn: {
    width: 48,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  nextStepBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
  },
  nextStepBtnDisabled: { opacity: 0.4 },
  nextStepText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
