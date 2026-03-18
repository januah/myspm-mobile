import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  visible = true,
}) => {
  if (!message || !visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.error ? `${colors.error}20` : "#FFE5E5",
    borderLeftWidth: 4,
    borderLeftColor: colors.error || "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  text: {
    color: colors.error || "#E53935",
    fontSize: 14,
    fontWeight: "500",
  },
});