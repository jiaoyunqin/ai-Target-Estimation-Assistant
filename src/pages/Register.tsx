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
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const Register: React.FC = () => {
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
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
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
            创建新账户
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="姓名"
              {...register('name')}
              error={errors.name?.message}
            />
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
            <Input
              label="确认密码"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
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
              {isSubmitting ? '注册中...' : '注册'}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">已有账号？</span>{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};