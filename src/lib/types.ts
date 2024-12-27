export interface User {
  id: string;
  name: string;
  email: string;
  favoriteUsers: FavoriteUser[];
  accounts: Account[];
}

export interface Account {
  id: string;
  publicKey: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: string;
  description: string | null;
  toPublicKey: string;
  fromPublicKey: string;
  createdAt: Date | null;
}

export interface FavoriteUser {
  userId: string;
  name: string;
  publicKey: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  chart: number[];
}
