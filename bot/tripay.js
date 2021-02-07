require('dotenv').config();
require('./config.js');
var app_mode = process.env.tripay_mode=='dev' ? 'api-sandbox' : 'api';
var apiKey = process.env.tripay_mode=='dev' ? process.env.tripay_apikey_dev : process.env.tripay_apikey;
var privateKey = process.env.tripay_mode=='dev' ? process.env.tripay_privateKey_dev : process.env.tripay_privateKey;

const axios = require('axios');
module.exports ={
    SyncDBPayment: async function() {
            axios.get('https://payment.tripay.co.id/'+app_mode+'/merchant/payment-channel', {
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
            })
            .then((res) => {
                // console.log(res.data)
                con.query("TRUNCATE table payments");
                res.data.data.forEach(row => {
                    var group = row.group;
                    var code =  row.code;  
                    var name = row.name;
                    var type = row.type;
                    var charge_to = row.charged_to;
                    var fee_flat = row.fee.flat;
                    var fee_percent = row.fee.percent;
                    var active = row.active;         
                    con.query("insert ignore into payments(`group`,`code`,`name`,type,charged_to,fee_flat,fee_percent,active,created_at)values('"+group+"','"+code+"','"+name+"','"+type+"','"+charge_to+"','"+fee_flat+"','"+fee_percent+"','"+(active?1:0)+"',now())");
                });
                console.log('Finish...')
            })
            .catch((error) => {
                console.error(error)
            });
        },

        GetPayment: async function(code) {
            axios.get('https://payment.tripay.co.id/'+app_mode+'/payment/channel?code='+code, {
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
            })
            .then((res) => {
				var data = res.data.data[0];
				var msg = data.group_name;
                console.log(msg, data.payment[0],data.payment[0].instructions[0].steps);				
            })
            .catch((error) => {
                console.error(error)
            });
        }
} 