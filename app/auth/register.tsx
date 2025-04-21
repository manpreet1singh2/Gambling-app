import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AtSign, User, Lock, Phone, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// List of Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    state: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp, isLoading } = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {};
    
    if (!formData.username) {
      stepErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      stepErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      stepErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      stepErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      stepErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      stepErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors: Record<string, string> = {};
    
    if (!formData.phone) {
      stepErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      stepErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.state) {
      stepErrors.state = 'State is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleRegister = async () => {
    if (validateStep2()) {
      try {
        await signUp(formData.email, formData.password, formData.username);
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          general: 'Registration failed. Please try again.',
        });
      }
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.primary[400], Colors.primary[600]]}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join thousands of players and start winning
              </Text>
              
              <View style={styles.stepsContainer}>
                <View style={styles.stepIndicatorContainer}>
                  <View 
                    style={[
                      styles.stepIndicator, 
                      step >= 1 && styles.stepActive
                    ]}
                  >
                    <Text style={styles.stepText}>1</Text>
                  </View>
                  <View style={styles.stepLine} />
                  <View 
                    style={[
                      styles.stepIndicator, 
                      step >= 2 && styles.stepActive
                    ]}
                  >
                    <Text style={styles.stepText}>2</Text>
                  </View>
                </View>
                
                <View style={styles.stepLabelsContainer}>
                  <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>
                    Account
                  </Text>
                  <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>
                    Personal
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.formContainer}>
            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}
            
            {step === 1 ? (
              <>
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChangeText={(text) => updateFormData('username', text)}
                  leftIcon={<User size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.username}
                />
                
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<AtSign size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.email}
                />
                
                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry
                  showPasswordToggle
                  leftIcon={<Lock size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.password}
                />
                
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry
                  showPasswordToggle
                  leftIcon={<Lock size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.confirmPassword}
                />
                
                <Button
                  title="Next"
                  onPress={handleNext}
                  variant="primary"
                  size="large"
                  fullWidth
                  style={styles.button}
                />
              </>
            ) : (
              <>
                <Input
                  label="Phone Number"
                  placeholder="Enter your 10-digit phone"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  leftIcon={<Phone size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.phone}
                />
                
                <Input
                  label="State"
                  placeholder="Select your state"
                  value={formData.state}
                  onChangeText={(text) => updateFormData('state', text)}
                  leftIcon={<MapPin size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
                  error={errors.state}
                />
                
                <View style={styles.stateMessage}>
                  <Text style={[styles.stateMessageText, isDark && styles.stateMessageTextDark]}>
                    Note: Some states restrict games where money is involved. Please check the legality in your state.
                  </Text>
                </View>
                
                <View style={styles.buttonGroup}>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    size="large"
                    style={styles.backButton}
                  />
                  
                  <Button
                    title="Register"
                    onPress={handleRegister}
                    isLoading={isLoading}
                    variant="primary"
                    size="large"
                    style={styles.registerButton}
                  />
                </View>
              </>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
              Already have an account?
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.legalContainer}>
            <Text style={[styles.legalText, isDark && styles.legalTextDark]}>
              By registering, you agree to our{' '}
              <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.heading.bold,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 32,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: Colors.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  stepText: {
    fontSize: 14,
    fontFamily: Fonts.body.bold,
    color: Colors.primary[600],
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stepLabelActive: {
    fontFamily: Fonts.body.medium,
    color: Colors.white,
  },
  formContainer: {
    padding: 16,
    marginTop: 16,
  },
  generalErrorContainer: {
    backgroundColor: Colors.error[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  generalErrorText: {
    color: Colors.error[600],
    fontFamily: Fonts.body.medium,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  registerButton: {
    flex: 1,
    marginLeft: 8,
  },
  stateMessage: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  stateMessageText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
  },
  stateMessageTextDark: {
    color: Colors.dark.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    marginRight: 4,
  },
  footerTextDark: {
    color: Colors.dark.text,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.primary[600],
  },
  legalContainer: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  legalText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalTextDark: {
    color: Colors.dark.text,
  },
  legalLink: {
    color: Colors.primary[600],
  },
});