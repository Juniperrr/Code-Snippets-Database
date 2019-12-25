// app.js
const snippet = require('./snippet.js');
const express = require('express');
// const bodyParser = require('body-parser');
// const hbs = require("hbs");
const path = require('path');
const fs = require('fs');
const lineReader = require('line-reader');
// const detectNewline = require('detect-newline');

const app = express();
const snippets = [];
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(function(req, res, next) {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log(req.query);
  next();
});

app.get('/', function(req, res) {
  filtered = [];
  // if there is a filter, then filter = empty array
  // if there is no filter, filter = all of this.
  for (i = 0; i < snippets.length; i++) {
    if ((snippets[i].hasTag(req.query.tagQ) || req.query.tagQ == '') &&
        snippets[i].lines >= req.query.lineQ &&
        snippets[i].code.includes(req.query.textQ)) {
      filtered.push(snippets[i]);
    }
  }
  if (filtered.length === 0) {
    filtered = snippets;
  }
  // filtered = snippets
  res.render('home', {snippets: filtered});
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', function(req, res) { // req: server receives
  console.log('app.post/add req.body', req.body);
  const name = req.body.name;
  const code = req.body.code;
  const tag = req.body.tag;
  const s = new snippet.Snippet(
      name,
      code,
      tag,
  );
  console.log('s', s);
  snippets.push(s);
  console.log('snippets.length', snippets.length);
  res.render('add'); // server: return following
});
const s = new snippet.Snippet(
    'hello.js',
    `const hello = () => {
      console.log('hello');
    };
    hello();`,
    'hello', 'function', 'arrow'
);
// the constructor results in an object with the following properties / methods:
console.log(s.name); // hello.js
console.log(s.code); // the entirety of the code
console.log(s.lines); // 4 (this needs to be calculated!)
console.log(s.tags); // an Array, ['hello', 'function', 'arrow'] z
console.log(s.hasTag('fun')); // false
// TODO: make it return true
console.log(s.hasTag('function')); // true

// read all files, save snips in snippets, print out the entire snppets.
const initialData = function(cb) {
  fs.readdir(__dirname + '/code-samples', (err, files) => {
    if (err) {
      return; // what to do
    } else {
      let filesRead = 0;
      files.forEach((file) => {
        let tags = [];
        let code = '';
        let count = 0;

        lineReader.eachLine(__dirname + '/code-samples/' + file, (line, last) => {
          if (count === 0) {
            // tags = line.replace(/[^\w\s]/gi, '').replace(/ /ig, '').split(',');
            tags = line.replace(/\/\//gi, '').replace(/ /ig, '').split(',');
          } else {
            code += line;

            if (!last) {
              code += `\r\n`;
            }
          }
          count++;

          if (last) {
            const snip = new snippet.Snippet(file, code, ...tags);
            snippets.push(snip);
            filesRead++;
          }

          if (filesRead >= files.length) {
            cb();
          }
        });
      });
    }
  });
};

/**
 * @function startServer
 */
function startServer() {
  console.log(snippets);
  app.listen(3000);
  console.log('Server started; type CTRL+C to shut down ');
};

initialData(startServer);
