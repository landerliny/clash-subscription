module.exports = async (req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
  
  // 返回一个简单的测试配置
  const testConfig = `
port: 7890
socks-port: 7891
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "测试节点 - 直接连接"
    type: socks5
    server: 127.0.0.1
    port: 1080

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - "测试节点 - 直接连接"

rules:
  - MATCH,PROXY
`;

  res.send(testConfig);
};
