import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthButton, authColors } from "@/components/auth/AuthChrome";
import { OtpInput } from "@/components/auth/OtpInput";
import { colors } from "@/components/ui/premium";

export default function OtpScreen() {
  const params = useLocalSearchParams<{ mobile?: string }>();
  const mobile = params.mobile ?? "your mobile";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = () => {
    if (otp.length !== 5) {
      setMessage("Enter the complete 5 digit verification code.");
      return;
    }
    router.push("/profile");
  };

  const resend = () => {
    setOtp("");
    setTimer(30);
    setMessage("A fresh OTP has been sent.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <LinearGradient colors={["#ECFDF5", "#F8FAFC"]} style={styles.backgroundGlow}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.82}>
              <Ionicons name="chevron-back" size={25} color={authColors.text} />
            </TouchableOpacity>

            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={52} color={authColors.primary} />
            </View>

            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 5-digit code sent to {mobile}</Text>

            <OtpInput
              value={otp}
              onChange={(value) => {
                setOtp(value.replace(/\D/g, "").slice(0, 5));
                setMessage("");
              }}
            />

            {message ? (
              <Text style={[styles.helper, message.includes("fresh") && styles.success]}>{message}</Text>
            ) : (
              <Text style={styles.helper}>Your medical data is securely protected</Text>
            )}

            <View style={styles.verifyWrap}>
              <AuthButton title="Verify OTP" onPress={verifyOtp} />
            </View>

            {timer > 0 ? (
              <Text style={styles.timer}>Resend OTP in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={resend} activeOpacity={0.82}>
                <Text style={styles.resend}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: authColors.background },
  wrapper: { flex: 1 },
  backgroundGlow: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  card: {
    alignItems: "center",
    borderRadius: 34,
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 30,
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 18,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
  },
  iconCircle: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    backgroundColor: "#F0FDFA",
  },
  title: {
    color: authColors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 24,
  },
  subtitle: {
    color: authColors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 285,
  },
  helper: {
    color: authColors.muted,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center",
    minHeight: 42,
    maxWidth: 290,
  },
  success: { color: colors.success },
  verifyWrap: { width: "100%", marginTop: 4 },
  timer: { color: authColors.muted, fontSize: 15, fontWeight: "800", marginTop: 22 },
  resend: { color: authColors.primary, fontSize: 15, fontWeight: "900", marginTop: 22 },
});
