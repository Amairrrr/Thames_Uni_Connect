import { Feather } from "@expo/vector-icons";
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

const DESTINATIONS = [
  {
    name: "United Kingdom",
    badge: "PRIMARY",
    highlight: true,
    color1: "#1B3F7D",
    color2: "#C8102E",
    details: "Our primary destination. We cover all UK universities — Russell Group, specialist colleges, and direct partner institutions.",
    tag: "All UK universities covered",
    featured: true,
  },
  {
    name: "United States",
    badge: null,
    highlight: false,
    color1: "#B22234",
    color2: "#3C3B6E",
    details: "Guidance on US college applications, SAT/ACT requirements, F-1 visa support, and scholarship advice.",
    tag: "F-1 Student Visa",
    featured: false,
  },
  {
    name: "Canada",
    badge: null,
    highlight: false,
    color1: "#CC0000",
    color2: "#AA0000",
    details: "Support for Canadian university applications, study permits, and post-graduation work permit pathways.",
    tag: "Study Permit",
    featured: false,
  },
  {
    name: "Australia",
    badge: null,
    highlight: false,
    color1: "#00008B",
    color2: "#006400",
    details: "Expert guidance for Australian university applications, Student Visa (subclass 500), and PR pathways.",
    tag: "Subclass 500 Visa",
    featured: false,
  },
  {
    name: "New Zealand",
    badge: null,
    highlight: false,
    color1: "#003087",
    color2: "#CC0000",
    details: "Comprehensive support for New Zealand tertiary institutions and student visa applications.",
    tag: "Student Visa",
    featured: false,
  },
  {
    name: "Germany",
    badge: null,
    highlight: false,
    color1: "#1a1a1a",
    color2: "#DD0000",
    details: "Guidance for German public universities, many with no tuition fees. Blocked account and language requirements covered.",
    tag: "No Tuition Fees",
    featured: false,
  },
  {
    name: "France",
    badge: null,
    highlight: false,
    color1: "#002395",
    color2: "#ED2939",
    details: "Support for French university applications through Campus France and long-stay student visa process.",
    tag: "Campus France",
    featured: false,
  },
  {
    name: "Europe (Other)",
    badge: null,
    highlight: false,
    color1: "#003399",
    color2: "#FFCC00",
    details: "Advisory services for Netherlands, Ireland, Spain, Poland, and other European study destinations.",
    tag: "Multiple countries",
    featured: false,
  },
];

export default function DestinationsScreen() {
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
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad + 20 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>STUDY DESTINATIONS</Text>
        <Text style={styles.headerTitle}>8+ Global Destinations</Text>
        <Text style={styles.headerSub}>
          We guide students to top universities in the UK and across the world — covering applications, visas, and pre-departure support.
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.grid}>
        {DESTINATIONS.map((dest) => (
          <View
            key={dest.name}
            style={[
              styles.destCard,
              {
                borderColor: dest.highlight ? colors.gold : colors.border,
                borderWidth: dest.highlight ? 2 : 1.5,
                backgroundColor: colors.card,
              },
            ]}
          >
            {/* Color bar */}
            <View
              style={[
                styles.colorBar,
                {
                  backgroundColor: dest.color1,
                  borderBottomColor: dest.color2,
                },
              ]}
            >
              <Text style={styles.destName}>{dest.name}</Text>
              {dest.badge && (
                <View style={[styles.primaryBadge, { backgroundColor: colors.gold }]}>
                  <Text style={[styles.primaryBadgeText, { color: colors.navy }]}>{dest.badge}</Text>
                </View>
              )}
            </View>

            {/* Body */}
            <View style={styles.destBody}>
              <View style={[styles.tagPill, { backgroundColor: "rgba(15,45,94,0.07)", borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.navy }]}>{dest.tag}</Text>
              </View>
              <Text style={[styles.destDetails, { color: colors.textMid }]}>{dest.details}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={[styles.cta, { backgroundColor: colors.navy }]}>
        <Text style={styles.ctaTitle}>Not Sure Which Country?</Text>
        <Text style={styles.ctaSub}>Our advisors will help you choose the best destination for your goals and budget.</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/apply")}
          style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
        >
          <Text style={[styles.ctaBtnText, { color: colors.navy }]}>Get Free Advice</Text>
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
  headerLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 36,
    marginBottom: 10,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 20,
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  destCard: {
    borderRadius: 14,
    overflow: "hidden",
  },
  colorBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
  },
  destName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  destBody: {
    padding: 14,
    gap: 8,
  },
  tagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  destDetails: {
    fontSize: 13,
    lineHeight: 19,
  },
  cta: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
