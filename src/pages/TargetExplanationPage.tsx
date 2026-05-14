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
              <p className="text-xs text-gray-500">618大促 · 3C数码赛道 · AI 智能测算逻辑详解</p>
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
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-600 mb-1">AI 测算 GMV</div>
                <div className="text-2xl font-bold text-green-900">4,948 万</div>
                <div className="text-xs text-green-500 mt-1">中性预测 · 3C数码赛道</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">管理层目标 GMV</div>
                <div className="text-2xl font-bold text-blue-900">4,760 万</div>
                <div className="text-xs text-blue-500 mt-1">OKR 设定目标</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-600 mb-1">差额</div>
                <div className="text-2xl font-bold text-green-900">+188 万</div>
                <div className="text-xs text-green-500 mt-1">达成概率 85%</div>
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
                      <td className="py-2 px-3 text-gray-800 font-medium">去年618</td>
                      <td className="py-2 px-3 text-right text-gray-700">4,280 万</td>
                      <td className="py-2 px-3 text-right text-green-600">+15.6%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">AI 智能选取，相同活动周期</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">今年双11</td>
                      <td className="py-2 px-3 text-right text-gray-700">5,120 万</td>
                      <td className="py-2 px-3 text-right text-gray-500">-3.4%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">相邻可比大促，618 略低于双11</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">近30天日均</td>
                      <td className="py-2 px-3 text-right text-gray-700">620 万/天</td>
                      <td className="py-2 px-3 text-right text-green-600">+32.9%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">自然水位基线参考</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">OKR 目标</td>
                      <td className="py-2 px-3 text-right text-gray-700">4,760 万</td>
                      <td className="py-2 px-3 text-right text-green-600">超额 188万</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">属于"稳健型目标"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-3">分阶段目标达成情况</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 font-medium">
                    <tr>
                      <th className="text-left py-2 px-3">阶段</th>
                      <th className="text-right py-2 px-3">日期范围</th>
                      <th className="text-right py-2 px-3">目标</th>
                      <th className="text-right py-2 px-3">预测</th>
                      <th className="text-right py-2 px-3">达成率</th>
                      <th className="text-left py-2 px-3">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          预热期
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700">06/15-06/17</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,750 万</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,808 万</td>
                      <td className="py-2 px-3 text-right text-green-600">103.3%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">超额完成</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          爆发期
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700">06/18</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,720 万</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,863 万</td>
                      <td className="py-2 px-3 text-right text-green-600">108.3%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">超额完成</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          返场期
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700">06/19-06/20</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,290 万</td>
                      <td className="py-2 px-3 text-right text-gray-700">1,277 万</td>
                      <td className="py-2 px-3 text-right text-orange-600">99.0%</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">接近目标</span>
                      </td>
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
                <p>基于近 90 天非大促期间的 3C数码 GMV 数据，剔除异常波动日，拟合自然增长趋势线。</p>
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                  <div>• 自然水位 = 日均 GMV 基线 × 季节性系数 × 趋势增长因子</div>
                  <div>• 当前日均基线：620 万/天，季节性系数 1.08（618期间上调），趋势因子 1.06</div>
                  <div>• 预热期自然水位合计：1,680 万（实际预测 1,808 万，活动拉动 +7.6%）</div>
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
                      <span className="font-medium">智能推荐：</span>去年同期618（2025.06.15-06.20），活动类型一致，周期长度一致，已校正星期效应
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
                  <div>• <strong>历史分日占比：</strong>参考去年618各日 GMV 占整体比例分布</div>
                  <div>• <strong>Big Day 爆发系数：</strong>06/18 当天约占整体 37.6%，为最高单日</div>
                  <div>• <strong>预热-爬坡-爆发节奏：</strong>前3天预热（日均 12.2%），06/18 爆发（37.6%），最后2天返场（日均 12.9%）</div>
                  <div>• <strong>星期效应修正：</strong>周末日 GMV 通常比工作日高 15-20%，已做校正</div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                行业分日与大盘趋势性
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>3C数码行业的大促节奏特点：</p>
                <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
                  <div>• <strong>3C数码：</strong>强 Big Day 依赖（爆发日占比高达 37.6%），预售锁单比例高（约 65%）</div>
                  <div>• <strong>手机赛道：</strong>06/18 当天占比最高（40.2%），新品首发集中在预热期</div>
                  <div>• <strong>电脑整机：</strong>预热期和爆发期分布较均衡，受学生购机需求影响</div>
                  <div>• <strong>数码配件：</strong>随大盘波动，作为连带商品带动整体客单价</div>
                  <div>• <strong>行业交叉分解：</strong>确保各子赛道分日加总 = 3C数码整体预测值</div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                活动因素加乘逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>叠加活动因素的 GMV 加乘计算：</p>
                <div className="bg-red-50 rounded-lg p-3 text-xs text-red-800 space-y-1">
                  <div>• <strong>平台满减券：</strong>满 300-50，预计拉动 GMV +12%</div>
                  <div>• <strong>品类券：</strong>3C数码专属券，预计拉动 +8%</div>
                  <div>• <strong>直播带货：</strong>头部主播专场，预计贡献 GMV 约 800 万</div>
                  <div>• <strong>会员日加磅：</strong>06/18 会员专属折扣，预计额外 +5%</div>
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
                  <p className="font-medium">预测较去年同期增长 15.6% 的主要原因：</p>
                  <div className="space-y-1 text-xs">
                    <div>1. <strong>新品首发节奏前置：</strong>多款旗舰机型在预热期首发，提前释放消费需求，预计贡献增量 GMV 约 500 万</div>
                    <div>2. <strong>短视频渠道 ROI 持续提升：</strong>短视频转化率从去年 2.8% 提升至 3.5%（+25%），预计贡献增量 GMV 约 400 万</div>
                    <div>3. <strong>以旧换新政策红利：</strong>政府补贴叠加平台补贴，预计带动额外 300 万 GMV，转化率预估 62%</div>
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
                    <div>1. <strong>竞品大促节奏冲突：</strong>竞品 B 提前 2 天启动预售，可能分流 8-12% 的潜在用户</div>
                    <div>2. <strong>供应链压力：</strong>部分热门机型库存紧张，若补货不及时将影响约 200 万 GMV</div>
                    <div>3. <strong>返场期增长乏力：</strong>返场期预测 1,277 万，略低于目标 1,290 万，需关注复购和长尾流量</div>
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
                    <div>1. <strong>06/15-06/17 预热期投入集中：</strong>该时段预算占比 35%，对应 GMV 占比 36.5%，属于"蓄势"阶段</div>
                    <div>2. <strong>06/18 爆发日：</strong>单日贡献整体 37.6% GMV，需确保各渠道承接能力（特别是服务器扩容和客服排班）</div>
                    <div>3. <strong>06/19-06/20 返场期：</strong>重点抓复购和未下单用户召回，预计贡献 25.8% GMV</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium text-gray-800">子赛道目标压力分析：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-gray-500 font-medium">
                      <tr>
                        <th className="text-left py-2 px-3">子赛道</th>
                        <th className="text-right py-2 px-3">预测值</th>
                        <th className="text-right py-2 px-3">占比</th>
                        <th className="text-right py-2 px-3">同比增速</th>
                        <th className="text-center py-2 px-3">压力等级</th>
                        <th className="text-left py-2 px-3">关键风险</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">手机</td>
                        <td className="py-2 px-3 text-right text-gray-700">2,536 万</td>
                        <td className="py-2 px-3 text-right text-gray-600">51.3%</td>
                        <td className="py-2 px-3 text-right text-green-600">+16.2%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">低</span></td>
                        <td className="py-2 px-3 text-gray-500">新品首发节奏需对齐</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">电脑整机</td>
                        <td className="py-2 px-3 text-right text-gray-700">1,556 万</td>
                        <td className="py-2 px-3 text-right text-gray-600">31.5%</td>
                        <td className="py-2 px-3 text-right text-green-600">+14.8%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">低</span></td>
                        <td className="py-2 px-3 text-gray-500">学生购机需求旺季</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">数码配件</td>
                        <td className="py-2 px-3 text-right text-gray-700">856 万</td>
                        <td className="py-2 px-3 text-right text-gray-600">17.3%</td>
                        <td className="py-2 px-3 text-right text-green-600">+15.1%</td>
                        <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">低</span></td>
                        <td className="py-2 px-3 text-gray-500">连带销售带动明显</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="text-sm text-purple-800 space-y-2">
                <p className="font-medium">关键增长因子说明：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-purple-700 font-medium">
                      <tr>
                        <th className="text-left py-2 px-3">日期</th>
                        <th className="text-left py-2 px-3">阶段</th>
                        <th className="text-right py-2 px-3">GMV</th>
                        <th className="text-right py-2 px-3">环比</th>
                        <th className="text-left py-2 px-3">关键增长因子</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200">
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/15</td>
                        <td className="py-2 px-3 text-gray-700">预热期首日</td>
                        <td className="py-2 px-3 text-right text-gray-700">587 万</td>
                        <td className="py-2 px-3 text-right text-gray-600">-</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">预热首日，多款新品首发</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/16</td>
                        <td className="py-2 px-3 text-gray-700">3C品类日</td>
                        <td className="py-2 px-3 text-right text-gray-700">721 万</td>
                        <td className="py-2 px-3 text-right text-green-600">+22.8%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">品类专属券+头部主播专场</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/17</td>
                        <td className="py-2 px-3 text-gray-700">预热期第三天</td>
                        <td className="py-2 px-3 text-right text-gray-700">500 万</td>
                        <td className="py-2 px-3 text-right text-red-600">-30.7%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">蓄势等待爆发日</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/18</td>
                        <td className="py-2 px-3 text-gray-700">618爆发日</td>
                        <td className="py-2 px-3 text-right text-gray-700">1,863 万</td>
                        <td className="py-2 px-3 text-right text-green-600">+272.6%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">平台满减+会员日+全线爆发</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/19</td>
                        <td className="py-2 px-3 text-gray-700">返场期首日</td>
                        <td className="py-2 px-3 text-right text-gray-700">750 万</td>
                        <td className="py-2 px-3 text-right text-red-600">-59.7%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">返场优惠延续</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">06/20</td>
                        <td className="py-2 px-3 text-gray-700">返场期第二天</td>
                        <td className="py-2 px-3 text-right text-gray-700">527 万</td>
                        <td className="py-2 px-3 text-right text-red-600">-29.7%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">长尾流量收尾</td>
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
