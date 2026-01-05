const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // 设置CORS头部，允许前端请求
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST方法' });
  }

  // 验证管理员权限
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== adminPassword) {
    return res.status(403).json({ error: '认证失败，无权访问' });
  }

  try {
    const { userId, expireDays } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '缺少用户ID' });
    }

    // 生成唯一的token和计算过期时间戳
    const token = uuidv4();
    const expireTime = Date.now() + (parseInt(expireDays) * 24 * 60 * 60 * 1000);

    // 在实际应用中，这里应该将 {token, userId, expireTime} 存储到数据库或文件中。
    // 此处为演示，我们直接生成链接。
    console.log(`Generated token: ${token} for user: ${userId}, expires in: ${expireDays} days`);

    const subscribeUrl = `https://${req.headers.host}/api/subscribe?token=${token}&expire=${expireTime}`;

    res.status(200).json({
      subscribeUrl: subscribeUrl,
      message: '链接生成成功'
    });

  } catch (error) {
    console.error('生成链接时出错:', error);
    res.status(500).json({ error: '内部服务器错误' });
  }
};
