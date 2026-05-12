import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, userType } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          name,
          user_type: userType || 'personal',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        userType: newUser.user_type,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};