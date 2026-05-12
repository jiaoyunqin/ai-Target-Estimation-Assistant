import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            💰 预算 AI
          </h1>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link to="/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-8">
          智能预算分析 AI 机器人
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12">
          专为个人和小微企业设计的智能财务管理工具。通过 AI 技术自动分析收支情况，提供个性化的财务建议和预算管理。
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="px-8 text-lg">
              立即开始
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="px-8 text-lg">
              登录账户
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};