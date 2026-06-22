const express = require('express')

const app = express()

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

module.exports = app
