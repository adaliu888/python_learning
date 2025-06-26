import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { User, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
}

const schema = yup.object({
  firstName: yup.string()
    .required('请输入姓名')
    .min(1, '姓名不能为空')
    .max(50, '姓名不能超过50个字符'),
  lastName: yup.string()
    .required('请输入姓氏')
    .min(1, '姓氏不能为空')
    .max(50, '姓氏不能超过50个字符'),
  phone: yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, '请输入有效的电话号码')
    .optional()
    .default(''),
  dateOfBirth: yup.string().optional().default(''),
  bio: yup.string()
    .max(500, '个人简介不能超过500个字符')
    .optional()
    .default('')
}).required();

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      bio: user?.bio || ''
    }
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const resp = await userAPI.getProfile();
        if (resp.data.data && resp.data.data.data) {
          const profile = resp.data.data.data;
          reset({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            dateOfBirth: profile.dateOfBirth || '',
            bio: profile.bio || ''
          });
        }
      } catch (e) {
        // 可选：处理拉取失败
      }
    }
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setSuccess(false);
    
    try {
      const payload = { ...data, phone: data.phone || "" };
      await updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      } else {
        const message = error.response?.data?.message || '更新失败，请重试';
        setError('root', { message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      bio: user?.bio || ''
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: '600'
            }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <h2 style={{ marginBottom: '10px', color: '#333' }}>个人资料</h2>
            <p style={{ color: '#6c757d' }}>更新您的个人信息</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  姓名
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
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  姓氏
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
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                邮箱
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>邮箱地址不可修改</small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                电话
              </label>
              <input
                {...register('phone')}
                type="tel"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.phone ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="电话号码"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.phone ? '#dc3545' : '#e9ecef'}
              />
              {errors.phone && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.phone.message}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                出生日期
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                个人简介
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.bio ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="介绍一下自己..."
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.bio ? '#dc3545' : '#e9ecef'}
              />
              {errors.bio && (
                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.bio.message}
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

            {success && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '0.9rem'
              }}>
                个人资料已成功更新！
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '30px'
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    保存更改
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '2px solid #667eea',
                  color: '#667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#667eea';
                }}
              >
                <X size={16} />
                取消
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile; 