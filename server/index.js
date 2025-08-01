import express from 'express';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 读取 API Key
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
  res.send('🧧 Welcome to the BaZi Analyzer API! Please POST to /analyze');
});

// 八字分析接口
app.post('/analyze', async (req, res) => {
  const { birthday, gender, time } = req.body;

  if (!birthday || !gender || !time) {
    return res.status(400).json({
      error: 'Missing required fields: birthday, gender, or time',
    });
  }

  const prompt = `请根据以下信息进行详细的命理八字分析：

出生日期：${birthday}
性别：${gender}
出生时辰：${time}

请使用专业术语，并从性格、事业、财运、感情、健康、发展建议等方面详细分析，并使用中文回答。`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'AI 分析失败，请稍后再试。' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
