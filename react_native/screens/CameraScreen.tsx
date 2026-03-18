import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, ImagePlus, Upload } from "lucide-react-native";

import { colors } from "../constants/colors";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === "web" ? 67 : 0;

  const handleScanQuestion = () => {};
  const handleUploadAnswer = () => {};
  const handlePickFromGallery = () => {};

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding + 16 }]}>
      <Text style={styles.title}>AI Camera</Text>
      <Text style={styles.subtitle}>Snap a question or upload your answer</Text>

      <View style={styles.cardsContainer}>
        <Pressable style={styles.modeCard} onPress={handleScanQuestion}>
          <View style={[styles.modeIconContainer, { backgroundColor: colors.primary + "20" }]}>
            <Camera size={40} color={colors.primary} />
          </View>
          <Text style={styles.modeTitle}>Scan Question</Text>
          <Text style={styles.modeDesc}>
            Take a photo of any SPM question and get an instant AI explanation with step-by-step
            solution
          </Text>
          <View style={styles.modeAction}>
            <Camera size={16} color={colors.primary} />
            <Text style={styles.modeActionText}>Open Camera</Text>
          </View>
        </Pressable>

        <Pressable style={styles.modeCard} onPress={handleUploadAnswer}>
          <View style={[styles.modeIconContainer, { backgroundColor: colors.accent + "20" }]}>
            <Upload size={40} color={colors.accent} />
          </View>
          <Text style={styles.modeTitle}>Upload Answer</Text>
          <Text style={styles.modeDesc}>
            Upload photos of your handwritten essay or math working for AI grading and feedback
          </Text>
          <View style={styles.modeAction}>
            <Upload size={16} color={colors.accent} />
            <Text style={[styles.modeActionText, { color: colors.accent }]}>Choose Photos</Text>
          </View>
        </Pressable>
      </View>

      <Pressable style={styles.galleryButton} onPress={handlePickFromGallery}>
        <ImagePlus size={20} color={colors.primary} />
        <Text style={styles.galleryText}>Pick from Gallery</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  cardsContainer: { marginTop: 32, gap: 16 },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modeTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  modeDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 19 },
  modeAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modeActionText: { fontSize: 14, fontWeight: "600", color: colors.primary },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  galleryText: { fontSize: 14, fontWeight: "600", color: colors.primary },
});
