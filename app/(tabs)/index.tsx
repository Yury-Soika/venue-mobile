import { useQuery } from '@tanstack/react-query';
import { ScrollView, View, Text, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/api';
import { useAuthContext } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

function LiveDot() {
  return (
    <View style={styles.liveChip}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>Live</Text>
    </View>
  );
}

export default function TonightScreen() {
  const { user } = useAuthContext();
  const today = new Date().toISOString().split('T')[0];

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: api.getAnalyticsSummary,
  });

  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ['bookings', today],
    queryFn: () => api.getBookings(today),
  });

  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const isLoading = summaryLoading || bookingsLoading;
  const refetch = () => { refetchSummary(); refetchBookings(); refetchEvents(); };

  const todayBookings = bookings ?? [];
  const confirmedCount = todayBookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = todayBookings.filter(b => b.status === 'pending').length;
  const liveEvents = (events ?? []).filter(e => e.status === 'live');
  const tonightEvents = (events ?? []).filter(e => e.date === today);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.accent} />
        }
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.date}>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <LiveDot />
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                label="Bookings today"
                value={String(todayBookings.length)}
                sub={pendingCount > 0 ? `${pendingCount} pending` : undefined}
                accent
              />
              <StatCard
                label="Confirmed"
                value={String(confirmedCount)}
              />
              <StatCard
                label="Events tonight"
                value={String(tonightEvents.length)}
                sub={liveEvents.length > 0 ? `${liveEvents.length} live now` : undefined}
              />
              <StatCard
                label="Revenue today"
                value={summary ? `$${Number(summary.todayRevenue).toLocaleString()}` : '—'}
              />
            </View>

            {pendingCount > 0 && (
              <View style={styles.alertBanner}>
                <View style={styles.alertDot} />
                <Text style={styles.alertText}>
                  {pendingCount} booking{pendingCount > 1 ? 's' : ''} awaiting confirmation
                </Text>
              </View>
            )}

            {liveEvents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Live now</Text>
                {liveEvents.map(event => (
                  <View key={event.id} style={styles.eventRow}>
                    <View style={styles.liveEventDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventMeta}>
                        {event.ticketsSold}/{event.ticketsTotal} tickets
                      </Text>
                    </View>
                    <View style={[styles.progressBar]}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.min(100, (event.ticketsSold / event.ticketsTotal) * 100)}%` as any }
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {tonightEvents.filter(e => e.status !== 'live').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tonight</Text>
                {tonightEvents.filter(e => e.status !== 'live').map(event => (
                  <View key={event.id} style={styles.eventRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventMeta}>{event.time} · {event.ticketsSold}/{event.ticketsTotal} tickets</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 32 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  greeting: { color: colors.foreground, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  date: { color: colors.muted, fontSize: 13, marginTop: 2 },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#16231a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveText: { color: colors.success, fontSize: 11, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: colors.surface,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border,
  },
  statCardAccent: { borderColor: colors.accent + '50', backgroundColor: colors.accent + '12' },
  statValue: { color: colors.foreground, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  statValueAccent: { color: colors.accent },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },
  statLabelAccent: { color: colors.accent + 'cc' },
  statSub: { color: colors.warning, fontSize: 11, marginTop: 4 },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#2a1f0a', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: colors.warning + '40', marginBottom: 16,
  },
  alertDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  alertText: { color: colors.warning, fontSize: 13, fontWeight: '500', flex: 1 },
  section: { marginTop: 8, marginBottom: 8 },
  sectionLabel: {
    color: colors.muted, fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10,
  },
  eventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  liveEventDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  eventName: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  eventMeta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  progressBar: { width: 60, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.success, borderRadius: 2 },
});
