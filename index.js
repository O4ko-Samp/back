const express = require('express')
const TelegramApi = require('node-telegram-bot-api')
const mysql = require('mysql2')
const PORT = process.env.PORT || 3002
const {useState, useEffect} = require('react')
const bodyParser =require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser())
app.listen(PORT, () =>{
    console.log(`Сервер запущен на ${PORT} порту`)
})
const WebApps = "https://backend-drc.ru"
const token = "6532769274:AAH3jhK1isnfjzf_OyOf2WBU_zSwrNAbBrE"
 const chatid =  5;
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
const bot = new TelegramApi(token, {polling: true})

bot.on('message', async msg =>{
  const text = msg.text;
  const uggs = msg.chat.username;
  const chatids = msg.chat.id;
  let Users = Boolean
  /*const zapros = '`users` SET `chatids`='+chatids
  const zapros2 = ' WHERE `users`.`usnames` ='+uggs
  const itog = zapros+zapros2
  const fff = ("UPDATE"+itog)
  connection.query(fff)
  console.log(fff)*/

  /*function UpdateQuery() {
    connection.query("INSERT INTO `users`(`chatids`, `usnames`, `Dragons`, `Hunters`, `Defends`, `DRCcoin`, `DRGcoin` VALUES (?,?,1,0,0,10,100)",chatids ,uggs)
    console.log(zapros)
  }
  UpdateQuery()*/
  if(text === '/start'){
    connection.execute("SELECT * FROM `users` WHERE `users`.`chatids` = "+chatids, (err, results) =>{
      if(err){
        console.log(err)
        return;
      }
      const fsf = results[0].chatids
      if(results.length <= 0){
        console.log(err)
        Users = false
      }
      else{
        Users = true
        console.log(Users)
      }
      console.log(fsf)
    })
  if(Users){
    app.get('/back', (req, res) => {
      connection.execute("SELECT `Dragons` FROM `users` WHERE `users`.`chatids` ="+chatids, (err, results) => {
        if (err) {
          console.log(err)
          return;
        }
        res.json({
          dragons: results[0].Dragons
        });
      });
    });
    app.get('/back5',(req, res) =>{
      connection.execute("SELECT `DRGcoin` FROM `users` WHERE `users`.`chatids` ="+chatids, (err, results) => {
          if (err) {
            console.log(err)
            return;
          }
            res.json({
            drg: results[0].DRGcoin
          });
        });
    })
    app.get('/back6',(req, res) =>{
      connection.execute("SELECT `DRCcoin` FROM `users` WHERE `users`.`chatids` ="+chatids, (err, results) => {
          if (err) {
            console.log(err)
            return;
          }
            res.json({
            drc: results[0].DRCcoin
          })
          //console.log()
        });
    })
    app.post('/chatback', (req, res) => {
    let data = [req.body.Hunters]
    const zapros = "UPDATE `users` SET `Dragons`=? WHERE `users`.`usnames` =?"
    const params = [data, uggs]
    // const fff = itog
    connection.execute(zapros,params,(err, results) =>{
      !err ? res.json(results) : res.json(err)
    })
    console.log(JSON.stringify(data))
    })
  }
  else{
    console.log('Юзер не валидный!')
  }
    if(!Users) {
      const ins = "INSERT INTO `users` (`idteleg`,`chatids`, `usnames`, `Dragons`, `Hunters`, `Defends`, `DRCcoin`, `DRGcoin`) VALUES (NULL,?,?,10,0,0,10,100)"
      const into = [chatids, uggs]
      await connection.execute(ins, into,(err, results) =>{
      })
      console.log('Пользователь создан!')
    }
    await bot.sendPhoto(chatids, "Logo.png")
    await bot.sendMessage(chatids,"Dragon Village is build on HOT mining!",{
      reply_markup: {
        inline_keyboard:[
          [{text:'Go to Dragon village', web_app:{url: WebApps}}]
        ]
      }
    })
  }
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
              seasons: results
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
  function ValidUser() {
    const sasa = "SELECT * FROM `users` WHERE `users`.`usnames` = ?"
    const ssss = [uggs]
    connection.execute(sasa,ssss, (err, results) =>{
      if(err){
        console.log(err)
        return;
      }
      const param = results[0].chatids
      console.log(results)
      return param
    })
  }
})
app.use(cors())
