import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useCurrentUser, useSubjectProgress, useFollowedTeachersPosts } from '@/lib/hooks/useUser';
import { useSchoolLeaderboard } from '@/lib/hooks/useLeaderboard';

const STUDY_PLAN = [
  { subject: 'Mathematics', topic: 'Probability', count: 10, color: Colors.subjectMath },
  { subject: 'Chemistry', topic: 'Chemical Bonding', count: 5, color: Colors.subjectChem },
  { subject: 'Sejarah', topic: 'Kemerdekaan', count: 8, color: Colors.subjectSejarah },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const { data: user } = useCurrentUser();
  const { data: subjectProgress = [], isLoading: progressLoading } = useSubjectProgress();
  const { data: schoolLeaders = [], isLoading: leaderboardLoading } = useSchoolLeaderboard();
  const { data: teacherPosts = [], isLoading: postsLoading } = useFollowedTeachersPosts();

  const displayName = user?.name?.split(' ')[0] || 'User';
  const displayStreak = user?.streak || 0;
  const displayXP = user?.totalXp || 0;
  const topStudents = schoolLeaders.slice(0, 3);

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
              <MaterialCommunityIcons name="fire" size={14} color={Colors.streak} />
              <Text style={styles.streakText}>{displayStreak} day streak</Text>
            </View>
            <View style={styles.xpBadge}>
              <MaterialCommunityIcons name="star-four-points" size={14} color={Colors.xp} />
              <Text style={styles.xpText}>{displayXP.toLocaleString()} XP</Text>
            </View>
          </View>
        </View>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>{displayName.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickBtn} onPress={() => router.push('/(tabs)/practice')}>
          <View style={[styles.quickIcon, { backgroundColor: Colors.primary + '12' }]}>
            <Ionicons name="play" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.quickLabel}>Practice</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => router.push('/exam-mode')}>
          <View style={[styles.quickIcon, { backgroundColor: Colors.accent + '12' }]}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={22} color={Colors.accent} />
          </View>
          <Text style={styles.quickLabel}>Exam</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => router.push('/(tabs)/camera')}>
          <View style={[styles.quickIcon, { backgroundColor: Colors.xp + '12' }]}>
            <MaterialCommunityIcons name="camera-outline" size={22} color={Colors.xp} />
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
          <MaterialCommunityIcons name="robot-outline" size={20} color={Colors.primary} />
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
        <Pressable style={styles.planBtn} onPress={() => router.push('/(tabs)/practice')}>
          <Text style={styles.planBtnText}>Start Practice</Text>
          <Feather name="arrow-right" size={16} color={Colors.textInverse} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Snapshot</Text>
        {progressLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.progressCard}>
            {subjectProgress.map((s) => (
              <View key={s.name} style={styles.progressRow}>
                <Text style={styles.progressLabel}>{s.name}</Text>
                <View style={styles.progressBarOuter}>
                  <View style={[styles.progressBarInner, { width: `${s.score}%`, backgroundColor: s.color }]} />
                </View>
                <Text style={[styles.progressValue, { color: s.color }]}>{s.score}%</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <Pressable onPress={() => router.push('/(tabs)/leaderboard')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        {leaderboardLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.leaderboardCard}>
            {topStudents.map((s) => {
              const medalColor = s.rank === 1 ? Colors.gold : s.rank === 2 ? Colors.silver : Colors.bronze;
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
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teacher Feed</Text>
        {postsLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <>
            {teacherPosts.map((post, idx) => (
              <Pressable key={idx} style={styles.feedCard}>
                <View style={styles.feedAvatar}>
                  <Feather name="user" size={16} color={Colors.primary} />
                </View>
                <View style={styles.feedInfo}>
                  <Text style={styles.feedTeacher}>{post.teacher} <Text style={styles.feedAction}>posted</Text></Text>
                  <Text style={styles.feedTitle}>{post.title}</Text>
                </View>
                <Text style={styles.feedTime}>{post.time}</Text>
              </Pressable>
            ))}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assignments</Text>
        <View style={styles.assignmentCard}>
          <View style={[styles.assignmentDot, { backgroundColor: Colors.warning }]} />
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  streakRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.streak + '12',
  },
  streakText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.streak },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.xp + '12',
  },
  xpText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.xp },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.text },

  studyPlanCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  studyPlanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  cardSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  planItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  planDot: { width: 8, height: 8, borderRadius: 4 },
  planInfo: { flex: 1 },
  planSubject: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  planTopic: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 1 },
  planBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  planBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textInverse },

  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginBottom: 12 },
  viewAll: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },

  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 12,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text, width: 80 },
  progressBarOuter: { flex: 1, height: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 4, overflow: 'hidden', marginHorizontal: 10 },
  progressBarInner: { height: '100%', borderRadius: 4 },
  progressValue: { fontSize: 13, fontFamily: 'Inter_600SemiBold', width: 36, textAlign: 'right' },

  leaderboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
  },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  leaderRank: { fontSize: 14, fontFamily: 'Inter_700Bold', width: 28, textAlign: 'center' },
  leaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  leaderAvatarText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  leaderName: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text },
  leaderXp: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },

  feedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 12,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedInfo: { flex: 1 },
  feedTeacher: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  feedAction: { fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  feedTitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary, marginTop: 2 },
  feedTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textTertiary },

  assignmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 12,
  },
  assignmentDot: { width: 10, height: 10, borderRadius: 5 },
  assignmentInfo: { flex: 1 },
  assignmentTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  assignmentDue: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.warning, marginTop: 2 },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  submitText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textInverse },
});
