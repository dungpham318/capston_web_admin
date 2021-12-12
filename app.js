const path = require('path');
const express = require('express');
const app = express();
let root = path.join(__dirname, 'dist/');

const port = process.argv.slice(2)[0] || 9005;

app.use('/', express.static(root));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

app.listen(port, () => console.log(`Listening on port ${port}`))
