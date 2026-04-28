import { Tabs } from "expo-router";
import { FloatingTabBar } from "@/components/FloatingTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="homeScreen" options={{ title: "Home" }} />
      <Tabs.Screen name="consult" options={{ title: "Consult" }} />
      <Tabs.Screen name="medicine" options={{ title: "Medicine" }} />
      <Tabs.Screen name="hospital" options={{ title: "Hospital" }} />
      <Tabs.Screen name="profileTab" options={{ title: "Profile" }} />
    </Tabs>
  );
}
