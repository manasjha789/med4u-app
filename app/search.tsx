import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, DoctorCard, SectionHeader } from "@/components/ui/premium";

const recent = ["Orthopedic doctor", "Dolo 650", "Blood test", "Cardiologist"];
const medicines = ["Dolo 650", "Vitamin D3", "ORS Sachet"];

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.dark} /></TouchableOpacity>
          <View style={styles.searchBox}><Ionicons name="search-outline" size={20} color="#94A3B8" /><TextInput autoFocus placeholder="Search doctors, medicines, hospitals" placeholderTextColor="#94A3B8" style={styles.input} /></View>
        </View>
        <SectionHeader title="Recent Searches" />
        <View style={styles.chips}>{recent.map((item) => <Text key={item} style={styles.chip}>{item}</Text>)}</View>
        <SectionHeader title="Trending Doctors" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DoctorCard name="Dr. Abhi" speciality="Orthopedic Consultation" onPress={() => router.push("/doctorDetails" as never)} />
          <DoctorCard name="Dr. Sarah Jenkins" speciality="Cardiologist" onPress={() => router.push("/doctorDetails" as never)} />
        </ScrollView>
        <SectionHeader title="Popular Medicines" />
        {medicines.map((item) => (
          <TouchableOpacity key={item} style={styles.result} onPress={() => router.push("/medicineCart" as never)}>
            <Ionicons name="medical-outline" size={24} color={colors.primary} />
            <Text style={styles.resultText}>{item}</Text>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  back: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white },
  searchBox: { flex: 1, height: 56, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, marginLeft: 10, color: colors.dark, fontSize: 15, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { overflow: "hidden", color: colors.grey, fontSize: 13, fontWeight: "900", backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 15, paddingVertical: 11 },
  result: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 12 },
  resultText: { flex: 1, color: colors.dark, fontSize: 16, fontWeight: "900", marginLeft: 12 },
});
