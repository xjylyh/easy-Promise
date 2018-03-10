function Promise(exuc){
    var self = this;
    self.status = 'pending';
    self.value = undefined;
    self.err = undefined;
    self.onfullfil = [];
    self.onreject = [];
    function resolve(data){
        self.value = data;
        self.status = 'success';
        self.onfullfil.forEach(item=>item(self.value));
    }
    function reject(err){
        self.err = err;
        self.status = 'err';
        self.onreject.forEach(item=>item(self.err));
    }
    try{
        exuc(resolve,reject);
    }catch(e){
        reject(e);
    }
}
Promise.prototype.then = function(success,err){
    var self = this;
    let npromise = undefined;
    if(self.status === 'success'){
        return  npromise = new Promise(function(resolve,reject){
            let x = success(self.value);
            if(x instanceof Promise){
                x.then(resolve,reject);
            }else{
                resolve(x);
            }
        })
    }
    if(self.status === 'err'){
        return  npromise = new Promise(function(resolve,reject){
            let x = err(self.err);
            if(x instanceof Promise){
                x.then(resolve,reject);
            }else{
                resolve(x);
            }
        })
    }
    if(self.status === 'pending'){
        return  npromise = new Promise(function(resolve,reject){
            self.onfullfil.push(function(){
                let x = success(self.value);
                if(x instanceof Promise){
                    x.then(resolve,reject);
                }else{
                    resolve(x);
                }
            })
            self.onreject.push(function(){
                let x = err(self.err);
                if(x instanceof Promise){
                    x.then(resolve,reject);
                }else{
                    resolve(x);
                }
            })
        })
    }
}
 
module.exports = Promise;