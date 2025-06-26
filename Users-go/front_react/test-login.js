const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🔍 测试登录API...');
    
    // 先注册一个用户
    const timestamp = Date.now();
    const registerData = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      acceptTerms: true
    };
    
    console.log('📝 注册用户...');
    const registerResponse = await axios.post('http://localhost:8081/api/v1/auth/register', registerData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ 注册成功:', registerResponse.data);
    
    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 测试登录 - 使用邮箱
    console.log('\n🔐 测试邮箱登录...');
    const loginWithEmail = await axios.post('http://localhost:8081/api/v1/auth/login', {
      email: registerData.email,
      password: registerData.password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ 邮箱登录成功:', loginWithEmail.data);
    
    // 测试登录 - 使用用户名
    console.log('\n🔐 测试用户名登录...');
    const loginWithUsername = await axios.post('http://localhost:8081/api/v1/auth/login', {
      username: registerData.username,
      password: registerData.password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ 用户名登录成功:', loginWithUsername.data);
    
  } catch (error) {
    console.log('❌ 测试失败:');
    console.log('状态码:', error.response?.status);
    console.log('错误信息:', error.response?.data);
    console.log('完整错误:', error.message);
  }
}

testLoginAPI(); 