import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, PrimaryButton, SectionHeader } from "@/components/ui/premium";

const image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80";

export default function DoctorDetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <View style={styles.card}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.name}>Dr. Abhi</Text>
          <Text style={styles.speciality}>Orthopedic Consultation</Text>
          <View style={styles.stats}>
            {["12 yrs", "4.9", "Rs.499"].map((item) => (
              <View key={item} style={styles.stat}><Text style={styles.statText}>{item}</Text></View>
            ))}
          </View>
        </View>
        <SectionHeader title="About Doctor" />
        <Text style={styles.about}>Senior orthopedic consultant specializing in joint pain, sports injuries and mobility recovery plans.</Text>
        <SectionHeader title="Experience" />
        <View style={styles.info}><Ionicons name="medal-outline" size={24} color={colors.primary} /><Text style={styles.infoText}>12 years at premium multi-speciality hospitals</Text></View>
        <PrimaryButton title="Book Now" onPress={() => router.push("/doctorSlots")} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  card: { alignItems: "center", backgroundColor: colors.white, borderRadius: 30, padding: 22 },
  image: { width: 118, height: 118, borderRadius: 36 },
  name: { color: colors.dark, fontSize: 28, fontWeight: "900", marginTop: 16 },
  speciality: { color: colors.grey, fontSize: 15, fontWeight: "700", marginTop: 5 },
  stats: { flexDirection: "row", gap: 10, marginTop: 18 },
  stat: { backgroundColor: colors.background, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 11 },
  statText: { color: colors.primary, fontWeight: "900" },
  about: { color: colors.grey, fontSize: 15, fontWeight: "700", lineHeight: 23, marginBottom: 18 },
  info: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderRadius: 22, padding: 18, marginBottom: 22 },
  infoText: { flex: 1, color: colors.dark, fontSize: 15, fontWeight: "800", lineHeight: 21 },
});
