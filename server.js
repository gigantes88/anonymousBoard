const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });  // body-parser 미들웨어 설정

const data = [];

app.set('view engine', 'ejs');  // ejs 설정
app.use('/static', express.static('./public')); // static 설정

// index 화면 render
app.get('/', (req, res) => {
  res.render('index', {data});
});

// view 화면 render
app.get('/view', (req, res) => {
  res.render('view', {data});
});

// view 화면 가져오기
app.get('/view/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const matched = [...data].find(item => item.id === id);
  
  if (matched) {
    res.render('view.ejs', {matched});
  } else {
    res.status(404);
    res.send('404 떠서 기분이 안좋다');
  }

});

// 글쓰기
app.post('/view', bodyParserMiddleware, (req, res) => {
  let id = data.length + 1;
  const title = req.body.title;
  const contents = req.body.contents;
  const writer = req.body.writer;
  
  data.push({id, title, contents, writer });
  res.redirect('/');
  console.log(data);
  
});

app.listen(3000, () => {
  console.log('listening to 3000 port');
});