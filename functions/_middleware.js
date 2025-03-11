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
  
      // 构建新的 URL 路径
      const path = url.pathname === '/' ? '/index.html' : url.pathname;
      const newUrl = new URL(targetPath + path, url.origin);
      
      // 获取响应
      const response = await context.next();
      const newResponse = new Response(response.body, response);
      
      return newResponse;
    }
  
    return context.next();
  }