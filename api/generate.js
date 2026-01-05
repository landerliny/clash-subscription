// Vercel Serverless Function标准格式
module.exports = async (req, res) => {
  // 允许CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { userId, expireDays } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // 生成订阅链接
    const baseUrl = req.headers.origin || 'https://' + req.headers.host;
    const subscribeUrl = `${baseUrl}/api/subscribe?userId=${encodeURIComponent(userId)}&expireDays=${expireDays || 30}`;
    
    res.status(200).json({
      success: true,
      subscribeUrl: subscribeUrl,
      message: 'Subscription link generated successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
