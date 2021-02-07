const venom = require('venom-bot');
const axios = require('axios');
require('dotenv').config();
const mysql = require('mysql');
var delay = 3000;
var base_url = "http://147.139.192.236/autorekber/api/";
// var con = mysql.createConnection({
//   host: "sql12.freesqldatabase.com",
//   user: "sql12387139",
//   database: "sql12387139",
//   password: "11ifNeXWQG"
// });

const con = require('./config');
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

module.exports = {
  StartVenom: async function(apikey,pid) {
    con.query("update whatsapps set status=1,pid='"+pid+"' where apikey='"+apikey+"'");


    venom
        .create(
          //session
          apikey, //Pass the name of the client you want to start the bot
          //catchQR
          (base64Qrimg, asciiQR, attempts, urlCode) => {
            //console.log('Number of attempts to read the qrcode: ', attempts);
            console.log(asciiQR);
            //console.log('base64 image string qrcode: ', base64Qrimg);
            //console.log('urlCode (data-ref): ', urlCode);
            con.query("update whatsapps set qrcode='"+base64Qrimg+"' where apikey='"+apikey+"'"); 
          },
          // statusFind
          (statusSession, session) => {
            console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
            //Create session wss return "serverClose" case server for close
            console.log('Session name: ', session);
            if(statusSession=='isLogged' || statusSession=='qrReadSuccess'){
              con.query("update whatsapps set status=2 where apikey='"+session+"'"); 
            }
            if(statusSession=='notLogged' || statusSession=='browserClose'){
              // con.query("update whatsapps set status=0 where apikey='"+session+"'");
            }
          },
          // options
          {
            folderNameToken: 'tokens', //folder name when saving tokens
            mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
            headless: true, // Headless chrome
            devtools: false, // Open devtools by default
            useChrome: false, // If false will use Chromium instance
            debug: false, // Opens a debug session
            logQR: true, // Logs QR automatically in terminal
            browserWS: '', // If u want to use browserWSEndpoint
            browserArgs: ['--no-sandbox'], // Parameters to be added into the chrome browser instance
            puppeteerOptions: {}, // Will be passed to puppeteer.launch
            disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
            disableWelcome: true, // Will disable the welcoming message which appears in the beginning
            updatesLog: true, // Logs info updates automatically in terminal
            autoClose: 0, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
            createPathFileToken: true, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
          },
          {
            
          }
        )
        .then((client) => {
          start(client);
        })
        .catch((erro) => {
          console.log(erro);
        });
  }
}

var creategroup = true;

function start(client) {
	// Setup awal craete Group
	setInterval(function(){    
      con.query("select * from transactions where status='N' limit 0,1",function(err,rows,fileds){
      if(err)console.log(err);
      if(rows.length==1){        
        if(creategroup==true){
            creategroup = false;
            con.query("update transactions set status='G' where id="+rows[0].id);   
            client.createGroup(rows[0].secret_code, 
                [rows[0].seller_whatsapp.replace(/^0/i,'62')+'@c.us']
              ).then((x)=>{          
                console.log(x);
                con.query("update transactions set group_id='"+x.gid._serialized+"',status='G' where id="+rows[0].id);   
                con.query("insert into chats(chatid,message,status,type)values('"+x.gid._serialized+"','"+rows[0].message+"',0,'out')");       
                creategroup = true;
            });     
      }
      }     
     }); 
    
		 
   },30000);

   // Menambahkan Buyer/pembali ke Group
   setInterval(function(){
		 con.query("select * from transactions where status='G' and not isnull(buyer_whatsapp) limit 0,1",function(err,rows,fileds){
			if(err)console.log(err);
				if(rows.length==1){
					client.addParticipant(rows[0].group_id, rows[0].buyer_whatsapp.replace(/^0/i,'62')+'@c.us')
					.then((x)=>{
	          			console.log(x);          
	          			con.query("insert into chats(chatid,message,status,type)values('"+rows[0].group_id+"','"+rows[0].message+"',0,'out')");       
	          			con.query("update transactions set status='P' where id="+rows[0].id);   
				});			
			}			
		 });
   },5000);

   // memasukkan Admin ke Group
   setInterval(function(){
		 
   },5000);

   // Kirim Pesan ke Group
   setInterval(function(){
    con.query("select * from chats where status='0' limit 0,1",function(err,rows,fileds){
     if(err)console.log(err);
     if(rows.length==1){
      client
      .sendText(rows[0].chatid, rows[0].message)
      .then((result) => {
        console.log('Result: ', result); //return object success
        con.query("update chats set status=1 where id="+rows[0].id);
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
     }			
    });
  },3000);


  // Cek No Whatsapp
  setInterval(function () {
    con.query("select * from contacts where status='N' limit 0,1",function(err,rows,f) {
      if(err) console.log(err);
      if(rows.length==1){        
        client.checkNumberStatus(rows[0].phone.replace(/^0/i,'62')+'@c.us')
        .then((result) => {
          // console.log('Result: ', result); //return object success
          con.query("update contacts set status='S',wa='"+(result.numberExists?1:0)+"' where id="+rows[0].id);
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
          con.query("update contacts set status='E' where id="+rows[0].id);
        });
      }
    });
  },2000);


  // Auto BOT
  client.onMessage((message) => {
  	if(message.isGroupMsg === false){
  		client.sendSeen(message.from);
  		client.startTyping(message.from);  	  		
  		client
        .reply(message.from, 'Pesan khusus bot Group',message.id.toString())
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });        
        client.stopTyping(message.from);
  	}else{
  		console.log("Meesage from Group",message);
  	}

    if(message.isGroupMsg===true){
      console.log(message.body);      
      con.query("select * from transactions where group_id='"+message.from+"' limit 0,1",function(err,rows){
        if(err)console.log(err);
        if(rows){
            if(rows.length==1){
              exurl("instruction?id="+rows[0].id);
              con.query("insert into cmds(group_id,command,status,created_at)values('"+message.from+"','"+message.body+"','0',now())");    
            }            
        }
      })
      
    }
    
  });  

  // ==== //


  
}


function exurl(link) {
  var apiKey = "YXV0b3Jla2Jlci5jb20=";
  axios.get(base_url + link, {
    // headers: {
    //   'apikey: botwa123456';  
    // }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  });
}