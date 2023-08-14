const fs = require('node:fs')
const http = require('node:http')
const https = require('node:https')

const PORT = process.env.PORT && Number(process.env.PORT) || 8888

const IMAGES = {
  docker: 'https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/87/docker-badge.png',
  linux: 'https://kernel.org/theme/images/logos/tux.png',
  nodejs: 'https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/23/node-sticker.png',
  python: 'https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/20/57795360-bec24f00-7713-11e9-9516-20f5f5d0f034.png',
}

function requestListener(req, res) {
  console.log(req.method, req.url)

  if (req.url == '/') {
    fs.readFile('./skills.html', function (error, content) {
      if (error) {
        res.writeHead(500)
        res.end('Sorry')
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(content, 'utf-8')
      }
    })
    return
  }

  if (req.url.endsWith('.png')) {
    const url = IMAGES[req.url.substring(1, req.url.length - 4)]
    if (url) {
      const proxy = https.get(url, (response) => {
        res.writeHead(response.statusCode, response.headers)
        response.pipe(res, { end: true })
      })
      req.pipe(proxy, { end: true })
      return
    }
  }

  res.writeHead(404)
  res.end('Hello')
}

http.createServer(requestListener).listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
