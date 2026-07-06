/**
 * 股票教学案例管理系统 - 在线版服务器
 * 数据存储在内存中（适合演示）
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 内存数据库（实际使用时可改为文件存储）
const db = {
    cases: [],
    evidence: [],
    feedback: [],
    nasdaq: []
};

// 初始化演示数据
function initDemoData() {
    // 生成纳指数据
    const today = new Date();
    for (let i = 60; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const base = 14000 + Math.sin(i / 10) * 1000;
        const random = (Math.random() - 0.5) * 500;
        const close = base + random;
        
        db.nasdaq.push({
            date: date.toISOString().split('T')[0],
            open: parseFloat((close + (Math.random() - 0.5) * 100).toFixed(2)),
            high: parseFloat((Math.max(close, close + (Math.random() - 0.5) * 100) + Math.random() * 50).toFixed(2)),
            low: parseFloat((Math.min(close, close + (Math.random() - 0.5) * 100) - Math.random() * 50).toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
    }
    
    // 演示案例
    db.cases = [
        { id: 1, date: db.nasdaq[10].date, stock_code: '600519', stock_name: '贵州茅台', pressure_points: [1800], support_points: [1750], risk_points: ['跌破支撑需止损'], opportunity_points: ['机构持续买入'] },
        { id: 2, date: db.nasdaq[20].date, stock_code: '000001', stock_name: '平安银行', pressure_points: [15, 16], support_points: [14], risk_points: ['注意量能变化'], opportunity_points: ['趋势向上'] },
        { id: 3, date: db.nasdaq[30].date, stock_code: '300750', stock_name: '宁德时代', pressure_points: [450], support_points: [400, 380], risk_points: ['高位震荡风险'], opportunity_points: ['新能源龙头', '机构加仓'] }
    ];
    
    // 演示印证案例
    db.evidence = [
        { id: 1, date: db.nasdaq[15].date, stock_code: '600519', stock_name: '贵州茅台', evidence_type: '筹码', evidence_tags: ['单峰密集', '主力流入'], description: '筹码峰集中在1700-1800区间，呈现单峰密集形态' },
        { id: 2, date: db.nasdaq[25].date, stock_code: '000001', stock_name: '平安银行', evidence_type: '趋势', evidence_tags: ['上升通道', '均线多头排列'], description: '处于上升通道中，均线多头排列' },
        { id: 3, date: db.nasdaq[35].date, stock_code: '300750', stock_name: '宁德时代', evidence_type: '机构DC', evidence_tags: ['主力建仓', '资金流入'], description: '机构资金持续流入，DC指标显示主力建仓' },
        { id: 4, date: db.nasdaq[40].date, stock_code: '600519', stock_name: '贵州茅台', evidence_type: '密码', evidence_tags: ['量学密码', '涨停密码'], description: '出现量学涨停密码形态' }
    ];
    
    // 演示反馈
    db.feedback = [
        { id: 1, date: db.nasdaq[12].date, student_name: '张三', stock_code: '600519', profit_amount: 5000, method_tags: ['筹码', '0家K线'], description: '根据筹码分布买入，获利10%' },
        { id: 2, date: db.nasdaq[22].date, student_name: '李四', stock_code: '000001', profit_amount: 3000, method_tags: ['趋势'], description: '按趋势方法操作，获利8%' }
    ];
}

initDemoData();

// 页面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API路由

// 获取统计
app.get('/api/stats', (req, res) => {
    res.json({
        caseCount: db.cases.length,
        evidenceCount: db.evidence.length,
        feedbackCount: db.feedback.length,
        nasdaqCount: db.nasdaq.length
    });
});

// 案例相关
app.get('/api/cases', (req, res) => {
    res.json({ cases: db.cases });
});

app.post('/api/cases', (req, res) => {
    const data = { id: Date.now(), ...req.body };
    db.cases.unshift(data);
    res.json({ success: true, id: data.id });
});

// 印证案例
app.get('/api/evidence', (req, res) => {
    let result = db.evidence;
    
    if (req.query.tag) {
        const tag = req.query.tag.toLowerCase();
        result = result.filter(e => 
            (e.evidence_type && e.evidence_type.toLowerCase().includes(tag)) ||
            (e.evidence_tags && e.evidence_tags.some(t => t.toLowerCase().includes(tag)))
        );
    }
    
    if (req.query.stock) {
        result = result.filter(e => e.stock_code === req.query.stock);
    }
    
    res.json({ evidence: result });
});

app.post('/api/evidence', (req, res) => {
    const data = { id: Date.now(), ...req.body };
    db.evidence.unshift(data);
    res.json({ success: true, id: data.id });
});

// 标签
app.get('/api/tags', (req, res) => {
    const typeCount = {};
    const allTags = new Set();
    
    db.evidence.forEach(e => {
        if (e.evidence_type) {
            typeCount[e.evidence_type] = (typeCount[e.evidence_type] || 0) + 1;
        }
        if (e.evidence_tags) {
            e.evidence_tags.forEach(t => allTags.add(t));
        }
    });
    
    const evidence_types = Object.entries(typeCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    res.json({
        evidence_types,
        all_tags: Array.from(allTags).sort()
    });
});

// 搜索
app.get('/api/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    const stock = req.query.stock;
    
    let results = db.evidence.filter(e => {
        const matchQuery = !query || 
            (e.evidence_type && e.evidence_type.toLowerCase().includes(query)) ||
            (e.evidence_tags && e.evidence_tags.some(t => t.toLowerCase().includes(query))) ||
            (e.description && e.description.toLowerCase().includes(query));
        const matchStock = !stock || e.stock_code === stock;
        return matchQuery && matchStock;
    });
    
    res.json({ results });
});

// 反馈
app.get('/api/feedback', (req, res) => {
    let result = db.feedback;
    
    if (req.query.method) {
        result = result.filter(f => 
            f.method_tags && f.method_tags.includes(req.query.method)
        );
    }
    
    res.json({ feedback: result });
});

app.post('/api/feedback', (req, res) => {
    const data = { id: Date.now(), ...req.body };
    db.feedback.unshift(data);
    res.json({ success: true, id: data.id });
});

// 纳指数据
app.get('/api/nasdaq/data', (req, res) => {
    res.json({ data: db.nasdaq });
});

// 图表数据
app.get('/api/chart/data', (req, res) => {
    const cases = {};
    db.cases.forEach(c => {
        if (!cases[c.date]) {
            cases[c.date] = { count: 0, stocks: [] };
        }
        cases[c.date].count++;
        cases[c.date].stocks.push(c.stock_code);
    });
    
    const evidence = {};
    db.evidence.forEach(e => {
        evidence[e.date] = (evidence[e.date] || 0) + 1;
    });
    
    const feedback = {};
    db.feedback.forEach(f => {
        feedback[f.date] = (feedback[f.date] || 0) + 1;
    });
    
    res.json({
        nasdaq: db.nasdaq,
        cases,
        evidence,
        feedback
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('  股票教学案例管理系统 - 在线版');
    console.log('='.repeat(50));
    console.log(`  🚀 服务已启动！`);
    console.log(`  📍 访问地址: http://localhost:${PORT}`);
    console.log('='.repeat(50));
});
