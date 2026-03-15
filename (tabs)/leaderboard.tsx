import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

import Colors from '@/constants/colors';

const TABS = ['leaderboard.school', 'leaderboard.national', 'leaderboard.subject'] as const;

const SCHOOL_LEADERS = [
  { rank: 1, name: 'Sarah binti Ahmad', xp: 8420, streak: 14, avatar: 'S' },
  { rank: 2, name: 'Aiman bin Razak', xp: 7910, streak: 10, avatar: 'A' },
  { rank: 3, name: 'Daniel Lee', xp: 7300, streak: 8, avatar: 'D' },
  { rank: 4, name: 'Nurul Izzah', xp: 6850, streak: 12, avatar: 'N' },
  { rank: 5, name: 'Muhammad Haziq', xp: 6400, streak: 5, avatar: 'M' },
  { rank: 6, name: 'Tan Wei Ming', xp: 5920, streak: 7, avatar: 'T' },
  { rank: 7, name: 'Priya a/p Kumar', xp: 5610, streak: 4, avatar: 'P' },
  { rank: 8, name: 'Hafiz bin Ali', xp: 5200, streak: 6, avatar: 'H' },
];

const SCHOOL_RANKING = [
  { rank: 1, name: 'SMK Taman Melawati', students: 142, avgXp: 5420 },
  { rank: 2, name: 'SMK Sri Aman', students: 98, avgXp: 4890 },
  { rank: 3, name: 'MRSM Langkawi', students: 76, avgXp: 4620 },
];

function TopThree({ leaders }: { leaders: typeof SCHOOL_LEADERS }) {
  const top3 = leaders.slice(0, 3);
  const order = [top3[1], top3[0], top3[2]];
  const heights = [100, 130, 80];
  const medalColors = [Colors.silver, Colors.gold, Colors.bronze];

  return (
    <View style={styles.podiumContainer}>
      {order.map((person, idx) => {
        if (!person) return null;
        const rankIdx = idx === 1 ? 0 : idx === 0 ? 1 : 2;
        return (
          <View key={person.rank} style={[styles.podiumItem, { marginTop: idx === 1 ? 0 : 24 }]}>
            <View style={[styles.podiumAvatar, { borderColor: medalColors[rankIdx] }]}>
              <Text style={styles.podiumAvatarText}>{person.avatar}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{person.name.split(' ')[0]}</Text>
            <Text style={styles.podiumXp}>{person.xp.toLocaleString()} XP</Text>
            <View style={[styles.podiumBar, { height: heights[idx], backgroundColor: medalColors[rankIdx] + '30' }]}>
              <Text style={[styles.podiumRank, { color: medalColors[rankIdx] }]}>#{person.rank}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('leaderboard.school');
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: webTopPadding }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('navigation.leaderboard')}</Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{t(tab)}</Text>
          </Pressable>
        ))}
      </View>

      <TopThree leaders={SCHOOL_LEADERS} />

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>{t('leaderboard.fullRankings')}</Text>
        {SCHOOL_LEADERS.map((person, idx) => (
          <View key={person.rank} style={styles.rankRow}>
            <Text style={styles.rankNum}>{person.rank}</Text>
            <View style={[styles.rankAvatar, { backgroundColor: idx < 3 ? [Colors.gold, Colors.silver, Colors.bronze][idx] + '20' : Colors.surfaceAlt }]}>
              <Text style={[styles.rankAvatarText, { color: idx < 3 ? [Colors.gold, Colors.textSecondary, Colors.bronze][idx] : Colors.textSecondary }]}>
                {person.avatar}
              </Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{person.name}</Text>
              <View style={styles.rankMeta}>
                <MaterialCommunityIcons name="fire" size={12} color={Colors.streak} />
                <Text style={styles.rankStreak}>{t('leaderboard.dayStreak', { count: person.streak })}</Text>
              </View>
            </View>
            <Text style={styles.rankXp}>{person.xp.toLocaleString()}</Text>
            <Text style={styles.rankXpLabel}>XP</Text>
          </View>
        ))}
      </View>

      <View style={styles.schoolSection}>
        <Text style={styles.listTitle}>{t('leaderboard.schoolVsSchool')}</Text>
        {SCHOOL_RANKING.map((school) => (
          <View key={school.rank} style={styles.schoolRow}>
            <Text style={styles.schoolRank}>#{school.rank}</Text>
            <View style={styles.schoolInfo}>
              <Text style={styles.schoolName}>{school.name}</Text>
              <Text style={styles.schoolMeta}>{t('leaderboard.schoolMeta', { students: school.students, avgXp: school.avgXp.toLocaleString() })}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.text },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: Colors.surface },
  tabText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  podiumAvatarText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.primary },
  podiumName: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginTop: 6 },
  podiumXp: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, marginTop: 2 },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  podiumRank: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  listSection: { marginTop: 32, paddingHorizontal: 20 },
  listTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginBottom: 12 },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rankNum: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.textTertiary, width: 24, textAlign: 'center' },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  rankAvatarText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  rankInfo: { flex: 1, marginLeft: 12 },
  rankName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  rankMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  rankStreak: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textTertiary },
  rankXp: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary },
  rankXpLabel: { fontSize: 10, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, marginLeft: 2 },
  schoolSection: { marginTop: 28, paddingHorizontal: 20 },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  schoolRank: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary, width: 36, textAlign: 'center' },
  schoolInfo: { flex: 1, marginLeft: 8 },
  schoolName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  schoolMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
});
