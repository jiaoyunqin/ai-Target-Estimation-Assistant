import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  userType: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Check localStorage first, if not present, use mock user
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  const initialUser = storedUser ? JSON.parse(storedUser) : {
    id: 'mock-user-id',
    email: 'demo@example.com',
    name: '演示用户',
    userType: 'personal',
  };
  
  const initialToken = storedToken || 'mock-token';

  // Ensure mock data is in localStorage for api.ts to read
  if (!storedToken) {
    localStorage.setItem('user', JSON.stringify(initialUser));
    localStorage.setItem('token', initialToken);
  }

  return {
    user: initialUser,
    token: initialToken,
    login: (user, token) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      set({ user, token });
    },
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    },
  };
});