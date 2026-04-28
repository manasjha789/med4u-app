import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type UserProfile = {
  name: string;
  phone: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bloodGroup: string;
  conditions: string;
  allergies: string;
  medicines: string;
  emergencyContact: string;
  address: string;
  city: string;
};

const defaultProfile: UserProfile = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  bloodGroup: "",
  conditions: "",
  allergies: "",
  medicines: "",
  emergencyContact: "",
  address: "",
  city: "",
};

type AppContextValue = {
  profile: UserProfile;
  displayName: string;
  updateProfile: (value: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      displayName: profile.name.trim() || "there",
      updateProfile: (next) => setProfile((current) => ({ ...current, ...next })),
      resetProfile: () => setProfile(defaultProfile),
    }),
    [profile],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return value;
}
