import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, Download, BarChart2, Lightbulb, ArrowUpRight, ChevronDown, ChevronRight, ChevronLeft, AlertTriangle, AlertCircle, TrendingDown, Target, Settings, Zap, TrendingUp, DollarSign, Megaphone, Tv, FileText, Globe, ExternalLink, Clock, MessageSquare, MoreHorizontal, Send, PlayCircle, PlusCircle, HelpCircle, CheckCircle, CheckCircle2, ArrowRight, Search, Loader2, LayoutGrid, RefreshCw, Cloud, Upload, Lock, Copy, Link, Mail, Save, Database, Workflow } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Legend, ReferenceLine, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie } from 'recharts';

interface ReportAreaProps {
  onClose: () => void;
  reportType?: string; // Add this prop to distinguish report content
  reportSidebarWidth?: number; // Optional prop to control sidebar width
  onResizeStart?: (e: React.MouseEvent) => void; // Optional handler for resizing
  aiContentMode?: 'default' | 'ai_marketing_tools'; // To toggle the long report view
  showNewConclusion?: boolean;
  budgetCommand?: {
    type: 'add_item' | 'update_total' | 'update_direction';
    direction?: 'gmv' | 'dau' | 'dac';
    itemName?: string;
    budget?: number;
    totalBudget?: number;
  } | null;
  totalBudget?: number;
  onTotalBudgetChange?: (value: number) => void;
  promotionType?: string; // 当前大促类型，用于联动历史参考数据和图表
}

