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
import { LoginForm } from "../components/forms/LoginForm";
import { FormButton } from "../components/ui/FormButton";
import { colors } from "../constants/colors";

export default function LoginScreen({
  navigation,
}: {
  navigation: { navigate: (name: string) => void; push: (name: string) => void };
}) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (_email: string, _password: string) => {
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Main");
    }, 800);
  };

  const handleForgotPassword = () => {
    navigation.push("ForgotPassword");
  };

  const handleOpenPolicy = () => {
    Linking.openURL("https://myspm.io/privacy").catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>MySPM</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.oauthContainer}>
          <FormButton
            title="Google"
            onPress={() => {}}
            variant="secondary"
            disabled
            style={styles.oauthButton}
          />
          <FormButton
            title="Apple"
            onPress={() => {}}
            variant="secondary"
            disabled
            style={styles.oauthButton}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity onPress={handleOpenPolicy}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

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
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
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
    backgroundColor: colors.gray,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.gray,
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
    backgroundColor: colors.gray,
    marginHorizontal: 12,
  },
  link: {
    color: colors.primary,
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
    color: colors.darkText,
    fontSize: 14,
  },
  signupLink: {
    marginHorizontal: 0,
  },
});
