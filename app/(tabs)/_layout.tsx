import { Tabs } from 'expo-router';
import { View, StyleSheet, ColorValue } from 'react-native';
import { colors } from '../../constants/theme';

type TabIconProps = { focused: boolean; color: ColorValue };

function CalendarIcon({ focused, color }: TabIconProps) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      {/* Calendar */}
      <View style={{ width: 16, height: 16, borderWidth: 1.5, borderColor: color, borderRadius: 3 }}>
        <View style={{ position: 'absolute', top: 2, left: 2, right: 2, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
}

function HomeIcon({ focused, color }: TabIconProps) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <View style={{ width: 16, height: 14, borderWidth: 1.5, borderColor: color, borderRadius: 3, marginTop: 2 }} />
      <View style={{ position: 'absolute', top: 0, width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    </View>
  );
}

function SparkleIcon({ focused, color }: TabIconProps) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 2, alignSelf: 'center' }} />
      <View style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: color }} />
    </View>
  );
}

function UsersIcon({ focused, color }: TabIconProps) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: color, alignSelf: 'center' }} />
      <View style={{ width: 16, height: 7, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, marginTop: 1 }} />
    </View>
  );
}

function MoreIcon({ focused, color }: TabIconProps) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, marginHorizontal: 1.5, alignSelf: 'center' }} />
      ))}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tonight',
          tabBarIcon: (props) => <HomeIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: (props) => <CalendarIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: (props) => <SparkleIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="guests"
        options={{
          title: 'Guests',
          tabBarIcon: (props) => <UsersIcon {...props} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: (props) => <MoreIcon {...props} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconActive: {},
});