export const ReportArea: React.FC<ReportAreaProps> = ({ onClose, reportType = 'default', reportSidebarWidth, onResizeStart, aiContentMode = 'default', showNewConclusion = false, budgetCommand, totalBudget: propTotalBudget, onTotalBudgetChange, promotionType = '618' }) => {
  
  // 根据大促类型获取对应的历史参考数据配置
  const getPromotionConfig = (type: string) => {
    const configs: Record<string, {
      name: string;
      period: string;
      periodShort: string;
      bigDay: string;
      historyTopDown: { date: string; phase: string; gmv: number; deliveryGmv: number; deliveryGmvLimit: number; settlementGmv: number; t2Rate: number; budget: number }[];
      historyBottomUp: { industry: string; subIndustry: string; gmv: number; deliveryGmv: number; deliveryGmvLimit: number; settlementGmv: number; budget: number; ratio: string; daily: number[] }[];
      budgetStructure: { type: string; total: number; ratio: string; daily: number[] }[];
      weather: { date: string; type: string; weather: string; temp: string; note: string }[];
      competitors: { id: number; name: string; activity: string; startTime: string; endTime: string; source: string; status: string }[];
      waterLevelChart: { day: string; topDown: number; bottomUp: number; natural: number; target: number }[];
    }> = {
      '618': {
        name: '2025年618大促',
        period: '2025/06/15 - 2025/06/20',
        periodShort: '06/15-06/20',
        bigDay: '6.18',
        historyTopDown: [
          { date: '2025-06-15', phase: '预热期', gmv: 1180, deliveryGmv: 980, deliveryGmvLimit: 920, settlementGmv: 1120, t2Rate: 90.8, budget: 85 },
          { date: '2025-06-16', phase: '预热期', gmv: 1300, deliveryGmv: 1100, deliveryGmvLimit: 1040, settlementGmv: 1240, t2Rate: 91.2, budget: 92 },
          { date: '2025-06-17', phase: '预热期', gmv: 1400, deliveryGmv: 1200, deliveryGmvLimit: 1130, settlementGmv: 1330, t2Rate: 90.9, budget: 105 },
          { date: '2025-06-18', phase: '爆发期', gmv: 2940, deliveryGmv: 2580, deliveryGmvLimit: 2380, settlementGmv: 2800, t2Rate: 92.1, budget: 235 },
          { date: '2025-06-19', phase: '返场期', gmv: 1540, deliveryGmv: 1380, deliveryGmvLimit: 1260, settlementGmv: 1460, t2Rate: 89.5, budget: 98 },
          { date: '2025-06-20', phase: '返场期', gmv: 1240, deliveryGmv: 1100, deliveryGmvLimit: 1020, settlementGmv: 1180, t2Rate: 89.2, budget: 83 },
        ],
        historyBottomUp: [
          { industry: '3C数码', subIndustry: '手机', gmv: 2600, deliveryGmv: 2340, deliveryGmvLimit: 2180, settlementGmv: 2470, budget: 189, ratio: '27.1%', daily: [320, 350, 380, 780, 420, 350] },
          { industry: '家电', subIndustry: '大家电', gmv: 2000, deliveryGmv: 1862, deliveryGmvLimit: 1720, settlementGmv: 1890, budget: 142, ratio: '20.8%', daily: [240, 270, 290, 620, 310, 270] },
          { industry: '服饰', subIndustry: '女装', gmv: 1710, deliveryGmv: 1400, deliveryGmvLimit: 1280, settlementGmv: 1610, budget: 121, ratio: '17.8%', daily: [210, 230, 250, 530, 270, 220] },
          { industry: '食品快消', subIndustry: '休闲食品', gmv: 1510, deliveryGmv: 1436, deliveryGmvLimit: 1350, settlementGmv: 1440, budget: 106, ratio: '15.7%', daily: [190, 210, 220, 470, 240, 180] },
          { industry: '美妆个护', subIndustry: '护肤', gmv: 1120, deliveryGmv: 974, deliveryGmvLimit: 890, settlementGmv: 1060, budget: 80, ratio: '11.7%', daily: [140, 150, 160, 340, 190, 140] },
          { industry: '其他', subIndustry: '综合品类', gmv: 660, deliveryGmv: 572, deliveryGmvLimit: 520, settlementGmv: 630, budget: 60, ratio: '6.9%', daily: [80, 90, 100, 200, 110, 80] },
        ],
        budgetStructure: [
          { type: '消费券预算', total: 293, ratio: '42.0%', daily: [36, 39, 44, 98, 41, 35] },
          { type: '追补预算', total: 112, ratio: '16.0%', daily: [13, 15, 17, 37, 18, 12] },
          { type: '领航预算', total: 84, ratio: '12.0%', daily: [10, 11, 13, 28, 14, 8] },
          { type: '其他预算', total: 209, ratio: '30.0%', daily: [26, 27, 31, 72, 25, 28] },
        ],
        weather: [
          { date: '6/15', type: '周末', weather: '晴', temp: '25-32℃', note: '-' },
          { date: '6/16', type: '工作日', weather: '多云', temp: '23-30℃', note: '-' },
          { date: '6/17', type: '工作日', weather: '阴', temp: '22-28℃', note: '预热期开始' },
          { date: '6/18', type: '大促日', weather: '晴', temp: '24-31℃', note: '618峰值日' },
          { date: '6/19', type: '工作日', weather: '多云', temp: '23-29℃', note: '返场期' },
          { date: '6/20', type: '周末', weather: '晴', temp: '25-33℃', note: '活动尾声' },
        ],
        competitors: [
          { id: 1, name: '淘天', activity: '2025年618年中大促', startTime: '2025-06-15T00:00', endTime: '2025-06-20T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 2, name: 'PDD', activity: '618百亿补贴专场', startTime: '2025-06-17T00:00', endTime: '2025-06-19T23:59', source: 'AI文档解析', status: 'pending' },
          { id: 3, name: '京东', activity: '618店庆日', startTime: '2025-06-18T00:00', endTime: '2025-06-18T23:59', source: '人工输入', status: 'incomplete' },
        ],
        waterLevelChart: [
          { day: '06/15', topDown: 1180, bottomUp: 1180, natural: 1050, target: 1150 },
          { day: '06/16', topDown: 1300, bottomUp: 1280, natural: 1150, target: 1250 },
          { day: '06/17', topDown: 1400, bottomUp: 1380, natural: 1250, target: 1350 },
          { day: '06/18', topDown: 2940, bottomUp: 2900, natural: 2600, target: 2850 },
          { day: '06/19', topDown: 1540, bottomUp: 1520, natural: 1380, target: 1480 },
          { day: '06/20', topDown: 1240, bottomUp: 1220, natural: 1120, target: 1200 },
        ],
      },
      '双11': {
        name: '2024年双11大促',
        period: '2024/11/01 - 2024/11/11',
        periodShort: '11/01-11/11',
        bigDay: '11.11',
        historyTopDown: [
          { date: '2024-11-01', phase: '预热期', gmv: 1480, deliveryGmv: 1210, deliveryGmvLimit: 1160, settlementGmv: 1410, t2Rate: 91.0, budget: 98 },
          { date: '2024-11-02', phase: '预热期', gmv: 1630, deliveryGmv: 1340, deliveryGmvLimit: 1280, settlementGmv: 1550, t2Rate: 90.7, budget: 106 },
          { date: '2024-11-03', phase: '预热期', gmv: 1790, deliveryGmv: 1500, deliveryGmvLimit: 1430, settlementGmv: 1700, t2Rate: 91.3, budget: 122 },
          { date: '2024-11-04', phase: '预热期', gmv: 1920, deliveryGmv: 1620, deliveryGmvLimit: 1550, settlementGmv: 1830, t2Rate: 90.9, budget: 138 },
          { date: '2024-11-05', phase: '爆发期', gmv: 3360, deliveryGmv: 2850, deliveryGmvLimit: 2580, settlementGmv: 3220, t2Rate: 92.0, budget: 275 },
          { date: '2024-11-06', phase: '返场期', gmv: 1020, deliveryGmv: 1580, deliveryGmvLimit: 1290, settlementGmv: 970, t2Rate: 89.5, budget: 92 },
          { date: '2024-11-07', phase: '返场期', gmv: 980, deliveryGmv: 1420, deliveryGmvLimit: 1180, settlementGmv: 930, t2Rate: 89.1, budget: 85 },
          { date: '2024-11-08', phase: '返场期', gmv: 1050, deliveryGmv: 1520, deliveryGmvLimit: 1260, settlementGmv: 1000, t2Rate: 89.3, budget: 88 },
          { date: '2024-11-09', phase: '返场期', gmv: 1100, deliveryGmv: 1580, deliveryGmvLimit: 1320, settlementGmv: 1050, t2Rate: 89.6, budget: 92 },
          { date: '2024-11-10', phase: '爆发期', gmv: 2680, deliveryGmv: 2350, deliveryGmvLimit: 2180, settlementGmv: 2560, t2Rate: 91.8, budget: 220 },
          { date: '2024-11-11', phase: '爆发期', gmv: 3860, deliveryGmv: 3280, deliveryGmvLimit: 2980, settlementGmv: 3680, t2Rate: 92.2, budget: 310 },
        ],
        historyBottomUp: [
          { industry: '服饰', subIndustry: '女装', gmv: 4200, deliveryGmv: 3500, deliveryGmvLimit: 3200, settlementGmv: 4000, budget: 320, ratio: '21.8%', daily: [380, 420, 480, 520, 280, 260, 280, 300, 320, 380, 580] },
          { industry: '美妆个护', subIndustry: '护肤', gmv: 3800, deliveryGmv: 3200, deliveryGmvLimit: 2900, settlementGmv: 3600, budget: 280, ratio: '19.7%', daily: [340, 380, 420, 460, 240, 220, 240, 260, 280, 340, 560] },
          { industry: '3C数码', subIndustry: '手机', gmv: 3200, deliveryGmv: 2850, deliveryGmvLimit: 2650, settlementGmv: 3050, budget: 240, ratio: '16.6%', daily: [290, 320, 360, 400, 200, 180, 200, 220, 240, 290, 500] },
          { industry: '食品快消', subIndustry: '休食饮料', gmv: 2800, deliveryGmv: 2600, deliveryGmvLimit: 2400, settlementGmv: 2660, budget: 200, ratio: '14.5%', daily: [250, 280, 320, 350, 180, 160, 180, 200, 220, 260, 400] },
          { industry: '家电', subIndustry: '小家电', gmv: 2400, deliveryGmv: 2200, deliveryGmvLimit: 2050, settlementGmv: 2280, budget: 180, ratio: '12.5%', daily: [220, 240, 280, 300, 150, 140, 150, 170, 190, 220, 340] },
          { industry: '其他', subIndustry: '综合品类', gmv: 2700, deliveryGmv: 2300, deliveryGmvLimit: 2100, settlementGmv: 2570, budget: 180, ratio: '14.0%', daily: [240, 270, 310, 330, 170, 160, 170, 190, 210, 250, 400] },
        ],
        budgetStructure: [
          { type: '消费券预算', total: 680, ratio: '40.0%', daily: [60, 68, 78, 85, 110, 55, 50, 55, 58, 75, 86] },
          { type: '追补预算', total: 340, ratio: '20.0%', daily: [30, 34, 40, 45, 55, 28, 25, 28, 30, 38, 47] },
          { type: '领航预算', total: 255, ratio: '15.0%', daily: [23, 26, 30, 34, 42, 21, 19, 21, 22, 28, 29] },
          { type: '其他预算', total: 425, ratio: '25.0%', daily: [38, 42, 50, 56, 68, 34, 31, 34, 36, 44, 52] },
        ],
        weather: [
          { date: '11/01', type: '工作日', weather: '晴', temp: '12-20℃', note: '预热开始' },
          { date: '11/02', type: '周末', weather: '多云', temp: '10-18℃', note: '-' },
          { date: '11/03', type: '工作日', weather: '晴', temp: '11-19℃', note: '-' },
          { date: '11/04', type: '工作日', weather: '阴', temp: '10-17℃', note: '-' },
          { date: '11/05', type: '大促日', weather: '晴', temp: '13-21℃', note: '第一波峰值' },
          { date: '11/06', type: '工作日', weather: '多云', temp: '12-18℃', note: '返场期' },
          { date: '11/07', type: '工作日', weather: '晴', temp: '11-19℃', note: '-' },
          { date: '11/08', type: '工作日', weather: '阴', temp: '10-16℃', note: '-' },
          { date: '11/09', type: '周末', weather: '多云', temp: '9-15℃', note: '-' },
          { date: '11/10', type: '大促日', weather: '晴', temp: '12-20℃', note: '第二波预热' },
          { date: '11/11', type: '大促日', weather: '晴', temp: '13-22℃', note: '双11峰值' },
        ],
        competitors: [
          { id: 1, name: '淘天', activity: '2024年双11全球狂欢节', startTime: '2024-11-01T00:00', endTime: '2024-11-11T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 2, name: 'PDD', activity: '双11百亿补贴', startTime: '2024-11-01T00:00', endTime: '2024-11-11T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 3, name: '京东', activity: '京东双11全球好物节', startTime: '2024-10/31T00:00', endTime: '2024-11-12T23:59', source: 'AI文档解析', status: 'pending' },
          { id: 4, name: '抖音电商', activity: '抖音好物节', startTime: '2024-11-01T00:00', endTime: '2024-11-11T23:59', source: '人工输入', status: 'pending' },
        ],
        waterLevelChart: [
          { day: '11/01', topDown: 1480, bottomUp: 1460, natural: 1320, target: 1420 },
          { day: '11/02', topDown: 1630, bottomUp: 1610, natural: 1450, target: 1580 },
          { day: '11/03', topDown: 1790, bottomUp: 1770, natural: 1580, target: 1720 },
          { day: '11/04', topDown: 1920, bottomUp: 1900, natural: 1680, target: 1850 },
          { day: '11/05', topDown: 3360, bottomUp: 3300, natural: 2900, target: 3200 },
          { day: '11/06', topDown: 1020, bottomUp: 1000, natural: 920, target: 980 },
          { day: '11/07', topDown: 980, bottomUp: 960, natural: 880, target: 940 },
          { day: '11/08', topDown: 1050, bottomUp: 1030, natural: 920, target: 1000 },
          { day: '11/09', topDown: 1100, bottomUp: 1080, natural: 960, target: 1050 },
          { day: '11/10', topDown: 2680, bottomUp: 2650, natural: 2350, target: 2580 },
          { day: '11/11', topDown: 3860, bottomUp: 3800, natural: 3400, target: 3700 },
        ],
      },
      '双12': {
        name: '2024年双12大促',
        period: '2024/12/10 - 2024/12/12',
        periodShort: '12/10-12/12',
        bigDay: '12.12',
        historyTopDown: [
          { date: '2024-12-10', phase: '预热期', gmv: 880, deliveryGmv: 720, deliveryGmvLimit: 680, settlementGmv: 840, t2Rate: 89.5, budget: 68 },
          { date: '2024-12-11', phase: '预热期', gmv: 920, deliveryGmv: 760, deliveryGmvLimit: 720, settlementGmv: 880, t2Rate: 89.8, budget: 72 },
          { date: '2024-12-12', phase: '爆发期', gmv: 1680, deliveryGmv: 1420, deliveryGmvLimit: 1320, settlementGmv: 1600, t2Rate: 91.2, budget: 145 },
        ],
        historyBottomUp: [
          { industry: '服饰', subIndustry: '女装', gmv: 1100, deliveryGmv: 920, deliveryGmvLimit: 860, settlementGmv: 1050, budget: 85, ratio: '24.4%', daily: [380, 400, 320] },
          { industry: '美妆个护', subIndustry: '护肤', gmv: 980, deliveryGmv: 840, deliveryGmvLimit: 780, settlementGmv: 930, budget: 75, ratio: '21.8%', daily: [340, 360, 280] },
          { industry: '3C数码', subIndustry: '配件', gmv: 720, deliveryGmv: 650, deliveryGmvLimit: 610, settlementGmv: 690, budget: 55, ratio: '16.0%', daily: [250, 260, 210] },
          { industry: '食品快消', subIndustry: '休食', gmv: 680, deliveryGmv: 620, deliveryGmvLimit: 580, settlementGmv: 650, budget: 50, ratio: '15.1%', daily: [240, 250, 190] },
          { industry: '家电', subIndustry: '小家电', gmv: 580, deliveryGmv: 520, deliveryGmvLimit: 490, settlementGmv: 550, budget: 42, ratio: '12.9%', daily: [200, 210, 170] },
          { industry: '其他', subIndustry: '综合', gmv: 420, deliveryGmv: 360, deliveryGmvLimit: 340, settlementGmv: 400, budget: 28, ratio: '9.3%', daily: [150, 160, 110] },
        ],
        budgetStructure: [
          { type: '消费券预算', total: 145, ratio: '38.0%', daily: [50, 52, 43] },
          { type: '追补预算', total: 85, ratio: '22.0%', daily: [29, 31, 25] },
          { type: '领航预算', total: 65, ratio: '17.0%', daily: [22, 24, 19] },
          { type: '其他预算', total: 88, ratio: '23.0%', daily: [30, 32, 26] },
        ],
        weather: [
          { date: '12/10', type: '工作日', weather: '晴', temp: '2-10℃', note: '预热开始' },
          { date: '12/11', type: '工作日', weather: '多云', temp: '1-9℃', note: '-' },
          { date: '12/12', type: '大促日', weather: '晴', temp: '3-11℃', note: '双12峰值' },
        ],
        competitors: [
          { id: 1, name: '淘天', activity: '2024年双12大促', startTime: '2024-12-10T00:00', endTime: '2024-12-12T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 2, name: '京东', activity: '京东双12', startTime: '2024-12-09T00:00', endTime: '2024-12-12T23:59', source: 'AI文档解析', status: 'pending' },
        ],
        waterLevelChart: [
          { day: '12/10', topDown: 880, bottomUp: 860, natural: 780, target: 850 },
          { day: '12/11', topDown: 920, bottomUp: 900, natural: 820, target: 890 },
          { day: '12/12', topDown: 1680, bottomUp: 1650, natural: 1480, target: 1620 },
        ],
      },
      '年货节': {
        name: '2025年年货节',
        period: '2025/01/17 - 2025/01/27',
        periodShort: '01/17-01/27',
        bigDay: '1.20',
        historyTopDown: [
          { date: '2025-01-17', phase: '预热期', gmv: 980, deliveryGmv: 820, deliveryGmvLimit: 760, settlementGmv: 930, t2Rate: 88.5, budget: 72 },
          { date: '2025-01-18', phase: '预热期', gmv: 1100, deliveryGmv: 920, deliveryGmvLimit: 860, settlementGmv: 1050, t2Rate: 88.8, budget: 82 },
          { date: '2025-01-19', phase: '预热期', gmv: 1350, deliveryGmv: 1140, deliveryGmvLimit: 1060, settlementGmv: 1280, t2Rate: 89.2, budget: 98 },
          { date: '2025-01-20', phase: '爆发期', gmv: 2680, deliveryGmv: 2300, deliveryGmvLimit: 2150, settlementGmv: 2550, t2Rate: 90.8, budget: 210 },
          { date: '2025-01-21', phase: '返场期', gmv: 1580, deliveryGmv: 1380, deliveryGmvLimit: 1280, settlementGmv: 1500, t2Rate: 89.0, budget: 118 },
          { date: '2025-01-22', phase: '返场期', gmv: 1280, deliveryGmv: 1120, deliveryGmvLimit: 1040, settlementGmv: 1220, t2Rate: 88.6, budget: 95 },
          { date: '2025-01-23', phase: '返场期', gmv: 1100, deliveryGmv: 960, deliveryGmvLimit: 890, settlementGmv: 1050, t2Rate: 88.2, budget: 82 },
          { date: '2025-01-24', phase: '返场期', gmv: 980, deliveryGmv: 850, deliveryGmvLimit: 790, settlementGmv: 930, t2Rate: 88.0, budget: 72 },
          { date: '2025-01-25', phase: '返场期', gmv: 920, deliveryGmv: 800, deliveryGmvLimit: 740, settlementGmv: 880, t2Rate: 87.8, budget: 68 },
          { date: '2025-01-26', phase: '尾声', gmv: 780, deliveryGmv: 680, deliveryGmvLimit: 630, settlementGmv: 740, t2Rate: 87.5, budget: 58 },
          { date: '2025-01-27', phase: '尾声', gmv: 680, deliveryGmv: 590, deliveryGmvLimit: 550, settlementGmv: 650, t2Rate: 87.2, budget: 50 },
        ],
        historyBottomUp: [
          { industry: '食品快消', subIndustry: '年货礼盒', gmv: 3800, deliveryGmv: 3400, deliveryGmvLimit: 3150, settlementGmv: 3620, budget: 280, ratio: '28.0%', daily: [320, 380, 480, 980, 560, 420, 360, 320, 280, 240, 180] },
          { industry: '服饰', subIndustry: '新年装', gmv: 2800, deliveryGmv: 2400, deliveryGmvLimit: 2220, settlementGmv: 2660, budget: 210, ratio: '20.6%', daily: [240, 280, 350, 720, 420, 320, 280, 240, 220, 190, 140] },
          { industry: '家电', subIndustry: '年货家电', gmv: 2200, deliveryGmv: 1980, deliveryGmvLimit: 1850, settlementGmv: 2100, budget: 165, ratio: '16.2%', daily: [180, 220, 280, 580, 340, 260, 220, 200, 180, 150, 110] },
          { industry: '美妆个护', subIndustry: '护肤礼盒', gmv: 1900, deliveryGmv: 1650, deliveryGmvLimit: 1520, settlementGmv: 1800, budget: 145, ratio: '14.0%', daily: [160, 190, 240, 480, 280, 220, 180, 160, 150, 130, 100] },
          { industry: '3C数码', subIndustry: '数码配件', gmv: 1500, deliveryGmv: 1320, deliveryGmvLimit: 1230, settlementGmv: 1430, budget: 115, ratio: '11.1%', daily: [130, 150, 190, 380, 220, 180, 150, 130, 120, 100, 80] },
          { industry: '其他', subIndustry: '综合', gmv: 1380, deliveryGmv: 1180, deliveryGmvLimit: 1090, settlementGmv: 1310, budget: 100, ratio: '10.2%', daily: [120, 140, 170, 350, 200, 160, 140, 120, 110, 95, 70] },
        ],
        budgetStructure: [
          { type: '消费券预算', total: 420, ratio: '38.0%', daily: [35, 42, 52, 108, 62, 48, 42, 38, 35, 30, 25] },
          { type: '追补预算', total: 280, ratio: '25.0%', daily: [24, 28, 35, 72, 42, 32, 28, 25, 23, 20, 17] },
          { type: '领航预算', total: 180, ratio: '16.0%', daily: [15, 18, 22, 46, 26, 20, 18, 16, 15, 13, 11] },
          { type: '其他预算', total: 235, ratio: '21.0%', daily: [20, 24, 30, 62, 36, 26, 22, 20, 18, 16, 14] },
        ],
        weather: [
          { date: '01/17', type: '工作日', weather: '晴', temp: '-2-8℃', note: '预热开始' },
          { date: '01/18', type: '周末', weather: '多云', temp: '-1-7℃', note: '-' },
          { date: '01/19', type: '工作日', weather: '晴', temp: '0-9℃', note: '-' },
          { date: '01/20', type: '大促日', weather: '晴', temp: '1-10℃', note: '年货节峰值' },
          { date: '01/21', type: '工作日', weather: '阴', temp: '0-8℃', note: '快递陆续停发' },
          { date: '01/22', type: '工作日', weather: '多云', temp: '-1-7℃', note: '-' },
          { date: '01/23', type: '工作日', weather: '晴', temp: '-2-6℃', note: '部分快递停发' },
          { date: '01/24', type: '工作日', weather: '晴', temp: '-3-5℃', note: '-' },
          { date: '01/25', type: '周末', weather: '多云', temp: '-2-6℃', note: '-' },
          { date: '01/26', type: '工作日', weather: '阴', temp: '-3-5℃', note: '大部分快递停发' },
          { date: '01/27', type: '工作日', weather: '晴', temp: '-4-4℃', note: '年货节结束' },
        ],
        competitors: [
          { id: 1, name: '淘天', activity: '2025年年货节', startTime: '2025-01-17T00:00', endTime: '2025-01-27T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 2, name: '京东', activity: '京东年货节', startTime: '2025-01-15T00:00', endTime: '2025-01-28T23:59', source: 'AI文档解析', status: 'confirmed' },
          { id: 3, name: 'PDD', activity: '年货节特卖', startTime: '2025-01-16T00:00', endTime: '2025-01-26T23:59', source: '人工输入', status: 'pending' },
        ],
        waterLevelChart: [
          { day: '01/17', topDown: 980, bottomUp: 960, natural: 880, target: 950 },
          { day: '01/18', topDown: 1100, bottomUp: 1080, natural: 980, target: 1060 },
          { day: '01/19', topDown: 1350, bottomUp: 1320, natural: 1200, target: 1300 },
          { day: '01/20', topDown: 2680, bottomUp: 2650, natural: 2380, target: 2580 },
          { day: '01/21', topDown: 1580, bottomUp: 1550, natural: 1380, target: 1520 },
          { day: '01/22', topDown: 1280, bottomUp: 1260, natural: 1120, target: 1230 },
          { day: '01/23', topDown: 1100, bottomUp: 1080, natural: 960, target: 1060 },
          { day: '01/24', topDown: 980, bottomUp: 960, natural: 860, target: 940 },
          { day: '01/25', topDown: 920, bottomUp: 900, natural: 800, target: 880 },
          { day: '01/26', topDown: 780, bottomUp: 760, natural: 680, target: 750 },
          { day: '01/27', topDown: 680, bottomUp: 660, natural: 600, target: 650 },
        ],
      },
    };
    
    return configs[type] || configs['618'];
  };
  
  const currentConfig = getPromotionConfig(promotionType);
  const [sortType, setSortType] = useState<'budget' | 'roi'>('budget');
  const [selectedMetric, setSelectedMetric] = useState<'budget' | 'mac' | 'cac' | 'roi'>('budget');
  const [selectedDimension, setSelectedDimension] = useState<'business' | 'play' | 'audience'>('business');
  const [showFeishuModal, setShowFeishuModal] = useState<{ show: boolean; ownerName: string; businessName: string; budget: string } | null>(null);
  const [promoView, setPromoView] = useState<'budget' | 'target' | 'monitor'>('budget');
  const [targetTab, setTargetTab] = useState<'calculation' | 'reference' | 'logic'>('reference');
  const [referenceSubTab, setReferenceSubTab] = useState<'history' | 'external'>('history');
  
  // 目标测算步骤管理 - 从step1开始，逐步执行
  const [calculationStep, setCalculationStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<('pending' | 'in_progress' | 'completed')[]>([
    'in_progress', // 步骤1: 自然水位分日预测 - 初始设为进行中
    'pending', // 步骤2: 全周期/分阶段目标
    'pending', // 步骤3: 分日GMV目标
    'pending', // 步骤4: 发货GMV分日预测
    'pending', // 步骤5: 行业发货GMV分日预测
  ]);
  // 预置的Mock数据（初始为空，点击按钮后填充）
  const [naturalWaterLevelData, setNaturalWaterLevelData] = useState<{date: string; value: number}[]>([]);
  const [fullCycleTargets, setFullCycleTargets] = useState<{phase: string; startDate: string; endDate: string; aiTarget: number; manualTarget: number; status: string}[]>([]);
  const [dailyGmvTargets, setDailyGmvTargets] = useState<{date: string; phase: string; aiTarget: number; manualTarget: number; status: string}[]>([]);
  const [deliveryGmvData, setDeliveryGmvData] = useState<{date: string; value: number}[]>([]);
  const [industryDeliveryGmvData, setIndustryDeliveryGmvData] = useState<{industry: string; dates: {date: string; value: number}[]}[]>([]);
  
  // 设置一些默认的输入值
  const [currentIncrementTarget, setCurrentIncrementTarget] = useState('30');
  const [incrementGMVTarget, setIncrementGMVTarget] = useState('3570');
  const [currentBudgetPlan, setCurrentBudgetPlan] = useState('');
  const [calculatedTotalTarget, setCalculatedTotalTarget] = useState('15470');
  
  // 分日预算规划方式
  const [budgetInputMode, setBudgetInputMode] = useState<'upload' | 'dialog'>('dialog');
  const [budgetDialogInput, setBudgetDialogInput] = useState('');
  
  // BigDay配置
  const [bigDays, setBigDays] = useState<string[]>(['2026-06-18']);
  
  // 测算状态管理
  const [stepCalculated, setStepCalculated] = useState<boolean[]>([false, false, false, false, false]);
  const [stepConfigModified, setStepConfigModified] = useState<boolean[]>([false, false, false, false, false]);
  const [allStepsLocked, setAllStepsLocked] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Step5相关状态
  const [predictedGrowthRate, setPredictedGrowthRate] = useState('+15%'); // 预测的同比增速
  const [isEditingGrowth, setIsEditingGrowth] = useState(false); // 是否正在编辑同比增速
  const [growthRate, setGrowthRate] = useState(15); // 当前增速值
  const [tempGrowthRate, setTempGrowthRate] = useState(15); // 编辑时的临时值
  const [naturalWaterLevelTotal, setNaturalWaterLevelTotal] = useState(11800); // 自然水位GMV合计
  const [industryData, setIndustryData] = useState([
    { id: 1, level: '一级', name: '3C数码', expanded: true, total: 14948, preheat: 3289, outbreak: 8221, return: 3438, subIndustries: [
      { id: 11, name: '手机', target: 7474, preheat: 1579, outbreak: 4111, return: 1784 },
      { id: 12, name: '电脑整机', target: 4484, preheat: 987, outbreak: 2466, return: 1031 },
      { id: 13, name: '数码配件', target: 2990, preheat: 723, outbreak: 1644, return: 623 },
    ]},
    { id: 2, level: '一级', name: '美妆护肤', expanded: false, total: 10744, preheat: 3008, outbreak: 5372, return: 2363, subIndustries: [
      { id: 21, name: '护肤品', target: 4835, preheat: 1354, outbreak: 2417, return: 1064 },
      { id: 22, name: '彩妆', target: 3760, preheat: 1053, outbreak: 1880, return: 827 },
      { id: 23, name: '香水个护', target: 2149, preheat: 602, outbreak: 1074, return: 473 },
    ]},
    { id: 3, level: '一级', name: '家电家居', expanded: false, total: 9343, preheat: 1682, outbreak: 5793, return: 1868, subIndustries: [] },
    { id: 4, level: '一级', name: '服饰鞋包', expanded: false, total: 8408, preheat: 2102, outbreak: 4036, return: 2270, subIndustries: [] },
    { id: 5, level: '一级', name: '其他', expanded: false, total: 3271, preheat: 981, outbreak: 1145, return: 1145, subIndustries: [] },
  ]);
  
  const [sessionData, setSessionData] = useState([
    { date: '06/15', type: '小场', globalCoeff: 1.0, industryCoeff: '所有行业默认1.0', desc: '日常预热', status: 'confirmed' },
    { date: '06/16', type: '中场（3C品类日）', globalCoeff: 1.0, industryCoeff: '3C全品类：1.3\n数码配件二级赛道：1.4\n其他行业：1.0', desc: '3C品类专属补贴日', status: 'confirmed' },
    { date: '06/17', type: '中场（美妆品类日）', globalCoeff: 1.0, industryCoeff: '美妆全品类：1.2\n彩妆二级赛道：1.3\n其他行业：1.0', desc: '美妆超级品类日', status: 'confirmed' },
    { date: '06/18', type: '大场（全品类爆发）', globalCoeff: 1.3, industryCoeff: '全行业统一1.3', desc: '618主会场流量峰值、超级明星直播间', status: 'confirmed' },
    { date: '06/19', type: '中场（服饰返场日）', globalCoeff: 1.0, industryCoeff: '服饰全品类：1.15\n其他行业：1.0', desc: '服饰专属返场补贴', status: 'confirmed' },
    { date: '06/20', type: '小场', globalCoeff: 1.0, industryCoeff: '所有行业默认1.0', desc: '全品类清仓返场', status: 'confirmed' },
  ]);
  
  const [step5SubTab, setStep5SubTab] = useState<'industry' | 'session' | 'history' | 'result'>('industry');
  
  const steps = [
    { num: 1, title: '自然水位分日预测', description: '基于历史参考数据预测自然水位' },
    { num: 2, title: '全周期/分阶段目标', description: '输入增量目标，AI生成全周期目标' },
    { num: 3, title: '分日GMV目标规划', description: '输入节奏和预算规划，AI生成分日目标' },
    { num: 4, title: '发货GMV分日预测', description: '基于GMV目标预测发货情况' },
    { num: 5, title: '行业发货GMV预测', description: '分行业预测发货GMV' },
  ];
  
  const handleStartStep1 = () => {
    // 模拟AI基于历史参考进行自然水位预测 - 立即完成，便于测试
    const predictedData = [
      { date: '2026-06-15', value: 1150 },
      { date: '2026-06-16', value: 1200 },
      { date: '2026-06-17', value: 1250 },
      { date: '2026-06-18', value: 4200 },
      { date: '2026-06-19', value: 2100 },
      { date: '2026-06-20', value: 1900 },
    ];
    setNaturalWaterLevelData(predictedData);
    // 标记Step1已测算
    const newStepCalculated = [...stepCalculated];
    newStepCalculated[0] = true;
    setStepCalculated(newStepCalculated);
    setStepStatus(stepStatus.map((s, i) => i === 0 ? 'completed' : s));
    // 不自动跳转到下一步
  };
  
  // Step1 自动触发测算已禁用 - 用户需要手动点击"确认信息，开始测算"
  // useEffect(() => {
  //   if (calculationStep === 0 && !stepCalculated[0] && naturalWaterLevelData.length === 0) {
  //     // 延迟执行，确保组件已经完全渲染
  //     const timer = setTimeout(() => {
  //       handleStartStep1();
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [calculationStep, stepCalculated[0], naturalWaterLevelData.length]);
  
  const handleConfirmStep2 = () => {
    // 模拟AI生成全周期/分阶段目标 - 立即完成，便于测试
    const baseValue = parseInt(naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0).toString());
    let totalTarget;
    
    if (calculatedTotalTarget) {
      // 通过全周期GMV目标计算
      totalTarget = parseInt(calculatedTotalTarget);
    } else if (currentIncrementTarget) {
      // 通过增量百分比计算
      const increment = parseInt(currentIncrementTarget) / 100;
      totalTarget = Math.round(baseValue * (1 + increment));
    } else if (incrementGMVTarget) {
      // 通过增量GMV目标计算
      totalTarget = baseValue + parseInt(incrementGMVTarget);
    } else {
      totalTarget = baseValue;
    }
    
    const phaseTargets = [
      { phase: '预热期', startDate: '2026-06-15', endDate: '2026-06-17', aiTarget: Math.round(totalTarget * 0.30), manualTarget: Math.round(totalTarget * 0.30), status: 'confirmed' },
      { phase: '爆发期', startDate: '2026-06-18', endDate: '2026-06-18', aiTarget: Math.round(totalTarget * 0.35), manualTarget: Math.round(totalTarget * 0.35), status: 'confirmed' },
      { phase: '返场期', startDate: '2026-06-19', endDate: '2026-06-20', aiTarget: Math.round(totalTarget * 0.35), manualTarget: Math.round(totalTarget * 0.35), status: 'confirmed' },
    ];
    setFullCycleTargets(phaseTargets);
    setTargetGmv(totalTarget);
    setShowBudgetChart(false);
    // 标记Step2已测算
    const newStepCalculated = [...stepCalculated];
    newStepCalculated[1] = true;
    setStepCalculated(newStepCalculated);
    setStepStatus(stepStatus.map((s, i) => i === 1 ? 'completed' : s));
    // 不自动跳转到下一步
  };
  
  const [showBudgetChart, setShowBudgetChart] = useState(false);
  
  // 行业数据配置 - 可复用
  const industryDataConfig = {
    '3C数码': {
      payGmv: 3200,
      deliveryGmv: 2880,
      subIndustries: [
        { name: '手机', value: 1600, color: '#3B82F6' },
        { name: '电脑整机', value: 960, color: '#6366F1' },
        { name: '数码配件', value: 640, color: '#8B5CF6' }
      ]
    },
    '家电': {
      payGmv: 2450,
      deliveryGmv: 2280,
      subIndustries: [
        { name: '大家电', value: 1225, color: '#10B981' },
        { name: '小家电', value: 735, color: '#34D399' },
        { name: '厨房电器', value: 490, color: '#6EE7B7' }
      ]
    },
    '服饰': {
      payGmv: 2100,
      deliveryGmv: 1720,
      subIndustries: [
        { name: '女装', value: 1050, color: '#EC4899' },
        { name: '男装', value: 525, color: '#F472B6' },
        { name: '鞋靴', value: 525, color: '#F9A8D4' }
      ]
    },
    '食品快消': {
      payGmv: 1850,
      deliveryGmv: 1760,
      subIndustries: [
        { name: '休闲食品', value: 740, color: '#F59E0B' },
        { name: '饮料', value: 555, color: '#FBBF24' },
        { name: '生鲜', value: 555, color: '#FDE68A' }
      ]
    },
    '美妆个护': {
      payGmv: 1380,
      deliveryGmv: 1200,
      subIndustries: [
        { name: '护肤品', value: 621, color: '#8B5CF6' },
        { name: '彩妆', value: 483, color: '#A78BFA' },
        { name: '个护', value: 276, color: '#C4B5FD' }
      ]
    }
  };
  
  // 分行业数据 - 可复用
  const industryTableData = [
    { name: '3C数码', payGmv: 3200, percentage: 27.1, deliveryGmv: 2880, ratio: 90.0, growth: 15.2 },
    { name: '家电', payGmv: 2450, percentage: 20.8, deliveryGmv: 2280, ratio: 93.1, growth: 11.8 },
    { name: '服饰', payGmv: 2100, percentage: 17.8, deliveryGmv: 1720, ratio: 81.9, growth: 8.5 },
    { name: '食品快消', payGmv: 1850, percentage: 15.7, deliveryGmv: 1760, ratio: 95.1, growth: 13.4 },
    { name: '美妆个护', payGmv: 1380, percentage: 11.7, deliveryGmv: 1200, ratio: 87.0, growth: 10.2 },
    { name: '其他', payGmv: 820, percentage: 6.9, deliveryGmv: 710, ratio: 86.6, growth: 6.8 }
  ];
  
  // Step5 测算结果输出相关状态
  const [resultChartTab, setResultChartTab] = useState<'industry'>('industry');
  const [resultTableTab, setResultTableTab] = useState<'industry' | 'phase' | 'subIndustry' | 'daily' | 'delivery' | 'session'>('industry');
  const [selectedIndustryForDonut, setSelectedIndustryForDonut] = useState('3C数码');
  const [selectedDashboardIndustry, setSelectedDashboardIndustry] = useState('total'); // 'total' | '3c' | 'home' | 'beauty'
  
  // 联动状态存储
  interface SelectedPoint {
    date?: string;
    industryKey?: string;
    industryName?: string;
  }
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>({});
  
  // 右侧面板需要的明细数据结构
  interface DetailData {
    title: string;
    totalGmv: number;
    children: { name: string; value: number; ratio: string; color: string }[];
  }
  
  // Mock 数据源中枢
  interface TrendPoint { date: string; value: number; }
  interface BreakdownItem { name: string; value: number; ratio: string; color: string; }
  interface LineSeries {
    name: string;
    isMain: boolean;
    color: string;
    trendData: TrendPoint[];
  }
  interface IndustryDashboardData {
    xAxis: string[];
    series: LineSeries[];
    totalGmv: number;
    breakdown: BreakdownItem[];
  }
  
  const dashboardMockData: Record<string, IndustryDashboardData> = {
    // 大盘视角：看一级行业
    'total': {
      xAxis: ['06/15', '06/16', '06/17', '06/18', '06/19', '06/20'],
      series: [
        {
          name: '大盘总计',
          isMain: true,
          color: '#F97316',
          trendData: [
            { date: '06/15', value: 1500 }, 
            { date: '06/16', value: 1570 },
            { date: '06/17', value: 1630 },
            { date: '06/18', value: 5500 },
            { date: '06/19', value: 2845 },
            { date: '06/20', value: 1980 }
          ]
        },
        {
          name: '3C数码',
          isMain: false,
          color: '#3B82F6',
          trendData: [
            { date: '06/15', value: 410 }, 
            { date: '06/16', value: 430 },
            { date: '06/17', value: 450 },
            { date: '06/18', value: 1440 },
            { date: '06/19', value: 750 },
            { date: '06/20', value: 520 }
          ]
        },
        {
          name: '家电',
          isMain: false,
          color: '#10B981',
          trendData: [
            { date: '06/15', value: 320 }, 
            { date: '06/16', value: 340 },
            { date: '06/17', value: 360 },
            { date: '06/18', value: 1100 },
            { date: '06/19', value: 580 },
            { date: '06/20', value: 400 }
          ]
        },
        {
          name: '服饰',
          isMain: false,
          color: '#EC4899',
          trendData: [
            { date: '06/15', value: 240 }, 
            { date: '06/16', value: 260 },
            { date: '06/17', value: 280 },
            { date: '06/18', value: 900 },
            { date: '06/19', value: 460 },
            { date: '06/20', value: 320 }
          ]
        },
        {
          name: '食品快消',
          isMain: false,
          color: '#F59E0B',
          trendData: [
            { date: '06/15', value: 250 }, 
            { date: '06/16', value: 270 },
            { date: '06/17', value: 290 },
            { date: '06/18', value: 920 },
            { date: '06/19', value: 480 },
            { date: '06/20', value: 330 }
          ]
        },
        {
          name: '美妆个护',
          isMain: false,
          color: '#8B5CF6',
          trendData: [
            { date: '06/15', value: 170 }, 
            { date: '06/16', value: 180 },
            { date: '06/17', value: 190 },
            { date: '06/18', value: 640 },
            { date: '06/19', value: 345 },
            { date: '06/20', value: 230 }
          ]
        },
        {
          name: '其他',
          isMain: false,
          color: '#6B7280',
          trendData: [
            { date: '06/15', value: 110 }, 
            { date: '06/16', value: 90 },
            { date: '06/17', value: 60 },
            { date: '06/18', value: 500 },
            { date: '06/19', value: 230 },
            { date: '06/20', value: 180 }
          ]
        }
      ],
      totalGmv: 10550,
      breakdown: [
        { name: '3C数码', value: 2880, ratio: '27.3%', color: '#3B82F6' },
        { name: '家电', value: 2280, ratio: '21.6%', color: '#10B981' },
        { name: '服饰', value: 1720, ratio: '16.3%', color: '#EC4899' },
        { name: '食品快消', value: 1760, ratio: '16.7%', color: '#F59E0B' },
        { name: '美妆个护', value: 1200, ratio: '11.4%', color: '#8B5CF6' },
        { name: '其他', value: 710, ratio: '6.7%', color: '#6B7280' }
      ]
    },
    // 3C数码视角：看二级行业
    '3c': {
      xAxis: ['06/15', '06/16', '06/17', '06/18', '06/19', '06/20'],
      series: [
        {
          name: '3C数码总计',
          isMain: true,
          color: '#3B82F6',
          trendData: [
            { date: '06/15', value: 410 }, 
            { date: '06/16', value: 430 },
            { date: '06/17', value: 450 },
            { date: '06/18', value: 1440 },
            { date: '06/19', value: 750 },
            { date: '06/20', value: 520 }
          ]
        },
        {
          name: '手机',
          isMain: false,
          color: '#6366F1',
          trendData: [
            { date: '06/15', value: 260 }, 
            { date: '06/16', value: 275 },
            { date: '06/17', value: 290 },
            { date: '06/18', value: 900 },
            { date: '06/19', value: 470 },
            { date: '06/20', value: 325 }
          ]
        },
        {
          name: '电脑整机',
          isMain: false,
          color: '#8B5CF6',
          trendData: [
            { date: '06/15', value: 110 }, 
            { date: '06/16', value: 120 },
            { date: '06/17', value: 125 },
            { date: '06/18', value: 400 },
            { date: '06/19', value: 210 },
            { date: '06/20', value: 145 }
          ]
        },
        {
          name: '数码配件',
          isMain: false,
          color: '#A78BFA',
          trendData: [
            { date: '06/15', value: 40 }, 
            { date: '06/16', value: 35 },
            { date: '06/17', value: 35 },
            { date: '06/18', value: 140 },
            { date: '06/19', value: 70 },
            { date: '06/20', value: 50 }
          ]
        }
      ],
      totalGmv: 2880,
      breakdown: [
        { name: '手机', value: 1800, ratio: '62.5%', color: '#3B82F6' },
        { name: '电脑整机', value: 800, ratio: '27.8%', color: '#6366F1' },
        { name: '数码配件', value: 280, ratio: '9.7%', color: '#8B5CF6' }
      ]
    },
    // 家电视角：看二级行业
    'home': {
      xAxis: ['06/15', '06/16', '06/17', '06/18', '06/19', '06/20'],
      series: [
        {
          name: '家电总计',
          isMain: true,
          color: '#10B981',
          trendData: [
            { date: '06/15', value: 320 }, 
            { date: '06/16', value: 340 },
            { date: '06/17', value: 360 },
            { date: '06/18', value: 1100 },
            { date: '06/19', value: 580 },
            { date: '06/20', value: 400 }
          ]
        },
        {
          name: '大家电',
          isMain: false,
          color: '#34D399',
          trendData: [
            { date: '06/15', value: 160 }, 
            { date: '06/16', value: 170 },
            { date: '06/17', value: 180 },
            { date: '06/18', value: 550 },
            { date: '06/19', value: 290 },
            { date: '06/20', value: 200 }
          ]
        },
        {
          name: '小家电',
          isMain: false,
          color: '#6EE7B7',
          trendData: [
            { date: '06/15', value: 95 }, 
            { date: '06/16', value: 100 },
            { date: '06/17', value: 108 },
            { date: '06/18', value: 330 },
            { date: '06/19', value: 175 },
            { date: '06/20', value: 120 }
          ]
        },
        {
          name: '厨房电器',
          isMain: false,
          color: '#A7F3D0',
          trendData: [
            { date: '06/15', value: 65 }, 
            { date: '06/16', value: 70 },
            { date: '06/17', value: 72 },
            { date: '06/18', value: 220 },
            { date: '06/19', value: 115 },
            { date: '06/20', value: 80 }
          ]
        }
      ],
      totalGmv: 2280,
      breakdown: [
        { name: '大家电', value: 1140, ratio: '50.0%', color: '#10B981' },
        { name: '小家电', value: 684, ratio: '30.0%', color: '#34D399' },
        { name: '厨房电器', value: 456, ratio: '20.0%', color: '#6EE7B7' }
      ]
    },
    // 美妆个护视角：看二级行业
    'beauty': {
      xAxis: ['06/15', '06/16', '06/17', '06/18', '06/19', '06/20'],
      series: [
        {
          name: '美妆个护总计',
          isMain: true,
          color: '#8B5CF6',
          trendData: [
            { date: '06/15', value: 170 }, 
            { date: '06/16', value: 180 },
            { date: '06/17', value: 190 },
            { date: '06/18', value: 640 },
            { date: '06/19', value: 345 },
            { date: '06/20', value: 230 }
          ]
        },
        {
          name: '护肤品',
          isMain: false,
          color: '#A78BFA',
          trendData: [
            { date: '06/15', value: 115 }, 
            { date: '06/16', value: 120 },
            { date: '06/17', value: 130 },
            { date: '06/18', value: 430 },
            { date: '06/19', value: 230 },
            { date: '06/20', value: 155 }
          ]
        },
        {
          name: '彩妆',
          isMain: false,
          color: '#C4B5FD',
          trendData: [
            { date: '06/15', value: 55 }, 
            { date: '06/16', value: 60 },
            { date: '06/17', value: 60 },
            { date: '06/18', value: 210 },
            { date: '06/19', value: 115 },
            { date: '06/20', value: 75 }
          ]
        }
      ],
      totalGmv: 1200,
      breakdown: [
        { name: '护肤品', value: 800, ratio: '66.7%', color: '#8B5CF6' },
        { name: '彩妆', value: 400, ratio: '33.3%', color: '#A78BFA' }
      ]
    }
  };
  
  // Mock: 右侧面板渲染逻辑
  const getRightPanelData = (point: SelectedPoint): DetailData => {
    // 如果有选中的日期点，优先用日期点的数据
    if (point.industryKey && point.date) {
      const pointIndustryKey = point.industryKey === '3C数码' ? '3c' : 
                               point.industryKey === '家电' ? 'home' : 
                               point.industryKey === '美妆个护' ? 'beauty' : 'total';
      
      if (dashboardMockData[pointIndustryKey]) {
        const data = dashboardMockData[pointIndustryKey];
        return {
          title: `${point.date} - ${point.industryKey} 发货结构`,
          totalGmv: Math.round(data.totalGmv * 0.35), // 模拟单日数据
          children: data.breakdown
        };
      }
    }
    
    // 否则根据 selectedDashboardIndustry 展示数据
    const currentData = dashboardMockData[selectedDashboardIndustry] || dashboardMockData['total'];
    
    let title = '全周期 各行业发货结构';
    if (selectedDashboardIndustry === '3c') {
      title = '全周期 3C数码 发货结构';
    } else if (selectedDashboardIndustry === 'home') {
      title = '全周期 家电 发货结构';
    } else if (selectedDashboardIndustry === 'beauty') {
      title = '全周期 美妆个护 发货结构';
    }
    
    return {
      title,
      totalGmv: currentData.totalGmv,
      children: currentData.breakdown
    };
  };
  
  const handleConfirmStep3 = () => {
    // 更新折线图，显示含预算支付GMV
    setShowBudgetChart(true);
    // 同时先生成分日目标数据用于图表展示
    const totalTarget = fullCycleTargets.reduce((sum, p) => sum + p.manualTarget, 0);
    const dailyData = naturalWaterLevelData.map((d, i) => ({
      date: d.date,
      phase: d.date === '2026-06-18' ? '爆发期' : d.date <= '2026-06-17' ? '预热期' : '返场期',
      aiTarget: Math.round(totalTarget * (d.value / naturalWaterLevelData.reduce((sum, x) => sum + x.value, 0))),
      manualTarget: Math.round(totalTarget * (d.value / naturalWaterLevelData.reduce((sum, x) => sum + x.value, 0))),
      status: 'confirmed',
    }));
    setDailyGmvTargets(dailyData);
    // 标记Step3已测算
    const newStepCalculated = [...stepCalculated];
    newStepCalculated[2] = true;
    setStepCalculated(newStepCalculated);
    setStepStatus(stepStatus.map((s, i) => i === 2 ? 'completed' : s));
    // 不自动跳转到下一步
  };
  
  const handleConfirmStep4 = () => {
    // 模拟AI生成发货GMV分日预测 - 立即完成，便于测试
    const deliveryData = dailyGmvTargets.map(d => ({
      date: d.date,
      value: Math.round(d.manualTarget * 0.92),
    }));
    setDeliveryGmvData(deliveryData);
    // 标记Step4已测算
    const newStepCalculated = [...stepCalculated];
    newStepCalculated[3] = true;
    setStepCalculated(newStepCalculated);
    setStepStatus(stepStatus.map((s, i) => i === 3 ? 'completed' : s));
    // 不自动跳转到下一步
  };
  
  const handleConfirmStep5 = () => {
    // 模拟AI生成行业发货GMV分日预测 - 立即完成，便于测试
    const industryData = [
      { industry: '美妆个护', dates: [{ date: '2026-06-15', value: 250 }, { date: '2026-06-16', value: 260 }, { date: '2026-06-17', value: 270 }, { date: '2026-06-18', value: 900 }, { date: '2026-06-19', value: 450 }, { date: '2026-06-20', value: 410 }] },
      { industry: '食品快消', dates: [{ date: '2026-06-15', value: 220 }, { date: '2026-06-16', value: 230 }, { date: '2026-06-17', value: 240 }, { date: '2026-06-18', value: 800 }, { date: '2026-06-19', value: 400 }, { date: '2026-06-20', value: 360 }] },
      { industry: '服饰', dates: [{ date: '2026-06-15', value: 200 }, { date: '2026-06-16', value: 210 }, { date: '2026-06-17', value: 220 }, { date: '2026-06-18', value: 750 }, { date: '2026-06-19', value: 375 }, { date: '2026-06-20', value: 340 }] },
      { industry: '3C数码', dates: [{ date: '2026-06-15', value: 180 }, { date: '2026-06-16', value: 190 }, { date: '2026-06-17', value: 200 }, { date: '2026-06-18', value: 680 }, { date: '2026-06-19', value: 340 }, { date: '2026-06-20', value: 310 }] },
    ];
    setIndustryDeliveryGmvData(industryData);
    // 标记Step5已测算
    const newStepCalculated = [...stepCalculated];
    newStepCalculated[4] = true;
    setStepCalculated(newStepCalculated);
    setStepStatus(stepStatus.map((s, i) => i === 4 ? 'completed' : s));
    // 不自动锁定，等待用户点击"确认并锁定全链路目标"
  };

  const handleLockAllSteps = () => {
    // 锁定所有步骤
    setAllStepsLocked(true);
    setStepStatus(stepStatus.map((s, i) => i === 4 ? 'completed' : s));
  };
  
  const handleGoToNextStep = (stepIndex: number) => {
    if (stepIndex === 4 && allStepsLocked) return;
    // 检查配置是否已修改，如果已修改需要提示先重新测算
    if (stepConfigModified[stepIndex]) {
      alert('配置已变更，请先重新测算再继续');
      return;
    }
    // 进入下一步
    const nextStep = stepIndex + 1;
    setCalculationStep(nextStep);
    setStepStatus(stepStatus.map((s, i) => {
      if (i === stepIndex) return 'completed';
      if (i === nextStep) return 'in_progress';
      if (i < nextStep) return 'completed';
      return 'pending';
    }));
  };
  
  const handleRecalculate = (stepIndex: number) => {
    // 根据步骤调用对应的测算函数
    switch(stepIndex) {
      case 0:
        handleStartStep1();
        break;
      case 1:
        handleConfirmStep2();
        break;
      case 2:
        setShowBudgetChart(false);
        handleConfirmStep3();
        break;
      case 3:
        handleConfirmStep4();
        break;
      case 4:
        handleConfirmStep5();
        break;
    }
    // 重置配置修改标记
    const newConfigModified = [...stepConfigModified];
    newConfigModified[stepIndex] = false;
    setStepConfigModified(newConfigModified);
  };

  const handleGoBack = () => {
    if (calculationStep > 0) {
      const newStep = calculationStep - 1;
      setCalculationStep(newStep);
      setStepStatus(stepStatus.map((s, i) => {
        if (i === newStep) return 'in_progress';
        if (i < newStep) return 'completed';
        return 'pending';
      }));
    }
  };
  
  const handleGrowthRateSave = () => {
    setGrowthRate(tempGrowthRate);
    setPredictedGrowthRate(`+${tempGrowthRate}%`);
    setIsEditingGrowth(false);
    
    // 如果已经完成测算，重新计算自然水位GMV
    if (stepCalculated[0]) {
      const baseValue = naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0);
      const newTotal = Math.round(baseValue * (1 + tempGrowthRate / 100));
      setNaturalWaterLevelTotal(newTotal);
    }
  };
  
  const handleGoToStep = (targetStep: number) => {
    // 如果点击的是当前步骤，不做任何操作
    if (targetStep === calculationStep) return;
    
    // 更新当前步骤
    setCalculationStep(targetStep);
    
    // 更新步骤状态：保持已完成步骤的状态，目标步骤设为 in_progress，之后的步骤保持原样
    const newStepStatus = stepStatus.map((status, index) => {
      if (index < targetStep) {
        // 之前的步骤保持原有状态（completed）
        return status;
      } else if (index === targetStep) {
        // 目标步骤设为 in_progress
        return 'in_progress';
      } else {
        // 之后的步骤保持原有状态
        return status;
      }
    });
    setStepStatus(newStepStatus);
    
    // 不清空数据，保持已有的测算结果
  };
  
  // 竞对活动相关状态
  const [competitors, setCompetitors] = useState([
    { id: 1, name: '淘天', activity: '2026年618年中大促', startTime: '2026-06-15T00:00', endTime: '2026-06-20T23:59', source: 'AI文档解析', status: 'confirmed' },
    { id: 2, name: 'PDD', activity: '618百亿补贴专场', startTime: '2026-06-17T00:00', endTime: '2026-06-19T23:59', source: 'AI文档解析', status: 'pending' },
    { id: 3, name: '京东', activity: '618店庆日', startTime: '2026-06-18T00:00', endTime: '2026-06-18T23:59', source: '人工输入', status: 'incomplete' },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', activity: '', startTime: '', endTime: '', source: '', status: '' });
  
  const handleEdit = (comp: any) => {
    setEditingId(comp.id);
    setEditForm({ name: comp.name, activity: comp.activity, startTime: comp.startTime, endTime: comp.endTime, source: comp.source, status: comp.status });
  };
  
  const handleSave = () => {
    setCompetitors(competitors.map(c => c.id === editingId ? { ...c, ...editForm } : c));
    setEditingId(null);
  };
  
  const handleCancel = () => {
    setEditingId(null);
  };
  
  const competitorOptions = ['淘天', 'PDD', '京东', '快手', '视频号电商'];
  
  // 本次大促规划相关状态
  const [incrementType, setIncrementType] = useState<'percentage' | 'total'>('percentage');
  const [incrementValue, setIncrementValue] = useState('30');
  const [totalTarget, setTotalTarget] = useState('12000');
  const [phases, setPhases] = useState([
    { id: 1, name: '预热期', startDate: '2026-06-15', endDate: '2026-06-17', isBigDay: false, aiTarget: 3600, manualTarget: 3600, status: 'confirmed' },
    { id: 2, name: '爆发期', startDate: '2026-06-18', endDate: '2026-06-18', isBigDay: true, aiTarget: 4200, manualTarget: 4300, status: 'modified' },
    { id: 3, name: '返场期', startDate: '2026-06-19', endDate: '2026-06-20', isBigDay: false, aiTarget: 4000, manualTarget: 4100, status: 'modified' },
  ]);
  const [dailyTargets, setDailyTargets] = useState([
    { date: '2026-06-15', phase: '预热期', aiTarget: 1150, manualTarget: 1150, status: 'confirmed' },
    { date: '2026-06-16', phase: '预热期', aiTarget: 1200, manualTarget: 1200, status: 'confirmed' },
    { date: '2026-06-17', phase: '预热期', aiTarget: 1250, manualTarget: 1250, status: 'confirmed' },
    { date: '2026-06-18', phase: '爆发期', aiTarget: 4200, manualTarget: 4300, status: 'modified' },
    { date: '2026-06-19', phase: '返场期', aiTarget: 2100, manualTarget: 2150, status: 'modified' },
    { date: '2026-06-20', phase: '返场期', aiTarget: 1900, manualTarget: 1950, status: 'modified' },
  ]);
  const [baselineGmv, setBaselineGmv] = useState('9200');
  const [aiTotalTarget, setAiTotalTarget] = useState('11800');
  const [editingPhase, setEditingPhase] = useState<number | null>(null);
  const [editingDaily, setEditingDaily] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isCalculationComplete, setIsCalculationComplete] = useState(true);
  const [totalBudget, setTotalBudget] = useState('8000');
  const [targetGmv, setTargetGmv] = useState(15470);
  const [settlementRate, setSettlementRate] = useState(85.2);
  
  // Step 2 优化：增量目标相关状态
  const [focusedInput, setFocusedInput] = useState<'percentage' | 'gmv' | 'total' | null>(null);
  const [step2GrowthPercentage, setStep2GrowthPercentage] = useState<string>('30');
  const [step2GrowthGMV, setStep2GrowthGMV] = useState<string>('3540');
  const [step2TotalGMV, setStep2TotalGMV] = useState<string>('15340');
  const syncingFrom = useRef<'step2' | 'target' | null>(null);
  
  // Step 2：三个输入框的联动逻辑
  useEffect(() => {
    // 如果正在从 target 同步回来，则跳过
    if (syncingFrom.current === 'target') {
      syncingFrom.current = null;
      return;
    }
    
    const baseValue = naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0);
    
    if (focusedInput === 'percentage' && step2GrowthPercentage) {
      const percentage = parseFloat(step2GrowthPercentage);
      const growthGMV = Math.round(baseValue * (percentage / 100));
      const totalGMV = baseValue + growthGMV;
      
      // 避免无限循环
      if (step2GrowthGMV !== growthGMV.toString()) {
        setStep2GrowthGMV(growthGMV.toString());
      }
      if (step2TotalGMV !== totalGMV.toString()) {
        setStep2TotalGMV(totalGMV.toString());
      }
      // 同步到目标 GMV 卡片
      if (targetGmv !== totalGMV) {
        syncingFrom.current = 'step2';
        setTargetGmv(totalGMV);
      }
    } else if (focusedInput === 'gmv' && step2GrowthGMV) {
      const growthGMV = parseFloat(step2GrowthGMV);
      const percentage = Math.round((growthGMV / baseValue) * 100);
      const totalGMV = baseValue + growthGMV;
      
      if (step2GrowthPercentage !== percentage.toString()) {
        setStep2GrowthPercentage(percentage.toString());
      }
      if (step2TotalGMV !== totalGMV.toString()) {
        setStep2TotalGMV(totalGMV.toString());
      }
      // 同步到目标 GMV 卡片
      if (targetGmv !== totalGMV) {
        syncingFrom.current = 'step2';
        setTargetGmv(totalGMV);
      }
    } else if (focusedInput === 'total' && step2TotalGMV) {
      const totalGMV = parseFloat(step2TotalGMV);
      const growthGMV = totalGMV - baseValue;
      const percentage = Math.round((growthGMV / baseValue) * 100);
      
      if (step2GrowthPercentage !== percentage.toString()) {
        setStep2GrowthPercentage(percentage.toString());
      }
      if (step2GrowthGMV !== growthGMV.toString()) {
        setStep2GrowthGMV(growthGMV.toString());
      }
      // 同步到目标 GMV 卡片
      if (targetGmv !== totalGMV) {
        syncingFrom.current = 'step2';
        setTargetGmv(totalGMV);
      }
    }
  }, [focusedInput, step2GrowthPercentage, step2GrowthGMV, step2TotalGMV, naturalWaterLevelData]);
  
  // 目标 GMV 卡片联动回步骤2的逻辑
  useEffect(() => {
    // 如果正在从 step2 同步过来，则跳过
    if (syncingFrom.current === 'step2') {
      syncingFrom.current = null;
      return;
    }
    
    const baseValue = naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0);
    const totalGMV = targetGmv;
    const growthGMV = totalGMV - baseValue;
    const percentage = Math.round((growthGMV / baseValue) * 100);
    
    // 只有当 focus 不在步骤2的输入框时，才从右侧同步回左侧
    if (focusedInput === null) {
      if (step2TotalGMV !== totalGMV.toString()) {
        syncingFrom.current = 'target';
        setStep2TotalGMV(totalGMV.toString());
      }
      if (step2GrowthGMV !== growthGMV.toString()) {
        syncingFrom.current = 'target';
        setStep2GrowthGMV(growthGMV.toString());
      }
      if (step2GrowthPercentage !== percentage.toString()) {
        syncingFrom.current = 'target';
        setStep2GrowthPercentage(percentage.toString());
      }
    }
  }, [targetGmv, focusedInput, step2TotalGMV, step2GrowthGMV, step2GrowthPercentage, naturalWaterLevelData]);
  
  const handleStartCalculation = () => {
    setIsCalculationComplete(false);
    setTimeout(() => {
      setIsCalculationComplete(true);
      const baseGmv = parseInt(baselineGmv);
      const increment = incrementType === 'percentage' ? parseInt(incrementValue) / 100 : (parseInt(totalTarget) - baseGmv) / baseGmv;
      const aiTotal = Math.round(baseGmv * (1 + increment));
      setAiTotalTarget(aiTotal.toString());
      const phaseTargets = phases.map(p => ({
        ...p,
        aiTarget: Math.round(aiTotal * (p.id === 1 ? 0.3 : p.id === 2 ? 0.35 : 0.35)),
        manualTarget: Math.round(aiTotal * (p.id === 1 ? 0.3 : p.id === 2 ? 0.35 : 0.35)),
        status: 'confirmed' as const,
      }));
      setPhases(phaseTargets);
      const dailyDistribution = [0.095, 0.10, 0.105, 0.35, 0.175, 0.175];
      setDailyTargets(dailyTargets.map((d, i) => ({
        ...d,
        aiTarget: Math.round(aiTotal * dailyDistribution[i]),
        manualTarget: Math.round(aiTotal * dailyDistribution[i]),
        status: 'confirmed' as const,
      })));
    }, 1000);
  };
  
  const handleConfirmAll = () => {
    setPhases(phases.map(p => ({ ...p, status: 'confirmed' as const })));
    setDailyTargets(dailyTargets.map(d => ({ ...d, status: 'confirmed' as const })));
  };
  
  const handleSaveEdit = (type: 'phase' | 'daily') => {
    if (type === 'phase' && editingPhase !== null) {
      const newValue = parseInt(editValue);
      setPhases(phases.map(p => p.id === editingPhase ? { ...p, manualTarget: newValue, status: 'modified' } : p));
      const totalManual = phases.reduce((sum, p) => sum + (p.id === editingPhase ? newValue : p.manualTarget), 0);
      setTotalTarget(totalManual.toString());
      setEditingPhase(null);
    } else if (type === 'daily' && editingDaily !== null) {
      const newValue = parseInt(editValue);
      setDailyTargets(dailyTargets.map((d, i) => i === editingDaily ? { ...d, manualTarget: newValue, status: 'modified' } : d));
      setEditingDaily(null);
    }
    setEditValue('');
  };
  
  const handleCancelEdit = () => {
    setEditingPhase(null);
    setEditingDaily(null);
    setEditValue('');
  };
  
  const handleRestoreOriginal = () => {
    setPhases(phases.map(p => ({ ...p, manualTarget: p.aiTarget, status: 'confirmed' })));
    setDailyTargets(dailyTargets.map(d => ({ ...d, manualTarget: d.aiTarget, status: 'confirmed' })));
    setTotalTarget(aiTotalTarget);
  };
  
  const getTotalManualTarget = () => {
    return phases.reduce((sum, p) => sum + p.manualTarget, 0);
  };
  
  // 版本控制相关状态
  const [currentVersion, setCurrentVersion] = useState('V2.2');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [viewingHistoryVersion, setViewingHistoryVersion] = useState('');
  const [versionHistory, setVersionHistory] = useState([
    { 
      version: 'V2.2', 
      operator: '秦娇芸（资管）', 
      time: '2026-10-15 17:05', 
      type: '版本回退', 
      description: '回退至历史版本V1.2',
      status: 'active'
    },
    { 
      version: 'V2.0', 
      operator: '秦娇芸（资管）', 
      time: '2026-10-15 16:32', 
      type: '目标下发', 
      description: '最终目标下发至大小中台、大促组确认',
      status: 'history'
    },
    { 
      version: 'V1.3', 
      operator: '系统', 
      time: '2026-10-15 16:18', 
      type: '调整申请通过', 
      description: '3C行业目标上调5%申请审批通过',
      status: 'history'
    },
    { 
      version: 'V1.2', 
      operator: '秦娇芸（资管）', 
      time: '2026-10-15 15:47', 
      type: '人工修改数值', 
      description: '调整双11当天大盘发货GMV目标从9800万上调至1.02亿',
      status: 'history'
    },
    { 
      version: 'V1.1', 
      operator: '大促AI助手', 
      time: '2026-10-15 15:22', 
      type: 'AI测算生成', 
      description: '基于2025年双11可比周期完成全链路目标测算',
      status: 'history'
    },
    { 
      version: 'V1.0', 
      operator: '秦娇芸（资管）', 
      time: '2026-10-15 15:05', 
      type: '信息导入', 
      description: '从目标侧AI需求database导入基础配置信息',
      status: 'history'
    },
  ]);
  
  // 操作类型标签颜色映射
  const getOperationTypeColor = (type: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      '信息导入': { bg: '#F5F5F5', text: '#424242' },
      '配置更新': { bg: '#F5F5F5', text: '#424242' },
      'AI测算生成': { bg: '#E3F2FD', text: '#1565C0' },
      'AI重新校准': { bg: '#E3F2FD', text: '#1565C0' },
      '人工修改数值': { bg: '#FFF3E0', text: '#EF6C00' },
      '阶段目标调整': { bg: '#FFF3E0', text: '#EF6C00' },
      '调整申请通过': { bg: '#E8F5E9', text: '#2E7D32' },
      '调整申请驳回': { bg: '#FFEBEE', text: '#C62828' },
      '目标下发': { bg: '#EDE7F6', text: '#7B1FA2' },
      '上传CRM': { bg: '#E8F5E9', text: '#2E7D32' },
      '版本回退': { bg: '#F5F5F5', text: '#424242' },
    };
    return colorMap[type] || { bg: '#F5F5F5', text: '#424242' };
  };
  
  // 切换版本
  const switchVersion = (version: string) => {
    const targetVersion = versionHistory.find(v => v.version === version);
    if (targetVersion && targetVersion.status !== 'active') {
      setCurrentVersion(version);
      setViewingHistoryVersion(version);
      setIsViewingHistory(true);
      setShowVersionHistory(false);
    }
  };
  
  // 导出飞书文档相关状态
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [feishuDocUrl, setFeishuDocUrl] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);
  
  // 版本回退相关状态
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);
  const [rollbackTargetVersion, setRollbackTargetVersion] = useState('');
  const [newRollbackVersion, setNewRollbackVersion] = useState('');
  
  // 分享功能相关状态
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareExpiry, setShareExpiry] = useState('7');
  const [shareType, setShareType] = useState<'view' | 'edit'>('view');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // 导出功能相关状态
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'ppt'>('pdf');
  const [exportModules, setExportModules] = useState({
    overview: true,
    prediction: true,
    breakdown: true,
  });
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [reportExportSuccess, setReportExportSuccess] = useState(false);
  
  // 导出为飞书文档
  const exportToFeishu = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    // 模拟生成飞书文档（实际调用飞书API）
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟文档链接
    const docUrl = `https://.feishu.cn/docx/${Date.now()}`;
    setFeishuDocUrl(docUrl);
    setExportSuccess(true);
    setIsExporting(false);
    
    // 3秒后自动关闭提示
    setTimeout(() => {
      setExportSuccess(false);
    }, 5000);
  };
  
  // 生成分享链接
  const generateShareLink = async () => {
    setIsGeneratingLink(true);
    
    // 模拟生成分享链接（实际调用后端API）
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟分享链接
    const link = `https://peng-khaki.vercel.app/share/${Date.now().toString(36).toUpperCase()}`;
    setShareLink(link);
    setIsGeneratingLink(false);
  };
  
  // 复制链接到剪贴板
  const copyShareLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // 版本回退函数
  const rollbackToVersion = (version: string) => {
    setRollbackTargetVersion(version);
    setShowRollbackConfirm(true);
  };
  
  // 确认回退
  const confirmRollback = () => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 生成新版本号
    const versionMatch = currentVersion.match(/V(\d+)\.(\d+)/);
    let newVersionMajor = 2;
    let newVersionMinor = 1;
    if (versionMatch) {
      newVersionMajor = parseInt(versionMatch[1]);
      newVersionMinor = parseInt(versionMatch[2]) + 1;
    }
    const newVersion = `V${newVersionMajor}.${newVersionMinor}`;
    
    // 添加新的版本记录
    const newRecord = {
      version: newVersion,
      operator: '秦娇芸（资管）',
      time: timeStr,
      type: '版本回退' as const,
      description: `回退至历史版本${rollbackTargetVersion}`,
      status: 'active' as const
    };
    
    // 更新版本列表
    setVersionHistory([
      newRecord,
      ...versionHistory.map(v => ({ ...v, status: 'history' as const }))
    ]);
    
    // 关闭确认弹窗
    setShowRollbackConfirm(false);
    
    // 返回最新版本视图
    setCurrentVersion(newVersion);
    setNewRollbackVersion(newVersion);
    setIsViewingHistory(false);
    
    // 显示成功提示
    setRollbackSuccess(true);
    setTimeout(() => {
      setRollbackSuccess(false);
    }, 3000);
  };
  
  // 点击外部关闭导出成功提示
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportSuccess(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [channelDetailExpanded, setChannelDetailExpanded] = useState(false);
  const [versionCompareOpen, setVersionCompareOpen] = useState(false);
  const [promoBudgets, setPromoBudgets] = useState<Record<string, number>>({
    '消费券': 220, '重点类目追补': 180, 'toB商达预算': 120, '用户运营': 100, '货架场': 80, '市场宣发': 40, '创新玩法预留': 20,
  });
  const [budgetSubTab, setBudgetSubTab] = useState<'overall' | 'coupon' | 'supplement'>('overall');

  // 行业相关状态和数据
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['大盘']);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const industryList = ['大盘', '3C数码', '家电', '服饰', '食品快消', '美妆个护', '其他'];
  const industryDropdownRef = useRef<HTMLDivElement>(null);
  
  // 行业颜色映射
  const industryColors: Record<string, string> = {
    '大盘': '#F97316',
    '3C数码': '#3B82F6',
    '家电': '#10B981',
    '服饰': '#8B5CF6',
    '食品快消': '#EC4899',
    '美妆个护': '#F59E0B',
    '其他': '#6B7280'
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setShowIndustryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 各行业分日发货GMV模拟数据
  const industryDailyData = {
    '3C数码': [90, 100, 110, 125, 150, 160, 175, 220, 300],
    '家电': [72, 80, 88, 100, 120, 130, 140, 175, 240],
    '服饰': [54, 60, 68, 78, 95, 102, 112, 135, 180],
    '食品快消': [56, 62, 70, 80, 98, 106, 116, 140, 188],
    '美妆个护': [38, 42, 48, 56, 68, 74, 82, 100, 135],
    '其他': [26, 30, 34, 40, 48, 52, 58, 68, 90],
  };
  
  // 计算选中行业的分日发货GMV数据 - 返回每条行业数据
  const calculateIndustryChartData = () => {
    const days = ['10/20', '10/23', '10/26', '10/29', '11/01', '11/04', '11/07', '11/09', '11/11'];
    const overallData = [306, 346, 386, 442, 516, 558, 605, 698, 945];
    
    if (selectedIndustries.includes('大盘')) {
      return days.map((day, index) => ({
        day,
        '大盘': overallData[index]
      }));
    }
    
    return days.map((day, index) => {
      const data: any = { day };
      selectedIndustries.forEach(industry => {
        if (industryDailyData[industry as keyof typeof industryDailyData]) {
          data[industry] = industryDailyData[industry as keyof typeof industryDailyData][index];
        }
      });
      return data;
    });
  };

  const negativeTop5 = [
    { name: '[1128] 电梯渠道测试集成 0127 曝光10%', value: -7500000 },
    { name: '[2239] 重要路径策略联动 0210', value: -2000000 },
    { name: '平台-内容分发策略-沉淀-28M2-用户首篇激励2022', value: -1800000 },
    { name: '平台-内容分发策略-沉淀-28M2-用户首篇激励0122', value: -1500000 },
    { name: '渠道联动-模型验证-20220629-测试', value: -1200000 },
  ];

  const positiveTop5 = [
    { name: '抖音-平台用户首篇激励-沉淀-28M1-用户首篇激励0130', value: 4800000 },
    { name: '[1128] 新用户push消息意图识别增强 0128 单组10%', value: 4200000 },
    { name: '抖音电商混资券-双端流失扩盘虚拟行业20260219-冲量', value: 3900000 },
    { name: '抖音-平台用增-平台流失-立减-26M2-用增长跑量实验0212', value: 3800000 },
    { name: '抖音-平台用增-平台流失-立减-26M2-用增长跑量实验0212', value: 3500000 },
  ];
  
  const scatterData = [
    { x: 450000, y: 0.8, z: 100, type: '核心出血点', fill: '#EF4444' },
    { x: 520000, y: 0.6, z: 120, type: '核心出血点', fill: '#EF4444' },
    { x: 380000, y: 0.9, z: 80, type: '核心出血点', fill: '#EF4444' },
    { x: 600000, y: 0.5, z: 150, type: '核心出血点', fill: '#EF4444' },
    { x: 420000, y: 0.7, z: 90, type: '核心出血点', fill: '#EF4444' },
    { x: 550000, y: 2.5, z: 130, type: '明星策略', fill: '#F59E0B' },
    { x: 700000, y: 3.2, z: 180, type: '明星策略', fill: '#F59E0B' },
    { x: 480000, y: 2.8, z: 110, type: '明星策略', fill: '#F59E0B' },
    { x: 620000, y: 3.5, z: 160, type: '明星策略', fill: '#F59E0B' },
    { x: 510000, y: 2.1, z: 100, type: '明星策略', fill: '#F59E0B' },
    { x: 50000, y: 0.5, z: 30, type: '长尾低效', fill: '#9CA3AF' },
    { x: 80000, y: 0.7, z: 40, type: '长尾低效', fill: '#9CA3AF' },
    { x: 30000, y: 0.4, z: 20, type: '长尾低效', fill: '#9CA3AF' },
    { x: 60000, y: 0.9, z: 35, type: '长尾低效', fill: '#9CA3AF' },
    { x: 90000, y: 0.6, z: 45, type: '长尾低效', fill: '#9CA3AF' },
    { x: 60000, y: 3.5, z: 35, type: '潜力策略', fill: '#10B981' },
    { x: 90000, y: 4.0, z: 50, type: '潜力策略', fill: '#10B981' },
    { x: 40000, y: 2.9, z: 25, type: '潜力策略', fill: '#10B981' },
    { x: 70000, y: 3.8, z: 40, type: '潜力策略', fill: '#10B981' },
    { x: 85000, y: 2.2, z: 45, type: '潜力策略', fill: '#10B981' },
  ];

  // Mock data for the chart
  const data = [
    { name: '平台流失', budget: 38.9, roi: 1.16 },
    { name: '品类增长', budget: 11.5, roi: 1.9 },
    { name: '平台拉新', budget: 10.2, roi: 1.3 },
    { name: '防流失', budget: 4.8, roi: 0.1 },
    { name: '低消女性', budget: 4.5, roi: 4.0 },
    { name: '年轻男性', budget: 4.2, roi: 1.2 },
    { name: 'MAC质量', budget: 3.8, roi: 4.3 },
    { name: '基础产品', budget: 3.6, roi: 1.2 },
    { name: '中高消女性', budget: 3.5, roi: 2.2 },
    { name: '场景增长', budget: 3.2, roi: 0.9 },
    { name: '低渗透地区', budget: 2.8, roi: 0.3 },
    { name: '平台流失365', budget: 1.8, roi: 1.2 },
    { name: '年长男性', budget: 0.8, roi: 0.5 },
    { name: '重点地区', budget: 0.4, roi: 2.7 },
  ];

  const sortedData = [...data].sort((a, b) => {
    if (sortType === 'budget') return b.budget - a.budget;
    return b.roi - a.roi;
  });
  
  // Render logic for "Rate Attribution" (费率波动归因)
  if (reportType === 'rate_attribution') {
    // 原始数据（不包含总计）
    const rawData = [
        { name: '平台用增', value: 0.25 },
        { name: '独立端', value: 0.15 },
        { name: '平台活动', value: 0.1 },
        { name: '治理体验', value: 0.1 },
        { name: '整合营销', value: 0.08 },
        { name: '商城', value: 0.05 },
        { name: '内容生态', value: 0.02 },
        { name: '千川', value: -0.02 },
        { name: '搜索', value: -0.05 },
        { name: '行业游资', value: -0.05 },
        { name: '履约配送', value: -0.13 },
    ];

    // 按照贡献度绝对值从大到小排序
    const sortedData = [...rawData].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    // 转换为标准柱状图数据（不再需要 waterfall 的 start/end，因为只展示相对贡献度）
    const chartData = sortedData.map(item => ({
        name: item.name,
        value: item.value,
        isTotal: false
    }));

    return (
        <div className="h-full flex flex-col bg-[#f5f6f7]">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h1 className="text-lg font-bold text-gray-800">指标波动归因分析报告</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" /> 分享
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> 下载
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Conclusion Summary */}
                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                         <div className="flex items-center gap-2 mb-4 text-purple-700">
                             <Lightbulb className="w-5 h-5" />
                             <h2 className="text-lg font-bold text-gray-900">结论摘要</h2>
                         </div>
                         <p className="text-gray-700 leading-relaxed bg-purple-50/50 p-4 rounded-lg border border-purple-100 text-sm">
                             整体来看，本周费率较上周<strong className="text-red-600 font-bold">上升 0.5%</strong>（从 4.2% 升至 4.7%）。从各业务线贡献度来看，<strong className="text-red-600 font-bold">平台用增（+0.25%）</strong>和<strong className="text-red-600 font-bold">独立端（+0.15%）</strong>是拉高大盘费率的主要业务线。部分涨幅被<strong className="text-green-600 font-bold">履约配送（-0.13%）</strong>费率的优化所抵消。
                         </p>
                     </div>

                    {/* Attribution Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart2 className="w-5 h-5 text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">各业务线对费率变动的贡献度拆解</h2>
                        </div>
                        <div className="h-80 w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 10, fill: '#6B7280' }} 
                                        axisLine={{ stroke: '#D1D5DB' }} 
                                        tickLine={false} 
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                    />
                                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val.toFixed(2)}%`} />
                                    <Tooltip 
                                        formatter={(value: any, name: any, props: any) => {
                                            const val = props.payload.value;
                                            return [`${val > 0 ? '+' : ''}${val}%`, '贡献度'];
                                        }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <ReferenceLine y={0} stroke="#9CA3AF" />
                                    <Bar dataKey="value" barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#EF4444' : '#10B981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-sm"></div>费率恶化 (贡献度为正)</div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div>费率优化 (贡献度为负)</div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">详细业务线解读</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    平台用增 (贡献度: +0.25%)
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    受大促前夕竞价激烈影响，拉新成本显著上升。上周针对下沉市场开展了专项补贴活动，导致单客获取成本（CAC）超出预期，对大盘费率产生了最大的上行压力。
                                </p>
                            </div>
                            <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    独立端 (贡献度: +0.15%)
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    独立端为了冲刺本月DAU目标，加大了应用商店买量和激励视频广告的投放预算。虽然流量规模达标，但转化率（CVR）略有下滑，导致该业务线费率出现恶化。
                                </p>
                            </div>
                            <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                                <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    履约配送 (贡献度: -0.13%)
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    得益于近期推出的“智能拼单”和“集约化配送”策略，履约成本得到有效控制。物流环节的效率提升对整体费率起到了显著的下拉优化作用，部分缓冲了前端营销成本的上升。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // Mock data for manager brief data evidence
  const mockCommissionData = [
    { month: '7月', rate: 10.5 },
    { month: '8月', rate: 11.2 },
    { month: '9月', rate: 11.8 },
    { month: '10月', rate: 12.5 },
  ];
  const mockCpmData = [
    { month: '7月', cpm: 45 },
    { month: '8月', cpm: 48 },
    { month: '9月', cpm: 52 },
    { month: '10月', cpm: 60 },
  ];

  // 业务方向枚举值
  const businessDirections = [
    '低渗透地区', '体验增长', '年轻男性', '年长男性', '中高消女性', 
    '低消女性', '流失365', '品类增长', '场景增长', '防流失', 
    '平台拉新', '平台流失', 'MAC质量'
  ];

  // 玩法策略枚举值
  const playStrategies = [
    '运费立减', '货补', '立减', '退换货包邮', '站内投放', '防流失', 
    '满减', 'DAC券包', '老客券包', '省钱卡', '触达', 'MAC补贴', 
    '厂商触达', '品类提频复购', '品类mac券包', '品类营销', 
    '品类gmv探索', '国补', '搜索流失', '搜索老客', '搜索投放', 
    '财经', '膨胀券', '运费', '混资', '站外投放', '用增卡', 
    '异形卡', '单单返', '成长券包', '短视频锚点'
  ];

  // 人群枚举值
  const audiences = [
    '年轻低消男性', '年轻低消女性', '年轻高消男性', '年轻高消女性', 
    '年长低消男性', '年长低消女性', '年长高消男性', '年长高消女性'
  ];

  // 模拟数据 - 按业务方向
  const mockBusinessData = {
    budget: businessDirections.map((name, i) => ({ name, value: 25 - i * 1.5 })),
    mac: businessDirections.map((name, i) => ({ name, value: 20 - i * 1.2 })),
    cac: businessDirections.map((name, i) => ({ name, value: 15 - i * 0.8 })),
    roi: businessDirections.map((name, i) => ({ name, value: 18 - i * 1.0 }))
  };

  // 模拟数据 - 按玩法策略
  const mockPlayData = {
    budget: playStrategies.slice(0, 10).map((name, i) => ({ name, value: 18 - i * 1.2 })),
    mac: playStrategies.slice(0, 10).map((name, i) => ({ name, value: 15 - i * 1.0 })),
    cac: playStrategies.slice(0, 10).map((name, i) => ({ name, value: 12 - i * 0.7 })),
    roi: playStrategies.slice(0, 10).map((name, i) => ({ name, value: 14 - i * 0.9 }))
  };

  // 模拟数据 - 按人群
  const mockAudienceData = {
    budget: audiences.map((name, i) => ({ name, value: 30 - i * 3.0 })),
    mac: audiences.map((name, i) => ({ name, value: 25 - i * 2.5 })),
    cac: audiences.map((name, i) => ({ name, value: 20 - i * 1.8 })),
    roi: audiences.map((name, i) => ({ name, value: 22 - i * 2.0 }))
  };

  // Render logic for "Budget Attribution" (预算钱效指标归因)
  if (reportType === 'budget_attribution') {
    return (
      <div className="flex flex-col h-full bg-[#f8f9fc] border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
        {/* Top Nav */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
           <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-inner">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">平台用增 经营钱效简报</h2>
                        
                        {/* 时间筛选器 */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">统计周期：</span>
                                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-xs">
                                    <option>最近自然周 (2026.03.16-2026.03.22)</option>
                                    <option>近7天</option>
                                    <option>近30天</option>
                                    <option>本季度</option>
                                    <option>自定义</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">对比周期：</span>
                                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-xs">
                                    <option>上周自然周 (2026.03.09-2026.03.15)</option>
                                    <option>上一周期</option>
                                    <option>去年同期</option>
                                    <option>自定义</option>
                                </select>
                            </div>
                            <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors">
                                应用
                            </button>
                        </div>
                    </div>
                </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="分享">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="下载">
                <Download className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">


            <div className="mx-auto pb-12 space-y-6">
                {/* 0. 整体结论 */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-800">整体结论总览</h2>
                    </div>
                    <div className="space-y-3">
                        {/* 核心指标归因 */}
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                            <p className="text-sm text-gray-700"><strong>核心指标归因：</strong>低渗透地区拉新带动增量 MAC 超预期 32% 完成，但该区域高补贴、运费立减等低 ROI 玩法占比过高，直接推高 CAC、拉低 ROI 未达目标</p>
                        </div>
                        {/* 钱效风险管控 */}
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 inline"><strong>钱效风险管控：</strong>平台流失、防流失、低渗透地区3类业务 ROI 均低于 1.5 且处于高风险区间，需立即复盘低效原因</p>
                                <button className="ml-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium">
                                    下发复盘任务
                                </button>
                            </div>
                        </div>
                        {/* 预算调配建议 */}
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 inline"><strong>预算调配建议：</strong>低消女性、MAC质量、中高消女性三类人群ROI稳定&gt;2.2，建议从低ROI业务腾挪1000万预算追加，预计增量GMV提升11.26%</p>
                                <button className="ml-3 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-medium">
                                    去调配项目预算
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. 业务目标达成情况 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-gray-800" />
                        <h2 className="text-lg font-bold text-gray-800">一、业务目标达成情况</h2>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                        {/* 卡片 1: 预算消耗 */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">超进度</div>
                            <p className="text-sm text-gray-500 mb-1">预算消耗</p>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-2xl font-black text-gray-900">¥4,500w</span>
                                <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> +12%</span>
                            </div>
                            <div className="text-xs text-gray-400">目标 ¥4,200w，进度 107%</div>
                        </div>
                        {/* 卡片 2: 增量MAC */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">达标</div>
                            <p className="text-sm text-gray-500 mb-1">增量MAC</p>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-2xl font-black text-gray-900">12.5w</span>
                                <span className="text-sm font-bold text-green-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> +8.5%</span>
                            </div>
                            <div className="text-xs text-gray-400">目标 12w，进度 104%</div>
                        </div>
                        {/* 卡片 3: CAC */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">预警</div>
                            <p className="text-sm text-gray-500 mb-1">CAC</p>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-2xl font-black text-gray-900">¥11.25</span>
                                <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> +3.2%</span>
                            </div>
                            <div className="text-xs text-gray-400">目标 ¥10，超目标 12.5%</div>
                        </div>
                        {/* 卡片 4: ROI */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">未达标</div>
                            <p className="text-sm text-gray-500 mb-1">ROI</p>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-2xl font-black text-gray-900">2.1</span>
                                <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><TrendingDown className="w-3 h-3" /> -0.3</span>
                            </div>
                            <div className="text-xs text-gray-400">目标 2.3，落后 8.7%</div>
                        </div>
                    </div>
                    
                    {/* 结论 */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <h3 className="font-bold text-blue-800 mb-3">📊 业务钱效水位横向对比</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p><strong>【当前水位】</strong>ROI 2.1，内部中等偏上（排名前40%）</p>
                            <p><strong>【对标情况】</strong>✅ 跑赢电商大盘平均（ROI 1.8）16.7%；⚠️ 距头部业务（如平台用增、独立端，ROI≥2.5）仍有差距</p>
                        </div>
                    </div>
                </div>

                {/* 二、业务核心指标归因 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="w-5 h-5 text-gray-800" />
                        <h2 className="text-lg font-bold text-gray-800">二、业务核心指标归因</h2>
                    </div>
                    
                    {/* 上方结论区文字说明 */}
                    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">⚠️</span>
                                <p className="text-gray-700"><strong>预算消耗上涨12%</strong>：核心来自低渗透地区和体验增长</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✅</span>
                                <p className="text-gray-700"><strong>增量 MAC 达成率 132% 超预期</strong>：低渗透地区专项拉新效果显著，贡献了52%的增量MAC</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">⚠️</span>
                                <p className="text-gray-700"><strong>CAC 11.25元偏高</strong>：低渗透地区和体验增长补贴单价过高</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">⚠️</span>
                                <p className="text-gray-700"><strong>ROI 1.9 未达标</strong>：运费立减这种低 ROI 玩法投放占比过高拉低整体收益</p>
                            </div>
                        </div>
                    </div>

                    {/* 下方数据佐证图表 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        {/* 图表顶部切换栏 */}
                        <div className="flex items-center justify-between mb-4">
                            {/* 左上角：维度切换 */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">下钻维度：</span>
                                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button 
                                        onClick={() => setSelectedDimension('business')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedDimension === 'business' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        业务方向
                                    </button>
                                    <button 
                                        onClick={() => setSelectedDimension('play')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedDimension === 'play' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        玩法策略
                                    </button>
                                    <button 
                                        onClick={() => setSelectedDimension('audience')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedDimension === 'audience' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        人群
                                    </button>
                                </div>
                            </div>
                            {/* 右上角：指标切换 */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">指标：</span>
                                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button 
                                        onClick={() => setSelectedMetric('budget')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedMetric === 'budget' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        预算消耗
                                    </button>
                                    <button 
                                        onClick={() => setSelectedMetric('mac')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedMetric === 'mac' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        增量 MAC
                                    </button>
                                    <button 
                                        onClick={() => setSelectedMetric('cac')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedMetric === 'cac' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        CAC
                                    </button>
                                    <button 
                                        onClick={() => setSelectedMetric('roi')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedMetric === 'roi' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        ROI
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 柱状图区域 */}
                        <div className="bg-white rounded-lg p-4 h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={
                                        selectedDimension === 'business' ? mockBusinessData[selectedMetric] :
                                        selectedDimension === 'play' ? mockPlayData[selectedMetric] :
                                        mockAudienceData[selectedMetric]
                                    }
                                    margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 10, fill: '#6B7280' }} 
                                        axisLine={{ stroke: '#D1D5DB' }} 
                                        tickLine={false} 
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis 
                                        domain={[0, 'auto']} 
                                        tick={{ fontSize: 12, fill: '#6B7280' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tickFormatter={(val) => `${val}%`}
                                    />
                                    <Tooltip 
                                        formatter={(value: any) => [`${value}%`, '贡献度']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        barSize={selectedDimension === 'audience' ? 40 : 20}
                                    >
                                        {
                                            (selectedDimension === 'business' ? mockBusinessData[selectedMetric] :
                                            selectedDimension === 'play' ? mockPlayData[selectedMetric] :
                                            mockAudienceData[selectedMetric]).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#60A5FA'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. 业务预算调配建议 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-gray-800" />
                        <h2 className="text-lg font-bold text-gray-800">三、业务预算调配建议</h2>
                    </div>
                    
                    <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3 text-yellow-700">
                            <Lightbulb className="w-4 h-4" />
                            <h4 className="font-bold text-sm">优化建议</h4>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">风险整改：</strong>平台流失、防流失、低渗透地区3类业务 ROI 均低于 1.5 且处于高风险区间，需立即复盘低效原因
                                    <div className="mt-1 text-xs text-gray-500">
                                        <span className="inline-block mr-3"><strong>时间节点：</strong>3天内完成初步诊断</span>
                                        <span className="inline-block"><strong>预期效果：</strong>ROI 提升至 1.8+</span>
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">增效加投：</strong>低消女性、MAC质量、中高消女性三类人群ROI稳定&gt;2.2，建议从低ROI业务腾挪1000万预算追加，预计增量GMV提升11.26%
                                    <div className="mt-1 text-xs text-gray-500">
                                        <span className="inline-block mr-3"><strong>时间节点：</strong>本周内完成预算腾挪</span>
                                        <span className="inline-block"><strong>预期效果：</strong>整体 ROI 提升 0.2</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    {/* 业务方向表格 */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">业务方向</th>
                                    <th className="px-4 py-3">预算消耗</th>
                                    <th className="px-4 py-3">预算占比</th>
                                    <th className="px-4 py-3">增量GMV</th>
                                    <th className="px-4 py-3">ROI</th>
                                    <th className="px-4 py-3">目标ROI</th>
                                    <th className="px-4 py-3">ROI环比</th>
                                    <th className="px-4 py-3">状态</th>
                                    <th className="px-4 py-3">方向 Owner</th>
                                    <th className="px-4 py-3">💡 动作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* 高风险业务 - 红色 */}
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">防流失</td>
                                    <td className="px-4 py-3 text-gray-600">¥2,160w</td>
                                    <td className="px-4 py-3 text-gray-600">8.2%</td>
                                    <td className="px-4 py-3 text-gray-600">¥216w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">0.1</td>
                                    <td className="px-4 py-3 text-gray-600">2.0</td>
                                    <td className="px-4 py-3 text-red-600">-0.3</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">张</div>
                                            <span className="text-gray-700 text-xs">张明</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '张明', businessName: '防流失', budget: '¥2,160w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">低渗透地区</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,260w</td>
                                    <td className="px-4 py-3 text-gray-600">4.8%</td>
                                    <td className="px-4 py-3 text-gray-600">¥378w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">0.3</td>
                                    <td className="px-4 py-3 text-gray-600">1.8</td>
                                    <td className="px-4 py-3 text-red-600">-0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">李</div>
                                            <span className="text-gray-700 text-xs">李强</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '李强', businessName: '低渗透地区', budget: '¥1,260w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">年长男性</td>
                                    <td className="px-4 py-3 text-gray-600">¥360w</td>
                                    <td className="px-4 py-3 text-gray-600">1.4%</td>
                                    <td className="px-4 py-3 text-gray-600">¥180w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">0.5</td>
                                    <td className="px-4 py-3 text-gray-600">1.5</td>
                                    <td className="px-4 py-3 text-red-600">-0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">王</div>
                                            <span className="text-gray-700 text-xs">王芳</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '王芳', businessName: '年长男性', budget: '¥360w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">场景增长</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,440w</td>
                                    <td className="px-4 py-3 text-gray-600">5.5%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,296w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">0.9</td>
                                    <td className="px-4 py-3 text-gray-600">1.6</td>
                                    <td className="px-4 py-3 text-red-600">-0.4</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">赵</div>
                                            <span className="text-gray-700 text-xs">赵伟</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '赵伟', businessName: '场景增长', budget: '¥1,440w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">年轻男性</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,890w</td>
                                    <td className="px-4 py-3 text-gray-600">7.2%</td>
                                    <td className="px-4 py-3 text-gray-600">¥2,268w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">1.2</td>
                                    <td className="px-4 py-3 text-gray-600">1.8</td>
                                    <td className="px-4 py-3 text-red-600">-0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">孙</div>
                                            <span className="text-gray-700 text-xs">孙丽</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '孙丽', businessName: '年轻男性', budget: '¥1,890w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">流失365</td>
                                    <td className="px-4 py-3 text-gray-600">¥810w</td>
                                    <td className="px-4 py-3 text-gray-600">3.1%</td>
                                    <td className="px-4 py-3 text-gray-600">¥972w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">1.2</td>
                                    <td className="px-4 py-3 text-gray-600">1.7</td>
                                    <td className="px-4 py-3 text-gray-500">0.0</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">周</div>
                                            <span className="text-gray-700 text-xs">周杰</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '周杰', businessName: '流失365', budget: '¥810w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">平台拉新</td>
                                    <td className="px-4 py-3 text-gray-600">¥4,590w</td>
                                    <td className="px-4 py-3 text-gray-600">17.4%</td>
                                    <td className="px-4 py-3 text-gray-600">¥5,967w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">1.3</td>
                                    <td className="px-4 py-3 text-gray-600">1.8</td>
                                    <td className="px-4 py-3 text-red-600">-0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">吴</div>
                                            <span className="text-gray-700 text-xs">吴敏</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '吴敏', businessName: '平台拉新', budget: '¥4,590w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">平台流失</td>
                                    <td className="px-4 py-3 text-gray-600">¥17,505w</td>
                                    <td className="px-4 py-3 text-gray-600">66.4%</td>
                                    <td className="px-4 py-3 text-gray-600">¥20,305.8w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">1.16</td>
                                    <td className="px-4 py-3 text-gray-600">1.7</td>
                                    <td className="px-4 py-3 text-red-600">-0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-red-700 font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">郑</div>
                                            <span className="text-gray-700 text-xs">郑华</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => setShowFeishuModal({ show: true, ownerName: '郑华', businessName: '平台流失', budget: '¥17,505w' })}
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>

                                {/* 关注业务 - 黄色 */}
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">品类增长</td>
                                    <td className="px-4 py-3 text-gray-600">¥5,175w</td>
                                    <td className="px-4 py-3 text-gray-600">19.6%</td>
                                    <td className="px-4 py-3 text-gray-600">¥9,832.5w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">1.9</td>
                                    <td className="px-4 py-3 text-gray-600">2.2</td>
                                    <td className="px-4 py-3 text-yellow-600">+0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">陈</div>
                                            <span className="text-gray-700 text-xs">陈静</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">体验增长</td>
                                    <td className="px-4 py-3 text-gray-600">¥850w</td>
                                    <td className="px-4 py-3 text-gray-600">3.2%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,700w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.0</td>
                                    <td className="px-4 py-3 text-gray-600">2.3</td>
                                    <td className="px-4 py-3 text-gray-500">0.0</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">林</div>
                                            <span className="text-gray-700 text-xs">林峰</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">促收入</td>
                                    <td className="px-4 py-3 text-gray-600">¥900w</td>
                                    <td className="px-4 py-3 text-gray-600">3.4%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,800w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.0</td>
                                    <td className="px-4 py-3 text-gray-600">2.2</td>
                                    <td className="px-4 py-3 text-green-600">+0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">黄</div>
                                            <span className="text-gray-700 text-xs">黄勇</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">促转化</td>
                                    <td className="px-4 py-3 text-gray-600">¥720w</td>
                                    <td className="px-4 py-3 text-gray-600">2.7%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,440w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.0</td>
                                    <td className="px-4 py-3 text-gray-600">2.2</td>
                                    <td className="px-4 py-3 text-green-600">+0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">杨</div>
                                            <span className="text-gray-700 text-xs">杨娜</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">促活</td>
                                    <td className="px-4 py-3 text-gray-600">¥630w</td>
                                    <td className="px-4 py-3 text-gray-600">2.4%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,260w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.0</td>
                                    <td className="px-4 py-3 text-gray-600">2.2</td>
                                    <td className="px-4 py-3 text-green-600">+0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-white text-xs font-bold">朱</div>
                                            <span className="text-gray-700 text-xs">朱婷</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">拉新</td>
                                    <td className="px-4 py-3 text-gray-600">¥450w</td>
                                    <td className="px-4 py-3 text-gray-600">1.7%</td>
                                    <td className="px-4 py-3 text-gray-600">¥900w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.0</td>
                                    <td className="px-4 py-3 text-gray-600">2.2</td>
                                    <td className="px-4 py-3 text-green-600">+0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="text-yellow-700 font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">何</div>
                                            <span className="text-gray-700 text-xs">何军</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>

                                {/* 健康业务 - 绿色 */}
                                <tr className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">中高消女性</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,575w</td>
                                    <td className="px-4 py-3 text-gray-600">6.0%</td>
                                    <td className="px-4 py-3 text-gray-600">¥3,465w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">2.2</td>
                                    <td className="px-4 py-3 text-gray-600">2.0</td>
                                    <td className="px-4 py-3 text-green-600">+0.3</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                                            <span className="text-green-700 font-medium">健康</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">刘</div>
                                            <span className="text-gray-700 text-xs">刘红</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">低消女性</td>
                                    <td className="px-4 py-3 text-gray-600">¥2,025w</td>
                                    <td className="px-4 py-3 text-gray-600">7.7%</td>
                                    <td className="px-4 py-3 text-gray-600">¥8,100w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">4.0</td>
                                    <td className="px-4 py-3 text-gray-600">3.5</td>
                                    <td className="px-4 py-3 text-green-600">+0.5</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                                            <span className="text-green-700 font-medium">健康</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">许</div>
                                            <span className="text-gray-700 text-xs">许莉</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">MAC质量</td>
                                    <td className="px-4 py-3 text-gray-600">¥1,710w</td>
                                    <td className="px-4 py-3 text-gray-600">6.5%</td>
                                    <td className="px-4 py-3 text-gray-600">¥7,353w</td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">4.3</td>
                                    <td className="px-4 py-3 text-gray-600">3.8</td>
                                    <td className="px-4 py-3 text-green-600">+0.4</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                                            <span className="text-green-700 font-medium">健康</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">马</div>
                                            <span className="text-gray-700 text-xs">马强</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-400 text-xs">-</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 飞书消息通知弹窗 */}
                    {showFeishuModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        将飞书通知方向Owner {showFeishuModal.ownerName}关注钱效偏低情况并整改
                                    </h3>
                                    <button 
                                        onClick={() => setShowFeishuModal(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {showFeishuModal.businessName}业务方向的预算消耗超过 {showFeishuModal.budget}但 ROI偏低，钱效风险高，请关注并改进
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowFeishuModal(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        取消
                                    </button>
                                    <button 
                                        onClick={() => {
                                            alert(`已发送飞书消息给 ${showFeishuModal.ownerName}`);
                                            setShowFeishuModal(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        确认发送
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. 行业参考 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Globe className="w-5 h-5 text-gray-800" />
                        <h2 className="text-lg font-bold text-gray-800">四、行业参考</h2>
                    </div>
                    
                    {/* 结构化结论 */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 mb-6 border border-purple-100">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                <p className="text-sm text-gray-700"><strong>存量用户价值深挖成为关键：</strong>阿里活跃消费者约10亿、GMV约8.3万亿，拼多多活跃买家近9亿、GMV约5.2万亿，规模绝对值增长空间有限，核心转向存量用户运营</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                <p className="text-sm text-gray-700"><strong>AI成为核心增长引擎：</strong>阿里投入约1200亿元AI+云基础设施，Qwen App月活破亿；拼多多将AI深度应用于Temu供应链、智能推荐、内容生态等全链路</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                <p className="text-sm text-gray-700"><strong>差异化竞争策略明确：</strong>阿里侧重生态协同（88VIP会员5600万+）和用户价值深挖；拼多多侧重社交裂变、百亿补贴和Temu海外扩张</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                <h3 className="font-bold text-gray-900 text-base">预算投入</h3>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">即时零售(淘宝闪购)：</strong>对即时零售业务进行“大力投资”，建立消费者心智，曾带动淘宝App月活同比增长25%。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">AI与云基础设施：</strong>在AI+云方面投入约1200亿元资本支出，前期投入正转化为用户层面的成果。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">品牌商扶持与返点：</strong>投入“前所未有的战略资源”支持品牌商家，将佣金返点计划扩大到所有品类。</div>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">百亿补贴：</strong>核心用户增长与维稳工具，通过“百亿费用减免”、“超级加倍补”等形式让利商家和用户。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">海外Temu营销投入：</strong>快速扩张依赖大量销售和营销支出，策略正转向内部补贴和提升物流效率。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">商家支持计划：</strong>启动“千亿商家支持计划”，帮助商家提升品质与服务，间接提升用户复购和留存。</div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                                <h3 className="font-bold text-gray-900 text-base">用户增长玩法</h3>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">会员体系深化(88VIP)：</strong>会员数突破5600万，整合生态内权益（如优酷、饿了么），提升高价值用户留存。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">跨端联动(淘宝闪购)：</strong>整合饿了么即时配送能力，通过“高频打低频”的跨端联动拉新提频。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">内容与IP合作：</strong>利用大型体育、文娱IP进行品牌营销，吸引年轻用户群体，提升品牌形象。</div>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">社交裂变与趣味玩法：</strong>国内主站持续迭代社交玩法，测试AI社交、AI试衣间等功能，增加停留时长。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">海外“半托管”模式：</strong>大力推广“半托管”模式，商家拥有更多自主权，吸引优质供给拉动增长。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">农产品上行：</strong>通过“农地云拼”模式深耕农产品供应链，巩固下沉市场和家庭用户心智。</div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <h3 className="font-bold text-gray-900 text-base">AI赋能用户增长</h3>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">AI Agent化应用：</strong>Qwen App月活破亿，整合淘宝、飞猪等服务，能自动完成购物、订票等任务。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">智能推荐与分群：</strong>持续利用AI优化推荐算法和人群圈选能力，实现“货找人”，提升转化率。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">AI营销工具矩阵：</strong>阿里妈妈提供“万相台无界版”等一系列AI驱动的营销工具，提升投放ROI。</div>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">AI驱动供应链与运营：</strong>在Temu上，AI深度应用于需求预测、库存管理、智慧物流等全链路环节。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">智能召回与个性化推荐：</strong>依托“猜你喜欢”等强推荐场景和AI引擎，进行个性化推荐，提升粘性和转化。</div>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                                        <div className="leading-relaxed"><strong className="text-gray-900">AI赋能内容生态：</strong>探索将AI用于生成商品评价、直播脚本及虚拟主播，低成本丰富平台内容。</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
      </div>
    );
  }



  // Render logic for "Manager Brief" (电商管理者默认预算简报)
  if (reportType === 'manager_brief') {
    if (aiContentMode === 'ai_marketing_tools') {
        return (
            <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
                {/* Top Nav */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-md">
                            <FileText className="w-4 h-4 text-gray-600" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            读取阿里AI在电商领域的应用有哪些_热点解读
                            <span className="text-xs text-gray-400 font-normal">09:02</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                    <div className="prose prose-sm text-gray-800">
                        <p className="mb-4 leading-relaxed">
                            阿里在电商领域的AI应用核心是通过通义千问实现智能导购和交易闭环，并赋能商家降本增效。2026年初，千问全面接入阿里巴巴集团核心业务体系，从“聊天”工具进化为能“办事”的智能代理，用户只需一句话就能自动订票、点外卖或完成支付。这标志着AI正深度重塑电商的“人-货-场”连接方式。
                        </p>
                        
                        <h3 className="font-bold text-base mt-6 mb-2">智能导购：一句话完成交易</h3>
                        <p className="mb-4 leading-relaxed">
                            当大多数AI助手还在回答简单问题时，千问已经能理解用户的模糊需求并直接行动。比如，用户提问“油皮适合什么粉底液？”，千问不仅列出选项，更会推荐具体品牌产品并跳转淘宝购买。
                            更关键的是，它实现了从需求到履约的全链路闭环——用户说“帮我点4杯霸王茶姬的伯牙绝弦”，AI直接调用淘宝闪购库存，生成订单卡片，点击确认即可支付，全程不超过30秒。这种体验在2026年春节“38亿免单”活动中得到验证：活动上线9小时，AI订单量便突破1000万单。
                            数据显示，千问的用户交易转化率达到8.2%，是行业平均水平的2.3倍。这意味着用户的每一次提问，都成了一次高意向的消费表达，而AI的推荐逻辑决定了品牌的曝光与成交。
                        </p>

                        <h3 className="font-bold text-base mt-6 mb-2">商家赋能：AI提升运营效率</h3>
                        <p className="mb-4 leading-relaxed">
                            对商家而言，阿里AI工具解决了“选品难、发品慢、营销累”的痛点。在阿里巴巴国际站，AI生意助手的“极简发品”功能，让商家上传一张产品图或关键词，AI就能自动生成标题、图片等全套商品信息，将发品时间缩短至最快60秒。
                            经过AI优化的商品，在海外曝光量提升37%，支付转化率提升高达50%。同时，AI自动接待功能可以24小时无时差回复海外客户，使买家二次回复率提升约40%。
                            除了国际业务，阿里内测的AIGC电商神器支持智能生图，仅需上传5张商品多角度图片，就能生成与热门网图同款风格的模特展示图，甚至允许商家自定义训练专属AI模特，突破传统模特限制。
                        </p>
                        <p className="mb-4 leading-relaxed">
                            这些工具将商家从重复性工作中解放出来，有商家反馈使用千问运营助手后，重复性工作时间减少65%。
                        </p>

                        <h3 className="font-bold text-base mt-6 mb-2">生态协同：重塑电商入口</h3>
                        <p className="mb-4 leading-relaxed">
                            千问的独特优势在于“大模型能力+阿里生态资源”的结合。它打通了淘宝、支付宝、飞猪、高德等核心业务，实现数据协同——AI可以结合用户的支付宝支付习惯、淘宝购物偏好、飞猪出行记录，做出更精准的推荐。这种生态级整合让千问从“工具”升级为“超级入口”，正在重构流量格局。
                            2026年第一季度，已有11.3%的淘宝闪购GMV来自AI对话流，且客单价更高、退货率更低。用户增长也印证了这一点：千问上线仅两个月，C端月活跃用户突破1亿，月活增速高达149.03%。
                        </p>
                        <p className="mb-4 leading-relaxed">
                            从战略上看，阿里通过大规模补贴(如春节30亿活动)加速用户习惯养成，平均每人每天调用生态接口5.7次，为模型训练提供了高质量数据。只要用户留存率稳定，阿里有望在24个月内通过电商货币化和云服务收入收回成本，使千问成为驱动集团第二增长曲线的核心引擎。
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="flex flex-col h-full bg-[#f8f9fc] border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
        {/* Top Nav */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
           <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-inner">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">电商预算钱效简报</h2>
                        
                        {/* 时间筛选器 */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">统计周期：</span>
                                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-xs">
                                    <option>最近自然周 (2026.03.16-2026.03.22)</option>
                                    <option>近7天</option>
                                    <option>近30天</option>
                                    <option>本季度</option>
                                    <option>自定义</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">对比周期：</span>
                                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-xs">
                                    <option>上周自然周 (2026.03.09-2026.03.15)</option>
                                    <option>上一周期</option>
                                    <option>去年同期</option>
                                    <option>自定义</option>
                                </select>
                            </div>
                            <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors">
                                应用
                            </button>
                        </div>
                    </div>
                </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="分享">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="下载">
                <Download className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            
            {/* Section 0: 顶部总结论区 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-800">整体结论总览</h2>
                </div>
                <div className="space-y-3">
                    {/* 费率归因 */}
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                        <p className="text-sm text-gray-700"><strong>费率归因：</strong>电商费率4.2%高于目标值(4%）核心原因为大促前夕竞价成本上升(CPM环比上涨15%)</p>
                    </div>
                    {/* 预算风险管控 */}
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 inline"><strong>预算风险管控：</strong>治理体验业务线连续2月ROI均低于1 且预算消耗高，建议适当缩减预算减少资损</p>
                            <button className="ml-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium">
                                去缩减预算
                            </button>
                        </div>
                    </div>
                    {/* 增效机会 */}
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 inline"><strong>增效机会：</strong>维持平台用增、独立端的高效投入（ROI &gt; 2.5），建议可从公共预算池追加1000万预算投入给独立端，预计增量GMV提升11.26%，电商整体费率可降低到3.88%。</p>
                            <button className="ml-3 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-medium">
                                去追加预算
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 核心指标卡区域 (4个) */}
            <div className="grid grid-cols-4 gap-4">
                {/* 卡片 1: 整体费率 */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">预警</div>
                    <p className="text-sm text-gray-500 mb-1">整体费率</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-black text-gray-900">4.2%</span>
                        <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 0.5%</span>
                    </div>
                    <div className="text-xs text-gray-400">目标 4.0%</div>
                </div>
                {/* 卡片 2: 预算消耗 */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">提示</div>
                    <p className="text-sm text-gray-500 mb-1">预算消耗</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-black text-gray-900">¥4,500w</span>
                        <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 12%</span>
                    </div>
                    <div className="text-xs text-gray-400">目标进度 115%</div>
                </div>
                {/* 卡片 3: 发货GMV */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">达标</div>
                    <p className="text-sm text-gray-500 mb-1">发货GMV</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-black text-gray-900">¥8.5亿</span>
                        <span className="text-sm font-bold text-green-500 mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 8.5%</span>
                    </div>
                    <div className="text-xs text-gray-400">目标进度 108%</div>
                </div>
                {/* 卡片 4: ROI */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">预警</div>
                    <p className="text-sm text-gray-500 mb-1">ROI</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-black text-gray-900">2.1</span>
                        <span className="text-sm font-bold text-red-500 mb-1 flex items-center"><TrendingDown className="w-3 h-3" /> 0.3</span>
                    </div>
                    <div className="text-xs text-gray-400">目标 2.3</div>
                </div>
            </div>
            
            {/* Section 1: 电商费率波动归因 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">1. 电商费率波动归因</h3>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium border border-red-200">异动</span>
                </div>
                <div className="p-6">
                    <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
                        <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> 核心归因分析
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">头部主播流量集中度提升 <span className="text-red-600">(贡献费率上升0.3pct)</span>：</strong>
                                    导致达人坑位费和佣金率上涨，<span className="text-blue-600 font-medium">建议下周启动中腰部主播扶持计划对冲成本。</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">大促前夕竞价成本上升 <span className="text-red-600">(贡献费率上升0.2pct)</span>：</strong>
                                    核心类目CPM环比上涨15%，<span className="text-blue-600 font-medium">建议优化投放人群包降低无效消耗。</span>
                                </div>
                            </li>
                        </ul>

                        {/* Data Evidence Section */}
                        <div className="mt-5 pt-4 border-t border-red-100">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-blue-500" /> 数据佐证
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Chart 1: 达人佣金率趋势 */}
                                <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-2 font-medium">头部达人佣金率趋势 (%)</div>
                                    <div className="h-28 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={mockCommissionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '4px' }} />
                                                <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {/* Chart 2: CPM成本趋势 */}
                                <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-2 font-medium">核心类目CPM成本 (元)</div>
                                    <div className="h-28 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={mockCpmData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '4px' }} />
                                                <Bar dataKey="cpm" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: 各业务健康度与优化建议 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-white">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                        <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">2. 各业务健康度与优化建议</h3>
                </div>
                <div className="p-6">
                    {/* Conclusion Area */}
                    <div className="mb-5 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                            <Lightbulb className="w-4 h-4" />
                            <h4 className="font-bold text-sm">优化建议</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">风险预警：</strong>建议重点关注<strong className="text-red-600">千川、治理体验</strong>业务线，其 ROI 均低于 1.8 且处于高风险区间，需立即复盘低效原因。
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">增效机会：</strong>维持<strong className="text-green-600">平台用增、独立端</strong>的高效投入（ROI &gt; 2.5），建议可追加1000万预算投入，预计增量GMV提升11.26%，电商整体费率可降低到3.88%。
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Business Line Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">业务线</th>
                                    <th className="px-4 py-3">预算消耗</th>
                                    <th className="px-4 py-3">预算占比</th>
                                    <th className="px-4 py-3">增量GMV</th>
                                    <th className="px-4 py-3">ROI</th>
                                    <th className="px-4 py-3">ROI环比</th>
                                    <th className="px-4 py-3">状态</th>
                                    <th className="px-4 py-3">资管BP</th>
                                    <th className="px-4 py-3">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* 高风险 */}
                                <tr className="hover:bg-red-50/30 transition-colors bg-red-50/10">
                                    <td className="px-4 py-3 font-medium text-gray-900">千川</td>
                                    <td className="px-4 py-3 text-gray-600">¥1200w</td>
                                    <td className="px-4 py-3 text-gray-600">6.0%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1800w</td>
                                    <td className="px-4 py-3 font-bold text-red-600">1.5</td>
                                    <td className="px-4 py-3 text-red-500">-0.4</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">张</div>
                                            <span className="text-gray-700 text-xs">张明</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-red-50/30 transition-colors bg-red-50/10">
                                    <td className="px-4 py-3 font-medium text-gray-900">治理体验</td>
                                    <td className="px-4 py-3 text-gray-600">¥800w</td>
                                    <td className="px-4 py-3 text-gray-600">4.0%</td>
                                    <td className="px-4 py-3 text-gray-600">¥1280w</td>
                                    <td className="px-4 py-3 font-bold text-red-600">1.6</td>
                                    <td className="px-4 py-3 text-red-500">-0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="font-medium">高风险</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">李</div>
                                            <span className="text-gray-700 text-xs">李强</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                                            下发复盘任务
                                        </button>
                                    </td>
                                </tr>

                                
                                {/* 关注 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">行业运营</td>
                                    <td className="px-4 py-3 text-gray-600">¥3500w</td>
                                    <td className="px-4 py-3 text-gray-600">17.5%</td>
                                    <td className="px-4 py-3 text-gray-600">¥7000w</td>
                                    <td className="px-4 py-3 text-gray-600">2.0</td>
                                    <td className="px-4 py-3 text-gray-500">0.0</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">赵</div>
                                            <span className="text-gray-700 text-xs">赵伟</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">整合营销</td>
                                    <td className="px-4 py-3 text-gray-600">¥2800w</td>
                                    <td className="px-4 py-3 text-gray-600">14.0%</td>
                                    <td className="px-4 py-3 text-gray-600">¥5320w</td>
                                    <td className="px-4 py-3 text-gray-600">1.9</td>
                                    <td className="px-4 py-3 text-red-500">-0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-sm"></div>
                                            <span className="font-medium">关注</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">吴</div>
                                            <span className="text-gray-700 text-xs">吴敏</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>

                                {/* 健康 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">平台用增</td>
                                    <td className="px-4 py-3 text-gray-600">¥8500w</td>
                                    <td className="px-4 py-3 text-gray-600">42.5%</td>
                                    <td className="px-4 py-3 text-gray-600">¥2.2亿</td>
                                    <td className="px-4 py-3 font-bold text-green-600">2.6</td>
                                    <td className="px-4 py-3 text-green-500">+0.2</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm"></div>
                                            <span className="font-medium">健康</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">王</div>
                                            <span className="text-gray-700 text-xs">王芳</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">独立端</td>
                                    <td className="px-4 py-3 text-gray-600">¥2800w</td>
                                    <td className="px-4 py-3 text-gray-600">14.0%</td>
                                    <td className="px-4 py-3 text-gray-600">¥7280w</td>
                                    <td className="px-4 py-3 font-bold text-green-600">2.6</td>
                                    <td className="px-4 py-3 text-green-500">+0.1</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded text-xs w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm"></div>
                                            <span className="font-medium">健康</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">周</div>
                                            <span className="text-gray-700 text-xs">周杰</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 3: 行业信息速览 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                            <Globe className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">3. 行业信息速览</h3>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-medium border border-purple-200">AI洞察</span>
                </div>
                <div className="p-6">
                    {/* AI Insight Conclusion */}
                    <div className="mb-6 bg-purple-50/50 rounded-xl p-5 border border-purple-100 relative">
                        <div className="absolute -top-3 -left-3 text-4xl text-purple-200 font-serif opacity-50">"</div>
                        <p className="text-sm text-gray-700 leading-relaxed relative z-10 pl-2">
                            <strong className="text-purple-800">行动建议：</strong>建议从平台用增预算中切10%测试AI导购和跨境种草场景，对冲流量成本上升风险，<strong className="text-purple-700">预期可降低投放成本5-8%</strong>。
                        </p>
                    </div>

                    {/* Bottom: Industry Objective Info (3 Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: 预算投入动向 */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-bl-lg">动向</div>
                            <div className="flex items-center mb-4">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                <h4 className="font-bold text-gray-800 text-sm">预算投入动向</h4>
                            </div>
                            <div className="space-y-5 flex-1">
                                {/* Alibaba */}
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        阿里巴巴
                                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">我方风险</span>
                                    </h5>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            <span className="leading-relaxed">
                                                <strong className="text-gray-800">加码即时零售：</strong>明确将持续大胆投入“淘宝闪购”，<strong className="text-gray-800">2026年投入力度将超过去年</strong>，重点投入即时零售的仓储建设。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 ml-1 bg-blue-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                 {/* Pinduoduo */}
                                 <div>
                                     <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        拼多多
                                        <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">我方机会</span>
                                     </h5>
                                     <ul className="space-y-2 text-xs text-gray-600">
                                         <li className="flex items-start gap-1.5">
                                             <span className="text-blue-500 mt-0.5">•</span>
                                             <span className="leading-relaxed">
                                                <strong className="text-gray-800">Temu预算“向外转内”：</strong>海外业务Temu停止粗放型买量，预算重心从站外引流大规模向<strong className="text-gray-800">站内</strong>直接补贴转移。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 ml-1 bg-blue-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                             </span>
                                         </li>
                                     </ul>
                                 </div>
                            </div>
                        </div>

                        {/* Column 2: 营销新玩法 */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-bl-lg">玩法</div>
                            <div className="flex items-center mb-4">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                <h4 className="font-bold text-gray-800 text-sm">营销新玩法</h4>
                            </div>
                            <div className="space-y-5 flex-1">
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        小红书
                                        <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">我方机会</span>
                                    </h5>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-pink-500 mt-0.5">•</span>
                                            <span className="leading-relaxed">
                                                <strong className="text-gray-800">“全域种草”闭环：</strong>打通与淘宝、微信的数据壁垒，推出“种草值”量化指标，品牌预算向“内容+转化”双效合一倾斜。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-pink-500 hover:text-pink-700 ml-1 bg-pink-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        京东
                                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">我方风险</span>
                                    </h5>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-pink-500 mt-0.5">•</span>
                                            <span className="leading-relaxed">
                                                <strong className="text-gray-800">百亿补贴常态化：</strong>将大促补贴常态化，重点倾斜3C数码及家电品类，拦截用户比价流失。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-pink-500 hover:text-pink-700 ml-1 bg-pink-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: 电商AI应用 */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-bl-lg">AI</div>
                            <div className="flex items-center mb-4">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                <h4 className="font-bold text-gray-800 text-sm">电商AI应用</h4>
                            </div>
                            <div className="space-y-5 flex-1">
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        亚马逊 (Amazon)
                                        <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">我方机会</span>
                                    </h5>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-purple-500 mt-0.5">•</span>
                                            <span className="leading-relaxed">
                                                <strong className="text-gray-800">AI导购助手Rufus：</strong>全量上线生成式AI导购助手，基于用户评价与商品详情提供购物建议，提升长尾商品转化率。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-purple-500 hover:text-purple-700 ml-1 bg-purple-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                                        Shopify
                                        <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">我方机会</span>
                                    </h5>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-purple-500 mt-0.5">•</span>
                                            <span className="leading-relaxed">
                                                <strong className="text-gray-800">AI图像生成工具：</strong>为商家免费提供AI商品图生成功能，大幅降低商家素材制作成本，提升点击率。
                                                <a href="#" className="inline-flex items-center gap-0.5 text-[10px] text-purple-500 hover:text-purple-700 ml-1 bg-purple-50 px-1 rounded transition-colors" title="查看来源"><ExternalLink className="w-2.5 h-2.5" /></a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    );
  }

  // Render logic for "Budget Adjustment" (业务预算调配建议)
  if (reportType === 'budget_adjustment') {
    // 预算分配状态管理
    const [budgetData, setBudgetData] = useState({
      total: propTotalBudget || 5000,
      gmv: 2200,
      dau: 1800,
      dac: 1000,
      gmvItems: [
        { name: '金币促活', value: 1200 },
        { name: '果园', value: 1000 }
      ],
      dauItems: [
        { name: '新人券/爆款', value: 350 },
        { name: '三单挑战-成长', value: 300 },
        { name: '三单挑战-成熟低频', value: 250 },
        { name: '三单挑战-沉默流失', value: 250 },
        { name: '签到领现金', value: 250 },
        { name: '抽红包', value: 200 },
        { name: '膨胀混资券', value: 200 }
      ],
      dacItems: [
        { name: '金币促购', value: 350 },
        { name: '省钱卡', value: 250 },
        { name: '猜喜券', value: 200 },
        { name: '大促券', value: 200 }
      ]
    });
    
    // 效果预测展开状态
    const [budgetConsumptionExpanded, setBudgetConsumptionExpanded] = useState(false);
    const [incrementLTExpanded, setIncrementLTExpanded] = useState(false);
    const [incrementDACExpanded, setIncrementDACExpanded] = useState(false);
    const [incrementGMVExpanded, setIncrementGMVExpanded] = useState(false);
    const [promoteLTExpanded, setPromoteLTExpanded] = useState(false);
    const [convertDACExpanded, setConvertDACExpanded] = useState(false);
    const [gmvRatioExpanded, setGmvRatioExpanded] = useState(false);
    
    // 用 useRef 来追踪上一个 propTotalBudget 的值
    const lastPropTotalBudgetRef = useRef<number | undefined>(undefined);
    
    // 监听 propTotalBudget 变化，更新 budgetData.total 并按比例调整其他预算
    useEffect(() => {
      if (propTotalBudget !== undefined && propTotalBudget !== lastPropTotalBudgetRef.current) {
        lastPropTotalBudgetRef.current = propTotalBudget;
        
        setBudgetData(prev => {
          if (prev.total === propTotalBudget) {
            return prev;
          }
          
          const oldTotal = prev.total;
          const ratio = propTotalBudget / oldTotal;
          
          return {
            ...prev,
            total: propTotalBudget,
            gmv: Math.round(prev.gmv * ratio),
            dau: Math.round(prev.dau * ratio),
            dac: Math.round(prev.dac * ratio),
            gmvItems: prev.gmvItems.map(item => ({
              ...item,
              value: Math.round(item.value * ratio)
            })),
            dauItems: prev.dauItems.map(item => ({
              ...item,
              value: Math.round(item.value * ratio)
            })),
            dacItems: prev.dacItems.map(item => ({
              ...item,
              value: Math.round(item.value * ratio)
            }))
          };
        });
      }
    }, [propTotalBudget]);

    // 更新预算项
    const updateBudgetItem = (category: 'gmv' | 'dau' | 'dac', index: number, newValue: number) => {
      setBudgetData(prev => {
        const newData = { ...prev };
        const items = [...newData[`${category}Items`]];
        const oldValue = items[index].value;
        const diff = newValue - oldValue;
        
        items[index] = { ...items[index], value: newValue };
        newData[`${category}Items`] = items;
        newData[category] = newData[category] + diff;
        
        return newData;
      });
    };

    // 更新一级分配方向总预算，自动按比例调整子项
    const updateCategoryTotal = (category: 'gmv' | 'dau' | 'dac', newTotal: number) => {
      setBudgetData(prev => {
        const newData = { ...prev };
        const oldTotal = newData[category];
        const items = [...newData[`${category}Items`]];
        
        // 计算每个子项的比例
        const ratio = newTotal / oldTotal;
        
        // 按比例调整每个子项，四舍五入到整数
        const updatedItems = items.map(item => ({
          ...item,
          value: Math.round(item.value * ratio)
        }));
        
        // 确保总和精确等于新的总预算（处理四舍五入误差）
        let currentSum = updatedItems.reduce((sum, item) => sum + item.value, 0);
        let diff = newTotal - currentSum;
        
        if (diff !== 0) {
          // 将差值分配给第一个项
          updatedItems[0] = { ...updatedItems[0], value: updatedItems[0].value + diff };
        }
        
        newData[`${category}Items`] = updatedItems;
        newData[category] = newTotal;
        
        return newData;
      });
    };
    
    // 处理预算指令（不处理 update_total，因为已由 propTotalBudget 统一处理）
    useEffect(() => {
      console.log('=== ReportArea 接收到 budgetCommand ===');
      console.log('budgetCommand:', budgetCommand);
      
      if (budgetCommand) {
        // 跳过 update_total，因为已由 propTotalBudget 处理
        if (budgetCommand.type === 'update_total') {
          return;
        }
        
        console.log('开始处理预算指令...');
        setBudgetData(prev => {
          console.log('处理前的预算数据:', prev);
          const newData = { ...prev };
          
          // 指令类型1：修改某个方向的预算
          if (budgetCommand.type === 'update_direction' && budgetCommand.direction && budgetCommand.budget) {
            const direction = budgetCommand.direction;
            const oldBudget = newData[direction];
            const newBudget = budgetCommand.budget;
            const ratio = newBudget / oldBudget;
            
            // 根据方向选择对应的items数组
            if (direction === 'gmv') {
              newData.gmvItems = newData.gmvItems.map(item => ({
                ...item,
                value: Math.round(item.value * ratio)
              }));
              newData.gmv = newBudget;
            } else if (direction === 'dau') {
              newData.dauItems = newData.dauItems.map(item => ({
                ...item,
                value: Math.round(item.value * ratio)
              }));
              newData.dau = newBudget;
            } else if (direction === 'dac') {
              newData.dacItems = newData.dacItems.map(item => ({
                ...item,
                value: Math.round(item.value * ratio)
              }));
              newData.dac = newBudget;
            }
            
            // 更新总预算
            const oldTotal = newData.total;
            newData.total = oldTotal - oldBudget + newBudget;
          }
          
          // 指令类型3：增加新玩法
          else if (budgetCommand.type === 'add_item' && budgetCommand.direction && budgetCommand.itemName && budgetCommand.budget) {
            const direction = budgetCommand.direction;
            
            // 根据方向选择对应的items数组并添加新玩法
            if (direction === 'gmv') {
              newData.gmvItems = [...newData.gmvItems, {
                name: budgetCommand.itemName,
                value: budgetCommand.budget
              }];
              newData.gmv = newData.gmv + budgetCommand.budget;
            } else if (direction === 'dau') {
              newData.dauItems = [...newData.dauItems, {
                name: budgetCommand.itemName,
                value: budgetCommand.budget
              }];
              newData.dau = newData.dau + budgetCommand.budget;
            } else if (direction === 'dac') {
              newData.dacItems = [...newData.dacItems, {
                name: budgetCommand.itemName,
                value: budgetCommand.budget
              }];
              newData.dac = newData.dac + budgetCommand.budget;
            }
            
            // 更新总预算
            newData.total = newData.total + budgetCommand.budget;
          }
          
          console.log('处理后的预算数据:', newData);
          return newData;
        });
      }
    }, [budgetCommand]);

    return (
      <div className="flex flex-col h-full bg-[#f8f9fc] border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
        {/* Top Nav */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
           <div className="flex items-center gap-4 text-sm text-gray-900 font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <BarChart2 className="w-4 h-4 text-white" />
                    </div>
                    <span>预算分配工作台 - 独立端业务</span>
                </div>
                <span className="text-gray-300 font-normal">|</span>
                <span className="text-gray-500 font-normal">2023/09/01 ~ 2023/12/31</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* 中间：预算分配工作台 */}
            <div className="flex-1 overflow-auto p-6 bg-[#f8f9fc]">
                {/* ① 顶部：自负盈亏业务预算总览 */}
                <div className="bg-white rounded-xl border-2 border-blue-200 p-5 mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        自负盈亏业务(不参与分配）
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">玩法</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">目标方向</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">长期ROI</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">端净利</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-800">金币促活</td>
                                    <td className="py-3 px-4 text-gray-800">促活</td>
                                    <td className="py-3 px-4 text-gray-900">1.2</td>
                                    <td className="py-3 px-4 text-gray-900">64.00%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">根据系统规则设置，上述玩法端净利显著正，无需参与预算分配</p>
                </div>

                {/* ② 底部：AI 推荐预算分配 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            AI 推荐预算分配（可手动调整）
                        </h3>
                        <span className="text-xs text-gray-500">基础说明：所有数值为 AI 根据左侧配置 + 历史数据推荐的最优值</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">目标</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">可调配的预算(剔除自负盈亏业务)</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">占比</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">玩法</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">AI 推荐预算</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">调整控件</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* GMV 增长方向 */}
                                <tr className="bg-gradient-to-r from-green-50 to-white">
                                    <td className="py-3 px-4 font-bold text-green-800">📈 促活</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-900 font-bold">¥</span>
                                                <input
                                                    type="number"
                                                    min="1000"
                                                    max="3500"
                                                    value={budgetData.gmv}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val >= 1000 && val <= 3500) {
                                                            updateCategoryTotal('gmv', val);
                                                        }
                                                    }}
                                                    className="w-24 h-7 px-2 text-sm text-green-900 font-bold bg-white border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                                <span className="text-green-700 font-medium">w</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-green-700 font-medium">{Math.round(budgetData.gmv / budgetData.total * 100)}%</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                {budgetData.gmvItems.map((item, index) => (
                                    <tr key={`gmv-${index}`} className="bg-white">
                                        <td className="py-2 px-4 pl-8 text-gray-700"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4 pl-8 text-gray-700">{item.name}</td>
                                        <td className="py-2 px-4 text-gray-900 font-medium">¥{item.value}w</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="1200"
                                                    value={item.value}
                                                    onChange={(e) => updateBudgetItem('gmv', index, parseInt(e.target.value))}
                                                    className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                                />
                                                <span className="text-xs text-gray-500">🎚️</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* 促转化 */}
                                <tr className="bg-gradient-to-r from-blue-50 to-white">
                                    <td className="py-3 px-4 font-bold text-blue-800">📣 促转化</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-900 font-bold">¥</span>
                                                <input
                                                    type="number"
                                                    min="800"
                                                    max="3000"
                                                    value={budgetData.dau}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val >= 800 && val <= 3000) {
                                                            updateCategoryTotal('dau', val);
                                                        }
                                                    }}
                                                    className="w-24 h-7 px-2 text-sm text-blue-900 font-bold bg-white border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-blue-700 font-medium">w</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-blue-700 font-medium">{Math.round(budgetData.dau / budgetData.total * 100)}%</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                {budgetData.dauItems.map((item, index) => (
                                    <tr key={`dau-${index}`} className="bg-white">
                                        <td className="py-2 px-4 pl-8 text-gray-700"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4 pl-8 text-gray-700">{item.name}</td>
                                        <td className="py-2 px-4 text-gray-900 font-medium">¥{item.value}w</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="1000"
                                                    value={item.value}
                                                    onChange={(e) => updateBudgetItem('dau', index, parseInt(e.target.value))}
                                                    className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                                <span className="text-xs text-gray-500">🎚️</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* 促GMV */}
                                <tr className="bg-gradient-to-r from-orange-50 to-white">
                                    <td className="py-3 px-4 font-bold text-orange-800">⚙️ 促GMV</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-orange-900 font-bold">¥</span>
                                                <input
                                                    type="number"
                                                    min="500"
                                                    max="2000"
                                                    value={budgetData.dac}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val >= 500 && val <= 2000) {
                                                            updateCategoryTotal('dac', val);
                                                        }
                                                    }}
                                                    className="w-24 h-7 px-2 text-sm text-orange-900 font-bold bg-white border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <span className="text-orange-700 font-medium">w</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-orange-700 font-medium">{Math.round(budgetData.dac / budgetData.total * 100)}%</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                {budgetData.dacItems.map((item, index) => (
                                    <tr key={`dac-${index}`} className="bg-white">
                                        <td className="py-2 px-4 pl-8 text-gray-700"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4 pl-8 text-gray-700">{item.name}</td>
                                        <td className="py-2 px-4 text-gray-900 font-medium">¥{item.value}w</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="600"
                                                    value={item.value}
                                                    onChange={(e) => updateBudgetItem('dac', index, parseInt(e.target.value))}
                                                    className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                                />
                                                <span className="text-xs text-gray-500">🎚️</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* 合计 */}
                                <tr className="bg-gray-50 font-bold">
                                    <td className="py-3 px-4 text-gray-800">🔹 合计</td>
                                    <td className="py-3 px-4 text-gray-900">¥{budgetData.total}w</td>
                                    <td className="py-3 px-4 text-gray-700">100%</td>
                                    <td className="py-3 px-4">-</td>
                                    <td className="py-3 px-4 text-gray-900">¥{budgetData.total}w</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                        <button className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            一键应用 AI 推荐方案
                        </button>
                        <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            重置为当前生效方案
                        </button>
                        <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            导出分配明细
                        </button>
                        <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            生成预算调整审批单
                        </button>
                    </div>
                </div>
            </div>

            {/* 右侧：实时效果预测区域 */}
            <div className="w-[500px] bg-white border-l border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        预算分配效果预估
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* ① 预算消耗 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                预算消耗
                                <span className="text-base font-bold text-gray-900 ml-2">¥{budgetData.total}w</span>
                            </h3>
                            <button 
                                onClick={() => setBudgetConsumptionExpanded(!budgetConsumptionExpanded)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                {budgetConsumptionExpanded ? '收起' : '展开'}
                                <span>{budgetConsumptionExpanded ? '▲' : '▼'}</span>
                            </button>
                        </div>
                        
                        {budgetConsumptionExpanded && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                                    <span className="text-xs text-gray-600">促活方向消耗</span>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">¥{budgetData.gmv}w</span>
                                        <span className="text-xs text-green-600 ml-1">+5.2% 🟢</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                                    <span className="text-xs text-gray-600">促转化方向消耗</span>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">¥{budgetData.dau}w</span>
                                        <span className="text-xs text-red-600 ml-1">-1.1% 🔴</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3">
                                    <span className="text-xs text-gray-600">促GMV方向消耗</span>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">¥{budgetData.dac}w</span>
                                        <span className="text-xs text-green-600 ml-1">+2.3% 🟢</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ② 增量预估 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            增量预估
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-700">增量LT</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-green-700">2.5 天</span>
                                        </div>
                                        <button 
                                            onClick={() => setIncrementLTExpanded(!incrementLTExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {incrementLTExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {incrementLTExpanded && (
                                    <div className="mt-3 pt-3 border-t border-green-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">金币促活</span>
                                            <span className="text-gray-800">2.8 天</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">果园</span>
                                            <span className="text-gray-800">2.2 天</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-700">增量DAC</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-blue-700">385 万</span>
                                        </div>
                                        <button 
                                            onClick={() => setIncrementDACExpanded(!incrementDACExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {incrementDACExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {incrementDACExpanded && (
                                    <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">新人券/爆款</span>
                                            <span className="text-gray-800">120 万</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-成长</span>
                                            <span className="text-gray-800">95 万</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-成熟低频</span>
                                            <span className="text-gray-800">75 万</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-沉默流失</span>
                                            <span className="text-gray-800">50 万</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">签到领现金</span>
                                            <span className="text-gray-800">45 万</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-700">增量GMV</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-orange-700">¥11.2 亿</span>
                                        </div>
                                        <button 
                                            onClick={() => setIncrementGMVExpanded(!incrementGMVExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {incrementGMVExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {incrementGMVExpanded && (
                                    <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">金币促购</span>
                                            <span className="text-gray-800">¥4.5 亿</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">省钱卡</span>
                                            <span className="text-gray-800">¥3.2 亿</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">猜喜券</span>
                                            <span className="text-gray-800">¥2.1 亿</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">大促券</span>
                                            <span className="text-gray-800">¥1.4 亿</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ③ 钱效预估 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            钱效预估
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 border border-gray-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">促活LT_CAC</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">22.8</span>
                                            <span className="text-xs text-green-600 ml-1">+1.5 🟢</span>
                                        </div>
                                        <button 
                                            onClick={() => setPromoteLTExpanded(!promoteLTExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {promoteLTExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {promoteLTExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">金币促活</span>
                                            <span className="text-gray-800">24.5</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">果园</span>
                                            <span className="text-gray-800">21.2</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 border border-gray-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">促转化 DAC_CAC</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">2.42</span>
                                            <span className="text-xs text-green-600 ml-1">+0.2pct 🟢</span>
                                        </div>
                                        <button 
                                            onClick={() => setConvertDACExpanded(!convertDACExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {convertDACExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {convertDACExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">新人券/爆款</span>
                                            <span className="text-gray-800">2.65</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-成长</span>
                                            <span className="text-gray-800">2.48</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-成熟低频</span>
                                            <span className="text-gray-800">2.35</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">三单挑战-沉默流失</span>
                                            <span className="text-gray-800">2.28</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">签到领现金</span>
                                            <span className="text-gray-800">2.38</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 border border-gray-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">GMV兑换比</span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">4.38%</span>
                                            <span className="text-xs text-green-600 ml-1">-0.12pct 🟢</span>
                                        </div>
                                        <button 
                                            onClick={() => setGmvRatioExpanded(!gmvRatioExpanded)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            {gmvRatioExpanded ? '收起' : '展开玩法'}
                                        </button>
                                    </div>
                                </div>
                                {gmvRatioExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">金币促购</span>
                                            <span className="text-gray-800">4.62%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">省钱卡</span>
                                            <span className="text-gray-800">4.28%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">猜喜券</span>
                                            <span className="text-gray-800">4.45%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">大促券</span>
                                            <span className="text-gray-800">4.15%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-3">
                        <button className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            查看预测逻辑明细
                        </button>
                        <button className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            对比多版本方案
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Render logic for "ROI Attribution" (ROI下跌分析报告)
  if (reportType === 'roi_attribution') {
    return (
      <div className="flex flex-col h-full bg-[#f8f9fc] border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
        {/* Top Nav */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
           <div className="flex items-center gap-4 text-sm text-gray-900 font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                        <BarChart2 className="w-4 h-4 text-white" />
                    </div>
                    <span>ROI下跌分析报告</span>
                </div>
                <span className="text-gray-300 font-normal">|</span>
                <span className="text-gray-500 font-normal">平台用增 · 近7天</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-[#f8f9fc]">
            {/* 📌 顶部总结论区 */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            核心结论
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            ✅ 核心结论：平台用增近 7 天 ROI 从 2.4 下跌至 1.9，环比下降 0.5pct，未达 2.2 的周度目标。72% 的下跌由拉新流失、低渗透地区两类低 ROI 业务投放占比提升导致，28% 受行业 CPM 上涨 8% 的外部因素影响。
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                            <Search className="w-3.5 h-3.5" />
                            查看 BI 明细
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            追问结论
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔍 核心归因分析 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    核心归因分析
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-red-600 font-bold text-xs">1</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-800 mb-1">第一影响因素（贡献下跌 0.36pct）</div>
                            <p className="text-sm text-gray-600">拉新流失类投放占比从 22% 提升至 38%，该类业务 ROI 仅 0.9，远低于平均水平，为当前最大预算漏水点</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-orange-600 font-bold text-xs">2</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-800 mb-1">第二影响因素（贡献下跌 0.16pct）</div>
                            <p className="text-sm text-gray-600">低渗透地区补贴力度加大，CAC 上升 32 元至 392 元，拉低整体 ROI</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-gray-600 font-bold text-xs">3</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-800 mb-1">外部影响因素（贡献下跌 0.08pct）</div>
                            <p className="text-sm text-gray-600">大促前行业竞价加剧，整体 CPM 上涨 8%，投放效率普遍下降</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 数据佐证图表 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    数据佐证图表
                </h3>
                
                {/* 图表 1：ROI 下跌贡献度拆解 */}
                <div className="mb-6">
                    <h4 className="text-xs font-medium text-gray-700 mb-3">图表 1：ROI 下跌贡献度拆解（柱状图）</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">影响维度</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">贡献下跌幅度</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">占比</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">拉新流失业务</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: '72%' }}></div>
                                            </div>
                                            <span className="text-red-600 font-medium">0.36pct</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">72%</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">低渗透地区投放</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '32%' }}></div>
                                            </div>
                                            <span className="text-orange-600 font-medium">0.16pct</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">28%</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">行业 CPM 上涨</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-400 rounded-full" style={{ width: '16%' }}></div>
                                            </div>
                                            <span className="text-gray-600 font-medium">0.08pct</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">16%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 图表 2：各业务 ROI 对比 */}
                <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-3">图表 2：各业务 ROI 对比（条形图）</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">业务方向</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">当前 ROI</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">上周 ROI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">高价值老客召回</td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-600 font-bold">3.2</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">3.1</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">品类增长专项</td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-600 font-bold">2.7</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">2.6</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">平台拉新</td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold">1.9</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">2.4</td>
                                </tr>
                                <tr className="hover:bg-gray-50 bg-red-50">
                                    <td className="py-3 px-4 text-red-800 font-medium">低渗透地区投放</td>
                                    <td className="py-3 px-4">
                                        <span className="text-red-600 font-bold">1.2</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">1.5</td>
                                </tr>
                                <tr className="hover:bg-gray-50 bg-red-50">
                                    <td className="py-3 px-4 text-red-800 font-medium">拉新流失挽回</td>
                                    <td className="py-3 px-4">
                                        <span className="text-red-600 font-bold">0.9</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">1.1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">视觉规则：低于目标线 1.8 的业务标红高亮</p>
                </div>
            </div>

            {/* 💡 优化建议 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        优化建议
                    </h3>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <PlayCircle className="w-3.5 h-3.5" />
                            生成优化调整方案
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                            <Settings className="w-3.5 h-3.5" />
                            一键调整预算
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-blue-600 font-bold text-xs">短</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-blue-800 mb-1">短期</div>
                            <p className="text-sm text-gray-700">立即削减拉新流失业务 15% 预算（约 1800 万），腾挪至高价值老客召回方向，预计可快速提升 ROI 0.2pct</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-purple-600 font-bold text-xs">中</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-purple-800 mb-1">中期</div>
                            <p className="text-sm text-gray-700">调整低渗透地区补贴规则，新客补贴仅向高潜力用户发放，预计可降低 CAC 15%</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-gray-600 font-bold text-xs">长</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-800 mb-1">长期</div>
                            <p className="text-sm text-gray-700">优化竞价出价策略，设置 CPM 上限阈值，对冲行业流量成本上涨风险</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Render logic for "Ecommerce Industry Research" (电商行业研究)
  if (reportType === 'ecommerce_industry_research') {
    return (
      <div className="flex flex-col h-full bg-[#f5f6f7]">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-bold text-gray-800">电商行业研究报告</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> 分享
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> 下载
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 行业参考 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* 结构化结论 */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 mb-6 border border-purple-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                    <p className="text-sm text-gray-700"><strong>存量用户价值深挖成为关键：</strong>阿里活跃消费者约10亿、GMV约8.3万亿，拼多多活跃买家近9亿、GMV约5.2万亿，规模绝对值增长空间有限，核心转向存量用户运营</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    <p className="text-sm text-gray-700"><strong>AI成为核心增长引擎：</strong>阿里投入约1200亿元AI+云基础设施，Qwen App月活破亿；拼多多将AI深度应用于Temu供应链、智能推荐、内容生态等全链路</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    <p className="text-sm text-gray-700"><strong>差异化竞争策略明确：</strong>阿里侧重生态协同（88VIP会员5600万+）和用户价值深挖；拼多多侧重社交裂变、百亿补贴和Temu海外扩张</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <h3 className="font-bold text-gray-900 text-base">预算投入</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">即时零售(淘宝闪购)：</strong>对即时零售业务进行"大力投资"，建立消费者心智，曾带动淘宝App月活同比增长25%。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">AI与云基础设施：</strong>在AI+云方面投入约1200亿元资本支出，前期投入正转化为用户层面的成果。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">品牌商扶持与返点：</strong>投入"前所未有的战略资源"支持品牌商家，将佣金返点计划扩大到所有品类。</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">百亿补贴：</strong>核心用户增长与维稳工具，通过"百亿费用减免"、"超级加倍补"等形式让利商家和用户。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">海外Temu营销投入：</strong>快速扩张依赖大量销售和营销支出，策略正转向内部补贴和提升物流效率。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">商家支持计划：</strong>启动"千亿商家支持计划"，帮助商家提升品质与服务，间接提升用户复购和留存。</div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                    <h3 className="font-bold text-gray-900 text-base">用户增长玩法</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">会员体系深化(88VIP)：</strong>会员数突破5600万，整合生态内权益（如优酷、饿了么），提升高价值用户留存。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">跨端联动(淘宝闪购)：</strong>整合饿了么即时配送能力，通过"高频打低频"的跨端联动拉新提频。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">内容与IP合作：</strong>利用大型体育、文娱IP进行品牌营销，吸引年轻用户群体，提升品牌形象。</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">社交裂变与趣味玩法：</strong>国内主站持续迭代社交玩法，测试AI社交、AI试衣间等功能，增加停留时长。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">海外"半托管"模式：</strong>大力推广"半托管"模式，商家拥有更多自主权，吸引优质供给拉动增长。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-pink-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">农产品上行：</strong>通过"农地云拼"模式深耕农产品供应链，巩固下沉市场和家庭用户心智。</div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <h3 className="font-bold text-gray-900 text-base">AI赋能用户增长</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">阿里巴巴</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">AI Agent化应用：</strong>Qwen App月活破亿，整合淘宝、飞猪等服务，能自动完成购物、订票等任务。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">智能推荐与分群：</strong>持续利用AI优化推荐算法和人群圈选能力，实现"货找人"，提升转化率。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">AI营销工具矩阵：</strong>阿里妈妈提供"万相台无界版"等一系列AI驱动的营销工具，提升投放ROI。</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">拼多多</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">AI驱动供应链与运营：</strong>在Temu上，AI深度应用于需求预测、库存管理、智慧物流等全链路环节。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">智能召回与个性化推荐：</strong>依托"猜你喜欢"等强推荐场景和AI引擎，进行个性化推荐，提升粘性和转化。</div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-1.5 text-[10px]">●</span>
                        <div className="leading-relaxed"><strong className="text-gray-900">AI赋能内容生态：</strong>探索将AI用于生成商品评价、直播脚本及虚拟主播，低成本丰富平台内容。</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render logic for "Health Analysis" (钱效健康度分析)
  if (reportType === 'health_analysis') {
    return (
      <div className="flex flex-col h-full bg-[#f5f6f7]">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-bold text-gray-800">预算健康度监控报告</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> 分享
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> 下载
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* 顶部全局健康度总览 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-gray-800" />
                <h2 className="text-lg font-bold text-gray-800">全局健康度总览</h2>
              </div>
              
              {/* 筛选器 */}
              <div className="flex items-center gap-4 mb-6">
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500">
                  <option>全部业务线</option>
                </select>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500">
                  <option>全部风险等级</option>
                  <option>高风险</option>
                  <option>待优化</option>
                  <option>健康</option>
                </select>
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500">
                  <option>近7天</option>
                  <option>近30天</option>
                  <option>近90天</option>
                </select>
              </div>
              
              {/* 指标卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <p className="text-xs text-gray-500 mb-2">整体健康度评分</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-800">78</span>
                    <span className="text-sm text-gray-500 mb-1">分</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="text-yellow-600 font-medium">🔶 中等</span>
                    <span className="text-gray-400 ml-1">(≥90 优秀 / 70-89 中等 /&lt;70 较差)</span>
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-2">对接业务总数</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-800">6</span>
                    <span className="text-sm text-gray-500 mb-1">条</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    高风险 <span className="text-red-600 font-bold">3</span> 条、
                    待优化 <span className="text-yellow-600 font-bold">2</span> 条、
                    健康 <span className="text-green-600 font-bold">1</span> 条
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                  <p className="text-xs text-gray-500 mb-2">高风险影响</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-red-600">-0.42</span>
                    <span className="text-sm text-gray-500 mb-1">pct</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    高风险业务拉低整体 ROI 0.42pct
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 border border-green-100">
                  <p className="text-xs text-gray-500 mb-2">预算整体完成率</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-green-600">108</span>
                    <span className="text-sm text-gray-500 mb-1">%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    略超周度进度，无全局超支风险
                  </p>
                </div>
              </div>
            </div>
            
            {/* 业务健康度排名表 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-gray-800" />
                <h2 className="text-lg font-bold text-gray-800">业务健康度排名表</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">业务名称</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ROI（目标）</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">CAC（目标）</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">费率（目标）</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">预算完成率</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">健康等级</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">核心问题</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">快速操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 高风险 - 低渗透地区业务 */}
                    <tr className="bg-red-50/50 border-b border-gray-100 hover:bg-red-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">低渗透地区业务</td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">1.2</span>
                        <span className="text-gray-400 text-xs ml-1">(≥1.8)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">420</span>
                        <span className="text-gray-400 text-xs ml-1">元(≤350元)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">6.8%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤5%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-orange-600">132%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          🔴 高风险
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">补贴力度过大、ROI 持续低于警戒线</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">归因</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">整改</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 高风险 - 拉新流失挽回 */}
                    <tr className="bg-red-50/50 border-b border-gray-100 hover:bg-red-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">拉新流失挽回</td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">0.9</span>
                        <span className="text-gray-400 text-xs ml-1">(≥1.5)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">510</span>
                        <span className="text-gray-400 text-xs ml-1">元(≤380元)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">9.2%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤7%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-orange-600">145%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          🔴 高风险
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">投放效率持续走低、无效消耗占比高</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">归因</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">整改</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 高风险 - 履约补贴业务 */}
                    <tr className="bg-red-50/50 border-b border-gray-100 hover:bg-red-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">履约补贴业务</td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">1.1</span>
                        <span className="text-gray-400 text-xs ml-1">(≥1.6)</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">-</td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold">5.5%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤4%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-orange-600">121%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          🔴 高风险
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">补贴规则宽松、超发率达 22%</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">归因</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">整改</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 待优化 - 内容生态业务 */}
                    <tr className="bg-yellow-50/30 border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">内容生态业务</td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">1.9</span>
                        <span className="text-gray-400 text-xs ml-1">(≥2.2)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">370</span>
                        <span className="text-gray-400 text-xs ml-1">元(≤340元)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">4.8%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤4.5%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">102%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          🟡 待优化
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">内容投放 ROI 略低于目标</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">归因</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">优化</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 待优化 - 平台拉新业务 */}
                    <tr className="bg-yellow-50/30 border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">平台拉新业务</td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">2.1</span>
                        <span className="text-gray-400 text-xs ml-1">(≥2.3)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">360</span>
                        <span className="text-gray-400 text-xs ml-1">元(≤320元)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-yellow-600 font-bold">4.2%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤4%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">107%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          🟡 待优化
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">行业 CPM 上涨导致成本略升</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">归因</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">优化</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 健康 - 高价值老客召回 */}
                    <tr className="bg-green-50/30 border-b border-gray-100 hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">高价值老客召回</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">3.2</span>
                        <span className="text-gray-400 text-xs ml-1">(≥2.5)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">210</span>
                        <span className="text-gray-400 text-xs ml-1">元(≤250元)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">2.8%</span>
                        <span className="text-gray-400 text-xs ml-1">(≤3%)</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">92%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          🟢 健康
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">钱效表现优异，可考虑加投</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-green-600 hover:text-green-800 font-medium">加投建议</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">导出</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 重点异动预警 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-gray-800">重点异动预警</h2>
                <span className="text-xs text-gray-400">(仅列 Top3 影响最大的问题)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      低渗透地区 + 拉新流失业务合计占总预算的 <strong className="text-red-600 font-bold">28%</strong>，ROI 不足 1.5，若优化至目标线，可提升整体 ROI <strong className="text-green-600 font-bold">0.38pct</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      履约补贴业务超发率达 <strong className="text-orange-600 font-bold">22%</strong>，每月额外消耗预算约 <strong className="text-orange-600 font-bold">1200 万</strong>，收紧规则后可直接减少浪费
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      行业 CPM 预计下月上涨 <strong className="text-yellow-600 font-bold">8-10%</strong>，若不提前优化出价策略，预计拉高新客 CAC <strong className="text-yellow-600 font-bold">5-7%</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 整改进度跟踪 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">整改进度跟踪</h2>
                <span className="text-xs text-gray-400">(自动关联历史预算调整 / 整改任务)</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">整改任务</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">下发时间</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">负责人</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">当前进度</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">预期效果</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">削减拉新流失业务 15% 预算</td>
                      <td className="px-4 py-3 text-sm text-gray-600">2026-03-25</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">张</div>
                          <span className="text-sm text-gray-700">张XX</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          执行中
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">提升 ROI 0.2pct</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">查看详情</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">低渗透地区补贴规则优化</td>
                      <td className="px-4 py-3 text-sm text-gray-600">2026-03-28</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">李</div>
                          <span className="text-sm text-gray-700">李XX</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          待确认
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">降低 CAC 15%</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-orange-600 hover:text-orange-800 font-medium">催办</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 底部操作区 */}
            <div className="flex items-center gap-4">
              <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                批量下发高风险业务整改任务
              </button>
              <button className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出全量监控明细 Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render logic for "Promotion Budget" (大促AI预算助手)
  if (reportType === 'promotion_budget') {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center">
            {(['budget', 'target', 'monitor'] as const).map((tab) => {
              const labels = { budget: '预算测算&调配', target: '目标测算', monitor: '促中监控' };
              return (
                <button
                  key={tab}
                  onClick={() => setPromoView(tab)}
                  className={`px-5 py-3.5 text-sm font-medium transition-all relative ${promoView === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {labels[tab]}
                  {promoView === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">双11 预售期 · 2026.10.20-11.11</span>
            <button onClick={() => setShowExportModal(true)} className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button onClick={() => setShowShareModal(true)} className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              分享
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 版本控制条 */}
        <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
              {currentVersion}
            </span>
            {isViewingHistory && (
              <button 
                onClick={() => {
                  const activeVersion = versionHistory.find(v => v.status === 'active');
                  if (activeVersion) {
                    setCurrentVersion(activeVersion.version);
                  }
                  setIsViewingHistory(false);
                }}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
              >
                返回最新
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              版本历史
            </button>
          </div>
        </div>
        
        {/* 版本历史表格 - 在顶部展开 */}
        {showVersionHistory && (
          <div className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">版本历史记录</h3>
                <button 
                  onClick={() => setShowVersionHistory(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">版本号</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">操作类型</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex-1">修改描述</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">操作人</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-44">操作时间</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">状态</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {versionHistory.map((item, index) => {
                      const colors = getOperationTypeColor(item.type);
                      return (
                        <tr 
                          key={index}
                          className={`hover:bg-gray-50 transition-colors ${item.status === 'active' ? 'bg-green-50/30' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {item.status === 'active' && <span>✅</span>}
                              {item.status === 'history' && <span>📝</span>}
                              <span className="text-sm font-bold text-gray-800">{item.version}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span 
                              className="px-2 py-1 text-xs font-medium rounded"
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">{item.description}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{item.operator}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500">{item.time}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.status === 'active' ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">当前版本</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">历史版本</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.status !== 'active' && (
                              <button
                                onClick={() => switchVersion(item.version)}
                                className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                查看版本
                              </button>
                            )}
                            {item.status === 'active' && (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* 历史版本提示 */}
        {isViewingHistory && (
          <div className="flex items-center justify-center gap-3 py-2 bg-yellow-50 border-b border-yellow-100">
            <span className="text-xs text-yellow-700">⚠️ 已切换至历史版本，仅支持查看不可编辑</span>
            <button 
              onClick={() => {
                const activeVersion = versionHistory.find(v => v.status === 'active');
                if (activeVersion) {
                  setCurrentVersion(activeVersion.version);
                }
                setIsViewingHistory(false);
              }}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
            >
              返回最新
            </button>
            <button 
              onClick={() => rollbackToVersion(viewingHistoryVersion)}
              className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              恢复此版本
            </button>
          </div>
        )}
        
        {/* 回退成功提示 */}
        {rollbackSuccess && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg shadow-lg z-50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            已成功回退至{rollbackTargetVersion}版本，新版本号为{newRollbackVersion}
          </div>
        )}
        
        {/* 回退确认弹窗 */}
        {showRollbackConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">确认版本回退</h3>
                  <p className="text-xs text-gray-500">目标版本：{rollbackTargetVersion}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                确认要回退到该历史版本吗？回退后将生成新的版本记录，当前最新版本会自动存档。
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRollbackConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmRollback}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  确认回退
                </button>
              </div>
            </div>
          </div>
        )
        }
        
        {/* 导出成功提示框 */}
        {exportSuccess && (
          <div 
            ref={exportRef}
            className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">飞书文档已生成</h4>
                <p className="text-xs text-gray-500 mb-2">
                  【双11 预售期】目标测算报告（{currentVersion}）
                </p>
                <a 
                  href={feishuDocUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  打开飞书文档
                </a>
              </div>
              <button 
                onClick={() => setExportSuccess(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {promoView === 'budget' ? (
            <>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-2">
                {([
                  { key: 'overall' as const, label: '大促整体' },
                  { key: 'coupon' as const, label: '消费券' },
                  { key: 'supplement' as const, label: '追补' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setBudgetSubTab(tab.key)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${budgetSubTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {budgetSubTab === 'overall' && (
              <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">自然水位 GMV</div>
                  <div className="text-2xl font-bold text-blue-900">9,200万</div>
                  <div className="text-xs text-blue-500 mt-1">基于历史大促推算</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-xs text-green-600 mb-1">含预算 GMV 预测</div>
                  <div className="text-2xl font-bold text-green-900">1.18亿</div>
                  <div className="text-xs text-green-500 mt-1">中性预测 ·距目标差200万</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-xs text-purple-600 mb-1">AI 推荐预算</div>
                  <div className="text-2xl font-bold text-purple-900">760万</div>
                  <div className="text-xs text-purple-500 mt-1">上限 800万 · 可调整</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="text-xs text-orange-600 mb-1">达成概率</div>
                  <div className="text-2xl font-bold text-orange-900">78%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-500">2 个高风险项</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    AI 推荐预算拆分
                  </h3>
                  <button
                    onClick={() => setChannelDetailExpanded(!channelDetailExpanded)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {channelDetailExpanded ? '收起详情' : '展开详情'} <ChevronDown className={`w-3 h-3 transition-transform ${channelDetailExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                      <tr>
                        <th className="text-left py-3 px-4">渠道/玩法</th>
                        <th className="text-right py-3 px-4">建议预算</th>
                        <th className="text-right py-3 px-4">预估 ROI</th>
                        <th className="text-right py-3 px-4">预估增量 GMV</th>
                        <th className="text-center py-3 px-4">风险等级</th>
                        <th className="text-right py-3 px-4">可调幅度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: '消费券', roi: '3.8', roiColor: 'text-green-600', gmv: '3,600万', risk: '中', riskBg: 'bg-yellow-100 text-yellow-700', range: '±15%' },
                        { name: '重点类目追补', roi: '4.2', roiColor: 'text-green-600', gmv: '2,800万', risk: '低', riskBg: 'bg-green-100 text-green-700', range: '±10%' },
                        { name: 'toB商达预算', roi: '2.9', roiColor: 'text-orange-600', gmv: '1,500万', risk: '中', riskBg: 'bg-yellow-100 text-yellow-700', range: '±20%' },
                        { name: '用户运营', roi: '4.5', roiColor: 'text-green-600', gmv: '1,800万', risk: '低', riskBg: 'bg-green-100 text-green-700', range: '±10%' },
                        { name: '货架场', roi: '5.1', roiColor: 'text-green-600', gmv: '1,200万', risk: '低', riskBg: 'bg-green-100 text-green-700', range: '±10%' },
                        { name: '市场宣发', roi: '—', roiColor: 'text-gray-600', gmv: '间接贡献', risk: '中', riskBg: 'bg-yellow-100 text-yellow-700', range: '±30%' },
                        { name: '创新玩法预留', roi: '待验证', roiColor: 'text-gray-600', gmv: '待评估', risk: '高', riskBg: 'bg-red-100 text-red-700', range: '弹性' },
                      ].map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xs text-gray-400">¥</span>
                              <input
                                type="number"
                                value={promoBudgets[item.name] || 0}
                                onChange={(e) => setPromoBudgets(prev => ({ ...prev, [item.name]: Number(e.target.value) }))}
                                className="w-20 px-2 py-1 text-right font-bold text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white text-sm"
                              />
                              <span className="text-xs text-gray-400">w</span>
                            </div>
                          </td>
                          <td className={`py-3 px-4 text-right ${item.roiColor}`}>{item.roi}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{item.gmv}</td>
                          <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 ${item.riskBg} text-xs rounded-full`}>{item.risk}</span></td>
                          <td className="py-3 px-4 text-right text-gray-500">{item.range}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td className="py-3 px-4 text-gray-800">合计</td>
                        <td className="py-3 px-4 text-right text-gray-900">{Object.values(promoBudgets).reduce((a, b) => a + b, 0)}万</td>
                        <td className="py-3 px-4 text-right text-gray-600">3.7</td>
                        <td className="py-3 px-4 text-right text-gray-900">1.18亿</td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {channelDetailExpanded && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div className="text-xs text-purple-800 leading-relaxed">
                        <strong>AI 建议：</strong>若优先追求 ROI，建议从 toB商达预算下调 30 万，补至用户运营与货架场。调整后整体 ROI 预计从 3.7 提升至 3.9，GMV 影响约 +1.8%。
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    一键应用 AI 方案
                  </button>
                  <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    手动调整预算
                  </button>
                  <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    导出分配明细
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  风险识别
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-800">消费券核销率波动较大</div>
                        <div className="text-xs text-red-600 mt-1">历史同类活动核销率区间 45%~72%，波动幅度 ±27%，可能导致实际消耗偏离预测 ±25 万</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-orange-800">toB商达预算 ROI 偏低</div>
                        <div className="text-xs text-orange-600 mt-1">当前 toB商达预算预估 ROI 2.9 低于大盘均值 3.7，建议密切监控后半段效率衰减</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">应急加投建议</div>
                        <div className="text-xs text-blue-600 mt-1">当前目标略高于中性预测，建议保留 50-80 万应急加投空间，优先投入消费券与用户运营</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    方案版本
                  </h3>
                  <button onClick={() => setVersionCompareOpen(!versionCompareOpen)} className="text-xs text-blue-600 hover:text-blue-800">
                    {versionCompareOpen ? '收起对比' : '展开对比'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <div className="text-xs font-bold text-blue-800 mb-2">V1 · AI 初始方案</div>
                    <div className="space-y-1 text-xs text-blue-700">
                      <div className="flex justify-between"><span>总预算</span><span className="font-bold">760万</span></div>
                      <div className="flex justify-between"><span>GMV预测</span><span className="font-bold">1.18亿</span></div>
                      <div className="flex justify-between"><span>ROI</span><span className="font-bold">3.7</span></div>
                      <div className="flex justify-between"><span>风险项</span><span className="font-bold text-red-600">3个</span></div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs font-bold text-green-800 mb-2">V2 · ROI 优化版</div>
                    <div className="space-y-1 text-xs text-green-700">
                      <div className="flex justify-between"><span>总预算</span><span className="font-bold">760万</span></div>
                      <div className="flex justify-between"><span>GMV预测</span><span className="font-bold">1.20亿 <span className="text-green-500">↑1.8%</span></span></div>
                      <div className="flex justify-between"><span>ROI</span><span className="font-bold">3.9 <span className="text-green-500">↑0.2</span></span></div>
                      <div className="flex justify-between"><span>风险项</span><span className="font-bold text-orange-600">2个 <span className="text-green-500">↓1</span></span></div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <div className="text-xs font-bold text-gray-500 mb-2">V3 · 促中调整版</div>
                    <div className="flex items-center justify-center h-16 text-xs text-gray-400">
                      进入促中后自动生成
                    </div>
                  </div>
                </div>
                {versionCompareOpen && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-700 leading-relaxed">
                      <strong>版本摘要：</strong>V1→V2 在不增加总预算的前提下，将 toB商达预算 30 万转移至用户运营 +20 万、货架场 +10 万，GMV 预测提升 1.8%，ROI 从 3.7 升至 3.9，高风险项减少 1 个。
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button className="px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    确认当前方案
                  </button>
                  <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    生成汇报摘要
                  </button>
                </div>
              </div>
              </>
              )}

              {budgetSubTab === 'coupon' && (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-500">🔮</span>
                    <span className="text-xs font-medium text-gray-800">预估结果</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <span className="text-xs text-gray-400">📋</span>
                    <span className="text-xs text-gray-500">预估参考</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">✨</span>
                    <span className="text-sm font-medium text-gray-800">预测结果摘要</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-red-500 mt-0.5">⊘</span>
                      <div className="text-xs text-gray-700"><strong className="text-red-600">超花风险：</strong>根据当前信息，预计本次大促消费券预算会超花 <strong className="text-orange-600">4.4%</strong>（超花 <strong className="text-orange-600">35万</strong>）</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-orange-500 mt-0.5">⊘</span>
                      <div className="text-xs text-gray-700"><strong className="text-orange-600">超花原因：</strong>主要来自<span className="bg-yellow-200 px-0.5 rounded">面额300-50券</span>在推荐渠道核销超预期</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-green-500 mt-0.5">◉</span>
                      <div className="text-xs text-gray-700"><strong className="text-green-600">建议：</strong>优先对<span className="bg-yellow-200 px-0.5 rounded">高面额券+推荐流量</span>做限频，而非直接全量收券</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚙️</span>
                      <span className="font-bold text-sm text-gray-800">预算总览与风险判断</span>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      <button className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white">系统推荐</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500">Top-down</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500">Bottom-up</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">目标预算</div>
                      <div className="text-lg font-bold text-gray-900">¥800万</div>
                      <div className="text-xs text-gray-400 mt-0.5">部长通过团限额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估总算消耗</div>
                      <div className="text-lg font-bold text-blue-700">¥835万</div>
                      <div className="text-xs text-gray-400 mt-0.5">基准口径预测额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估支付消耗</div>
                      <div className="text-lg font-bold text-orange-600">¥920万</div>
                      <div className="text-xs text-gray-400 mt-0.5">支付口径预测额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估结算率</div>
                      <div className="text-lg font-bold text-gray-900">90.8%</div>
                      <div className="text-xs text-gray-400 mt-0.5">结算/发行</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预算差额</div>
                      <div className="text-lg font-bold text-green-600">+¥35万</div>
                      <div className="text-xs text-green-500 mt-0.5">+4.4%</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">超花风险等级</div>
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <span className="text-lg font-bold text-orange-600">中</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">需关注</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">风险概率</div>
                      <div className="text-lg font-bold text-gray-900">68%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1.5"><div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📈</span>
                      <span className="font-bold text-sm text-gray-800">分天预算预估趋势</span>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">预估结算消耗</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估支付消耗</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估结算率</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-900 rounded-full"></span> 系统推荐</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full border border-blue-500"></span> Top-down</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full border border-green-500"></span> Bottom-up</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">预算消耗(万)</div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={[
                        { day: '6/15', sys: 80, topDown: 75, bottomUp: 70 },
                        { day: '6/16', sys: 120, topDown: 115, bottomUp: 105 },
                        { day: '6/17', sys: 180, topDown: 170, bottomUp: 155 },
                        { day: '6/18', sys: 220, topDown: 230, bottomUp: 200 },
                        { day: '6/19', sys: 140, topDown: 150, bottomUp: 130 },
                        { day: '6/20', sys: 95, topDown: 100, bottomUp: 90 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="sys" stroke="#1F2937" strokeWidth={2} dot={{ r: 4, fill: '#1F2937' }} name="系统推荐" />
                        <Line type="monotone" dataKey="topDown" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#fff', stroke: '#60A5FA', strokeWidth: 2 }} name="Top-down" />
                        <Line type="monotone" dataKey="bottomUp" stroke="#6EE7B7" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#fff', stroke: '#6EE7B7', strokeWidth: 2 }} name="Bottom-up" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">曝买日：6/18</span>
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">爆折最大日：6/18</span>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">预算压力最大日期段：6/17~6/18</span>
                    <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">建议重点关注：活动中期段</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm">📊</span>
                    <span className="font-bold text-sm text-gray-800">明细预估</span>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">预估结算消耗</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估支付消耗</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估结算率</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                          <th className="text-left py-3 px-3">渠道</th>
                          <th className="text-left py-3 px-3">消费力分层</th>
                          <th className="text-left py-3 px-3">贴券日期</th>
                          <th className="text-right py-3 px-3">预估预算(万)</th>
                          <th className="text-right py-3 px-3">占比</th>
                          <th className="text-right py-3 px-3">6/15</th>
                          <th className="text-right py-3 px-3">6/16</th>
                          <th className="text-right py-3 px-3">6/17</th>
                          <th className="text-right py-3 px-3">6/18</th>
                          <th className="text-right py-3 px-3">6/19</th>
                          <th className="text-right py-3 px-3">6/20</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">直播</td>
                          <td className="py-3 px-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">高消费力</span></td>
                          <td className="py-3 px-3 text-gray-600">2025-02-24</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">180</td>
                          <td className="py-3 px-3 text-right text-gray-600">21.6%</td>
                          <td className="py-3 px-3 text-right text-gray-600">15</td>
                          <td className="py-3 px-3 text-right text-gray-600">18</td>
                          <td className="py-3 px-3 text-right text-gray-600">42</td>
                          <td className="py-3 px-3 text-right"><span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-bold">55</span></td>
                          <td className="py-3 px-3 text-right text-gray-600">32</td>
                          <td className="py-3 px-3 text-right text-gray-600">18</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">直播</td>
                          <td className="py-3 px-3"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">中消费力</span></td>
                          <td className="py-3 px-3 text-gray-600">2025-02-25</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">95</td>
                          <td className="py-3 px-3 text-right text-gray-600">11.4%</td>
                          <td className="py-3 px-3 text-right text-gray-600">8</td>
                          <td className="py-3 px-3 text-right text-gray-600">10</td>
                          <td className="py-3 px-3 text-right text-gray-600">22</td>
                          <td className="py-3 px-3 text-right"><span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded font-bold">28</span></td>
                          <td className="py-3 px-3 text-right text-gray-600">17</td>
                          <td className="py-3 px-3 text-right text-gray-600">10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
              )}

              {budgetSubTab === 'supplement' && (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-500">🔮</span>
                    <span className="text-xs font-medium text-gray-800">预估结果</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <span className="text-xs text-gray-400">📋</span>
                    <span className="text-xs text-gray-500">预估参考</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">✨</span>
                    <span className="text-sm font-medium text-gray-800">预测结果摘要</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-green-500 mt-0.5">◉</span>
                      <div className="text-xs text-gray-700"><strong className="text-green-600">预算充足：</strong>根据当前信息，预计本次大促追补预算消耗率 <strong className="text-green-600">92.3%</strong>，整体可控</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-orange-500 mt-0.5">⊘</span>
                      <div className="text-xs text-gray-700"><strong className="text-orange-600">关注点：</strong><span className="bg-yellow-200 px-0.5 rounded">3C数码</span>类目追补力度较大，单品补贴率接近上限，需关注边际效益</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-green-500 mt-0.5">◉</span>
                      <div className="text-xs text-gray-700"><strong className="text-green-600">建议：</strong>优先保障<span className="bg-yellow-200 px-0.5 rounded">家电、服饰</span>类目追补预算，ROI 表现优于其他类目</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚙️</span>
                      <span className="font-bold text-sm text-gray-800">预算总览与风险判断</span>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      <button className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white">系统推荐</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500">Top-down</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500">Bottom-up</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">目标预算</div>
                      <div className="text-lg font-bold text-gray-900">¥500万</div>
                      <div className="text-xs text-gray-400 mt-0.5">追补预算总额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估总算消耗</div>
                      <div className="text-lg font-bold text-blue-700">¥462万</div>
                      <div className="text-xs text-gray-400 mt-0.5">基准口径预测额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估支付消耗</div>
                      <div className="text-lg font-bold text-orange-600">¥510万</div>
                      <div className="text-xs text-gray-400 mt-0.5">支付口径预测额</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预估结算率</div>
                      <div className="text-lg font-bold text-gray-900">90.6%</div>
                      <div className="text-xs text-gray-400 mt-0.5">结算/发行</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">预算差额</div>
                      <div className="text-lg font-bold text-green-600">-¥38万</div>
                      <div className="text-xs text-green-500 mt-0.5">-7.6%</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">超花风险等级</div>
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-5 h-5 text-green-500" />
                        <span className="text-lg font-bold text-green-600">低</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">可控</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">风险概率</div>
                      <div className="text-lg font-bold text-gray-900">28%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1.5"><div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📈</span>
                      <span className="font-bold text-sm text-gray-800">分天预算预估趋势</span>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">预估结算消耗</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估支付消耗</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估结算率</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-900 rounded-full"></span> 系统推荐</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full border border-blue-500"></span> Top-down</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full border border-green-500"></span> Bottom-up</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">预算消耗(万)</div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={[
                        { day: '6/15', sys: 45, topDown: 42, bottomUp: 40 },
                        { day: '6/16', sys: 68, topDown: 65, bottomUp: 60 },
                        { day: '6/17', sys: 105, topDown: 98, bottomUp: 90 },
                        { day: '6/18', sys: 128, topDown: 135, bottomUp: 115 },
                        { day: '6/19', sys: 72, topDown: 78, bottomUp: 68 },
                        { day: '6/20', sys: 44, topDown: 48, bottomUp: 42 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="sys" stroke="#1F2937" strokeWidth={2} dot={{ r: 4, fill: '#1F2937' }} name="系统推荐" />
                        <Line type="monotone" dataKey="topDown" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#fff', stroke: '#60A5FA', strokeWidth: 2 }} name="Top-down" />
                        <Line type="monotone" dataKey="bottomUp" stroke="#6EE7B7" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#fff', stroke: '#6EE7B7', strokeWidth: 2 }} name="Bottom-up" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">曝买日：6/18</span>
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">爆折最大日：6/18</span>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">预算压力最大日期段：6/17~6/18</span>
                    <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">建议重点关注：活动中期段</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm">📊</span>
                    <span className="font-bold text-sm text-gray-800">明细预估</span>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">预估结算消耗</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估支付消耗</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">预估结算率</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                          <th className="text-left py-3 px-3">类目</th>
                          <th className="text-right py-3 px-3">预估预算(万)</th>
                          <th className="text-right py-3 px-3">占比</th>
                          <th className="text-right py-3 px-3">6/15</th>
                          <th className="text-right py-3 px-3">6/16</th>
                          <th className="text-right py-3 px-3">6/17</th>
                          <th className="text-right py-3 px-3">6/18</th>
                          <th className="text-right py-3 px-3">6/19</th>
                          <th className="text-right py-3 px-3">6/20</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">3C数码</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">145</td>
                          <td className="py-3 px-3 text-right text-gray-600">31.4%</td>
                          <td className="py-3 px-3 text-right text-gray-600">12</td>
                          <td className="py-3 px-3 text-right text-gray-600">18</td>
                          <td className="py-3 px-3 text-right text-gray-600">32</td>
                          <td className="py-3 px-3 text-right"><span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-bold">45</span></td>
                          <td className="py-3 px-3 text-right text-gray-600">24</td>
                          <td className="py-3 px-3 text-right text-gray-600">14</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">家电</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">110</td>
                          <td className="py-3 px-3 text-right text-gray-600">23.8%</td>
                          <td className="py-3 px-3 text-right text-gray-600">9</td>
                          <td className="py-3 px-3 text-right text-gray-600">14</td>
                          <td className="py-3 px-3 text-right text-gray-600">25</td>
                          <td className="py-3 px-3 text-right"><span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded font-bold">32</span></td>
                          <td className="py-3 px-3 text-right text-gray-600">18</td>
                          <td className="py-3 px-3 text-right text-gray-600">12</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">服饰</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">88</td>
                          <td className="py-3 px-3 text-right text-gray-600">19.0%</td>
                          <td className="py-3 px-3 text-right text-gray-600">8</td>
                          <td className="py-3 px-3 text-right text-gray-600">12</td>
                          <td className="py-3 px-3 text-right text-gray-600">20</td>
                          <td className="py-3 px-3 text-right text-gray-600">22</td>
                          <td className="py-3 px-3 text-right text-gray-600">15</td>
                          <td className="py-3 px-3 text-right text-gray-600">11</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">食品</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">68</td>
                          <td className="py-3 px-3 text-right text-gray-600">14.7%</td>
                          <td className="py-3 px-3 text-right text-gray-600">10</td>
                          <td className="py-3 px-3 text-right text-gray-600">11</td>
                          <td className="py-3 px-3 text-right text-gray-600">14</td>
                          <td className="py-3 px-3 text-right text-gray-600">16</td>
                          <td className="py-3 px-3 text-right text-gray-600">10</td>
                          <td className="py-3 px-3 text-right text-gray-600">7</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">美妆</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">51</td>
                          <td className="py-3 px-3 text-right text-gray-600">11.0%</td>
                          <td className="py-3 px-3 text-right text-gray-600">6</td>
                          <td className="py-3 px-3 text-right text-gray-600">8</td>
                          <td className="py-3 px-3 text-right text-gray-600">12</td>
                          <td className="py-3 px-3 text-right text-gray-600">13</td>
                          <td className="py-3 px-3 text-right text-gray-600">7</td>
                          <td className="py-3 px-3 text-right text-gray-600">5</td>
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                          <td className="py-3 px-3 text-gray-800">合计</td>
                          <td className="py-3 px-3 text-right text-gray-900">462</td>
                          <td className="py-3 px-3 text-right text-gray-900">100%</td>
                          <td className="py-3 px-3 text-right text-gray-900">45</td>
                          <td className="py-3 px-3 text-right text-gray-900">63</td>
                          <td className="py-3 px-3 text-right text-gray-900">103</td>
                          <td className="py-3 px-3 text-right text-gray-900">128</td>
                          <td className="py-3 px-3 text-right text-gray-900">74</td>
                          <td className="py-3 px-3 text-right text-gray-900">49</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
              )}
            </>
          ) : promoView === 'target' ? (
            <>
              {/* 主 Tab 切换 */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setTargetTab('calculation')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${targetTab === 'calculation' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText className="w-4 h-4" />
                  测算目标
                </button>
                <button
                  onClick={() => setTargetTab('reference')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${targetTab === 'reference' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  测算参考
                </button>
                <button
                  onClick={() => setTargetTab('logic')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${targetTab === 'logic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Workflow className="w-4 h-4" />
                  测算逻辑
                </button>
              </div>
              
              {/* 测算目标 Tab 内容 */}
              {targetTab === 'calculation' && (
              <>
              {/* 目标测算步骤流程 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      大促目标测算流程
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">按顺序完成以下步骤，目标测算结果将逐步完善</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    当前步骤：<span className="font-medium text-blue-600">{calculationStep + 1}</span> / 5
                  </div>
                </div>
                
                {/* 步骤进度条 */}
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.num}>
                      <div 
                        className={`flex items-center gap-2 cursor-pointer transition-all ${
                          index <= calculationStep ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400'
                        }`}
                        onClick={() => {
                          // 只能点击当前步骤或之前的步骤
                          if (index <= calculationStep) {
                            handleGoToStep(index);
                          }
                        }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          stepStatus[index] === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' :
                          stepStatus[index] === 'in_progress' ? 'bg-blue-500 text-white animate-pulse hover:bg-blue-600' :
                          'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}>
                          {stepStatus[index] === 'completed' ? '✓' : step.num}
                        </div>
                        <div className="hidden md:block">
                          <div className="text-xs font-medium">{step.title}</div>
                          <div className="text-xs opacity-75">{step.description}</div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 ${index < calculationStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* 步骤内容区域 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {/* 步骤1: 自然水位分日预测 */}
                  {calculationStep === 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">步骤1：大盘支付GMV自然水位分日预测</h3>
                          <p className="text-xs text-gray-500">AI将基于历史参考数据，自动预测本次大促的自然水位分日GMV</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">数据来源说明</span>
                          </div>
                          <button
                            onClick={() => setTargetTab('reference')}
                            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            去「测算参考」页确认/调整
                          </button>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          AI将参考以下历史数据进行自然水位预测：
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500">历史大促数据</div>
                            <div className="text-sm font-medium text-gray-900">2025年618数据</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500">预测大盘同比增速 (AI预估)</div>
                            <div 
                              className={`flex items-center gap-1 rounded px-2 py-1 transition-colors ${isEditingGrowth ? '' : 'cursor-pointer hover:bg-gray-100'}`}
                              onClick={() => !isEditingGrowth && setIsEditingGrowth(true)}
                            >
                              {isEditingGrowth ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="-100"
                                    max="200"
                                    value={tempGrowthRate}
                                    onChange={(e) => setTempGrowthRate(Math.max(-100, Math.min(200, parseInt(e.target.value) || 0)))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleGrowthRateSave();
                                      } else if (e.key === 'Escape') {
                                        setIsEditingGrowth(false);
                                        setTempGrowthRate(growthRate);
                                      }
                                    }}
                                    className="w-14 h-6 text-sm font-medium text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-2"
                                    autoFocus
                                  />
                                  <span className="text-sm text-gray-600">%</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGrowthRateSave();
                                    }}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsEditingGrowth(false);
                                      setTempGrowthRate(growthRate);
                                    }}
                                    className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm font-medium text-gray-900">+{growthRate}%</div>
                                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-xs text-gray-500">大促周期</div>
                            <div className="text-sm font-medium text-gray-900">6天</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI 结论说明 */}
                      {calculationStep === 0 && naturalWaterLevelData.length === 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 text-sm font-bold">AI</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900">智能匹配参考活动说明</h4>
                                <button
                                  onClick={() => {
                                    // 一键更换参考大促的逻辑
                                    const options = ['618', '双11', '双12'];
                                    const currentIndex = options.indexOf(promotionType);
                                    const nextIndex = (currentIndex + 1) % options.length;
                                    // 这里可以添加切换逻辑
                                    alert(`一键更换参考大促（演示），当前：${promotionType}，切换为：${options[nextIndex]}`);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  🔄 一键更换
                                </button>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>根据您输入的大促类型（大促{promotionType}）及活动周期，系统智能匹配了相似度最高的 <strong className="text-blue-700">{currentConfig.name}</strong> 作为参考。</p>
                                <p>匹配维度包括：<span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] mr-1">大促类型匹配</span><span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] mr-1">BigDay与节奏匹配</span><span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] mr-1">目标量级接近</span></p>
                                <p>基于历史{promotionType === '618' ? '618' : promotionType}大促的6天分日数据，系统将生成 <strong className="text-green-700">自然水位GMV预测</strong>，即不投放任何预算情况下的预测基线。</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {calculationStep === 0 && naturalWaterLevelData.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">AI 预测结论</h4>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>基于 <strong className="text-blue-700">{currentConfig.name}</strong> 历史数据，相似度达 <strong className="text-green-700">92%</strong>，已生成自然水位GMV预测结果。</p>
                                <p>预测结果显示，系统预计{promotionType === '618' ? '618' : promotionType}大促全周期自然水位GMV约为 <strong className="text-green-700">{naturalWaterLevelTotal.toLocaleString()}万</strong>。</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 步骤1底部操作栏 */}
                      {!allStepsLocked && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            {/* 左侧：返回上一步按钮（Step1时不显示） */}
                            <div className="flex items-center gap-3">
                              {calculationStep > 0 && (
                                <button
                                  onClick={handleGoBack}
                                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  返回上一步
                                </button>
                              )}
                              {/* 测算错误提示 */}
                              {calculationError && (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="text-red-500">⚠️</span>
                                  {calculationError}
                                </span>
                              )}
                            </div>

                            {/* 右侧：操作按钮组 */}
                            <div className="flex items-center gap-3">
                              {/* 状态1：首次进入/未测算过/必填项未完成 */}
                              {!stepCalculated[0] && (
                                <button
                                  onClick={() => handleRecalculate(0)}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <Zap className="w-4 h-4" />
                                  确认信息，开始测算
                                </button>
                              )}

                              {/* 状态2：测算完成，配置无修改 */}
                              {stepCalculated[0] && !stepConfigModified[0] && calculationStep < 4 && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(0)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    onClick={() => handleGoToNextStep(0)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步目标设置
                                  </button>
                                </>
                              )}

                              {/* 状态3：测算完成后修改了任意配置 */}
                              {stepCalculated[0] && stepConfigModified[0] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(0)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    disabled
                                    className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
                                    title="配置已变更，请先重新测算再继续"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步目标设置
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 步骤2: 全周期/分阶段目标 */}
                  {calculationStep === 1 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <h3 className="font-bold text-gray-900">步骤2：大盘支付GMV全周期/分阶段目标</h3>
                          <p className="text-xs text-gray-500">输入增量目标，AI将生成全周期及分阶段目标供您确认</p>
                        </div>
                      </div>
                      
                      {/* 自然水位预测结果 */}
                      <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">自然水位预测完成</span>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <span className="text-xs text-gray-600">自然水位GMV合计：</span>
                          <span className="text-lg font-bold text-green-700 ml-2">
                            {naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}万
                          </span>
                        </div>
                      </div>
                      
                      {/* 人工输入区 */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">📝</span>
                          <span className="text-sm font-medium text-gray-700">人工输入增量目标</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-2">增量目标（%）</label>
                            <input
                              type="number"
                              value={step2GrowthPercentage}
                              onFocus={() => setFocusedInput('percentage')}
                              onBlur={() => setFocusedInput(null)}
                              onChange={(e) => {
                                setStep2GrowthPercentage(e.target.value);
                                if (stepCalculated[1]) {
                                  const newConfigModified = [...stepConfigModified];
                                  newConfigModified[1] = true;
                                  setStepConfigModified(newConfigModified);
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors ${
                                focusedInput === 'percentage' 
                                  ? 'border-blue-500 focus:ring-2 focus:ring-blue-500' 
                                  : focusedInput !== null 
                                    ? 'border-gray-200 bg-gray-50' 
                                    : 'border-gray-300'
                              }`}
                              placeholder="30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-2">增量GMV目标（万元）</label>
                            <input
                              type="number"
                              value={step2GrowthGMV}
                              onFocus={() => setFocusedInput('gmv')}
                              onBlur={() => setFocusedInput(null)}
                              onChange={(e) => {
                                setStep2GrowthGMV(e.target.value);
                                if (stepCalculated[1]) {
                                  const newConfigModified = [...stepConfigModified];
                                  newConfigModified[1] = true;
                                  setStepConfigModified(newConfigModified);
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors ${
                                focusedInput === 'gmv' 
                                  ? 'border-blue-500 focus:ring-2 focus:ring-blue-500' 
                                  : focusedInput !== null 
                                    ? 'border-gray-200 bg-gray-50' 
                                    : 'border-gray-300'
                              }`}
                              placeholder="3540"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-2">全周期GMV目标（万元）</label>
                            <input
                              type="number"
                              value={step2TotalGMV}
                              onFocus={() => setFocusedInput('total')}
                              onBlur={() => setFocusedInput(null)}
                              onChange={(e) => {
                                setStep2TotalGMV(e.target.value);
                                if (stepCalculated[1]) {
                                  const newConfigModified = [...stepConfigModified];
                                  newConfigModified[1] = true;
                                  setStepConfigModified(newConfigModified);
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors ${
                                focusedInput === 'total' 
                                  ? 'border-blue-500 focus:ring-2 focus:ring-blue-500' 
                                  : focusedInput !== null 
                                    ? 'border-gray-200 bg-gray-50' 
                                    : 'border-gray-300'
                              }`}
                              placeholder="15340"
                            />
                          </div>
                        </div>
                        
                        {/* 等式布局的结果展示 */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-l-green-500">
                          <div className="flex items-center justify-between gap-2">
                            {/* 左侧：自然水位GMV */}
                            <div className="flex-1 text-center p-3">
                              <div className="text-xs text-gray-500 mb-1">自然水位GMV</div>
                              <div className="text-xl font-bold text-gray-600">
                                {naturalWaterLevelData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">万</div>
                            </div>
                            
                            {/* 加号 */}
                            <div className="text-2xl font-bold text-gray-400">+</div>
                            
                            {/* 中间：增量目标 */}
                            <div className="flex-1 text-center p-3">
                              <div className="text-xs text-gray-500 mb-1">增量目标</div>
                              <div className="text-xl font-bold text-blue-600">
                                +{parseInt(step2GrowthGMV || '0').toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">
                                万（{step2GrowthPercentage}% 增幅）
                              </div>
                            </div>
                            
                            {/* 等号 */}
                            <div className="text-2xl font-bold text-gray-400">=</div>
                            
                            {/* 右侧：全周期目标 */}
                            <div className="flex-1 text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">全周期GMV目标</div>
                              <div className="text-2xl font-bold text-green-700">
                                {parseInt(step2TotalGMV || '0').toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">万</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI结论区域 - Step 2 */}
                      {stepCalculated[1] && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">🤖</span>
                            </div>
                            <div className="flex-1 text-sm text-green-900 leading-relaxed">
                              <p className="font-medium mb-1">
                                全周期目标已确认：基于自然水位基线，当前设定增量为 <span className="text-green-700">+{step2GrowthPercentage}%</span>，全周期总目标跃升至 <span className="text-green-700 font-bold">{parseInt(step2TotalGMV).toLocaleString()}万</span>。
                              </p>
                              <p className="text-green-800/80">
                                目标加压幅度处于合理挑战区间。请进入下一步，AI 将结合周末效应与 BigDay 节奏，为您智能拆解该目标的分日规划。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 步骤2底部操作栏 */}
                      {!allStepsLocked && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            {/* 左侧：返回上一步按钮 */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleGoBack}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                返回上一步
                              </button>
                              {/* 测算错误提示 */}
                              {calculationError && (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="text-red-500">⚠️</span>
                                  {calculationError}
                                </span>
                              )}
                            </div>

                            {/* 右侧：操作按钮组 */}
                            <div className="flex items-center gap-3">
                              {/* 状态1：首次进入/未测算过/必填项未完成 */}
                              {!stepCalculated[1] && (
                                <button
                                  onClick={() => handleRecalculate(1)}
                                  disabled={!step2GrowthPercentage && !step2GrowthGMV && !step2TotalGMV}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Zap className="w-4 h-4" />
                                  确认信息，开始测算
                                </button>
                              )}

                              {/* 状态2：测算完成，配置无修改 */}
                              {stepCalculated[1] && !stepConfigModified[1] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(1)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    onClick={() => handleGoToNextStep(1)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步分日预测
                                  </button>
                                </>
                              )}

                              {/* 状态3：测算完成后修改了任意配置 */}
                              {stepCalculated[1] && stepConfigModified[1] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(1)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    disabled
                                    className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
                                    title="配置已变更，请先重新测算再继续"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步分日预测
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 步骤3: 分日GMV目标规划 */}
                  {calculationStep === 2 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">📅</span>
                        <div>
                          <h3 className="font-bold text-gray-900">步骤3：大盘支付GMV分日预测</h3>
                          <p className="text-xs text-gray-500">配置阶段节奏和预算规划，然后生成分日目标</p>
                        </div>
                      </div>
                      
                      {/* 阶段配置 */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">📝</span>
                          <span className="text-sm font-medium text-gray-700">阶段配置</span>
                        </div>
                        <div className="space-y-3">
                          {phases.map((phase, index) => (
                            <div key={phase.id} className="flex items-center gap-3">
                              <span className="w-16 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
                                阶段{index + 1}
                              </span>
                              <input
                                type="text"
                                value={phase.name}
                                onChange={(e) => {
                                  const newPhases = phases.map(p => 
                                    p.id === phase.id ? { ...p, name: e.target.value } : p
                                  );
                                  setPhases(newPhases);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="阶段名"
                              />
                              <input
                                type="date"
                                value={phase.startDate}
                                onChange={(e) => {
                                  const newPhases = phases.map(p => 
                                    p.id === phase.id ? { ...p, startDate: e.target.value } : p
                                  );
                                  setPhases(newPhases);
                                  if (stepCalculated[2]) {
                                    const newConfigModified = [...stepConfigModified];
                                    newConfigModified[2] = true;
                                    setStepConfigModified(newConfigModified);
                                  }
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-gray-400">至</span>
                              <input
                                type="date"
                                value={phase.endDate}
                                onChange={(e) => {
                                  const newPhases = phases.map(p => 
                                    p.id === phase.id ? { ...p, endDate: e.target.value } : p
                                  );
                                  setPhases(newPhases);
                                  if (stepCalculated[2]) {
                                    const newConfigModified = [...stepConfigModified];
                                    newConfigModified[2] = true;
                                    setStepConfigModified(newConfigModified);
                                  }
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {phases.length > 1 && (
                                <button
                                  onClick={() => setPhases(phases.filter(p => p.id !== phase.id))}
                                  className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  删除
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => setPhases([...phases, { id: Date.now(), name: '', startDate: '', endDate: '', isBigDay: false, aiTarget: 0, manualTarget: 0, status: 'pending' }])}
                            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                          >
                            + 添加阶段
                          </button>
                        </div>
                      </div>
                      
                      {/* 分日预算规划 - 新版设计 */}
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💰</span>
                            <span className="text-base font-semibold text-gray-800">分日预算规划</span>
                          </div>
                        </div>

                        {/* 区块 1：AI 智能解析输入区 */}
                        <div className="p-4 border-b border-gray-200">
                          {/* Tab 切换 */}
                          <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1">
                            <button
                              className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-white shadow-sm text-[#3370FF]"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              自然语言解析
                            </button>
                            <button
                              className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              文件上传解析
                            </button>
                          </div>

                          {/* 内容区域 */}
                          <div className="relative">
                            <textarea
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] focus:border-transparent text-sm resize-none"
                              rows={2}
                              placeholder="描述预算节奏，例如：大促总预算500万，其中消费券300万且80%投入在6/18 BigDay，其余按自然水位分配..."
                              defaultValue="大促总预算1500万，其中消费券800万重点投入在6/18 BigDay，追补预算400万按自然水位分布，领航预算300万均匀投放..."
                            />
                            <div className="flex justify-end mt-2">
                              <button className="px-4 py-2 bg-[#3370FF] text-white rounded-lg text-sm font-medium hover:bg-[#2954cc] transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                智能解析与填充
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 区块 2：结构化参数表单 */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 子区块 A: 资金投入配置 */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <h4 className="text-sm font-semibold text-gray-800">资金投入配置</h4>
                                <span className="px-2 py-0.5 bg-[#3370FF]/10 text-[#3370FF] text-xs font-medium rounded-full">
                                  资管填写
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">总预算</label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                      defaultValue="1500"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">万元</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">消费券预算</label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                      defaultValue="800"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">万元</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">追补预算</label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                      defaultValue="400"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">万元</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">领航预算</label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                      defaultValue="300"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">万元</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 子区块 B: 兑换效率假设 */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <h4 className="text-sm font-semibold text-gray-800">兑换效率假设</h4>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                  DS模型输出
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">全局增量兑换比</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                    defaultValue="1.25"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">消费券增量兑换比</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                    defaultValue="1.35"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">追补增量兑换比</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                    defaultValue="1.18"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1.5">领航增量兑换比</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3370FF] text-sm"
                                    defaultValue="1.22"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 区块 3：分阶段预算分布矩阵 */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-800">分阶段预算分布</h4>
                            <div className="flex items-center gap-3">
                              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3370FF]">
                                <option>按阶段天数均分</option>
                                <option>按自然水位同比例分布</option>
                                <option>向 BigDay 倾斜</option>
                              </select>
                              <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                应用分配
                              </button>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 border border-gray-200 row-span-2" rowSpan={2}>预算类型</th>
                                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 border border-gray-200 col-span-3" colSpan={3}>预热期 (6/15-6/17)</th>
                                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 border border-gray-200 bg-orange-50" colSpan={1}>
                                    <div className="flex items-center justify-center gap-1">
                                      <span>🔥</span>
                                      <span>爆发期 (6/18)</span>
                                    </div>
                                  </th>
                                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 border border-gray-200 col-span-2" colSpan={2}>返场期 (6/19-6/20)</th>
                                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-100 row-span-2" rowSpan={2}>总计</th>
                                </tr>
                                <tr className="bg-gray-50">
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200">6/15</th>
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200">6/16</th>
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200">6/17</th>
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200 bg-orange-50">6/18</th>
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200">6/19</th>
                                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 border border-gray-200">6/20</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* 一级节点：大促总预算 */}
                                <tr className="bg-gray-50">
                                  <td className="px-3 py-2 text-xs text-gray-800 border border-gray-200 font-semibold flex items-center gap-2">
                                    <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                    大促总预算
                                  </td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">480</td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">380</td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">320</td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200 bg-orange-50">820</td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">160</td>
                                  <td className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">300</td>
                                  <td className="px-3 py-2 text-center text-xs font-bold text-gray-800 border border-gray-200 bg-gray-100">1,500</td>
                                </tr>
                                {/* 二级节点：消费券预算 */}
                                <tr>
                                  <td className="px-3 py-2 text-xs text-gray-700 border border-gray-200 font-medium pl-8">消费券预算</td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="40" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="40" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="40" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200 bg-orange-50">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="540" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="60" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="80" />
                                  </td>
                                  <td className="px-3 py-2 text-center text-xs font-semibold text-gray-800 border border-gray-200 bg-gray-100">800</td>
                                </tr>
                                {/* 二级节点：追补预算 */}
                                <tr>
                                  <td className="px-3 py-2 text-xs text-gray-700 border border-gray-200 font-medium pl-8">追补预算</td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="160" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="0" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="0" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200 bg-orange-50">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="160" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="40" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="40" />
                                  </td>
                                  <td className="px-3 py-2 text-center text-xs font-semibold text-gray-800 border border-gray-200 bg-gray-100">400</td>
                                </tr>
                                {/* 二级节点：领航预算 */}
                                <tr>
                                  <td className="px-3 py-2 text-xs text-gray-700 border border-gray-200 font-medium pl-8">领航预算</td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="280" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="340" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="280" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200 bg-orange-50">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="120" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="60" />
                                  </td>
                                  <td className="px-2 py-2 border border-gray-200">
                                    <input type="number" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#3370FF]" defaultValue="180" />
                                  </td>
                                  <td className="px-3 py-2 text-center text-xs font-semibold text-gray-800 border border-gray-200 bg-gray-100">300</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      {/* BigDay配置 */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">⭐</span>
                          <span className="text-sm font-medium text-gray-700">BigDay设置</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {bigDays.map((day, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="date"
                                value={day}
                                onChange={(e) => {
                                  const newBigDays = [...bigDays];
                                  newBigDays[index] = e.target.value;
                                  setBigDays(newBigDays);
                                  if (stepCalculated[2]) {
                                    const newConfigModified = [...stepConfigModified];
                                    newConfigModified[2] = true;
                                    setStepConfigModified(newConfigModified);
                                  }
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => {
                                  setBigDays(bigDays.filter((_, i) => i !== index));
                                  if (stepCalculated[2]) {
                                    const newConfigModified = [...stepConfigModified];
                                    newConfigModified[2] = true;
                                    setStepConfigModified(newConfigModified);
                                  }
                                }}
                                className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setBigDays([...bigDays, '2026-06-18']);
                              if (stepCalculated[2]) {
                                const newConfigModified = [...stepConfigModified];
                                newConfigModified[2] = true;
                                setStepConfigModified(newConfigModified);
                              }
                            }}
                            className="px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500"
                          >
                            + 添加BigDay
                          </button>
                        </div>
                      </div>
                      
                      {/* AI结论区域 - Step 3 */}
                      {stepCalculated[2] && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">🤖</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-800 text-sm mb-2">AI预测结论</h4>
                              <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                  基于分日预算规划数据，已生成<span className="text-blue-700 font-medium">含预算支付GMV</span>预测曲线。
                                </p>
                                <p>
                                  含预算GMV相比自然水位提升 <span className="text-blue-800 font-bold">约32%</span>，其中爆发期单日峰值GMV预计可达 <span className="text-blue-800 font-bold">4,200万</span>。
                                </p>
                                {/* Gap 诊断 */}
                                <p>
                                  基于当前预算，含预算预测支付 GMV 距离目标加压线仍有 <span className="text-red-600 font-bold">{(targetGmv - 12000).toLocaleString()}万</span> Gap。
                                  主要缺口集中在「爆发期（6/18）」，建议增加消费券预算投入或提升增量兑换比假设。
                                </p>
                                <p>
                                  <span className="text-blue-700">💡 AI建议：</span> BigDay 6/18 预算占比已优化至 28%，可进一步关注实时转化率动态调整流量分配。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 步骤3底部操作栏 */}
                      {!allStepsLocked && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            {/* 左侧：返回上一步按钮 */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleGoBack}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                返回上一步
                              </button>
                              {/* 测算错误提示 */}
                              {calculationError && (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="text-red-500">⚠️</span>
                                  {calculationError}
                                </span>
                              )}
                            </div>

                            {/* 右侧：操作按钮组 */}
                            <div className="flex items-center gap-3">
                              {/* 状态1：首次进入/未测算过/必填项未完成 */}
                              {!stepCalculated[2] && (
                                <button
                                  onClick={() => handleRecalculate(2)}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <Zap className="w-4 h-4" />
                                  确认信息，开始测算
                                </button>
                              )}

                              {/* 状态2：测算完成，配置无修改 */}
                              {stepCalculated[2] && !stepConfigModified[2] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(2)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    onClick={() => handleGoToNextStep(2)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步发货预测
                                  </button>
                                </>
                              )}

                              {/* 状态3：测算完成后修改了任意配置 */}
                              {stepCalculated[2] && stepConfigModified[2] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(2)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    disabled
                                    className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
                                    title="配置已变更，请先重新测算再继续"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步发货预测
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 步骤4: 发货GMV分日预测 */}
                  {calculationStep === 3 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">📦</span>
                        <div>
                          <h3 className="font-bold text-gray-900">二、输入参数区</h3>
                          <p className="text-xs text-gray-500">配置分日目标和发货参数，预测发货情况</p>
                        </div>
                      </div>
                      
                      {/* （一）分日支付 GMV 目标（可编辑，从 Step3 自动同步） */}
                      <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">（一）分日支付 GMV 目标（可编辑，从 Step3 自动同步）</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">支持人工修改单天支付目标，修改后自动校验总金额与 Step2 大盘总目标一致性，修改后点击「重新测算发货 GMV」更新结果</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="py-2 px-3 text-left">日期</th>
                                <th className="py-2 px-3 text-center">阶段</th>
                                <th className="py-2 px-3 text-right">AI 建议支付 GMV（万）</th>
                                <th className="py-2 px-3 text-right">人工修正支付 GMV（万）</th>
                                <th className="py-2 px-3 text-center">预估结算率</th>
                                <th className="py-2 px-3 text-right">结算 GMV（万）</th>
                                <th className="py-2 px-3 text-center">说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {dailyGmvTargets.map((target, index) => {
                                const isBigDay = index === 3;
                                const isWeekend = index === 0 || index === 5;
                                const settlementRate = isBigDay ? 0.88 : isWeekend ? 0.84 : 0.85;
                                const settlementGmv = Math.round(target.manualTarget * settlementRate);
                                return (
                                  <tr key={index}>
                                    <td className="py-2 px-3 font-medium">{target.date.split('-').slice(1).join('/')}</td>
                                    <td className="py-2 px-3 text-center text-gray-600">{target.phase}</td>
                                    <td className="py-2 px-3 text-right text-gray-500">{target.aiTarget.toLocaleString()}</td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="number"
                                        value={target.manualTarget}
                                        onChange={(e) => {
                                          const newTargets = [...dailyGmvTargets];
                                          newTargets[index].manualTarget = parseInt(e.target.value) || 0;
                                          setDailyGmvTargets(newTargets);
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-center text-cyan-600">{(settlementRate * 100).toFixed(1)}%</td>
                                    <td className="py-2 px-3 text-right text-cyan-700 font-medium">{settlementGmv.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-center text-gray-400 text-xs">-</td>
                                  </tr>
                                );
                              })}
                              <tr className="bg-gray-50 font-bold">
                                <td className="py-2 px-3">合计</td>
                                <td className="py-2 px-3 text-center">-</td>
                                <td className="py-2 px-3 text-right">{dailyGmvTargets.reduce((sum, t) => sum + t.aiTarget, 0).toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-medium text-green-700">
                                  {dailyGmvTargets.reduce((sum, t) => sum + t.manualTarget, 0).toLocaleString()}
                                </td>
                                <td className="py-2 px-3 text-center text-cyan-600">-</td>
                                <td className="py-2 px-3 text-right font-medium text-cyan-700">
                                  {dailyGmvTargets.reduce((sum, t, index) => {
                                    const isBigDay = index === 3;
                                    const isWeekend = index === 0 || index === 5;
                                    const settlementRate = isBigDay ? 0.88 : isWeekend ? 0.84 : 0.85;
                                    return sum + Math.round(t.manualTarget * settlementRate);
                                  }, 0).toLocaleString()}
                                </td>
                                <td className="py-2 px-3 text-center text-xs text-gray-500">与 Step2 大盘总目标一致</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* （二）发货参数配置（只读，DS 团队维护，不可手动修改） */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">（二）发货参数配置（只读，DS 团队维护，不可手动修改）</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">hover 显示口径说明，参数为空时提示「DS 发货参数未同步，请联系 DS 团队更新数据」</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="py-2 px-3 text-left">参数</th>
                                <th className="py-2 px-3 text-center">数值</th>
                                <th className="py-2 px-3 text-left">口径说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="py-2 px-3 font-medium">T0 发货率</td>
                                <td className="py-2 px-3 text-center">30%</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">当日支付的订单，在当日完成发货的订单占比</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 font-medium">T-1 发货率</td>
                                <td className="py-2 px-3 text-center">50%</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">前 1 日支付的订单，在当日完成发货的订单占比</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 font-medium">T-2 发货率</td>
                                <td className="py-2 px-3 text-center">15%</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">前 2 日支付的订单，在当日完成发货的订单占比</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 font-medium">T+2 发货 GMV 占比</td>
                                <td className="py-2 px-3 text-center">95%</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">支付后 2 日内完成发货的订单 GMV，占当日总发货 GMV 的比例</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">底层计算逻辑复用：T-2 以外支付的发货 GMV 占比 = 1 - T+2 发货 GMV 占比 = 5%</p>
                      </div>
                      
                      {/* AI结论区域 - Step 4 */}
                      {stepCalculated[3] && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm">🤖</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-orange-800 text-sm mb-2">AI预测结论</h4>
                              <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                  根据发货率模型参数（T0:30%, T-1:50%, T-2:15%），已生成<span className="text-orange-700 font-medium">发货GMV预测</span>。
                                </p>
                                <p>
                                  全周期发货GMV预计为 <span className="text-orange-800 font-bold">8,900万</span>，较自然水位发货量提升 <span className="text-orange-700 font-bold">约29%</span>。
                                </p>
                                <p>
                                  <span className="text-orange-700">💡 AI建议：</span> 6/18 爆发期需提前完成 60% 备货，确保 T+2 发货率达标，否则可能影响用户体验及后续复购。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Step4 核心数据卡片区域 - 只在Step4测算完成后显示 */}
                      {stepCalculated[3] && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                        </div>
                      )}
                      
                      {/* 步骤4底部操作栏 */}
                      {!allStepsLocked && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            {/* 左侧：返回上一步按钮 */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleGoBack}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                返回上一步
                              </button>
                              {/* 测算错误提示 */}
                              {calculationError && (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="text-red-500">⚠️</span>
                                  {calculationError}
                                </span>
                              )}
                            </div>

                            {/* 右侧：操作按钮组 */}
                            <div className="flex items-center gap-3">
                              {/* 状态1：首次进入/未测算过/必填项未完成 */}
                              {!stepCalculated[3] && (
                                <button
                                  onClick={() => handleRecalculate(3)}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <Zap className="w-4 h-4" />
                                  确认信息，开始测算
                                </button>
                              )}

                              {/* 状态2：测算完成，配置无修改 */}
                              {stepCalculated[3] && !stepConfigModified[3] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(3)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    onClick={() => handleGoToNextStep(3)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步行业拆分
                                  </button>
                                </>
                              )}

                              {/* 状态3：测算完成后修改了任意配置 */}
                              {stepCalculated[3] && stepConfigModified[3] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(3)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    disabled
                                    className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
                                    title="配置已变更，请先重新测算再继续"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    进入下一步行业拆分
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 步骤5: 行业发货GMV预测 */}
                  {calculationStep === 4 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🏭</span>
                        <div>
                          <h3 className="font-bold text-gray-900">步骤5：行业发货GMV分日预测</h3>
                          <p className="text-xs text-gray-500">分行业预测发货GMV</p>
                        </div>
                      </div>

                      {/* 一、上游依赖数据（只读） */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">一、上游依赖数据（只读，从Step4自动同步，总盘约束）</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="py-2 px-3 text-left">指标</th>
                                <th className="py-2 px-3 text-center">数值</th>
                                <th className="py-2 px-3 text-left">说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="py-2 px-3 font-medium">大促全周期大盘总发货GMV</td>
                                <td className="py-2 px-3 text-center text-blue-700 font-bold">46,714万</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">所有行业发货目标总和必须等于该值，超出/不足时系统自动预警</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 font-medium">大盘分日发货GMV明细</td>
                                <td className="py-2 px-3 text-center text-gray-600">见Step4结果</td>
                                <td className="py-2 px-3 text-gray-500 text-xs">行业分日发货总和需与当日大盘发货目标一致</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Step5子标签页 */}
                      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4">
                        <button
                          onClick={() => setStep5SubTab('industry')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            step5SubTab === 'industry' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          行业目标拆分
                        </button>
                        <button
                          onClick={() => setStep5SubTab('session')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            step5SubTab === 'session' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          场次信息确认
                        </button>
                        <button
                          onClick={() => setStep5SubTab('history')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            step5SubTab === 'history' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          行业历史参考
                        </button>
                        <button
                          onClick={() => setStep5SubTab('result')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            step5SubTab === 'result' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          AI测算输出
                        </button>
                      </div>

                      {/* 行业目标拆分子标签页内容 */}
                      {step5SubTab === 'industry' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                📤 导出明细
                              </button>
                              <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50">
                                📥 批量导入Excel
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">支持一级/二级赛道层级联动筛选，AI自动完成二级拆分，父子级目标自动校验</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 text-left w-24">层级</th>
                                  <th className="py-2 px-3 text-left">赛道名称</th>
                                  <th className="py-2 px-3 text-right">全周期发货目标（万）</th>
                                  <th className="py-2 px-3 text-right">预热期目标（万）</th>
                                  <th className="py-2 px-3 text-right">爆发期目标（万）</th>
                                  <th className="py-2 px-3 text-right">返场期目标（万）</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {industryData.map((industry) => (
                                  <React.Fragment key={industry.id}>
                                    {/* 一级行业 */}
                                    <tr className="bg-blue-50">
                                      <td className="py-2 px-3">
                                        <button 
                                          onClick={() => {
                                            setIndustryData(industryData.map(i => 
                                              i.id === industry.id ? {...i, expanded: !i.expanded} : i
                                            ));
                                          }}
                                          className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                                        >
                                          {industry.expanded ? '▼' : '▶'}
                                        </button>
                                      </td>
                                      <td className="py-2 px-3 font-medium text-blue-800">{industry.name}</td>
                                      <td className="py-2 px-3 text-right">
                                        <input
                                          type="number"
                                          value={industry.total}
                                          disabled={allStepsLocked}
                                          className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </td>
                                      <td className="py-2 px-3 text-right">{industry.preheat.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-right">{industry.outbreak.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-right">{industry.return.toLocaleString()}</td>
                                    </tr>
                                    {/* 二级行业（展开时显示） */}
                                    {industry.expanded && industry.subIndustries.map((sub) => (
                                      <tr key={sub.id} className="bg-gray-50">
                                        <td className="py-2 px-3 pl-8"></td>
                                        <td className="py-2 px-3 text-gray-700">┗ {sub.name}</td>
                                        <td className="py-2 px-3 text-right">
                                          <input
                                            type="number"
                                            value={sub.target}
                                            disabled={allStepsLocked}
                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-right">{sub.preheat.toLocaleString()}</td>
                                        <td className="py-2 px-3 text-right">{sub.outbreak.toLocaleString()}</td>
                                        <td className="py-2 px-3 text-right">{sub.return.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                ))}
                                {/* 合计行 */}
                                <tr className="bg-green-50 font-bold">
                                  <td className="py-2 px-3" colSpan={2}>合计</td>
                                  <td className="py-2 px-3 text-right text-green-800">
                                    {industryData.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    {industryData.reduce((sum, i) => sum + i.preheat, 0).toLocaleString()}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    {industryData.reduce((sum, i) => sum + i.outbreak, 0).toLocaleString()}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    {industryData.reduce((sum, i) => sum + i.return, 0).toLocaleString()}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                            ⚠️ 目标修改实时计算同比增速，与大盘增速偏差超过±5%时自动提示确认
                          </div>
                        </div>
                      )}

                      {/* 场次信息确认子标签页内容 */}
                      {step5SubTab === 'session' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-orange-600" />
                            </div>
                            <select className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600">
                              <option>全局</option>
                              <option>3C数码</option>
                              <option>美妆护肤</option>
                              <option>家电家居</option>
                              <option>服饰鞋包</option>
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">支持全局场次配置 + 分行业个性化增量系数配置，不同行业可设置不同的场次带动效果</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 text-left">日期</th>
                                  <th className="py-2 px-3 text-left">场次类型</th>
                                  <th className="py-2 px-3 text-center">全局默认增量系数</th>
                                  <th className="py-2 px-3 text-left">分行业个性化系数</th>
                                  <th className="py-2 px-3 text-left">场次描述</th>
                                  <th className="py-2 px-3 text-center">确认状态</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {sessionData.map((session, index) => (
                                  <tr key={index}>
                                    <td className="py-2 px-3 font-medium">{session.date}</td>
                                    <td className="py-2 px-3 text-gray-700">{session.type}</td>
                                    <td className="py-2 px-3 text-center">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={session.globalCoeff}
                                        disabled={allStepsLocked}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-left text-xs text-gray-600 whitespace-pre-line">{session.industryCoeff}</td>
                                    <td className="py-2 px-3 text-gray-500 text-xs">{session.desc}</td>
                                    <td className="py-2 px-3 text-center">
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✅ 已确认</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100">
                              📋 复制同类型大促配置
                            </button>
                            <button className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded text-xs hover:bg-purple-100">
                              👁️ 预览测算结果
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 行业历史参考子标签页内容 */}
                      {step5SubTab === 'history' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Database className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 text-left">指标名</th>
                                  <th className="py-2 px-3 text-left">提供方</th>
                                  <th className="py-2 px-3 text-left">说明</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                <tr>
                                  <td className="py-2 px-3 font-medium">各行业历史发货率</td>
                                  <td className="py-2 px-3 text-gray-600">DS</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">各行业T0/T-1/T-2发货率历史值，用于发货节奏校准</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">行业场次带动系数历史值</td>
                                  <td className="py-2 px-3 text-gray-600">行业运营</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">历史同类型场次对各行业的实际带动效果参考</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">品类结构占比</td>
                                  <td className="py-2 px-3 text-gray-600">行业运营</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">各二级品类在所属一级赛道中的历史占比</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* AI测算输出子标签页内容 */}
                      {step5SubTab === 'result' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">三、AI测算输出：行业分日发货GMV结果（支持分行业筛选）</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                📤 导出明细
                              </button>
                              <select className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600">
                                <option>3C数码</option>
                                <option>美妆护肤</option>
                                <option>家电家居</option>
                                <option>服饰鞋包</option>
                                <option>其他</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded mb-3">
                            <p className="text-xs text-gray-700 font-medium mb-2">📊 计算逻辑：</p>
                            <ol className="text-xs text-gray-500 list-decimal list-inside space-y-1">
                              <li>基准水位生成：基于大盘分日发货目标 + 行业历史占比，输出各行业分日发货基准值</li>
                              <li>场次耦合调整：叠加当日场次增量系数，调整对应行业的当日发货目标</li>
                              <li>一致性校验：确保所有行业当日发货总和 = 当日大盘发货总目标</li>
                            </ol>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-2 px-3 text-left">日期</th>
                                  <th className="py-2 px-3 text-center">阶段</th>
                                  <th className="py-2 px-3 text-right">3C赛道发货GMV（万）</th>
                                  <th className="py-2 px-3 text-center">同比2024年双11增速</th>
                                  <th className="py-2 px-3 text-left">带动因素</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/15</td>
                                  <td className="py-2 px-3 text-center text-gray-600">预热期</td>
                                  <td className="py-2 px-3 text-right text-blue-700 font-medium">2,187</td>
                                  <td className="py-2 px-3 text-center text-green-600">+12%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">日常预热</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/16</td>
                                  <td className="py-2 px-3 text-center text-gray-600">预热期</td>
                                  <td className="py-2 px-3 text-right text-blue-700 font-medium">2,721</td>
                                  <td className="py-2 px-3 text-center text-green-600">+18%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">3C品类日中场带动</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/17</td>
                                  <td className="py-2 px-3 text-center text-gray-600">预热期</td>
                                  <td className="py-2 px-3 text-right text-blue-700 font-medium">2,284</td>
                                  <td className="py-2 px-3 text-center text-green-600">+11%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">日常预热</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/18</td>
                                  <td className="py-2 px-3 text-center text-orange-600">爆发期</td>
                                  <td className="py-2 px-3 text-right text-orange-700 font-bold">6,163</td>
                                  <td className="py-2 px-3 text-center text-green-600">+21%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">全品类大场带动</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/19</td>
                                  <td className="py-2 px-3 text-center text-gray-600">返场期</td>
                                  <td className="py-2 px-3 text-right text-blue-700 font-medium">1,300</td>
                                  <td className="py-2 px-3 text-center text-green-600">+8%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">服饰返场日无明显带动</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">06/20</td>
                                  <td className="py-2 px-3 text-center text-gray-600">返场期</td>
                                  <td className="py-2 px-3 text-right text-blue-700 font-medium">293</td>
                                  <td className="py-2 px-3 text-center text-green-600">+5%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">清仓期</td>
                                </tr>
                                <tr className="bg-green-50 font-bold">
                                  <td className="py-2 px-3">合计</td>
                                  <td className="py-2 px-3 text-center">-</td>
                                  <td className="py-2 px-3 text-right text-green-800">14,948</td>
                                  <td className="py-2 px-3 text-center text-green-600">+14%</td>
                                  <td className="py-2 px-3 text-gray-500 text-xs">与全周期目标一致</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      
                      {/* AI结论区域 - Step 5 */}
                      {stepCalculated[4] && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-sm">🤖</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-purple-800 text-sm mb-2">AI预测结论</h4>
                              <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                  行业拆分已完成，全链路<span className="text-purple-700 font-medium">6大行业目标</span>均已生成。
                                </p>
                                <p>
                                  <span className="text-purple-700 font-medium">服饰行业</span>预计贡献GMV <span className="text-purple-800 font-bold">4,300万</span>（占比29%），<span className="text-purple-700 font-medium">3C数码</span>预计 <span className="text-purple-800 font-bold">3,800万</span>（占比26%），为本次大促核心驱动行业。
                                </p>
                                <p>
                                  <span className="text-purple-700">💡 AI建议：</span> 美妆个护行业可在预热期增加直播场次，历史数据显示该行业预热期转化ROI最高；家电行业重点布局爆发期BigDay当日投放。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 步骤5底部操作栏 */}
                      {!allStepsLocked && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            {/* 左侧：返回上一步按钮 */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleGoBack}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                返回上一步
                              </button>
                              {/* 测算错误提示 */}
                              {calculationError && (
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <span className="text-red-500">⚠️</span>
                                  {calculationError}
                                </span>
                              )}
                            </div>

                            {/* 右侧：操作按钮组 */}
                            <div className="flex items-center gap-3">
                              {/* 状态1：首次进入/未测算过/必填项未完成 */}
                              {!stepCalculated[4] && (
                                <button
                                  onClick={() => handleRecalculate(4)}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <Zap className="w-4 h-4" />
                                  确认信息，开始测算
                                </button>
                              )}

                              {/* 状态2：测算完成 */}
                              {stepCalculated[4] && (
                                <>
                                  <button
                                    onClick={() => handleRecalculate(4)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    重新测算
                                  </button>
                                  <button
                                    onClick={handleLockAllSteps}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    确认并锁定全链路目标
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 锁定后的提示 */}
                      {allStepsLocked && (
                        <div className="bg-green-50 border-t border-green-200 p-4 -mx-6 -mb-6 rounded-b-xl">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">全链路目标已锁定，您可点击右上角“分享”按钮，导出报告或直接分享此测算链接。</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 所有步骤完成 */}
                  {calculationStep > 4 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">目标测算完成！</h3>
                      <p className="text-sm text-gray-600 mb-6">所有5个步骤已完成，您可以在下方查看完整的测算结果</p>
                      
                      {/* 汇总信息 */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">自然水位GMV</div>
                          <div className="text-2xl font-bold text-blue-700">
                            {naturalWaterLevelTotal.toLocaleString()}万
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="text-xs text-green-600 mb-1">支付GMV总目标</div>
                          <div className="text-2xl font-bold text-green-700">
                            {fullCycleTargets.reduce((sum, t) => sum + t.manualTarget, 0).toLocaleString()}万
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="text-xs text-orange-600 mb-1">发货GMV预测</div>
                          <div className="text-2xl font-bold text-orange-700">
                            {deliveryGmvData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}万
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCalculationStep(0);
                          setStepStatus(['pending', 'pending', 'pending', 'pending', 'pending']);
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        重新测算
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step2核心数据卡片区域 - 仅在step2测算完成后显示 */}
              {stepCalculated[1] && (
                <>
                  {/* 第一区块：目标管控区 */}
                  <div className="mb-8">
                    <div className="text-sm text-gray-500 mb-3 font-medium">目标设定与评估</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 目标 GMV */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">目标 GMV</div>
                        <div className="text-2xl font-bold text-blue-900" style={{ width: '300px' }}>
                          <input
                            type="number"
                            value={targetGmv}
                            onChange={(e) => setTargetGmv(Number(e.target.value))}
                            className="text-2xl font-bold text-blue-900 bg-transparent border-none focus:outline-none"
                            style={{ width: '100px' }}
                          />
                          万
                        </div>
                        <div className="text-xs text-blue-500 mt-1">可修改，资管设定目标</div>
                      </div>
                      
                      {/* 目标差值 (Gap) */}
                      {stepCalculated[2] && (
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                          <div className="text-xs text-red-600 mb-1">目标差值 (Gap)</div>
                          <div className="text-2xl font-bold text-red-700">
                            {(targetGmv - 12000).toLocaleString()}万
                          </div>
                          <div className="text-xs text-red-500 mt-1">
                            完成率 {Math.round((12000 / targetGmv) * 100)}%
                          </div>
                        </div>
                      )}
                      
                      {/* 目标达成概率 */}
                      {stepCalculated[2] && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                          <div className="text-xs text-green-600 mb-1">目标达成概率</div>
                          <div className="text-2xl font-bold text-green-700">92%</div>
                          <div className="text-xs text-green-500 mt-1">基于当前预算和历史转化率测算</div>
                        </div>
                      )}
                      
                      {/* 整体同比增速 */}
                      {calculationStep >= 4 && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                          <div className="text-xs text-green-600 mb-1">整体同比增速</div>
                          <div className="text-2xl font-bold text-green-900">支付 +13.4% / 发货 +12.4%</div>
                          <div className="text-xs text-green-500 mt-1">较 2024 年同量级大促</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 第二区块：系统预测区 */}
                  <div>
                    <div className="text-sm text-gray-500 mb-3 font-medium">系统预测</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 自然水位 GMV */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">自然水位 GMV</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {naturalWaterLevelTotal > 0 ? `${naturalWaterLevelTotal.toLocaleString()}万` : '-'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">不投预算的预测基线</div>
                      </div>
                      
                      {/* 含预算支付 GMV */}
                      {stepCalculated[2] && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">含预算支付 GMV</div>
                          <div className="text-2xl font-bold text-gray-800">12,000万</div>
                          <div className="text-xs text-gray-400 mt-1">含预算后的预测 GMV 水位</div>
                        </div>
                      )}
                      
                      {/* 全周期发货 GMV（含 T+2发货率） */}
                      {stepCalculated[3] && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">全周期发货 GMV</div>
                          <div className="text-2xl font-bold text-gray-800">8,900万</div>
                          <div className="text-xs text-gray-400 mt-1">
                            T+2发货率达标率 95% · 基于发货率模型测算
                          </div>
                        </div>
                      )}
                      
                      {/* 全周期结算 GMV（含结算率） */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">全周期结算 GMV</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {Math.round(targetGmv * (settlementRate / 100)).toLocaleString()}万
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          结算率 {settlementRate}% · 基于目标支付 GMV 测算
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 图表展示区域 - 根据步骤联动 */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {calculationStep === 0 && '大盘GMV分日预测·自然水位'}
                    {calculationStep === 1 && !stepCalculated[1] && '大盘GMV分日预测·自然水位'}
                    {calculationStep === 1 && stepCalculated[1] && '大盘GMV分日预测·目标设定'}
                    {calculationStep === 2 && (showBudgetChart ? '大盘GMV分日预测·含预算' : '大盘GMV分日预测·目标设定')}
                    {calculationStep >= 3 && '大盘GMV分日预测·完整视图'}
                    {/* 业务说明tooltip */}
                    {calculationStep === 1 && stepCalculated[1] && (
                      <div className="relative group">
                        <div className="cursor-help text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          按全周期增幅等比放大的参考线，精准分日目标将在步骤3中结合大促节奏进行规划
                        </div>
                      </div>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* 只在测算后显示自然水位支付GMV图例 */}
                    {((calculationStep === 1 && stepCalculated[1]) || calculationStep > 1 || (calculationStep === 0 && stepCalculated[0])) && (
                      <span className="flex items-center gap-1 text-xs text-blue-600"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span> 自然水位支付GMV</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-purple-600"><span className="w-3 h-0.5 bg-purple-500 inline-block" style={{borderTop: '2px dashed #8B5CF6'}}></span> 历史大促参考水位</span>
                    {/* 步骤2测算完成后显示等比加压目标参考线 */}
                    {((calculationStep === 1 && stepCalculated[1]) || calculationStep >= 2) && (
                      <span className="flex items-center gap-1 text-xs text-orange-500">
                        <span className="w-3 h-0.5 bg-orange-500 inline-block" style={{borderTop: '2px dashed #F97316'}}></span> 
                        等比加压目标参考线
                      </span>
                    )}
                    {((calculationStep === 2 && showBudgetChart) || calculationStep >= 3) && dailyGmvTargets.length > 0 && <span className="flex items-center gap-1 text-xs text-green-600"><span className="w-3 h-0.5 bg-green-500 inline-block"></span> 含预算预测支付GMV</span>}
                    {stepCalculated[2] && dailyGmvTargets.length > 0 && <span className="flex items-center gap-1 text-xs text-teal-600"><span className="w-3 h-0.5 bg-teal-500 inline-block" style={{borderTop: '2px dashed #14B8A6'}}></span> 含预算预测结算GMV</span>}
                    {calculationStep >= 3 && <span className="flex items-center gap-1 text-xs text-orange-500"><span className="w-3 h-0.5 bg-orange-500 inline-block"></span> 含预算预测发货GMV</span>}
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={
                      (calculationStep === 0 && !stepCalculated[0]) || (calculationStep === 1 && !stepCalculated[1]) ?
                        // Step1未测算时或Step2刚进入未测算时，只显示历史参考数据
                        currentConfig.waterLevelChart.map(w => ({ day: w.day, topDown: w.topDown })) :
                      calculationStep === 0 && naturalWaterLevelData.length > 0 ? 
                        naturalWaterLevelData.map((d, i) => ({
                          day: d.date.split('-').slice(1).join('/'),
                          natural: d.value,
                          topDown: currentConfig.waterLevelChart[i]?.topDown || 0,
                        })) :
                      calculationStep === 1 && stepCalculated[1] && fullCycleTargets.length > 0 && naturalWaterLevelData.length > 0 ?
                        // Step2测算完成：显示自然水位 + 等比加压目标参考线
                        naturalWaterLevelData.map((d, i) => {
                          const growthRate = parseFloat(step2GrowthPercentage || '0') / 100;
                          return {
                            day: d.date.split('-').slice(1).join('/'),
                            natural: d.value,
                            topDown: currentConfig.waterLevelChart[i]?.topDown || 0,
                            amplified: Math.round(d.value * (1 + growthRate)),
                          };
                        }) :
                      calculationStep === 2 && !showBudgetChart ?
                        // Step3初始状态：显示自然水位 + 等比加压目标参考线
                        naturalWaterLevelData.map((d, i) => {
                          const growthRate = parseFloat(step2GrowthPercentage || '0') / 100;
                          return {
                            day: d.date.split('-').slice(1).join('/'),
                            natural: d.value,
                            topDown: currentConfig.waterLevelChart[i]?.topDown || 0,
                            amplified: Math.round(d.value * (1 + growthRate)),
                          };
                        }) :
                      (calculationStep === 2 && showBudgetChart || calculationStep >= 2) && dailyGmvTargets.length > 0 ?
                        // Step3点击按钮后或Step3+，显示完整数据 + 等比加压目标参考线
                        dailyGmvTargets.map((d, i) => {
                          const growthRate = parseFloat(step2GrowthPercentage || '0') / 100;
                          const baseValue = naturalWaterLevelData[i]?.value || Math.round(d.manualTarget * 0.77);
                          // 结算率根据日期类型调整：工作日约85%，周末约84%，大促日略高约88%
                          const isBigDay = i === 3; // 假设第4天是大促日
                          const isWeekend = i === 0 || i === 5; // 假设第1和第6天是周末
                          const settlementRate = isBigDay ? 0.88 : isWeekend ? 0.84 : 0.85;
                          return {
                            day: d.date.split('-').slice(1).join('/'),
                            natural: Math.round(d.manualTarget * 0.77),
                            withBudget: d.manualTarget,
                            withBudgetShip: deliveryGmvData.find(dd => dd.date === d.date)?.value || Math.round(d.manualTarget * 0.71),
                            settlement: Math.round(d.manualTarget * settlementRate),
                            settlementRate: settlementRate,
                            topDown: currentConfig.waterLevelChart[i]?.topDown || 0,
                            amplified: Math.round(baseValue * (1 + growthRate)),
                          };
                        }) :
                        [
                          ...currentConfig.waterLevelChart.map(w => ({ day: w.day, natural: w.natural, topDown: w.topDown, bottomUp: w.bottomUp })),
                        ]
                    }>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit="万" />
                      <Tooltip />
                      {/* 只在测算后显示自然水位支付GMV线 */}
                      {((calculationStep === 1 && stepCalculated[1]) || calculationStep > 1 || (calculationStep === 0 && stepCalculated[0])) && (
                        <Line type="monotone" dataKey="natural" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="自然水位支付GMV" />
                      )}
                      <Line type="monotone" dataKey="topDown" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="历史大促参考水位" />
                      {/* 步骤2测算完成后显示等比加压目标参考线 */}
                      {((calculationStep === 1 && stepCalculated[1]) || calculationStep >= 2) && (
                        <Line 
                          type="monotone" 
                          dataKey="amplified" 
                          stroke="#F97316" 
                          strokeWidth={2} 
                          strokeDasharray="5 5" 
                          dot={{ r: 3 }} 
                          name="等比加压目标参考线" 
                        />
                      )}
                      {((calculationStep === 2 && showBudgetChart) || calculationStep >= 3) && dailyGmvTargets.length > 0 && <Line type="monotone" dataKey="withBudget" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="含预算预测支付GMV" />}
                      {stepCalculated[3] && <Line type="monotone" dataKey="withBudgetShip" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} name="含预算预测发货GMV" />}
                      {stepCalculated[2] && dailyGmvTargets.length > 0 && <Line type="monotone" dataKey="settlement" stroke="#14B8A6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="含预算预测结算GMV" />}
                      <Legend />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Step5 测算结果输出 - 联动下钻仪表盘（仅在步骤4之后显示） */}
              {stepCalculated[3] && (
                <div className="mt-6">
                  {/* 左右分栏布局 - 主图表区 + 结构下钻面板 */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {/* 左侧：主图表区（占据约 2/3 宽度） */}
                    <div className="xl:col-span-2">
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              发货GMV分日趋势
                            </h3>
                            {/* 行业下拉选择器 */}
                            {stepCalculated[4] && (
                              <select
                                value={selectedDashboardIndustry}
                                onChange={(e) => {
                                  setSelectedDashboardIndustry(e.target.value);
                                  setSelectedPoint({}); // 切换行业时重置选中点
                                }}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="total">大盘</option>
                                <option value="3c">3C数码</option>
                                <option value="home">家电</option>
                                <option value="beauty">美妆个护</option>
                              </select>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">💡 点击图中数据点可查看详情</p>
                        </div>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={dashboardMockData[selectedDashboardIndustry]?.xAxis.map(date => {
                              const dataPoint: any = { day: date };
                              dashboardMockData[selectedDashboardIndustry].series.forEach(series => {
                                const point = series.trendData.find(d => d.date === date);
                                dataPoint[series.name] = point ? point.value : null;
                              });
                              return dataPoint;
                            }) || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} unit="万" />
                              <Tooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                                        <p className="font-bold text-gray-800 mb-2">{label}</p>
                                        {payload.map((entry: any, index: number) => (
                                          <p key={index} className="flex items-center gap-2">
                                            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: entry.color }}></span>
                                            <span className="text-gray-600">{entry.name}：</span>
                                            <span className="font-bold text-gray-900">{entry.value}</span>
                                            <span className="text-gray-500">万</span>
                                          </p>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Legend iconType="line" wrapperStyle={{ fontSize: '11px' }} />
                              {dashboardMockData[selectedDashboardIndustry]?.series.map((series) => (
                                <Line 
                                  key={series.name}
                                  type="monotone" 
                                  dataKey={series.name} 
                                  stroke={series.color}
                                  strokeWidth={series.isMain ? 3 : 1.5}
                                  strokeDasharray={series.isMain ? undefined : '5 5'}
                                  dot={{ 
                                    r: series.isMain ? 4 : 2, 
                                    strokeWidth: series.isMain ? 2 : 1,
                                    fill: '#fff',
                                    cursor: 'pointer'
                                  }} 
                                  activeDot={{ r: 6, strokeWidth: 3 }}
                                  name={series.name}
                                />
                              ))}
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    {/* 右侧：结构下钻面板（占据约 1/3 宽度） */}
                    <div className="xl:col-span-1">
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-gray-800">
                            {getRightPanelData(selectedPoint).title}
                          </h4>
                          {selectedPoint.date && (
                            <button 
                              onClick={() => setSelectedPoint({})}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              重置
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {/* 环形图 */}
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getRightPanelData(selectedPoint).children}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={75}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {getRightPanelData(selectedPoint).children.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}万`} />
                                <Legend formatter={(value) => <span style={{ fontSize: '10px' }}>{value}</span>} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* 总 GMV 显示 */}
                          <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">总发货 GMV</p>
                            <p className="text-xl font-bold text-gray-900">{getRightPanelData(selectedPoint).totalGmv.toLocaleString()}万</p>
                          </div>
                          
                          {/* 二级行业数据列表 */}
                          <div>
                            <p className="text-xs text-gray-600 mb-2">行业明细：</p>
                            <div className="space-y-2">
                              {getRightPanelData(selectedPoint).children.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-xs font-medium text-gray-800">{item.name}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-bold text-gray-900">{item.value.toLocaleString()}万</span>
                                    <span className="text-xs text-gray-500 ml-2">({item.ratio})</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step5 测算结果输出 - 明细表格区（仅在步骤4之后显示） */}
              {calculationStep >= 4 && (
                <div className="mt-6">
                  {/* 表格区域Tab切换 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setResultTableTab('industry')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'industry' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        分行业GMV
                      </button>
                      <button
                        onClick={() => setResultTableTab('phase')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'phase' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        一级行业阶段
                      </button>
                      <button
                        onClick={() => setResultTableTab('subIndustry')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'subIndustry' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        二级行业
                      </button>
                      <button
                        onClick={() => setResultTableTab('daily')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        分日全行业
                      </button>
                      <button
                        onClick={() => setResultTableTab('delivery')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'delivery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        发货节奏
                      </button>
                      <button
                        onClick={() => setResultTableTab('session')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${resultTableTab === 'session' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        场次效果
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    {/* 分行业GMV全周期预测表格（已有） */}
                    {resultTableTab === 'industry' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-gray-800">分行业GMV全周期预测·含预算</h4>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">行业</th>
                                <th className="text-right py-3 px-4">支付 GMV（万）</th>
                                <th className="text-right py-3 px-4">占比</th>
                                <th className="text-right py-3 px-4">发货 GMV（万）</th>
                                <th className="text-right py-3 px-4">发货/支付比</th>
                                <th className="text-right py-3 px-4">同比增速</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {industryTableData.map((item) => (
                                <tr key={item.name} className="hover:bg-gray-50">
                                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                                  <td className="py-3 px-4 text-right font-bold text-gray-900">{item.payGmv.toLocaleString()}</td>
                                  <td className="py-3 px-4 text-right text-gray-600">{item.percentage}%</td>
                                  <td className="py-3 px-4 text-right font-bold text-gray-900">{item.deliveryGmv.toLocaleString()}</td>
                                  <td className="py-3 px-4 text-right text-gray-600">{item.ratio}%</td>
                                  <td className="py-3 px-4 text-right text-green-600">+{item.growth}%</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-50 font-bold">
                                <td className="py-3 px-4 text-gray-800">合计</td>
                                <td className="py-3 px-4 text-right text-gray-900">11,800</td>
                                <td className="py-3 px-4 text-right text-gray-600">100%</td>
                                <td className="py-3 px-4 text-right text-gray-900">10,550</td>
                                <td className="py-3 px-4 text-right text-gray-600">89.4%</td>
                                <td className="py-3 px-4 text-right text-green-600">+12.4%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* 一级行业分阶段目标明细表 */}
                    {resultTableTab === 'phase' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-gray-800">一级行业分阶段目标明细</h4>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">一级行业</th>
                                <th className="text-center py-3 px-4" colSpan={3}>预热期</th>
                                <th className="text-center py-3 px-4" colSpan={3}>爆发期</th>
                                <th className="text-center py-3 px-4" colSpan={3}>返场期</th>
                                <th className="text-center py-3 px-4" colSpan={2}>全周期</th>
                              </tr>
                              <tr>
                                <th className="text-left py-2 px-4"></th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">占比</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">占比</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">占比</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">3C数码</td>
                                <td className="py-3 px-4 text-right">960</td>
                                <td className="py-3 px-4 text-right">778</td>
                                <td className="py-3 px-4 text-right text-gray-600">30%</td>
                                <td className="py-3 px-4 text-right">1,440</td>
                                <td className="py-3 px-4 text-right">1,944</td>
                                <td className="py-3 px-4 text-right text-gray-600">45%</td>
                                <td className="py-3 px-4 text-right">800</td>
                                <td className="py-3 px-4 text-right">158</td>
                                <td className="py-3 px-4 text-right text-gray-600">25%</td>
                                <td className="py-3 px-4 text-right font-bold">3,200</td>
                                <td className="py-3 px-4 text-right font-bold">2,880</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">家电</td>
                                <td className="py-3 px-4 text-right">735</td>
                                <td className="py-3 px-4 text-right">689</td>
                                <td className="py-3 px-4 text-right text-gray-600">30%</td>
                                <td className="py-3 px-4 text-right">1,103</td>
                                <td className="py-3 px-4 text-right">1,242</td>
                                <td className="py-3 px-4 text-right text-gray-600">45%</td>
                                <td className="py-3 px-4 text-right">612</td>
                                <td className="py-3 px-4 text-right">349</td>
                                <td className="py-3 px-4 text-right text-gray-600">25%</td>
                                <td className="py-3 px-4 text-right font-bold">2,450</td>
                                <td className="py-3 px-4 text-right font-bold">2,280</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">服饰</td>
                                <td className="py-3 px-4 text-right">630</td>
                                <td className="py-3 px-4 text-right">467</td>
                                <td className="py-3 px-4 text-right text-gray-600">30%</td>
                                <td className="py-3 px-4 text-right">945</td>
                                <td className="py-3 px-4 text-right">972</td>
                                <td className="py-3 px-4 text-right text-gray-600">45%</td>
                                <td className="py-3 px-4 text-right">525</td>
                                <td className="py-3 px-4 text-right">281</td>
                                <td className="py-3 px-4 text-right text-gray-600">25%</td>
                                <td className="py-3 px-4 text-right font-bold">2,100</td>
                                <td className="py-3 px-4 text-right font-bold">1,720</td>
                              </tr>
                              <tr className="bg-gray-50 font-bold">
                                <td className="py-3 px-4 text-gray-800">合计</td>
                                <td className="py-3 px-4 text-right">3,540</td>
                                <td className="py-3 px-4 text-right">2,890</td>
                                <td className="py-3 px-4 text-right text-gray-600">30%</td>
                                <td className="py-3 px-4 text-right">5,310</td>
                                <td className="py-3 px-4 text-right">6,620</td>
                                <td className="py-3 px-4 text-right text-gray-600">45%</td>
                                <td className="py-3 px-4 text-right">2,950</td>
                                <td className="py-3 px-4 text-right">1,040</td>
                                <td className="py-3 px-4 text-right text-gray-600">25%</td>
                                <td className="py-3 px-4 text-right">11,800</td>
                                <td className="py-3 px-4 text-right">10,550</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* 二级行业全周期目标明细表 */}
                    {resultTableTab === 'subIndustry' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <h4 className="font-bold text-sm text-gray-800">二级行业全周期目标明细</h4>
                            <select className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="all">全部一级行业</option>
                              <option value="3C数码">3C数码</option>
                              <option value="家电">家电</option>
                              <option value="服饰">服饰</option>
                              <option value="食品快消">食品快消</option>
                              <option value="美妆个护">美妆个护</option>
                            </select>
                          </div>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">所属一级行业</th>
                                <th className="text-left py-3 px-4">二级行业</th>
                                <th className="text-right py-3 px-4">支付 GMV 目标（万）</th>
                                <th className="text-right py-3 px-4">占一级行业比</th>
                                <th className="text-right py-3 px-4">发货 GMV 目标（万）</th>
                                <th className="text-right py-3 px-4">发货/支付比</th>
                                <th className="text-right py-3 px-4">同比增速</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-600">3C数码</td>
                                <td className="py-3 px-4 font-medium text-gray-900">手机</td>
                                <td className="py-3 px-4 text-right font-bold">1,600</td>
                                <td className="py-3 px-4 text-right text-gray-600">50%</td>
                                <td className="py-3 px-4 text-right font-bold">1,440</td>
                                <td className="py-3 px-4 text-right text-gray-600">90%</td>
                                <td className="py-3 px-4 text-right text-green-600">+16%</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-600">3C数码</td>
                                <td className="py-3 px-4 font-medium text-gray-900">电脑整机</td>
                                <td className="py-3 px-4 text-right font-bold">960</td>
                                <td className="py-3 px-4 text-right text-gray-600">30%</td>
                                <td className="py-3 px-4 text-right font-bold">864</td>
                                <td className="py-3 px-4 text-right text-gray-600">90%</td>
                                <td className="py-3 px-4 text-right text-green-600">+14%</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-600">3C数码</td>
                                <td className="py-3 px-4 font-medium text-gray-900">数码配件</td>
                                <td className="py-3 px-4 text-right font-bold">640</td>
                                <td className="py-3 px-4 text-right text-gray-600">20%</td>
                                <td className="py-3 px-4 text-right font-bold">576</td>
                                <td className="py-3 px-4 text-right text-gray-600">90%</td>
                                <td className="py-3 px-4 text-right text-green-600">+12%</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-600">美妆个护</td>
                                <td className="py-3 px-4 font-medium text-gray-900">护肤品</td>
                                <td className="py-3 px-4 text-right font-bold">621</td>
                                <td className="py-3 px-4 text-right text-gray-600">45%</td>
                                <td className="py-3 px-4 text-right font-bold">540</td>
                                <td className="py-3 px-4 text-right text-gray-600">87%</td>
                                <td className="py-3 px-4 text-right text-green-600">+11%</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-600">美妆个护</td>
                                <td className="py-3 px-4 font-medium text-gray-900">彩妆</td>
                                <td className="py-3 px-4 text-right font-bold">483</td>
                                <td className="py-3 px-4 text-right text-gray-600">35%</td>
                                <td className="py-3 px-4 text-right font-bold">420</td>
                                <td className="py-3 px-4 text-right text-gray-600">87%</td>
                                <td className="py-3 px-4 text-right text-green-600">+10%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* 分日全行业目标汇总表 */}
                    {resultTableTab === 'daily' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <h4 className="font-bold text-sm text-gray-800">分日全行业目标汇总</h4>
                            <select className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="all">全部日期</option>
                              <option value="preheat">预热期</option>
                              <option value="outbreak">爆发期</option>
                              <option value="return">返场期</option>
                            </select>
                          </div>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">日期</th>
                                <th className="text-center py-3 px-4">阶段</th>
                                <th className="text-right py-3 px-4">大盘总支付（万）</th>
                                <th className="text-right py-3 px-4">大盘总发货（万）</th>
                                <th className="text-center py-3 px-4" colSpan={2}>3C数码</th>
                                <th className="text-center py-3 px-4" colSpan={2}>美妆个护</th>
                                <th className="text-center py-3 px-4" colSpan={2}>家电</th>
                                <th className="text-center py-3 px-4" colSpan={2}>服饰</th>
                              </tr>
                              <tr>
                                <th className="text-left py-2 px-4"></th>
                                <th className="text-center py-2 px-4"></th>
                                <th className="text-right py-2 px-4"></th>
                                <th className="text-right py-2 px-4"></th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                                <th className="text-right py-2 px-4">支付（万）</th>
                                <th className="text-right py-2 px-4">发货（万）</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/15</td>
                                <td className="py-3 px-4 text-center text-gray-600">预热期</td>
                                <td className="py-3 px-4 text-right font-bold">1,508</td>
                                <td className="py-3 px-4 text-right font-bold">4,820</td>
                                <td className="py-3 px-4 text-right">410</td>
                                <td className="py-3 px-4 text-right">1,200</td>
                                <td className="py-3 px-4 text-right">180</td>
                                <td className="py-3 px-4 text-right">540</td>
                                <td className="py-3 px-4 text-right">320</td>
                                <td className="py-3 px-4 text-right">950</td>
                                <td className="py-3 px-4 text-right">270</td>
                                <td className="py-3 px-4 text-right">820</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/16</td>
                                <td className="py-3 px-4 text-center text-gray-600">预热期</td>
                                <td className="py-3 px-4 text-right font-bold">1,573</td>
                                <td className="py-3 px-4 text-right font-bold">5,036</td>
                                <td className="py-3 px-4 text-right">780</td>
                                <td className="py-3 px-4 text-right">2,100</td>
                                <td className="py-3 px-4 text-right">185</td>
                                <td className="py-3 px-4 text-right">550</td>
                                <td className="py-3 px-4 text-right">310</td>
                                <td className="py-3 px-4 text-right">960</td>
                                <td className="py-3 px-4 text-right">160</td>
                                <td className="py-3 px-4 text-right">510</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/17</td>
                                <td className="py-3 px-4 text-center text-gray-600">预热期</td>
                                <td className="py-3 px-4 text-right font-bold">1,639</td>
                                <td className="py-3 px-4 text-right font-bold">5,481</td>
                                <td className="py-3 px-4 text-right">390</td>
                                <td className="py-3 px-4 text-right">1,260</td>
                                <td className="py-3 px-4 text-right">410</td>
                                <td className="py-3 px-4 text-right">1,150</td>
                                <td className="py-3 px-4 text-right">330</td>
                                <td className="py-3 px-4 text-right">980</td>
                                <td className="py-3 px-4 text-right">220</td>
                                <td className="py-3 px-4 text-right">690</td>
                              </tr>
                              <tr className="hover:bg-gray-50 bg-blue-50">
                                <td className="py-3 px-4 font-bold text-gray-900">06/18</td>
                                <td className="py-3 px-4 text-center text-red-600 font-bold">爆发期</td>
                                <td className="py-3 px-4 text-right font-bold text-red-600">5,507</td>
                                <td className="py-3 px-4 text-right font-bold text-red-600">8,138</td>
                                <td className="py-3 px-4 text-right font-bold">1,440</td>
                                <td className="py-3 px-4 text-right font-bold">1,944</td>
                                <td className="py-3 px-4 text-right font-bold">621</td>
                                <td className="py-3 px-4 text-right font-bold">843</td>
                                <td className="py-3 px-4 text-right font-bold">1,103</td>
                                <td className="py-3 px-4 text-right font-bold">1,242</td>
                                <td className="py-3 px-4 text-right font-bold">945</td>
                                <td className="py-3 px-4 text-right font-bold">972</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/19</td>
                                <td className="py-3 px-4 text-center text-gray-600">返场期</td>
                                <td className="py-3 px-4 text-right font-bold">2,845</td>
                                <td className="py-3 px-4 text-right font-bold">6,230</td>
                                <td className="py-3 px-4 text-right">750</td>
                                <td className="py-3 px-4 text-right">1,800</td>
                                <td className="py-3 px-4 text-right">320</td>
                                <td className="py-3 px-4 text-right">850</td>
                                <td className="py-3 px-4 text-right">580</td>
                                <td className="py-3 px-4 text-right">1,560</td>
                                <td className="py-3 px-4 text-right">490</td>
                                <td className="py-3 px-4 text-right">1,240</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/20</td>
                                <td className="py-3 px-4 text-center text-gray-600">返场期</td>
                                <td className="py-3 px-4 text-right font-bold">1,980</td>
                                <td className="py-3 px-4 text-right font-bold">4,850</td>
                                <td className="py-3 px-4 text-right">520</td>
                                <td className="py-3 px-4 text-right">1,350</td>
                                <td className="py-3 px-4 text-right">230</td>
                                <td className="py-3 px-4 text-right">720</td>
                                <td className="py-3 px-4 text-right">410</td>
                                <td className="py-3 px-4 text-right">1,180</td>
                                <td className="py-3 px-4 text-right">340</td>
                                <td className="py-3 px-4 text-right">920</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* 发货节奏指标明细表 */}
                    {resultTableTab === 'delivery' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-gray-800">发货节奏指标明细</h4>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">行业</th>
                                <th className="text-right py-3 px-4">T0发货率</th>
                                <th className="text-right py-3 px-4">T1发货率</th>
                                <th className="text-right py-3 px-4">T2发货率</th>
                                <th className="text-right py-3 px-4">T3+发货占比</th>
                                <th className="text-right py-3 px-4">发货/支付比</th>
                                <th className="text-right py-3 px-4">预计峰值单量</th>
                                <th className="text-center py-3 px-4">仓配承载校验</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">3C数码</td>
                                <td className="py-3 px-4 text-right">30%</td>
                                <td className="py-3 px-4 text-right">50%</td>
                                <td className="py-3 px-4 text-right">15%</td>
                                <td className="py-3 px-4 text-right text-green-600">5%</td>
                                <td className="py-3 px-4 text-right">90%</td>
                                <td className="py-3 px-4 text-right">120万</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ 充足</span>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">家电</td>
                                <td className="py-3 px-4 text-right">20%</td>
                                <td className="py-3 px-4 text-right">45%</td>
                                <td className="py-3 px-4 text-right">25%</td>
                                <td className="py-3 px-4 text-right text-yellow-600">10%</td>
                                <td className="py-3 px-4 text-right">93.1%</td>
                                <td className="py-3 px-4 text-right">85万</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ 充足</span>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">服饰</td>
                                <td className="py-3 px-4 text-right">25%</td>
                                <td className="py-3 px-4 text-right">35%</td>
                                <td className="py-3 px-4 text-right">30%</td>
                                <td className="py-3 px-4 text-right text-yellow-600">10%</td>
                                <td className="py-3 px-4 text-right">81.9%</td>
                                <td className="py-3 px-4 text-right">210万</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">⚠ 接近饱和</span>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">食品快消</td>
                                <td className="py-3 px-4 text-right">40%</td>
                                <td className="py-3 px-4 text-right">40%</td>
                                <td className="py-3 px-4 text-right">15%</td>
                                <td className="py-3 px-4 text-right text-green-600">5%</td>
                                <td className="py-3 px-4 text-right">95.1%</td>
                                <td className="py-3 px-4 text-right">90万</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ 充足</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* 场次效果验证明细表 */}
                    {resultTableTab === 'session' && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-gray-800">场次效果验证明细</h4>
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                            <Download className="w-3 h-3" />
                            导出明细
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                              <tr>
                                <th className="text-left py-3 px-4">场次日期</th>
                                <th className="text-left py-3 px-4">场次类型</th>
                                <th className="text-left py-3 px-4">目标行业</th>
                                <th className="text-right py-3 px-4">预期带动系数</th>
                                <th className="text-right py-3 px-4">实际带动系数</th>
                                <th className="text-right py-3 px-4">差值</th>
                                <th className="text-right py-3 px-4">GMV增量贡献（万）</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/16</td>
                                <td className="py-3 px-4">中场（3C品类日）</td>
                                <td className="py-3 px-4">3C全品类</td>
                                <td className="py-3 px-4 text-right">1.3</td>
                                <td className="py-3 px-4 text-right font-bold text-blue-600">1.32</td>
                                <td className="py-3 px-4 text-right text-green-600">+2%</td>
                                <td className="py-3 px-4 text-right font-bold">+280</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/17</td>
                                <td className="py-3 px-4">中场（美妆品类日）</td>
                                <td className="py-3 px-4">美妆全品类</td>
                                <td className="py-3 px-4 text-right">1.2</td>
                                <td className="py-3 px-4 text-right font-bold text-blue-600">1.25</td>
                                <td className="py-3 px-4 text-right text-green-600">+5%</td>
                                <td className="py-3 px-4 text-right font-bold">+190</td>
                              </tr>
                              <tr className="hover:bg-gray-50 bg-blue-50">
                                <td className="py-3 px-4 font-bold text-gray-900">06/18</td>
                                <td className="py-3 px-4 font-bold text-red-600">大场（全品类爆发）</td>
                                <td className="py-3 px-4">全行业</td>
                                <td className="py-3 px-4 text-right">1.3</td>
                                <td className="py-3 px-4 text-right font-bold text-blue-600">1.38</td>
                                <td className="py-3 px-4 text-right text-green-600">+8%</td>
                                <td className="py-3 px-4 text-right font-bold text-red-600">+1,250</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">06/19</td>
                                <td className="py-3 px-4">中场（服饰返场日）</td>
                                <td className="py-3 px-4">服饰全品类</td>
                                <td className="py-3 px-4 text-right">1.15</td>
                                <td className="py-3 px-4 text-right font-bold text-blue-600">1.13</td>
                                <td className="py-3 px-4 text-right text-orange-600">-2%</td>
                                <td className="py-3 px-4 text-right font-bold">+80</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 步骤跳转二次确认弹窗 */}
              {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">确认继续</h3>
                    <p className="text-sm text-gray-600 mb-6">当前结果未锁定，进入下一步后无法返回修改，是否确认？</p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmDialog(false);
                          handleGoToNextStep(calculationStep);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        确认继续
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </>
              )}
              

              {/* 测算参考 Tab 内容 */}
              {targetTab === 'reference' && (
              <>

              

                
                {/* 二级 Tab 切换 */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 mb-4 border border-gray-200">
                  <button
                    onClick={() => setReferenceSubTab('history')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${referenceSubTab === 'history' ? 'bg-white text-blue-600 shadow-sm border border-blue-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    历史参考数据
                  </button>

                  <button
                    onClick={() => setReferenceSubTab('external')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${referenceSubTab === 'external' ? 'bg-white text-blue-600 shadow-sm border border-blue-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    外部环境信息
                  </button>
                </div>
                
                {/* 历史参考数据 */}
                {referenceSubTab === 'history' && (
                <>
                  {/* Top-down 整体趋势 */}
                  <div className="bg-white rounded-xl border border-gray-200 mb-4">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <h3 className="font-bold text-sm text-gray-800">整体趋势参考（Top-down）</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">系统已获取</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">大促类型匹配</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">BigDay与节奏匹配</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">目标量级接近</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">预算规模接近</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <FileText size={14} />
                          <span>查看明细</span>
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1">
                          <RefreshCw size={14} />
                          <span>更换参考活动</span>
                        </button>
                        <button className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          一键复制历史方案
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">历史参考活动</div>
                        <div className="text-sm font-medium text-gray-800">{currentConfig.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">历史参考日期</div>
                        <div className="text-sm font-medium text-gray-800">{currentConfig.period}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">相似度</div>
                        <div className="text-sm font-bold text-green-600">92%</div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <table className="w-full text-sm">
                          <colgroup>
                            <col className="w-32" />
                            <col className="w-32" />
                            <col className="w-28" />
                            <col className="w-28" />
                            <col className="w-36" />
                            <col className="w-28" />
                            <col className="w-24" />
                            <col className="w-28" />
                          </colgroup>
                          <thead className="bg-gray-50">
                            <tr className="text-gray-600 font-medium">
                              <th className="sticky left-0 z-20 text-left py-2 px-3 bg-gray-50">参考日期</th>
                              <th className="sticky left-32 z-20 text-left py-2 px-3 bg-gray-50 border-l-2 border-gray-200">阶段</th>
                              <th className="text-right py-2 px-3 bg-gray-50">支付GMV(万)</th>
                              <th className="text-right py-2 px-3 bg-gray-50">发货GMV(万)</th>
                              <th className="text-right py-2 px-3 bg-gray-50">发货GMV限支付日(万)</th>
                              <th className="text-right py-2 px-3 bg-gray-50">结算GMV(万)</th>
                              <th className="text-right py-2 px-3 bg-gray-50">T+2发货率</th>
                              <th className="text-right py-2 px-3 bg-gray-50">总预算消耗(万)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentConfig.historyTopDown.map((row, index) => (
                              <tr key={index} className={`hover:bg-gray-50 ${row.phase === '爆发期' ? 'bg-red-50' : ''}`}>
                                <td className={`sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white ${row.phase === '爆发期' ? 'font-medium' : ''}`}>{row.date}</td>
                                <td className={`sticky left-32 z-10 py-2 px-3 bg-white border-l-2 border-gray-200 ${row.phase === '爆发期' ? '' : 'text-gray-700'}`}>
                                  {row.phase === '爆发期' ? (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">BigDay</span>
                                  ) : row.phase}
                                </td>
                                <td className={`py-2 px-3 text-right font-medium text-gray-800 ${row.phase === '爆发期' ? 'font-bold text-red-600' : ''}`}>{row.gmv.toLocaleString()}</td>
                                <td className="py-2 px-3 text-right text-gray-600">{row.deliveryGmv.toLocaleString()}</td>
                                <td className="py-2 px-3 text-right text-gray-600">{row.deliveryGmvLimit.toLocaleString()}</td>
                                <td className={`py-2 px-3 text-right font-medium text-gray-800 ${row.phase === '爆发期' ? 'font-bold' : ''}`}>{row.settlementGmv.toLocaleString()}</td>
                                <td className="py-2 px-3 text-right text-gray-600">{row.t2Rate}%</td>
                                <td className={`py-2 px-3 text-right text-gray-600 ${row.phase === '爆发期' ? 'font-bold text-red-600' : ''}`}>{row.budget}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 divide-y divide-gray-200">
                            <tr>
                              <td colSpan={2} className="sticky left-0 z-10 py-2 px-3 text-gray-600 font-medium bg-gray-50">合计</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyTopDown.reduce((sum, r) => sum + r.gmv, 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyTopDown.reduce((sum, r) => sum + r.deliveryGmv, 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyTopDown.reduce((sum, r) => sum + r.deliveryGmvLimit, 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyTopDown.reduce((sum, r) => sum + r.settlementGmv, 0).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{(currentConfig.historyTopDown.reduce((sum, r) => sum + r.t2Rate, 0) / currentConfig.historyTopDown.length).toFixed(1)}%</td>
                              <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyTopDown.reduce((sum, r) => sum + r.budget, 0)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="text-xs text-gray-500">说明: 用于整体趋势预测，重点参考历史当天预算消耗节奏</div>
                    </div>
                  </div>
                  
                  {/* Bottom-up 结构参考 */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <h3 className="font-bold text-sm text-gray-800">结构参考（Bottom-up）</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">系统已获取</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">行业结构匹配</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">预算结构匹配</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <FileText size={14} />
                          <span>查看明细</span>
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1">
                          <RefreshCw size={14} />
                          <span>更换参考活动</span>
                        </button>
                        <button className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          一键复制历史方案
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">历史参考活动</div>
                        <div className="text-sm font-medium text-gray-800">{currentConfig.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">历史参考日期</div>
                        <div className="text-sm font-medium text-gray-800">{currentConfig.period}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">相似度</div>
                        <div className="text-sm font-bold text-green-600">88%</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          <table className="w-full text-sm">
                            <colgroup>
                              <col className="w-28" />
                              <col className="w-28" />
                              <col className="w-32" />
                              <col className="w-32" />
                              <col className="w-36" />
                              <col className="w-32" />
                              <col className="w-32" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-28" />
                              <col className="w-24" />
                              <col className="w-24" />
                            </colgroup>
                            <thead className="bg-gray-50">
                              <tr className="text-gray-600 font-medium">
                                <th className="sticky left-0 z-20 text-left py-2 px-3 bg-gray-50">一级赛道</th>
                                <th className="sticky left-28 z-20 text-left py-2 px-3 bg-gray-50">二级赛道</th>
                                <th className="sticky left-56 z-20 text-right py-2 px-3 bg-gray-50 border-l-2 border-gray-200">支付GMV(万)</th>
                                <th className="text-right py-2 px-3 bg-gray-50">发货GMV(万)</th>
                                <th className="text-right py-2 px-3 bg-gray-50">发货GMV(限支付日，万)</th>
                                <th className="text-right py-2 px-3 bg-gray-50">结算GMV(万)</th>
                                <th className="text-right py-2 px-3 bg-gray-50">总预算消耗(万)</th>
                                <th className="text-right py-2 px-3 bg-gray-50">占比</th>
                                {currentConfig.historyTopDown.slice(0, 6).map((_, idx) => (
                                  <th key={idx} className={`text-center py-2 px-2 bg-gray-50 ${idx === 3 ? 'bg-red-50' : ''}`}>{currentConfig.historyTopDown[idx]?.date.split('-').slice(1).join('/') || `0${17 + idx}/`}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {currentConfig.historyBottomUp.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">{row.industry}</td>
                                  <td className="sticky left-28 z-10 py-2 px-3 text-gray-600 bg-white">{row.subIndustry}</td>
                                  <td className="sticky left-56 z-10 py-2 px-3 text-right text-gray-600 bg-white border-l-2 border-gray-200">{row.gmv.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right text-gray-600">{row.deliveryGmv.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right text-gray-600">{row.deliveryGmvLimit.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right text-gray-600">{row.settlementGmv.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right font-medium text-gray-800">{row.budget}</td>
                                  <td className="py-2 px-3 text-right text-gray-600">{row.ratio}</td>
                                  {row.daily.slice(0, 6).map((val, idx) => (
                                    <td key={idx} className={`py-2 px-2 text-center text-gray-600 ${idx === 3 ? 'font-medium text-red-600 bg-red-50' : ''}`}>{val}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td className="sticky left-0 z-10 py-2 px-3 text-gray-600 font-medium bg-gray-50">合计</td>
                                <td className="sticky left-28 z-10 py-2 px-3 bg-gray-50"></td>
                                <td className="sticky left-56 z-10 py-2 px-3 text-right font-bold text-gray-800 bg-gray-50 border-l-2 border-gray-200">{currentConfig.historyBottomUp.reduce((sum, r) => sum + r.gmv, 0).toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyBottomUp.reduce((sum, r) => sum + r.deliveryGmv, 0).toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyBottomUp.reduce((sum, r) => sum + r.deliveryGmvLimit, 0).toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyBottomUp.reduce((sum, r) => sum + r.settlementGmv, 0).toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800">{currentConfig.historyBottomUp.reduce((sum, r) => sum + r.budget, 0)}</td>
                                <td className="py-2 px-3 text-right font-bold text-gray-800">100%</td>
                                {currentConfig.historyTopDown.slice(0, 6).map((_, idx) => (
                                  <td key={idx} className={`py-2 px-2 text-center font-bold text-gray-800 ${idx === 3 ? 'text-red-600 bg-red-50' : ''}`}>
                                    {currentConfig.historyBottomUp.reduce((sum, r) => sum + (r.daily[idx] || 0), 0)}
                                  </td>
                                ))}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          <table className="w-full text-sm">
                            <colgroup>
                              <col className="w-40" />
                              <col className="w-28" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-24" />
                              <col className="w-28" />
                              <col className="w-24" />
                              <col className="w-24" />
                            </colgroup>
                            <thead className="bg-gray-50">
                              <tr className="text-gray-600 font-medium">
                                <th className="sticky left-0 z-20 text-left py-2 px-3 bg-gray-50">预算类型</th>
                                <th className="sticky left-48 z-20 text-right py-2 px-3 bg-gray-50">全周期消耗(万)</th>
                                <th className="sticky left-80 z-20 text-right py-2 px-3 bg-gray-50">占总预算比例</th>
                                <th className="sticky left-108 z-20 text-right py-2 px-3 bg-gray-50 border-l-2 border-gray-200">增量兑换比</th>
                                {currentConfig.historyTopDown.slice(0, 6).map((_, idx) => (
                                  <th key={idx} className={`text-center py-2 px-2 bg-gray-50 ${idx === 3 ? 'bg-red-50' : ''}`}>{currentConfig.historyTopDown[idx]?.date.split('-').slice(1).join('/') || `0${17 + idx}/`}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {currentConfig.budgetStructure.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">{row.type}</td>
                                  <td className="sticky left-48 z-10 py-2 px-3 text-right font-medium text-gray-800 bg-white">{row.total}</td>
                                  <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-white">{row.ratio}</td>
                                  <td className="sticky left-108 z-10 py-2 px-3 text-right text-gray-600 bg-white border-l-2 border-gray-200">{row.type === '其他预算' ? '-' : (row.type === '消费券预算' ? '3.2' : row.type === '追补预算' ? '2.8' : '3.5')}</td>
                                  {row.daily.slice(0, 6).map((val, idx) => (
                                    <td key={idx} className={`py-2 px-2 text-center text-gray-600 ${idx === 3 ? 'font-medium text-red-600 bg-red-50' : ''}`}>{val}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td className="sticky left-0 z-10 py-2 px-3 text-gray-600 font-medium bg-gray-50">合计</td>
                                <td className="sticky left-48 z-10 py-2 px-3 text-right font-bold text-gray-800 bg-gray-50">{currentConfig.budgetStructure.reduce((sum, r) => sum + r.total, 0)}</td>
                                <td className="sticky left-80 z-10 py-2 px-3 text-right font-bold text-gray-800 bg-gray-50">100%</td>
                                <td className="sticky left-108 z-10 py-2 px-3 text-right text-gray-600 bg-gray-50 border-l-2 border-gray-200">-</td>
                                {currentConfig.historyTopDown.slice(0, 6).map((_, idx) => (
                                  <td key={idx} className={`py-2 px-2 text-center font-bold text-gray-800 ${idx === 3 ? 'text-red-600 bg-red-50' : ''}`}>
                                    {currentConfig.budgetStructure.reduce((sum, r) => sum + (r.daily[idx] || 0), 0)}
                                  </td>
                                ))}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="text-xs text-gray-500">说明: 用于结构化预测，重点参考历史分渠道、消费力等级预算消耗结构</div>
                    </div>
                  </div>
                  
                  {/* 历史关键参数 */}
                  <div className="bg-white rounded-xl border border-gray-200 mb-4">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-bold text-sm text-gray-800">历史关键参数</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">数仓获取</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">T+2发货率</div>
                        <div className="text-xl font-bold text-gray-900">89.8%</div>
                        <div className="text-xs text-gray-500 mt-1">Big Day峰值 90.2%</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">结算率</div>
                        <div className="text-xl font-bold text-gray-900">94.2%</div>
                        <div className="text-xs text-gray-500 mt-1">T+7结算口径</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">增量兑换比</div>
                        <div className="text-xl font-bold text-purple-600">1:6.8</div>
                        <div className="text-xs text-gray-500 mt-1">历史最优水位</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">发货GMV/限支付日</div>
                        <div className="text-xl font-bold text-green-600">92.5%</div>
                        <div className="text-xs text-gray-500 mt-1">T-2窗口占比</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 预算结构表格 */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <table className="w-full text-sm">
                          <colgroup>
                            <col className="w-40" />
                            <col className="w-28" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-28" />
                            <col className="w-24" />
                            <col className="w-24" />
                          </colgroup>
                          <thead className="bg-gray-50">
                            <tr className="text-gray-600 font-medium">
                              <th className="sticky left-0 z-20 text-left py-2 px-3 bg-gray-50">预算类型</th>
                              <th className="sticky left-48 z-20 text-right py-2 px-3 bg-gray-50">全周期消耗(万)</th>
                              <th className="sticky left-80 z-20 text-right py-2 px-3 bg-gray-50">增量兑换比</th>
                              <th className="sticky left-108 z-20 text-center py-2 px-3 bg-gray-50 border-l-2 border-gray-200">06/15</th>
                              <th className="text-center py-2 px-3 bg-gray-50">06/16</th>
                              <th className="text-center py-2 px-3 bg-gray-50">06/17</th>
                              <th className="text-center py-2 px-3 bg-red-50">06/18</th>
                              <th className="text-center py-2 px-3 bg-gray-50">06/19</th>
                              <th className="text-center py-2 px-3 bg-gray-50">06/20</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">消费券预算</td>
                              <td className="sticky left-48 z-10 py-2 px-3 text-right font-medium text-gray-800 bg-white">293</td>
                              <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-white">3.2</td>
                              <td className="sticky left-108 z-10 py-2 px-3 text-center text-gray-600 bg-white border-l-2 border-gray-200">36</td>
                              <td className="py-2 px-3 text-center text-gray-600">39</td>
                              <td className="py-2 px-3 text-center text-gray-600">44</td>
                              <td className="py-2 px-3 text-center font-medium text-red-600 bg-red-50">98</td>
                              <td className="py-2 px-3 text-center text-gray-600">41</td>
                              <td className="py-2 px-3 text-center text-gray-600">35</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">追补预算</td>
                              <td className="sticky left-48 z-10 py-2 px-3 text-right font-medium text-gray-800 bg-white">112</td>
                              <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-white">2.8</td>
                              <td className="sticky left-108 z-10 py-2 px-3 text-center text-gray-600 bg-white border-l-2 border-gray-200">13</td>
                              <td className="py-2 px-3 text-center text-gray-600">15</td>
                              <td className="py-2 px-3 text-center text-gray-600">17</td>
                              <td className="py-2 px-3 text-center font-medium text-red-600 bg-red-50">37</td>
                              <td className="py-2 px-3 text-center text-gray-600">18</td>
                              <td className="py-2 px-3 text-center text-gray-600">12</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">领航预算</td>
                              <td className="sticky left-48 z-10 py-2 px-3 text-right font-medium text-gray-800 bg-white">84</td>
                              <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-white">3.5</td>
                              <td className="sticky left-108 z-10 py-2 px-3 text-center text-gray-600 bg-white border-l-2 border-gray-200">10</td>
                              <td className="py-2 px-3 text-center text-gray-600">11</td>
                              <td className="py-2 px-3 text-center text-gray-600">13</td>
                              <td className="py-2 px-3 text-center font-medium text-red-600 bg-red-50">28</td>
                              <td className="py-2 px-3 text-center text-gray-600">14</td>
                              <td className="py-2 px-3 text-center text-gray-600">8</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 py-2 px-3 text-gray-700 bg-white">其他预算</td>
                              <td className="sticky left-48 z-10 py-2 px-3 text-right font-medium text-gray-800 bg-white">209</td>
                              <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-white">-</td>
                              <td className="sticky left-108 z-10 py-2 px-3 text-center text-gray-600 bg-white border-l-2 border-gray-200">26</td>
                              <td className="py-2 px-3 text-center text-gray-600">27</td>
                              <td className="py-2 px-3 text-center text-gray-600">31</td>
                              <td className="py-2 px-3 text-center font-medium text-red-600 bg-red-50">72</td>
                              <td className="py-2 px-3 text-center text-gray-600">25</td>
                              <td className="py-2 px-3 text-center text-gray-600">28</td>
                            </tr>
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td className="sticky left-0 z-10 py-2 px-3 text-gray-600 font-medium bg-gray-50">合计</td>
                              <td className="sticky left-48 z-10 py-2 px-3 text-right font-bold text-gray-800 bg-gray-50">698</td>
                              <td className="sticky left-80 z-10 py-2 px-3 text-right text-gray-600 bg-gray-50">-</td>
                              <td className="sticky left-108 z-10 py-2 px-3 text-center font-bold text-gray-800 bg-gray-50 border-l-2 border-gray-200">85</td>
                              <td className="py-2 px-3 text-center font-bold text-gray-800">92</td>
                              <td className="py-2 px-3 text-center font-bold text-gray-800">105</td>
                              <td className="py-2 px-3 text-center font-bold text-red-600 bg-red-50">235</td>
                              <td className="py-2 px-3 text-center font-bold text-gray-800">98</td>
                              <td className="py-2 px-3 text-center font-bold text-gray-800">83</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="text-xs text-gray-500">说明: 用于结构化预测，重点参考历史分渠道、消费力等级预算消耗结构</div>
                    </div>
                  </div>
                </>
                )}
                
                {/* 外部环境信息 */}
                {referenceSubTab === 'external' && (
                <>
                  {/* 天气日历信息 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Cloud className="w-4 h-4 text-blue-500" />
                      <h3 className="font-bold text-sm text-gray-800">天气 / 日历</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">系统已获取</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                          <tr>
                            <th className="text-left py-2 px-3">日期</th>
                            <th className="text-center py-2 px-3">类型</th>
                            <th className="text-center py-2 px-3">天气</th>
                            <th className="text-center py-2 px-3">温度</th>
                            <th className="text-left py-2 px-3">备注</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentConfig.weather.map((row, index) => (
                            <tr key={index} className={`hover:bg-gray-50 ${row.type === '大促日' ? 'bg-red-50' : ''}`}>
                              <td className={`py-2 px-3 text-gray-700 ${row.type === '大促日' ? 'text-red-700 font-medium' : ''}`}>{row.date}</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-2 py-0.5 text-xs rounded ${row.type === '大促日' ? 'bg-red-100 text-red-700' : row.type === '周末' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {row.type}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">{row.weather}</td>
                              <td className="py-2 px-3 text-center text-gray-600">{row.temp}</td>
                              <td className="py-2 px-3 text-left text-gray-600">{row.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* 竞对活动信息 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🧭</span>
                      <h3 className="font-bold text-sm text-gray-800">竞对活动信息</h3>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      竞对活动将作为目标测算的外部参考因子，支持从飞书文档自动解析，也可手动填写/批量导入/复用历史配置。
                    </div>
                    
                    {/* 操作栏 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <span>🤖</span> AI文档解析
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <span>➕</span> 添加竞对
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-1">
                        <span>↻</span> 复用历史大促竞对配置
                      </button>
                    </div>
                    
                    {/* 竞对活动数据 */}
                    {/* 表格 */}
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                          <tr>
                            <th className="text-left py-2 px-3">竞对名称</th>
                            <th className="text-left py-2 px-3">活动名称</th>
                            <th className="text-left py-2 px-3">开始时间</th>
                            <th className="text-left py-2 px-3">结束时间</th>
                            <th className="text-left py-2 px-3">信息来源</th>
                            <th className="text-left py-2 px-3">状态</th>
                            <th className="text-left py-2 px-3">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentConfig.competitors.map(comp => (
                            <tr key={comp.id} className="hover:bg-gray-50">
                              {editingId === comp.id ? (
                                <>
                                  <td className="py-2 px-3">
                                    <select
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      <option value="">选择竞对</option>
                                      {competitorOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      value={editForm.activity}
                                      onChange={(e) => setEditForm({ ...editForm, activity: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="活动名称"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="datetime-local"
                                      value={editForm.startTime}
                                      onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="datetime-local"
                                      value={editForm.endTime}
                                      onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={editForm.source}
                                      onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      <option value="AI文档解析">AI文档解析</option>
                                      <option value="人工输入">人工输入</option>
                                      <option value="批量导入">批量导入</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={editForm.status}
                                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      <option value="confirmed">已确认</option>
                                      <option value="pending">待确认</option>
                                      <option value="incomplete">待补充</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex gap-2">
                                      <button onClick={handleSave} className="text-green-600 text-xs hover:underline font-medium">保存</button>
                                      <button onClick={handleCancel} className="text-gray-500 text-xs hover:underline">取消</button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-2 px-3 text-gray-700 font-medium">{comp.name}</td>
                                  <td className="py-2 px-3 text-gray-700">{comp.activity || '-'}</td>
                                  <td className="py-2 px-3 text-gray-600">{comp.startTime ? comp.startTime.replace('T', ' ') : '-'}</td>
                                  <td className="py-2 px-3 text-gray-600">{comp.endTime ? comp.endTime.replace('T', ' ') : '-'}</td>
                                  <td className="py-2 px-3 text-gray-600">{comp.source}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 text-xs rounded ${
                                      comp.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                      comp.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {comp.status === 'confirmed' ? '🟢 已确认' : comp.status === 'pending' ? '🔵 待确认' : '⚪ 待补充'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex gap-2">
                                      {comp.status === 'pending' && (
                                        <button className="text-green-600 text-xs hover:underline">✅确认</button>
                                      )}
                                      <button onClick={() => handleEdit(comp)} className="text-blue-600 text-xs hover:underline">✏️编辑</button>
                                      <button className="text-red-600 text-xs hover:underline">🗑️删除</button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 底部提示 */}
                    <div className="text-xs text-gray-500">
                      当前共识别到{competitors.length}条竞对活动，{competitors.filter(c => c.status === 'pending').length}条待确认
                    </div>
                  </div>
                </>
                )}
                

                
              </>
              )}
              
              {/* 测算逻辑 Tab 内容 */}
              {targetTab === 'logic' && (
              <>
                {/* 顶部操作区 */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Workflow className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">测算逻辑模型库</h3>
                        <p className="text-xs text-gray-500">在此沉淀和共建各视角的测算逻辑模型</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors">
                      <PlusCircle className="w-4 h-4" />
                      + 新建测算逻辑
                    </button>
                  </div>
                </div>
                
                {/* 内容展示区 - 分两个分组 */}
                <div className="space-y-4">
                  {/* 资管组全局预测 */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-gray-800">资管组全局预测</h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">3个模型</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[
                        { id: '1', name: '自然水位分日预测', creator: '资管', updateTime: '2026-05-10', description: '基于历史大盘不投预算的基线分布预测。', tags: ['大盘', '自然水位', '基线'], status: 'active' },
                        { id: '2', name: '含预算分日GMV预测', creator: '资管', updateTime: '2026-05-11', description: '结合各类型预算投入节奏与杠杆系数的最终GMV测算。', tags: ['大盘', '含预算', '杠杆'], status: 'active' },
                        { id: '3', name: '发货GMV分日预测', creator: '资管', updateTime: '2026-05-12', description: '基于支付GMV及历史履约时效延迟分布的转化模型。', tags: ['大盘', '发货', '履约'], status: 'active' }
                      ].map((skill) => (
                        <div key={skill.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${skill.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {skill.status === 'active' ? '已发布' : '已停用'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{skill.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>贡献者：{skill.creator}</span>
                                <span>更新时间：{skill.updateTime}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {skill.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{tag}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                                查看详情
                              </button>
                              <button className="px-3 py-1.5 text-xs text-green-600 bg-green-50 rounded hover:bg-green-100">
                                复制
                              </button>
                              <button className="px-3 py-1.5 text-xs text-orange-600 bg-orange-50 rounded hover:bg-orange-100">
                                停用
                              </button>
                              <button className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                引用
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 行业组专属预测 */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <h3 className="font-semibold text-gray-800">行业组专属预测</h3>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">4个模型</span>
                        </div>
                        <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="">全部行业</option>
                          <option value="3C数码">3C数码</option>
                          <option value="美妆">美妆</option>
                        </select>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[
                        { id: '4', name: '3C数码分日/分阶段GMV预测', subGroup: '3C数码', creator: '3C数码组', updateTime: '2026-05-13', description: '结合3C数码品类特征的大促各阶段及分日GMV拆解逻辑。', tags: ['行业专属', '阶段拆解', '3C数码'], status: 'active' },
                        { id: '5', name: '3C数码发货GMV预测', subGroup: '3C数码', creator: '3C数码组', updateTime: '2026-05-13', description: '基于3C数码商品供应链与仓配时效特征的发货规模预测。', tags: ['行业专属', '供应链', '3C数码'], status: 'active' },
                        { id: '6', name: '美妆分日/分阶段GMV预测', subGroup: '美妆', creator: '美妆组', updateTime: '2026-05-13', description: '结合美妆品类特征的大促各阶段及分日GMV拆解逻辑。', tags: ['行业专属', '阶段拆解', '美妆'], status: 'active' },
                        { id: '7', name: '美妆发货GMV预测', subGroup: '美妆', creator: '美妆组', updateTime: '2026-05-13', description: '基于美妆商品供应链与仓配时效特征的发货规模预测。', tags: ['行业专属', '供应链', '美妆'], status: 'active' }
                      ].map((skill) => (
                        <div key={skill.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">{skill.subGroup}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${skill.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {skill.status === 'active' ? '已发布' : '已停用'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{skill.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>贡献者：{skill.creator}</span>
                                <span>更新时间：{skill.updateTime}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {skill.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{tag}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                                查看详情
                              </button>
                              <button className="px-3 py-1.5 text-xs text-green-600 bg-green-50 rounded hover:bg-green-100">
                                复制
                              </button>
                              <button className="px-3 py-1.5 text-xs text-orange-600 bg-orange-50 rounded hover:bg-orange-100">
                                停用
                              </button>
                              <button className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                引用
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">预算使用率</div>
                  <div className="text-2xl font-bold text-blue-700">52%</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '52%' }}></div></div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">预测最终消耗</div>
                  <div className="text-2xl font-bold text-green-700">91%</div>
                  <div className="text-xs text-green-600 mt-1">剩余 ≈68万</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">GMV 完成率</div>
                  <div className="text-2xl font-bold text-purple-700">47%</div>
                  <div className="text-xs text-green-600 mt-1">高于计划 +3pct</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">预测 ROI</div>
                  <div className="text-2xl font-bold text-gray-900">3.9</div>
                  <div className="text-xs text-green-600 mt-1">+0.2 vs 计划</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  预算消耗趋势
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[
                      { day: '10/20', plan: 30, actual: 28 },
                      { day: '10/22', plan: 65, actual: 72 },
                      { day: '10/24', plan: 105, actual: 118 },
                      { day: '10/26', plan: 150, actual: 170 },
                      { day: '10/28', plan: 200, actual: 228 },
                      { day: '10/30', plan: 260, actual: 295 },
                      { day: '11/01', plan: 320, actual: 365 },
                      { day: '11/03', plan: 395, actual: 395 },
                      { day: '11/05', plan: 470, actual: null },
                      { day: '11/07', plan: 560, actual: null },
                      { day: '11/09', plan: 650, actual: null },
                      { day: '11/11', plan: 760, actual: null },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit="万" />
                      <Tooltip />
                      <Line type="monotone" dataKey="plan" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="计划消耗" />
                      <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="实际消耗" connectNulls={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  风险预警
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-800">消费券预计提前触顶</div>
                        <div className="text-xs text-red-600 mt-1">消耗超预期，预计 2 天后触顶（11/05），当前消耗速度超计划 18%</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full whitespace-nowrap">高风险</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-orange-800">创新玩法预留消耗偏慢</div>
                        <div className="text-xs text-orange-600 mt-1">预计最终剩余 60%（≈12万），执行落地进度滞后，低于计划节奏</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full whitespace-nowrap">中风险</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-green-800">AI 调整建议</div>
                      <div className="text-xs text-green-700 mt-1 leading-relaxed">
                        建议从创新玩法预留挪 10 万至消费券，预计 GMV 增加 320 万（+2.7%），整体 ROI 基本持平。此调整可缓解消费券触顶风险并提升预算利用率。
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      应用建议
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      暂不调整
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  渠道消耗明细
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                      <tr>
                        <th className="text-left py-3 px-4">渠道</th>
                        <th className="text-right py-3 px-4">已消耗</th>
                        <th className="text-right py-3 px-4">消耗率</th>
                        <th className="text-right py-3 px-4">预计剩余</th>
                        <th className="text-center py-3 px-4">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-red-50/30">
                        <td className="py-3 px-4 font-medium text-gray-900">消费券</td>
                        <td className="py-3 px-4 text-right font-bold">138万</td>
                        <td className="py-3 px-4 text-right text-red-600">63%</td>
                        <td className="py-3 px-4 text-right text-red-600">预计 2 天触顶</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">⚠️ 触顶风险</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">重点类目追补</td>
                        <td className="py-3 px-4 text-right font-bold">95万</td>
                        <td className="py-3 px-4 text-right text-gray-600">53%</td>
                        <td className="py-3 px-4 text-right text-gray-600">正常</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">正常</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">toB商达预算</td>
                        <td className="py-3 px-4 text-right font-bold">58万</td>
                        <td className="py-3 px-4 text-right text-gray-600">48%</td>
                        <td className="py-3 px-4 text-right text-gray-600">正常</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">正常</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">用户运营</td>
                        <td className="py-3 px-4 text-right font-bold">52万</td>
                        <td className="py-3 px-4 text-right text-gray-600">52%</td>
                        <td className="py-3 px-4 text-right text-gray-600">正常</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">正常</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">货架场</td>
                        <td className="py-3 px-4 text-right font-bold">41万</td>
                        <td className="py-3 px-4 text-right text-gray-600">51%</td>
                        <td className="py-3 px-4 text-right text-gray-600">正常</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">正常</span></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">市场宣发</td>
                        <td className="py-3 px-4 text-right font-bold">18万</td>
                        <td className="py-3 px-4 text-right text-gray-600">45%</td>
                        <td className="py-3 px-4 text-right text-gray-600">正常</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">正常</span></td>
                      </tr>
                      <tr className="hover:bg-orange-50/30">
                        <td className="py-3 px-4 font-medium text-gray-900">创新玩法预留</td>
                        <td className="py-3 px-4 text-right font-bold">8万</td>
                        <td className="py-3 px-4 text-right text-orange-600">40%</td>
                        <td className="py-3 px-4 text-right text-orange-600">预计剩余 12万</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">消耗偏慢</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Default Report Content (existing code...)
  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200 shadow-xl w-full mx-auto overflow-hidden">
      {/* ... existing return ... */}
      {/* Top Nav / Actions */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-900">返回</button>
            <button className="hover:text-gray-900">发布</button>
            <span className="text-gray-300">|</span>
            <span>2023.09.12 13:07</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> 分享
          </button>
          <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> 下载
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Gradient Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 pb-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Top10应季类目分析报告</h1>
                <p className="text-blue-100 text-sm">基于多维度指标的秋季应季类目筛选与排序</p>
            </div>
        </div>

        {/* Content Cards Container */}
        <div className="max-w-5xl mx-auto px-4 -mt-6 pb-12 space-y-6">
            
            {/* 1. Report Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">报告摘要</h2>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">864.41亿</div>
                        <div className="text-xs text-gray-500">女装类目10月GMV</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">93.4%</div>
                        <div className="text-xs text-gray-500">家纺类目最高增长率</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">10</div>
                        <div className="text-xs text-gray-500">推荐应季类目数量</div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                    本报告基于2024年9-10月和2025年7-8月的多维度数据，按照24年9月绝对规模权重40%、场域季节性增长权重40%、近期增长趋势权重20%的综合评分体系，从50个二级管理类目中筛选出Top10应季类目。分析发现秋季应季类目呈现出明显的季节性特征，主要集中在保暖、换季、聚会三大需求主线。
                </p>
            </div>

            {/* 2. Scoring Weights Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">评分权重体系</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                        <div className="font-bold text-gray-800 text-sm mb-1">绝对规模权重 40%</div>
                        <div className="text-xs text-gray-500">基于2024年9月GMV绝对数值</div>
                        <div className="text-xs text-blue-600 mt-1 font-medium">24年9月GMV</div>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <div className="font-bold text-gray-800 text-sm mb-1">场域季节性增长权重 40%</div>
                        <div className="text-xs text-gray-500">2024年10月相比9月增长率</div>
                        <div className="text-xs text-green-600 mt-1 font-medium">GMV/搜索/直播/短视频增长</div>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                        <div className="font-bold text-gray-800 text-sm mb-1">近期增长趋势权重 20%</div>
                        <div className="text-xs text-gray-500">2025年8月相比7月增长率</div>
                        <div className="text-xs text-purple-600 mt-1 font-medium">GMV/搜索/直播/短视频增长</div>
                    </div>
                </div>
            </div>

            {/* 3. Ranking Table Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Top10应季类目排名</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">排名</th>
                                <th className="px-4 py-3">类目名称</th>
                                <th className="px-4 py-3">24年9月GMV</th>
                                <th className="px-4 py-3">GMV增长率</th>
                                <th className="px-4 py-3">潜在GMV增长率</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">综合得分</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { rank: 1, name: '面部彩妆', gmv: '94.77亿', growth: '50.8%', pot: '87.4%', score: '18.84' },
                                { rank: 2, name: '男装', gmv: '99.25亿', growth: '84.3%', pot: '95.6%', score: '11.99' },
                                { rank: 3, name: '家纺', gmv: '40.38亿', growth: '93.4%', pot: '83.3%', score: '12.06' },
                                { rank: 4, name: '护肤', gmv: '98.09亿', growth: '51.8%', pot: '78.3%', score: '12.08' },
                                { rank: 5, name: '运动户外', gmv: '115.30亿', growth: '62.3%', pot: '60.3%', score: '12.19' },
                                { rank: 6, name: '女装', gmv: '581.75亿', growth: '48.6%', pot: '67.1%', score: '12.29' },
                                { rank: 7, name: '珠宝/钻石/翡翠/黄金', gmv: '174.92亿', growth: '19.1%', pot: '26.1%', score: '14.67' },
                                { rank: 8, name: '内衣裤袜', gmv: '38.89亿', growth: '54.5%', pot: '74.2%', score: '17.79' },
                                { rank: 9, name: '手机', gmv: '47.83亿', growth: '29.7%', pot: '10.4%', score: '17.88' },
                                { rank: 10, name: '休闲零食', gmv: '23.92亿', growth: '61.9%', pot: '11.9%', score: '19.28' },
                            ].map((row) => (
                                <tr key={row.rank} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{row.rank}</td>
                                    <td className="px-4 py-4 text-blue-600 font-medium">{row.name}</td>
                                    <td className="px-4 py-4 text-gray-600">{row.gmv}</td>
                                    <td className="px-4 py-4 text-green-600">{row.growth}</td>
                                    <td className="px-4 py-4 text-green-600">{row.pot}</td>
                                    <td className="px-4 py-4 text-right font-bold text-gray-900">{row.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </div>
      
      
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowShareModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">分享设置</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">有效期</label>
                  <select 
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="1">1天</option>
                    <option value="3">3天</option>
                    <option value="7">7天</option>
                    <option value="30">30天</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">访问权限</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shareType" 
                        checked={shareType === 'view'}
                        onChange={() => setShareType('view')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">仅查看（无法进行调参模拟）</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shareType" 
                        checked={shareType === 'edit'}
                        onChange={() => setShareType('edit')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">允许交互（可使用AI对话和模拟功能）</span>
                    </label>
                  </div>
                </div>
                
                {shareLink && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-3">{shareLink}</span>
                      <button
                        onClick={copyShareLink}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            复制
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  返回
                </button>
                <button
                  onClick={generateShareLink}
                  disabled={isGeneratingLink}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGeneratingLink ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    '生成链接'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 导出分析报告模态框 */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExportModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">导出分析报告</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">选择导出格式</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        exportFormat === 'pdf' 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => setExportFormat('excel')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        exportFormat === 'excel' 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      EXCEL
                    </button>
                    <button
                      onClick={() => setExportFormat('ppt')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        exportFormat === 'ppt' 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      PPT
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">包含模块</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={exportModules.overview}
                        onChange={(e) => setExportModules({...exportModules, overview: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">总览数据</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={exportModules.prediction}
                        onChange={(e) => setExportModules({...exportModules, prediction: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">预测分析</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={exportModules.breakdown}
                        onChange={(e) => setExportModules({...exportModules, breakdown: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">拆解分析</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={async () => {
                    setIsExportingReport(true);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    setIsExportingReport(false);
                    setReportExportSuccess(true);
                    setTimeout(() => {
                      setReportExportSuccess(false);
                      setShowExportModal(false);
                    }, 2000);
                  }}
                  disabled={isExportingReport}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExportingReport ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : reportExportSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      生成成功
                    </>
                  ) : (
                    '生成报告'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
