import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/ai-bot/Sidebar';
import { ScenarioSelector } from '../components/ai-bot/ScenarioSelector';
import { ChatArea } from '../components/ai-bot/ChatArea';
import { ReportArea } from '../components/ai-bot/ReportArea';
import { KnowledgeBase } from '../components/ai-bot/KnowledgeBase';
import { FileText, BarChart2, Briefcase, UserCircle } from 'lucide-react';
import { api } from '../lib/api';

type Role = 'manager' | 'leader' | 'bp' | 'finance_bp';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'file', name: string, icon: React.ReactNode }[];
  showReportAction?: boolean;
  isReasoningDemo?: boolean;
  isThinking?: boolean;
  showAddToReportAction?: boolean; // New prop for the specific action
}

export const AIChat: React.FC = () => {
  const [role, setRole] = useState<Role>('manager');
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  
  // 行业身份管理
  const [industryContext, setIndustryContext] = useState<{
    industry: string;
    industryId: string;
    dataScope: string;
  } | null>(null);
  
  // 商城频道管理
  const [mallChannelTab, setMallChannelTab] = useState<'budget' | 'target' | 'monitor'>('target');
  
  // Set default mode and state based on role
  const [mode, setMode] = useState<'scenario' | 'chat'>(role === 'manager' || role === 'leader' ? 'chat' : 'scenario');
  const [showReport, setShowReport] = useState(role === 'manager' || role === 'leader');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentAgentName, setCurrentAgentName] = useState(role === 'manager' ? '电商预算钱效洞察' : '预算钱效洞察');
  const [reportType, setReportType] = useState(role === 'manager' ? 'manager_brief' : 'budget_attribution'); // Manager gets brief, others get attribution
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(role === 'manager'); // Auto collapse for manager view

  const [chatWidth, setChatWidth] = useState(400);
  const [reportWidth, setReportWidth] = useState(0); // State to track report width
  const [isResizing, setIsResizing] = useState(false);
  const [isReportResizing, setIsReportResizing] = useState(false); // State for report resizing
  const [aiContentMode, setAiContentMode] = useState<'default' | 'ai_marketing_tools'>('default');
  const [showNewConclusion, setShowNewConclusion] = useState(false); // State to show new conclusion in report
  
  // 预算分配指令状态
  const [budgetCommand, setBudgetCommand] = useState<{
    type: 'add_item' | 'update_total' | 'update_direction';
    direction?: 'gmv' | 'dau' | 'dac';
    itemName?: string;
    budget?: number;
    totalBudget?: number;
  } | null>(null);
  
  // 总预算状态（单位：万）
  const [totalBudget, setTotalBudget] = useState(5000);
  const [promotionType, setPromotionType] = useState('618'); // 当前大促类型
  
  // 大促类型切换处理
  const handlePromotionTypeChange = (type: string) => {
    setPromotionType(type);
    // 可以在这里添加更多联动逻辑，比如重新加载参考数据等
  };

  // Update view and clear history when role changes
  useEffect(() => {
    // Clear history
    setMessages([]);

    if (role === 'manager') {
      setMode('chat');
      setShowReport(true);
      setCurrentAgentName('电商预算钱效洞察');
      setReportType('manager_brief'); // Default manager report
      setIsSidebarCollapsed(false); // Keep sidebar open initially so user sees role changed
      setIndustryContext(null); // 清除行业上下文
      
      // Optionally pre-fill a message to explain the context
      setMessages([
        {
          id: 'init-manager',
          role: 'assistant',
          content: '欢迎来到电商预算钱效洞察。右侧已为您加载最新一周的核心洞察内容，请问您想深入了解哪部分信息，可直接与我对话',
          timestamp: new Date(),
          showReportAction: true
        }
      ]);
    } else if (role === 'leader') {
      setMode('chat');
      setShowReport(true);
      setCurrentAgentName('预算钱效洞察');
      setReportType('budget_attribution'); // Use budget attribution report for Leader
      setIsSidebarCollapsed(false);
      // 绑定业务Leader的行业身份
      setIndustryContext({
        industry: '3C数码',
        industryId: 'IND003',
        dataScope: '仅限本行业'
      });
      
      setMessages([
        {
          id: 'init-leader',
          role: 'assistant',
          content: '您好，我是预算钱效洞察。右侧是为您生成的最新预算归因分析报告。',
          timestamp: new Date(),
          showReportAction: true
        }
      ]);
    } else if (role === 'bp' || role === 'finance_bp') {
      setMode('scenario');
      setShowReport(false);
      setCurrentAgentName('Data Agent');
      setReportType('default');
      setIsSidebarCollapsed(false);
      setIndustryContext(null); // 清除行业上下文
      setMessages([]);
    }
  }, [role]);

  // Resize handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const startReportResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsReportResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const sidebarWidth = isSidebarCollapsed ? 64 : 256;
        const newWidth = Math.max(300, Math.min(800, e.clientX - sidebarWidth));
        setChatWidth(newWidth);
      }
      
      if (isReportResizing) {
        // Calculate new report width from right edge
        // Min width 380px (default), Max width 600px
        const newWidth = Math.max(380, Math.min(800, window.innerWidth - e.clientX));
        setReportWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsReportResizing(false);
    };

    if (isResizing || isReportResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isReportResizing, isSidebarCollapsed]);

  // Reset state when switching to scenario mode
  const handleNewChat = () => {
    setMode('scenario');
    setMessages([]);
    setShowReport(false);
    setLoading(false);
    setCurrentAgentName('Data Agent');
    setReportType('default');
    setIsSidebarCollapsed(false);
    setChatWidth(400); // Reset width
  };

  const handleSendMessage = async (text: string, scenarioTitle?: string) => {
    // 解析预算分配指令
    const parseBudgetCommand = (input: string) => {
      const lowerInput = input.toLowerCase();
      
      // 识别方向（兼容新旧名称）
      let direction: 'gmv' | 'dau' | 'dac' | null = null;
      if (lowerInput.includes('促活') || lowerInput.includes('gmv') || lowerInput.includes('增长方向')) {
        direction = 'gmv';
      } else if (lowerInput.includes('促转化') || lowerInput.includes('dau')) {
        direction = 'dau';
      } else if (lowerInput.includes('促gmv') || lowerInput.includes('dac') || lowerInput.includes('优化方向')) {
        direction = 'dac';
      }
      
      // 指令类型1：修改总预算
      if (lowerInput.includes('总预算') || lowerInput.includes('总金额')) {
        const budgetMatch = input.match(/(\d+)万/);
        if (budgetMatch && budgetMatch[1]) {
          const totalBudget = parseInt(budgetMatch[1]);
          return { type: 'update_total' as const, totalBudget };
        }
      }
      
      // 指令类型2：修改某个方向的预算
      if (direction && (lowerInput.includes('改成') || lowerInput.includes('改为') || lowerInput.includes('调整为'))) {
        const budgetMatch = input.match(/(\d+)万/);
        if (budgetMatch && budgetMatch[1]) {
          const budget = parseInt(budgetMatch[1]);
          return { type: 'update_direction' as const, direction, budget };
        }
      }
      
      // 指令类型3：增加新玩法
      if (direction && lowerInput.includes('增加')) {
        // 提取玩法名称
        let itemName = '';
        const addMatch = input.match(/增加(.+?)，/);
        if (addMatch && addMatch[1]) {
          itemName = addMatch[1].trim();
        }
        
        // 提取预算金额
        let budget = 0;
        const budgetMatch = input.match(/(\d+)万/);
        if (budgetMatch && budgetMatch[1]) {
          budget = parseInt(budgetMatch[1]);
        }
        
        if (itemName && budget > 0) {
          return { type: 'add_item' as const, direction, itemName, budget };
        }
      }
      
      return null;
    };
    
    const parsedCommand = parseBudgetCommand(text);
    console.log('=== 预算指令解析结果 ===');
    console.log('输入文本:', text);
    console.log('解析结果:', parsedCommand);
    console.log('当前reportType:', reportType);
    console.log('是否匹配条件:', parsedCommand && reportType === 'budget_adjustment');
    
    if (parsedCommand && reportType === 'budget_adjustment') {
      // 添加用户消息
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      
      // 如果是修改总预算，同步更新 totalBudget 状态
      if (parsedCommand.type === 'update_total' && parsedCommand.totalBudget) {
        setTotalBudget(parsedCommand.totalBudget);
      }
      
      // 设置预算指令，触发右侧更新
      setBudgetCommand(parsedCommand);
      
      // 生成AI确认消息
      let aiContent = '';
      if (parsedCommand.type === 'update_total') {
        aiContent = `好的，已将总预算调整为${parsedCommand.totalBudget}万。请查看右侧预算分配工作台，各项数据已自动联动更新。`;
      } else if (parsedCommand.type === 'update_direction') {
        const dirName = parsedCommand.direction === 'gmv' ? '促活' : parsedCommand.direction === 'dau' ? '促转化' : '促GMV';
        aiContent = `好的，已将${dirName}方向预算调整为${parsedCommand.budget}万。请查看右侧预算分配工作台，各项数据已自动联动更新。`;
      } else if (parsedCommand.type === 'add_item') {
        const dirName = parsedCommand.direction === 'gmv' ? '促活' : parsedCommand.direction === 'dau' ? '促转化' : '促GMV';
        aiContent = `好的，已在${dirName}中添加了"${parsedCommand.itemName}"，预算${parsedCommand.budget}万。请查看右侧预算分配工作台，各项数据已自动联动更新。`;
      }
      
      // 添加AI确认消息
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        
        // 清空指令，避免重复触发
        setTimeout(() => {
          setBudgetCommand(null);
        }, 500);
      }, 500);
      
      return;
    } else if (reportType === 'budget_adjustment') {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，我没有理解您的预算分配指令。您可以尝试：\n1. "总预算改成5000万"\n2. "促活方向预算改成2000万"\n3. "促活，增加一个大额满减券，直接给分配300万预算"',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 500);
      
      return;
    } else if (reportType === 'promotion_budget') {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      
      const lowerText = text.toLowerCase();
      let aiContent = '';
      
      if (lowerText.includes('评估') && lowerText.includes('目标') || lowerText.includes('合理')) {
        aiContent = '基于近两次同类型大促表现、当前预售期资源配置和自然流量趋势，系统预测本次自然水位 GMV 约为 9200 万。若按当前推荐预算 760 万执行，含预算 GMV 中性预测约为 1.18 亿，接近目标但仍有约 200 万缺口。建议将目标定义为"冲刺型目标"，并提前准备 50–80 万的应急加投空间。';
      } else if (lowerText.includes('高roi') || lowerText.includes('倾斜') || lowerText.includes('拆')) {
        aiContent = '已为您重新优化预算分配方案：\n\n• 信息流 -30 万 → 150 万\n• 站内资源位 +20 万 → 180 万\n• 短视频高意向人群 +10 万 → 290 万\n\n调整后预测：\n• 总 GMV 预测小幅上升 1.8%\n• 预测 ROI 从 3.7 提升到 3.9\n• 风险项从 3 个降到 2 个\n\n右侧工作台数据已更新，请查看。';
      } else if (lowerText.includes('加投') || lowerText.includes('超预期')) {
        aiContent = '建议加投，但优先通过预算腾挪完成，而非直接新增预算。当前短视频高意向人群包 ROI 预测为 4.5，高于大盘均值 0.8；与此同时，优惠券补贴预算预计最终剩余 18%。\n\n建议先从优惠券补贴挪出 40 万给短视频高意向人群包，预计新增 GMV 320 万，整体 ROI 基本保持稳定。右侧风险监控面板已更新。';
      } else if (lowerText.includes('总结') || lowerText.includes('汇报') || lowerText.includes('老板')) {
        aiContent = '📋 预算调整核心结论（汇报版）\n\n本次调整在不增加总预算的前提下，将 40 万预算从低利用率模块转移至高转化渠道。\n\n• 双11预售期 GMV 中性预测由 1.18 亿提升至 1.23 亿（+4.6%）\n• 整体 ROI 保持稳定（3.9）\n• 高风险预算项由 3 个下降至 2 个\n\n建议后续持续监控短视频触顶节奏，并保留 30 万应急调整空间。';
      } else {
        aiContent = '我已理解您的需求。基于当前双11预售期的预算配置，我会为您分析并给出建议。请查看右侧工作台获取详细数据。\n\n您可以尝试：\n1. "帮我评估一下GMV目标1.2亿是否合理"\n2. "把预算更多向高ROI渠道倾斜"\n3. "短视频转化超预期，帮我判断要不要加投"\n4. "帮我总结预算调整结论给老板汇报"';
      }
      
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date(),
          showReportAction: true
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 800);
      
      return;
    }
    
    // If first message, switch to chat mode
    if (mode === 'scenario') {
      setMode('chat');
      // Always open report by default when starting a scenario
      setShowReport(true);
      // Auto collapse sidebar when entering chat to focus on content
      setIsSidebarCollapsed(true);
      
      if (scenarioTitle) {
          setCurrentAgentName(scenarioTitle);
          
          // Determine report type based on scenario
          if (scenarioTitle.includes('预算钱效指标归因') || scenarioTitle.includes('预算钱效归因')) {
              setReportType('roi_attribution');
              // 自动填充初始对话
              setTimeout(() => {
                setMessages([
                  {
                    id: 'init-user',
                    role: 'user',
                    content: '帮我分析平台用增业务近 7 天 ROI 为什么跌了',
                    timestamp: new Date()
                  },
                  {
                    id: 'init-ai',
                    role: 'assistant',
                    content: '✅ 已为您完成平台用增近 7 天 ROI 异动归因，核心原因是拉新流失类投放占比提升 + 低渗透地区补贴成本上升，拉低整体 ROI 0.5pct，详细分析见右侧报告。',
                    timestamp: new Date(),
                    showReportAction: true
                  }
                ]);
              }, 100);
          } else if (scenarioTitle.includes('电商行业研究')) {
              setReportType('ecommerce_industry_research');
              // 自动填充初始对话
              setTimeout(() => {
                setMessages([
                  {
                    id: 'init-user',
                    role: 'user',
                    content: '帮我整理近期电商行业研究报告',
                    timestamp: new Date()
                  },
                  {
                    id: 'init-ai',
                    role: 'assistant',
                    content: '✅ 已为您整理完成近期电商行业研究报告，包含行业核心趋势、主要玩家动态以及AI应用情况，详细内容见右侧报告。',
                    timestamp: new Date(),
                    showReportAction: true
                  }
                ]);
              }, 100);
          } else if (scenarioTitle.includes('钱效健康度分析')) {
              setReportType('health_analysis');
              // 自动填充初始对话
              setTimeout(() => {
                setMessages([
                  {
                    id: 'init-user',
                    role: 'user',
                    content: '帮我监控我负责的所有业务的预算健康度，输出风险排名和整改建议',
                    timestamp: new Date()
                  },
                  {
                    id: 'init-ai',
                    role: 'assistant',
                    content: '✅ 已为您生成负责的 6 条业务线近 7 天预算健康度报告，共识别 3 个高风险业务、2 个待优化业务，高风险业务合计拉低整体 ROI 0.42pct，详细监控内容见右侧报告。',
                    timestamp: new Date(),
                    showReportAction: true
                  }
                ]);
              }, 100);
          } else if (scenarioTitle.includes('预算分配优化') || scenarioTitle.includes('业务预算调整建议')) {
              setReportType('budget_adjustment');
          } else {
              setReportType('default');
          }
      }
    }
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Check for the specific trigger question for the new Demo
    if (text.includes('给我详细介绍电商阿里的AI营销工具')) {
      setTimeout(() => {
        setAiContentMode('ai_marketing_tools');
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '好的，我这次会为你详细介绍电商阿里当前在营销领域应用的主要AI工具及其核心功能。',
          timestamp: new Date(),
          isReasoningDemo: true // Custom flag to render the specific reasoning UI block
        }]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      // Call Real AI API
      let answer = '';
      
      // Mock response for specific scenario demo
      if (text === '帮我分析用增1月ROI偏低的原因') {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          answer = "作为资深的电商钱效专家，我将立刻为您启动一项针对用增业务方向ROI低于预期的深度诊断与归因分析。";
      } else if (text === '帮我分析上周费率上升的原因') {
          await new Promise(resolve => setTimeout(resolve, 1500));
          answer = "好的，我已为您生成上周费率波动的归因分析报告。整体来看，费率上升0.5%主要受站外投放成本升高（效率影响）驱动，部分被高转化率渠道占比提升（结构影响）所抵消。详细的归因瀑布图和拆解分析请查看右侧报告。";
      } else if (text === '平台流失方向 ROI偏低是什么原因') {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const thinkingMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '正在查询并分析平台流失方向相关数据...',
              timestamp: new Date(),
              isThinking: true
          };
          setMessages(prev => [...prev, thinkingMsg]);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Remove thinking message and add final answer
          setMessages(prev => prev.filter(m => !m.isThinking));
          
          answer = "经过对平台流失方向的 ROI进一步分析，发现平台流失 ROI偏低的原因主要是因为站外投放和站内投放的成本较高(CAC高达20.88,高于方向均值+30%)";
          
          const newMsg: Message = {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: answer,
              timestamp: new Date(),
              showAddToReportAction: true
          };
          setMessages(prev => [...prev, newMsg]);
          setLoading(false);
          return;
      } else if (text === '再帮我分析ROI低的实验，是什么原因导致的') {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          answer = "好的，我这就基于历史分析结果，为您深入剖析那些ROI偏低的实验，探究其背后可能的具体原因。";
      } else if (text === '请基于历史数据，帮我生成预算分配优化建议' || text === '请基于业务方向的预算和钱效历史数据，结合上述配置规则，帮我生成预算重分配建议') {
          await new Promise(resolve => setTimeout(resolve, 1500));
          answer = "好的，我已为您生成最新的业务预算调整建议报告。本次分析包含整体预算分配流程、核心指标达成预估以及具体的优化建议，请在右侧报告面板中查看详情。";
      } else {
          const res = await api.post('/ai/analyze', { query: text });
          answer = res.answer;
      }
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer || "Sorry, I couldn't process that.",
        timestamp: new Date(),
        // Mock attachments for demo purposes if the answer suggests a report
        // In a real app, the API would return attachments
        attachments: (text.includes('报告') || text.includes('report') || text.includes('归因') || text.includes('ROI') || text.includes('预算调整')) ? [
            { type: 'image', name: 'Analysis Chart.png', icon: <FileText className="w-4 h-4" /> },
            { type: 'image', name: 'Data Trends.png', icon: <BarChart2 className="w-4 h-4" /> }
        ] : undefined,
        showReportAction: text.includes('报告') || text.includes('report') || text.includes('归因') || text.includes('ROI') || text.includes('预算调整')
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Auto open report if needed
      if (text.includes('报告') || text.includes('report') || text.includes('归因') || text.includes('ROI') || text.includes('费率') || text.includes('预算调整') || text.includes('预算分配优化') || text === '请基于业务方向的预算和钱效历史数据，结合上述配置规则，帮我生成预算重分配建议') {
          setShowReport(true);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "抱歉，连接 AI 服务时出现错误。请检查网络或稍后再试。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {showKnowledgeBase ? (
        <KnowledgeBase onBackToChat={() => setShowKnowledgeBase(false)} />
      ) : (
        <>
          {/* Chat Sidebar */}
          <Sidebar 
            onNewChat={handleNewChat} 
            isCollapsed={isSidebarCollapsed} 
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            role={role}
            onRoleChange={setRole}
            onKnowledgeBaseClick={() => setShowKnowledgeBase(true)}
            onHistoryItemClick={(agentName) => {
                // Only handle "预算钱效归因Agent" for this demo
                if (agentName === '预算钱效归因Agent') {
                    setMode('chat');
                    setCurrentAgentName(agentName);
                    setReportType('budget_attribution');
                    setShowReport(true);
                    setIsSidebarCollapsed(true);
                    // Pre-fill messages to simulate existing chat history
                    setMessages([
                        {
                            id: 'hist-1',
                            role: 'user',
                            content: '帮我分析用增1月ROI偏低的原因',
                            timestamp: new Date(Date.now() - 60000)
                        },
                        {
                            id: 'hist-2',
                            role: 'assistant',
                            content: '作为资深的电商钱效专家，我将立刻为您启动一项针对用增业务方向ROI低于预期的深度诊断与归因分析。',
                            timestamp: new Date(Date.now() - 58000),
                            attachments: [
                                { type: 'image', name: 'Analysis Chart.png', icon: <FileText className="w-4 h-4" /> },
                                { type: 'image', name: 'Data Trends.png', icon: <BarChart2 className="w-4 h-4" /> }
                            ],
                            showReportAction: true
                        },
                        {
                            id: 'hist-3',
                            role: 'user',
                            content: '再帮我分析ROI低的实验，是什么原因导致的',
                            timestamp: new Date(Date.now() - 30000)
                        },
                        {
                            id: 'hist-4',
                            role: 'assistant',
                            content: '好的，我这就基于历史分析结果，为您深入剖析那些ROI偏低的实验，探究其背后可能的具体原因。',
                            timestamp: new Date(Date.now() - 28000)
                        }
                    ]);
                }
            }}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {mode === 'scenario' ? (
              <ScenarioSelector 
                role={role}
                onSelectScenario={(query, title) => handleSendMessage(query, title)} 
                onSendMessage={(msg) => handleSendMessage(msg)} 
              />
            ) : (
              <div className="flex w-full h-full">
                {/* Chat Area - Flexible width */}
                <div 
                    className={`flex flex-col h-full transition-all duration-300 ease-in-out ${showReport ? 'border-r border-gray-200' : 'w-full'}`}
                    style={showReport ? { width: chatWidth, flex: 'none' } : { width: '100%' }}
                >
                   <ChatArea 
                     agentName={currentAgentName}
                     messages={messages} 
                     onSendMessage={(msg) => handleSendMessage(msg)} 
                     onNewChat={handleNewChat}
                     onShowReport={() => setShowReport(true)}
                     onAddToReport={() => setShowNewConclusion(true)}
                     totalBudget={totalBudget}
                     onTotalBudgetChange={setTotalBudget}
                     promotionType={promotionType}
                     onPromotionTypeChange={handlePromotionTypeChange}
                     industryContext={industryContext}
                     role={role}
                     onTabChange={(tab) => {
                       if (tab === '平台活动' || tab === '大促') {
                         setCurrentAgentName('大促AI预算助手');
                         setReportType('promotion_budget');
                         setShowReport(true);
                         setMessages([{
                           id: 'init-promotion',
                           role: 'assistant',
                           content: '欢迎使用大促AI预算助手。我已为您加载双11预售期预算规划工作台，请在左侧配置活动信息和预算约束，或直接与我对话进行预算规划。',
                           timestamp: new Date(),
                           showReportAction: true
                         }]);
                       } else if (tab === '平台用增') {
                         setCurrentAgentName('预算钱效洞察');
                         setReportType('budget_attribution');
                         setMessages([{
                           id: 'init-leader',
                           role: 'assistant',
                           content: '您好，我是预算钱效洞察。右侧是为您生成的最新预算归因分析报告。',
                           timestamp: new Date(),
                           showReportAction: true
                         }]);
                       } else if (tab === '商城频道') {
                         // 处理商城频道点击
                         if (role === 'leader' && industryContext) {
                           // 行业Leader身份，显示专属页面
                           setCurrentAgentName('大促AI预算助手');
                           setReportType('promotion_budget');
                           setShowReport(true);
                           setMessages([{
                             id: 'init-mall-channel',
                             role: 'assistant',
                             content: `欢迎使用${industryContext.industry}行业商城频道预算助手。已为您加载目标测算功能。`,
                             timestamp: new Date(),
                             showReportAction: true
                           }]);
                         } else {
                           // 非行业角色，跳转到通用页面
                           setCurrentAgentName('预算钱效洞察');
                           setReportType('budget_attribution');
                           setMessages([{
                             id: 'init-mall-fallback',
                             role: 'assistant',
                             content: '商城频道功能仅对行业负责人开放，请切换身份后使用。',
                             timestamp: new Date()
                           }]);
                         }
                       }
                     }}
                   />
                   {/* Simple Loading Indicator Overlay if needed, or integrate into ChatArea */}
                   {loading && (
                     <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 flex items-center gap-2 z-10">
                       <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></div>
                       <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                       <span className="text-xs text-gray-500 ml-1">AI 思考中...</span>
                     </div>
                   )}
                </div>
                
                {/* Resizer Handle */}
                {showReport && (
                    <div
                        className="w-1 h-full cursor-col-resize hover:bg-purple-500 transition-colors bg-transparent z-20 flex flex-col justify-center items-center group relative -ml-0.5"
                        onMouseDown={startResizing}
                    >
                        <div className="h-8 w-1 bg-gray-300 rounded-full group-hover:bg-purple-500"></div>
                    </div>
                )}
                
                {/* Report Area - Visible only when showReport is true */}
                {showReport && (
                  <div className="flex-1 h-full bg-white transition-all duration-300 ease-in-out animate-in slide-in-from-right-10 fade-in">
                    <ReportArea 
                        onClose={() => setShowReport(false)} 
                        reportType={reportType} 
                        reportSidebarWidth={reportWidth || 380}
                        onResizeStart={startReportResizing}
                        showNewConclusion={showNewConclusion}
                        budgetCommand={budgetCommand}
                        totalBudget={totalBudget}
                        onTotalBudgetChange={setTotalBudget}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

