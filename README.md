# 📈 股票案例印证知识库

股票案例印证知识库系统，用于记录、管理和检索YouTube直播中的股票分析案例。

## 功能特点

- 📚 **案例记录** - 记录股票分析案例（支撑/压力/止损/目标）
- 📑 **PPT印证** - 上传PPT案例，标签分类（筹码/机构/AI赢家等）
- 💬 **学员反馈** - 记录学员获利反馈
- 🤖 **AI提取** - 自动从文本提取股票/价格/方法
- 🔍 **标签搜索** - 按标签快速筛选案例
- 📊 **数据统计** - 案例趋势图表

## 部署到 Render

1. Fork 或推送此仓库到 GitHub
2. 在 [Render](https://render.com) 创建 New Web Service
3. 连接 GitHub 仓库
4. 设置：
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. 点击 Deploy

## 本地运行

```bash
npm install
npm start
```

访问 http://localhost:3000

## 数据备份

在"数据"页面可以导出/导入 JSON 数据，建议定期备份。