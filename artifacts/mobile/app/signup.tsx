import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
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
import { useAuth } from "@/hooks/useAuth";

const COUNTRIES = [
  "India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Afghanistan",
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Saudi Arabia", "UAE", "Qatar", "Jordan",
  "Philippines", "Malaysia", "Indonesia", "Vietnam", "Thailand", "Singapore",
  "Germany", "France", "Italy", "Spain", "Poland", "Romania", "Turkey",
  "United States", "Canada", "Brazil", "Colombia", "Mexico",
  "China", "Japan", "South Korea", "Australia", "New Zealand",
  "Other",
];

const COURSE_INTERESTS = [
  "Business & Management", "Computer Science & IT", "Engineering",
  "Health & Social Care", "Law (LLB / LLM)", "Accounting & Finance",
  "Marketing", "Data Science & AI", "Nursing", "MBA",
  "MRes / DBA / PhD / 2nd Master", "Not sure yet",
];

function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  placeholder: string;
}) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.textMid }]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(!open)}
        style={[
          styles.selectBox,
          {
            borderColor: open ? colors.navy : value ? colors.navy : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Text style={[styles.selectText, { color: value ? colors.text : colors.textSoft }]}>
          {value || placeholder}
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
              {value === opt && <Feather name="check" size={13} color={colors.navy} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType,
  autoCapitalize,
  autoComplete,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: keyof typeof Feather.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "words" | "sentences";
  autoComplete?: "email" | "name" | "tel" | "off";
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.textMid }]}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          {
            borderColor: focused ? colors.navy : value.length > 0 ? colors.navy : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Feather name={icon} size={16} color={focused ? colors.navy : colors.textSoft} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoft}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType || "default"}
          autoCapitalize={autoCapitalize || "sentences"}
          autoComplete={autoComplete || "off"}
        />
        {value.length > 0 && (
          <Feather name="check-circle" size={14} color={colors.green} />
        )}
      </View>
    </View>
  );
}

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [courseInterest, setCourseInterest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length > 5 &&
    country &&
    courseInterest &&
    agreed;

  const handleSignUp = async () => {
    if (!isValid) {
      Alert.alert("Please complete all fields", "Fill in every field and accept the terms to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country,
        courseInterest,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  const completedFields = [
    name.trim().length > 1,
    email.includes("@"),
    phone.trim().length > 5,
    !!country,
    !!courseInterest,
  ].filter(Boolean).length;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 16, backgroundColor: colors.navy }]}>
          <View style={styles.logoWrap}>
            <Image
              source={require("@/assets/images/logo-transparent.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.certBadge, { backgroundColor: "rgba(212,150,58,0.15)", borderColor: "rgba(212,150,58,0.4)" }]}>
            <Feather name="award" size={12} color={colors.gold} />
            <Text style={[styles.certText, { color: colors.gold }]}>BRITISH COUNCIL CERTIFIED · LONDON, UK</Text>
          </View>
          <Text style={styles.headerTitle}>Welcome to{"\n"}Thames Uni Connect</Text>
          <Text style={styles.headerSub}>
            Create your free account to access personalised university guidance and track your admissions journey.
          </Text>
        </View>

        {/* ── Progress ── */}
        <View style={[styles.progressSection, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={styles.progressRow}>
            {[1, 2, 3, 4, 5].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: step <= completedFields ? colors.navy : colors.border,
                    flex: 1,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.progressLabel, { color: colors.textSoft }]}>
            {completedFields} of 5 fields completed
          </Text>
        </View>

        {/* ── Form ── */}
        <View style={[styles.form, { backgroundColor: colors.background }]}>
          <InputField
            label="Full Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Priya Sharma"
            icon="user"
            autoCapitalize="words"
            autoComplete="name"
          />
          <InputField
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <InputField
            label="WhatsApp / Phone Number *"
            value={phone}
            onChangeText={setPhone}
            placeholder="Include country code e.g. +44, +91"
            icon="phone"
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <SelectField
            label="Country of Residence *"
            value={country}
            options={COUNTRIES}
            onSelect={setCountry}
            placeholder="— Select your country —"
          />
          <SelectField
            label="Course Interest *"
            value={courseInterest}
            options={COURSE_INTERESTS}
            onSelect={setCourseInterest}
            placeholder="— What would you like to study? —"
          />

          {/* Terms */}
          <Pressable
            onPress={() => setAgreed(!agreed)}
            style={styles.termsRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: agreed ? colors.navy : colors.background,
                  borderColor: agreed ? colors.navy : colors.border,
                },
              ]}
            >
              {agreed && <Feather name="check" size={12} color="#fff" />}
            </View>
            <Text style={[styles.termsText, { color: colors.textMid }]}>
              I agree to be contacted by Thames Uni Connect regarding my university application. Our service is completely free.
            </Text>
          </Pressable>

          {/* Submit */}
          <Pressable
            onPress={handleSignUp}
            disabled={submitting || !isValid}
            style={[
              styles.submitBtn,
              {
                backgroundColor: isValid ? colors.navy : colors.muted,
                opacity: submitting ? 0.7 : 1,
              },
            ]}
          >
            {submitting ? (
              <Text style={[styles.submitText, { color: isValid ? "#fff" : colors.textSoft }]}>Creating Account…</Text>
            ) : (
              <>
                <Text style={[styles.submitText, { color: isValid ? "#fff" : colors.textSoft }]}>
                  Get Started — It's Free
                </Text>
                <Feather name="arrow-right" size={17} color={isValid ? "#fff" : colors.textSoft} />
              </>
            )}
          </Pressable>

          {/* Trust note */}
          <View style={styles.trustRow}>
            {[
              { icon: "shield" as const, text: "No fees ever" },
              { icon: "lock" as const, text: "Your data is safe" },
              { icon: "user-check" as const, text: "Expert advisors" },
            ].map((t) => (
              <View key={t.text} style={styles.trustItem}>
                <Feather name={t.icon} size={12} color={colors.textSoft} />
                <Text style={[styles.trustText, { color: colors.textSoft }]}>{t.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: "center",
  },
  logoWrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 60,
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  certText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 10,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  progressRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 6,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    textAlign: "right",
  },
  form: {
    padding: 20,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 7,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  selectText: {
    fontSize: 14,
    flex: 1,
  },
  dropdown: {
    borderWidth: 1.5,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    overflow: "scroll",
    zIndex: 100,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trustText: {
    fontSize: 11,
  },
});
