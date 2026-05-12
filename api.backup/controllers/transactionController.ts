import { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, categoryId, type, description, date } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          category_id: categoryId,
          amount,
          type,
          description,
          transaction_date: date,
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

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};