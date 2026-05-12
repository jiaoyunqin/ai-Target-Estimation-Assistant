import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, MoreHorizontal, FileText, ChevronRight, BarChart2, TrendingUp, Search, ExternalLink, Target, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeishuBotDemo: React.FC = () => {
    const [viewMode, setViewMode] = useState<'manager' | 'leader'>('manager');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            {/* Demo Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> 返回主应用
                    </Link>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <h1 className="font-bold text-gray-800">飞书 Bot 推送 Demo展示</h1>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('manager')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'manager' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        电商管理者视角
                    </button>
                    <button 
                        onClick={() => setViewMode('leader')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'leader' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        业务 Leader 视角
                    </button>
                </div>
            </div>

            {/* Feishu Client Mockup */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
                <div className="w-full max-w-[1000px] h-[800px] max-h-full bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-200 flex-shrink-0">
                    
                    {/* Left Sidebar - Contact List Mock */}
                    <div className="w-64 bg-[#f5f6f7] border-r border-gray-200 flex flex-col">
                        <div className="h-16 border-b border-gray-200 flex items-center px-4 shrink-0 bg-[#f5f6f7]">
                            <div className="w-full bg-white rounded-md h-8 flex items-center px-3 text-gray-400 text-sm border border-gray-200 shadow-sm">
                                <Search className="w-4 h-4 mr-2" /> 搜索
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-2">
                                <div className="flex items-center gap-3 p-2 bg-[#e3e5e8] rounded-lg cursor-pointer">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner shrink-0 relative">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#e3e5e8]"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="font-medium text-gray-900 text-sm truncate">预算钱效AI助手</span>
                                            <span className="text-[10px] text-gray-400 shrink-0">10:00</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">📊 经营钱效简报已生成...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors mt-1">
                                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 text-white font-bold">
                                        通
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-gray-900 text-sm truncate">项目沟通群</span>
                                            <span className="text-[10px] text-gray-400 shrink-0">昨天</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">张三：好的，收到</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-[#f5f6f7]">
                        {/* Chat Header */}
                        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-gray-900 text-lg">预算钱效AI助手</h2>
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium border border-blue-200">机器人</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <Search className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
                                <MoreHorizontal className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            <div className="flex justify-center">
                                <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">今天 10:00</span>
                            </div>

                            {/* Feishu Card - Manager View */}
                            {viewMode === 'manager' && (
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-[500px] overflow-hidden">
                                        {/* Card Header */}
                                        <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
                                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                                <BarChart2 className="w-4 h-4" />
                                                电商大盘预算钱效简报
                                            </h3>
                                            <span className="text-blue-100 text-xs">最近自然周 (03.16-03.22)</span>
                                        </div>
                                        {/* Card Body */}
                                        <div className="p-4 space-y-4">
                                            <p className="text-sm text-gray-600">您好，最新一周的电商大盘预算钱效数据已更新，请查阅核心摘要：</p>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-gray-50 rounded p-2 text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 mb-1">整体费率</div>
                                                    <div className="font-bold text-gray-900 text-lg">4.2%</div>
                                                    <div className="text-[10px] text-red-500 flex items-center justify-center">↑ 0.5%</div>
                                                </div>
                                                <div className="bg-gray-50 rounded p-2 text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 mb-1">发货GMV</div>
                                                    <div className="font-bold text-gray-900 text-lg">¥8.5亿</div>
                                                    <div className="text-[10px] text-green-500 flex items-center justify-center">↑ 8.5%</div>
                                                </div>
                                                <div className="bg-gray-50 rounded p-2 text-center border border-gray-100">
                                                    <div className="text-xs text-gray-500 mb-1">预算消耗</div>
                                                    <div className="font-bold text-gray-900 text-lg">¥4.5k万</div>
                                                    <div className="text-[10px] text-red-500 flex items-center justify-center">↑ 12%</div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800 mb-1 border-l-2 border-red-500 pl-2">费率波动归因 (核心拖累项)</div>
                                                    <ul className="text-xs text-gray-600 space-y-1 pl-3 list-disc">
                                                        <li><span className="text-gray-900 font-medium">头部主播流量集中度提升</span>，拉高了整体销售费用率。</li>
                                                        <li><span className="text-gray-900 font-medium">大促前夕竞价成本上升</span>，核心类目CPM环比上涨15%。</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800 mb-1 border-l-2 border-blue-500 pl-2">各业务健康度预警</div>
                                                    <div className="text-xs text-gray-600 bg-red-50 p-2 rounded text-red-700">
                                                        <span className="font-bold">风险预警：</span>建议重点关注 千川、治理体验及履约配送 业务线，其 ROI 均低于 1.8 且处于高风险区间。
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Card Footer (Actions) */}
                                        <div className="border-t border-gray-100 flex divide-x divide-gray-100 bg-gray-50/50">
                                            <button className="flex-1 py-2.5 text-blue-600 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                                                查看完整报告 <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feishu Card - Leader View */}
                            {viewMode === 'leader' && (
                                <>
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-[500px] overflow-hidden">
                                            {/* Card Header */}
                                            <div className="bg-purple-600 px-4 py-3 flex justify-between items-center">
                                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                                    <Target className="w-4 h-4" />
                                                    平台用增 - 钱效归因简报
                                                </h3>
                                                <span className="text-purple-100 text-xs">最近自然周 (03.16-03.22)</span>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 space-y-4">
                                                <p className="text-sm text-gray-600">您好，您的业务方向归因数据已生成，以下是核心诊断摘要：</p>
                                                
                                                <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 mb-0.5">整体 ROI</div>
                                                        <div className="font-bold text-gray-900 text-xl text-purple-600">2.29</div>
                                                    </div>
                                                    <div className="w-px bg-gray-200"></div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 mb-0.5">预算消耗</div>
                                                        <div className="font-bold text-gray-900 text-lg">¥1.2亿</div>
                                                    </div>
                                                    <div className="w-px bg-gray-200"></div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 mb-0.5">增量 GMV</div>
                                                        <div className="font-bold text-gray-900 text-lg">¥2.7亿</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                                                        <div className="text-xs font-bold text-yellow-800 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> 核心归因结论</div>
                                                        <p className="text-xs text-gray-700 leading-relaxed">
                                                            最新更正后，“<span className="font-bold text-red-600">平台流失</span>”方向的大盘 ROI 调整为 1.16，在预算占比约 38.9% 的情况下，按负向贡献度测算仍是当前<span className="font-bold">最大的预算漏水点</span>。
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-800 mb-1 border-l-2 border-green-500 pl-2">增效机会</div>
                                                        <p className="text-xs text-gray-600 pl-2.5">
                                                            <span className="font-bold text-green-600">低消女性、MAC质量、中高消女性</span>等方向保持高 ROI、高健康度，建议优先保障并适度加注预算。
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Card Footer (Actions) */}
                                            <div className="border-t border-gray-100 flex divide-x divide-gray-100 bg-gray-50/50">
                                                <button className="flex-1 py-2.5 text-blue-600 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                                                    进入应用查看详情 <ExternalLink className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Follow up */}
                                    <div className="flex gap-3 flex-row-reverse mt-6">
                                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white font-bold">
                                            我
                                        </div>
                                        <div className="bg-blue-500 text-white rounded-xl rounded-tr-sm px-4 py-2.5 shadow-sm max-w-[70%] text-sm">
                                            平台流失方向 ROI偏低是什么原因？
                                        </div>
                                    </div>

                                    {/* Bot Response */}
                                    <div className="flex gap-3 mt-6">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                                            <p className="text-sm text-gray-800 leading-relaxed">
                                                经过对平台流失方向的 ROI 进一步分析，发现平台流失 ROI 偏低的原因主要是因为<strong className="text-red-600">站外投放和站内投放的成本较高</strong>（CAC高达20.88，高于方向均值+30%）。
                                            </p>
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-medium hover:bg-blue-100 transition-colors border border-blue-100">
                                                    将此分析添加至报告
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                        </div>

                        {/* Input Area */}
                        <div className="h-32 border-t border-gray-200 bg-white p-4 shrink-0 flex flex-col">
                            <div className="flex items-center gap-3 text-gray-400 mb-2 px-2">
                                <span className="text-xs">支持快捷回复或直接输入问题追问...</span>
                            </div>
                            <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 flex items-center px-4">
                                <span className="text-gray-400 text-sm">发送消息给 预算钱效AI助手...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};