import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GAMES, TOURNAMENTS, NOTIFICATIONS } from '@/data/mockData';
import GameCard from '@/components/game/GameCard';
import Card from '@/components/ui/Card';
import { router } from 'expo-router';
import { BellRing, Info as InfoIcon, Gift, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const featuredGame = GAMES.find(game => game.status === 'featured');
  const popularGames = GAMES.filter(game => game.status === 'popular').slice(0, 2);
  const newGames = GAMES.filter(game => game.status === 'new');
  const liveTournaments = TOURNAMENTS.filter(tournament => tournament.status === 'live');
  const upcomingTournaments = TOURNAMENTS.filter(tournament => tournament.status === 'upcoming').slice(0, 2);
  const latestNotifications = NOTIFICATIONS.filter(notif => !notif.isRead).slice(0, 3);

  const handleTournamentPress = (tournamentId: string) => {
    router.push(`/tournament/${tournamentId}`);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, isDark && styles.textDark]}>
              Hey, {user?.displayName.split(' ')[0] || 'Player'}
            </Text>
            <Text style={[styles.subGreeting, isDark && styles.subGreetingDark]}>
              Ready to play?
            </Text>
          </View>
          <View style={styles.walletPreview}>
            <TouchableOpacity
              style={[styles.walletButton, isDark && styles.walletButtonDark]}
              onPress={() => router.push('/wallet')}
            >
              <Text style={[styles.walletAmount, isDark && styles.walletAmountDark]}>
                ₹{user?.walletBalance || 0}
              </Text>
              <Text style={[styles.walletLabel, isDark && styles.walletLabelDark]}>
                Add money
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        {latestNotifications.length > 0 && (
          <View style={styles.notificationsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {latestNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    isDark ? styles.notificationCardDark : styles.notificationCardLight,
                  ]}
                >
                  <View style={styles.notificationIcon}>
                    {notification.type === 'promo' ? (
                      <Gift size={16} color={Colors.primary[500]} />
                    ) : notification.type === 'game' ? (
                      <Trophy size={16} color={Colors.accent[500]} />
                    ) : (
                      <BellRing size={16} color={Colors.secondary[500]} />
                    )}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text
                      style={[styles.notificationTitle, isDark && styles.notificationTitleDark]}
                      numberOfLines={1}
                    >
                      {notification.title}
                    </Text>
                    <Text
                      style={[styles.notificationMessage, isDark && styles.notificationMessageDark]}
                      numberOfLines={1}
                    >
                      {notification.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.notificationCard,
                  styles.viewAllNotifications,
                  isDark ? styles.notificationCardDark : styles.notificationCardLight,
                ]}
                onPress={() => router.push('/notifications')}
              >
                <Text
                  style={[styles.viewAllText, isDark && styles.viewAllTextDark]}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Featured Game */}
        {featuredGame && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Featured Game</Text>
            <GameCard game={featuredGame} featured />
          </View>
        )}

        {/* Popular Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Popular Games</Text>
            <TouchableOpacity onPress={() => router.push('/games')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gamesGrid}>
            {popularGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </View>
        </View>

        {/* Live Tournaments Banner */}
        {liveTournaments.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.liveTournamentBanner}
              onPress={() => handleTournamentPress(liveTournaments[0].id)}
            >
              <LinearGradient
                colors={['#FF0080', '#7928CA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.liveTournamentGradient}
              >
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                </View>
                <Text style={styles.liveTournamentTitle}>
                  {liveTournaments[0].name}
                </Text>
                <View style={styles.liveTournamentDetails}>
                  <Text style={styles.liveTournamentPrize}>
                    ₹{liveTournaments[0].prizePool.toLocaleString()} Prize Pool
                  </Text>
                  <Text style={styles.liveTournamentPlayers}>
                    {liveTournaments[0].registeredPlayers}/{liveTournaments[0].maxPlayers} Players
                  </Text>
                </View>
                <View style={styles.joinNowButton}>
                  <Text style={styles.joinNowText}>Join Now</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Tournaments */}
        {upcomingTournaments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                Upcoming Tournaments
              </Text>
              <TouchableOpacity onPress={() => router.push('/tournaments')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcomingTournaments.map(tournament => {
              const tournamentGame = GAMES.find(game => game.id === tournament.gameId);
              return (
                <TouchableOpacity
                  key={tournament.id}
                  style={[
                    styles.tournamentCard,
                    isDark ? styles.tournamentCardDark : styles.tournamentCardLight,
                  ]}
                  onPress={() => handleTournamentPress(tournament.id)}
                >
                  <Image
                    source={{ uri: tournamentGame?.imageUrl }}
                    style={styles.tournamentImage}
                  />
                  <View style={styles.tournamentInfo}>
                    <Text
                      style={[styles.tournamentName, isDark && styles.tournamentNameDark]}
                      numberOfLines={1}
                    >
                      {tournament.name}
                    </Text>
                    <Text
                      style={[styles.tournamentGame, isDark && styles.tournamentGameDark]}
                      numberOfLines={1}
                    >
                      {tournamentGame?.name}
                    </Text>
                    <View style={styles.tournamentMeta}>
                      <Text style={styles.tournamentPrize}>₹{tournament.prizePool}</Text>
                      <Text style={styles.tournamentDate}>
                        {new Date(tournament.startTime).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>
                      ₹{tournament.entryFee}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* New Games */}
        {newGames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>New Games</Text>
              <TouchableOpacity onPress={() => router.push('/games')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gamesGrid}>
              {newGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </View>
          </View>
        )}

        {/* Referral Banner */}
        <Card style={styles.referralCard} elevation="medium">
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.referralGradient}
          >
            <View style={styles.referralContent}>
              <Text style={styles.referralTitle}>Invite Friends & Earn</Text>
              <Text style={styles.referralDescription}>
                Share your referral code and both you and your friend get ₹100 bonus!
              </Text>
              <View style={styles.referralCodeContainer}>
                <Text style={styles.referralCode}>{user?.referralCode || 'FRIEND500'}</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Legal Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <InfoIcon size={16} color={isDark ? Colors.dark.border : Colors.light.border} />
          <Text style={[styles.disclaimerText, isDark && styles.disclaimerTextDark]}>
            Games of skill are legal in most Indian states. Please check your local laws before playing.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontFamily: Fonts.heading.bold,
    color: Colors.light.text,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    opacity: 0.7,
  },
  subGreetingDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  textDark: {
    color: Colors.dark.text,
  },
  walletPreview: {
    alignItems: 'flex-end',
  },
  walletButton: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  walletButtonDark: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.primary[800],
  },
  walletAmount: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.light.text,
  },
  walletAmountDark: {
    color: Colors.dark.text,
  },
  walletLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.primary[600],
  },
  walletLabelDark: {
    color: Colors.primary[400],
  },
  notificationsContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    width: 250,
  },
  notificationCardLight: {
    backgroundColor: Colors.light.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationCardDark: {
    backgroundColor: Colors.dark.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  notificationTitleDark: {
    color: Colors.dark.text,
  },
  notificationMessage: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  notificationMessageDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  viewAllNotifications: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  viewAllText: {
    fontFamily: Fonts.body.medium,
    color: Colors.primary[600],
  },
  viewAllTextDark: {
    color: Colors.primary[400],
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.semiBold,
    color: Colors.light.text,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.primary[600],
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  liveTournamentBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  liveTournamentGradient: {
    padding: 16,
    borderRadius: 16,
  },
  liveBadge: {
    backgroundColor: Colors.error[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  liveBadgeText: {
    color: Colors.white,
    fontFamily: Fonts.body.bold,
    fontSize: 12,
  },
  liveTournamentTitle: {
    color: Colors.white,
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  liveTournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveTournamentPrize: {
    color: Colors.white,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
  },
  liveTournamentPlayers: {
    color: Colors.white,
    opacity: 0.8,
    fontFamily: Fonts.body.regular,
    fontSize: 14,
  },
  joinNowButton: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinNowText: {
    color: '#7928CA',
    fontFamily: Fonts.body.bold,
    fontSize: 14,
  },
  tournamentCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
  },
  tournamentCardLight: {
    backgroundColor: Colors.light.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentCardDark: {
    backgroundColor: Colors.dark.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  tournamentNameDark: {
    color: Colors.dark.text,
  },
  tournamentGame: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  tournamentGameDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  tournamentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tournamentPrize: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.primary[600],
  },
  tournamentDate: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  registerButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.white,
    fontFamily: Fonts.body.medium,
    fontSize: 14,
  },
  referralCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  referralGradient: {
    borderRadius: 12,
  },
  referralContent: {
    padding: 16,
  },
  referralTitle: {
    color: Colors.white,
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  referralDescription: {
    color: Colors.white,
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.9,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  referralCode: {
    flex: 1,
    color: Colors.white,
    fontFamily: Fonts.heading.semiBold,
    fontSize: 18,
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  copyButtonText: {
    color: Colors.primary[600],
    fontFamily: Fonts.body.medium,
    fontSize: 14,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    opacity: 0.7,
  },
  disclaimerText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.light.text,
    flex: 1,
  },
  disclaimerTextDark: {
    color: Colors.dark.text,
  },
});