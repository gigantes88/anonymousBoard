const express = require('express');
const app = express();

const data = [
  {id: '1', title: '익명게시판이지롱', writer: '아무개'}
];

app.set('view engine', 'ejs');  // ejs 설정
app.use('/static', express.static('./public')); // static 설정

app.get('/', (req, res) => {
  res.render('index', {data});
});

// app.get('/:id', (req, res) => {
});

app.listen(3000, () => {
  console.log('listening to 3000 port');
});