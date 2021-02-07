const find = require('find-process');
const exec = require('child_process').exec;
const ps = require('ps-node');
const con = require('./config');
con.connect(function(err) {
    if (err) console.log(err);  
    console.log('Conected Database');
    con.query("update whatsapps set pid=null,state=null,qrcode=null where status=-1");
    con.query("update whatsapps set pid=null,state=null,qrcode=null,status=0 where status>=0");
    con.query("select * from botservices limit 0,1",function(err,rows){
      if(err){
            console.log(err)        
        }else{
            if(rows.length>0){
                let pid = rows[0].pid;
                find('pid',pid).then(function(res) {
                    // console.log(res);
                    if(res.length>0){
                        console.log("Service already running at PID : " + pid);
                        process.exit();                    
                    }else{
                        console.log("Service Start at PID : "+ process.pid);
                        con.query("update botservices set pid="+ process.pid);
                    }
                })
            }else{
              console.log("Service Start at PID : "+ process.pid);
              con.query("insert botservices(pid)values("+process.pid+")");
            }
        }
    });

  setInterval(() => {
    Killapikey();
    runserv();
  }, 60000);
});




async function runserv() { 
    con.query("select * from whatsapps where status=0", function(err, result) {
        if (err) {
            console.log(err);            
        }        
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i].apikey);     
            let pid = result[i].pid;
            find('pid',pid)
            .then(function (list) {
                if (!list.length && (list.name!='node.exe' || list.name!='node')) {                    
                    exec('node ./run.js '+ result[i].apikey);
                } else {
                //   console.log('Sudah Berjalan :', list[0].name);
                if(result[i].status == 0){
                    console.log('Reopen Browser');
                    ps.kill(result[i].pid);
                    exec('node ./run.js '+ result[i].apikey);
                }
                }
            })        
        }
    });
}

async function Killapikey() {
    con.query("select * from whatsapps where pid>0 and status=-1", function(err, result) {
        if (err) {
            console.log(err);            
        }                  
        for (let i = 0; i < result.length; i++) {
            let pid = result[i].pid;
            find('pid',pid)
            .then(function (list) {
                console.log('Kill',list);
                if (list.length && (list.name=='node.exe' || list.name=='node')) {
                    ps.kill(result[i].pid);
                    con.query("update whatsapps set pid=null,state=null,qrcode=null where id="+ result[i].id);
                } 
            })        
        }
    });
}

// con.query("update whatsapps set status=0,battery=0,wa_name=null,connected=0,qr_code=null where status<=1");

