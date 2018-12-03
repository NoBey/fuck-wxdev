const fs = require('fs');
const path = require('path');
const koa = require('koa')
const proxy = require('koa-proxy');
const hostPath = '/etc/hosts'
const hostBak = __dirname + '/hosts.bak'

const config = {
    targetHost: 'insurance.xiaobangtouzi.com',  // 不带http
    proxyHost: 'http://127.0.0.1:10086',
    map: {},
}



function InitHost(cb){
    fs.readFile(hostPath, {encoding: 'utf8'}, function(e, data){
        if(e) console.log('初始化加载host失败')
        if(cb) cb(data)
        fs.readFile(hostBak, {}, function(hostBakErr, hostBakdata){
            if(hostBakErr){
                console.log('首次使用创建备份hosts, 位置:' + hostBak)
                fs.writeFile(hostBak, data,{flag: 'a'},function(err){
                    if(err)  console.log('创建备份hosts失败')
                })
            }
        })
    })
}

function saveHost(data, cb){
    fs.writeFile(hostPath, data,{flag: 'w'},function(err){
        if(err)  console.log('保存hosts文件失败')
        if(cb) cb()
    })
}

function formatHost(data){
   let a =  data.split('\n')
    a = a.filter(b => b[0] != '#')
   return a
}

function delHost(host, cb){
    InitHost(function(d){
        let row = formatHost(d)
        row = row.filter(a => a.indexOf(host) == -1)
        console.log(row)
        saveHost(row.join('\n'), cb)
    })
}

function addHost(host){
    InitHost(function(d){
        let row = formatHost(d)
        row.push('0.0.0.0   ' + host)
        saveHost(row.join('\n'))
    })
}



const app = new koa()
app.use(proxy({
    host: config.proxyHost
  }))

addHost(config.targetHost)
app.listen(80)

process.on('exit', function() {
    console.log('退出前执行');
});

process.on('SIGINT', function() {
    console.log('收到 SIGINT 信号。');
    delHost(config.targetHost, ()=>process.exit(1))

});

