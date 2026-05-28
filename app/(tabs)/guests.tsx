import { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
  ActivityIndicator, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api, Guest } from '../../lib/api';
import { colors } from '../../constants/theme';

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  vvip:     { label: 'VVIP', color: '#f59e0b', bg: '#2a1a04' },
  vip:      { label: 'VIP', color: colors.accent, bg: colors.accent + '18' },
  standard: { label: 'Guest', color: colors.muted, bg: colors.surface2 },
};

function TierBadge({ tier }: { tier: string }) {
  const t = TIER_CONFIG[tier] ?? TIER_CONFIG.standard;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.badgeText, { color: t.color }]}>{t.label}</Text>
    </View>
  );
}

function GuestRow({ guest }: { guest: Guest }) {
  const initials = guest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tier = TIER_CONFIG[guest.tier] ?? TIER_CONFIG.standard;

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { borderColor: tier.color + '60' }]}>
        <Text style={[styles.avatarText, { color: tier.color }]}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.guestName}>{guest.name}</Text>
        <Text style={styles.guestEmail}>{guest.email}</Text>
      </View>
      <View style={styles.right}>
        <TierBadge tier={guest.tier} />
        <Text style={styles.visits}>{guest.totalVisits} visits</Text>
      </View>
    </View>
  );
}

export default function GuestsScreen() {
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['guests'],
    queryFn: api.getGuests,
  });

  const guests = (data ?? []).filter(g =>
    search.trim() === '' ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase())
  );

  const vvipCount = (data ?? []).filter(g => g.tier === 'vvip').length;
  const vipCount = (data ?? []).filter(g => g.tier === 'vip').length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Guests</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>{vvipCount} VVIP · {vipCount} VIP · {(data ?? []).length} total</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or email"
          placeholderTextColor={colors.subtle}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={guests}
          keyExtractor={g => g.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.accent} />}
          renderItem={({ item }) => <GuestRow guest={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>{search ? 'No guests match your search' : 'No guests yet'}</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '700', letterSpacing: -0.4 },
  stats: { marginTop: 4 },
  statText: { color: colors.muted, fontSize: 12 },
  searchWrap: { paddingHorizontal: 20, paddingBottom: 8 },
  search: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    color: colors.foreground, fontSize: 14,
  },
  list: { paddingVertical: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.surface2, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700' },
  guestName: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  guestEmail: { color: colors.muted, fontSize: 12, marginTop: 1 },
  right: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  visits: { color: colors.subtle, fontSize: 11 },
  separator: { height: 1, backgroundColor: colors.border + '60', marginHorizontal: 20 },
  empty: { textAlign: 'center', color: colors.subtle, marginTop: 60, fontSize: 14 },
});
