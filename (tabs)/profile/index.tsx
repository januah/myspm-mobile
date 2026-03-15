import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
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

const ACHIEVEMENTS = [
  { id: '1', title: '7-Day Streak', icon: 'fire' as const, color: Colors.streak, earned: true },
  { id: '2', title: 'Algebra Master', icon: 'school' as const, color: Colors.subjectMath, earned: true },
  { id: '3', title: 'Top 10 School', icon: 'trophy' as const, color: Colors.gold, earned: true },
  { id: '4', title: 'Science Whiz', icon: 'flask' as const, color: Colors.subjectScience, earned: false },
  { id: '5', title: '100 Questions', icon: 'check-circle' as const, color: Colors.accent, earned: false },
  { id: '6', title: 'Perfect Score', icon: 'star' as const, color: Colors.xp, earned: false },
];

const SUBJECT_PROGRESS = [
  { name: 'Mathematics', score: 72, color: Colors.subjectMath },
  { name: 'Chemistry', score: 61, color: Colors.subjectChem },
  { name: 'Sejarah', score: 80, color: Colors.subjectSejarah },
  { name: 'English', score: 85, color: Colors.subjectEnglish },
  { name: 'Biology', score: 68, color: Colors.subjectBio },
];

const TEACHERS = [
  { name: 'Mr. Lim Wei Hong', subject: 'Add Maths', posts: 12 },
  { name: 'Pn. Farah Nadia', subject: 'Chemistry', posts: 8 },
  { name: 'En. Azman bin Yusof', subject: 'Sejarah', posts: 15 },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('settings')}
        >
          <Feather name="settings" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Pressable style={styles.editAvatarBtn}>
            <Feather name="edit-2" size={12} color={Colors.textInverse} />
          </Pressable>
        </View>
        <Text style={styles.profileName}>Aiman bin Razak</Text>
        <Text style={styles.profileSchool}>SMK Taman Melawati</Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>Form 5</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7,910</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>243</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('gamification.achievements')}</Text>
        <View style={styles.achievementGrid}>
          {ACHIEVEMENTS.map((a) => (
            <View key={a.id} style={[styles.achievementCard, !a.earned && styles.achievementLocked]}>
              <View style={[styles.achievementIcon, { backgroundColor: a.earned ? a.color + '15' : Colors.surfaceAlt }]}>
                <MaterialCommunityIcons
                  name={a.icon}
                  size={24}
                  color={a.earned ? a.color : Colors.textTertiary}
                />
              </View>
              <Text style={[styles.achievementTitle, !a.earned && { color: Colors.textTertiary }]}>
                {a.title}
              </Text>
              {!a.earned && (
                <Feather name="lock" size={10} color={Colors.textTertiary} style={{ marginTop: 2 }} />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('common.performance') || 'Subject Performance'}</Text>
        <View style={styles.progressCard}>
          {SUBJECT_PROGRESS.map((s) => (
            <View key={s.name} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{s.name}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${s.score}%`, backgroundColor: s.color }]} />
              </View>
              <Text style={[styles.progressValue, { color: s.color }]}>{s.score}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.teacher') || 'Followed Teachers'}</Text>
        {TEACHERS.map((t) => (
          <View key={t.name} style={styles.teacherRow}>
            <View style={styles.teacherAvatar}>
              <Feather name="user" size={18} color={Colors.primary} />
            </View>
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{t.name}</Text>
              <Text style={styles.teacherMeta}>{t.subject} | {t.posts} posts</Text>
            </View>
            <Pressable style={styles.followingBtn}>
              <Text style={styles.followingText}>Following</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('common.settings')}</Text>
        <Pressable
          style={styles.settingsRow}
          onPress={() => navigation.navigate('settings')}
        >
          <Feather name="globe" size={18} color={Colors.textSecondary} />
          <Text style={styles.settingsLabel}>{t('settings.language')}</Text>
          <Text style={styles.settingsValue}>{t('settings.english')}</Text>
          <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
        </Pressable>
        {[
          { icon: 'bell' as const, label: 'Notifications', value: 'On' },
          { icon: 'shield' as const, label: 'Account', value: '' },
          { icon: 'help-circle' as const, label: 'Help & Support', value: '' },
        ].map((item) => (
          <Pressable key={item.label} style={styles.settingsRow}>
            <Feather name={item.icon} size={18} color={Colors.textSecondary} />
            <Text style={styles.settingsLabel}>{item.label}</Text>
            <Text style={styles.settingsValue}>{item.value}</Text>
            <Feather name="chevron-right" size={16} color={Colors.textTertiary} />
          </Pressable>
        ))}
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
    alignItems: 'center',
  },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.text },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.primary },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileName: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.text, marginTop: 12 },
  profileSchool: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  profileBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  profileBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginBottom: 12 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  achievementLocked: { opacity: 0.5 },
  achievementIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.text, textAlign: 'center' },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 14,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.text, width: 100 },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 4 },
  progressValue: { fontSize: 13, fontFamily: 'Inter_600SemiBold', width: 36, textAlign: 'right' },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherInfo: { flex: 1, marginLeft: 12 },
  teacherName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  teacherMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  followingBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followingText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  settingsLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.text, flex: 1 },
  settingsValue: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
