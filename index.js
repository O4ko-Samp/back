const express = require('express')
const mysql = require('mysql2')
const PORT = process.env.PORT || 3002
const cors = require('cors')
const fs = require('fs')

const app = express()
app.listen(PORT, () =>{
    console.log(`Сервер запущен на ${PORT} порту`)
})

const connection = mysql.createConnection({
    host: "localhost",
    user: "u2642021_default",
    database: "u2642021_default",
    password: "K89hBDn9qX1Urs7o"
})

 connection.connect(function(err){
    if(err) {
        return console.error(`Ошибка подключения! Код: `+ err)
    }else{
        console.log(`Покдлючение к БД  успешно установлено!`)
    }
 })
app.get('/back', (req, res) => {
    connection.execute("SELECT `Dragons` FROM `users`", (err, results) => {
      if (err) {
        console.log(err)
        return;
      }
      res.json({
        jsons: results
      });
    });
});
app.get('/back1',(req, res) =>{
    connection.execute("SELECT `totBank` FROM `stage`", (err, results) => {
        if (err) {
          console.log(err)
          return;
        }
          res.json({
          banks: results
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
          stages: results
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
          online: results
        });
      });
})
app.get('/back5',(req, res) =>{
    connection.execute("SELECT `DRGcoin` FROM `users`", (err, results) => {
        if (err) {
          console.log(err)
          return;
        }
          res.json({
          drg: results
        });
      });
})
app.get('/back6',(req, res) =>{
    connection.execute("SELECT `DRCcoin` FROM `users`", (err, results) => {
        if (err) {
          console.log(err)
          return;
        }
          res.json({
          drc: results
        });
      });
})
  app.use(cors())
 /*connection.execute("SELECT `Dragons` FROM users", function(err, results){
    console.log(err)
    const ggs = results
    console.log(ggs)
    app.get('/back', (req, res) => {
        res.json({
            ggs
        })
    })
 })*/
/*function Get(param){
    app.get('/back', (req, res) => {
        res.json({
            message:param
        })ss
        return param;
    })
}*/
/*connection.execute(insert, users, function(err, result){
    if(err){
        console.log(err)
    }else{
        console.log(`Данные успешно добавлены!`)
    }
 })*/
