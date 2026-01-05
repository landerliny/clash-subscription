export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, expireDays } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('Received request:', { userId, expireDays });

    // 生成订阅链接
    const baseUrl = req.headers.origin || `https://${req.headers.host}`;
    const subscribeUrl = `${baseUrl}/api/subscribe?userId=${encodeURIComponent(userId)}&expireDays=${expireDays || 30}`;

    res.status(200).json({
      success: true,
      subscribeUrl: subscribeUrl,
      message: 'Subscription link generated successfully'
    });

  } catch (error) {
    console.error('Error generating link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
