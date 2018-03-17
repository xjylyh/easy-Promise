function Promise(executor){
    var self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    self.onFulfilledArr = [];
    self.onRejectedArr = [];
    function resolve(value){//执行器中的resolve
        if(self.status === 'pending'){
            self.value = value;
            self.status = 'fulfilled';
            self.onFulfilledArr.forEach(function(fn){
                fn(self.value);
            })
        }
    }
    function reject(reason){//执行器中的reject
        if(self.status === 'pending'){
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedArr.forEach(function(fn){
                fn(self.reason);
            })
        }
    }
    
    try{
        executor(resolve,reject);
    }catch(e){
        reject(e);
    }
    
}

Promise.prototype.then = function(onfulfilled,onrejected){
    ononfulfilled = typeof onfulfilled === 'function'?onfulfilled:function(value){
        return value;
    }
    onrejected = typeof onrejected === 'function'?onrejected:function(reason){
        return reason;
    }
    var self = this;
    var Promise2;//将要返回的Promise
    if(self.status === 'fulfilled'){
        return Promise2 = new Promise(function(resolve,reject){
            //这里的tryCatch主要是为了避免在运行过程中出现异常
            try{
                let x = onfulfilled(self.value);//既然我们要返回一个值，就需要拿到上次then方法的回调函数的返回值
                //所以在这里我们定义了一个变量x来接收上次（then方法的回调函数）的执行结果
                resolvePromise(Promise2,x,resolve,reject)
            }catch(e){
                reject(e);
            }
            
        })
    }
    if(self.status === 'rejected'){
        return Promise2 = new Promise(function(resolve,reject){//这个跟之前的道理是一模一样的哦
            try{
                let x = onrejected(self.reason);
                resolvePromise(Promise2,x,resolve,reject)
            }catch(e){
                reject(e);
            }
            
        })
    }
    if(self.status === 'pending'){
        Promise2 = new Promise(function(resolve,reject){
            //这里我们要注意了，当前状态为Pending，所以既没有resolve也没有reject
            self.onFulfilledArr.push(function(){//我们只要在对应的数组中存储相应的执行函数，当异步调用时resolve或者reject时
                                                //我们之前写的遍历执行方法会帮助我们执行对应的回调函数，并返回值
                try{
                    let x = onfulfilled(self.value);
                    resolvePromise(Promise2,x,resolve,reject)
                }catch(e){
                    reject(e);
                }
            });
            self.onRejectedArr.push(function(){//这里的道理同上
                try{
                    let x = onrejected(self.reason);
                    resolvePromise(Promise2,x,resolve,reject) 
                }catch(e){
                    reject(e);
                }
            });
        })
        return Promise2;
    }
}

Promise.prototype.catch = function(cb){
    return this.then(null,cb)
}

//返回一个成功的Promise
Promise.resolve = function(value){
    return new Promise(function(resolve,reject){
        resolve(value);
    })
}
//返回一个失败的Promise
Promise.reject = function(reason){
    return new Promise(function(resolve,reject){
        reject(reason);
    })
}

Promise.all = function(promises){
    if(!Array.isArray(promises)){//我们这里做了小小的限制，使得Promise.all方法的参数必须是数组
        throw new TypeError('The parameters of the Promise method must be an Array')
    }
    return new Promise(function(resolve,reject){
        try{//try-catch还是为了捕捉我们程序中出现的错误
            let arr = [];//我们将要返回的处理结果数组
            let count = 0;//记录我们成功的次数
            function processData(index,y){
                arr[index] = y;//我们把数组对应的项中放入我们Promise的执行结果。
                if(++count===promises.length){//这里使用我们之前的count进行判断，看看Promise数组是否被执行完了
                    resolve(arr);//如果执行完毕后我们就可以把返回的Promise置为成功态，并且返回处理结果数组
                }
            }
            for(let i=0;i<promises.length;i++){//我们去遍历存放有Promise的数组
                promises[i].then(function(y){//我们去执行这些个Promise，调用它的then方法执行
                    processData(i,y);//把执行结果y和对应项的index放入到我们的处理函数中
                },reject);
            }
        }catch(e){
            reject(e);
        }
    })
}

Promise.race = function(promises){
    return new Promise(function(resolve,reject){
        for(let i=0;i<promises.length;i++){
            promises[i].then(resolve,reject);
        }
    })
}

//参数1：我们需要返回的Promise2 参数2：then方法的返回值 参数三：Promise2中的resolve 参数四：Promise2中的reject
function resolvePromise(Promise2,x,resolve,reject){
    if(Promise2===x){//规范中说道，这两个东西指向不能相同
        reject(new TypeError('循环引用'));
    }
    let called;//这个变量判断我们是否执行过then方法的成功或者失败
    if(x!==null&&(typeof x==='function'||typeof x==='object')){//这样我们就认为x是一个Promise
        let then = x.then;//既然x是Promise，就会有then方法
        try{
            if(typeof then === 'function'){//我们这里判断x.then是不是一个函数，如果是呢，就代表它是Promise中的then方法。
                //                          当然如果不是，我们就直接resolve(then)
                then.call(x,function(y){//如果是then方法的话我们就需要执行then方法。同样的有两个回调，第一个是成功的回调，第二个是失败的
                    if(called) return;//前面讲到判断then方法是否执行过成功或者失败函数的判断变量，如果执行过失败，直接return
                    called = true;//当然如果没有执行过，我们就标记它为已经执行
                    resolvePromise(Promise2,y,resolve,reject);//这一步递归是关键，由于我们成功的原因“y”可能仍然是一个Promise，所以需要递归
                                                                //调用来再次判断
                
                    },function(err){//当then方法调用失败的回调函数时，我们先判断是否调用过成功
                    if(called) return;//然后我们就可以直接返回失败的原因
                    called = true;
                    reject(err);//会返回到下一次then的onrejected中
                })
            }else{
                resolve(then);
            }
        }catch(e){//这里依旧是判断在函数运行中是否出现了错误，如果我们没有调用过then方法中的回调。我们就可以直接reject返回出错的原因
            if(called) return;
            called = true;
            reject(e);
        }
        
    }else{//如果x不是一个Promise，而是一个普通值，我们就可以直接resolve返回这个值
        resolve(x);
    }
}

module.exports = Promise;