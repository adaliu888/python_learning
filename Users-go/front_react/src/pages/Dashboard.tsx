import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Shield, HelpCircle, Calendar, Clock, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 欢迎信息 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h1 style={{ margin: '0 0 5px 0', color: '#333' }}>
                欢迎回来, {user.firstName} {user.lastName}!
              </h1>
              <p style={{ margin: '0', color: '#6c757d' }}>{user.email}</p>
            </div>
          </div>
          
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#28a745',
              borderRadius: '50%'
            }} />
            欢迎回来！您的账户状态正常。
          </div>
        </div>

        {/* 统计卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Calendar style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#333' }}>28</h3>
            <p style={{ color: '#6c757d', margin: '0', fontSize: '0.9rem' }}>活跃天数</p>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Clock style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#333' }}>156</h3>
            <p style={{ color: '#6c757d', margin: '0', fontSize: '0.9rem' }}>在线时长(小时)</p>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Star style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#333' }}>4.8</h3>
            <p style={{ color: '#6c757d', margin: '0', fontSize: '0.9rem' }}>用户评分</p>
          </div>
        </div>

        {/* 快速操作 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>快速操作</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <Link to="/profile" style={{
              background: 'white',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <User style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
              <span style={{ display: 'block', fontWeight: '500' }}>个人资料</span>
            </Link>

            <Link to="/settings" style={{
              background: 'white',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <Settings style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
              <span style={{ display: 'block', fontWeight: '500' }}>设置</span>
            </Link>

            <Link to="/change-password" style={{
              background: 'white',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <Shield style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
              <span style={{ display: 'block', fontWeight: '500' }}>安全</span>
            </Link>

            <Link to="/help" style={{
              background: 'white',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <HelpCircle style={{ color: '#667eea', marginBottom: '10px' }} size={40} />
              <span style={{ display: 'block', fontWeight: '500' }}>帮助</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 