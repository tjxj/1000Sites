# zhanglearning.com 多二级域名网站部署方案

本项目为 zhanglearning.com 域名下创建大量二级域名网站（如 invest.zhanglearning.com）的解决方案，使用 Cloudflare Pages 进行简单高效的部署。

## 目录结构

```
/
├── index.html            # 主域名首页
├── _redirects            # 重定向规则文件(重要)
└── subdomains/           # 二级域名目录
    ├── invest/           # invest.zhanglearning.com
    │   └── index.html
    ├── finance/          # finance.zhanglearning.com
    │   └── index.html
    └── ...               # 其他二级域名
```

## 部署步骤

### 1. DNS 配置设置

首先，在 Cloudflare DNS 控制面板中添加一个通配符 DNS 记录：

```
类型: CNAME
名称: *
目标: zhanglearning.com
代理状态: 已代理(橙色云朵)
```

这个通配符记录会将所有二级域名（如 invest.zhanglearning.com, finance.zhanglearning.com 等）指向您的主域名。

### 2. 项目结构说明

- **index.html**: 主域名首页，访问 zhanglearning.com 时显示的内容
- **_redirects**: 重要的重定向规则文件，用于将二级域名请求映射到相应的子目录
- **subdomains/**: 包含所有二级域名网站内容的目录
  - 每个子目录对应一个二级域名网站

### 3. 重定向规则配置

`_redirects`文件中的规则格式如下：

```
http://invest.zhanglearning.com/* https://zhanglearning.com/subdomains/invest/:splat 200!
```

说明：
- `http://invest.zhanglearning.com/*`: 匹配所有到此二级域名的请求
- `https://zhanglearning.com/subdomains/invest/:splat`: 重定向到主域名下的子目录
- `200!`: 表示这是一个代理重定向（保持 URL 不变，但内容来自子目录）

### 4. 使用_routes.json 替代方案

您也可以使用 Cloudflare Pages 的`_routes.json`文件进行更高级的路由控制：

```json
{
  "routes": [
    {
      "pattern": "invest.zhanglearning.com/*",
      "content": "/subdomains/invest/:splat"
    },
    {
      "pattern": "finance.zhanglearning.com/*",
      "content": "/subdomains/finance/:splat"
    }
  ]
}
```

### 5. 通过脚本自动生成

如果需要创建大量二级域名，可以使用以下 Python 脚本自动生成目录结构和路由配置：

```python
import os

# 二级域名列表
subdomains = ["invest", "finance", "marketing", ... ] # 您的二级域名列表

# 创建目录结构
for subdomain in subdomains:
    path = f"subdomains/{subdomain}"
    os.makedirs(path, exist_ok=True)
    
    # 创建基本页面
    with open(f"{path}/index.html", "w") as f:
        f.write(f"<!DOCTYPE html>\n<html>\n<head>\n<title>{subdomain}.zhanglearning.com</title>\n</head>\n<body>\n<h1>欢迎访问 {subdomain}.zhanglearning.com</h1>\n</body>\n</html>")

# 生成重定向规则
with open("_redirects", "w") as f:
    for subdomain in subdomains:
        f.write(f"http://{subdomain}.zhanglearning.com/* https://zhanglearning.com/subdomains/{subdomain}/:splat 200!\n")
```

### 6. 部署到 Cloudflare Pages

1. 将整个项目推送到 Git 仓库（GitHub、GitLab 等）
2. 在 Cloudflare Pages 创建新项目，连接您的 Git 仓库
3. 部署配置中添加自定义域名：zhanglearning.com
4. 完成部署流程

## 替代方案：使用 Cloudflare Workers

如果您的网站结构更复杂，或需要更动态的内容，可以使用 Cloudflare Workers：

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname
  
  // 提取子域名
  const subdomain = hostname.split('.')[0]
  
  if (subdomain !== 'zhanglearning') {
    // 处理二级域名
    return fetch(`https://zhanglearning.com/subdomains/${subdomain}${url.pathname}`)
  }
  
  // 处理主域名请求
  return fetch(request)
}
```

## 优势与注意事项

### 优势
- 单一部署点，易于维护
- 自动化创建和管理大量二级域名
- 节省 Cloudflare Pages 项目配额
- 便于统一更新和管理

### 注意事项
- 对于非常大规模的网站，需要注意资源文件的组织
- 确保正确设置缓存控制和安全头部
- 定期监控性能，必要时可拆分为多个项目

## 如何添加新的二级域名

1. 在`subdomains`目录下创建新的子目录
2. 在新子目录中添加网站内容
3. 在`_redirects`文件中添加相应的重定向规则
4. 重新部署项目

## 资源文件管理

对于每个二级域名网站的资源文件（CSS、JavaScript、图片等），建议使用以下结构：

```
subdomains/
  invest/
    index.html
    assets/
      css/
      js/
      images/
  finance/
    index.html
    assets/
      css/
      js/
      images/
```

也可以在项目根目录下创建一个共享资源目录，用于存放多个二级域名网站共用的资源文件。
