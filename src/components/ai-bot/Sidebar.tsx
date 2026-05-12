import React, { useState } from 'react';
import { Plus, Search, Clock, LogOut, ChevronLeft, ChevronRight, Loader2, TrendingUp, Target, ChevronDown, BookOpen, ClipboardList, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onHistoryItemClick?: (scenarioTitle: string) => void;
  role: 'manager' | 'leader' | 'bp' | 'finance_bp';
  onRoleChange: (role: 'manager' | 'leader' | 'bp' | 'finance_bp') => void;
  onKnowledgeBaseClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isCollapsed, onToggleCollapse, onHistoryItemClick, role, onRoleChange, onKnowledgeBaseClick }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
        className={`h-full bg-[#f7f8fa] border-r border-gray-200 flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm z-20 hover:bg-gray-50 text-gray-500"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className="p-4">
        {isCollapsed ? (
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">AI</div>
                <button 
                  onClick={onNewChat}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white text-xs">AI</span>
                        AI预算助手
                    </h2>
                    
                    {/* Role Switcher Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                            {role === 'manager' ? '电商管理者' : role === 'leader' ? '业务Leader' : role === 'finance_bp' ? '财务BP' : '资管BP'}
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-1">
                                <button 
                                    onClick={() => onRoleChange('manager')}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${role === 'manager' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    电商管理者
                                </button>
                                <button 
                                    onClick={() => onRoleChange('leader')}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${role === 'leader' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    业务Leader
                                </button>
                                <button 
                                    onClick={() => onRoleChange('bp')}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${role === 'bp' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    资管BP
                                </button>
                                <button 
                                    onClick={() => onRoleChange('finance_bp')}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${role === 'finance_bp' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    财务BP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={onNewChat}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors mb-4"
                >
                  <Plus className="w-4 h-4" />
                  <span>新建对话</span>
                </button>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="请搜索..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
            </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {!isCollapsed && (
            <>
                {/* Mock History Item 1 */}
                <div className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-800 text-sm truncate">电商预算钱效简报0318</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">刚刚</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded text-[10px] text-purple-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      预算调配建议
                    </span>
                  </div>
                </div>

                {/* Mock History Item 2 */}
                <div 
                    className="p-3 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all group"
                    onClick={() => onHistoryItemClick && onHistoryItemClick('预算钱效归因Agent')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800 text-sm truncate">费率波动归因</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">1天前</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded w-fit">
                    <Target className="w-3 h-3" />
                    <span>预算钱效归因</span>
                  </div>
                </div>
            </>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        {/* Budget Allocation Record Menu */}
        <div className="mb-2">
            {isCollapsed ? (
                <button 
                    className="w-full flex justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-md transition-colors"
                    title="预算调配记录"
                >
                    <ClipboardList className="w-5 h-5" />
                </button>
            ) : (
                <button 
                    className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors"
                >
                    <div className="bg-purple-100 p-1.5 rounded-md text-purple-600">
                        <ClipboardList className="w-4 h-4" />
                    </div>
                    <span>预算调配记录</span>
                </button>
            )}
        </div>

        {/* Knowledge Base Menu */}
        <div className="mb-4 pb-4 border-b border-gray-100">
            {isCollapsed ? (
                <button 
                    onClick={onKnowledgeBaseClick}
                    className="w-full flex justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-md transition-colors"
                    title="我的知识库"
                >
                    <BookOpen className="w-5 h-5" />
                </button>
            ) : (
                <button 
                    onClick={onKnowledgeBaseClick}
                    className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors"
                >
                    <div className="bg-purple-100 p-1.5 rounded-md text-purple-600">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span>我的知识库</span>
                </button>
            )}
        </div>

        {/* Bottom Icons: User Profile */}
        <div className="flex flex-col gap-3 mt-2">
            {/* User Profile & Logout Popover */}
            <div className="relative group mt-2 flex items-center gap-2 px-2 cursor-pointer">
                <button className={`w-8 h-8 rounded-full border border-gray-200 p-0.5 overflow-hidden block hover:opacity-90 transition-opacity`}>
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                        alt="User Avatar" 
                        className="w-full h-full rounded-full object-cover"
                    />
                </button>
                
                {!isCollapsed && (
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                        {user?.name || 'Demo'}
                    </span>
                )}
                
                {/* Hover Popover for Logout */}
                <div className={`absolute bottom-full ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'left-0 w-full'} mb-2 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1 min-w-[120px]`}>
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{user?.name || 'Demo'}</p>
                        <p className="text-[10px] text-gray-500 truncate">{role === 'manager' ? '电商管理者' : role === 'leader' ? '业务Leader' : role === 'finance_bp' ? '财务BP' : '资管BP'}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut className="w-3 h-3" />
                        退出登录
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
