const API_URL = '/api';

const MOCK_TRANSACTIONS = [
  { id: '1', categories: { name: '餐饮' }, amount: '50.00', type: 'expense', description: '午餐', transaction_date: '2023-10-25' },
  { id: '2', categories: { name: '交通' }, amount: '30.00', type: 'expense', description: '打车', transaction_date: '2023-10-24' },
  { id: '3', categories: { name: '工资' }, amount: '10000.00', type: 'income', description: '十月工资', transaction_date: '2023-10-15' },
  { id: '4', categories: { name: '购物' }, amount: '200.00', type: 'expense', description: '超市购物', transaction_date: '2023-10-20' },
  { id: '5', categories: { name: '娱乐' }, amount: '150.00', type: 'expense', description: '电影票', transaction_date: '2023-10-22' },
];

export const api = {
  get: async (url: string) => {
    const token = localStorage.getItem('token');
    
    // Handle Mock Token
    if (token === 'mock-token') {
      console.log('Using Mock API for GET', url);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      if (url === '/transactions') {
        return MOCK_TRANSACTIONS;
      }
      return [];
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || res.statusText);
    }
    return res.json();
  },
  post: async (url: string, body: any) => {
    const token = localStorage.getItem('token');

    // Handle Mock Token
    if (token === 'mock-token') {
      console.log('Using Mock API for POST', url, body);
      // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      // Let AI requests pass through to backend (using modified authMiddleware)
      if (url === '/ai/analyze') {
         // Pass through to the real fetch below
      } else {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay for other mock actions
          if (url === '/transactions') {
            return { ...body, id: Math.random().toString(), categories: { name: body.category || '未分类' } };
          }
          return {};
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || res.statusText);
    }
    return res.json();
  },
  put: async (url: string, body: any) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || res.statusText);
    }
    return res.json();
  },
  delete: async (url: string) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || res.statusText);
    }
    return res.json();
  },
};