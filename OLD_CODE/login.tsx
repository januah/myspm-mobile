import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/forms/LoginForm";
import { FormButton } from "./components/ui/FormButton";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { colors } from "./constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Navigate to onboarding or home after successful login
      // This will be handled by the root layout's auth check
      router.replace("/");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to sign in. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleOpenPolicy = async () => {
    const policyUrl =
      process.env.EXPO_PUBLIC_POLICY_URL || "https://myspm.io/privacy";
    try {
      await Linking.openURL(policyUrl);
    } catch (err) {
      console.error("Failed to open privacy policy:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MySPM</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* OAuth Buttons Placeholder */}
        <View style={styles.oauthContainer}>
          <FormButton
            title="Google"
            onPress={() => console.log("Google login")}
            variant="secondary"
            disabled
            style={styles.oauthButton}
          />
          <FormButton
            title="Apple"
            onPress={() => console.log("Apple login")}
            variant="secondary"
            disabled
            style={styles.oauthButton}
          />
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity onPress={handleOpenPolicy}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity disabled>
            <Text style={[styles.link, styles.signupLink]}>Sign up</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary || "#007AFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray || "#666",
  },
  formContainer: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray || "#DDD",
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.gray || "#666",
    fontSize: 14,
  },
  oauthContainer: {
    gap: 12,
  },
  oauthButton: {
    marginBottom: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.gray || "#DDD",
    marginHorizontal: 12,
  },
  link: {
    color: colors.primary || "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 16,
  },
  signupText: {
    color: colors.darkText || "#000",
    fontSize: 14,
  },
  signupLink: {
    marginHorizontal: 0,
  },
});
