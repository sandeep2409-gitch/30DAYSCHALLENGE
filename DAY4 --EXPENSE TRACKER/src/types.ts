export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export type ThemeMode = 'dark' | 'light' | 'cyberpunk';

export interface CategoryOption {
  value: string;
  label: string;
  icon: string; // Lucide icon name
  color: string; // HSL color
}
