# AIChatProxy
Chat to different AI webpage in one single page.  
一个页面，同时调用hunyuan、qianwen、chatglm。

## 用法
### 下载插件
1. 下载aichatproxy文件夹，该文件夹为插件代码。
2. 使用开发者模式加载插件。

### 登陆
分别在浏览器中各个AI的网页版本。如果之前登陆过，这一步可以跳过。

### 展示前端
使用在线页面`https://aichatproxy.pages.dev`，依次点开你想要对话的AI。

### Prompt
在页面输入框中输入Prompt，感受一次使用多个AI的畅快。

## 原理
通过插件在各个ai页面插入js代码，通过window.opener.postMessage和当前网站进行通信。注意检查origin，避免风险。
