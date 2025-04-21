import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TRANSACTIONS } from '@/data/mockData';
import { router } from 'expo-router';
import { Wallet, CirclePlus as PlusCircle, ArrowUpRight, Clock, Banknote, Trophy, Gift, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<'transactions' | 'deposits' | 'withdrawals'>('transactions');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <PlusCircle size={20} color={Colors.success[500]} />;
      case 'withdrawal':
        return <ArrowUpRight size={20} color={Colors.error[500]} />;
      case 'entry_fee':
        return <Banknote size={20} color={Colors.secondary[500]} />;
      case 'winnings':
        return <Trophy size={20} color={Colors.primary[500]} />;
      case 'bonus':
        return <Gift size={20} color={Colors.accent[500]} />;
      default:
        return <Clock size={20} color={Colors.light.text} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'winnings':
      case 'bonus':
        return Colors.success[500];
      case 'withdrawal':
      case 'entry_fee':
        return Colors.error[500];
      default:
        return Colors.light.text;
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFormattedAmount = (amount: number, type: string) => {
    const prefix = ['deposit', 'winnings', 'bonus'].includes(type) ? '+' : '-';
    return `${prefix}₹${amount}`;
  };

  const filteredTransactions = TRANSACTIONS.filter(transaction => {
    if (activeTab === 'transactions') return true;
    if (activeTab === 'deposits') return transaction.type === 'deposit' || transaction.type === 'winnings' || transaction.type === 'bonus';
    if (activeTab === 'withdrawals') return transaction.type === 'withdrawal' || transaction.type === 'entry_fee';
    return true;
  });

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Wallet</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.walletCard}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <Wallet size={24} color={Colors.white} />
              <Text style={styles.walletTitle}>Total Balance</Text>
            </View>
            
            <Text style={styles.walletBalance}>₹{user?.walletBalance || 0}</Text>
            
            <View style={styles.walletBreakdown}>
              <View style={styles.walletItem}>
                <Text style={styles.walletItemLabel}>Deposit</Text>
                <Text style={styles.walletItemValue}>₹2,000</Text>
              </View>
              <View style={styles.walletDivider} />
              <View style={styles.walletItem}>
                <Text style={styles.walletItemLabel}>Winnings</Text>
                <Text style={styles.walletItemValue}>₹400</Text>
              </View>
              <View style={styles.walletDivider} />
              <View style={styles.walletItem}>
                <Text style={styles.walletItemLabel}>Bonus</Text>
                <Text style={styles.walletItemValue}>₹100</Text>
              </View>
            </View>
            
            <View style={styles.walletActions}>
              <Button
                title="Add Money"
                onPress={() => router.push('/wallet/add')}
                variant="primary"
                leftIcon={<PlusCircle size={16} color={Colors.white} />}
                style={styles.addMoneyButton}
              />
              
              <Button
                title="Withdraw"
                onPress={() => router.push('/wallet/withdraw')}
                variant="outline"
                leftIcon={<ArrowUpRight size={16} color={Colors.white} />}
                style={styles.withdrawButton}
              />
            </View>
          </LinearGradient>
        </Card>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'transactions' && styles.activeTab,
              activeTab === 'transactions' && isDark && styles.activeTabDark,
            ]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'transactions' && styles.activeTabText,
                isDark && styles.tabTextDark,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'deposits' && styles.activeTab,
              activeTab === 'deposits' && isDark && styles.activeTabDark,
            ]}
            onPress={() => setActiveTab('deposits')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'deposits' && styles.activeTabText,
                isDark && styles.tabTextDark,
              ]}
            >
              Deposits
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'withdrawals' && styles.activeTab,
              activeTab === 'withdrawals' && isDark && styles.activeTabDark,
            ]}
            onPress={() => setActiveTab('withdrawals')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'withdrawals' && styles.activeTabText,
                isDark && styles.tabTextDark,
              ]}
            >
              Withdrawals
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, isDark && styles.transactionsTitleDark]}>
              Transaction History
            </Text>
            
            <TouchableOpacity onPress={() => router.push('/wallet/history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  isDark ? styles.transactionItemDark : styles.transactionItemLight,
                ]}
                onPress={() => router.push(`/wallet/transaction/${transaction.id}`)}
              >
                <View style={styles.transactionIconContainer}>
                  {getTransactionIcon(transaction.type)}
                </View>
                
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionTitle, isDark && styles.transactionTitleDark]}>
                    {transaction.description}
                  </Text>
                  
                  <Text style={[styles.transactionDate, isDark && styles.transactionDateDark]}>
                    {getFormattedDate(transaction.createdAt)}
                  </Text>
                </View>
                
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type) },
                    ]}
                  >
                    {getFormattedAmount(transaction.amount, transaction.type)}
                  </Text>
                  
                  <ChevronRight 
                    size={16} 
                    color={isDark ? Colors.dark.border : Colors.light.border} 
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No transactions found
              </Text>
            </View>
          )}
        </View>
        
        <Card style={styles.promoCard} padding="large">
          <Text style={[styles.promoTitle, isDark && styles.promoTitleDark]}>
            Invite Friends & Get Bonus
          </Text>
          
          <Text style={[styles.promoDescription, isDark && styles.promoDescriptionDark]}>
            Share your referral code with friends and get ₹100 bonus for each sign-up.
          </Text>
          
          <Button
            title="Share Referral Code"
            onPress={() => {}}
            variant="primary"
            size="medium"
            style={styles.promoButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.heading.bold,
    color: Colors.light.text,
  },
  titleDark: {
    color: Colors.dark.text,
  },
  walletCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  walletGradient: {
    borderRadius: 12,
    padding: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.white,
    marginLeft: 8,
  },
  walletBalance: {
    fontSize: 36,
    fontFamily: Fonts.heading.bold,
    color: Colors.white,
    marginBottom: 16,
  },
  walletBreakdown: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  walletItem: {
    flex: 1,
    alignItems: 'center',
  },
  walletDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletItemLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  walletItemValue: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Colors.white,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addMoneyButton: {
    backgroundColor: Colors.white,
    flex: 1,
    marginRight: 8,
  },
  withdrawButton: {
    borderColor: Colors.white,
    flex: 1,
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  activeTab: {
    backgroundColor: Colors.primary[600],
  },
  activeTabDark: {
    backgroundColor: Colors.primary[700],
  },
  tabText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.primary[600],
  },
  tabTextDark: {
    color: Colors.primary[400],
  },
  activeTabText: {
    color: Colors.white,
  },
  transactionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.semiBold,
    color: Colors.light.text,
  },
  transactionsTitleDark: {
    color: Colors.dark.text,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.primary[600],
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionItemLight: {
    backgroundColor: Colors.light.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionItemDark: {
    backgroundColor: Colors.dark.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  transactionTitleDark: {
    color: Colors.dark.text,
  },
  transactionDate: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  transactionDateDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: Fonts.body.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.body.medium,
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  emptyTextDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  promoCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  promoTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  promoTitleDark: {
    color: Colors.dark.text,
  },
  promoDescription: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  promoDescriptionDark: {
    color: Colors.dark.text,
    opacity: 0.7,
  },
  promoButton: {
    alignSelf: 'flex-start',
  },
});