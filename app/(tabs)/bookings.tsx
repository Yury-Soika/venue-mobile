import { useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { api, Booking } from '../../lib/api';
import { colors } from '../../constants/theme';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#2a1f0a', text: colors.warning, label: 'Pending' },
  confirmed: { bg: '#0f2318', text: colors.success, label: 'Confirmed' },
  cancelled: { bg: '#1f0f10', text: colors.danger,  label: 'Cancelled' },
  completed: { bg: colors.surface2, text: colors.muted, label: 'Completed' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.completed;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

function BookingCard({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <Text style={styles.guestName}>{booking.guestName}</Text>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={styles.cardMeta}>
        {booking.table.name} · Party of {booking.partySize}
      </Text>
      <Text style={styles.cardTime}>{booking.time}</Text>
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const today = new Date().toISOString().split('T')[0];
  const [filter, setFilter] = useState<'today' | 'all'>('today');
  const [selected, setSelected] = useState<Booking | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bookings', filter === 'today' ? today : undefined],
    queryFn: () => api.getBookings(filter === 'today' ? today : undefined),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateBookingStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      sheetRef.current?.close();
    },
  });

  function openSheet(booking: Booking) {
    setSelected(booking);
    sheetRef.current?.expand();
  }

  const bookings = data ?? [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <View style={styles.filters}>
          {(['today', 'all'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'today' ? 'Today' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={b => b.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.accent} />}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={() => openSheet(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No bookings{filter === 'today' ? ' for today' : ''}</Text>
          }
        />
      )}

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['50%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView style={styles.sheet}>
          {selected && (
            <>
              <Text style={styles.sheetName}>{selected.guestName}</Text>
              <Text style={styles.sheetEmail}>{selected.guestEmail}</Text>

              <View style={styles.sheetDetails}>
                {[
                  { label: 'Table', value: selected.table.name },
                  { label: 'Time', value: selected.time },
                  { label: 'Party', value: `${selected.partySize} guests` },
                  { label: 'Status', value: STATUS_STYLES[selected.status]?.label ?? selected.status },
                ].map(({ label, value }) => (
                  <View key={label} style={styles.sheetRow}>
                    <Text style={styles.sheetLabel}>{label}</Text>
                    <Text style={styles.sheetValue}>{value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.sheetActions}>
                {selected.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.confirmBtn]}
                    onPress={() => statusMutation.mutate({ id: selected.id, status: 'confirmed' })}
                    disabled={statusMutation.isPending}
                  >
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                  </TouchableOpacity>
                )}
                {(selected.status === 'pending' || selected.status === 'confirmed') && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelBtn]}
                    onPress={() => statusMutation.mutate({ id: selected.id, status: 'cancelled' })}
                    disabled={statusMutation.isPending}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '700', letterSpacing: -0.4, marginBottom: 14 },
  filters: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.accent + '20', borderColor: colors.accent },
  filterText: { color: colors.muted, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: colors.accent },
  list: { padding: 20, gap: 10, paddingTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  guestName: { color: colors.foreground, fontSize: 15, fontWeight: '600' },
  cardMeta: { color: colors.muted, fontSize: 13 },
  cardTime: { color: colors.subtle, fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  empty: { textAlign: 'center', color: colors.subtle, marginTop: 60, fontSize: 14 },
  sheet: { flex: 1, padding: 24 },
  sheetName: { color: colors.foreground, fontSize: 20, fontWeight: '700' },
  sheetEmail: { color: colors.muted, fontSize: 13, marginTop: 2, marginBottom: 20 },
  sheetDetails: { gap: 0, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetLabel: { color: colors.muted, fontSize: 13 },
  sheetValue: { color: colors.foreground, fontSize: 13, fontWeight: '500' },
  sheetActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmBtn: { backgroundColor: colors.success + '20', borderWidth: 1, borderColor: colors.success + '60' },
  confirmBtnText: { color: colors.success, fontSize: 14, fontWeight: '600' },
  cancelBtn: { backgroundColor: colors.danger + '15', borderWidth: 1, borderColor: colors.danger + '50' },
  cancelBtnText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
});
