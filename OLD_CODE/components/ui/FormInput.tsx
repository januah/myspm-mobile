import React from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { colors } from "../../constants/colors";

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, required, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={colors.gray}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.darkText || "#000",
  },
  required: {
    color: colors.error || "#E53935",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray || "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.darkText || "#000",
  },
  inputError: {
    borderColor: colors.error || "#E53935",
  },
  errorText: {
    color: colors.error || "#E53935",
    fontSize: 12,
    marginTop: 4,
  },
});