import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  elevation = 'medium',
  padding = 'medium',
  borderRadius = 'medium',
  style,
  ...props
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        styles[`elevation${elevation.charAt(0).toUpperCase() + elevation.slice(1)}`],
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
        styles[`borderRadius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}`],
        { backgroundColor: isDark ? Colors.dark.card : Colors.light.card },
        isDark ? styles.darkShadow : styles.lightShadow,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  elevationNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  elevationLow: {
    elevation: 2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
  },
  elevationMedium: {
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
  },
  elevationHigh: {
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  borderRadiusNone: {
    borderRadius: 0,
  },
  borderRadiusSmall: {
    borderRadius: 4,
  },
  borderRadiusMedium: {
    borderRadius: 8,
  },
  borderRadiusLarge: {
    borderRadius: 16,
  },
  lightShadow: {
    shadowColor: Colors.black,
  },
  darkShadow: {
    shadowColor: '#000000',
  },
});

export default Card;