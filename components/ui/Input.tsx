import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  secureTextEntry,
  showPasswordToggle = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const inputStyles = [
    styles.input,
    isDark && styles.inputDark,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
    isFocused && styles.inputFocused,
    isFocused && isDark && styles.inputFocusedDark,
    error && styles.inputError,
    style,
  ];

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={inputStyles}
          placeholderTextColor={isDark ? Colors.dark.border : Colors.light.border}
          secureTextEntry={showPasswordToggle ? !showPassword : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
        {showPasswordToggle && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={handlePasswordToggle}>
            {showPassword ? (
              <EyeOff
                size={20}
                color={isDark ? Colors.dark.text : Colors.light.text}
                strokeWidth={1.5}
              />
            ) : (
              <Eye
                size={20}
                color={isDark ? Colors.dark.text : Colors.light.text}
                strokeWidth={1.5}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    marginBottom: 8,
    color: Colors.light.text,
  },
  labelDark: {
    color: Colors.dark.text,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  inputDark: {
    borderColor: Colors.dark.border,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.background,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  inputFocusedDark: {
    borderColor: Colors.primary[400],
  },
  inputError: {
    borderColor: Colors.error[500],
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    marginTop: 4,
  },
});

export default Input;