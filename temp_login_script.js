// 处理登录
const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    alert('请输入用户名和密码')
    return
  }
  
  isLoading.value = true
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟登录验证
    if (formData.username === 'zhangwanting' && formData.password === '123456') {
      // 登录成功，保存用户信息到本地存储
      localStorage.setItem('userInfo', JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString(),
        rememberMe: formData.rememberMe
      }))
      
      // 跳转到首页-我的看板页面
      router.push('/Home')
    } else {
      // 登录失败
      alert('用户名或密码错误！\n\n提示：请使用以下测试账号：\n用户名：zhangwanting\n密码：123456')
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}
