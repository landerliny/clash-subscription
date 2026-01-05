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
    return res.status(405).json({ error: '只支持POST方法' });
  }

  try {
    const { userId, expireDays } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }

    console.log('收到请求:', { userId, expireDays });

    // 生成订阅链接
    const subscribeUrl = `${req.headers.origin}/api/subscribe?userId=${userId}&expireDays=${expireDays || 30}`;

    res.status(200).json({
      subscribeUrl: subscribeUrl,
      message: '链接生成成功'
    });

  } catch (error) {
    console.error('生成链接时出错:', error);
    res.status(500).json({ error: '内部服务器错误' });
  }
}
