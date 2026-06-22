import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import type { Transaction, TransactionType, PaymentMethod } from '../types';
import { CATEGORIES } from '../mockData';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [notes, setNotes] = useState('');
  const [tagsString, setTagsString] = useState('');

  // Populate data when editing a transaction
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
      setTagsString(editingTransaction.tags ? editingTransaction.tags.join(', ') : '');
    } else {
      // Reset form
      setType('expense');
      setDescription('');
      setAmount('');
      // Set first appropriate category by default
      const defaultCategory = CATEGORIES.find(c => c.value === 'Housing')?.value || CATEGORIES[4].value;
      setCategory(defaultCategory);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('card');
      setNotes('');
      setTagsString('');
    }
  }, [editingTransaction, isOpen]);

  // Adjust category default when changing type
  useEffect(() => {
    if (!editingTransaction) {
      if (type === 'income') {
        setCategory(CATEGORIES[0].value); // Salary
      } else {
        setCategory(CATEGORIES[4].value); // Housing
      }
    }
  }, [type, editingTransaction]);

  if (!isOpen) return null;

  // Filter categories based on transaction type
  const filteredCategories = CATEGORIES.filter((c) => {
    const isIncomeCategory = ['Salary', 'Freelance', 'Investments', 'Other Income'].includes(c.value);
    return type === 'income' ? isIncomeCategory : !isIncomeCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }

    const tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      id: editingTransaction?.id,
      description: description.trim(),
      amount: amountNum,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
    
    onClose();
  };

  const setRelativeDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-card modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid var(--glass-border-hover)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {editingTransaction ? 'Edit Transaction' : 'Log New Transaction'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Income vs Expense Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
            <button
              type="button"
              onClick={() => setType('expense')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
                background: type === 'expense' ? 'var(--expense-color)' : 'none',
                transition: 'all 0.2s ease',
                boxShadow: type === 'expense' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
              }}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
                background: type === 'income' ? 'var(--income-color)' : 'none',
                transition: 'all 0.2s ease',
                boxShadow: type === 'income' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              Income
            </button>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder={type === 'expense' ? 'e.g. Groceries at Trader Joes' : 'e.g. Freelance Consulting'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <FileText size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <DollarSign size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                style={{ width: '100%' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {filteredCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Date */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Date</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" onClick={() => setRelativeDate(0)} style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Today
                  </button>
                  <button type="button" onClick={() => setRelativeDate(1)} style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Yesterday
                  </button>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-input form-select"
                style={{ width: '100%' }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                required
              >
                <option value="card">Credit/Debit Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              placeholder="Provide any additional details or background..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Tags (Optional) */}
          <div className="form-group">
            <label className="form-label">Tags (Comma separated, optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder="e.g. vacation, recurring, work"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
              />
              <Tag size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ minWidth: '130px' }}>
              {editingTransaction ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
