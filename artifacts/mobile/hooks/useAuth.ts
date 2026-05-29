import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const USER_KEY = "@tuc:user_profile";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  country: string;
  courseInterest: string;
  registeredAt: string;
};

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const register = useCallback(async (profile: Omit<UserProfile, "registeredAt">) => {
    const full: UserProfile = { ...profile, registeredAt: new Date().toISOString() };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(full));
    setUser(full);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const isRegistered = !loading && user !== null;

  return { user, loading, isRegistered, register, logout };
}
