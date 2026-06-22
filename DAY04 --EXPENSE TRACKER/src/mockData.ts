import type { Transaction, Budget, CategoryOption } from './types';

export const CATEGORIES: CategoryOption[] = [
  // Income Categories
  { value: 'Salary', label: 'Salary', icon: 'Briefcase', color: '142, 72%, 40%' },
  { value: 'Freelance', label: 'Freelance', icon: 'Laptop', color: '199, 89%, 48%' },
  { value: 'Investments', label: 'Investments', icon: 'TrendingUp', color: '162, 82%, 40%' },
  { value: 'Other Income', label: 'Other Income', icon: 'Coins', color: '48, 96%, 48%' },
  
  // Expense Categories
  { value: 'Housing', label: 'Housing & Rent', icon: 'Home', color: '262, 83%, 62%' },
  { value: 'Groceries', label: 'Groceries', icon: 'ShoppingCart', color: '24, 95%, 50%' },
  { value: 'Transport', label: 'Transport', icon: 'Car', color: '200, 95%, 45%' },
  { value: 'Utilities', label: 'Utilities', icon: 'Zap', color: '45, 93%, 47%' },
  { value: 'Dining Out', label: 'Dining Out', icon: 'Utensils', color: '339, 81%, 55%' },
  { value: 'Entertainment', label: 'Entertainment', icon: 'Film', color: '282, 84%, 55%' },
  { value: 'Shopping', label: 'Shopping', icon: 'ShoppingBag', color: '322, 81%, 53%' },
  { value: 'Health', label: 'Medical & Health', icon: 'HeartPulse', color: '0, 84%, 58%' },
  { value: 'Other Expense', label: 'Other Expense', icon: 'HelpCircle', color: '220, 10%, 60%' }
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', category: 'Groceries', limit: 400 },
  { id: 'b2', category: 'Dining Out', limit: 250 },
  { id: 'b3', category: 'Entertainment', limit: 200 },
  { id: 'b4', category: 'Shopping', limit: 300 }
];

