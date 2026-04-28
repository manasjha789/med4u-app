import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, DoctorCard, PageHeader, PrimaryButton, SectionHeader } from "@/components/ui/premium";

const image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=80";
const chips = ["General", "Cardio", "Ortho", "Neuro", "Dental", "Skin", "Pulmo"];

export default function BookDoctorScreen() {
  const params = useLocalSearchParams<{ specialization?: string }>();
  const selected = params.specialization || "Ortho";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Back />
        <PageHeader title="Book Doctor" subtitle="Choose a verified specialist for your concern." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {chips.map((chip) => (
            <TouchableOpacity key={chip} style={[styles.chip, chip === selected && styles.activeChip]} activeOpacity={0.85}>
              <Text style={[styles.chipText, chip === selected && styles.activeChipText]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title="Recommended doctors" />
        <DoctorCard name="Dr. Abhi" speciality="Orthopedic Consultation" onPress={() => router.push("/doctorDetails" as never)} image={<Image source={{ uri: image }} style={styles.avatar} />} />
        <DoctorCard name="Dr. Sarah Jenkins" speciality="Cardiologist" onPress={() => router.push("/doctorDetails" as never)} />
        <DoctorCard name="Dr. Meera Shah" speciality="Neurologist" onPress={() => router.push("/doctorDetails" as never)} />

        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Need help choosing?</Text>
          <Text style={styles.bottomText}>Answer a few questions and Med4U will suggest the right care path.</Text>
          <PrimaryButton title="Use AI Symptom Checker" onPress={() => router.push("/search")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Back() {
  return (
    <TouchableOpacity style={styles.back} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color={colors.dark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 34 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.white, marginBottom: 18 },
  chips: { gap: 10, paddingBottom: 6 },
  chip: { paddingHorizontal: 17, paddingVertical: 12, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.grey, fontWeight: "900" },
  activeChipText: { color: colors.white },
  avatar: { width: 58, height: 58, borderRadius: 18 },
  bottomCard: { gap: 12, backgroundColor: colors.white, borderRadius: 26, padding: 18, marginTop: 18 },
  bottomTitle: { color: colors.dark, fontSize: 20, fontWeight: "900" },
  bottomText: { color: colors.grey, fontSize: 14, fontWeight: "700", lineHeight: 20 },
});
