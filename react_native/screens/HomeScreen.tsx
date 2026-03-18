import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowRight,
  BookOpen,
  Camera,
  FileEdit,
  Flame,
  Star,
  User,
} from "lucide-react-native";

import { colors } from "../constants/colors";

const STUDY_PLAN = [
  { subject: "Mathematics", topic: "Probability", count: 10, color: colors.primary },
  { subject: "Chemistry", topic: "Chemical Bonding", count: 5, color: colors.secondary },
  { subject: "Sejarah", topic: "Kemerdekaan", count: 8, color: colors.warning },
];

const MOCK_PROGRESS = [
  { name: "Math", score: 78, color: colors.primary },
  { name: "BM", score: 92, color: colors.success },
  { name: "English", score: 65, color: colors.warning },
];

const MOCK_LEADERS = [
  { rank: 1, name: "Ahmad", avatar: "A", xp: 12500 },
  { rank: 2, name: "Siti", avatar: "S", xp: 11800 },
  { rank: 3, name: "Raj", avatar: "R", xp: 10200 },
];

const MOCK_FEED = [
  { teacher: "Cikgu Ahmad", title: "New practice set: Algebra", time: "2h ago" },
  { teacher: "Pn. Siti", title: "Essay tips for BM", time: "5h ago" },
];

const medalColors = [colors.gold, colors.silver, colors.bronze];

