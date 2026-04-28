import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BrandLogo } from "@/components/BrandLogo";
import { useApp } from "@/context/AppContext";
import { colors, PrimaryButton } from "@/components/ui/premium";

const badges = [
  { label: "24/7 Doctors", icon: "medical-outline" as const },
  { label: "20 Min Delivery", icon: "bicycle-outline" as const },
  { label: "Home Lab Test", icon: "flask-outline" as const },
];

export default function LoginScreen() {
  const { updateProfile } = useApp();
  const [mobile, setMobile] = useState("");
  const [referralOpen, setReferralOpen] = useState(false);
  const [referral, setReferral] = useState("");
  const [accepted, setAccepted] = useState(true);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (mobile.trim().length !== 10) {
      setError("Enter a valid 10 digit mobile number.");
      return;
    }
    if (!accepted) {
      setError("Please accept Terms and Privacy Policy to continue.");
      return;
    }
    updateProfile({ phone: `+91 ${mobile.trim()}` });
    router.push("/otp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <BrandLogo />
          <Text style={styles.loginCopy}>Premium care that feels personal, fast, and reliable.</Text>
        </View>

        <View style={styles.badgeRow}>
          {badges.map((badge) => (
            <View key={badge.label} style={styles.badge}>
              <Ionicons name={badge.icon} size={18} color={colors.primary} />
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Login with mobile</Text>
          <Text style={styles.subHeading}>We will send a secure OTP for verification.</Text>

          <View style={styles.phoneRow}>
            <TouchableOpacity style={styles.countryPicker} activeOpacity={0.8}>
              <Text style={styles.countryText}>+91</Text>
              <Ionicons name="chevron-down" size={16} color={colors.grey} />
            </TouchableOpacity>
            <TextInput
              placeholder="Mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={(value) => {
                setMobile(value.replace(/\D/g, ""));
                setError("");
              }}
              style={styles.mobileInput}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.referralToggle}
            activeOpacity={0.8}
            onPress={() => setReferralOpen((value) => !value)}
          >
            <Ionicons name="gift-outline" size={20} color={colors.warning} />
            <Text style={styles.referralTitle}>Have a referral code?</Text>
            <Ionicons name={referralOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.grey} />
          </TouchableOpacity>

          {referralOpen ? (
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Referral code"
                placeholderTextColor="#94A3B8"
                value={referral}
                onChangeText={setReferral}
                style={styles.input}
              />
            </View>
          ) : null}

          <TouchableOpacity style={styles.termsRow} activeOpacity={0.8} onPress={() => setAccepted(!accepted)}>
            <Ionicons
              name={accepted ? "checkbox" : "square-outline"}
              size={22}
              color={accepted ? colors.primary : colors.grey}
            />
            <Text style={styles.termsText}>I agree to Terms, Privacy Policy and health updates.</Text>
          </TouchableOpacity>

          <PrimaryButton title="Continue" onPress={handleContinue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 28 },
  hero: { alignItems: "center" },
  loginCopy: {
    color: colors.grey,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 280,
  },
  badgeRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  badge: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  badgeText: { color: colors.dark, fontSize: 11, fontWeight: "800", marginTop: 7, textAlign: "center" },
  card: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 22,
    marginTop: 22,
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 5,
  },
  heading: { color: colors.dark, fontSize: 23, fontWeight: "900" },
  subHeading: { color: colors.grey, fontSize: 14, lineHeight: 20, marginTop: 7, marginBottom: 20 },
  phoneRow: { flexDirection: "row", gap: 10 },
  countryPicker: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
  },
  countryText: { color: colors.dark, fontSize: 16, fontWeight: "900" },
  mobileInput: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    color: colors.dark,
    fontSize: 16,
    fontWeight: "700",
  },
  error: { color: colors.danger, fontSize: 13, fontWeight: "700", marginTop: 10 },
  referralToggle: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 18, marginBottom: 12 },
  referralTitle: { flex: 1, color: colors.dark, fontSize: 15, fontWeight: "800" },
  inputBox: {
    height: 54,
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: { color: colors.dark, fontSize: 15, fontWeight: "700" },
  termsRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  termsText: { flex: 1, color: colors.grey, fontSize: 13, lineHeight: 18, fontWeight: "600" },
});
