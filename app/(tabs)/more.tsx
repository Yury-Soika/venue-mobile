import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

type MenuRowProps = { label: string; value?: string; onPress?: () => void; danger?: boolean };

function MenuRow({ label, value, onPress, danger }: MenuRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && !danger && <Text style={styles.rowChevron}>›</Text>}
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const { user, logout } = useAuthContext();

  function handleLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'VN';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.name}>{user?.name ?? 'Staff'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.group}>
          <MenuRow label="Name" value={user?.name} />
          <MenuRow label="Email" value={user?.email} />
          <MenuRow label="Role" value={user?.role} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.group}>
          <MenuRow label="Version" value="1.0.0" />
          <MenuRow label="Connected to" value="Venue API" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.group}>
          <MenuRow label="Sign out" onPress={handleLogout} danger />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '700', letterSpacing: -0.4 },
  profile: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    marginBottom: 8,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accent + '30', borderWidth: 1.5, borderColor: colors.accent + '60',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  name: { color: colors.foreground, fontSize: 16, fontWeight: '600' },
  email: { color: colors.muted, fontSize: 13, marginTop: 1 },
  roleBadge: {
    marginTop: 5, alignSelf: 'flex-start',
    backgroundColor: colors.accent + '18', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  roleText: { color: colors.accent, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  section: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  sectionLabel: {
    color: colors.subtle, fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6,
  },
  group: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.foreground, fontSize: 14 },
  rowLabelDanger: { color: colors.danger },
  rowValue: { color: colors.muted, fontSize: 14 },
  rowChevron: { color: colors.subtle, fontSize: 18, marginLeft: 4 },
});
