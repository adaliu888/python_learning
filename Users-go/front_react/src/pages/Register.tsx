import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  acceptTerms: boolean;
}

// 密码强度检查函数
const checkPasswordStrength = (password: string) => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const length = password.length >= 8;
  
  const strength = [hasUpper, hasLower, hasNumber, hasSpecial, length].filter(Boolean).length;
  
  return {
    strength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    length
  };
};

const schema = yup.object({
  username: yup.string()
    .required('请输入用户名')
    .min(3, '用户名至少3个字符')
    .max(30, '用户名不能超过30个字符')
    .matches(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: yup.string()
    .required('请输入邮箱')
    .email('请输入有效的邮箱地址'),
  password: yup.string()
    .required('请输入密码')
    .min(8, '密码至少8个字符')
    .test('password-strength', '密码强度不够', function(value) {
      if (!value) return true; // 让required验证处理空值
      const strength = checkPasswordStrength(value);
      return strength.strength >= 4; // 至少满足4个条件
    }),
  confirmPassword: yup.string()
    .required('请确认密码')
    .oneOf([yup.ref('password')], '密码不匹配'),
  firstName: yup.string()
    .required('请输入姓名')
    .min(1, '姓名不能为空')
    .max(50, '姓名不能超过50个字符'),
  lastName: yup.string()
    .required('请输入姓氏')
    .min(1, '姓氏不能为空')
    .max(50, '姓氏不能超过50个字符'),
  phone: yup.string()
    .matches(/^(\+[1-9]\d{1,14})?$/, '请输入有效的国际电话号码（如：+8613800138000）或留空')
    .transform((value) => value || '')
    .default(''),
  acceptTerms: yup.boolean()
    .oneOf([true], '请同意服务条款')
    .default(false)
}).required();

const initialFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  acceptTerms: false
};

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(checkPasswordStrength(''));
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialFormValues
  });

  // 每次进入页面时清空所有字段
  React.useEffect(() => {
    reset(initialFormValues);
  }, [reset]);

  // 监听密码变化，更新强度显示
  const password = watch('password');
  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    
    try {
      const registrationData = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || "",
        acceptTerms: data.acceptTerms
      };
      
      console.log('Sending registration data:', registrationData);
      
      await registerUser(registrationData);
      setShowSuccess(true);
      reset(initialFormValues);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // 处理后端返回的详细错误信息
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        backendErrors.forEach((err: { field: string, message: string }) => {
          setError(err.field as keyof RegisterFormData, { message: err.message });
        });
      }
      
      // 处理通用错误消息
      const message = error.response?.data?.message || '注册失败，请重试';
      setError('root', { message });
    } finally {
      setLoading(false);
    }
  };

  // 密码强度指示器组件
  const PasswordStrengthIndicator = () => {
    if (!password) return null;
    
    const getStrengthColor = () => {
      if (passwordStrength.strength <= 2) return '#dc3545';
      if (passwordStrength.strength <= 3) return '#ffc107';
      return '#28a745';
    };
    
    const getStrengthText = () => {
      if (passwordStrength.strength <= 2) return '弱';
      if (passwordStrength.strength <= 3) return '中等';
      return '强';
    };
    
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>密码强度:</span>
          <span style={{ fontSize: '0.8rem', color: getStrengthColor(), fontWeight: 'bold' }}>
            {getStrengthText()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[passwordStrength.hasUpper, passwordStrength.hasLower, passwordStrength.hasNumber, passwordStrength.hasSpecial, passwordStrength.length].map((met, index) => (
            <div
              key={index}
              style={{
                width: '20px',
                height: '4px',
                backgroundColor: met ? getStrengthColor() : '#e9ecef',
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#6c757d', marginTop: '4px' }}>
          {!passwordStrength.hasUpper && '需要大写字母 '}
          {!passwordStrength.hasLower && '需要小写字母 '}
          {!passwordStrength.hasNumber && '需要数字 '}
          {!passwordStrength.hasSpecial && '需要特殊字符 '}
          {!passwordStrength.length && '至少8位'}
        </div>
      </div>
    );
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
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <div style={{ fontSize: '2rem', color: '#28a745', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '16px' }}>注册成功！请前往邮箱完成验证。</div>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 32px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: '8px'
              }}
              onClick={() => {
                setShowSuccess(false);
                navigate('/login');
              }}
            >
              去登录
            </button>
          </div>
        </div>
      )}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '500px',
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
            <UserPlus size={40} />
          </div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>创建账户</h2>
          <p style={{ color: '#6c757d' }}>加入我们的社区</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{
                textAlign: 'left',
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                用户名 *
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} size={16} />
                <input
                  {...register('username')}
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: `2px solid ${errors.username ? '#dc3545' : '#e9ecef'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="用户名（3-30位字母、数字或下划线）"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? '#dc3545' : '#e9ecef'}
                />
              </div>
              {errors.username && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.username.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                textAlign: 'left',
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                邮箱 *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} size={16} />
                <input
                  {...register('email')}
                  type="email"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: `2px solid ${errors.email ? '#dc3545' : '#e9ecef'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="邮箱地址"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#e9ecef'}
                />
              </div>
              {errors.email && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{
                textAlign: 'left',
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                姓名 *
              </label>
              <input
                {...register('firstName')}
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.firstName ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="姓名"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.firstName ? '#dc3545' : '#e9ecef'}
              />
              {errors.firstName && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.firstName.message}
                </div>
              )}
            </div>
            
            <div>
              <label style={{
                textAlign: 'left',
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                姓氏 *
              </label>
              <input
                {...register('lastName')}
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.lastName ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="姓氏"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.lastName ? '#dc3545' : '#e9ecef'}
              />
              {errors.lastName && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.lastName.message}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              textAlign: 'left',
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              密码 *
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
                type={showPassword ? 'text' : 'password'}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `2px solid ${errors.password ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="密码（至少8位，含大小写字母和数字）"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#e9ecef'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrengthIndicator />
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.password.message}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              textAlign: 'left',
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              确认密码 *
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
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="确认密码"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#e9ecef'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              textAlign: 'left',
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              手机号码
            </label>
            <div style={{ position: 'relative' }}>
              <Phone style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} size={16} />
              <input
                {...register('phone')}
                type="tel"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: `2px solid ${errors.phone ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="+8613800138000 (可选)"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.phone ? '#dc3545' : '#e9ecef'}
              />
            </div>
            {errors.phone && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.phone.message}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                {...register('acceptTerms')}
                type="checkbox"
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '0.9rem' }}>
                我同意 <Link to="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>服务条款</Link> 和 <Link to="/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>隐私政策</Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.acceptTerms.message}
              </div>
            )}
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
            {loading ? '注册中...' : '创建账户'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: '#6c757d' }}>已有账户？</span>
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', marginLeft: '5px' }}>
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 