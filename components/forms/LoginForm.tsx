import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FormInput } from "../ui/FormInput";
import { FormButton } from "../ui/FormButton";
import { ErrorMessage } from "../ui/ErrorMessage";
import { PasswordInput } from "./PasswordInput";
import { validateEmail, validatePassword } from "../../utils/validation";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error: externalError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });

    // Validate field on blur
    const newErrors = { ...errors };
    if (field === "email") {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    } else if (field === "password") {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(password)) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit(email, password);
      } catch (err) {
        // Error is displayed via externalError prop
        console.error("Login error:", err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ErrorMessage message={externalError} visible={!!externalError} />

        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : undefined}
          keyboardType="email-address"
          autoCapitalize="none"
          required
          testID="login-email-input"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => handleBlur("password")}
          error={touched.password ? errors.password : undefined}
          required
          testID="login-password-input"
        />

        <FormButton
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          testID="login-submit-button"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});