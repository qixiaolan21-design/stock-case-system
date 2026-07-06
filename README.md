# 股票教学案例管理系统 - 在线版

可以部署到 Render、Heroku 或其他云平台的版本。

## 部署到 Render

1. 在 [Render](https://render.com) 注册账号
2. 创建新的 Web Service
3. 连接 GitHub 仓库或上传代码
4. 设置：
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 点击 Deploy

部署完成后会获得一个网址，例如：`https://stock-case-system.onrender.com`

## 本地运行

```bash
npm install
npm start
```

访问 http://localhost:3000

## 功能

- 案例记录管理
- 印证案例库（支持标签）
- 学员反馈
- 案例搜索
- 纳指图表展示
