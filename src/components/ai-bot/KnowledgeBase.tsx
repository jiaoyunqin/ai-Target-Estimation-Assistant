import React, { useState } from 'react';
import { BookOpen, Link, FileText, Database, CheckCircle, AlertCircle, RefreshCw, Plus, Search, Settings, ChevronDown, ChevronRight, ExternalLink, X, ArrowLeft } from 'lucide-react';

interface KnowledgeBaseProps {
  onBackToChat?: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBackToChat }) => {
  const [activeTab, setActiveTab] = useState<'unstructured' | 'structured'>('unstructured');
  const [structuredSubTab, setStructuredSubTab] = useState<'attribution' | 'threshold' | 'cases' | 'allocation'>('attribution');
  const [showBindModal, setShowBindModal] = useState(false);
  const [scenarioFilter, setScenarioFilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchScenario, setSearchScenario] = useState<string | null>(null);

  // Mock data for unstructured knowledge
  const unstructuredDocs = [
    {
      id: 1,
      name: '大盘自然水位预测还原逻辑',
      category: '资管规则',
      business: '全业务',
      permission: '全员可见',
      status: 'success',
      lastSync: '2026-03-31 09:00',
      maintainer: '张明',
      scenarioTags: ['目标测算']
    },
    {
      id: 2,
      name: '全周期领航预算消耗及流速预测规范',
      category: '资管规则',
      business: '全业务',
      permission: '仅对应业务可见',
      status: 'syncing',
      lastSync: '2026-03-31 08:30',
      maintainer: '李强',
      scenarioTags: ['预算规划']
    },
    {
      id: 3,
      name: '历年618与双11大促转化率复盘',
      category: '复盘文档',
      business: '全业务',
      permission: '全员可见',
      status: 'error',
      error: '飞书权限不足',
      lastSync: '2026-03-30 18:00',
      maintainer: '王芳',
      scenarioTags: ['全局', '目标测算']
    }
  ];
  
  // Filtered docs based on scenario
  const filteredDocs = scenarioFilter 
    ? unstructuredDocs.filter(doc => doc.scenarioTags.includes(scenarioFilter))
    : unstructuredDocs;

  // Mock data for structured knowledge
  const attributionRules = [
    { id: 1, name: 'ROI异常归因规则', business: '平台用增', priority: 1, lastUpdate: '2026-03-30', feishuLink: 'https://feishu.cn/sheet/xxx' },
    { id: 2, name: '费率波动归因规则', business: '全业务', priority: 2, lastUpdate: '2026-03-28', feishuLink: 'https://feishu.cn/sheet/yyy' }
  ];

  const thresholdRules = [
    { id: 1, name: 'ROI预警线配置', metric: 'ROI', warning: 1.8, target: 2.3, stopLoss: 1.0, lastUpdate: '2026-03-30' },
    { id: 2, name: 'CAC预警线配置', metric: 'CAC', warning: 15, target: 10, stopLoss: 25, lastUpdate: '2026-03-28' }
  ];

  const historyCases = [
    { id: 1, name: '平台流失ROI异常案例', business: '平台用增', metric: 'ROI', date: '2026-03-15', tags: ['ROI低', '平台流失'] },
    { id: 2, name: '大促前费率上升案例', business: '全业务', metric: '费率', date: '2026-03-10', tags: ['费率', '大促'] }
  ];

  const allocationRules = [
    { id: 1, name: '预算优先分配规则', priority: 1, constraint: 'ROI>2.5优先', lastUpdate: '2026-03-30' },
    { id: 2, name: '预算约束规则', priority: 2, constraint: '单业务不超过总预算50%', lastUpdate: '2026-03-28' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {onBackToChat && (
              <button 
                onClick={onBackToChat}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">我的知识库</h1>
              <p className="text-sm text-gray-500">飞书原生联动，零上传知识库管理</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBindModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              绑定飞书文档
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              结构化规则配置
            </button>
          </div>
        </div>

        {/* Top Overview Cards */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 shrink-0">
          <div className="grid grid-cols-4 gap-4">
            {/* Card 1: Bound Feishu Docs */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-500">已绑定飞书文档数</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-xs text-blue-600 mt-1">点击跳转非结构化知识库</div>
            </div>

            {/* Card 2: Structured Knowledge */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-500">结构化知识条目数</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">48</div>
              <div className="text-xs text-green-600 mt-1">点击跳转结构化知识库</div>
            </div>

            {/* Card 3: Knowledge Coverage */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-500">知识覆盖率</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">78%</div>
              <div className="text-xs text-gray-500 mt-1">AI回答能命中知识库的比例</div>
            </div>

            {/* Card 4: Sync Success Rate */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-gray-500">同步成功率</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-xs text-gray-500 mt-1">近24小时飞书文档同步成功率</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-white p-1 rounded-lg border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab('unstructured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'unstructured' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              非结构化知识库
            </button>
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'structured' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              结构化知识库
            </button>
          </div>

          {/* Unstructured Knowledge Base */}
      {activeTab === 'unstructured' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">文档名称</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">知识分类</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">所属业务范围</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">权限范围</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>应用场景</span>
                      <select 
                        value={scenarioFilter || ''}
                        onChange={(e) => setScenarioFilter(e.target.value || null)}
                        className="text-xs bg-white border border-gray-300 rounded px-1 py-0.5"
                      >
                        <option value="">全部</option>
                        <option value="目标测算">目标测算</option>
                        <option value="预算规划">预算规划</option>
                        <option value="全局">全局</option>
                        <option value="日常分析">日常分析</option>
                      </select>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">同步状态</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">最近同步时间</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">维护人</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        {doc.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.category}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.business}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.permission}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {doc.scenarioTags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {doc.status === 'success' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-700">同步成功</span>
                          </>
                        )}
                        {doc.status === 'syncing' && (
                          <>
                            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                            <span className="text-blue-700">同步中</span>
                          </>
                        )}
                        {doc.status === 'error' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-700">同步失败</span>
                            {doc.error && (
                              <span className="text-xs text-red-500">({doc.error})</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.lastSync}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.maintainer}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                          手动同步
                        </button>
                        <button className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors">
                          编辑配置
                        </button>
                        <button className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                          取消绑定
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

          {/* Structured Knowledge Base */}
          {activeTab === 'structured' && (
            <div className="space-y-6">
              {/* Sub Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 w-fit">
                <button
                  onClick={() => setStructuredSubTab('attribution')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    structuredSubTab === 'attribution' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  归因规则库
                </button>
                <button
                  onClick={() => setStructuredSubTab('threshold')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    structuredSubTab === 'threshold' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  阈值规则库
                </button>
                <button
                  onClick={() => setStructuredSubTab('cases')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    structuredSubTab === 'cases' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  历史案例库
                </button>
                <button
                  onClick={() => setStructuredSubTab('allocation')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    structuredSubTab === 'allocation' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  预算分配规则库
                </button>
              </div>

              {/* Attribution Rules */}
              {structuredSubTab === 'attribution' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">规则名称</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">适用业务</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">优先级</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">最近更新时间</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">关联飞书表格</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {attributionRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{rule.name}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.business}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.priority}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.lastUpdate}</td>
                            <td className="px-4 py-3">
                              <a href={rule.feishuLink} className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
                                查看表格
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Threshold Rules */}
              {structuredSubTab === 'threshold' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">规则名称</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">指标</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">预警线</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">达标线</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">止损线</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">最近更新时间</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {thresholdRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{rule.name}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.metric}</td>
                            <td className="px-4 py-3 text-yellow-600">{rule.warning}</td>
                            <td className="px-4 py-3 text-green-600">{rule.target}</td>
                            <td className="px-4 py-3 text-red-600">{rule.stopLoss}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.lastUpdate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* History Cases */}
              {structuredSubTab === 'cases' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">案例名称</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">所属业务</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">关联指标</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">日期</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">标签</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {historyCases.map((caseItem) => (
                          <tr key={caseItem.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{caseItem.name}</td>
                            <td className="px-4 py-3 text-gray-600">{caseItem.business}</td>
                            <td className="px-4 py-3 text-gray-600">{caseItem.metric}</td>
                            <td className="px-4 py-3 text-gray-600">{caseItem.date}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {caseItem.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Allocation Rules */}
              {structuredSubTab === 'allocation' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">规则名称</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">优先级</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">约束条件</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">最近更新时间</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allocationRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{rule.name}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.priority}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.constraint}</td>
                            <td className="px-4 py-3 text-gray-600">{rule.lastUpdate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auxiliary Functions Section */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            {/* Knowledge Retrieval Test */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                知识检索
              </h3>
              <div className="space-y-4">
                {/* 场景标签过滤 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">选择应用场景（可选）</label>
                  <select
                    value={searchScenario || ''}
                    onChange={(e) => setSearchScenario(e.target.value || null)}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部场景</option>
                    <option value="目标测算">目标测算</option>
                    <option value="预算规划">预算规划</option>
                    <option value="全局">全局</option>
                    <option value="日常分析">日常分析</option>
                  </select>
                </div>
                {/* 搜索输入框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="输入关键词测试知识检索..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  开始检索测试
                </button>
                <p className="text-xs text-gray-500">
                  支持标签过滤 + 语义检索的双重检索能力，测试当前知识库返回的结果是否正确，支持标注「正确/错误/需补充」
                </p>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                同步设置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">全局同步频率</label>
                  <select className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm">
                    <option>每小时</option>
                    <option>每日</option>
                    <option>每周</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">同步失败告警次数</label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  失败N次自动给维护人发飞书消息提醒
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bind Feishu Document Modal */}
      {showBindModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">绑定飞书文档</h3>
              <button 
                onClick={() => setShowBindModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  飞书文档/文件夹链接
                </label>
                <input
                  type="text"
                  placeholder="粘贴飞书文档链接或选择飞书空间目录"
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  知识分类
                </label>
                <select className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm">
                  <option>复盘文档</option>
                  <option>资管规则</option>
                  <option>行业报告</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  所属业务
                </label>
                <select className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm">
                  <option>平台用增</option>
                  <option>独立端</option>
                  <option>全业务</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  权限范围
                </label>
                <select className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm">
                  <option>全员可见</option>
                  <option>仅对应业务可见</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  同步频率
                </label>
                <select className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm">
                  <option>每小时</option>
                  <option>每日</option>
                  <option>每周</option>
                  <option>手动触发</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={() => setShowBindModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => setShowBindModal(false)}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                确定绑定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
