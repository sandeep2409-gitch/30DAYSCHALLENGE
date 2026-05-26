import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Trash2, Sun, Moon, Sparkles } from 'lucide-react';
import type { Transaction, Budget, ThemeMode } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from './mockData';
import { DashboardMetrics } from './components/DashboardMetrics';
import { ExpenseCharts } from './components/ExpenseCharts';
import { BudgetManager } from './components/BudgetManager';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';

function App() {
  // --- CORE STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  
  // Modal Triggers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // --- INITIAL LOADING ---
  useEffect(() => {
    // Load Transactions
    const localTx = localStorage.getItem('day4_transactions');
    if (localTx) {
      setTransactions(JSON.parse(localTx));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('day4_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    // Load Budgets
    const localBudgets = localStorage.getItem('day4_budgets');
    if (localBudgets) {
      setBudgets(JSON.parse(localBudgets));
    } else {
      setBudgets(INITIAL_BUDGETS);
      localStorage.setItem('day4_budgets', JSON.stringify(INITIAL_BUDGETS));
    }

    // Load Theme
    const localTheme = localStorage.getItem('day4_theme') as ThemeMode;
    if (localTheme) {
      setThemeMode(localTheme);
    } else {
      setThemeMode('dark');
    }
  }, []);

  // --- THEME SYNC ---
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-cyberpunk');
    
    if (themeMode === 'light') {
      root.classList.add('theme-light');
    } else if (themeMode === 'cyberpunk') {
      root.classList.add('theme-cyberpunk');
    } else {
      root.classList.add('theme-dark');
    }
    
    localStorage.setItem('day4_theme', themeMode);
  }, [themeMode]);

  // --- TRANSACTION SAVE/DELETE HANDLERS ---
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'> & { id?: string }) => {
    let updatedTxList: Transaction[];

    if (txData.id) {
      // Editing
      updatedTxList = transactions.map((t) =>
        t.id === txData.id ? { ...t, ...txData } as Transaction : t
      );
    } else {
      // Adding new
      const newTx: Transaction = {
        ...txData,
        id: `t-${Date.now()}`,
      } as Transaction;
      updatedTxList = [newTx, ...transactions];
    }

    setTransactions(updatedTxList);
    localStorage.setItem('day4_transactions', JSON.stringify(updatedTxList));
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('day4_transactions', JSON.stringify(updated));
    }
  };

  const handleEditTrigger = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // --- BUDGET MANAGERS ---
  const handleAddBudget = (category: string, limit: number) => {
    const newBudget: Budget = {
      id: `b-${Date.now()}`,
      category,
      limit,
    };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    localStorage.setItem('day4_budgets', JSON.stringify(updated));
  };

  const handleUpdateBudget = (id: string, limit: number) => {
    const updated = budgets.map((b) => (b.id === id ? { ...b, limit } : b));
    setBudgets(updated);
    localStorage.setItem('day4_budgets', JSON.stringify(updated));
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category budget?')) {
      const updated = budgets.filter((b) => b.id !== id);
      setBudgets(updated);
      localStorage.setItem('day4_budgets', JSON.stringify(updated));
    }
  };

  // --- GENERAL ACTIONS (PURGE & BACKUP) ---
  const handlePurgeAll = () => {
    if (window.confirm('WARNING: This will permanently wipe all logs and reset to empty state. Are you sure?')) {
      setTransactions([]);
      setBudgets([]);
      localStorage.setItem('day4_transactions', JSON.stringify([]));
      localStorage.setItem('day4_budgets', JSON.stringify([]));
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('This will overwrite current logs with preloaded demo values. Proceed?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgets(INITIAL_BUDGETS);
      localStorage.setItem('day4_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem('day4_budgets', JSON.stringify(INITIAL_BUDGETS));
    }
  };

  const handleExportJSON = () => {
    const backupData = {
      transactions,
      budgets,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions available to export');
      return;
    }
    const headers = ['ID', 'Description', 'Amount', 'Type', 'Category', 'Date', 'PaymentMethod', 'Notes', 'Tags'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.date,
      t.paymentMethod,
      t.notes ? `"${t.notes.replace(/"/g, '""')}"` : '',
      t.tags ? `"${t.tags.join(', ')}"` : ''
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.transactions) && Array.isArray(parsed.budgets)) {
          setTransactions(parsed.transactions);
          setBudgets(parsed.budgets);
          localStorage.setItem('day4_transactions', JSON.stringify(parsed.transactions));
          localStorage.setItem('day4_budgets', JSON.stringify(parsed.budgets));
          alert('Backup restored successfully!');
        } else {
          alert('Invalid file structure. Must contain transactions and budgets lists.');
        }
      } catch (err) {
        alert('Failed to parse backup file. Please upload a valid JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input target
    e.target.value = '';
  };

  return (
    <div className="app-container">
      {/* Dynamic backdrop glows */}
      <div className="ambient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main sticky glass header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="logo-text">Capitally.</span>
        </div>

        {/* Global theme controls & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Theme switcher */}
          <div className="theme-switch-container">
            <button
              onClick={() => setThemeMode('dark')}
              className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
            >
              <Moon size={14} /> Dark
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
            >
              <Sun size={14} /> Light
            </button>
            <button
              onClick={() => setThemeMode('cyberpunk')}
              className={`theme-btn ${themeMode === 'cyberpunk' ? 'active' : ''}`}
            >
              ⚡ Cyber
            </button>
          </div>

          {/* Quick action button */}
          <button onClick={handleCreateTrigger} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '12px' }}>
            <Plus size={16} /> Log Entry
          </button>
        </div>
      </header>

      {/* Main visual layouts */}
      <main className="app-main">
        {/* Left Column: Sidebar widgets */}
        <div className="sidebar-panel">
          {/* Quick Config Actions */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Data Portability</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={handleExportJSON} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: '10px' }}>
                <Download size={14} /> Backup JSON
              </button>
              <button onClick={handleExportCSV} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: '10px' }}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
              <label 
                className="btn-secondary" 
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  fontSize: '0.8rem', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Upload size={14} /> Import Backup
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportJSON} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button 
                onClick={handleResetDemoData} 
                className="btn-secondary" 
                style={{ 
                  flex: 1,
                  padding: '6px 10px', 
                  fontSize: '0.75rem', 
                  borderRadius: '8px',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: 'var(--accent-primary)'
                }}
              >
                Load Demo Data
              </button>
              <button 
                onClick={handlePurgeAll} 
                className="btn-secondary" 
                style={{ 
                  padding: '6px 10px', 
                  fontSize: '0.75rem', 
                  borderRadius: '8px',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  color: 'var(--expense-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={12} /> Purge
              </button>
            </div>
          </div>

          {/* Budget Limits and Alerts list */}
          <BudgetManager
            budgets={budgets}
            transactions={transactions}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        </div>

        {/* Right Column: Dashboard visuals & ledger */}
        <div className="dashboard-panel">
          {/* Card Summary Metrics */}
          <DashboardMetrics
            transactions={transactions}
            budgets={budgets}
          />

          {/* Interactive Chart elements */}
          <ExpenseCharts
            transactions={transactions}
            themeMode={themeMode}
          />

          {/* Transaction Ledgers table */}
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>

      {/* Pop-up transaction form */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}

export default App;
