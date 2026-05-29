import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { useEnquiries } from "./useEnquiries";

const DISMISSED_KEY = "@tuc:dismissed_reminders";

export type Reminder = {
  id: string;
  type: "pending_enquiry" | "intake_deadline" | "follow_up";
  title: string;
  message: string;
  color: string;
  icon: string;
};

const SEPT_2026 = new Date("2026-09-01");
const JAN_2027 = new Date("2027-01-06");

function daysUntil(date: Date): number {
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function useReminders() {
  const { enquiries } = useEnquiries();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_KEY)
      .then((raw) => raw && setDismissed(JSON.parse(raw)))
      .finally(() => setLoaded(true));
  }, []);

  const dismiss = useCallback(
    async (id: string) => {
      const updated = [...dismissed, id];
      setDismissed(updated);
      await AsyncStorage.setItem(DISMISSED_KEY, JSON.stringify(updated));
    },
    [dismissed]
  );

  const reminders: Reminder[] = [];

  if (loaded) {
    const septDays = daysUntil(SEPT_2026);
    const janDays = daysUntil(JAN_2027);

    if (septDays > 0 && septDays <= 90 && !dismissed.includes("sept_2026")) {
      reminders.push({
        id: "sept_2026",
        type: "intake_deadline",
        title: `${septDays} days to September 2026 intake`,
        message: "Applications are open now. Don't miss the September 2026 deadline.",
        color: "#059669",
        icon: "calendar",
      });
    }

    if (janDays > 0 && janDays <= 120 && !dismissed.includes("jan_2027")) {
      reminders.push({
        id: "jan_2027",
        type: "intake_deadline",
        title: `${janDays} days to January 2027 intake`,
        message: "Start your application early to secure your university place.",
        color: "#D4963A",
        icon: "clock",
      });
    }

    const pendingOld = enquiries.filter((e) => {
      if (e.status !== "pending") return false;
      const age = Date.now() - new Date(e.submittedAt).getTime();
      return age > 24 * 60 * 60 * 1000;
    });

    if (pendingOld.length > 0 && !dismissed.includes("pending_followup")) {
      reminders.push({
        id: "pending_followup",
        type: "pending_enquiry",
        title: `${pendingOld.length} enquiry${pendingOld.length > 1 ? " awaiting" : " awaiting"} response`,
        message: "Your advisor will be in touch. You can also reach us via WhatsApp.",
        color: "#2563EB",
        icon: "bell",
      });
    }
  }

  return { reminders, dismiss };
}
