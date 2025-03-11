export async function onRequest(context) {
    const url = new URL(context.request.url);
    const hostname = url.hostname;
  
    // 处理二级域名
    if (hostname.includes('.zhanglearning.com')) {
      const subdomain = hostname.split('.')[0];
      
      let targetPath = '';
      switch(subdomain) {
        case 'invest':
          targetPath = '/subdomains/invest';
          break;
        case 'ai-navigate':
          targetPath = '/subdomains/AiNavigateWebsites';
          break;
        case 'ml-guide':
          targetPath = '/subdomains/MLGuide';
          break;
        case 'ml-blog':
          targetPath = '/subdomains/machineLearningBlog';
          break;
        default:
          return context.next();
      }
  
      // 如果是根路径，添加 index.html
      let path = url.pathname;
      if (path === '/' || path === '') {
        path = '/index.html';
      }
  
      // 构建新的请求
      const newUrl = new URL(targetPath + path, url.origin);
      const newRequest = new Request(newUrl, context.request);
      
      // 返回新的响应
      return context.env.ASSETS.fetch(newRequest);
    }
  
    return context.next();
  }