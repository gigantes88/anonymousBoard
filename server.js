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
  { bId: 1, 
    bTitle: '당신은 운이 좋으시군요', 
    bContents: '이 편지는 영국에서 최초로 시작되어 일년에 한 바퀴 돌면서 받는 사람에게 행운을 주었고 지금은 당신에게로 옮겨진 이 편지는 4일 안에 당신 곁을 떠나야 합니다. 이 편지를 포함해서 7통을 행운이 필요한 사람에게 보내 주셔야 합니다. 복사를 해도 좋습니다. 혹 미신이라 하실지 모르지만 사실입니다. 영국에서 HGXWCH이라는 사람은 1930년에 이 편지를 받았습니다. 그는 비서에게 복사해서 보내라고 했습니다. 며칠 뒤에 복권이 당첨되어 20억을 받았습니다. 어떤 이는 이 편지를 받았으나 96시간 이내 자신의 손에서 떠나야 한다는 사실을 잊었습니다. 그는 곧 사직되었습니다. 나중에야 이 사실을 알고 7통의 편지를 보냈는데 다시 좋은 직장을 얻었습니다. 미국의 케네디 대통령은 이 편지를 받았지만 그냥 버렸습니다. 결국 9일 후 그는 암살 당했습니다. 기억해 주세요. 이 편지를 보내면 7년의 행운이 있을 것이고 그렇지 않으면 3년의 불행이 있을 것입니다. 그리고 이 편지를 버리거나 낙서를 해서는 절대로 안됩니다. 7통입니다. 이 편지를 받은 사람은 행운이 깃들 것입니다. 힘들겠지만 좋은게 좋다고 생각하세요. 7년의 행운을 빌면서..', 
    bWriter: '패스트캠퍼스'
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
// ***로그인 화면 GET*** 해결못한 부분
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
  const matchedBoard = [...board].find(bItem => bItem.bId === bId); // bId와 일치한 글 내용
  const matchedComments = [...comments].filter(cItem => cItem.cId === bId); // cId와 일치한 댓글 내용

  if (matchedBoard) {
    res.render('view', { matchedBoard, matchedComments });
  } else {
    res.status(404);
    res.send('404가 왜 뜰까?');
  }
});
// ***익명게시판 글쓰기 POST***
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
  board.splice(bId - 1, 1); // 해당 인덱스의 엘리먼트를 스플라이스

  res.redirect('/auth');
});

// -------앱 리슨-------
app.listen(3000, () => {
  console.log('listening to 3000 port');
});
