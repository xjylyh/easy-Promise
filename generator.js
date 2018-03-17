let fs = require('fs');
function read(filename){
    return new Promise(function(resolve,reject){
        let content = fs.readFileSync(filename,'utf8');
        resolve(content);
    })
    
}
function *r(){
    let content1 = yield read('./test.txt');
    console.log(content1);
    let content2 = yield read(content1);
    return content2;
}

function co(it){
    return new Promise(function(resolve,reject){
        function next(d){
            let {value,done} = it.next(d);//我们通过执行器调用next拿到generator函数yield的返回值
            if(!done){//通过done属性来判断generator函数yield是否全部执行完成
                value.then(function(data){
                    next(data);//我们这里使用递归调用回传得到的yield的处理结果
                },reject)
            }else{
                resolve(value);//当generator函数执行完的时候我们可以通过resolve返回最终的结果
            }
        }
        next();//generator->第一次执行
    })
}

co(r()).then(function(value){
    console.log(value);
});

// let it = r();
// let p = it.next();
// p.value.then(function(value){
//     let xx = it.next(value);
//     console.log(xx)
// })
// console.log(it.next(p.then()));

