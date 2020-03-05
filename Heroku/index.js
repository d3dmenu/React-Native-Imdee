const server = require('express');
const PORT = process.env.PORT || 9999;
const request = require('request');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const admin = require('firebase-admin');

let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

server()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false}))
  .get('/', (req, res) => {
    res.send(`Hi there! This is a nodejs-line-api running on PORT: ${ PORT }`)

    db.collection('SE_Restaurant/IMDEE/Email').onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            if(doc.data().NotificationToken!=''){
              db.collection('SE_Restaurant/IMDEE/Email/'+doc.id+'/AllInbox').onSnapshot(function(snapshot) {
                snapshot.forEach(function(docs) {
                  let response = fetch('https://exp.host/--/api/v2/push/send',{
                    method:'POST',
                    headers:{
                      Accept:'application/json',
                      'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                      to : doc.data().NotificationToken,
                      sound : 'default',
                      title : docs.data().Title,
                      body : docs.data().Body,
                    })
                  });
                  console.log(docs.id);
                  db.collection('SE_Restaurant/IMDEE/Email/'+doc.id+'/AllInbox').doc(docs.id).delete();
                });
              });
            }
        });
    });
  })
  // เพิ่มส่วนของ Webhook เข้าไป
  .post('/webhook', function (req, res) {
      /*let replyToken = req.body.events[0].replyToken;
      let msg = req.body.events[0].message.text;

      console.log(`Message token : ${ replyToken }`);
      console.log(`Message from chat : ${ msg }`);*/
      if(req.body.privatekey == 'L7rADw2T9xMIlNCtVU1O'){
        msg = req.body.message;
        console.log(msg);
        date = msg.substring(0,msg.indexOf('@'));
        msg = msg.substring(msg.indexOf('@')+1);

        time = msg.substring(0,msg.indexOf(' '));
        msg = msg.substring(msg.indexOf(' ')+1);

        amount = msg.substring(0,msg.indexOf(' '));
        msg = msg.substring(msg.indexOf('ก')+1);

        detail = msg.substring(0,msg.indexOf('เ'));

        if(detail.indexOf('/')>-1){
          typebank = detail.substring(0,detail.indexOf('/'));
          idbank = detail.substring(detail.indexOf('/')+2);
          namebank = ''
        }
        else{
          typebank = 'SCB'
          idbank = ''
          namebank = detail
        }

        var nowYear = (new Date()).getFullYear()
        var day = new Date(date.substring(date.indexOf('/')+1)+'/'+date.substring(0,date.indexOf('/'))+'/'+nowYear+' '+time+' GMT+07:00')
        console.log(day);

        if(namebank!=undefined && idbank!=undefined && typebank!=undefined && amount!=undefined && day!=undefined){
          var data = {
            Name : namebank,
            IDCard : idbank,
            Type : typebank,
            Amount : amount,
            Date : day
          }
          db.collection('BankClient').add(data);
        }
      }

      res.json({
          status: 200,
          message: `Webhook is working!`
      });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
