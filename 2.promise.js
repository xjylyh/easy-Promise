const Promise = require('./mypromise.js');

let p = new Promise(function(resolve,reject){
    setTimeout(()=>{
        reject('1111111xxxxxx');
    },3000)
})

//promise三个状态 pending(悬而未决的) fufilled(完成) reject(未完成)  

p.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
})

p.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
})

p.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
})