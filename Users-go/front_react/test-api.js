const axios = require('axios');

async function testRegisterAPI() {
  try {
    const timestamp = Date.now();
    const response = await axios.post('http://localhost:8081/api/v1/auth/register', {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      acceptTerms: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ 注册成功:', response.data);
  } catch (error) {
    console.log('❌ 注册失败:');
    console.log('状态码:', error.response?.status);
    console.log('错误信息:', error.response?.data);
    console.log('完整错误:', error.message);
  }
}

testRegisterAPI(); 