export default function HomeScreen({
  navigation,
}: {
  navigation: { navigate: (name: string) => void };
}) {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === "web" ? 67 : 0;
  const displayName = "User";
  const displayStreak = 7;
  const displayXP = 2450;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Good evening, {displayName}</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakBadge}>
              <Flame size={14} color={colors.streak} />
              <Text style={styles.streakText}>{displayStreak} day streak</Text>
            </View>
            <View style={styles.xpBadge}>
              <Star size={14} color={colors.xp} />
              <Text style={styles.xpText}>{displayXP.toLocaleString()} XP</Text>
            </View>
          </View>
        </View>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>{displayName.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate("Practice")}>
          <View style={[styles.quickIcon, { backgroundColor: colors.primary + "20" }]}>
            <BookOpen size={22} color={colors.primary} />
          </View>
          <Text style={styles.quickLabel}>Practice</Text>
        </Pressable>
        <Pressable style={styles.quickBtn}>
          <View style={[styles.quickIcon, { backgroundColor: colors.accent + "20" }]}>
            <FileEdit size={22} color={colors.accent} />
          </View>
          <Text style={styles.quickLabel}>Exam</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate("Camera")}>
          <View style={[styles.quickIcon, { backgroundColor: colors.xp + "20" }]}>
            <Camera size={22} color={colors.xp} />
          </View>
          <Text style={styles.quickLabel}>Scan</Text>
        </Pressable>
      </View>

      <View style={styles.studyPlanCard}>
        <View style={styles.studyPlanHeader}>
          <View>
            <Text style={styles.cardTitle}>Today's Study Plan</Text>
            <Text style={styles.cardSubtitle}>AI-personalized for you</Text>
          </View>
        </View>
        {STUDY_PLAN.map((item, idx) => (
          <View key={idx} style={styles.planItem}>
            <View style={[styles.planDot, { backgroundColor: item.color }]} />
            <View style={styles.planInfo}>
              <Text style={styles.planSubject}>{item.subject}</Text>
              <Text style={styles.planTopic}>{item.topic} ({item.count} questions)</Text>
            </View>
          </View>
        ))}
        <Pressable style={styles.planBtn} onPress={() => navigation.navigate("Practice")}>
          <Text style={styles.planBtnText}>Start Practice</Text>
          <ArrowRight size={16} color={colors.textInverse} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Snapshot</Text>
        <View style={styles.progressCard}>
          {MOCK_PROGRESS.map((s) => (
            <View key={s.name} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{s.name}</Text>
              <View style={styles.progressBarOuter}>
                <View style={[styles.progressBarInner, { width: `${s.score}%`, backgroundColor: s.color }]} />
              </View>
              <Text style={[styles.progressValue, { color: s.color }]}>{s.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <Pressable onPress={() => navigation.navigate("Leaderboard")}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        <View style={styles.leaderboardCard}>
          {MOCK_LEADERS.map((s) => {
            const medalColor = medalColors[s.rank - 1];
            return (
              <View key={s.rank} style={styles.leaderRow}>
                <Text style={[styles.leaderRank, { color: medalColor }]}>#{s.rank}</Text>
                <View style={[styles.leaderAvatar, { borderColor: medalColor }]}>
                  <Text style={styles.leaderAvatarText}>{s.avatar}</Text>
                </View>
                <Text style={styles.leaderName}>{s.name}</Text>
                <Text style={styles.leaderXp}>{s.xp.toLocaleString()} XP</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teacher Feed</Text>
        {MOCK_FEED.map((post, idx) => (
          <Pressable key={idx} style={styles.feedCard}>
            <View style={styles.feedAvatar}>
              <User size={16} color={colors.primary} />
            </View>
            <View style={styles.feedInfo}>
              <Text style={styles.feedTeacher}>
                {post.teacher} <Text style={styles.feedAction}>posted</Text>
              </Text>
              <Text style={styles.feedTitle}>{post.title}</Text>
            </View>
            <Text style={styles.feedTime}>{post.time}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assignments</Text>
        <View style={styles.assignmentCard}>
          <View style={[styles.assignmentDot, { backgroundColor: colors.warning }]} />
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>Bahasa Melayu Essay</Text>
            <Text style={styles.assignmentDue}>Due Tomorrow</Text>
          </View>
          <Pressable style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 22, fontWeight: "700", color: colors.text },
  streakRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.streak + "20",
  },
  streakText: { fontSize: 12, fontWeight: "600", color: colors.streak },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.xp + "20",
  },
  xpText: { fontSize: 12, fontWeight: "600", color: colors.xp },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { fontSize: 16, fontWeight: "700", color: colors.primary },
  quickActions: { flexDirection: "row", paddingHorizontal: 20, marginTop: 24, gap: 12 },
  quickBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  studyPlanCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  studyPlanHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  planItem: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  planDot: { width: 8, height: 8, borderRadius: 4 },
  planInfo: { flex: 1 },
  planSubject: { fontSize: 14, fontWeight: "600", color: colors.text },
  planTopic: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  planBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  planBtnText: { fontSize: 14, fontWeight: "600", color: colors.textInverse },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 12 },
  viewAll: { fontSize: 13, fontWeight: "500", color: colors.primary },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressLabel: { fontSize: 13, fontWeight: "500", color: colors.text, width: 80 },
  progressBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  progressBarInner: { height: "100%", borderRadius: 4 },
  progressValue: { fontSize: 13, fontWeight: "600", width: 36, textAlign: "right" },
  leaderboardCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 10,
  },
  leaderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  leaderRank: { fontSize: 14, fontWeight: "700", width: 28, textAlign: "center" },
  leaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  leaderAvatarText: { fontSize: 14, fontWeight: "600", color: colors.primary },
  leaderName: { flex: 1, fontSize: 14, fontWeight: "500", color: colors.text },
  leaderXp: { fontSize: 13, fontWeight: "600", color: colors.primary },
  feedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  feedInfo: { flex: 1 },
  feedTeacher: { fontSize: 13, fontWeight: "600", color: colors.text },
  feedAction: { fontWeight: "400", color: colors.textSecondary },
  feedTitle: { fontSize: 13, fontWeight: "500", color: colors.primary, marginTop: 2 },
  feedTime: { fontSize: 11, color: colors.textTertiary },
  assignmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  assignmentDot: { width: 10, height: 10, borderRadius: 5 },
  assignmentInfo: { flex: 1 },
  assignmentTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  assignmentDue: { fontSize: 12, color: colors.warning, marginTop: 2 },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  submitText: { fontSize: 12, fontWeight: "600", color: colors.textInverse },
});
