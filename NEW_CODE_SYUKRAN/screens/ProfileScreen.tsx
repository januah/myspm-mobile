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
import { ChevronRight, Globe, HelpCircle, Lock, Settings, Shield, User } from "lucide-react-native";

import { colors } from "../constants/colors";

const MOCK_ACHIEVEMENTS = [
  { id: "1", title: "First Steps", icon: "star", color: colors.primary, earned: true },
  { id: "2", title: "Week Streak", icon: "flame", color: colors.streak, earned: true },
  { id: "3", title: "Top 10", icon: "trophy", color: colors.gold, earned: false },
  { id: "4", title: "Scholar", icon: "book", color: colors.success, earned: true },
  { id: "5", title: "Master", icon: "crown", color: colors.xp, earned: false },
];

const MOCK_PROGRESS = [
  { name: "Mathematics", score: 78, color: colors.primary },
  { name: "Bahasa Melayu", score: 92, color: colors.success },
  { name: "English", score: 65, color: colors.warning },
];

const SETTINGS_ITEMS = [
  { icon: Globe, label: "Language", value: "English" },
  { icon: Shield, label: "Notifications", value: "On" },
  { icon: User, label: "Account", value: "" },
  { icon: HelpCircle, label: "Help & Support", value: "" },
];

export default function ProfileScreen({
  navigation,
}: {
  navigation: { navigate: (name: string) => void };
}) {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === "web" ? 67 : 0;
  const displayName = "User";
  const displaySchool = "SMK Example";
  const displayXP = 2450;
  const displayStreak = 7;
  const displayQuestions = 156;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Profile</Text>
        <Pressable style={styles.settingsBtn} onPress={() => navigation.navigate("ProfileSettings")}>
          <Settings size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
          </View>
          <Pressable style={styles.editAvatarBtn}>
            <Text style={styles.editAvatarText}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileSchool}>{displaySchool}</Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>Form 5</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayXP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayQuestions}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementGrid}>
          {MOCK_ACHIEVEMENTS.map((a) => (
            <View
              key={a.id}
              style={[styles.achievementCard, !a.earned && styles.achievementLocked]}
            >
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: a.earned ? a.color + "25" : colors.surfaceAlt },
                ]}
              >
                <Lock size={24} color={a.earned ? a.color : colors.textTertiary} />
              </View>
              <Text style={[styles.achievementTitle, !a.earned && { color: colors.textTertiary }]}>
                {a.title}
              </Text>
              {!a.earned && (
                <Lock size={10} color={colors.textTertiary} style={{ marginTop: 2 }} />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Performance</Text>
        <View style={styles.progressCard}>
          {MOCK_PROGRESS.map((s) => (
            <View key={s.name} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{s.name}</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBar, { width: `${s.score}%`, backgroundColor: s.color }]}
                />
              </View>
              <Text style={[styles.progressValue, { color: s.color }]}>{s.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {SETTINGS_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={styles.settingsRow}
            onPress={
              item.label === "Language"
                ? () => navigation.navigate("ProfileSettings")
                : undefined
            }
          >
            <item.icon size={18} color={colors.textSecondary} />
            <Text style={styles.settingsLabel}>{item.label}</Text>
            <Text style={styles.settingsValue}>{item.value}</Text>
            <ChevronRight size={16} color={colors.textTertiary} />
          </Pressable>
        ))}
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
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  settingsBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: colors.primary },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  editAvatarText: { fontSize: 14, color: colors.textInverse, fontWeight: "700" },
  profileName: { fontSize: 20, fontWeight: "700", color: colors.text, marginTop: 12 },
  profileSchool: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  profileBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  profileBadgeText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.borderLight },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 12 },
  achievementGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  achievementCard: {
    width: "31%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  achievementLocked: { opacity: 0.5 },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementTitle: { fontSize: 11, fontWeight: "500", color: colors.text, textAlign: "center" },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 14,
  },
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressLabel: { fontSize: 13, fontWeight: "500", color: colors.text, width: 100 },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 4 },
  progressValue: { fontSize: 13, fontWeight: "600", width: 36, textAlign: "right" },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  settingsLabel: { fontSize: 14, fontWeight: "500", color: colors.text, flex: 1 },
  settingsValue: { fontSize: 13, color: colors.textSecondary },
});
