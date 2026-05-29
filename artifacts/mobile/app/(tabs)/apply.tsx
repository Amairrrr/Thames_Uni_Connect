import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { useEnquiries } from "@/hooks/useEnquiries";

const COUNTRIES = [
  "India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Afghanistan",
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Saudi Arabia", "UAE", "Qatar", "Jordan",
  "Philippines", "Malaysia", "Indonesia", "Vietnam", "Thailand", "Singapore",
  "Germany", "France", "Italy", "Spain", "Poland", "Romania", "Turkey",
  "United States", "Canada", "Brazil", "Colombia", "Mexico",
  "China", "Japan", "South Korea", "Australia", "New Zealand",
  "Other",
];

const DESTINATIONS = [
  "United Kingdom", "United States", "Canada", "Australia", "New Zealand", "Germany", "France", "Europe (Other)",
];

const COURSES = [
  "Business & Management", "Computer Science & IT", "Engineering",
  "Health & Social Care", "Law (LLB / LLM)", "Accounting & Finance",
  "Marketing", "Data Science & AI", "Nursing", "MBA",
  "MRes / DBA / PhD / 2nd Master",
];

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
};

function SelectField({ label, value, options, onSelect }: SelectFieldProps) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.textMid }]}>{label.toUpperCase()}</Text>
      <Pressable
        onPress={() => setOpen(!open)}
        style={[styles.selectBox, { borderColor: open ? colors.navy : colors.border, backgroundColor: colors.card }]}
      >
        <Text style={[styles.selectText, { color: value ? colors.text : colors.textSoft }]}>
          {value || `— Select ${label} —`}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={15} color={colors.textSoft} />
      </Pressable>
      {open && (
        <View style={[styles.dropdown, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); }}
              style={[
                styles.dropdownItem,
                { borderBottomColor: colors.border },
                value === opt && { backgroundColor: "rgba(15,45,94,0.05)" },
              ]}
            >
              <Text style={[styles.dropdownText, { color: value === opt ? colors.navy : colors.text }]}>
                {opt}
              </Text>
              {value === opt && <Feather name="check" size={14} color={colors.navy} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const { addEnquiry } = useEnquiries();

  const [country, setCountry] = useState("");
  const [destination, setDestination] = useState("");
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = country && destination && course && name.trim().length > 1 && phone.trim().length > 5;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert("Missing Information", "Please fill in all fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await addEnquiry({ name: name.trim(), phone: phone.trim(), country, destination, course });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCountry(""); setDestination(""); setCourse(""); setName(""); setPhone("");
    setSubmitted(false);
  };

  const handleWhatsApp = () => {
    const msg = `Hi! I'm interested in studying ${course} in ${destination}. My name is ${name} and I'm from ${country}. Contact: ${phone}`;
    Linking.openURL(`https://wa.me/447359854658?text=${encodeURIComponent(msg)}`);
  };

  if (submitted) {
    return (
      <View style={[styles.successScreen, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.successIcon, { backgroundColor: "rgba(5,150,105,0.1)" }]}>
          <Feather name="check-circle" size={48} color={colors.green} />
        </View>
        <Text style={[styles.successTitle, { color: colors.navy }]}>Enquiry Submitted!</Text>
        <Text style={[styles.successSub, { color: colors.textSoft }]}>
          Our advisors will be in touch within 24 hours. Monday – Saturday, 9am – 7pm GMT.
        </Text>
        <Text style={[styles.successName, { color: colors.textMid }]}>Thank you, {name}!</Text>

        <Pressable
          onPress={() => router.push("/enquiries")}
          style={[styles.trackerBtn, { backgroundColor: colors.navy }]}
        >
          <Feather name="bar-chart-2" size={16} color="#fff" />
          <Text style={styles.trackerBtnText}>Track My Application</Text>
        </Pressable>

        <Pressable
          onPress={handleWhatsApp}
          style={[styles.waBtn, { backgroundColor: "#25D366" }]}
        >
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.waBtnText}>Also message us on WhatsApp</Text>
        </Pressable>
        <Pressable onPress={handleReset} style={[styles.resetBtn, { borderColor: colors.border }]}>
          <Text style={[styles.resetText, { color: colors.textMid }]}>Submit another enquiry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad + 20 }]}>
        <Text style={[styles.headerLabel, { color: colors.gold }]}>100% FREE SERVICE</Text>
        <Text style={styles.headerTitle}>Request a Free{"\n"}Consultation</Text>
        <Text style={styles.headerSub}>
          Complete the form and our team will be in touch within 24 hours.
        </Text>
      </View>

      {/* Form */}
      <View style={[styles.form, { backgroundColor: colors.background }]}>
        <SelectField label="Country of Residence" value={country} options={COUNTRIES} onSelect={setCountry} />
        <SelectField label="Desired Study Destination" value={destination} options={DESTINATIONS} onSelect={setDestination} />
        <SelectField label="Course Interest" value={course} options={COURSES} onSelect={setCourse} />

        {/* Name */}
        <View style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: colors.textMid }]}>FULL NAME</Text>
          <View style={[styles.inputBox, { borderColor: name.length > 0 ? colors.navy : colors.border, backgroundColor: colors.card }]}>
            <Feather name="user" size={15} color={colors.textSoft} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSoft}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: colors.textMid }]}>WHATSAPP / CONTACT NUMBER</Text>
          <View style={[styles.inputBox, { borderColor: phone.length > 0 ? colors.navy : colors.border, backgroundColor: colors.card }]}>
            <Feather name="phone" size={15} color={colors.textSoft} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Include country code e.g. +44, +91"
              placeholderTextColor={colors.textSoft}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitBtn,
            { backgroundColor: isValid ? colors.navy : colors.muted },
          ]}
        >
          <Text style={[styles.submitText, { color: isValid ? "#fff" : colors.textSoft }]}>
            {submitting ? "Saving…" : "Submit Enquiry"}
          </Text>
          {!submitting && <Feather name="arrow-right" size={16} color={isValid ? "#fff" : colors.textSoft} />}
        </Pressable>
        <Text style={[styles.formNote, { color: colors.textSoft }]}>
          Our advisors are available Monday – Saturday, 9am – 7pm (GMT).
        </Text>

        {/* WhatsApp alternative */}
        <View style={[styles.divider, { borderTopColor: colors.border }]}>
          <Text style={[styles.dividerText, { color: colors.textSoft, backgroundColor: colors.background }]}>or connect directly</Text>
        </View>
        <Pressable
          onPress={() => Linking.openURL("https://wa.me/447359854658")}
          style={[styles.waAlt, { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }]}
        >
          <Feather name="message-circle" size={18} color="#25D366" />
          <View>
            <Text style={[styles.waAltTitle, { color: "#166534" }]}>Chat on WhatsApp</Text>
            <Text style={[styles.waAltSub, { color: "#16A34A" }]}>+44 7359 854658</Text>
          </View>
          <Feather name="external-link" size={14} color="#4ADE80" style={{ marginLeft: "auto" }} />
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
  form: {
    padding: 20,
    gap: 4,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  selectText: {
    fontSize: 13,
    flex: 1,
  },
  dropdown: {
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 200,
    overflow: "scroll",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 13,
    flex: 1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
  },
  formNote: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 14,
  },
  dividerText: {
    fontSize: 12,
    marginTop: -8,
    paddingHorizontal: 12,
  },
  waAlt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  waAltTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  waAltSub: {
    fontSize: 12,
  },
  successScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  successSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  successName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 28,
  },
  trackerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  trackerBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  waBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    marginBottom: 12,
  },
  waBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  resetBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    width: "100%",
    alignItems: "center",
  },
  resetText: {
    fontSize: 14,
  },
});
