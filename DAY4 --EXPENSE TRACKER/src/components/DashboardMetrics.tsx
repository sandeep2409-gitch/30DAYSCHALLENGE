import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { Transaction, Budget } from '../types';

interface DashboardMetricsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ transactions, budgets }) => {
  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate budgets in warning or exceeded state
  const categoryExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  let warningBudgets = 0;
  let exceededBudgets = 0;

  budgets.forEach((budget) => {
    const spent = categoryExpenses[budget.category] || 0;
    if (spent > budget.limit) {
      exceededBudgets++;
    } else if (spent >= budget.limit * 0.8) {
      warningBudgets++;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="metrics-grid">
      {/* Balance Card */}
      <div className="glass-card glass-card-interactive" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="form-label" style={{ fontSize: '0.8rem' }}>Total Balance</span>
          <div style={{ background: 'var(--accent-glow)', padding: '8px', borderRadius: '10px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
            <DollarSign size={18} />
          </div>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.03em' }}>
          {formatCurrency(balance)}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Net available capital
        </p>
      </div>

      {/* Income Card */}
      <div className="glass-card glass-card-interactive" style={{ borderLeft: '4px solid var(--income-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="form-label" style={{ fontSize: '0.8rem' }}>Total Income</span>
          <div style={{ background: 'var(--income-bg)', padding: '8px', borderRadius: '10px', color: 'var(--income-color)', display: 'flex', alignItems: 'center' }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--income-color)', letterSpacing: '-0.03em' }}>
          {formatCurrency(totalIncome)}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          From {transactions.filter(t => t.type === 'income').length} sources this period
        </p>
      </div>

      {/* Expenses Card */}
      <div className="glass-card glass-card-interactive" style={{ borderLeft: '4px solid var(--expense-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="form-label" style={{ fontSize: '0.8rem' }}>Total Expenses</span>
          <div style={{ background: 'var(--expense-bg)', padding: '8px', borderRadius: '10px', color: 'var(--expense-color)', display: 'flex', alignItems: 'center' }}>
            <TrendingDown size={18} />
          </div>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--expense-color)', letterSpacing: '-0.03em' }}>
          {formatCurrency(totalExpense)}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Across {transactions.filter(t => t.type === 'expense').length} separate transactions
        </p>
      </div>

      {/* Budgets Alert Card */}
      <div className="glass-card glass-card-interactive" style={{ 
        borderLeft: exceededBudgets > 0 ? '4px solid var(--expense-color)' : warningBudgets > 0 ? '4px solid var(--warning-color)' : '4px solid var(--text-muted)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="form-label" style={{ fontSize: '0.8rem' }}>Budget Status</span>
          <div style={{ 
            background: exceededBudgets > 0 ? 'var(--expense-bg)' : warningBudgets > 0 ? 'var(--warning-bg)' : 'rgba(255, 255, 255, 0.05)', 
            padding: '8px', 
            borderRadius: '10px', 
            color: exceededBudgets > 0 ? 'var(--expense-color)' : warningBudgets > 0 ? 'var(--warning-color)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        {exceededBudgets > 0 ? (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--expense-color)', letterSpacing: '-0.03em' }}>
              {exceededBudgets} Alert{exceededBudgets > 1 ? 's' : ''}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Limit exceeded in {exceededBudgets} categories!
            </p>
          </div>
        ) : warningBudgets > 0 ? (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--warning-color)', letterSpacing: '-0.03em' }}>
              {warningBudgets} Warning{warningBudgets > 1 ? 's' : ''}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Approaching limit ({warningBudgets} categories &gt; 80%)
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--income-color)', letterSpacing: '-0.03em' }}>
              All Clear
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              All budgets are currently under control
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
