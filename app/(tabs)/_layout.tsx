import { Tabs } from "expo-router";
import { PremiumTabBar } from "@/components/PremiumTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="homeScreen" options={{ title: "Home" }} />
      <Tabs.Screen name="consult" options={{ title: "Consult" }} />
      <Tabs.Screen name="medicine" options={{ title: "Medicine" }} />
      <Tabs.Screen name="hospital" options={{ title: "Hospitals" }} />
      <Tabs.Screen name="profileTab" options={{ title: "Account" }} />
    </Tabs>
  );
}
