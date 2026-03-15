import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  const handleScanQuestion = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to scan questions.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/scan-result',
          params: { imageUri: result.assets[0].uri, mode: 'scan' },
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const handleUploadAnswer = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library access is needed to upload answers.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });
      if (!result.canceled && result.assets.length > 0) {
        router.push({
          pathname: '/scan-result',
          params: { imageUri: result.assets[0].uri, mode: 'upload' },
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to open photo library. Please try again.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library access is needed.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/scan-result',
          params: { imageUri: result.assets[0].uri, mode: 'scan' },
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding + 16 }]}>
      <Text style={styles.title}>AI Camera</Text>
      <Text style={styles.subtitle}>Snap a question or upload your answer</Text>

      <View style={styles.cardsContainer}>
        <Pressable style={styles.modeCard} onPress={handleScanQuestion}>
          <View style={[styles.modeIconContainer, { backgroundColor: colors.primary + '12' }]}>
            <MaterialCommunityIcons name="camera-outline" size={40} color={colors.primary} />
          </View>
          <Text style={styles.modeTitle}>Scan Question</Text>
          <Text style={styles.modeDesc}>
            Take a photo of any SPM question and get an instant AI explanation with step-by-step solution
          </Text>
          <View style={styles.modeAction}>
            <Feather name="camera" size={16} color={colors.primary} />
            <Text style={styles.modeActionText}>Open Camera</Text>
          </View>
        </Pressable>

        <Pressable style={styles.modeCard} onPress={handleUploadAnswer}>
          <View style={[styles.modeIconContainer, { backgroundColor: colors.accent + '12' }]}>
            <MaterialCommunityIcons name="file-upload-outline" size={40} color={colors.accent} />
          </View>
          <Text style={styles.modeTitle}>Upload Answer</Text>
          <Text style={styles.modeDesc}>
            Upload photos of your handwritten essay or math working for AI grading and feedback
          </Text>
          <View style={styles.modeAction}>
            <Feather name="upload" size={16} color={colors.accent} />
            <Text style={[styles.modeActionText, { color: colors.accent }]}>Choose Photos</Text>
          </View>
        </Pressable>
      </View>

      <Pressable style={styles.galleryButton} onPress={handlePickFromGallery}>
        <Ionicons name="images-outline" size={20} color={colors.primary} />
        <Text style={styles.galleryText}>Pick from Gallery</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: colors.text },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.textSecondary, marginTop: 4 },
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modeTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.text },
  modeDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 19,
  },
  modeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modeActionText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.primary },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  galleryText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.primary },
});
