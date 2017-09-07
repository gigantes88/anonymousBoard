// -------모듈 로딩-------
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const app = express();


// -------미들웨어 로딩-------
const basicAuthMiddleware = basicAuth({
  users: { 'admin': '1234' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });  // body-parser 미들웨어 설정

// -------db-------
const board = [
  { bId: 1, bTitle: '안녕하세요1', bContents: '냉무', bWriter: '무명'
  },
  { bId: 2, bTitle: '안녕하세요2', bContents: '냉무', bWriter: '무명'
  },
  { bId: 3, bTitle: '안녕하세요3', bContents: '냉무', bWriter: '무명'
  },
];
const comments = [
  { cId: 1,
    cComment: '낚였다.',
    cWriter: 'it'
  },
  { cId: 1,
    cComment: '워메',
    cWriter: 'ㅋㅋ'
  },
  { cId: 2,
    cComment: '"글썼더니 왠 댓글이지?"라고 놀랐나요?',
    cWriter: '후'
  },
];


// -------앱 사용-------
app.set('view engine', 'ejs');  // ejs 설정
app.use('/static', express.static('./public')); // static 설정
app.use(morgan('tiny'));  // morgan 설정

// ***index 화면 GET***
app.get('/', (req, res) => {
  res.render('index', { board });
});
// ***로그인 화면 GET***
app.get('/auth', basicAuthMiddleware, (req, res) => {
  res.render('auth', { board });
});
// ***write 화면 GET***
app.get('/write', (req, res) => {
  res.render('write');
});
// ***view 화면 GET***
app.get('/view/:bId', (req, res) => {
  const bId = parseInt(req.params.bId); // string -> number
  const matchedBoard = board.find(bItem => bItem.bId === bId); // bId와 일치한 글 내용
  const matchedComments = comments.filter(cItem => cItem.cId === bId); // cId와 일치한 댓글 내용

  if (matchedBoard) {
    res.render('view', { matchedBoard, matchedComments });
  } else {
    res.status(404);
    res.send('404가 왜 뜰까?');
  }
});
// ***익명게시판 글쓰기 POST***
app.post('/write', bodyParserMiddleware, (req, res) => {
  const bId = board[board.length -1] ? board[board.length -1].bId + 1 : 1;
  const bTitle = req.body.bTitle;
  const bContents = req.body.bContents;
  const bWriter = req.body.bWriter;

  if (bId, bTitle, bContents, bWriter) {
    board.push({ bId, bTitle, bContents, bWriter });
    res.redirect('/');
  } else {
    res.status(400);
    res.send('400 잘못된 요청입니다. 제대로 입력하세요!');
  }
});
// ***익명게시판 댓글쓰기 POST***
app.post('/view/:bId', bodyParserMiddleware, (req, res) => {
  let bId = req.params.bId; // uri에 있는 보드 아이디값
  let cId = parseInt(bId);  // 댓글 아이디와 보드 아이디를 일치시키기 위해 cId에 number로 저장
  
  const cComment = req.body.cComment;
  const cWriter = req.body.cWriter;
  const matchedComments = board.find(bItem => bItem.bId === cId);

  if (matchedComments) {
    comments.push({ cId, cComment, cWriter });
    res.redirect(`/view/${bId}`);
  } else {
    res.status(400);
    res.send('400 잘못된 요청입니다. 댓글을 제대로 입력하세요!');
  }
});
// ***익명게시판 관리자 글삭제 POST***
app.post('/auth/:bId', bodyParserMiddleware, (req, res) => {
  const bId = req.params.bId;
  const delIndex = board.findIndex(bItem => bItem.bId === bId);
  if (delIndex) {
    board.splice(delIndex, 1); // 해당 인덱스의 엘리먼트를 스플라이스
    res.redirect('/auth');
  } else { 
    return res.send(404, '404가 왜 나올까?');
  }
});

// -------앱 리슨-------
app.listen(3000, () => {
  console.log('listening to 3000 port');
});