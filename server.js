const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const CASES_FILE = path.join(DATA_DIR, 'cases.json');
const PPT_CASES_FILE = path.join(DATA_DIR, 'ppt_cases.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
function initDataFile(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

initDataFile(CASES_FILE);
initDataFile(PPT_CASES_FILE);
initDataFile(FEEDBACK_FILE);

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// 获取所有数据
app.get('/api/data', (req, res) => {
    try {
        const cases = JSON.parse(fs.readFileSync(CASES_FILE, 'utf-8'));
        const pptCases = JSON.parse(fs.readFileSync(PPT_CASES_FILE, 'utf-8'));
        const feedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
        
        res.json({ cases, pptCases, feedback });
    } catch (err) {
        res.status(500).json({ error: '读取数据失败' });
    }
});

// 保存案例
app.post('/api/cases', (req, res) => {
    try {
        const cases = JSON.parse(fs.readFileSync(CASES_FILE, 'utf-8'));
        const newCase = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        cases.push(newCase);
        fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
        res.json({ success: true, data: newCase });
    } catch (err) {
        res.status(500).json({ error: '保存失败' });
    }
});

// 更新案例
app.put('/api/cases/:id', (req, res) => {
    try {
        let cases = JSON.parse(fs.readFileSync(CASES_FILE, 'utf-8'));
        const index = cases.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: '案例不存在' });
        }
        cases[index] = { ...cases[index], ...req.body, updatedAt: new Date().toISOString() };
        fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
        res.json({ success: true, data: cases[index] });
    } catch (err) {
        res.status(500).json({ error: '更新失败' });
    }
});

// 删除案例
app.delete('/api/cases/:id', (req, res) => {
    try {
        let cases = JSON.parse(fs.readFileSync(CASES_FILE, 'utf-8'));
        cases = cases.filter(c => c.id !== req.params.id);
        fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '删除失败' });
    }
});

// 保存PPT案例
app.post('/api/ppt-cases', (req, res) => {
    try {
        const cases = JSON.parse(fs.readFileSync(PPT_CASES_FILE, 'utf-8'));
        const newCase = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        cases.push(newCase);
        fs.writeFileSync(PPT_CASES_FILE, JSON.stringify(cases, null, 2));
        res.json({ success: true, data: newCase });
    } catch (err) {
        res.status(500).json({ error: '保存失败' });
    }
});

// 删除PPT案例
app.delete('/api/ppt-cases/:id', (req, res) => {
    try {
        let cases = JSON.parse(fs.readFileSync(PPT_CASES_FILE, 'utf-8'));
        cases = cases.filter(c => c.id !== req.params.id);
        fs.writeFileSync(PPT_CASES_FILE, JSON.stringify(cases, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '删除失败' });
    }
});

// 保存反馈
app.post('/api/feedback', (req, res) => {
    try {
        const feedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
        const newFeedback = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        feedback.push(newFeedback);
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
        res.json({ success: true, data: newFeedback });
    } catch (err) {
        res.status(500).json({ error: '保存失败' });
    }
});

// 删除反馈
app.delete('/api/feedback/:id', (req, res) => {
    try {
        let feedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
        feedback = feedback.filter(f => f.id !== req.params.id);
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '删除失败' });
    }
});

// 导入数据
app.post('/api/import', (req, res) => {
    try {
        const { cases, pptCases, feedback } = req.body;
        if (cases) fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
        if (pptCases) fs.writeFileSync(PPT_CASES_FILE, JSON.stringify(pptCases, null, 2));
        if (feedback) fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '导入失败' });
    }
});

// 页面路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 股票案例印证系统运行在端口 ${PORT}`);
});