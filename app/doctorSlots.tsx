import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PrimaryButton } from "@/components/ui/premium";

const morning = ["09:00 AM", "10:30 AM", "11:30 AM"];
const evening = ["05:00 PM", "06:30 PM", "07:30 PM"];

export default function DoctorSlotsScreen() {
  const [slot, setSlot] = useState("10:30 AM");
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}><Ionicons name="checkmark" size={54} color={colors.white} /></View>
          <Text style={styles.successTitle}>Appointment booked</Text>
          <Text style={styles.successText}>Dr. Abhi is scheduled for Wed 7 Sep at {slot}.</Text>
          <PrimaryButton title="Go to Home" onPress={() => router.replace("/(tabs)/homeScreen")} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
        <Text style={styles.title}>Choose Slot</Text>
        <Text style={styles.subtitle}>Select a convenient time for your consultation.</Text>
        <SlotGroup title="Morning" slots={morning} selected={slot} onSelect={setSlot} />
        <SlotGroup title="Evening" slots={evening} selected={slot} onSelect={setSlot} />
        <View style={styles.summary}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={styles.summaryText}>Wed 7 Sep at {slot}</Text>
        </View>
        <PrimaryButton title="Confirm Booking" onPress={() => setBooked(true)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SlotGroup({ title, slots, selected, onSelect }: { title: string; slots: string[]; selected: string; onSelect: (slot: string) => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.slotWrap}>
        {slots.map((item) => (
          <TouchableOpacity key={item} style={[styles.slot, selected === item && styles.activeSlot]} onPress={() => onSelect(item)}>
            <Text style={[styles.slotText, selected === item && styles.activeSlotText]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "700", marginTop: 6, marginBottom: 20 },
  card: { backgroundColor: colors.white, borderRadius: 26, padding: 18, marginBottom: 16 },
  sectionTitle: { color: colors.dark, fontSize: 20, fontWeight: "900", marginBottom: 14 },
  slotWrap: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  slot: { paddingHorizontal: 16, paddingVertical: 13, borderRadius: 16, backgroundColor: colors.background },
  activeSlot: { backgroundColor: colors.primary },
  slotText: { color: colors.grey, fontWeight: "900" },
  activeSlotText: { color: colors.white },
  summary: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 22, padding: 18, marginBottom: 20 },
  summaryText: { color: colors.dark, fontSize: 16, fontWeight: "900", marginLeft: 12 },
  successWrap: { flex: 1, justifyContent: "center", padding: 24 },
  successIcon: { alignSelf: "center", width: 110, height: 110, alignItems: "center", justifyContent: "center", borderRadius: 38, backgroundColor: colors.success },
  successTitle: { color: colors.dark, fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 22 },
  successText: { color: colors.grey, fontSize: 16, fontWeight: "700", textAlign: "center", lineHeight: 23, marginTop: 8, marginBottom: 26 },
});
