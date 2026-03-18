import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PasswordInput } from "./components/forms/PasswordInput";
import { FormButton } from "./components/ui/FormButton";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { validatePassword, validatePasswordMatch } from "./utils/validation";
import { authService } from "./services/authService";
import { colors } from "./constants/colors";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    // Validate token exists
    if (!token) {
      Alert.alert(
        "Invalid Link",
        "The password reset link is invalid or has expired.",
        [
          {
            text: "Go to Sign In",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched({ ...touched, [field]: true });

    const newErrors = { ...errors };
    if (field === "password") {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(password)) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      } else {
        delete newErrors.password;
      }
    } else if (field === "confirmPassword") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (!validatePasswordMatch(password, confirmPassword)) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!token) {
      setError("Reset link is invalid. Please request a new one.");
      return;
    }

    if (validateForm()) {
      setError(null);
      setLoading(true);

      try {
        await authService.resetPassword(token, password, confirmPassword);

        Alert.alert(
          "Password Reset Successful",
          "Your password has been reset. You can now sign in with your new password.",
          [
            {
              text: "Sign In",
              onPress: () => router.replace("/login"),
            },
          ]
        );
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. The link may have expired.";
        setError(errorMessage);
        console.error("Reset password error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  if (!token) {
    return null; // Will show alert and redirect
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below. Make sure it's strong and unique.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <ErrorMessage message={error} visible={!!error} />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => handleBlur("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            required
          />

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password requirements:</Text>
            <Text
              style={[
                styles.requirement,
                password.length >= 8 && styles.requirementMet,
              ]}
            >
              • At least 8 characters
            </Text>
            <Text
              style={[
                styles.requirement,
                /[A-Z]/.test(password) && styles.requirementMet,
              ]}
            >
              • Contains uppercase letter
            </Text>
            <Text
              style={[
                styles.requirement,
                /[a-z]/.test(password) && styles.requirementMet,
              ]}
            >
              • Contains lowercase letter
            </Text>
            <Text
              style={[
                styles.requirement,
                /\d/.test(password) && styles.requirementMet,
              ]}
            >
              • Contains number
            </Text>
            <Text
              style={[
                styles.requirement,
                /[@$!%*?&]/.test(password) && styles.requirementMet,
              ]}
            >
              • Contains special character (@$!%*?&)
            </Text>
          </View>

          <FormButton
            title={loading ? "Resetting..." : "Reset Password"}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />

          <FormButton
            title="Back to Sign In"
            onPress={handleBackToLogin}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.darkText || "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray || "#666",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  passwordRequirements: {
    backgroundColor: colors.gray ? `${colors.gray}20` : "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.darkText || "#000",
    marginBottom: 10,
  },
  requirement: {
    fontSize: 12,
    color: colors.gray || "#999",
    marginBottom: 6,
    lineHeight: 16,
  },
  requirementMet: {
    color: colors.success || "#4CAF50",
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
