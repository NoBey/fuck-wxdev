# fuck-wxdev
---
> 强制劫持线上微信开发指向本地调试 
config = {
    targetHost: 'insurance.xiaobangtouzi.com',  // 不带http 需要劫持的线上域名
    proxyHost: 'http://127.0.0.1:10086', // 本地开发的地址
    map: {}, // 个别文件单独匹配
}