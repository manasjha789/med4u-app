import { Stack } from "expo-router";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="bookDoctor" />
        <Stack.Screen name="doctorDetails" />
        <Stack.Screen name="doctorSlots" />
        <Stack.Screen name="videoCall" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="medicineCart" />
        <Stack.Screen name="orderTracking" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="search" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
      </Stack>
    </AppProvider>
  );
}
