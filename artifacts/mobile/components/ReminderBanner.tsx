import { Feather } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { Reminder } from "@/hooks/useReminders";

export function ReminderBanner({
  reminder,
  onDismiss,
}: {
  reminder: Reminder;
  onDismiss: (id: string) => void;
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => onDismiss(reminder.id));
  };

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: reminder.color + "12",
          borderLeftColor: reminder.color,
          opacity,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: reminder.color + "20" }]}>
        <Feather
          name={reminder.icon as keyof typeof Feather.glyphMap}
          size={15}
          color={reminder.color}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: reminder.color }]}>
          {reminder.title}
        </Text>
        <Text style={styles.message}>{reminder.message}</Text>
      </View>
      <Pressable onPress={handleDismiss} style={styles.close} hitSlop={8}>
        <Feather name="x" size={14} color="#9CA3AF" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderLeftWidth: 3,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
  },
  message: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 15,
  },
  close: {
    padding: 4,
  },
});
