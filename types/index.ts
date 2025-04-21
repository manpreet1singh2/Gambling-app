export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  isKycVerified: boolean;
  walletBalance: number;
  createdAt: string;
  lastLogin: string;
  referralCode: string;
  state: string;
};

export type Game = {
  id: string;
  name: string;
  type: GameType;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  minEntryFee: number;
  isActive: boolean;
  status: 'popular' | 'new' | 'featured' | 'regular';
};

export type GameType = 'poker' | 'rummy' | 'ludo' | 'fantasy' | 'other';

export type Tournament = {
  id: string;
  gameId: string;
  name: string;
  description: string;
  startTime: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  registeredPlayers: number;
  status: 'upcoming' | 'live' | 'completed';
};

export type Wallet = {
  id: string;
  userId: string;
  balance: number;
  depositAmount: number;
  winningAmount: number;
  bonusAmount: number;
};

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'winnings' | 'entry_fee' | 'bonus' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  referenceId: string;
  description: string;
};

export type Leaderboard = {
  userId: string;
  username: string;
  avatarUrl: string;
  totalWinnings: number;
  rank: number;
  gameType?: GameType;
};

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
};

export type NotificationType = 'general' | 'deposit' | 'withdrawal' | 'game' | 'promo' | 'support';

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};