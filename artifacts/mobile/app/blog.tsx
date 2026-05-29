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

const ARTICLES = [
  {
    tag: "VISA GUIDE",
    title: "UK Student Visa 2026: Everything You Need to Know",
    excerpt: "A comprehensive guide to the UK Student Visa (Tier 4) — from CAS to biometrics and the latest Home Office requirements.",
    readTime: "8 min read",
    url: "https://www.gov.uk/student-visa",
  },
  {
    tag: "UNIVERSITY TIPS",
    title: "How to Write a Winning UK Personal Statement",
    excerpt: "Your UCAS personal statement is your first impression. Learn what admissions tutors are really looking for and common mistakes to avoid.",
    readTime: "6 min read",
    url: "https://www.ucas.com/undergraduate/applying-to-university/writing-personal-statement",
  },
  {
    tag: "FINANCE",
    title: "Funding Your UK Studies: Scholarships & Loans Explained",
    excerpt: "From Chevening to university-specific bursaries — a breakdown of funding options available to international students in the UK.",
    readTime: "7 min read",
    url: "https://www.britishcouncil.org/study-work-abroad/in-uk/experience/scholarships",
  },
  {
    tag: "CAREERS",
    title: "Graduate Route Visa: Work in the UK After Graduation",
    excerpt: "Everything you need to know about the Graduate Route Visa — who qualifies, how to apply, and what you can do with it.",
    readTime: "5 min read",
    url: "https://www.gov.uk/graduate-visa",
  },
  {
    tag: "STUDENT LIFE",
    title: "Arriving in the UK: Your First Week Checklist",
    excerpt: "Bank account, NHS registration, council tax exemption, and more — a practical checklist for newly arrived international students.",
    readTime: "4 min read",
    url: "https://www.ukcisa.org.uk",
  },
  {
    tag: "APPLICATIONS",
    title: "UCAS Deadlines 2026-27: Key Dates You Cannot Miss",
    excerpt: "A complete timeline of UCAS application deadlines, including early decision dates for Oxford, Cambridge, and medicine courses.",
    readTime: "3 min read",
    url: "https://www.ucas.com/undergraduate/applying-to-university/when-apply/ucas-undergraduate-deadlines",
  },
];

const TAG_COLORS: Record<string, string> = {
  "VISA GUIDE": "#2563EB",
  "UNIVERSITY TIPS": "#0F2D5E",
  "FINANCE": "#059669",
  "CAREERS": "#7C3AED",
  "STUDENT LIFE": "#D4963A",
  "APPLICATIONS": "#DC2626",
};

export default function BlogScreen() {
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
      <View style={[styles.header, { backgroundColor: colors.background, paddingTop: topPad + 20, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.navy} />
        </Pressable>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>RESOURCES & BLOG</Text>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Student Guides & Visa Info</Text>
        <Text style={[styles.headerSub, { color: colors.textSoft }]}>
          Expert advice on UK university applications, visas, and student life — all in one place.
        </Text>
      </View>

      {/* Articles */}
      <View style={styles.articles}>
        {ARTICLES.map((article) => (
          <Pressable
            key={article.title}
            onPress={() => Linking.openURL(article.url)}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.tagPill, { backgroundColor: (TAG_COLORS[article.tag] || colors.navy) + "15" }]}>
                <Text style={[styles.tagText, { color: TAG_COLORS[article.tag] || colors.navy }]}>{article.tag}</Text>
              </View>
              <View style={styles.readTime}>
                <Feather name="clock" size={11} color={colors.textSoft} />
                <Text style={[styles.readTimeText, { color: colors.textSoft }]}>{article.readTime}</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: colors.navy }]}>{article.title}</Text>
            <Text style={[styles.cardExcerpt, { color: colors.textSoft }]}>{article.excerpt}</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.readMore, { color: colors.navy }]}>Read more</Text>
              <Feather name="external-link" size={13} color={colors.navy} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Promo */}
      <View style={[styles.promo, { backgroundColor: colors.navy, marginHorizontal: 16, borderRadius: 16 }]}>
        <Text style={styles.promoTitle}>Have a Question?</Text>
        <Text style={styles.promoSub}>Our advisors can answer any question about applications, visas, or university life — for free.</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/apply")}
          style={[styles.promoBtn, { backgroundColor: colors.gold }]}
        >
          <Text style={[styles.promoBtnText, { color: colors.navy }]}>Ask an Advisor</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginBottom: 14,
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 30,
  },
  headerSub: {
    fontSize: 13,
    lineHeight: 20,
  },
  articles: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 8,
  },
  cardExcerpt: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  readMore: {
    fontSize: 12,
    fontWeight: "600",
  },
  promo: {
    padding: 24,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  promoSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  promoBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  promoBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
