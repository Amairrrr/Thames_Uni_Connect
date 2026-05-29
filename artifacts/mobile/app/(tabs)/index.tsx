import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReminderBanner } from "@/components/ReminderBanner";
import { useColors } from "@/hooks/useColors";
import { useReminders } from "@/hooks/useReminders";

const WHATSAPP_URL = "https://wa.me/447359854658";

const STATS = [
  { num: "UK+", label: "All Universities" },
  { num: "8+", label: "Destinations" },
  { num: "Free", label: "End-to-End" },
];

const TRUST_ITEMS = [
  "British Council Certified",
  "All UK Universities Covered",
  "Based in London, UK",
  "100% Free Service",
  "Graduate Route Visa Support",
  "Post-Arrival Student Support",
];

const INTAKES = [
  { label: "Sept 2026 — Open Now", desc: "Main intake · All partner universities", color: "#059669" },
  { label: "Jan 2027 — Applications Open", desc: "Second major intake", color: "#D4963A" },
  { label: "May & Mar 2027", desc: "Selected universities only", color: "#9CA3AF" },
];

const PARTNER_UNIS = [
  { abbr: "UEL", name: "University of East London" },
  { abbr: "BPP", name: "BPP University" },
  { abbr: "UoG", name: "University of Greenwich" },
  { abbr: "UH", name: "University of Hertfordshire" },
  { abbr: "UoB", name: "University of Bedfordshire" },
  { abbr: "MDX", name: "Middlesex University" },
];

function StatCard({ num, label }: { num: string; label: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.18)" }]}>
      <Text style={[styles.statNum, { color: colors.gold }]}>{num}</Text>
      <Text style={[styles.statLabel, { color: "rgba(255,255,255,0.65)" }]}>{label}</Text>
    </View>
  );
}

