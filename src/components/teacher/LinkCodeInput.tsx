/**
 * Link Code Input Component
 * Allows students to enter teacher link codes
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LINK_CODE_CONFIG, VALIDATION_RULES } from '../../constants/teacher';

interface LinkCodeInputProps {
  onCodeSubmit: (code: string) => void;
  isValidating?: boolean;
  error?: string | null;
  placeholder?: string;
  autoCapitalize?: boolean;
  maxLength?: number;
  containerStyle?: any;
  onCodeChange?: (code: string) => void;
}

export const LinkCodeInput: React.FC<LinkCodeInputProps> = ({
  onCodeSubmit,
  isValidating = false,
  error,
  placeholder = 'Enter teacher link code',
  autoCapitalize = true,
  maxLength = VALIDATION_RULES.CODE_MAX_LENGTH,
  containerStyle,
  onCodeChange,
}) => {
  const [code, setCode] = useState('');

  const handleCodeChange = useCallback(
    (text: string) => {
      const upper = autoCapitalize ? text.toUpperCase() : text;
      setCode(upper);
      onCodeChange?.(upper);
    },
    [autoCapitalize, onCodeChange]
  );

  const handleSubmit = useCallback(() => {
    if (code.length >= VALIDATION_RULES.CODE_MIN_LENGTH) {
      onCodeSubmit(code);
    }
  }, [code, onCodeSubmit]);

  const isValidLength = code.length >= VALIDATION_RULES.CODE_MIN_LENGTH;
  const formattedCode = LINK_CODE_CONFIG.DISPLAY_SEPARATOR
    ? code.match(/.{1,4}/g)?.join(LINK_CODE_CONFIG.DISPLAY_SEPARATOR) || code
    : code;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder={placeholder}
          value={code}
          onChangeText={handleCodeChange}
          autoCapitalize={autoCapitalize ? 'characters' : 'none'}
          maxLength={maxLength}
          editable={!isValidating}
          placeholderTextColor="#999999"
        />
        {code && (
          <Text style={styles.formattedCode}>{formattedCode}</Text>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {code.length > 0 && code.length < VALIDATION_RULES.CODE_MIN_LENGTH && (
        <Text style={styles.helperText}>
          {VALIDATION_RULES.CODE_MIN_LENGTH - code.length} more character
          {VALIDATION_RULES.CODE_MIN_LENGTH - code.length === 1 ? '' : 's'} needed
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!isValidLength || isValidating) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isValidLength || isValidating}
        activeOpacity={0.7}
      >
        {isValidating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Ask your teacher for an 8-character code
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#1A1A1A',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  formattedCode: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '400',
  },
  submitButton: {
    backgroundColor: '#4D96FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '400',
  },
});
