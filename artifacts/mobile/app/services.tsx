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

type StepIconName = keyof typeof Feather.glyphMap;

const STEPS: { icon: StepIconName; num: string; name: string; desc: string }[] = [
  {
    icon: "message-circle",
    num: "01",
    name: "Free Expert Counselling",
    desc: "A dedicated advisor assesses your academic background, goals, and preferred destinations to map the best pathway.",
  },
  {
    icon: "home",
    num: "02",
    name: "University Selection",
    desc: "We shortlist the most suitable universities and courses based on your profile, budget, and career ambitions.",
  },
  {
    icon: "file-text",
    num: "03",
    name: "Application & Personal Statement",
    desc: "We help craft a compelling personal statement and manage the full application submission on your behalf.",
  },
  {
    icon: "award",
    num: "04",
    name: "Offer & Enrolment",
    desc: "We handle offer negotiations, help you accept the best offer, and complete your enrolment documentation.",
  },
  {
    icon: "send",
    num: "05",
    name: "Visa Guidance",
    desc: "Step-by-step support for your UK Student Visa application including CAS, financial evidence, and biometrics.",
  },
  {
    icon: "package",
    num: "06",
    name: "Accommodation & Pre-Departure",
    desc: "We help secure student accommodation and provide a comprehensive pre-departure briefing.",
  },
  {
    icon: "map-pin",
    num: "07",
    name: "Arrival & Settling In",
    desc: "Dedicated post-arrival support to help you navigate your new city, campus, and student life.",
  },
  {
    icon: "briefcase",
    num: "08",
    name: "Career & Post-Study Visa",
    desc: "Graduate Route Visa guidance and career support — our commitment continues long after you land.",
  },
];

const RESOURCE_LINKS = [
  { label: "UK Student Visa", url: "https://www.gov.uk/student-visa", icon: "shield" as StepIconName },
  { label: "Graduate Route Visa", url: "https://www.gov.uk/graduate-visa", icon: "trending-up" as StepIconName },
  { label: "UCAS Application Guide", url: "https://www.ucas.com/undergraduate/applying-to-university", icon: "book-open" as StepIconName },
  { label: "NHS Health Surcharge", url: "https://www.gov.uk/healthcare-immigration-application/how-much-pay", icon: "activity" as StepIconName },
];

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.navy }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 20 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>OUR PROCESS</Text>
        <Text style={styles.headerTitle}>End-to-End Support{"\n"}From Enquiry to Career</Text>
        <Text style={styles.headerSub}>
          Our commitment does not end when you land. We support students through every stage — from the first conversation to building a life and career at your destination.
        </Text>
      </View>

      {/* Steps */}
      <View style={[styles.stepsContainer, { backgroundColor: colors.background }]}>
        {STEPS.map((step, index) => (
          <View key={step.num} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={[styles.stepIconWrap, { backgroundColor: "rgba(212,150,58,0.12)", borderColor: "rgba(212,150,58,0.35)" }]}>
                <Feather name={step.icon} size={18} color={colors.gold} />
              </View>
              {index < STEPS.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepNum, { color: colors.gold }]}>Step {step.num}</Text>
              <Text style={[styles.stepName, { color: colors.navy }]}>{step.name}</Text>
              <Text style={[styles.stepDesc, { color: colors.textSoft }]}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Resources */}
      <View style={[styles.resources, { backgroundColor: colors.background }]}>
        <Text style={[styles.resourcesTitle, { color: colors.navy }]}>Official Resources</Text>
        {RESOURCE_LINKS.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => Linking.openURL(link.url)}
            style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name={link.icon} size={16} color={colors.navy} />
            <Text style={[styles.linkLabel, { color: colors.navy }]}>{link.label}</Text>
            <Feather name="external-link" size={14} color={colors.textSoft} />
          </Pressable>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Pressable
          onPress={() => router.push("/(tabs)/apply")}
          style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
        >
          <Text style={[styles.ctaBtnText, { color: colors.navy }]}>Start Your Journey — Free</Text>
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
    marginBottom: 12,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 20,
  },
  stepsContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 8,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 0,
  },
  stepLeft: {
    alignItems: "center",
    width: 44,
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepNum: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  stepName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  resources: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  resourcesTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  linkLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  cta: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  ctaBtn: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
