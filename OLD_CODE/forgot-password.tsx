import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { FormInput } from "./components/ui/FormInput";
import { FormButton } from "./components/ui/FormButton";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { validateEmail } from "./utils/validation";
import { authService } from "./services/authService";
import { colors } from "./constants/colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailError = touched && !validateEmail(email) ? "Invalid email" : undefined;

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reset email. Please try again.";
      setError(errorMessage);
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to {email}. Please check your
              inbox and follow the instructions to reset your password.
            </Text>

            <View style={styles.successSteps}>
              <Text style={styles.stepsTitle}>Next steps:</Text>
              <Text style={styles.step}>1. Check your email inbox</Text>
              <Text style={styles.step}>2. Click the reset password link</Text>
              <Text style={styles.step}>3. Create a new password</Text>
              <Text style={styles.step}>
                4. Sign in with your new password
              </Text>
            </View>

            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>

            <FormButton
              title="Back to Sign In"
              onPress={handleBackToLogin}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your
            password
          </Text>
        </View>

        <View style={styles.formContainer}>
          <ErrorMessage message={error} visible={!!error} />

          <FormInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched(true)}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <FormButton
            title={loading ? "Sending..." : "Send Reset Link"}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !email.trim()}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Remember your password?{" "}
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Text>
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.primary || "#007AFF",
    fontSize: 16,
    fontWeight: "600",
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
  button: {
    marginTop: 20,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.darkText || "#000",
  },
  link: {
    color: colors.primary || "#007AFF",
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary || "#007AFF",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: colors.darkText || "#000",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  successSteps: {
    backgroundColor: colors.gray ? `${colors.gray}20` : "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkText || "#000",
    marginBottom: 12,
  },
  step: {
    fontSize: 14,
    color: colors.darkText || "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 14,
    color: colors.gray || "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
});
