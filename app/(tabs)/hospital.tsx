import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PageHeader, SectionHeader, ServiceCard } from "@/components/ui/premium";

const services = [
  ["Book Lab Test", "CBC, Thyroid, Diabetes packages", "flask-outline", "/reports"],
  ["Home Sample Collection", "Certified phlebotomist at home", "home-outline", "/reports"],
  ["Scan Center", "X-Ray, MRI, CT appointments", "scan-outline", "/reports"],
  ["Ambulance", "Emergency transport support", "car-outline", "/videoCall"],
  ["Blood Bank", "Find nearby availability", "water-outline", "/search"],
  ["Insurance Support", "Cashless and claims help", "shield-checkmark-outline", "/search"],
] as const;

export default function HospitalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Hospital" subtitle="Clinics, diagnostics, reports and emergency support." />
        <View style={styles.mapCard}>
          <View>
            <Text style={styles.mapTitle}>Nearby Clinics</Text>
            <Text style={styles.mapText}>12 verified clinics within 5 km</Text>
          </View>
          <Ionicons name="map-outline" size={42} color={colors.primary} />
        </View>

        <SectionHeader title="Hospitals List" />
        {["Med4U Prime Clinic", "City Heart Center"].map((item) => (
          <TouchableOpacity key={item} style={styles.clinicCard} activeOpacity={0.86} onPress={() => router.push("/bookDoctor")}>
            <View style={styles.clinicIcon}><Ionicons name="business" size={26} color={colors.primary} /></View>
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{item}</Text>
              <Text style={styles.clinicMeta}>Open now  -  4.8 rating  -  2.1 km</Text>
            </View>
          </TouchableOpacity>
        ))}

        <SectionHeader title="Services" />
        <View style={styles.serviceList}>
          {services.map(([title, subtitle, icon, route]) => (
            <ServiceCard key={title} title={title} subtitle={subtitle} icon={icon} onPress={() => router.push(route)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 126 },
  mapCard: { minHeight: 156, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.white, borderRadius: 30, padding: 22 },
  mapTitle: { color: colors.dark, fontSize: 24, fontWeight: "900" },
  mapText: { color: colors.grey, fontSize: 14, fontWeight: "700", marginTop: 7 },
  clinicCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 22, padding: 16, marginBottom: 12 },
  clinicIcon: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.background },
  clinicInfo: { flex: 1, marginLeft: 14 },
  clinicName: { color: colors.dark, fontSize: 17, fontWeight: "900" },
  clinicMeta: { color: colors.grey, fontSize: 13, fontWeight: "700", marginTop: 4 },
  serviceList: { gap: 13 },
});
