import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@tuc:enquiries";

export type EnquiryStatus = "pending" | "contacted" | "in_progress" | "completed";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  course: string;
  submittedAt: string;
  status: EnquiryStatus;
};

async function postEnquiryToApi(enquiry: Enquiry) {
  try {
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: enquiry.name,
        email: enquiry.email ?? "",
        phone: enquiry.phone,
        country: enquiry.country,
        destination: enquiry.destination,
        course: enquiry.course,
        status: enquiry.status,
      }),
    });
  } catch {
    // Silently fail — local enquiry still saved
  }
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setEnquiries(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (updated: Enquiry[]) => {
    setEnquiries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addEnquiry = useCallback(
    async (data: Omit<Enquiry, "id" | "submittedAt" | "status">) => {
      const enquiry: Enquiry = {
        ...data,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "pending",
      };
      const updated = [enquiry, ...enquiries];
      await save(updated);
      postEnquiryToApi(enquiry);
      return enquiry;
    },
    [enquiries, save]
  );

  const updateStatus = useCallback(
    async (id: string, status: EnquiryStatus) => {
      const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
      await save(updated);
    },
    [enquiries, save]
  );

  const removeEnquiry = useCallback(
    async (id: string) => {
      const updated = enquiries.filter((e) => e.id !== id);
      await save(updated);
    },
    [enquiries, save]
  );

  const pendingCount = enquiries.filter((e) => e.status === "pending").length;

  return { enquiries, loading, addEnquiry, updateStatus, removeEnquiry, pendingCount, reload: load };
}
