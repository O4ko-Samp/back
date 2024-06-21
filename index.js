const express = require('express')
const TelegramApi = require('node-telegram-bot-api')
const mysql = require('mysql2')
const PORT = process.env.PORT || 3002
const {useState, useEffect} = require('react')
const bodyParser =require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')

let chatids = null;
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser())
app.listen(PORT, () =>{
    console.log(`Сервер запущен на ${PORT} порту`)
})
const WebApps = "https://backend-drc.ru/"
const token = "6532769274:AAH3jhK1isnfjzf_OyOf2WBU_zSwrNAbBrE"
const connection = mysql.createConnection({
  host: "31.31.198.112",
  user: "u2642045_jahon",
  database: "u2642045_dragonapp",
  password: "joha_003"
})
connection.connect(function(err){
  if(err) {
      return console.error(`Ошибка подключения! Код: `+ err)
  }else{
      console.log(`Покдлючение к БД успешно установлено!`)
  }
})
app.use(session({
  secret: 'telegram-api-game-session-ids-bindex',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 день
  }
}));
const bot = new TelegramApi(token, {polling: true})
  bot.on('message', async msg =>{
  const text = msg.text;
  const uggs = msg.chat.username;
  chatids = msg.chat.id;
  if(text === '/start'){
      /*const ins = "INSERT INTO `users` (`idteleg`,`chatids`, `usnames`, `Dragons`, `Hunters`, `Defends`, `DRCcoin`, `DRGcoin`) VALUES (NULL,?,?,10,0,0,10,100)"
      const into = [chatids, uggs]
      await connection.execute(ins, into,(err, results) =>{
      })
      console.log('Пользователь создан!')*/
    await bot.sendPhoto(chatids, "Logo.png")
    await bot.sendMessage(chatids,"Dragon Village is build on HOT mining! $",{
      reply_markup: {
        inline_keyboard:[
          [{text:'Go to Dragon village', web_app:{url: WebApps}}]
        ]
      }
    })
    app.post('/auth', (req, res) => {
    const { telegramId} = req.body;
    console.log(req.body)
    // Проверка наличия пользователя в базе данных
    const query = 'SELECT * FROM users WHERE telegram_id = ?';
    connection.query(query, [telegramId], (err, results) => {
      if (err) {
        console.error('Ошибка при запросе к базе данных:', err);
        return res.status(500).send('Ошибка сервера');
      }
      // Если пользователя нет, создать его
      if (results.length === 0) {
        const insertQuery = 'INSERT INTO users (telegram_id, usnames, Dragons, Hunters, Defends, DRCcoin, DRGcoin) VALUES (?, ?, 1, 0, 0, 10, 100);';
        connection.query(insertQuery, [telegramId, uggs], (err, results) => {
          if (err) {
            console.error('Ошибка при добавлении пользователя:', err);
            return res.status(500).send('Ошибка сервера');
          }
          req.session.userId = results.insertId;
          return res.status(200).json({ userId: results.insertId });
        });
      } else {
        // Сохранить идентификатор пользователя в сессии
        req.session.userId = results[0].id;
        return res.status(200).json({ userId: results[0].id });
      }
    });
  });
  }
  app.post('/auth', (req, res) => {
    const { telegramId} = req.body;
    console.log(req.body)
    // Проверка наличия пользователя в базе данных
    const query = 'SELECT * FROM users WHERE telegram_id = ?';
    connection.query(query, [telegramId], (err, results) => {
      if (err) {
        console.error('Ошибка при запросе к базе данных:', err);
        return res.status(500).send('Ошибка сервера');
      }
      // Если пользователя нет, создать его
      if (results.length === 0) {
        const insertQuery = 'INSERT INTO users (telegram_id, usnames, Dragons, Hunters, Defends, DRCcoin, DRGcoin) VALUES (?, ?, 1, 0, 0, 10, 100);';
        connection.query(insertQuery, [telegramId, uggs], (err, results) => {
          if (err) {
            console.error('Ошибка при добавлении пользователя:', err);
            return res.status(500).send('Ошибка сервера');
          }
          req.session.userId = results.insertId;
          return res.status(200).json({ userId: results.insertId });
        });
      } else {
        // Сохранить идентификатор пользователя в сессии
        req.session.userId = results[0].id;
        return res.status(200).json({ userId: results[0].id });
      }
    });
  });
  app.get('/dragons', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('Необходимо авторизоваться');
    }
    const query = 'SELECT Dragons FROM users WHERE telegram_id = ?';
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Ошибка при запросе к базе данных:', err);
        return res.status(500).send('Ошибка сервера');
      }
      return res.status(200).json({ dragons: results[0].Dragons });
    });
  });
  })
  app.post('/chatback', (req, res) => {
  let data = [req.body.Hunters]
  const zapros = "UPDATE `users` SET `Dragons`=? WHERE `users`.`usnames` = ?"
  const params = [data, uggs]
  connection.execute(zapros,params,(err, results) =>{
    !err ? res.json(results) : res.json(err)
  })
  console.log(JSON.stringify(data))
  })
  app.get('/back1',(req, res) =>{
    connection.execute("SELECT `totBank` FROM `stage`",(err, results) => {
        if (err) {
          console.log(err)
          return;
        }
          res.json({
          banks: results[0].totBank
        });
      });
  })
  app.get('/back2',(req, res) =>{
    connection.execute("SELECT `Seasons` FROM `stage`", (err, results) => {
        if (err) {
            console.log(err)
            return;
        }
            res.json({
              seasons: results[0].Seasons
      });
   });
  })
  app.get('/back3',(req, res) =>{
    connection.execute("SELECT `toStage` FROM `stage`", (err, results) => {
      if (err) {
          console.log(err)
          return;
        }
          res.json({
          stages: results[0].toStage
      });
    });
  })
  app.get('/back4',(req, res) =>{
    connection.execute("SELECT `tOnline` FROM `stage`", (err, results) => {
        if (err) {
          console.log(err)
          return;
        }
          res.json({
          online: results[0].tOnline
        });
      });
  })
app.use(cors());
