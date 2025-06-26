const axios = require('axios');

async function testEnhancedRegister() {
  const baseURL = 'http://localhost:8081/api/v1';
  
  console.log('🧪 测试增强的注册功能...\n');
  
  // 测试用例
  const testCases = [
    {
      name: '✅ 正常注册',
      data: {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: true
      },
      expectedStatus: 201
    },
    {
      name: '❌ 密码不匹配',
      data: {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'DifferentPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: true
      },
      expectedStatus: 400
    },
    {
      name: '❌ 弱密码',
      data: {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'weak',
        confirmPassword: 'weak',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: true
      },
      expectedStatus: 400
    },
    {
      name: '❌ 邮箱格式错误',
      data: {
        username: `testuser${Date.now()}`,
        email: 'invalid-email',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: true
      },
      expectedStatus: 400
    },
    {
      name: '❌ 用户名格式错误',
      data: {
        username: 'test-user', // 包含连字符
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: true
      },
      expectedStatus: 400
    },
    {
      name: '❌ 手机号格式错误',
      data: {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '13800138000', // 缺少+号
        acceptTerms: true
      },
      expectedStatus: 400
    },
    {
      name: '❌ 未同意服务条款',
      data: {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+8613800138000',
        acceptTerms: false
      },
      expectedStatus: 400
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log('='.repeat(50));
    
    try {
      const response = await axios.post(`${baseURL}/auth/register`, testCase.data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ 状态码: ${response.status} (期望: ${testCase.expectedStatus})`);
      console.log('📄 响应数据:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ 状态码: ${error.response?.status} (期望: ${testCase.expectedStatus})`);
      console.log('📄 错误响应:', JSON.stringify(error.response?.data, null, 2));
    }
  }

  // 测试重复注册
  console.log('\n\n🔄 测试重复注册...');
  console.log('='.repeat(50));
  
  const duplicateData = {
    username: `duplicateuser${Date.now()}`,
    email: `duplicate${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+8613800138000',
    acceptTerms: true
  };

  try {
    // 第一次注册
    console.log('📝 第一次注册...');
    const firstResponse = await axios.post(`${baseURL}/auth/register`, duplicateData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✅ 第一次注册成功: ${firstResponse.status}`);
    
    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 第二次注册相同数据
    console.log('📝 第二次注册相同数据...');
    const secondResponse = await axios.post(`${baseURL}/auth/register`, duplicateData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`❌ 第二次注册应该失败: ${secondResponse.status}`);
    
  } catch (error) {
    console.log(`✅ 重复注册被正确拒绝: ${error.response?.status}`);
    console.log('📄 错误信息:', error.response?.data?.message);
  }

  // 测试邮箱和用户名分别重复
  console.log('\n\n🔄 测试邮箱和用户名分别重复...');
  console.log('='.repeat(50));
  
  const baseData = {
    username: `uniqueuser${Date.now()}`,
    email: `unique${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+8613800138000',
    acceptTerms: true
  };

  try {
    // 先注册一个用户
    console.log('📝 注册第一个用户...');
    await axios.post(`${baseURL}/auth/register`, baseData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ 第一个用户注册成功');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 测试重复邮箱
    console.log('📝 测试重复邮箱...');
    const duplicateEmailData = { ...baseData, username: `differentuser${Date.now()}` };
    try {
      await axios.post(`${baseURL}/auth/register`, duplicateEmailData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log(`✅ 重复邮箱被拒绝: ${error.response?.data?.message}`);
    }
    
    // 测试重复用户名
    console.log('📝 测试重复用户名...');
    const duplicateUsernameData = { ...baseData, email: `different${Date.now()}@example.com` };
    try {
      await axios.post(`${baseURL}/auth/register`, duplicateUsernameData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log(`✅ 重复用户名被拒绝: ${error.response?.data?.message}`);
    }
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

testEnhancedRegister().catch(console.error); 