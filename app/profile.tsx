import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UserAvatar } from "@/components/UserAvatar";
import { useApp, UserProfile } from "@/context/AppContext";
import { colors, PrimaryButton } from "@/components/ui/premium";

const fields: { label: string; key: keyof UserProfile; keyboard?: "default" | "number-pad" | "phone-pad" }[] = [
  { label: "Full Name", key: "name" },
  { label: "Age", key: "age", keyboard: "number-pad" },
  { label: "Gender", key: "gender" },
  { label: "Height", key: "height", keyboard: "number-pad" },
  { label: "Weight", key: "weight", keyboard: "number-pad" },
  { label: "Blood Group", key: "bloodGroup" },
  { label: "Existing Conditions", key: "conditions" },
  { label: "Allergies", key: "allergies" },
  { label: "Current Medicines", key: "medicines" },
  { label: "Emergency Contact", key: "emergencyContact", keyboard: "phone-pad" },
  { label: "Address", key: "address" },
  { label: "City", key: "city" },
];

export default function CreateProfileScreen() {
  const { profile, updateProfile } = useApp();
  const [values, setValues] = useState<UserProfile>(profile);
  const avatarUri = values.photo || values.image;
  const completion = useMemo(() => {
    const filled = fields.filter((field) => values[field.key]?.trim()).length;
    return Math.max(12, Math.round((filled / fields.length) * 100));
  }, [values]);

  const setValue = (field: keyof UserProfile, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = () => {
    updateProfile(values);
    router.replace({
      pathname: "/(tabs)/homeScreen",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <UserAvatar imageUri={avatarUri} />
          <Text style={styles.title}>Create Profile</Text>
          <Text style={styles.subtitle}>Complete your health profile for faster, safer care.</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressTitle}>Profile strength</Text>
            <Text style={styles.progressValue}>{completion}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </View>

        <View style={styles.card}>
          {fields.map((field, index) => (
            <View key={field.key} style={styles.inputWrap}>
              <Text style={styles.label}>
                {index + 1}. {field.label}
              </Text>
              <TextInput
                placeholder={field.label}
                placeholderTextColor="#94A3B8"
                value={values[field.key] ?? ""}
                onChangeText={(value) => setValue(field.key, value)}
                keyboardType={field.keyboard || "default"}
                style={styles.input}
              />
            </View>
          ))}
          <PrimaryButton title="Save & Continue" onPress={saveProfile} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: 22 },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900", marginTop: 14 },
  subtitle: { color: colors.grey, fontSize: 15, fontWeight: "600", textAlign: "center", marginTop: 6 },
  progressCard: { backgroundColor: colors.white, borderRadius: 22, padding: 18, marginBottom: 16 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  progressTitle: { color: colors.dark, fontSize: 16, fontWeight: "900" },
  progressValue: { color: colors.primary, fontSize: 16, fontWeight: "900" },
  progressTrack: { height: 8, borderRadius: 99, backgroundColor: "#DCEBFF" },
  progressFill: { height: "100%", borderRadius: 99, backgroundColor: colors.primary },
  card: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 20,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  inputWrap: { marginBottom: 14 },
  label: { color: colors.dark, fontSize: 13, fontWeight: "900", marginBottom: 8 },
  input: {
    height: 54,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 15,
    color: colors.dark,
    fontSize: 15,
    fontWeight: "700",
  },
});
