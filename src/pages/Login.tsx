import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

type FormData = z.infer<typeof schema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.user, res.token);
      navigate('/');
    } catch (error: any) {
      setError('root', { message: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录账户
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="邮箱"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="密码"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm text-center">
              {errors.root.message}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">还没有账号？</span>{' '}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};