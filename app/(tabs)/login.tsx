import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("");

  const handleContinue = () => {
    if (mobile.length === 10) {
      router.push("/otp");
    } else {
      alert("Please enter a valid 10 digit mobile number");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.topArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={48} color="#fff" />
          </View>

          <Text style={styles.brand}>Med4U</Text>
          <Text style={styles.tagline}>
            Fast healthcare at your doorstep
          </Text>
        </View>

        {/* Highlight Cards */}
        <View style={styles.highlightRow}>
          <View style={styles.smallCard}>
            <Ionicons name="videocam" size={18} color="#2563EB" />
            <Text style={styles.smallText}>15 min Doctor</Text>
          </View>

          <View style={styles.smallCard}>
            <Ionicons name="medkit" size={18} color="#10B981" />
            <Text style={styles.smallText}>20 min Delivery</Text>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>

          <Text style={styles.heading}>Sign in / Sign up</Text>

          <Text style={styles.subHeading}>
            Enter your mobile number to continue
          </Text>

          {/* Mobile Number */}
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              style={styles.input}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>CONTINUE</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.or}>Optional</Text>
            <View style={styles.line} />
          </View>

          {/* Referral Code */}
          <View style={styles.inputBox}>
            <Ionicons name="gift-outline" size={20} color="#F59E0B" />
            <TextInput
              placeholder="Referral Code"
              value={referral}
              onChangeText={setReferral}
              style={styles.input}
            />
          </View>

          {/* Reward Box */}
          <View style={styles.rewardBox}>
            <Ionicons name="gift" size={20} color="#F59E0B" />
            <Text style={styles.rewardText}>
              Use referral code & get rewards
            </Text>
          </View>

          {/* Terms */}
          <View style={styles.checkRow}>
            <Ionicons name="checkbox-outline" size={20} color="#0F766E" />
            <Text style={styles.checkText}>
              Receive health tips & special offers
            </Text>
          </View>

          <View style={styles.checkRow}>
            <Ionicons name="checkbox-outline" size={20} color="#0F766E" />
            <Text style={styles.checkText}>
              I agree to <Text style={styles.link}>Terms</Text> &{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Trusted by thousands of patients
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },

  topArea: {
    alignItems: "center",
    marginTop: 45,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 14,
  },

  tagline: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },

  highlightRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  smallCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginHorizontal: 6,
    alignItems: "center",
  },

  smallText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 24,
    borderRadius: 28,
    padding: 24,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#60A5FA",
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  subHeading: {
    color: "#64748B",
    marginBottom: 22,
    fontSize: 14,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  or: {
    marginHorizontal: 10,
    color: "#94A3B8",
    fontSize: 13,
  },

  rewardBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  rewardText: {
    marginLeft: 10,
    color: "#9A3412",
    fontWeight: "600",
    fontSize: 14,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  checkText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },

  link: {
    color: "#2563EB",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    marginVertical: 28,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
});