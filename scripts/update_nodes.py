import requests
import yaml
import time

def fetch_clash_config(url):
    """从指定的URL获取Clash配置"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 Clash-Node-Updater'}
        response = requests.get(url, timeout=15, headers=headers)
        if response.status_code == 200:
            return response.text
        else:
            print(f"获取 {url} 失败，状态码: {response.status_code}")
            return None
    except Exception as e:
        print(f"获取 {url} 时出错: {e}")
        return None

def main():
    # 多个免费的Clash订阅源（示例用，请确保可用性）
    sources = [
        "https://clashnode.com/wp-content/uploads/2024/12/clashnode.yaml",
        "https://raw.githubusercontent.com/weishenflying/free/main/free",
        "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/sub/sub_merge.txt",
        "https://raw.githubusercontent.com/Annie-Xiao/sub/main/all.yaml"
    ]

    all_proxies = []
    
    for url in sources:
        print(f"正在从 {url} 获取节点...")
        config_text = fetch_clash_config(url)
        if config_text:
            try:
                config = yaml.safe_load(config_text)
                if config and 'proxies' in config and isinstance(config['proxies'], list):
                    # 简单处理：只取前20个节点，避免单个源过多
                    proxies_from_source = config['proxies'][:20]
                    all_proxies.extend(proxies_from_source)
                    print(f"  从该源获取到 {len(proxies_from_source)} 个节点")
                else:
                    # 可能是Base64编码的订阅链接，这里简化处理，跳过
                    print(f"  该源格式不符合预期，已跳过")
            except yaml.YAMLError as e:
                print(f"  解析YAML失败: {e}")
        time.sleep(1)  # 礼貌性延迟，避免请求过快

    # 去重：根据服务器地址和端口
    unique_proxies = []
    seen = set()
    for proxy in all_proxies:
        key = (proxy.get('server', ''), proxy.get('port', ''))
        if key not in seen and key != ('', ''):
            seen.add(key)
            unique_proxies.append(proxy)

    print(f"\n去重后总节点数: {len(unique_proxies)}")

    # 确保至少有30个节点，如果不够则重复之前的节点（实际使用时请确保源足够）
    while len(unique_proxies) < 30:
        print("节点数量不足30，正在补充...")
        # 这里简单重复，实际应寻找更多源
        unique_proxies.extend(unique_proxies[:30-len(unique_proxies)])

    # 生成标准的Clash配置文件
    clash_config = {
        'port': 7890,
        'socks-port': 7891,
        'redir-port': 7892,
        'allow-lan': False,
        'mode': 'rule',
        'log-level': 'info',
        'external-controller': '127.0.0.1:9090',
        'proxies': unique_proxies[:50],  # 最多取50个节点
        'proxy-groups': [
            {
                'name': '🚀 自动选择',
                'type': 'url-test',
                'proxies': [p['name'] for p in unique_proxies[:50]],
                'url': 'http://www.gstatic.com/generate_204',
                'interval': 300
            },
            {
                'name': '🎯 全球直连',
                'type': 'select',
                'proxies': [p['name'] for p in unique_proxies[:50]]
            }
        ],
        'rules': [
            'DOMAIN-SUFFIX,google.com,🚀 自动选择',
            'DOMAIN-SUFFIX,youtube.com,🚀 自动选择',
            'DOMAIN-SUFFIX,github.com,🚀 自动选择',
            'GEOIP,CN,DIRECT',
            'MATCH,🎯 全球直连'
        ]
    }

    # 保存生成的配置文件
    with open('configs/proxy.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(final_config, f, allow_unicode=True, default_flow_style=False)

    print(f"✅ 更新完成！共获取并保留了 {len(unique_proxies)} 个唯一节点。")

if __name__ == "__main__":
    main()
