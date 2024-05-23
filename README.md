# AIChatProxy
Chat to different AI webpage in one single page.  
一个页面，同时调用hunyuan、qianwen、chatglm。

## 演示
![demo](/static/demo.png)

## 用法
### 下载插件
1. 下载aichatproxy文件夹，该文件夹为插件代码。
2. 如果你是在本地使用`python -m http.server`来展示webpage中的页面，那么可以直接开发者模式加载插件。
3. 如果你想使用其他域名来展示前端页面，需要搜索替换代码中的`http://127.0.0.1:8000`为你的域名，如`https://aichatproxy.pages.dev`，之后再使用开发者模式加载插件。

### 登陆
分别在浏览器中各个AI的网页版本。如果之前登陆过，这一步可以跳过。

### 展示前端
本地python展示或者使用在线页面，依次点开你想要对话的AI。

### Prompt
在页面输入框中输入Prompt，感受一次使用多个AI的畅快。

### 其他
如果你想使用`https://aichatproxy.pages.dev`作为前端，可以下载已经[修改配置的版本](https://github.com/h4fan/AIChatProxy/tree/gh-pages)。

## 原理
通过插件在各个ai页面插入js代码，通过window.opener.postMessage和当前网站进行通信。注意检查origin，避免风险。
