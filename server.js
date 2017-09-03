const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });  // body-parser 미들웨어 설정

// db
const board = [
  { bId: 1, 
    bTitle: '제목이지롱1', 
    bContents: '내용이지롱1', 
    bWriter: '작성자이지롱1'
  },
];
const comments = [
  { cId: 1,
    cComment: '댓글내용1-1',
    cWriter: '댓글작성자1-1'
  },
  { cId: 1,
    cComment: '댓글내용1-2',
    cWriter: '댓글작성자1-2'
  },
  { cId: 2,
    cComment: '댓글내용2-1',
    cWriter: '댓글작성자2-2'
  },
  { cId: 2,
    cComment: '댓글내용2-2',
    cWriter: '댓글작성자2-2'
  },
];

app.set('view engine', 'ejs');  // ejs 설정
app.use('/static', express.static('./public')); // static 설정

// index 화면 GET
app.get('/', (req, res) => {
  res.render('index', { board });
});

// write 화면 GET
app.get('/write', (req, res) => {
  res.render('write');
});

// view 화면 GET
app.get('/view/:bId', (req, res) => {
  const bId = parseInt(req.params.bId); // string -> number
  const matchedBoard = [...board].find(bItem => bItem.bId === bId); // bId와 일치한 글 내용
  const matchedComments = [...comments].filter(cItem => cItem.cId === bId); // cId와 일치한 댓글 내용

  if (matchedBoard) {
    res.render('view', { matchedBoard, matchedComments });
  } else {
    res.status(404);
    res.send('404 기분이 안좋다');
  }
});

// 익명게시판 글쓰기 POST
app.post('/write', bodyParserMiddleware, (req, res) => {
  let bId = board.length + 1;
  const bTitle = req.body.bTitle;
  const bContents = req.body.bContents;
  const bWriter = req.body.bWriter;
  
  if (bTitle, bContents, bWriter) {
    board.push({ bId, bTitle, bContents, bWriter });
    res.redirect(`/view/${bId}`);
  } else {
    res.status(400);
    res.send('400 잘못된 요청입니다. 제대로 입력하세요!');
  }
});

// 익명게시판 댓글쓰기 POST
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


app.listen(3000, () => {
  console.log('listening to 3000 port');
});