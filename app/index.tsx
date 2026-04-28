import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, SafeAreaView, StyleSheet, View } from "react-native";
import { BrandLogo } from "@/components/BrandLogo";
import { colors } from "@/components/ui/premium";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.86)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => router.replace("/login"), 2000);
    return () => clearTimeout(timer);
  }, [opacity, scale]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.center, { opacity, transform: [{ scale }] }]}>
        <BrandLogo />
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingFill, { opacity }]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  loadingTrack: {
    width: 154,
    height: 7,
    overflow: "hidden",
    borderRadius: 99,
    backgroundColor: "#D9E7FF",
    marginTop: 34,
  },
  loadingFill: { width: "72%", height: "100%", borderRadius: 99, backgroundColor: colors.primary },
});
