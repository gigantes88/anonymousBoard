const express = require('express');
const app = express();

app.set('view engine', 'ejs');  // ejs 설정
app.use('/static', express.static('./public')); // static 설정

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('listening to 3000 port');
})