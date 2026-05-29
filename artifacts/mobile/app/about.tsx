import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const PILLARS = [
  { icon: "award" as const, title: "British Council Certified", desc: "Fully accredited by the British Council — the UK's premier education authority." },
  { icon: "map-pin" as const, title: "London, UK Based", desc: "Our team operates from London, giving us direct access to UK admissions networks." },
  { icon: "users" as const, title: "100% Free Service", desc: "Our service is entirely free to students. Universities pay us — you pay nothing." },
  { icon: "shield" as const, title: "All UK Universities", desc: "We support applications to every university in the United Kingdom." },
  { icon: "globe" as const, title: "8+ Global Destinations", desc: "Guidance for students targeting the UK, USA, Canada, Australia, and beyond." },
  { icon: "trending-up" as const, title: "Career to Post-Study Visa", desc: "Our support extends beyond graduation — we help with career planning and Graduate Route Visa." },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cream, paddingTop: topPad + 20 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.navy} />
        </Pressable>
        <View style={[styles.certBadge, { backgroundColor: "rgba(212,150,58,0.12)", borderColor: "rgba(212,150,58,0.35)" }]}>
          <Feather name="award" size={14} color={colors.gold} />
          <Text style={[styles.certText, { color: colors.gold }]}>BRITISH COUNCIL CERTIFIED</Text>
        </View>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>About Thames Uni Connect</Text>
        <Text style={[styles.headerSub, { color: colors.textMid }]}>
          Thames Uni Connect is a British Council certified education consultancy, headquartered in London, UK. We provide end-to-end university admissions guidance to international students — completely free of charge.
        </Text>
      </View>

      {/* Quote */}
      <View style={[styles.quote, { backgroundColor: colors.navy }]}>
        <Feather name="message-square" size={24} color={colors.gold} style={{ marginBottom: 12 }} />
        <Text style={styles.quoteText}>
          "Every student deserves access to world-class education. We're here to make that journey{" "}
          <Text style={{ color: colors.gold }}>as smooth as possible</Text>."
        </Text>
      </View>

      {/* Pillars */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Why Choose Us</Text>
        <View style={styles.pillarsGrid}>
          {PILLARS.map((p) => (
            <View key={p.title} style={[styles.pillar, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.pillarIcon, { backgroundColor: "rgba(15,45,94,0.08)" }]}>
                <Feather name={p.icon} size={20} color={colors.navy} />
              </View>
              <Text style={[styles.pillarTitle, { color: colors.navy }]}>{p.title}</Text>
              <Text style={[styles.pillarDesc, { color: colors.textSoft }]}>{p.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact */}
      <View style={[styles.contact, { backgroundColor: colors.navy, marginHorizontal: 16, borderRadius: 16 }]}>
        <Text style={styles.contactTitle}>Ready to Talk?</Text>
        <Pressable
          onPress={() => Linking.openURL("https://wa.me/447359854658")}
          style={[styles.contactBtn, { backgroundColor: "#25D366" }]}
        >
          <Feather name="message-circle" size={16} color="#fff" />
          <Text style={styles.contactBtnText}>WhatsApp Us Now</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/apply")}
          style={[styles.contactBtnOutline]}
        >
          <Text style={[styles.contactBtnOutlineText, { color: "rgba(255,255,255,0.8)" }]}>Book Free Consultation</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL("mailto:admin@thamesuniconnect.com")}
          style={[styles.contactBtnOutline, { marginTop: 0 }]}
        >
          <Feather name="mail" size={14} color="rgba(255,255,255,0.8)" style={{ marginRight: 8 }} />
          <Text style={[styles.contactBtnOutlineText, { color: "rgba(255,255,255,0.8)" }]}>admin@thamesuniconnect.com</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: "flex-start",
    padding: 4,
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  certText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 32,
  },
  headerSub: {
    fontSize: 13,
    lineHeight: 21,
  },
  quote: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 17,
    color: "#fff",
    fontStyle: "italic",
    lineHeight: 26,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  pillarsGrid: {
    gap: 10,
  },
  pillar: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  contact: {
    padding: 24,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  contactBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  contactBtnOutline: {
    paddingVertical: 11,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  contactBtnOutlineText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
