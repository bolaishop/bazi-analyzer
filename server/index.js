const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// 读取 OpenAI API 密钥
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('❌ 请在环境变量中配置 OPENAI_API_KEY');
}

// 初始化 OpenAI 客户端
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 中间件
app.use(bodyParser.json());

// 首页路由
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the BaZi Analyzer API! Please POST to /analyze');
});

// 八字分析接口
app.post('/analyze', async (req, res) => {
  const { birthday, gender, time } = req.body;

  if (!birthday || !gender || !time) {
    return res.status(400).json({
      error: '请提供完整的参数：birthday（格式如1986/5/10）、gender（male或female）、time（格式如07:00）',
    });
  }

  try {
    const prompt = `
你是一名精通中国命理学的八字分析大师。请根据以下信息分析八字命盘，内容不少于150字：

生日：${birthday}
性别：${gender}
出生时辰：${time}

请分析整体命格、性格特点、事业方向、健康情况以及未来10年的大致运势。
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是一位精通八字命理的分析师，请使用通俗易懂的中文回答。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const result = completion.data.choices[0].message.content;

    res.json({
      input: { birthday, gender, time },
      analysis: result,
    });
  } catch (err) {
    console.error('分析出错:', err.message);
    res.status(500).json({ error: '分析失败，请稍后再试。' });
  }
});

app.listen(port, () => {
  console.log(`✅ 服务已启动，端口: ${port}`);
});
