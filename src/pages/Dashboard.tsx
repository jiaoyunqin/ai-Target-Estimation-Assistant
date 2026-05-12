import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/transactions');
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">加载中...</div>;

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Chart Data preparation
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any, t) => {
      const category = t.categories?.name || '未分类';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const doughnutData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7',
          '#DDA0DD',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">财务仪表板</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">总收入</h3>
          <p className="text-2xl font-bold text-green-600">
            ¥{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">总支出</h3>
          <p className="text-2xl font-bold text-red-600">
            ¥{totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">结余</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            ¥{balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">支出分布</h3>
          <div className="h-64 flex justify-center">
            {Object.keys(expenseByCategory).length > 0 ? (
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-400 self-center">暂无数据</p>
            )}
          </div>
        </div>
        
        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近交易</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {t.categories?.name || '未分类'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {t.description || t.transaction_date}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}¥{parseFloat(t.amount).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
              {transactions.length === 0 && (
                <li className="py-4 text-center text-gray-500 text-sm">暂无交易记录</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};