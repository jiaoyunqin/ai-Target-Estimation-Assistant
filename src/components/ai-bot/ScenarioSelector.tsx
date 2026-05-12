import React, { useState } from 'react';
import { Send, PieChart, TrendingUp, Target, Search, Sparkles, UserCircle, Briefcase, Globe } from 'lucide-react';

type Role = 'manager' | 'leader' | 'bp' | 'finance_bp';

interface ScenarioSelectorProps {
  role: Role;
  onSelectScenario: (scenario: string, title: string) => void;
  onSendMessage: (msg: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ role, onSelectScenario, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const commonScenarios = [
      {
        title: '钱效健康度分析',
        subtitle: '深入分析整体预算健康度',
        icon: <PieChart className="w-6 h-6 text-purple-600" />,
        query: '我想看下钱效健康度分析',
        agentName: '钱效健康度分析Agent'
      },
      {
        title: '预算分配优化',
        subtitle: '提供预算分配与优化建议',
        icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
        query: '请基于历史数据，帮我生成预算分配优化建议',
        agentName: '预算分配优化Agent'
      },
      {
        title: '预算钱效指标归因',
        subtitle: '识别钱效数据异动核心原因',
        icon: <Target className="w-6 h-6 text-purple-600" />,
        query: '帮我分析平台用增业务近 7 天 ROI 为什么跌了',
        agentName: '预算钱效指标归因Agent'
      },
      {
        title: '钱效数据查询',
        subtitle: 'AI快速查询各类钱效数据',
        icon: <Search className="w-6 h-6 text-purple-600" />,
        query: '帮我查询近期的钱效核心数据',
        agentName: '钱效数据查询Agent'
      },
      {
        title: '电商行业研究',
        subtitle: '获取电商行业最新动态与洞察',
        icon: <Globe className="w-6 h-6 text-purple-600" />,
        query: '帮我整理近期电商行业研究报告',
        agentName: '电商行业研究Agent'
      }
  ];

  const currentScenarios = commonScenarios;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full relative">
      <div className="max-w-4xl w-full flex flex-col items-center gap-12 mt-8">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Hi~</h1>
          <h2 className="text-3xl font-bold text-gray-800">我是AI预算助手</h2>
          <p className="text-gray-500 mt-2">请先选择使用场景，我们会为您提供更准确的服务</p>
        </div>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {currentScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => onSelectScenario(scenario.query, scenario.agentName)}
              className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all text-left group"
            >
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                {scenario.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{scenario.title}</h3>
                <p className="text-sm text-gray-500">{scenario.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-3xl mt-8 relative">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请告诉我想做的分析，可输入 / 选择内容"
              className="w-full h-16 pl-6 pr-16 bg-white border-2 border-purple-100 rounded-2xl shadow-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all text-lg placeholder:text-gray-300"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-transparent text-purple-600 hover:text-purple-700 disabled:text-gray-300 transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          
          <div className="absolute -top-10 right-0 flex items-center gap-2 text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-50">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            人工服务
          </div>
        </div>

      </div>
    </div>
  );
};
