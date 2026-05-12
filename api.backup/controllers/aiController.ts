import { Response } from 'express';
import OpenAI from 'openai';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Initialize OpenAI client with DeepSeek base URL
const openai = process.env.DEEPSEEK_API_KEY 
  ? new OpenAI({ 
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1'
    }) 
  : null;

export const analyze = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { query } = req.body;

    // 1. Fetch user context (transactions, budgets) from DB
    // We use a try-catch here because Supabase might not be configured either
    let context = {};
    try {
        const { data: transactions } = await supabase
        .from('transactions')
        .select('*, categories(name)')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(50);

        const { data: budgets } = await supabase
        .from('budgets')
        .select('*, categories(name)')
        .eq('user_id', userId)
        .eq('is_active', true);
        
        context = { transactions, budgets };
    } catch (dbError) {
        console.warn("Failed to fetch DB context:", dbError);
        // Continue without DB context
    }

    // 2. Check if OpenAI is configured
    if (!openai) {
      // Fallback for demo purposes if no key is provided
      return res.json({
        answer: "【系统提示】尚未配置 DEEPSEEK_API_KEY。为了实现真实的AI智能分析，请在后端 `.env` 文件中配置 `DEEPSEEK_API_KEY`。\n\n目前为您展示模拟回复：\n根据您的输入，如果这是真实的财务数据，我会分析您的支出趋势、预算执行情况，并给出具体的省钱建议。例如，如果您的餐饮支出占比较高，我会建议您减少外食频率。",
        suggestions: ["配置 API Key", "查看文档"]
      });
    }

    // 3. Construct Prompt
    const prompt = `
      You are a professional financial data analyst AI agent.
      
      Your goal is to analyze the user's input and the provided database records (if any) to give actionable financial advice.
      
      User Input: "${query}"
      
      Database Context (Recent 50 transactions & Active Budgets):
      ${JSON.stringify(context)}
      
      Instructions:
      1. If the user input contains data (e.g. pasted CSV or text description of expenses), prioritize analyzing that.
      2. If the user input is a question about their history, use the Database Context.
      3. Provide a structured response with:
         - Key Insights (Trends, anomalies)
         - Specific Numbers (Totals, averages)
         - Actionable Recommendations
      4. Tone: Professional, encouraging, and objective.
      5. Language: Simplified Chinese (unless user asks in another language).
    `;

    // 4. Call DeepSeek API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: "You are a helpful financial analyst." },
        { role: 'user', content: prompt }
      ],
      model: 'deepseek-chat', // Use deepseek-chat model
      stream: false, // Explicitly disable streaming for now
    });

    const answer = completion.choices[0].message.content;

    res.json({
      answer,
      suggestions: [], 
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
        message: "AI Service Error: " + (error.message || "Unknown error"),
        answer: "抱歉，AI 服务暂时不可用，请稍后再试或检查后台日志。"
    });
  }
};
