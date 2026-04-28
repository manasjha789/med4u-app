import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PageHeader, SectionHeader } from "@/components/ui/premium";

const today = [
  ["Appointment in 30 mins", "Join Dr. Abhi's video call at 10:30 AM", "calendar-outline"],
  ["Doctor replied", "Dr. Sarah sent follow-up advice", "chatbubble-ellipses-outline"],
] as const;
const earlier = [
  ["Order delivered", "Your medicine order was delivered", "bicycle-outline"],
  ["Report ready", "CBC report is ready for download", "document-text-outline"],
] as const;

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
        <PageHeader title="Notifications" subtitle="Important health updates in one place." />
        <Group title="Today" items={today} />
        <Group title="Earlier" items={earlier} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ title, items }: { title: string; items: readonly (readonly [string, string, string])[] }) {
  return (
    <>
      <SectionHeader title={title} />
      {items.map(([name, text, icon]) => (
        <View key={name} style={styles.item}>
          <View style={styles.icon}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} /></View>
          <View style={styles.info}><Text style={styles.itemTitle}>{name}</Text><Text style={styles.itemText}>{text}</Text></View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  item: { flexDirection: "row", backgroundColor: colors.white, borderRadius: 24, padding: 16, marginBottom: 12 },
  icon: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.background },
  info: { flex: 1, marginLeft: 14 },
  itemTitle: { color: colors.dark, fontSize: 16, fontWeight: "900" },
  itemText: { color: colors.grey, fontSize: 14, fontWeight: "700", lineHeight: 20, marginTop: 4 },
});
