module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  const { userId, expireDays } = req.query;
  
  const config = `# Clash配置文件
# 用户: ${userId || 'unknown'}
# 有效期: ${expireDays || 30}天

mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "Direct"
    type: socks5
    server: 127.0.0.1
    port: 1080

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - "Direct"

rules:
  - MATCH,PROXY
`;

  res.send(config);
};
