import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

export function useColorScheme() {
  const nativeColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    nativeColorScheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    if (nativeColorScheme) {
      setColorScheme(nativeColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [nativeColorScheme]);

  const toggleColorScheme = () => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    colorScheme,
    toggleColorScheme,
    isDark: colorScheme === 'dark',
  };
}