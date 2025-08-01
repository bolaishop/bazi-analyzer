import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(cors())
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是一个精通中国八字命理的分析师，分析要专业、详细、接地气。' },
        { role: 'user', content: text }
      ]
    })
    const result = chatCompletion.choices[0].message.content
    res.json({ result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
