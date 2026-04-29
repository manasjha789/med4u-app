import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { colors } from "@/components/ui/premium";

const primary = colors.primary;
const secondary = colors.secondary;

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

function SocialButton({
  label,
  icon,
  color,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.socialButton} activeOpacity={0.82} accessibilityLabel={`Continue with ${label}`}>
      <Ionicons name={icon} size={21} color={color} />
    </TouchableOpacity>
  );
}

export default function LoginScreen() {
  const { updateProfile } = useApp();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [mobileFocused, setMobileFocused] = useState(false);

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[primary, secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View pointerEvents="none" style={styles.softCircleOne} />
          <View pointerEvents="none" style={styles.softCircleTwo} />
          <View style={styles.heroText}>
            <Text style={styles.hello}>Hello!</Text>
            <Text style={styles.welcome}>Welcome to Med4U</Text>
          </View>
          <TopIllustration />
        </LinearGradient>

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

          <TouchableOpacity style={styles.forgotRow} activeOpacity={0.72}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.88} onPress={handleContinue}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or login with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <SocialButton label="Facebook" icon="logo-facebook" color="#1877F2" />
            <SocialButton label="Google" icon="logo-google" color="#DB4437" />
            <SocialButton label="Apple" icon="logo-apple" color="#111827" />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity activeOpacity={0.72}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, backgroundColor: colors.background },
  hero: {
    minHeight: 330,
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 56,
    overflow: "hidden",
  },
  softCircleOne: {
    position: "absolute",
    top: -54,
    right: -42,
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  softCircleTwo: {
    position: "absolute",
    left: -58,
    bottom: 28,
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroText: { zIndex: 2 },
  hello: { color: colors.white, fontSize: 38, fontWeight: "900", letterSpacing: 0 },
  welcome: { color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: "700", marginTop: 4 },
  illustrationWrap: {
    position: "absolute",
    right: 28,
    bottom: 28,
    width: 178,
    height: 178,
  },
  leafLarge: {
    position: "absolute",
    right: 25,
    top: 18,
    width: 44,
    height: 104,
    borderTopLeftRadius: 44,
    borderBottomRightRadius: 44,
    backgroundColor: "rgba(187,247,208,0.82)",
    transform: [{ rotate: "18deg" }],
  },
  leafSmall: {
    position: "absolute",
    left: 38,
    top: 48,
    width: 62,
    height: 34,
    borderTopLeftRadius: 34,
    borderBottomRightRadius: 34,
    backgroundColor: "rgba(204,251,241,0.78)",
    transform: [{ rotate: "28deg" }],
  },
  healthBubble: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
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
    shadowColor: colors.primary,
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
    backgroundColor: colors.background,
  },
  stem: {
    position: "absolute",
    right: 74,
    top: 72,
    width: 6,
    height: 72,
    borderRadius: 3,
    backgroundColor: "rgba(220,252,231,0.95)",
    transform: [{ rotate: "9deg" }],
  },
  pulseLine: { position: "absolute", left: 2, bottom: 44 },
  loginCard: {
    flex: 1,
    marginTop: -28,
    paddingHorizontal: 26,
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
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
  inputIcon: {
    position: "absolute",
    left: 15,
    top: 17,
    zIndex: 8,
  },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700", marginTop: 9 },
  forgotRow: { alignSelf: "flex-end", marginTop: 13, marginBottom: 18 },
  forgotText: { color: primary, fontSize: 12, fontWeight: "800" },
  loginButton: {
    minHeight: 52,
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
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
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
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  signupRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24 },
  signupText: { color: colors.grey, fontSize: 12, fontWeight: "700" },
  signupLink: { color: primary, fontSize: 12, fontWeight: "900" },
});
