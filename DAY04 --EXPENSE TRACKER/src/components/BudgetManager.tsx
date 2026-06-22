import React, { useState } from 'react';
import { Plus, X, Trash2, Edit2, Check } from 'lucide-react';
import type { Budget, Transaction } from '../types';
import { CATEGORIES } from '../mockData';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (category: string, limit: number) => void;
  onUpdateBudget: (id: string, limit: number) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[4].value); // Default Housing/Groceries/Rent
  const [budgetLimit, setBudgetLimit] = useState('');
  
  // Inline edit state
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');

  // Calculate expenses grouped by category
  const categoryExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(budgetLimit);
    if (!selectedCategory || isNaN(limitNum) || limitNum <= 0) return;
    
    // Check if category already has a budget
    const exists = budgets.some((b) => b.category === selectedCategory);
    if (exists) {
      alert(`A budget for ${selectedCategory} already exists. Please edit the existing one.`);
      return;
    }

    onAddBudget(selectedCategory, limitNum);
    setBudgetLimit('');
    setShowAddForm(false);
  };

  const handleStartEdit = (b: Budget) => {
    setEditingBudgetId(b.id);
    setEditLimit(b.limit.toString());
  };

  const handleSaveEdit = (id: string) => {
    const limitNum = parseFloat(editLimit);
    if (isNaN(limitNum) || limitNum <= 0) return;
    onUpdateBudget(id, limitNum);
    setEditingBudgetId(null);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Budgets</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track monthly category limits</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            style={{
              background: 'var(--accent-glow)',
              color: 'var(--accent-primary)',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="Create budget"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ 
          background: 'rgba(0, 0, 0, 0.15)', 
          padding: '12px', 
          borderRadius: '16px', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>New Budget Plan</span>
            <button type="button" onClick={() => setShowAddForm(false)} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input form-select"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {CATEGORIES.filter(c => c.value !== 'Salary' && c.value !== 'Freelance' && c.value !== 'Investments' && c.value !== 'Other Income')
                .map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.7rem' }}>Monthly Limit ($)</label>
              <input 
                type="number" 
                placeholder="Limit" 
                value={budgetLimit} 
                onChange={(e) => setBudgetLimit(e.target.value)} 
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', alignSelf: 'flex-end', height: '37px', borderRadius: '12px' }}>
              Create
            </button>
          </div>
        </form>
      )}

      {/* Budgets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {budgets.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            No budgets configured. Click '+' to add one.
          </div>
        ) : (
          budgets.map((b) => {
            const spent = categoryExpenses[b.category] || 0;
            const ratio = b.limit > 0 ? spent / b.limit : 0;
            const percent = Math.min(Math.round(ratio * 100), 200);
            
            // Get color indicator
            let progressColor = 'var(--income-color)'; // Green
            if (spent > b.limit) {
              progressColor = 'var(--expense-color)'; // Red
            } else if (spent >= b.limit * 0.8) {
              progressColor = 'var(--warning-color)'; // Amber
            }

            return (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Spent: ${spent.toFixed(2)}
                    </span>
                  </div>

                  {editingBudgetId === b.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input 
                        type="number" 
                        value={editLimit} 
                        onChange={(e) => setEditLimit(e.target.value)} 
                        className="form-input"
                        style={{ padding: '4px 8px', width: '70px', fontSize: '0.8rem', textAlign: 'right' }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(b.id)} style={{ color: 'var(--income-color)' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingBudgetId(null)} style={{ color: 'var(--text-muted)' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: progressColor }}>
                          {percent}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Limit: ${b.limit}
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="budget-actions" style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleStartEdit(b)} style={{ color: 'var(--text-secondary)', padding: '2px' }} title="Edit Limit">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => onDeleteBudget(b.id)} style={{ color: 'var(--text-muted)', padding: '2px' }} title="Delete Budget">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(percent, 100)}%`,
                      backgroundColor: progressColor,
                      boxShadow: `0 0 10px ${progressColor}`
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