// Helper to generate dynamic dates relative to current date
const getDateAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Income - Month 1 (around 45 days ago)
  {
    id: 't-inc-1',
    description: 'Monthly Salary Payment',
    amount: 3200,
    type: 'income',
    category: 'Salary',
    date: getDateAgo(45),
    paymentMethod: 'transfer',
    notes: 'Primary monthly corporate payout',
    tags: ['salary', 'corporate']
  },
  {
    id: 't-inc-2',
    description: 'UI Design Freelance',
    amount: 650,
    type: 'income',
    category: 'Freelance',
    date: getDateAgo(38),
    paymentMethod: 'transfer',
    notes: 'Landing page client project delivery',
    tags: ['freelance', 'design']
  },
  {
    id: 't-inc-3',
    description: 'Crypto Dividend Payout',
    amount: 120,
    type: 'income',
    category: 'Investments',
    date: getDateAgo(35),
    paymentMethod: 'transfer',
    notes: 'Quarterly stablecoin yield distribution',
    tags: ['dividends', 'crypto']
  },

  // Expenses - Month 1 (around 45 to 30 days ago)
  {
    id: 't-exp-1',
    description: 'Monthly Apartment Rent',
    amount: 1100,
    type: 'expense',
    category: 'Housing',
    date: getDateAgo(44),
    paymentMethod: 'transfer',
    notes: 'Including dynamic service charges',
    tags: ['rent', 'fixed']
  },
  {
    id: 't-exp-2',
    description: 'Supermarket Grocery Stock',
    amount: 145.2,
    type: 'expense',
    category: 'Groceries',
    date: getDateAgo(42),
    paymentMethod: 'card',
    notes: 'Whole foods stock for 2 weeks',
    tags: ['food', 'organic']
  },
  {
    id: 't-exp-3',
    description: 'Electricity & Gas Bill',
    amount: 85.5,
    type: 'expense',
    category: 'Utilities',
    date: getDateAgo(40),
    paymentMethod: 'transfer',
    notes: 'Late autumn usage rates',
    tags: ['utilities', 'bill']
  },
  {
    id: 't-exp-4',
    description: 'Sushi Bar Dinner',
    amount: 68.4,
    type: 'expense',
    category: 'Dining Out',
    date: getDateAgo(37),
    paymentMethod: 'card',
    notes: 'Birthday dinner celebration',
    tags: ['dining', 'sushi']
  },
  {
    id: 't-exp-5',
    description: 'Winter Woolen Coat',
    amount: 159.99,
    type: 'expense',
    category: 'Shopping',
    date: getDateAgo(34),
    paymentMethod: 'card',
    notes: 'Warm coat from Zara',
    tags: ['clothes', 'shopping']
  },
  {
    id: 't-exp-6',
    description: 'Netflix Annual Premium',
    amount: 22.99,
    type: 'expense',
    category: 'Entertainment',
    date: getDateAgo(32),
    paymentMethod: 'card',
    notes: '4K Multi-screen streaming membership',
    tags: ['subscription', 'entertainment']
  },

  // Income - Month 2 (Current Month, 30 days ago to today)
  {
    id: 't-inc-4',
    description: 'Monthly Salary Payment',
    amount: 3200,
    type: 'income',
    category: 'Salary',
    date: getDateAgo(15),
    paymentMethod: 'transfer',
    notes: 'Primary monthly corporate payout',
    tags: ['salary', 'corporate']
  },
  {
    id: 't-inc-5',
    description: 'Consultation Services',
    amount: 450,
    type: 'income',
    category: 'Freelance',
    date: getDateAgo(8),
    paymentMethod: 'transfer',
    notes: 'Technical review of web application',
    tags: ['freelance', 'consulting']
  },
  {
    id: 't-inc-6',
    description: 'Stock Market Profits',
    amount: 85,
    type: 'income',
    category: 'Investments',
    date: getDateAgo(4),
    paymentMethod: 'transfer',
    notes: 'Automated index dividend',
    tags: ['stocks', 'passive']
  },

  // Expenses - Month 2 (Current Month)
  {
    id: 't-exp-7',
    description: 'Monthly Apartment Rent',
    amount: 1100,
    type: 'expense',
    category: 'Housing',
    date: getDateAgo(14),
    paymentMethod: 'transfer',
    notes: 'Central city apartment rent',
    tags: ['rent', 'fixed']
  },
  {
    id: 't-exp-8',
    description: 'Organic Groceries Haul',
    amount: 124.5,
    type: 'expense',
    category: 'Groceries',
    date: getDateAgo(12),
    paymentMethod: 'card',
    notes: 'Weekly fresh stock',
    tags: ['food', 'healthy']
  },
  {
    id: 't-exp-9',
    description: 'Weekly Gas Fill-up',
    amount: 48.0,
    type: 'expense',
    category: 'Transport',
    date: getDateAgo(11),
    paymentMethod: 'card',
    notes: 'Premium unleaded fuel',
    tags: ['car', 'commute']
  },
  {
    id: 't-exp-10',
    description: 'Water Utilities Bill',
    amount: 34.2,
    type: 'expense',
    category: 'Utilities',
    date: getDateAgo(10),
    paymentMethod: 'transfer',
    notes: 'Quarterly water utility ledger',
    tags: ['utilities', 'water']
  },
  {
    id: 't-exp-11',
    description: 'Framer Premium Subscription',
    amount: 25.0,
    type: 'expense',
    category: 'Freelance',
    date: getDateAgo(9),
    paymentMethod: 'card',
    notes: 'Design portfolio hosting charges',
    tags: ['tools', 'work']
  },
  {
    id: 't-exp-12',
    description: 'Michelin Star Lunch',
    amount: 132.6,
    type: 'expense',
    category: 'Dining Out',
    date: getDateAgo(7),
    paymentMethod: 'card',
    notes: 'Business lunch client meeting',
    tags: ['dining', 'client']
  },
  {
    id: 't-exp-13',
    description: 'IMAX Cinema Tickets',
    amount: 38.0,
    type: 'expense',
    category: 'Entertainment',
    date: getDateAgo(5),
    paymentMethod: 'card',
    notes: 'Interstellar special screening',
    tags: ['movie', 'imax']
  },
  {
    id: 't-exp-14',
    description: 'Groceries Mid-week topup',
    amount: 58.7,
    type: 'expense',
    category: 'Groceries',
    date: getDateAgo(3),
    paymentMethod: 'cash',
    notes: 'Fresh dairy, fruits and bread',
    tags: ['food', 'dairy']
  },
  {
    id: 't-exp-15',
    description: 'Bluetooth Noise-Cancelling Earbuds',
    amount: 189.99,
    type: 'expense',
    category: 'Shopping',
    date: getDateAgo(2),
    paymentMethod: 'card',
    notes: 'Upgrade for noise cancellation at work',
    tags: ['gadgets', 'audio']
  },
  {
    id: 't-exp-16',
    description: 'Aspirin & Vitamins Stock',
    amount: 28.5,
    type: 'expense',
    category: 'Health',
    date: getDateAgo(1),
    paymentMethod: 'card',
    notes: 'Pharmacy winter kit supplements',
    tags: ['medical', 'health']
  }
];
