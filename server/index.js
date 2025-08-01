import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { birthDate, birthTime, gender } = req.body;

  if (!birthDate || !birthTime || !gender) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  res.json({
    result: `性别：${gender}，出生日期：${birthDate}，时辰：${birthTime}，八字分析结果将在这里显示。`
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
