import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { colors } from "@/components/ui/premium";

const primary = "#0F766E";
const secondary = "#14B8A6";

function TopIllustration() {
  return (
    <View pointerEvents="none" style={styles.illustrationWrap}>
      <View pointerEvents="none" style={styles.leafLarge} />
      <View pointerEvents="none" style={styles.leafSmall} />
      <View pointerEvents="none" style={styles.healthBubble}>
        <Ionicons name="medical" size={25} color={primary} />
      </View>
      <View pointerEvents="none" style={styles.pot}>
        <View pointerEvents="none" style={styles.potLip} />
      </View>
      <View pointerEvents="none" style={styles.stem} />
      <View pointerEvents="none" style={styles.pulseLine}>
        <Ionicons name="pulse" size={30} color="rgba(255,255,255,0.72)" />
      </View>
    </View>
  );
}

function LoginField({
  children,
  focused,
}: {
  children: ReactNode;
  focused?: boolean;
}) {
  return (
    <View pointerEvents="box-none" style={[styles.inputShell, focused && styles.inputShellFocused]}>
      {children}
    </View>
  );
}

export default function LoginScreen() {
  const { updateProfile } = useApp();
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState("");
  const [mobileFocused, setMobileFocused] = useState(false);
  const [referralFocused, setReferralFocused] = useState(false);

  const handleContinue = () => {
    if (mobile.trim().length !== 10) {
      setError("Enter a valid 10 digit mobile number.");
      return;
    }
    updateProfile({ phone: `+91 ${mobile.trim()}` });
    router.push("/otp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[primary, secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View pointerEvents="none" style={styles.softCircleOne} />
        <View pointerEvents="none" style={styles.softCircleTwo} />
        <View pointerEvents="none" style={styles.softCircleThree} />

        {/* Brand */}
        <View style={styles.brandSection}>
          <Text style={styles.brandName}>Med4u</Text>
          <View style={styles.brandUnderline} />
          <Text style={styles.brandTagline}>YOUR HEALTH, OUR PRIORITY</Text>
        </View>

        {/* Card */}
        <View style={styles.loginCard}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.helperText}>Enter your mobile number to receive a secure OTP.</Text>

          <View pointerEvents="box-none" style={styles.phoneRow}>
            <TouchableOpacity style={styles.countryBox} activeOpacity={0.82}>
              <Text style={styles.countryText}>+91</Text>
              <Ionicons name="chevron-down" size={15} color={colors.grey} />
            </TouchableOpacity>

            <LoginField focused={mobileFocused}>
              <Ionicons
                pointerEvents="none"
                name="call-outline"
                size={19}
                color={mobileFocused ? primary : "#94A3B8"}
                style={styles.inputIcon}
              />
              <TextInput
                editable={true}
                placeholder="Mobile Number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onFocus={() => setMobileFocused(true)}
                onBlur={() => setMobileFocused(false)}
                onChangeText={(value) => {
                  setMobile(value.replace(/\D/g, ""));
                  setError("");
                }}
                style={styles.mobileInput}
              />
            </LoginField>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={[styles.referralShell, referralFocused && styles.referralShellFocused]}>
            <Ionicons
              pointerEvents="none"
              name="gift-outline"
              size={19}
              color={referralFocused ? primary : "#94A3B8"}
              style={styles.inputIcon}
            />
            <TextInput
              editable={true}
              placeholder="Enter Referral Code (Optional)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={referral}
              onFocus={() => setReferralFocused(true)}
              onBlur={() => setReferralFocused(false)}
              onChangeText={(value) => setReferral(value)}
              style={styles.referralInput}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.88} onPress={handleContinue}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { flexGrow: 1, backgroundColor: "#F8FAFC" },
  hero: {
    minHeight: 330,
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 56,
    overflow: "hidden",
  },
  softCircleOne: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  softCircleTwo: {
    position: "absolute",
    left: -70,
    bottom: 100,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  softCircleThree: {
    position: "absolute",
    right: 30,
    bottom: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  brandSection: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: colors.white,
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  pot: {
    position: "absolute",
    right: 32,
    bottom: 0,
    width: 78,
    height: 58,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: colors.white,
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  potLip: {
    position: "absolute",
    top: -10,
    left: -8,
    width: 94,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  brandTagline: {
    marginTop: 10,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.4,
  },
  loginCard: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    borderRadius: 28,
    backgroundColor: colors.white,
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 5,
  },
  title: { color: primary, fontSize: 25, fontWeight: "900", letterSpacing: 0 },
  helperText: { color: colors.grey, fontSize: 13, lineHeight: 19, fontWeight: "600", marginTop: 7, marginBottom: 22 },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 10, zIndex: 6 },
  countryBox: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryText: { color: colors.dark, fontSize: 15, fontWeight: "900" },
  inputShell: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    zIndex: 7,
  },
  inputShellFocused: {
    borderColor: colors.secondary,
    shadowColor: secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 2,
  },
  mobileInput: {
    width: "100%",
    height: "100%",
    flex: 1,
    color: colors.dark,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0,
    paddingLeft: 43,
    paddingRight: 15,
  },
  referralShell: {
    marginTop: 14,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  referralShellFocused: {
    borderColor: "#5EEAD4",
    shadowColor: secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 2,
  },
  referralInput: {
    flex: 1,
    height: "100%",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
    paddingLeft: 43,
    paddingRight: 15,
    paddingVertical: 0,
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    top: 17,
    zIndex: 8,
  },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700", marginTop: 9 },
  loginButton: {
    minHeight: 52,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: primary,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },
  loginButtonText: { color: colors.white, fontSize: 16, fontWeight: "900" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 16 },
  divider: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  dividerText: { color: "#94A3B8", fontSize: 12, fontWeight: "700" },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 13 },
  socialButton: {
    width: 48,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  signupRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24 },
  signupText: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  signupLink: { color: primary, fontSize: 12, fontWeight: "900" },
});
