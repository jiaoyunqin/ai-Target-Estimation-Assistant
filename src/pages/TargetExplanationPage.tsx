import React from 'react';
import { ArrowLeft, Target, TrendingUp, Brain, BarChart2, Calendar, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';

// 定义通用数据类型
interface DailyData {
  date: string;
  phase: string;
  total: string;
  growth: string;
  factor: string;
}

interface PhaseData {
  name: string;
  date: string;
  target: string;
  forecast: string;
  rate: string;
  color: string;
  status: string;
}

interface IndustryItem {
  name: string;
  forecast: string;
  ratio: string;
  growth: string;
  pressure: string;
  risk: string;
}

export const TargetExplanationPage: React.FC = () => {
  // 从URL参数获取角色信息
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role') || 'manager';

  // 根据角色决定显示大盘整体还是3C数码数据
  const isManagerView = role === 'manager';

  // 通用数据获取
  const getTitle = () => isManagerView ? '618大促 · 大盘整体 · AI智能测算逻辑详解' : '618大促 · 3C数码赛道 · AI智能测算逻辑详解';
  const getAiGmv = () => isManagerView ? '15,470' : '4,948';
  const getTargetGmv = () => isManagerView ? '15,000' : '4,760';
  const getDifference = () => isManagerView ? '+470' : '+188';
  const getAchievementRate = () => isManagerView ? '103%' : '104%';
  const getNear30DaysAvg = () => isManagerView ? '1,800' : '620';
  const getNear30DaysGrowth = () => isManagerView ? '+28.9%' : '+32.9%';
  
  const getPhases = (): PhaseData[] => isManagerView ? [
    { name: '预热期', date: '06/15-06/17', target: '5,440', forecast: '5,590', rate: '102.8%', color: '#00B42A', status: '超额完成' },
    { name: '爆发期', date: '06/18', target: '5,250', forecast: '5,680', rate: '108.2%', color: '#00B42A', status: '超额完成' },
    { name: '返场期', date: '06/19-06/20', target: '4,310', forecast: '4,200', rate: '97.4%', color: '#FF7D00', status: '接近目标' },
  ] : [
    { name: '预热期', date: '06/15-06/17', target: '1,750', forecast: '1,808', rate: '103.3%', color: '#00B42A', status: '超额完成' },
    { name: '爆发期', date: '06/18', target: '1,720', forecast: '1,863', rate: '108.3%', color: '#00B42A', status: '超额完成' },
    { name: '返场期', date: '06/19-06/20', target: '1,290', forecast: '1,277', rate: '99.0%', color: '#FF7D00', status: '接近目标' },
  ];
  
  const getDailyData = (): DailyData[] => isManagerView ? [
    { date: '06/15', phase: '预热期首日', total: '1,750', growth: '+15%', factor: '预热首日' },
    { date: '06/16', phase: '3C品类日', total: '2,120', growth: '+21%', factor: '3C品类专属补贴' },
    { date: '06/17', phase: '美妆品类日', total: '1,720', growth: '+12%', factor: '美妆超级品类日' },
    { date: '06/18', phase: '618爆发日', total: '5,680', growth: '+230%', factor: '平台满减+会员日+全品类爆发' },
    { date: '06/19', phase: '服饰返场日', total: '2,350', growth: '-58.6%', factor: '服饰专属返场补贴' },
    { date: '06/20', phase: '返场期第二天', total: '1,850', growth: '-21.3%', factor: '全品类清仓返场' },
  ] : [
    { date: '06/15', phase: '预热期首日', total: '587', growth: '+12%', factor: '预热首日，多款新品首发' },
    { date: '06/16', phase: '3C品类日', total: '721', growth: '+22.8%', factor: '品类专属券+头部主播专场' },
    { date: '06/17', phase: '预热期第三天', total: '500', growth: '-30.7%', factor: '蓄势等待爆发日' },
    { date: '06/18', phase: '618爆发日', total: '1,863', growth: '+272.6%', factor: '平台满减+会员日+全线爆发' },
    { date: '06/19', phase: '返场期首日', total: '750', growth: '-59.7%', factor: '返场优惠延续' },
    { date: '06/20', phase: '返场期第二天', total: '527', growth: '-29.7%', factor: '长尾流量收尾' },
  ];

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
              <p className="text-xs text-gray-500">{getTitle()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* 一、目标结果对比 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-gray-900">一、目标结果对比</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-600 mb-1">AI测算GMV</div>
                <div className="text-2xl font-bold text-green-900">{getAiGmv()}万</div>
                <div className="text-xs text-green-500 mt-1">中性预测</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">管理层目标GMV</div>
                <div className="text-2xl font-bold text-blue-900">{getTargetGmv()}万</div>
                <div className="text-xs text-blue-500 mt-1">OKR设定目标</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs text-green-600 mb-1">差额</div>
                <div className="text-2xl font-bold text-green-900">{getDifference()}万</div>
                <div className="text-xs text-green-500 mt-1">达成率{getAchievementRate()}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-3">同比/环比参照系</div>
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
                      <td className="py-2 px-3 text-right text-gray-700">{isManagerView ? '13,200' : '4,280'}万</td>
                      <td className="py-2 px-3 text-right text-green-600">{isManagerView ? '+17.2%' : '+15.6%'}</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">AI智能选取，相同活动周期</td>
                    </tr>
                    {!isManagerView && (
                      <tr>
                        <td className="py-2 px-3 text-gray-800 font-medium">今年双11</td>
                        <td className="py-2 px-3 text-right text-gray-700">5,120万</td>
                        <td className="py-2 px-3 text-right text-gray-500">-3.4%</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">相邻可比大促，618略低于双11</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">近30天日均</td>
                      <td className="py-2 px-3 text-right text-gray-700">{getNear30DaysAvg()}万/天</td>
                      <td className="py-2 px-3 text-right text-green-600">{getNear30DaysGrowth()}</td>
                      <td className="py-2 px-3 text-gray-500 text-xs">自然水位基线参考</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-gray-800 font-medium">OKR目标</td>
                      <td className="py-2 px-3 text-right text-gray-700">{getTargetGmv()}万</td>
                      <td className="py-2 px-3 text-right text-green-600">超额{getDifference()}万</td>
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
                    {getPhases().map((phase, index) => (
                      <tr key={index}>
                        <td className="py-2 px-3 text-gray-800 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }}></span>
                            {phase.name}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-gray-700">{phase.date}</td>
                        <td className="py-2 px-3 text-right text-gray-700">{phase.target}万</td>
                        <td className="py-2 px-3 text-right text-gray-700">{phase.forecast}万</td>
                        <td className="py-2 px-3 text-right" style={{ color: phase.color }}>{phase.rate}</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">
                          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: phase.color + '15', color: phase.color }}>{phase.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 二、测算过程关键逻辑 */}
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
                <p>基于近90天非大促期间的{isManagerView ? '全品类' : '3C数码'}GMV数据，剔除异常波动日，拟合自然增长趋势线。</p>
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                  <div>• 自然水位 = 日均GMV基线 × 季节性系数 × 趋势增长因子</div>
                  {isManagerView ? (
                    <>
                      <div>• 当前日均基线：1,800万/天，季节性系数1.12（618期间上调），趋势因子1.08</div>
                      <div>• 预热期自然水位合计：5,200万（实际预测5,590万，活动拉动+7.5%）</div>
                    </>
                  ) : (
                    <>
                      <div>• 当前日均基线：620万/天，季节性系数1.08（618期间上调），趋势因子1.06</div>
                      <div>• 预热期自然水位合计：1,680万（实际预测1,808万，活动拉动+7.6%）</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                选取可比日期的逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>AI根据以下优先级自动匹配可比周期，确保测算基准合理：</p>
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
                      <span className="font-medium">手动指定：</span>支持用户指定任意历史活动周期作为参照，系统自动对齐BigDay并校正天数差异
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded font-bold shrink-0">优先级3</span>
                    <div className="text-purple-800">
                      <span className="font-medium">兜底方案：</span>无可比大促时，使用近30天均值 × 爆发系数（基于历史大促/日常倍率推算）
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
                  <div>• <strong>历史分日占比：</strong>参考去年618各日GMV占整体比例分布</div>
                  {isManagerView ? (
                    <>
                      <div>• <strong>BigDay爆发系数：</strong>06/18当天约占整体36.7%，为最高单日</div>
                      <div>• <strong>预热-爬坡-爆发节奏：</strong>前3天预热（日均11.4%），06/18爆发（36.7%），最后2天返场（日均13.5%）</div>
                    </>
                  ) : (
                    <>
                      <div>• <strong>BigDay爆发系数：</strong>06/18当天约占整体37.6%，为最高单日</div>
                      <div>• <strong>预热-爬坡-爆发节奏：</strong>前3天预热（日均12.2%），06/18爆发（37.6%），最后2天返场（日均12.9%）</div>
                    </>
                  )}
                  <div>• <strong>星期效应修正：</strong>周末日GMV通常比工作日高15-20%，已做校正</div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                {isManagerView ? '行业分日与大盘趋势性' : '赛道分日与大盘趋势性'}
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                {isManagerView ? (
                  <div>
                    <p>不同行业的大促节奏存在差异，AI分别建模：</p>
                    <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
                      <div>• <strong>3C数码/家电：</strong>强BigDay依赖（爆发日占比高达35%+），预售锁单比例高</div>
                      <div>• <strong>服饰美妆：</strong>预热期即开始上量，分布更均匀，受直播带动明显</div>
                      <div>• <strong>食品快消：</strong>补货型消费，波动较小，日均占比较稳定</div>
                      <div>• <strong>行业×日期交叉分解：</strong>确保各行业分日加总 = 大盘分日预测值</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>3C数码行业的大促节奏特点：</p>
                    <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800 space-y-1">
                      <div>• <strong>3C数码：</strong>强BigDay依赖（爆发日占比高达37.6%），预售锁单比例高（约65%）</div>
                      <div>• <strong>手机赛道：</strong>06/18当天占比最高（40.2%），新品首发集中在预热期</div>
                      <div>• <strong>电脑整机：</strong>预热期和爆发期分布较均衡，受学生购机需求影响</div>
                      <div>• <strong>数码配件：</strong>随大盘波动，作为连带商品带动整体客单价</div>
                      <div>• <strong>赛道交叉分解：</strong>确保各子赛道分日加总 = 3C数码整体预测值</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                活动因素加乘逻辑
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>叠加活动因素的GMV加乘计算：</p>
                <div className="bg-red-50 rounded-lg p-3 text-xs text-red-800 space-y-1">
                  <div>• <strong>平台满减券：</strong>满300-50，预计拉动GMV+12%</div>
                  <div>• <strong>品类券：</strong>{isManagerView ? '各品类专属券' : '3C数码专属券'}，预计拉动+8%</div>
                  <div>• <strong>直播带货：</strong>头部主播专场，预计贡献GMV约{isManagerView ? '2,500' : '800'}万</div>
                  <div>• <strong>会员日加磅：</strong>06/18会员专属折扣，预计额外+5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 三、业务性解释 */}
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
                  <p className="font-medium">预测较去年同期增长{isManagerView ? '+17.2%' : '+15.6%'}的主要原因：</p>
                  <div className="space-y-1 text-xs">
                    {isManagerView ? (
                      <>
                        <div>1. <strong>新品首发节奏优化：</strong>多行业新品前置到预热期首发，提前释放消费需求，预计贡献增量GMV约1,200万</div>
                        <div>2. <strong>短视频渠道ROI持续提升：</strong>短视频转化率从去年2.8%提升至3.5%（+25%），预计贡献增量GMV约1,000万</div>
                        <div>3. <strong>跨品类联动活动：</strong>跨品类满减券预计带动额外800万GMV，核销率预估62%</div>
                      </>
                    ) : (
                      <>
                        <div>1. <strong>新品首发节奏前置：</strong>多款旗舰机型在预热期首发，提前释放消费需求，预计贡献增量GMV约500万</div>
                        <div>2. <strong>短视频渠道ROI持续提升：</strong>短视频转化率从去年2.8%提升至3.5%（+25%），预计贡献增量GMV约400万</div>
                        <div>3. <strong>以旧换新政策红利：</strong>政府补贴叠加平台补贴，预计带动额外300万GMV，转化率预估62%</div>
                      </>
                    )}
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
                    {isManagerView ? (
                      <>
                        <div>1. <strong>竞品大促节奏冲突：</strong>头部竞品提前3天启动预售，可能分流10-15%的潜在用户</div>
                        <div>2. <strong>供应链压力：</strong>部分热门品类库存紧张，若补货不及时将影响约800万GMV</div>
                        <div>3. <strong>返场期增长乏力：</strong>返场期预测4,200万，略低于目标4,310万，需关注复购和长尾流量</div>
                      </>
                    ) : (
                      <>
                        <div>1. <strong>竞品大促节奏冲突：</strong>竞品B提前2天启动预售，可能分流8-12%的潜在用户</div>
                        <div>2. <strong>供应链压力：</strong>部分热门机型库存紧张，若补货不及时将影响约200万GMV</div>
                        <div>3. <strong>返场期增长乏力：</strong>返场期预测1,277万，略低于目标1,290万，需关注复购和长尾流量</div>
                      </>
                    )}
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
                    {isManagerView ? (
                      <>
                        <div>1. <strong>06/15-06/17预热期投入集中：</strong>该时段预算占比36%，对应GMV占比36.1%，属于"蓄势"阶段</div>
                        <div>2. <strong>06/18爆发日：</strong>单日贡献整体36.7% GMV，需确保各渠道承接能力（特别是服务器扩容和客服排班）</div>
                        <div>3. <strong>06/19-06/20返场期：</strong>重点抓复购和未下单用户召回，预计贡献27.2% GMV</div>
                      </>
                    ) : (
                      <>
                        <div>1. <strong>06/15-06/17预热期投入集中：</strong>该时段预算占比35%，对应GMV占比36.5%，属于"蓄势"阶段</div>
                        <div>2. <strong>06/18爆发日：</strong>单日贡献整体37.6% GMV，需确保各渠道承接能力（特别是服务器扩容和客服排班）</div>
                        <div>3. <strong>06/19-06/20返场期：</strong>重点抓复购和未下单用户召回，预计贡献25.8% GMV</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium text-gray-800">{isManagerView ? '各行业' : '子赛道'}目标压力分析：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-gray-500 font-medium">
                      <tr>
                        <th className="text-left py-2 px-3">{isManagerView ? '行业' : '子赛道'}</th>
                        <th className="text-right py-2 px-3">预测值</th>
                        <th className="text-right py-2 px-3">占比</th>
                        <th className="text-right py-2 px-3">同比增速</th>
                        <th className="text-center py-2 px-3">压力等级</th>
                        <th className="text-left py-2 px-3">关键风险</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isManagerView ? (
                        // 大盘整体 - 显示各行业
                        [
                          { name: '3C数码', forecast: '14,948', ratio: '29.3%', growth: '+16.1%', pressure: '低', risk: '新品首发节奏需对齐' },
                          { name: '美妆护肤', forecast: '10,744', ratio: '21.1%', growth: '+17.5%', pressure: '低', risk: '新品首发节奏需对齐' },
                          { name: '家电家居', forecast: '9,343', ratio: '18.3%', growth: '+14.8%', pressure: '中', risk: '以旧换新政策红利减弱' },
                          { name: '服饰鞋包', forecast: '8,408', ratio: '16.5%', growth: '+13.2%', pressure: '中', risk: '竞品分流压力大' },
                          { name: '其他', forecast: '3,271', ratio: '6.4%', growth: '+12.8%', pressure: '低', risk: '长尾品类清仓' },
                        ].map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 font-medium text-gray-800">{item.name}</td>
                            <td className="py-2 px-3 text-right text-gray-700">{item.forecast}万</td>
                            <td className="py-2 px-3 text-right text-gray-600">{item.ratio}</td>
                            <td className="py-2 px-3 text-right text-green-600">{item.growth}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: item.pressure === '低' ? '#dcfce7' : item.pressure === '中' ? '#fef3c7' : '#fee2e2', color: item.pressure === '低' ? '#166534' : item.pressure === '中' ? '#854d0e' : '#991b1b' }}>{item.pressure}</span>
                            </td>
                            <td className="py-2 px-3 text-gray-500">{item.risk}</td>
                          </tr>
                        ))
                      ) : (
                        // 3C数码 - 显示子赛道
                        [
                          { name: '手机', forecast: '2,536', ratio: '51.3%', growth: '+16.2%', pressure: '低', risk: '新品首发节奏需对齐' },
                          { name: '电脑整机', forecast: '1,556', ratio: '31.5%', growth: '+14.8%', pressure: '低', risk: '学生购机需求旺季' },
                          { name: '数码配件', forecast: '856', ratio: '17.3%', growth: '+15.1%', pressure: '低', risk: '连带销售带动明显' },
                        ].map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 font-medium text-gray-800">{item.name}</td>
                            <td className="py-2 px-3 text-right text-gray-700">{item.forecast}万</td>
                            <td className="py-2 px-3 text-right text-gray-600">{item.ratio}</td>
                            <td className="py-2 px-3 text-right text-green-600">{item.growth}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: item.pressure === '低' ? '#dcfce7' : item.pressure === '中' ? '#fef3c7' : '#fee2e2', color: item.pressure === '低' ? '#166534' : item.pressure === '中' ? '#854d0e' : '#991b1b' }}>{item.pressure}</span>
                            </td>
                            <td className="py-2 px-3 text-gray-500">{item.risk}</td>
                          </tr>
                        ))
                      )}
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
                      {getDailyData().map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3 font-medium text-gray-800">{item.date}</td>
                          <td className="py-2 px-3 text-gray-700">{item.phase}</td>
                          <td className="py-2 px-3 text-right text-gray-700">{item.total}万</td>
                          <td className="py-2 px-3 text-right" style={{ color: item.growth.startsWith('+') ? '#00B42A' : '#F53F3F' }}>{item.growth}</td>
                          <td className="py-2 px-3 text-gray-500 text-xs">{item.factor}</td>
                        </tr>
                      ))}
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
