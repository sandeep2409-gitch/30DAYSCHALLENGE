import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import type { Transaction, ThemeMode } from '../types';
import { CATEGORIES } from '../mockData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExpenseChartsProps {
  transactions: Transaction[];
  themeMode: ThemeMode;
}

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ transactions, themeMode }) => {
  // Theme Color Configurations
  const isDark = themeMode === 'dark';
  const isCyber = themeMode === 'cyberpunk';
  
  const labelColor = isCyber ? '#eab308' : isDark ? '#94a3b8' : '#475569';
  const gridColor = isCyber ? 'rgba(234, 179, 8, 0.1)' : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.08)';
  const tooltipBg = isCyber ? '#0a0a10' : isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isCyber ? '#eab308' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.2)';
  const tooltipTextColor = isCyber ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a';

  // --- CHART 1: EXPENSES BY CATEGORY (DOUGHNUT) ---
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const doughnutLabels = Object.keys(expensesByCategory);
  const doughnutDataValues = Object.values(expensesByCategory);
  
  // Find colors from CATEGORIES definition
  const doughnutColors = doughnutLabels.map((catName) => {
    const found = CATEGORIES.find((c) => c.value === catName);
    return found ? `hsl(${found.color})` : 'hsl(220, 10%, 60%)';
  });

  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutDataValues,
        backgroundColor: doughnutColors,
        borderWidth: isCyber ? 2 : 1,
        borderColor: isCyber ? '#eab308' : isDark ? '#0b0f19' : '#ffffff',
        hoverOffset: 12,
      },
    ],
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: labelColor,
          font: { family: 'Outfit', size: 12, weight: 'normal' },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: labelColor,
        bodyColor: tooltipTextColor,
        bodyFont: { family: 'Outfit' },
        titleFont: { family: 'Outfit', weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            return ` Spent: $${val.toFixed(2)}`;
          },
        },
      },
    },
    cutout: '65%',
  };

  // --- CHART 2: DAILY/MONTHLY SPENDING TREND (LINE) ---
  // Group expenses by date (sorted chronological)
  const expensesByDate = expenseTransactions.reduce((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(expensesByDate).sort();
  const trendValues = sortedDates.map((d) => expensesByDate[d]);

  // Clean date labels for UI (e.g. May 26)
  const trendLabels = sortedDates.map((dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  });

  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        fill: true,
        label: 'Spending Trend',
        data: trendValues,
        borderColor: isCyber ? '#eab308' : '#6366f1',
        borderWidth: 3,
        pointBackgroundColor: isCyber ? '#ec4899' : '#a855f7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: trendValues.length > 25 ? 0 : 4,
        pointHoverRadius: 7,
        tension: 0.35,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          if (isCyber) {
            gradient.addColorStop(0, 'rgba(234, 179, 8, 0.25)');
            gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          }
          return gradient;
        },
      },
    ],
  };

  const trendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: labelColor,
        bodyColor: tooltipTextColor,
        bodyFont: { family: 'Outfit' },
        titleFont: { family: 'Outfit', weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            return ` Spending: $${val.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: labelColor, font: { family: 'Outfit', size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { family: 'Outfit', size: 10 } },
      },
    },
  };

  // --- CHART 3: CASH FLOW INCOME VS EXPENSES (BAR) ---
  // Let's group by month or weeks. Let's do simple Monthly summary
  const cashFlowByMonth = transactions.reduce((acc, t) => {
    const d = new Date(t.date);
    const monthKey = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
    
    if (!acc[monthKey]) acc[monthKey] = { income: 0, expense: 0 };
    if (t.type === 'income') acc[monthKey].income += t.amount;
    else acc[monthKey].expense += t.amount;
    
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  // Sort monthly keys chronological (e.g. 2026 May)
  const sortedMonths = Object.keys(cashFlowByMonth).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  const incomeValues = sortedMonths.map((m) => cashFlowByMonth[m].income);
  const expenseValues = sortedMonths.map((m) => cashFlowByMonth[m].expense);

  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: incomeValues,
        backgroundColor: isCyber ? 'rgba(6, 182, 212, 0.85)' : 'rgba(16, 185, 129, 0.85)',
        borderColor: isCyber ? '#06b6d4' : '#10b981',
        borderWidth: isCyber ? 1.5 : 0,
        borderRadius: 8,
      },
      {
        label: 'Expenses',
        data: expenseValues,
        backgroundColor: isCyber ? 'rgba(236, 72, 153, 0.85)' : 'rgba(239, 68, 68, 0.85)',
        borderColor: isCyber ? '#ec4899' : '#ef4444',
        borderWidth: isCyber ? 1.5 : 0,
        borderRadius: 8,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
          font: { family: 'Outfit', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: labelColor,
        bodyColor: tooltipTextColor,
        bodyFont: { family: 'Outfit' },
        titleFont: { family: 'Outfit', weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: labelColor, font: { family: 'Outfit' } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { family: 'Outfit' } },
      },
    },
  };

  // Helper total spent
  const totalSpent = doughnutDataValues.reduce((sum: number, v: number) => sum + v, 0);

  return (
    <div className="charts-grid">
      {/* Chart 1: Spend Trend Line Chart */}
      <div className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Spending Chronology</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily transaction history timeline</p>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          {trendValues.length > 0 ? (
            <Line data={trendData} options={trendOptions} />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No expenses recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Category Breakdown Doughnut Chart */}
      <div className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Breakdown</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allocation of expenses by category</p>
        </div>
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          {doughnutDataValues.length > 0 ? (
            <>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '28%', // Shift left slightly to align visually with offset legend
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <span className="form-label" style={{ fontSize: '0.65rem', display: 'block', marginBottom: '2px' }}>Total Spent</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No expenses recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Chart 3: Cash Flow Bar Chart (Full Width) */}
      <div className="glass-card" style={{ height: '320px', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monthly Cash Flow</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Side-by-side comparison of Income vs Expenses</p>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          {sortedMonths.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No transaction history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
