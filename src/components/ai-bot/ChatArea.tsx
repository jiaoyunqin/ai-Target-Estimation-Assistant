import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Plus, Copy, ThumbsUp, ThumbsDown, Globe, Clock, FileText, ChevronDown, CheckCircle2, FileSpreadsheet, Loader2, X, Wallet, Target, HelpCircle, Pin, CheckSquare, Sparkles, Image as ImageIcon, Mic, Hash, AtSign, BarChart2, Settings, BrainCircuit, FileSearch, PieChart, FlaskConical, Upload, Download, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'file', name: string, icon: React.ReactNode }[];
  showReportAction?: boolean;
  isThinking?: boolean; // New prop for thinking state
  showAddToReportAction?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  onNewChat: () => void;
  onShowReport: () => void;
  agentName?: string;
  onAddToReport?: () => void;
  totalBudget?: number;
  onTotalBudgetChange?: (value: number) => void;
  onTabChange?: (tab: string) => void;
  promotionType?: string;
  onPromotionTypeChange?: (type: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, onNewChat, onShowReport, agentName = 'Data Agent', onAddToReport, totalBudget = 5000, onTotalBudgetChange, onTabChange, promotionType: propPromotionType, onPromotionTypeChange }) => {
  const [input, setInput] = useState('');
  const [expandedThinking, setExpandedThinking] = useState(true); // State for collapsible thinking section
  const [budgetConfigOpen, setBudgetConfigOpen] = useState(true);
  const [targetConfigOpen, setTargetConfigOpen] = useState(true);
  const [constraintConfigOpen, setConstraintConfigOpen] = useState(true);
  const [allConfigOpen, setAllConfigOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isSpecialAgent = agentName !== 'Data Agent';
  const isBudgetAgent = agentName.includes('预算分配优化') || agentName.includes('业务预算调整建议');
  const isManagerBriefAgent = agentName === '电商预算钱效洞察';
  const isLeaderBriefAgent = agentName === '预算钱效洞察';
  const isROIAttributionAgent = agentName === '预算钱效指标归因Agent';
  const isEcommerceIndustryAgent = agentName === '电商行业研究Agent';
  const isHealthAnalysisAgent = agentName === '钱效健康度分析Agent';
  const isPromotionAgent = agentName === '大促AI预算助手';
  const [activeTab, setActiveTab] = useState(isManagerBriefAgent ? '电商整体' : '平台用增');
  const [promotionConfigOpen, setPromotionConfigOpen] = useState(true);
  
  // 大促配置相关状态
  const [incrementalGmvTarget, setIncrementalGmvTarget] = useState('');
  const [stageConfigs, setStageConfigs] = useState([
    { id: 1, name: '预售期', startDate: '', endDate: '', gmvTarget: '' },
    { id: 2, name: '开门红', startDate: '', endDate: '', gmvTarget: '' }
  ]);
  const [bigDayDates, setBigDayDates] = useState<string[]>(['2026-11-11']);
  const [totalBudgetLimit, setTotalBudgetLimit] = useState('8000000');
  const [couponBudgetLimit, setCouponBudgetLimit] = useState('');
  const [supplementBudgetLimit, setSupplementBudgetLimit] = useState('');
  const [navigationBudgetLimit, setNavigationBudgetLimit] = useState('');
  const [dailyBudgetMode, setDailyBudgetMode] = useState<'file' | 'text'>('text');
  const [dailyBudgetText, setDailyBudgetText] = useState('');
  const [marketGmvTargetFile, setMarketGmvTargetFile] = useState<File | null>(null);
  const [historicalPeriods, setHistoricalPeriods] = useState<string[]>(['2025双11', '2025420大促']);
  const [showCompetitorInfo, setShowCompetitorInfo] = useState(false);
  const [competitorInfo, setCompetitorInfo] = useState({
    taobao: { start: '', end: '' },
    pdd: { start: '', end: '' },
    jd: { start: '', end: '' },
    douyin: { start: '', end: '' }
  });
  const [requiredFields, setRequiredFields] = useState({
    activityName: '双11 预售期',
    activityPeriod: '2026.10.20-11.11',
    totalGmvTarget: '120000000'
  });
  
  // 大促类型相关状态 - 支持外部传入和回调
  const [promotionType, setInternalPromotionType] = useState(propPromotionType || '618');
  const setPromotionType = (type: string) => {
    setInternalPromotionType(type);
    onPromotionTypeChange?.(type);
  };
  const [promotionTypes, setPromotionTypes] = useState<string[]>(['618', '双11', '双12', '年货节', '女神节', '38节', '520', '818', '99划算节']);
  const [showAddPromotionType, setShowAddPromotionType] = useState(false);
  const [newPromotionType, setNewPromotionType] = useState('');
  
  // 活动时间选择器状态
  const [activityStartDate, setActivityStartDate] = useState('2026-10-20');
  const [activityEndDate, setActivityEndDate] = useState('2026-11-11');
  const [newBigDayDate, setNewBigDayDate] = useState('');
  
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };
  
  const isFormValid = requiredFields.activityName && activityStartDate && activityEndDate;
  
  // 添加阶段
  const addStage = () => {
    setStageConfigs([...stageConfigs, { 
      id: Date.now(), 
      name: '', 
      startDate: '', 
      endDate: '', 
      gmvTarget: '' 
    }]);
  };
  
  // 删除阶段
  const removeStage = (id: number) => {
    if (stageConfigs.length > 1) {
      setStageConfigs(stageConfigs.filter(s => s.id !== id));
    }
  };
  
  // 更新阶段配置
  const updateStage = (id: number, field: string, value: string) => {
    setStageConfigs(stageConfigs.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };
  
  // 添加Big Day
  const addBigDay = (date: string) => {
    if (date && !bigDayDates.includes(date)) {
      setBigDayDates([...bigDayDates, date]);
    }
  };
  
  // 删除Big Day
  const removeBigDay = (date: string) => {
    setBigDayDates(bigDayDates.filter(d => d !== date));
  };
  
  // 历史周期推荐
  const recommendedPeriods = ['2025双11', '2025420大促', '2024双11', '2024630大促', '2024年货节'];
  
  // 电商管理者视角的推荐追问问题
  const managerFollowUpQuestions = [
    '费率上涨的核心原因是什么？',
    '高风险业务的优化空间有多大？',
    '下个月总预算怎么分配更合理？',
    '行业有哪些值得参考的投放新策略？'
  ];
  
  // 业务Leader视角的推荐追问问题
  const leaderFollowUpQuestions = [
    '低渗透地区和体验增长补贴单价过高背后的原因是什么',
    '腾挪出来的 1000 万预算，具体到玩法策略怎么分配效果最好',
    '阿里、拼多多的增长策略转向，会不会导致接下来行业流量成本进一步上涨'
  ];
  
  // ROI归因视角的推荐追问问题
  const roiAttributionFollowUpQuestions = [
    '拉新流失业务为什么消耗这么多？',
    '当前投放策略有没有优化空间？',
    '和上月同期比有什么差异？',
    '怎么调整能回到 2.4 的目标 ROI？'
  ];
  
  // 电商行业研究视角的推荐追问问题
  const ecommerceIndustryFollowUpQuestions = [
    '阿里和拼多多近期有哪些新的增长策略？',
    'AI在电商行业的应用趋势是什么？',
    '行业整体预算投入动向如何？'
  ];
  
  // 钱效健康度分析视角的推荐追问问题
  const healthAnalysisFollowUpQuestions = [
    '哪些业务需要立即下发整改任务？',
    '生成本周预算健康度复盘报告',
    '高风险业务 ROI 提升空间有多大？',
    '跟踪历史整改任务完成进度'
  ];
  
  const promotionFollowUpQuestions = [
    '帮我评估一下双11预售期GMV目标1.2亿是否合理',
    '把预算更多向高ROI渠道倾斜，保证总预算不超过800万',
    '短视频转化超预期，帮我判断要不要加投',
    '帮我总结一下这次预算调整的核心结论，给老板汇报用'
  ];

  const followUpQuestions = isPromotionAgent
    ? promotionFollowUpQuestions
    : isHealthAnalysisAgent 
      ? healthAnalysisFollowUpQuestions 
      : isEcommerceIndustryAgent 
        ? ecommerceIndustryFollowUpQuestions 
        : isROIAttributionAgent 
          ? roiAttributionFollowUpQuestions 
          : isManagerBriefAgent 
            ? managerFollowUpQuestions 
            : leaderFollowUpQuestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f7f8fa] border-r border-gray-200">
      {/* Top Tabs */}
      {isSpecialAgent && (
        <div className="flex items-center px-4 bg-white border-b border-gray-200">
          {(isManagerBriefAgent 
            ? ['电商整体', 'C侧', '大促', 'B侧'] 
            : ['平台用增', '平台活动', '商城频道', '独立端']
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); onTabChange?.(tab); }}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-800">{agentName}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
        
        {/* Budget Configuration Panel (Only for Budget Adjustment Agent) */}
        {isBudgetAgent && (
            <div className="sticky top-0 z-20 bg-[#f7f8fa] pb-4 w-full max-w-lg mx-auto space-y-3">
                {/* Toggle All Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            const newState = !allConfigOpen;
                            setAllConfigOpen(newState);
                            setBudgetConfigOpen(newState);
                            setTargetConfigOpen(newState);
                            setConstraintConfigOpen(newState);
                        }}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {allConfigOpen ? '收起全部' : '展开全部'}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${allConfigOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                {/* Section 1: Budget Configuration */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                        onClick={() => {
                            setBudgetConfigOpen(!budgetConfigOpen);
                            // Update allConfigOpen based on current states
                            setAllConfigOpen(prev => {
                                const newBudgetState = !budgetConfigOpen;
                                return newBudgetState && targetConfigOpen && constraintConfigOpen;
                            });
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-gray-800 text-sm">预算配置</span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">必填</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${budgetConfigOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {budgetConfigOpen && (
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                                    总预算（元）
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={(totalBudget * 10000).toString()}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && val >= 0) {
                                                onTotalBudgetChange?.(Math.floor(val / 10000));
                                            }
                                        }}
                                        className="w-full pl-3 pr-16 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">¥{totalBudget}万</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: Core Targets */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                        onClick={() => {
                            setTargetConfigOpen(!targetConfigOpen);
                            // Update allConfigOpen based on current states
                            setAllConfigOpen(prev => {
                                const newTargetState = !targetConfigOpen;
                                return budgetConfigOpen && newTargetState && constraintConfigOpen;
                            });
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-500" />
                            <span className="font-bold text-gray-800 text-sm">核心目标</span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">必填</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${targetConfigOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {targetConfigOpen && (
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                                    DAU目标（人）
                                    <HelpCircle className="w-3 h-3 text-gray-300" />
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="70000000"
                                        className="w-full pl-3 pr-16 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">7000.0万</span>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                                    DAC目标（人）
                                    <HelpCircle className="w-3 h-3 text-gray-300" />
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="18000000"
                                        className="w-full pl-3 pr-16 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">1800.0万</span>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                                    GMV目标（元）
                                    <HelpCircle className="w-3 h-3 text-gray-300" />
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="2000000000"
                                        className="w-full pl-3 pr-16 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">¥2.00亿</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Constraints (Basic Principles) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                        onClick={() => {
                            setConstraintConfigOpen(!constraintConfigOpen);
                            // Update allConfigOpen based on current states
                            setAllConfigOpen(prev => {
                                const newConstraintState = !constraintConfigOpen;
                                return budgetConfigOpen && targetConfigOpen && newConstraintState;
                            });
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Pin className="w-4 h-4 text-red-500 fill-current" />
                            <span className="font-bold text-gray-800 text-sm">约束条件</span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">必填</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${constraintConfigOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {constraintConfigOpen && (
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-500">
                                    最低长期ROI底线
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-20">
                                        <input 
                                            type="text" 
                                            defaultValue="1.2"
                                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-center text-gray-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-400">倍</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {[
                                    'LT 显著正',
                                    '新客DAC 显著正',
                                    'DAC 显著正',
                                    'GMV 显著正'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-50 rounded-lg">
                                        <div className="bg-blue-500 rounded flex items-center justify-center p-0.5">
                                            <CheckSquare className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-600">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:bg-gray-50 flex items-center justify-between px-4 group transition-colors">
                                <div className="flex items-center gap-1 group-hover:text-gray-600">
                                    <Plus className="w-3 h-3" />
                                    <span>新增原则</span>
                                </div>
                                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">预留</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Promotion Budget Configuration Panel */}
        {isPromotionAgent && (
            <div className="sticky top-0 z-20 bg-[#f7f8fa] pb-4 w-full max-w-lg mx-auto space-y-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                        onClick={() => setPromotionConfigOpen(!promotionConfigOpen)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-500" />
                            <span className="font-bold text-gray-800 text-sm">大促预算配置</span>
                            <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded">双11</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${promotionConfigOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {promotionConfigOpen && (
                        <div className="p-4 space-y-5">
                            {/* 基础信息 */}
                            <div className="space-y-3">
                                {/* 大促类型选择 */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block">大促类型 <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={promotionType}
                                            onChange={(e) => {
                                                if (e.target.value === '__add_new__') {
                                                    setShowAddPromotionType(true);
                                                } else {
                                                    setPromotionType(e.target.value);
                                                    const today = new Date().getFullYear();
                                                    // 根据大促类型设置默认活动周期和BigDay
                                                    let startDate = '';
                                                    let endDate = '';
                                                    let bigDay = '';
                                                    if (e.target.value === '618') {
                                                        startDate = `${today}-06-15`;
                                                        endDate = `${today}-06-20`;
                                                        bigDay = `${today}-06-18`;
                                                    } else if (e.target.value === '双11') {
                                                        startDate = `${today}-11-01`;
                                                        endDate = `${today}-11-11`;
                                                        bigDay = `${today}-11-11`;
                                                    } else if (e.target.value === '双12') {
                                                        startDate = `${today}-12-01`;
                                                        endDate = `${today}-12-12`;
                                                        bigDay = `${today}-12-12`;
                                                    }
                                                    setActivityStartDate(startDate);
                                                    setActivityEndDate(endDate);
                                                    if (bigDay) {
                                                        setBigDayDates([bigDay]);
                                                    }
                                                    setRequiredFields({
                                                        ...requiredFields,
                                                        activityName: `${today}年${e.target.value}年中大促`,
                                                        activityPeriod: startDate && endDate ? `${startDate}至${endDate}` : ''
                                                    });
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                                        >
                                            <option value="">请选择大促类型</option>
                                            <option value="618">618</option>
                                            <option value="双11">双11</option>
                                            <option value="双12">双12</option>
                                            <option value="年货节">年货节</option>
                                            <option value="女神节">女神节</option>
                                            <option value="38节">38节</option>
                                            <option value="520">520</option>
                                            <option value="818">818</option>
                                            <option value="99划算节">99划算节</option>
                                            <option value="__add_new__">+ 新增大促类型</option>
                                        </select>
                                    </div>
                                    
                                    {/* 新增大促类型弹窗 */}
                                    {showAddPromotionType && (
                                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newPromotionType}
                                                    onChange={(e) => setNewPromotionType(e.target.value)}
                                                    placeholder="输入新的大促类型名称"
                                                    className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (newPromotionType.trim()) {
                                                            setPromotionTypes([...promotionTypes, newPromotionType.trim()]);
                                                            setPromotionType(newPromotionType.trim());
                                                            setNewPromotionType('');
                                                            setShowAddPromotionType(false);
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                >
                                                    添加
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowAddPromotionType(false);
                                                        setNewPromotionType('');
                                                    }}
                                                    className="px-3 py-2 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300"
                                                >
                                                    取消
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block">活动名称 <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={requiredFields.activityName}
                                        onChange={(e) => setRequiredFields({...requiredFields, activityName: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block">活动周期 <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="date"
                                            value={activityStartDate}
                                            onChange={(e) => setActivityStartDate(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100" 
                                        />
                                        <span className="text-gray-400">至</span>
                                        <input 
                                            type="date"
                                            value={activityEndDate}
                                            onChange={(e) => setActivityEndDate(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1.5 block">Big Day <span className="text-gray-400 text-[10px]">(支持多选)</span></label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {bigDayDates.map((date, index) => (
                                            <div key={index} className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg">
                                                <span className="text-sm text-orange-700">{formatDate(date)}</span>
                                                <button
                                                    onClick={() => setBigDayDates(bigDayDates.filter((_, i) => i !== index))}
                                                    className="text-orange-500 hover:text-orange-700"
                                                >
                                                    <span className="text-xs">×</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="date"
                                            value={newBigDayDate}
                                            onChange={(e) => setNewBigDayDate(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100" 
                                        />
                                        <button
                                            onClick={() => {
                                                if (newBigDayDate && !bigDayDates.includes(newBigDayDate)) {
                                                    setBigDayDates([...bigDayDates, newBigDayDate]);
                                                    setNewBigDayDate('');
                                                }
                                            }}
                                            className="px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            + 添加
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 发起测算按钮 */}
                            <button 
                                disabled={!isFormValid}
                                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isFormValid 
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isFormValid ? '发起测算' : '请填写必填项'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Messages List */}
        <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-purple-100 text-purple-600' : 'bg-black text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 w-full">
                {/* Text Bubble */}
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                }`}>
                  {msg.content}
                </div>

                {/* Rendering Custom Reasoning Demo if flag is true */}
                {(msg as any).isReasoningDemo && (
                    <div className="mt-4 w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Reasoning Header */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                            <BrainCircuit className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-bold text-gray-700">思考推理</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                        
                        {/* List Title */}
                        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-gray-800">阿里电商AI营销工具全景梳理</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>

                        {/* Action Items List */}
                        <div className="p-3 space-y-2 bg-gray-50/50">
                            <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                <span className="text-sm text-gray-700">淘宝天猫AI客服导购工具调研</span>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                <span className="text-sm text-gray-700">搜索万相台盘点AI工具信息</span>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                <span className="text-sm text-gray-700">阿里巴巴电商AI工具最新动态洞察</span>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                <span className="text-sm text-gray-700">阿里电商AI工具竞品对比</span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                  <span className="text-sm text-gray-700">淘宝天猫AI营销工具续研盘点</span>
                                </div>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    展开 <ChevronDown className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Thinking / Process Steps Block (Only for Assistant in Special Agent scenarios) */}
                {msg.role === 'assistant' && isSpecialAgent && (
                    <div className="mt-2 w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        
                        {/* 1. 思考推理 Section */}
                        <div className="p-4 border-b border-gray-100">
                            <button 
                                onClick={() => setExpandedThinking(!expandedThinking)}
                                className="flex items-center gap-2 text-gray-900 font-bold mb-3 hover:text-gray-700 w-full"
                            >
                                <CheckCircle2 className="w-4 h-4 text-gray-900" />
                                <span>思考推理</span>
                                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${expandedThinking ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {expandedThinking && (
                                <div className="space-y-4 pl-1 relative">
                                    {/* Vertical dashed line */}
                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l border-dashed border-gray-200"></div>

                                    {/* Step 1 */}
                                    <div className="relative pl-6">
                                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700 font-medium">浏览上传文件目录</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed pl-1">
                                            我将列出 upload 目录中的文件并预览该 Excel 的两张 sheet，以确认字段与样本...
                                        </p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="relative pl-6">
                                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700 font-medium">浏览上传文件内容</span>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="relative pl-6">
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileSpreadsheet className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-700 font-medium">读取钱效分析数据集_数据26年1月_pxf.xlsx</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-200 w-fit px-2 py-1 rounded text-xs text-gray-600">
                                                <X className="w-3 h-3" />
                                                <span>钱效分析数据集_数据26年1月_pxf.xlsx</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-2">
                                            我将按四步法完成占比计算、交叉归因与象限分层，并生成图表与飞书文档交付...
                                        </p>
                                        <p className="text-xs text-gray-500 leading-relaxed pl-1">
                                            我将委派数据分析与报告生成子任务：计算占比、归因与象限分层，生成图表并...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. 钱效数据分析与报告生成 Section */}
                        <div className="p-4 bg-gray-50">
                            <button className="flex items-center gap-2 text-gray-900 font-bold w-full hover:text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-gray-900" />
                                <span>钱效数据分析与报告生成</span>
                                <ChevronDown className="w-4 h-4 ml-auto" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Attachments if any */}
                {msg.attachments && (
                  <div className="flex flex-col gap-2 mt-2">
                    {msg.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm w-64">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                          {att.icon}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-medium text-gray-800 truncate" title={att.name}>{att.name}</span>
                            <span className="text-[10px] text-gray-400">{att.type.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons for Assistant */}
                {msg.role === 'assistant' && (
                  <div className="flex flex-col gap-2 mt-2">
                    {msg.showReportAction && (
                        <button 
                            onClick={onShowReport}
                            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors w-full border border-blue-100 font-medium text-sm"
                        >
                            <Globe className="w-4 h-4" />
                            网页版报告（在线访问）
                        </button>
                    )}
                    {msg.showAddToReportAction && (
                        <button 
                            onClick={onAddToReport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors w-fit border border-blue-100 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>添加至右侧报告</span>
                        </button>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><Copy className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><ThumbsUp className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><ThumbsDown className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="text-xs text-gray-300 ml-auto">以上信息已记录</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        </div>

        {/* 推荐追问问题区域 - 电商管理者、业务Leader、ROI归因、电商行业研究和钱效健康度分析视角下显示 */}
        {(isManagerBriefAgent || isLeaderBriefAgent || isROIAttributionAgent || isEcommerceIndustryAgent || isHealthAnalysisAgent || isPromotionAgent) && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-gray-600 text-sm font-medium mb-3">推荐追问：</p>
            <div className="space-y-2">
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSendMessage(question);
                  }}
                  className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {isPromotionAgent && (
          <div className="mt-4 flex items-center gap-2 px-1">
            <button
              onClick={() => window.open('/target-explanation', '_blank')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
            >
              <FileSearch className="w-3.5 h-3.5" />
              预测解释
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <PieChart className="w-3.5 h-3.5" />
              结构拆解
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              策略模拟
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          {/* Context Badge - Only for Promotion Agent */}
          {isPromotionAgent && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
                <span className="text-purple-600">🎯</span>
                <span className="text-xs font-medium text-purple-700">当前检索范围：大促 &gt; 目标测算专属知识库</span>
                <div className="relative group">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    AI 将优先在带有「目标测算」标签的知识中搜索
                  </div>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden flex flex-col">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`您正在与 ${agentName} 聊天...`}
                className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400"
              />
              
              {/* Bottom Action Bar inside Input */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                {/* Left Icons */}
                <div className="flex items-center gap-2 text-gray-400">
                  <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                    <AtSign className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                    <Hash className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Center Model Selector */}
                <button type="button" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 transition-colors">
                  <span>DeepSeek-V3</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">内容由 AI 生成，请仔细甄别</span>
          </div>
        </div>
      </div>
    </div>
  );
};


