import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api, Event } from '../../lib/api';
import { colors } from '../../constants/theme';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  live:      { label: 'Live', color: colors.success, bg: '#0f2318' },
  upcoming:  { label: 'Upcoming', color: colors.accent, bg: colors.accent + '18' },
  completed: { label: 'Completed', color: colors.muted, bg: colors.surface2 },
  cancelled: { label: 'Cancelled', color: colors.danger, bg: '#1f0f10' },
};

function EventCard({ event }: { event: Event }) {
  const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.upcoming;
  const pct = event.ticketsTotal > 0 ? event.ticketsSold / event.ticketsTotal : 0;
  const soldOut = pct >= 1;

  return (
    <View style={[styles.card, event.status === 'live' && styles.cardLive]}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventName}>{event.name}</Text>
          {event.genre && <Text style={styles.genre}>{event.genre}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          {event.status === 'live' && <View style={styles.livePulse} />}
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.meta}>{event.date} · {event.time}</Text>

      <View style={styles.ticketRow}>
        <Text style={styles.ticketCount}>
          {event.ticketsSold}/{event.ticketsTotal} tickets
          {soldOut && <Text style={styles.soldOut}> · Sold out</Text>}
        </Text>
        <Text style={styles.ticketPct}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, pct * 100)}%` as any },
            soldOut && { backgroundColor: colors.success },
            event.status === 'live' && { backgroundColor: colors.success },
          ]}
        />
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const events = data ?? [];
  const live = events.filter(e => e.status === 'live');
  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'completed' || e.status === 'cancelled');

  type Section = { title: string; data: Event[] };
  const sections: Section[] = [
    ...(live.length ? [{ title: 'Live now', data: live }] : []),
    ...(upcoming.length ? [{ title: 'Upcoming', data: upcoming }] : []),
    ...(past.length ? [{ title: 'Past', data: past }] : []),
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={s => s.title}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.accent} />}
          renderItem={({ item: section }) => (
            <View>
              <Text style={styles.sectionLabel}>{section.title}</Text>
              {section.data.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No events found</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '700', letterSpacing: -0.4 },
  list: { padding: 20, paddingTop: 8 },
  sectionLabel: {
    color: colors.muted, fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, marginTop: 12,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10,
  },
  cardLive: { borderColor: colors.success + '50' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  eventName: { color: colors.foreground, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  genre: { color: colors.muted, fontSize: 12, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  meta: { color: colors.muted, fontSize: 13, marginBottom: 12 },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  ticketCount: { color: colors.muted, fontSize: 12 },
  soldOut: { color: colors.success },
  ticketPct: { color: colors.muted, fontSize: 12 },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  empty: { textAlign: 'center', color: colors.subtle, marginTop: 60, fontSize: 14 },
});
