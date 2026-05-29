import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEnquiries } from "@/hooks/useEnquiries";

const MENU_ITEMS = [
  {
    icon: "bar-chart-2" as const,
    label: "My Enquiries",
    desc: "Track your application progress",
    route: "/enquiries",
    color: "#0F2D5E",
    badge: true,
  },
  {
    icon: "list" as const,
    label: "Our Services",
    desc: "8-step end-to-end support process",
    route: "/services",
    color: "#1B4080",
    badge: false,
  },
  {
    icon: "globe" as const,
    label: "Study Destinations",
    desc: "UK, USA, Canada, Australia & more",
    route: "/destinations",
    color: "#2563EB",
    badge: false,
  },
  {
    icon: "info" as const,
    label: "About Us",
    desc: "British Council certified, based in London",
    route: "/about",
    color: "#059669",
    badge: false,
  },
  {
    icon: "file-text" as const,
    label: "Resources & Blog",
    desc: "Guides, visa info, and student tips",
    route: "/blog",
    color: "#7C3AED",
    badge: false,
  },
];

const LINKS = [
  { icon: "shield" as const, label: "UK Student Visa", url: "https://www.gov.uk/student-visa", color: "#DC2626" },
  { icon: "trending-up" as const, label: "Graduate Route Visa", url: "https://www.gov.uk/graduate-visa", color: "#7C3AED" },
  { icon: "book-open" as const, label: "UCAS Application Guide", url: "https://www.ucas.com/undergraduate/applying-to-university", color: "#D97706" },
  { icon: "activity" as const, label: "NHS Health Surcharge", url: "https://www.gov.uk/healthcare-immigration-application/how-much-pay", color: "#059669" },
];

function MenuItem({ item, badgeCount }: { item: typeof MENU_ITEMS[0]; badgeCount?: number }) {
  const colors = useColors();
  const scale = React.useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(item.route as any);
      }}
    >
      <Animated.View
        style={[
          styles.menuItem,
          { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale }] },
        ]}
      >
        <View style={[styles.menuIcon, { backgroundColor: item.color + "14" }]}>
          <Feather name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuLabel, { color: colors.navy }]}>{item.label}</Text>
          <Text style={[styles.menuDesc, { color: colors.textSoft }]}>{item.desc}</Text>
        </View>
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.gold }]}>
            <Text style={[styles.badgeText, { color: colors.navy }]}>{badgeCount}</Text>
          </View>
        )}
        <Feather name="chevron-right" size={16} color={colors.textSoft} />
      </Animated.View>
    </Pressable>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const { enquiries } = useEnquiries();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with logo */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.cream, borderBottomColor: colors.border }]}>
        <Image
          source={require("@/assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.tagline, { color: colors.textSoft }]}>
          Bridging Students and Futures
        </Text>
        <View style={[styles.certBadge, { backgroundColor: "rgba(212,150,58,0.12)", borderColor: "rgba(212,150,58,0.3)" }]}>
          <Feather name="award" size={13} color={colors.gold} />
          <Text style={[styles.certBadgeText, { color: colors.gold }]}>BRITISH COUNCIL CERTIFIED · LONDON, UK</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Explore</Text>
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.label}
              item={item}
              badgeCount={item.badge ? enquiries.length : undefined}
            />
          ))}
        </View>
      </View>

      {/* Official Links */}
      <View style={[styles.section, { paddingTop: 0 }]}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Official Resources</Text>
        <View style={styles.menuList}>
          {LINKS.map((link) => (
            <Pressable
              key={link.label}
              onPress={() => Linking.openURL(link.url)}
              style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.menuIcon, { backgroundColor: link.color + "14" }]}>
                <Feather name={link.icon} size={18} color={link.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.navy, flex: 1 }]}>{link.label}</Text>
              <Feather name="external-link" size={14} color={colors.textSoft} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Contact */}
      <View style={[styles.contactCard, { backgroundColor: colors.navy, marginHorizontal: 16, borderRadius: 16 }]}>
        <Text style={styles.contactTitle}>Get in Touch</Text>
        <Text style={styles.contactSub}>Monday – Saturday · 9am – 7pm GMT</Text>
        <Pressable
          onPress={() => Linking.openURL("https://wa.me/447359854658")}
          style={[styles.contactBtn, { backgroundColor: "#25D366" }]}
        >
          <Feather name="message-circle" size={16} color="#fff" />
          <Text style={styles.contactBtnText}>WhatsApp: +44 7359 854658</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL("mailto:admin@thamesuniconnect.com")}
          style={[styles.contactBtnEmail, { borderColor: "rgba(255,255,255,0.25)" }]}
        >
          <Feather name="mail" size={16} color="rgba(255,255,255,0.85)" />
          <Text style={styles.contactBtnEmailText}>admin@thamesuniconnect.com</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 12,
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  certBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 11,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  contactCard: {
    padding: 24,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  contactSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 20,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  contactBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  contactBtnEmail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginTop: 8,
    borderWidth: 1.5,
  },
  contactBtnEmailText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
});
