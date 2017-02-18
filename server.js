const express = require('express');
const path = require('path');
const stylus = require('stylus');
const multer = require('multer');
const fs = require('fs');
const rimraf = require('rimraf');

const upload = multer({ dest: './uploads/' });

const app = express();

// Use process.env.PORT if set for Heroku, AWS, etc.
const port = process.env.PORT || 8080;

// Configure templating engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

// Enable Stylus preprocessor as middleware
app.use(stylus.middleware({
  src: path.join(__dirname, '/res'),
  dest: path.join(__dirname, '/public'),
  compile: (str, filepath) => (
    stylus(str)
    .set('filename', filepath)
    .set('compress', true)
  ),
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'File Metadata Microservice',
    url: 'https://fcc-fmeta.herokuapp.com',
  });
});
app.post('/file', upload.single('fileupload'), (req, res) => {
  // Clearing out ./uploads first
  rimraf.sync('./uploads');
  fs.mkdir('./uploads');
  res.json({ filesize: req.file.size, msg: 'Grandma would be proud!' });
});

app.get('*', (req, res) => {
  res.render('404', {});
});

app.listen(port);

// Export functions for testing in server-test.js
module.exports = {
};
