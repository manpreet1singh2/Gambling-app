import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '@/types';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { Users, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, featured = false }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    router.push(`/game/${game.id}`);
  };

  if (featured) {
    return (
      <TouchableOpacity 
        style={[styles.featuredContainer]} 
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <Image source={{ uri: game.imageUrl }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredContent}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{game.status}</Text>
            </View>
            <Text style={styles.featuredTitle}>{game.name}</Text>
            <Text style={styles.featuredDescription} numberOfLines={2}>
              {game.description}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Users size={16} color={Colors.white} />
                <Text style={styles.statText}>{game.minPlayers}-{game.maxPlayers}</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={16} color={Colors.white} />
                <Text style={styles.statText}>₹{game.minEntryFee}+</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isDark ? styles.containerDark : styles.containerLight
      ]} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Image source={{ uri: game.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{game.name}</Text>
          {game.status !== 'regular' && (
            <View style={[
              styles.badge,
              game.status === 'popular' && styles.popularBadge,
              game.status === 'new' && styles.newBadge,
              game.status === 'featured' && styles.featuredBadge,
            ]}>
              <Text style={styles.badgeText}>{game.status}</Text>
            </View>
          )}
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Users size={14} color={isDark ? Colors.dark.text : Colors.light.text} />
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              {game.minPlayers}-{game.maxPlayers}
            </Text>
          </View>
          <View style={styles.stat}>
            <Trophy size={14} color={isDark ? Colors.dark.text : Colors.light.text} />
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              ₹{game.minEntryFee}+
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  containerLight: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: Colors.dark.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  titleDark: {
    color: Colors.dark.text,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  popularBadge: {
    backgroundColor: Colors.primary[500],
  },
  newBadge: {
    backgroundColor: Colors.success[500],
  },
  featuredBadge: {
    backgroundColor: Colors.accent[500],
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.body.medium,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
  },
  statValueDark: {
    color: Colors.dark.text,
  },
  featuredContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  statusBadge: {
    backgroundColor: Colors.primary[500],
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.white,
    marginBottom: 4,
  },
  featuredDescription: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 6,
    color: Colors.white,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
  },
});

export default GameCard;