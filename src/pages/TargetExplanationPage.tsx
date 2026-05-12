import React from 'react';
import { ArrowLeft, Target, TrendingUp, Brain, BarChart2, Calendar, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TargetExplanationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => window.close()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">目标测算结果解释</h1>
              <p className="text-xs text-gray-500">双11 预售期 · AI 智能测算逻辑详解</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-gray-900">一、目标结果对比</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">AI 测算 GMV</div>
                <div className="text-2xl font-bold text-blue-900">1.18 亿</div>
                <div className="text-xs text-blue-500 mt-1">中性预测 · 含预算投入</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-600 mb-1">管理层目标 GMV</div>
                <div className="text-2xl font-bold text-green-900">1.20 亿</div>
                <div className="text-xs text-green-500 mt-1">OKR 设定目标</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="text-xs text-orange-600 mb-1">差额</div>
                <div className="text-2xl font-bold text-orange-900">-200 万</div>
                <div className="text-xs text-orange-500 mt-1">达成概率 78%</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-3">同比 / 环比参照系</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 font-medium">
                    <tr>
                      <th className="text-left py-2 px-3">对比维度</th>
                      <th className="text-right py-2 px-3">数值</th>
                      <th className="text-right py-2 px-3">增速</th>
                      <th className="text-left py-2 px-3">说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">去年双11</td>
                      <td className="py-2 px-3 text-right text-gray-700">1.02 亿</td>
                      <td className="py-2 px-3 text-right text-green-600">+15.7%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">AI 智能选取，相同活动周期</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">今年618大促</td>
                      <td className="py-2 px-3 text-right text-gray-700">0.88 亿</td>
                      <td className="py-2 px-3 text-right text-green-600">+34.1%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">相邻可比大促，爆发系数约 1.34</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">近30天日均</td>
                      <td className="py-2 px-3 text-right text-gray-700">320 万/天</td>
                      <td className="py-2 px-3 text-right text-green-600">+12.3%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">自然水位基线参考</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">OKR 目标</td>
                      <td className="py-2 px-3 text-right text-gray-700">1.20 亿</td>
                      <td className="py-2 px-3 text-right text-orange-600">缺口 200万</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">属于"冲刺型目标"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-base text-gray-900">二、测算过程关键逻辑</h2>
          </div>
          <div className="space-y-5">
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                自然水位还原逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>基于近 90 天非大促期间的 GMV 数据，剔除异常波动日（如平台故障、临时促销），拟合自然增长趋势线。</p>
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                  <div>• 自然水位 = 日均 GMV 基线 × 季节性系数 × 趋势增长因子</div>
                  <div>• 当前日均基线：320 万/天，季节性系数 1.12（Q4 旺季上调），趋势因子 1.05</div>
                  <div>• 预售期自然水位合计：9,200 万</div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                选取可比日期的逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>AI 根据以下优先级自动匹配可比周期，确保测算基准合理：</p>
                <div className="bg-purple-50 rounded-lg p-3 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded font-bold shrink-0">优先级1</span>
                    <div className="text-purple-800">
                      <span className="font-medium">智能推荐：</span>去年同期双11（2024.10.20-11.11），活动类型一致，周期长度一致，已校正星期效应
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded font-bold shrink-0">优先级2</span>
                    <div className="text-purple-800">
                      <span className="font-medium">手动指定：</span>支持用户指定任意历史活动周期作为参照，系统自动对齐 Big Day 并校正天数差异
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded font-bold shrink-0">优先级3</span>
                    <div className="text-purple-800">
                      <span className="font-medium">兜底方案：</span>无可比大促时，使用近 30 天均值 × 爆发系数（基于历史大促 / 日常倍率推算）
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-green-500" />
                分日拆解逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>将整体目标按日拆解，核心考虑：</p>
                <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800 space-y-1">
                  <div>• <strong>历史分日占比：</strong>参考去年双11各日 GMV 占整体比例分布</div>
                  <div>• <strong>Big Day 爆发系数：</strong>11.11 当天约占整体 18-22%，前一天约 12-15%</div>
                  <div>• <strong>预热-爬坡-爆发节奏：</strong>前7天平缓（日均 2.5%），中间5天爬坡（日均 4%），最后2天爆发（合计 35%）</div>
                  <div>• <strong>星期效应修正：</strong>周末日 GMV 通常比工作日高 15-20%，已做校正</div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                场景/行业分日与大盘趋势性
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>不同行业的大促节奏存在差异，AI 分别建模：</p>
                <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
                  <div>• <strong>3C数码/家电：</strong>强 Big Day 依赖（爆发日占比高达 30%），预售锁单比例高</div>
                  <div>• <strong>服饰美妆：</strong>预热期即开始上量，分布更均匀，受直播带动明显</div>
                  <div>• <strong>食品快消：</strong>补货型消费，波动较小，日均占比较稳定</div>
                  <div>• <strong>行业 × 日期交叉分解：</strong>确保各行业分日加总 = 大盘分日预测值</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-gray-900">三、业务性解释</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="text-sm text-green-800 space-y-2">
                  <p className="font-medium">预测较去年同期增长 15.7% 的主要原因：</p>
                  <div className="space-y-1 text-xs">
                    <div>1. <strong>短视频渠道 ROI 持续提升：</strong>短视频转化率从去年 2.4% 提升至 3.2%（+33%），预计贡献增量 GMV 约 1,200 万</div>
                    <div>2. <strong>用户运营体系成熟化：</strong>高价值用户（L4-L5）占比从 18% 提升至 23%，复购率同比提升 8.5 个百分点</div>
                    <div>3. <strong>新增消费券玩法：</strong>跨品类满减券预计带动额外 800 万 GMV，核销率预估 58%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 space-y-2">
                  <p className="font-medium">目标达成的潜在风险因素：</p>
                  <div className="space-y-1 text-xs">
                    <div>1. <strong>信息流 ROI 承压：</strong>近期信息流 ROI 从 3.1 降至 2.8，若持续走低将影响约 500 万 GMV</div>
                    <div>2. <strong>竞品大促节奏冲突：</strong>竞品 A 提前 3 天启动预售，可能分流 10-15% 的潜在用户</div>
                    <div>3. <strong>行业目标压力后置：</strong>服饰行业预测增速仅 8.5%，低于大盘平均，需关注库存和选品策略</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 space-y-2">
                  <p className="font-medium">分日节奏关键洞察：</p>
                  <div className="space-y-1 text-xs">
                    <div>1. <strong>10/29-11/01 爬坡期投入集中：</strong>该时段预算占比 25%，对应 GMV 占比 18%，属于"蓄势"阶段</div>
                    <div>2. <strong>11/09-11/11 爆发期：</strong>3 天贡献整体 35% GMV，需确保各渠道承接能力（特别是服务器扩容和客服排班）</div>
                    <div>3. <strong>尾部长尾效应：</strong>大促后 3 天仍有约 5% 的订单来自大促期间种草但未下单的用户</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium text-gray-800">行业目标压力分析：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-gray-500 font-medium">
                      <tr>
                        <th className="text-left py-2 px-3">行业</th>
                        <th className="text-right py-2 px-3">预测增速</th>
                        <th className="text-right py-2 px-3">目标增速</th>
                        <th className="text-center py-2 px-3">压力等级</th>
                        <th className="text-left py-2 px-3">关键风险</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">3C数码</td>
                        <td className="py-2 px-3 text-right text-green-600">+15.2%</td>
                        <td className="py-2 px-3 text-right text-gray-700">+14%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">低</span></td>
                        <td className="py-2 px-3 text-gray-500">新品首发节奏需对齐</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">家电</td>
                        <td className="py-2 px-3 text-right text-green-600">+11.8%</td>
                        <td className="py-2 px-3 text-right text-gray-700">+12%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">中</span></td>
                        <td className="py-2 px-3 text-gray-500">以旧换新政策红利减弱</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">服饰</td>
                        <td className="py-2 px-3 text-right text-green-600">+8.5%</td>
                        <td className="py-2 px-3 text-right text-gray-700">+15%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">高</span></td>
                        <td className="py-2 px-3 text-gray-500">退货率偏高，净 GMV 承压</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">食品快消</td>
                        <td className="py-2 px-3 text-right text-green-600">+13.4%</td>
                        <td className="py-2 px-3 text-right text-gray-700">+10%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">低</span></td>
                        <td className="py-2 px-3 text-gray-500">消费券拉动明显</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">美妆个护</td>
                        <td className="py-2 px-3 text-right text-green-600">+10.2%</td>
                        <td className="py-2 px-3 text-right text-gray-700">+12%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">中</span></td>
                        <td className="py-2 px-3 text-gray-500">竞品平台大促分流</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
