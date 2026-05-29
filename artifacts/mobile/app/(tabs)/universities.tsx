import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const PARTNER_UNIS = [
  { abbr: "UEL", name: "University of East London", url: "https://www.uel.ac.uk", location: "London", type: "Partner" },
  { abbr: "BPP", name: "BPP University", url: "https://www.bpp.com", location: "London", type: "Partner" },
  { abbr: "UoG", name: "University of Greenwich", url: "https://www.gre.ac.uk", location: "London", type: "Partner" },
  { abbr: "UH", name: "University of Hertfordshire", url: "https://www.herts.ac.uk", location: "Hertfordshire", type: "Partner" },
  { abbr: "UoB", name: "University of Bedfordshire", url: "https://www.beds.ac.uk", location: "Bedford", type: "Partner" },
  { abbr: "MDX", name: "Middlesex University", url: "https://www.mdx.ac.uk", location: "London", type: "Partner" },
  { abbr: "SUN", name: "University of Sunderland", url: "https://www.sunderland.ac.uk", location: "Sunderland", type: "Partner" },
  { abbr: "CU", name: "Coventry University", url: "https://www.coventry.ac.uk", location: "Coventry", type: "Partner" },
  { abbr: "DMU", name: "De Montfort University", url: "https://www.dmu.ac.uk", location: "Leicester", type: "Partner" },
  { abbr: "UWL", name: "University of West London", url: "https://www.uwl.ac.uk", location: "London", type: "Partner" },
];

const ALL_UK_NOTE = "In addition to our 10 direct partners, we support applications to ALL universities across the UK — including Russell Group institutions, specialist colleges, and research universities.";

function UniRow({ uni }: { uni: typeof PARTNER_UNIS[0] }) {
  const colors = useColors();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(uni.url);
  };

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.uniRow,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={[styles.uniAbbrBox, { backgroundColor: colors.navy }]}>
          <Text style={[styles.uniAbbrText, { color: colors.gold }]}>{uni.abbr}</Text>
        </View>
        <View style={styles.uniInfo}>
          <Text style={[styles.uniName, { color: colors.navy }]}>{uni.name}</Text>
          <View style={styles.uniMeta}>
            <Feather name="map-pin" size={11} color={colors.textSoft} />
            <Text style={[styles.uniLoc, { color: colors.textSoft }]}>{uni.location}</Text>
          </View>
        </View>
        <View style={[styles.partnerBadge, { backgroundColor: "rgba(212,150,58,0.12)", borderColor: "rgba(212,150,58,0.3)" }]}>
          <Text style={[styles.partnerBadgeText, { color: colors.gold }]}>PARTNER</Text>
        </View>
        <Feather name="external-link" size={14} color={colors.textSoft} style={{ marginLeft: 4 }} />
      </Animated.View>
    </Pressable>
  );
}

export default function UniversitiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const [search, setSearch] = useState("");

  const filtered = PARTNER_UNIS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.abbr.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad + 20 }]}>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>UNIVERSITY ACCESS</Text>
        <Text style={styles.headerTitle}>Every UK University.{"\n"}One Expert Team.</Text>
        <Text style={styles.headerSub}>
          We hold direct partnerships with 10 UK universities — and support applications to all universities across the UK.
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textSoft} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search partner universities..."
            placeholderTextColor={colors.textSoft}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={15} color={colors.textSoft} />
            </Pressable>
          )}
        </View>
      </View>

      {/* All UK Note */}
      <View style={[styles.allUkNote, { backgroundColor: "#EFF6FF", borderLeftColor: "#2563EB" }]}>
        <Feather name="info" size={15} color="#2563EB" />
        <Text style={[styles.allUkNoteText, { color: "#1E40AF" }]}>{ALL_UK_NOTE}</Text>
      </View>

      {/* Partner List */}
      <View style={styles.listSection}>
        <Text style={[styles.listTitle, { color: colors.navy }]}>
          Direct Partner Universities ({filtered.length})
        </Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="search" size={32} color={colors.textSoft} />
            <Text style={[styles.emptyText, { color: colors.textSoft }]}>No universities found</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((u) => <UniRow key={u.abbr} uni={u} />)}
          </View>
        )}
      </View>

      {/* UCAS Link */}
      <View style={styles.linksSection}>
        <Text style={[styles.linksTitle, { color: colors.navy }]}>Explore More</Text>
        <Pressable
          onPress={() => Linking.openURL("https://www.ucas.com")}
          style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.linkIcon, { backgroundColor: "rgba(15,45,94,0.08)" }]}>
            <Feather name="external-link" size={16} color={colors.navy} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={[styles.linkName, { color: colors.navy }]}>Explore All UK Universities via UCAS</Text>
            <Text style={[styles.linkUrl, { color: colors.textSoft }]}>ucas.com</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textSoft} />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL("https://www.gov.uk/student-visa")}
          style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.linkIcon, { backgroundColor: "rgba(15,45,94,0.08)" }]}>
            <Feather name="shield" size={16} color={colors.navy} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={[styles.linkName, { color: colors.navy }]}>UK Student Visa — Official Gov.uk</Text>
            <Text style={[styles.linkUrl, { color: colors.textSoft }]}>gov.uk</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textSoft} />
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
  searchWrap: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  allUkNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 16,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  allUkNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  listSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
  uniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
  },
  uniAbbrBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  uniAbbrText: {
    fontSize: 14,
    fontWeight: "700",
  },
  uniInfo: {
    flex: 1,
  },
  uniName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  uniMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  uniLoc: {
    fontSize: 11,
  },
  partnerBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  partnerBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
  },
  linksSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  linksTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  linkInfo: {
    flex: 1,
  },
  linkName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 11,
  },
});
