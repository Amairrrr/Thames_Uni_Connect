import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Enquiry, EnquiryStatus, useEnquiries } from "@/hooks/useEnquiries";

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; color: string; bg: string; icon: keyof typeof Feather.glyphMap }
> = {
  pending: {
    label: "Awaiting Contact",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: "clock",
  },
  contacted: {
    label: "Advisor in Touch",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: "phone",
  },
  in_progress: {
    label: "Application Active",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: "loader",
  },
  completed: {
    label: "Process Complete",
    color: "#059669",
    bg: "#ECFDF5",
    icon: "check-circle",
  },
};

const STATUS_STEPS: EnquiryStatus[] = ["pending", "contacted", "in_progress", "completed"];

function EnquiryCard({
  enquiry,
  onUpdateStatus,
  onDelete,
}: {
  enquiry: Enquiry;
  onUpdateStatus: (id: string, status: EnquiryStatus) => void;
  onDelete: (id: string) => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[enquiry.status];
  const currentStep = STATUS_STEPS.indexOf(enquiry.status);

  const date = new Date(enquiry.submittedAt);
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleAdvance = () => {
    const next = STATUS_STEPS[currentStep + 1];
    if (next) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onUpdateStatus(enquiry.id, next);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Enquiry",
      "Are you sure you want to remove this enquiry from your tracker?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onDelete(enquiry.id);
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {/* Card header */}
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.cardHeader}
      >
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Feather name={cfg.icon} size={12} color={cfg.color} />
          <Text style={[styles.statusLabel, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={[styles.dateStr, { color: colors.textSoft }]}>
            {dateStr}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={15}
            color={colors.textSoft}
          />
        </View>
      </Pressable>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <Text style={[styles.cardName, { color: colors.navy }]}>
          {enquiry.name}
        </Text>
        <Text style={[styles.cardCourse, { color: colors.textMid }]}>
          {enquiry.course}
        </Text>
      </View>
      <View style={styles.destRow}>
        <Feather name="map-pin" size={11} color={colors.textSoft} />
        <Text style={[styles.destText, { color: colors.textSoft }]}>
          {enquiry.country} → {enquiry.destination}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: cfg.color,
              width: `${((currentStep + 1) / STATUS_STEPS.length) * 100}%` as `${number}%`,
            },
          ]}
        />
      </View>
      <View style={styles.progressSteps}>
        {STATUS_STEPS.map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressStep,
              {
                backgroundColor:
                  i <= currentStep ? cfg.color : colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Expanded section */}
      {expanded && (
        <View
          style={[
            styles.expandedSection,
            { borderTopColor: colors.border },
          ]}
        >
          <View style={styles.detailRow}>
            <Feather name="phone" size={13} color={colors.textSoft} />
            <Text style={[styles.detailText, { color: colors.textMid }]}>
              {enquiry.phone}
            </Text>
          </View>

          {/* Status steps */}
          <Text style={[styles.stepsLabel, { color: colors.navy }]}>
            Update Progress
          </Text>
          <View style={styles.statusButtons}>
            {STATUS_STEPS.map((s) => {
              const sCfg = STATUS_CONFIG[s];
              const isActive = s === enquiry.status;
              return (
                <Pressable
                  key={s}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onUpdateStatus(enquiry.id, s);
                  }}
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor: isActive ? sCfg.bg : colors.background,
                      borderColor: isActive ? sCfg.color : colors.border,
                    },
                  ]}
                >
                  <Feather
                    name={sCfg.icon}
                    size={12}
                    color={isActive ? sCfg.color : colors.textSoft}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      {
                        color: isActive ? sCfg.color : colors.textSoft,
                      },
                    ]}
                  >
                    {sCfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {currentStep < STATUS_STEPS.length - 1 && (
              <Pressable
                onPress={handleAdvance}
                style={[
                  styles.advanceBtn,
                  { backgroundColor: colors.navy },
                ]}
              >
                <Text style={styles.advanceBtnText}>
                  Mark as{" "}
                  {STATUS_CONFIG[STATUS_STEPS[currentStep + 1]].label}
                </Text>
                <Feather name="arrow-right" size={13} color="#fff" />
              </Pressable>
            )}
            <Pressable onPress={handleDelete} style={styles.deleteBtn}>
              <Feather name="trash-2" size={13} color="#EF4444" />
              <Text style={styles.deleteBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default function EnquiriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const { enquiries, loading, updateStatus, removeEnquiry } = useEnquiries();

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <Feather name="loader" size={28} color={colors.navy} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.navy, paddingTop: topPad + 20 },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>
          MY ENQUIRIES
        </Text>
        <Text style={styles.headerTitle}>Application Tracker</Text>
        <Text style={styles.headerSub}>
          Track every enquiry you have submitted and monitor your progress through the admissions journey.
        </Text>
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statChip,
              { backgroundColor: "rgba(255,255,255,0.1)" },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.gold }]}>
              {enquiries.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          {(Object.keys(STATUS_CONFIG) as EnquiryStatus[]).map((s) => {
            const count = enquiries.filter((e) => e.status === s).length;
            if (count === 0) return null;
            const cfg = STATUS_CONFIG[s];
            return (
              <View
                key={s}
                style={[
                  styles.statChip,
                  { backgroundColor: "rgba(255,255,255,0.1)" },
                ]}
              >
                <Text style={[styles.statNum, { color: cfg.color }]}>
                  {count}
                </Text>
                <Text style={styles.statLabel}>{cfg.label.split(" ")[0]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Empty state */}
      {enquiries.length === 0 ? (
        <View style={styles.emptyState}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: "rgba(15,45,94,0.06)" },
            ]}
          >
            <Feather name="inbox" size={40} color={colors.navy} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.navy }]}>
            No Enquiries Yet
          </Text>
          <Text style={[styles.emptySub, { color: colors.textSoft }]}>
            Your submitted enquiries will appear here so you can track your
            admissions journey.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/apply")}
            style={[styles.emptyBtn, { backgroundColor: colors.navy }]}
          >
            <Text style={styles.emptyBtnText}>Submit Your First Enquiry</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              onUpdateStatus={updateStatus}
              onDelete={removeEnquiry}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    marginBottom: 10,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  statNum: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  dateStr: {
    fontSize: 11,
  },
  summaryRow: {
    marginBottom: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardCourse: {
    fontSize: 13,
    marginBottom: 5,
  },
  destRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  destText: {
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: "row",
    gap: 4,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  expandedSection: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
  },
  stepsLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  statusButtons: {
    gap: 6,
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    gap: 8,
    marginTop: 4,
  },
  advanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 10,
  },
  advanceBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  deleteBtnText: {
    color: "#EF4444",
    fontSize: 12,
  },
});
