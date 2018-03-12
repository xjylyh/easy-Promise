let Promise = require('./PromiseTest.js');
let p = new Promise(function(resolve,reject){
        reject(600);
})

p.then(function(data){
    //这里是onfulfilled，这个then方法中并没有onrejected
},).then(function(data){
    console.log('flag'+data);
})