let Promise = require('./PromiseTest');
let fs = require('fs');
let x = new Promise(function(resolve,reject){
    resolve(fs.readFileSync('./test.txt','utf8'));
})
let y = new Promise(function(resolve,reject){
    resolve(fs.readFileSync('./test1.txt','utf8'));
}) 

Promise.race([y,x]).then(function(result){
    console.log(result);
})

//promise 是一个类  

//promise->承诺
//executor->执行者
//new Promise(executor)
//executor包含两个参数  resolve(解决)&reject(拒绝)&永远不会有答复(放弃)
// let p = new Promise(function(resolve,reject){//分别是两个函数
//     // reject('errrrr');//自己定义规则来决定是成功还是失败
//     fs.readFile('./test.txt','utf8',function(err,data){
//         if(err) reject(err);
//         resolve(data);
//     })
// })
// //p代表的是promise实例
// p.then(function(data){
//     console.log(data);
// },function(err){
//     console.log(err);
// })


let p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        if(Math.random()>0.5){
            resolve('mmm');
        }else{
            reject('nonono');
        }
    },3000)
})
p.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
})


let p = new Promise(function(resolve,reject){
    resolve(100);
})

p.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
})


