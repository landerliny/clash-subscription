export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  const { userId, expireDays } = req.query;
  
  const config = `# Clash Configuration
# User: ${userId || 'unknown'}
# Expire Days: ${expireDays || 30}

mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "Test Node"
    type: socks5
    server: 127.0.0.1
    port: 1080

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - "Test Node"

rules:
  - MATCH,PROXY
`;

  res.send(config);
}
