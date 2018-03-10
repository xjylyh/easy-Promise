const Promise = require('./mypromise.js');

let p = new Promise(function(resolve,reject){
     setTimeout(()=>{
        reject(0);
     },1000)
})

//promise三个状态 pending(悬而未决的) fufilled(完成) reject(未完成)  

p.then(function(data){
    return new Promise(function(resolve,reject){
        data = data+100;
        resolve(data);
    })
},function(err){
    err = err-100;
    return err;
}).then(function(data){
    console.log(data);
})


