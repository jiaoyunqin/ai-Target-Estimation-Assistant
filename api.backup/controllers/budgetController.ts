import { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('budgets')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { categoryId, amount, periodStart, periodEnd } = req.body;

    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: userId,
          category_id: categoryId,
          budget_amount: amount,
          period_start: periodStart,
          period_end: periodEnd,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount, spentAmount } = req.body;

    const { data, error } = await supabase
      .from('budgets')
      .update({ budget_amount: amount, spent_amount: spentAmount })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};