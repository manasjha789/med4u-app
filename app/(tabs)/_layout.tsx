import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="homeScreen" />
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
