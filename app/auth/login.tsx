import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AtSign, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, isLoading } = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await signIn(email, password);
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
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
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg' }}
              style={styles.logoImage}
            />
            <Text style={[styles.title, isDark && styles.titleDark]}>Welcome Back</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Log in to your account to continue playing
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<AtSign size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
              error={errors.email}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              leftIcon={<Lock size={20} color={isDark ? Colors.dark.text : Colors.light.text} />}
              error={errors.password}
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              variant="primary"
              size="large"
              fullWidth
              style={styles.loginButton}
            />
            
            <View style={styles.orContainer}>
              <View style={[styles.divider, isDark && styles.dividerDark]} />
              <Text style={[styles.orText, isDark && styles.orTextDark]}>OR</Text>
              <View style={[styles.divider, isDark && styles.dividerDark]} />
            </View>
            
            <Button
              title="Continue as Guest"
              onPress={() => router.replace('/(tabs)')}
              variant="outline"
              size="large"
              fullWidth
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
              Don't have an account?
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.legalContainer}>
            <Text style={[styles.legalText, isDark && styles.legalTextDark]}>
              By logging in, you agree to our{' '}
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.heading.bold,
    color: Colors.light.text,
    marginBottom: 8,
  },
  titleDark: {
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  subtitleDark: {
    color: Colors.dark.text,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.primary[600],
  },
  loginButton: {
    marginBottom: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerDark: {
    backgroundColor: Colors.dark.border,
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.light.text,
    opacity: 0.7,
  },
  orTextDark: {
    color: Colors.dark.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
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
  registerLink: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.primary[600],
  },
  legalContainer: {
    marginTop: 24,
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