function PressableCard({ onPress, style, children }: { onPress?: () => void; style?: object; children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const { reminders, dismiss } = useReminders();

  const openWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(WHATSAPP_URL);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── NAV BAR with logo ── */}
      <View style={[styles.navbar, { paddingTop: topPad, backgroundColor: "#FFFFFF", borderBottomColor: "#E5E7EB" }]}>
        <Image
          source={require("@/assets/images/logo-transparent.png")}
          style={styles.navLogo}
          resizeMode="contain"
        />
        <Pressable
          onPress={openWhatsApp}
          style={[styles.navWaBtn, { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }]}
        >
          <Feather name="message-circle" size={14} color="#25D366" />
          <Text style={styles.navWaBtnText}>WhatsApp</Text>
        </Pressable>
      </View>

      {/* ── HERO ── */}
      <View style={[styles.hero, { backgroundColor: colors.navy }]}>
        <View style={styles.badge}>
          <MaterialIcons name="verified" size={13} color={colors.gold} />
          <Text style={[styles.badgeText, { color: colors.gold }]}>BRITISH COUNCIL CERTIFIED · LONDON, UK</Text>
        </View>
        <Text style={styles.heroTitle}>
          Your Dream UK University{"\n"}
          <Text style={{ color: colors.gold }}>Starts Here</Text>
        </Text>
        <Text style={styles.heroSub}>
          Expert guidance from a British Council certified consultancy. We cover all UK universities and beyond — from first enquiry through to settling in.
        </Text>
        <View style={styles.heroActions}>
          <PressableCard
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(tabs)/apply");
            }}
            style={[styles.btnGold, { backgroundColor: colors.gold }]}
          >
            <Feather name="clipboard" size={15} color={colors.navy} />
            <Text style={[styles.btnGoldText, { color: colors.navy }]}>Free Assessment</Text>
          </PressableCard>
          <PressableCard
            onPress={openWhatsApp}
            style={styles.btnOutline}
          >
            <Feather name="message-circle" size={15} color="#fff" />
            <Text style={styles.btnOutlineText}>WhatsApp Us</Text>
          </PressableCard>
        </View>
        <View style={styles.statsRow}>
          {STATS.map((s) => <StatCard key={s.num} num={s.num} label={s.label} />)}
        </View>
      </View>

      {/* ── REMINDER BANNERS ── */}
      {reminders.map((r) => (
        <ReminderBanner key={r.id} reminder={r} onDismiss={dismiss} />
      ))}

      {/* ── INTAKES ── */}
      <View style={[styles.intakesBar, { backgroundColor: "#EFF6FF", borderTopColor: "#2563EB" }]}>
        {INTAKES.map((item) => (
          <View key={item.label} style={styles.intakeItem}>
            <View style={[styles.intakeDot, { backgroundColor: item.color }]} />
            <View>
              <Text style={[styles.intakeLabel, { color: colors.navy }]}>{item.label}</Text>
              <Text style={[styles.intakeDesc, { color: colors.textSoft }]}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── TRUST ── */}
      <View style={[styles.trustBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {TRUST_ITEMS.map((t) => (
          <View key={t} style={styles.trustItem}>
            <View style={[styles.trustDot, { backgroundColor: colors.green }]} />
            <Text style={[styles.trustText, { color: colors.textMid }]}>{t}</Text>
          </View>
        ))}
      </View>

      {/* ── PARTNER UNIVERSITIES ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.gold }]}>DIRECT PARTNER UNIVERSITIES</Text>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Priority Access, Faster Decisions</Text>
        <Text style={[styles.sectionSub, { color: colors.textSoft }]}>
          Dedicated admissions liaisons and preferred access at each of our 10 UK partner institutions.
        </Text>
        <View style={styles.uniGrid}>
          {PARTNER_UNIS.map((u) => (
            <PressableCard
              key={u.abbr}
              onPress={() => router.push("/(tabs)/universities")}
              style={[styles.uniCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.uniAbbr, { color: colors.navy }]}>{u.abbr}</Text>
              <Text style={[styles.uniName, { color: colors.textSoft }]}>{u.name}</Text>
            </PressableCard>
          ))}
        </View>
        <Pressable onPress={() => router.push("/(tabs)/universities")} style={styles.viewAll}>
          <Text style={[styles.viewAllText, { color: colors.navy }]}>View all 10 partner universities</Text>
          <Feather name="arrow-right" size={14} color={colors.navy} />
        </Pressable>
      </View>

      {/* ── CTA ── */}
      <View style={[styles.ctaSection, { backgroundColor: colors.navy }]}>
        <Text style={styles.ctaTitle}>Ready to Begin Your Journey?</Text>
        <Text style={styles.ctaSub}>Our advisors are available Mon–Sat, 9am–7pm GMT</Text>
        <PressableCard
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(tabs)/apply");
          }}
          style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
        >
          <Text style={[styles.ctaBtnText, { color: colors.navy }]}>Book Free Consultation</Text>
        </PressableCard>
        <Pressable onPress={openWhatsApp} style={styles.waBtn}>
          <Feather name="message-circle" size={16} color="#25D366" />
          <Text style={styles.waBtnText}>Chat on WhatsApp</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* ── Navbar ── */
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  navLogo: {
    width: 180,
    height: 58,
  },
  navWaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  navWaBtnText: {
    color: "#25D366",
    fontSize: 12,
    fontWeight: "700",
  },
  /* ── Hero ── */
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    backgroundColor: "rgba(212,150,58,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,150,58,0.4)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 38,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.68)",
    lineHeight: 21,
    marginBottom: 22,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  btnGold: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnGoldText: {
    fontSize: 14,
    fontWeight: "700",
  },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  /* ── Intakes ── */
  intakesBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 3,
    gap: 10,
  },
  intakeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  intakeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  intakeLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  intakeDesc: {
    fontSize: 11,
  },
  /* ── Trust ── */
  trustBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    gap: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trustDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  trustText: {
    fontSize: 12,
    fontWeight: "500",
  },
  /* ── Section ── */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 28,
  },
  sectionSub: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  uniGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  uniCard: {
    width: "47%",
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  uniAbbr: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 3,
  },
  uniName: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    justifyContent: "center",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  /* ── CTA ── */
  ctaSection: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginBottom: 22,
  },
  ctaBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 14,
    width: "100%",
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  waBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waBtnText: {
    fontSize: 14,
    color: "#25D366",
    fontWeight: "600",
  },
});
