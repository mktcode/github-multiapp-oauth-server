
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const server = express()
const port = process.env.PORT

server.get('/', async (req, res) => {
  const app = req.query.app
  const code = req.query.code
  if (app && code) {
    const client_id = process.env[app.toUpperCase() + '_ID']
    const client_secret = process.env[app.toUpperCase() + '_SECRET']
    if (client_id && client_secret) {
      try {
        const auth = await axios.post('https://github.com/login/oauth/access_token', {
          client_id,
          client_secret,
          code
        }, {
          headers: {
            Accept: 'application/json'
          }
        })
        res.json(auth.data)
      } catch (e) {
        res.status(e.response.status).json({ error: 'internal_error', error_description: e.message })
      }
    } else {
      res.status(400).json({ error: 'bad_request', error_description: `App ${app} is not configured.` })
    }
  } else {
    res.status(400).json({ error: 'bad_request', error_description: 'No app or code provided.' })
  }
})

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
