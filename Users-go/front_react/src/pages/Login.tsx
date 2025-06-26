import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Mail } from 'lucide-react';

interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'username' | 'email'>('username');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 动态schema
  const schema = yup.object({
    identifier: loginMode === 'username'
      ? yup.string().required('请输入用户名')
      : yup.string().required('请输入邮箱').email('请输入有效的邮箱地址'),
    password: yup.string().required('请输入密码'),
    rememberMe: yup.boolean().default(false)
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: { identifier: '', password: '', rememberMe: false }
  });

  // 切换登录方式时清空表单
  const handleSwitchMode = () => {
    setLoginMode(loginMode === 'username' ? 'email' : 'username');
    reset({ identifier: '', password: '', rememberMe: false });
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const loginData = loginMode === 'username'
        ? { username: data.identifier, password: data.password, rememberMe: data.rememberMe }
        : { email: data.identifier, password: data.password, rememberMe: data.rememberMe };
      await login(loginData);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      // 统一错误提示
      const message = error.response?.data?.message || '用户名或邮箱或密码错误';
      setError('root', { message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '2rem',
            color: 'white'
          }}>
            <User size={40} />
          </div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>欢迎回来</h2>
          <p style={{ color: '#6c757d' }}>请登录您的账户</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              {loginMode === 'username' ? '用户名' : '邮箱'}
            </label>
            <div style={{ position: 'relative' }}>
              {loginMode === 'username' ? (
                <User style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} size={16} />
              ) : (
                <Mail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} size={16} />
              )}
              <input
                {...register('identifier')}
                type={loginMode === 'username' ? 'text' : 'email'}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `2px solid ${errors.identifier ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder={loginMode === 'username' ? '请输入用户名' : '请输入邮箱'}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = errors.identifier ? '#dc3545' : '#e9ecef'}
              />
            </div>
            {errors.identifier && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.identifier.message}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              密码
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} size={16} />
              <input
                {...register('password')}
                type="password"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `2px solid ${errors.password ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="请输入密码"
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = errors.password ? '#dc3545' : '#e9ecef'}
              />
            </div>
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.password.message}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <input
                {...register('rememberMe')}
                type="checkbox"
                style={{ width: '16px', height: '16px' }}
              />
              <span>记住我</span>
            </label>
          </div>

          {errors.root && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>

          <button
            type="button"
            onClick={handleSwitchMode}
            style={{
              width: '100%',
              marginTop: '12px',
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '0.95rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {loginMode === 'username' ? '使用邮箱登录' : '使用用户名登录'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: '#6c757d' }}>没有账户？</span>
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', marginLeft: '5px' }}>
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 