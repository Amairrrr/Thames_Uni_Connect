import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const COURSES = [
  {
    icon: "briefcase",
    name: "Business & Management",
    careers: ["Manager", "Consultant", "Entrepreneur"],
    levels: ["BSc", "MSc", "MBA"],
  },
  {
    icon: "monitor",
    name: "Computer Science & IT",
    careers: ["Software Developer", "Data Analyst", "Cyber Security"],
    levels: ["BSc", "MSc", "MRes"],
  },
  {
    icon: "settings",
    name: "Engineering",
    careers: ["Civil Engineer", "Mechanical", "Project Manager"],
    levels: ["BEng", "MEng", "MSc"],
  },
  {
    icon: "heart",
    name: "Health & Social Care",
    careers: ["NHS Roles", "Care Manager", "Public Health"],
    levels: ["BSc", "MSc", "PGDip"],
  },
  {
    icon: "book-open",
    name: "Law (LLB / LLM)",
    careers: ["Solicitor", "Barrister", "Legal Advisor"],
    levels: ["LLB", "LLM", "LPC"],
  },
  {
    icon: "bar-chart-2",
    name: "Accounting & Finance",
    careers: ["Accountant", "Financial Analyst", "Auditor"],
    levels: ["BSc", "MSc", "MBA"],
  },
  {
    icon: "cpu",
    name: "Data Science & AI",
    careers: ["Data Scientist", "AI Engineer", "ML Specialist"],
    levels: ["BSc", "MSc", "MRes"],
  },
  {
    icon: "radio",
    name: "Marketing",
    careers: ["Digital Marketing", "Brand Manager", "PR Specialist"],
    levels: ["BA", "MSc", "MA"],
  },
  {
    icon: "award",
    name: "MBA / MRes / PhD / 2nd Master",
    careers: ["Director", "Researcher", "Senior Management"],
    levels: ["MBA", "MRes", "PhD"],
  },
];

function CourseCard({ course }: { course: typeof COURSES[0] }) {
  const colors = useColors();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => router.push("/(tabs)/apply")}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: "rgba(15,45,94,0.07)" }]}>
          <Feather name={course.icon as keyof typeof Feather.glyphMap} size={22} color={colors.navy} />
        </View>
        <Text style={[styles.cardName, { color: colors.navy }]}>{course.name}</Text>
        <View style={styles.levelsRow}>
          {course.levels.map((l) => (
            <View key={l} style={[styles.levelTag, { backgroundColor: "rgba(212,150,58,0.12)", borderColor: "rgba(212,150,58,0.3)" }]}>
              <Text style={[styles.levelText, { color: colors.gold }]}>{l}</Text>
            </View>
          ))}
        </View>
        <View style={styles.careersWrap}>
          {course.careers.map((c) => (
            <View key={c} style={[styles.careerTag, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.careerText, { color: colors.textMid }]}>{c}</Text>
            </View>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={[styles.enquireText, { color: colors.navy }]}>Enquire about this course</Text>
          <Feather name="arrow-right" size={13} color={colors.navy} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected
    ? COURSES.filter((c) => c.name === selected)
    : COURSES;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cream, paddingTop: topPad + 20 }]}>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>COURSE FINDER</Text>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>What Would You Like to Study?</Text>
        <Text style={[styles.headerSub, { color: colors.textSoft }]}>
          From undergraduate to PhD — we guide students across all major disciplines at universities worldwide.
        </Text>
      </View>

      {/* Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={[styles.chipsBar, { borderBottomColor: colors.border }]}
      >
        <Pressable
          onPress={() => setSelected(null)}
          style={[
            styles.chip,
            {
              backgroundColor: selected === null ? colors.navy : colors.card,
              borderColor: selected === null ? colors.navy : colors.border,
            },
          ]}
        >
          <Text style={[styles.chipText, { color: selected === null ? "#fff" : colors.textMid }]}>All</Text>
        </Pressable>
        {COURSES.map((c) => (
          <Pressable
            key={c.name}
            onPress={() => setSelected(selected === c.name ? null : c.name)}
            style={[
              styles.chip,
              {
                backgroundColor: selected === c.name ? colors.navy : colors.card,
                borderColor: selected === c.name ? colors.navy : colors.border,
              },
            ]}
          >
            <Feather name={c.icon as keyof typeof Feather.glyphMap} size={12} color={selected === c.name ? "#fff" : colors.textMid} />
            <Text style={[styles.chipText, { color: selected === c.name ? "#fff" : colors.textMid }]}>
              {c.name.split(" ")[0]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Cards */}
      <View style={styles.grid}>
        {filtered.map((c) => <CourseCard key={c.name} course={c} />)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 13,
    lineHeight: 20,
  },
  chipsBar: {
    borderBottomWidth: 1,
  },
  chips: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  levelsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  levelTag: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700",
  },
  careersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 14,
  },
  careerTag: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  careerText: {
    fontSize: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 12,
  },
  enquireText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
