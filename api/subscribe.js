const https = require('https');

// 一个简单的内存存储（在实际生产中，应使用数据库或持久化存储）
// 这里为了简化，我们假设token是有效的。你可以后续在Vercel的环境变量里管理token列表。
const validTokens = new Set();

module.exports = async (req, res) => {
  const { token, expire } = req.query;

  // 简单的过期检查（示例，实际应更复杂）
  if (expire && Date.now() > parseInt(expire)) {
    res.status(403).send('订阅链接已过期');
    return;
  }

  // 这里是获取最新Clash配置的核心！
  // 从GitHub Raw地址获取我们自动化脚本生成的文件
  const githubRawUrl = 'https://raw.githubusercontent.com/landerliny/clash-subscription/main/configs/proxy.yaml';

  try {
    const configText = await new Promise((resolve, reject) => {
      https.get(githubRawUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => resolve(data));
      }).on('error', reject);
    });

    res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=clash.yaml');
    res.send(configText);
  } catch (error) {
    console.error('获取节点配置失败:', error);
    res.status(500).send('服务器错误，无法获取节点列表');
  }
};
