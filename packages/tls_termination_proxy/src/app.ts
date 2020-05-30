const express = require('express')
const fs = require('fs')
const https = require('https')

const app = express()

const port = process.env.PORT || 3000
const opts = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  requestCert: true,
  rejectUnauthorized: false,
  ca: [fs.readFileSync('rootCA.pem')],
}

app.get('/', (req, res) => {
  const cert = req.connection.getPeerCertificate()

  if (req.client.authorized) {
    res.send(
      `Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`
    )
  } else if (cert.subject) {
    res
      .status(403)
      .send(
        `Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`
      )
  } else {
    res
      .status(401)
      .send(`Sorry, but you need to provide a client certificate to continue.`)
  }
})

https.createServer(opts, app).listen(port, () => {
  console.log(`Example app listening at ${port}`)
})
