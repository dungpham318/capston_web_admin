const path = require('path');
const express = require('express');
const app = express();
let root = path.join(__dirname, 'build/');

const port = process.argv.slice(2)[0] || 9090;

app.use('/', express.static(root));
console.log(path.join(__dirname, 'build/'))

app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

app.listen(port, () => console.log(`Listening on port ${port}`))
