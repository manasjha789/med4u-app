import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, PrimaryButton } from "@/components/ui/premium";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
    if (value && index === 4) Keyboard.dismiss();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    if (otp.join("").length !== 5) {
      setError("Enter the complete 5 digit verification code.");
      return;
    }
    router.push("/profile");
  };

  const resend = () => {
    setOtp(["", "", "", "", ""]);
    setTimer(30);
    setError("A fresh OTP has been sent.");
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the 5 digit code sent to your mobile number.</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectionColor={colors.primary}
                style={[styles.otpBox, digit && styles.otpBoxFilled]}
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.helper, error.includes("fresh") && styles.success]}>{error}</Text>
          ) : (
            <Text style={styles.helper}>Secure verification keeps your medical account safe.</Text>
          )}

          <PrimaryButton title="Verify OTP" onPress={verifyOtp} />

          {timer > 0 ? (
            <Text style={styles.timer}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={resend} activeOpacity={0.8}>
              <Text style={styles.resend}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  wrapper: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    shadowColor: "#8EA8CE",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  back: {
    position: "absolute",
    left: 18,
    top: 18,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
  },
  iconCircle: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.background,
    marginTop: 22,
  },
  title: { color: colors.dark, fontSize: 30, fontWeight: "900", marginTop: 18 },
  subtitle: { color: colors.grey, fontSize: 15, lineHeight: 21, textAlign: "center", marginTop: 8 },
  otpRow: { flexDirection: "row", gap: 10, marginTop: 28, marginBottom: 14 },
  otpBox: {
    width: 54,
    height: 62,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    color: colors.dark,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "900",
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: "#F3F8FF" },
  helper: { color: colors.grey, fontSize: 13, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  success: { color: colors.success },
  timer: { color: colors.grey, fontSize: 14, fontWeight: "700", marginTop: 18 },
  resend: { color: colors.primary, fontSize: 15, fontWeight: "900", marginTop: 18 },
});
