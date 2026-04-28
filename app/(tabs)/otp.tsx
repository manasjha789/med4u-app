import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("").trim();

    if (enteredOtp.length < 5) return;

    router.push("/profile");
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", ""]);
    setTimer(30);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* FULL CARD CENTERED */}
        <View style={styles.card}>
          <Ionicons
            name="shield-checkmark"
            size={62}
            color="#2563EB"
          />

          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.subtitle}>
            Enter the 5 digit OTP sent to your mobile number
          </Text>

          {/* OTP BOXES */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) =>
                  handleChange(text, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpBox}
              />
            ))}
          </View>

          {/* VERIFY BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={verifyOtp}
          >
            <Text style={styles.buttonText}>
              VERIFY OTP
            </Text>
          </TouchableOpacity>

          {/* TIMER */}
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resendText}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          {/* BACK */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
          >
            <Text style={styles.backText}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",   // MAIN FIX
    alignItems: "center",       // MAIN FIX
    paddingHorizontal: 22,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 18,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 26,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginHorizontal: 5,
  },

  button: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  timerText: {
    marginTop: 18,
    color: "#64748B",
    fontSize: 14,
  },

  resendText: {
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  backText: {
    marginTop: 18,
    color: "#64748B",
    fontSize: 14,
  },
});
