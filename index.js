const express = require('express')
const TelegramApi = require('node-telegram-bot-api')
const mysql = require('mysql2')
const PORT = process.env.PORT || 3002
const {useState, useEffect} = require('react')
const bodyParser =require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser())
app.listen(PORT, () =>{
    console.log(`Сервер запущен на ${PORT} порту`)
})
const WebApps = "https://backend-drc.ru/"
let telegramId = null
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
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 день
  }
}));
const bot = new TelegramApi(token, {polling: true})
  bot.on('message', async msg =>{
  const text = msg.text;
  process.env.NTBA_FIX_350 = true;
  const uggs = msg.chat.username;
  const chatids = msg.chat.id;
  telegramId = msg.from.id;
  console.log(msg.from.id)
  if(text === '/start'){
      /*const ins = "INSERT INTO `users` (`idteleg`,`chatids`, `usnames`, `Dragons`, `Hunters`, `Defends`, `DRCcoin`, `DRGcoin`) VALUES (NULL,?,?,10,0,0,10,100)"
      const into = [chatids, uggs]
      await connection.execute(ins, into,(err, results) =>{
      })
      console.log('Пользователь создан!')*/
    await bot.sendPhoto(chatids, "Logo.png")
    await bot.sendMessage(chatids,`Hi ${uggs}, Dragon Village is build on testing...`,{
      reply_markup: {
        inline_keyboard:[
          [{text:'Go to Dragon village', web_app:{url: WebApps}}]
        ]
      }
    })
  }
  app.get('/back/:userId', async (req, res) => {
    const userId = req.params.userId;
    await connection.execute("SELECT * FROM users WHERE telegram_id=?",[userId], async (err, results) => {
      if (err) throw err;
      console.log(results[0])
      if(results[0] > 0){
        req.session.userData = results[0]; 
        let data = req.session.userData
        res.json({data})
      } else {
        const ins = "INSERT INTO `users` (`telegram_id`, `usnames`, `Dragons`, `Hunters`, `Defends`, `DRCcoin`, `DRGcoin`) VALUES (?,?,10,0,0,10,100)"
        const into = [chatids, uggs]
        await connection.execute(ins, into,(err, results) =>{
          if(err) throw err;
          req.session.userData = results[0]; 
          let data = req.session.userData
          console.log(results)
          res.json({data})
        })
      }
    });
  });
})
app.get('/back2', async (req, res) => {
  // Загрузка данных из БД
 await connection.execute("SELECT * FROM stage",(err, results) => {
    if (err) throw err;
    let data = results[0]
    res.json({data})
  });
});
app.get('/tops', async (req, res) => {
  // Загрузка данных из БД
 await connection.execute("SELECT * FROM `users` ORDER BY `Dragons` DESC LIMIT 10",(err, results) => {
    if (err) throw err;
    let data = results
    res.json({data})
  });
});
  app.post('/chatback', (req, res) => {
  let data = [req.body.Hunters]
  let data1 = [req.body.Defenders]
  let coins = [req.body.DRCcoin]
  const zapros = "UPDATE `users` SET `Hunters`=? `Defends`=? `DRCcoin`=? WHERE `users`.`usnames` = ?"
  const params = [data, data1, coins, uggs]
  connection.execute(zapros,params,(err, results) =>{
    !err ? res.json(results) : res.json(err)
  })
  console.log(JSON.stringify(data) + JSON.stringify(data))
  })
  app.use(cors());
