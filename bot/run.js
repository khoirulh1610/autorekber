const app = require('./bot');
const find = require('find-process');
const con = require('./config');
let apikey = process.argv[2] || 'wa2';
con.connect(function(err) {
    if (err) throw err;
    if(apikey==null || apikey==''){
        console.log("Error :",apikey,'Not valid');
        process.exit();
    }
    
    con.query("select * from whatsapps where apikey='"+apikey+"'", function(err, result) {
        if (err) {
            console.log(err);      
        }
        if(result){
            for (let i = 0; i < result.length; i++) {
                console.log(result[i].apikey);     
                let pid = result[i].pid;
                find('pid',pid)
                .then(function (list) {
                    console.log(pid,list);
                    if (!list.length && (list.name!='node.exe' || list.name!='node')) {
                        console.log('Run...');                         
                        app.StartVenom(result[i].apikey,pid);        
                    } else {
                        console.log('Sudah Berjalan :', list[0].name,"PID :",list[0].pid);
                        process.exit();
                    }
                })        
            }
        }
    });
});


