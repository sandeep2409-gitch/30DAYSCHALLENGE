import React, { useState } from 'react';
import { Search, Edit2, Trash2, Tag, Calendar, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import type { Transaction, TransactionType, PaymentMethod } from '../types';
import { CATEGORIES } from '../mockData';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortField = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | 'all'>('all');
  
  // Sort state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Toggle sort order
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending
    }
  };

  // Extract categories present in list for the filter select
  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter and Sort execution
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesType = selectedType === 'all' || t.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesPayment = selectedPayment === 'all' || t.paymentMethod === selectedPayment;

      return matchesSearch && matchesType && matchesCategory && matchesPayment;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Helper to retrieve category visual config
  const getCategoryConfig = (catName: string) => {
    const config = CATEGORIES.find(c => c.value === catName);
    return config || { icon: 'HelpCircle', color: '220, 10%, 60%' };
  };

  // Quick helper to map icon strings to JSX components
  const renderCategoryIcon = (iconName: string, color: string) => {
    // Dynamic import mapping for standard Lucide Icons
    const style = { color: `hsl(${color})`, strokeWidth: 2.5 };
    
    switch (iconName) {
      case 'Briefcase': return <span style={style}>💼</span>;
      case 'Laptop': return <span style={style}>💻</span>;
      case 'TrendingUp': return <span style={style}>📈</span>;
      case 'Coins': return <span style={style}>🪙</span>;
      case 'Home': return <span style={style}>🏠</span>;
      case 'ShoppingCart': return <span style={style}>🛒</span>;
      case 'Car': return <span style={style}>🚗</span>;
      case 'Zap': return <span style={style}>⚡</span>;
      case 'Utensils': return <span style={style}>🍴</span>;
      case 'Film': return <span style={style}>🎬</span>;
      case 'ShoppingBag': return <span style={style}>🛍️</span>;
      case 'HeartPulse': return <span style={style}>🏥</span>;
      default: return <span style={style}>❓</span>;
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Counters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Transaction History</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredTransactions.length} of {transactions.length} total records
          </p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div style={{ 
        background: 'rgba(0,0,0,0.15)', 
        padding: '16px', 
        borderRadius: '18px', 
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search description, tags, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '12px', fontSize: '0.85rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {/* Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransactionType | 'all')}
            className="form-input form-select"
            style={{ fontSize: '0.85rem', padding: '10px 16px' }}
          >
            <option value="all">All Flow Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input form-select"
            style={{ fontSize: '0.85rem', padding: '10px 16px' }}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Payment Method Selector */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod | 'all')}
            className="form-input form-select"
            style={{ fontSize: '0.85rem', padding: '10px 16px' }}
          >
            <option value="all">All Payment Methods</option>
            <option value="card">Credit/Debit Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Desktop Header Sort Controls (Used primarily for manual reference and tablet flex) */}
        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Sort By:</span>
          <button 
            type="button" 
            onClick={() => handleSort('date')}
            style={{ 
              color: sortField === 'date' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: sortField === 'date' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Date {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
          <button 
            type="button" 
            onClick={() => handleSort('amount')}
            style={{ 
              color: sortField === 'amount' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: sortField === 'amount' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Amount {sortField === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🔍</span>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>No records found</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Try adjusting your searches or category filters.
            </p>
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const cat = getCategoryConfig(t.category);
            const isIncome = t.type === 'income';

            return (
              <div 
                key={t.id} 
                className="glass-card-interactive"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Visual Category & Information */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    background: isIncome ? 'var(--income-bg)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1.5px solid ${isIncome ? 'var(--income-color)' : `rgba(255, 255, 255, 0.1)`}`,
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {renderCategoryIcon(cat.icon, cat.color)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.description}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        background: isIncome ? 'var(--income-bg)' : 'rgba(255, 255, 255, 0.05)',
                        color: isIncome ? 'var(--income-color)' : 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                      }}>
                        {t.category}
                      </span>
                    </div>

                    {/* Metadata indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                        {formatDate(t.date)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
                        <CreditCard size={12} style={{ color: 'var(--text-muted)' }} />
                        {t.paymentMethod === 'card' ? 'Card' : t.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Cash'}
                      </span>
                    </div>

                    {/* Description Notes & Tags */}
                    {t.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{t.notes}"
                      </p>
                    )}

                    {t.tags && t.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {t.tags.map((tag) => (
                          <span key={tag} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.65rem',
                            background: 'rgba(99, 102, 241, 0.08)',
                            color: 'var(--accent-primary)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(99, 102, 241, 0.15)'
                          }}>
                            <Tag size={8} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Action handles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: isIncome ? 'var(--income-color)' : 'var(--text-primary)'
                  }}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => onEdit(t)} 
                      style={{ 
                        color: 'var(--text-secondary)', 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        padding: '6px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--glass-border)',
                        transition: 'all 0.2s'
                      }}
                      title="Edit Transaction"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => onDelete(t.id)} 
                      style={{ 
                        color: 'var(--text-muted)', 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        padding: '6px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--glass-border)',
                        transition: 'all 0.2s'
                      }}
                      title="Delete Transaction"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
