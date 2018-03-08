function Promise(executor){
    var self = this;
    self.status = 'pending';
    self.value = undefined;//完成时的值
    self.reason = undefined;//失败时的值
    self.onresolve = [];
    self.onreject = [];
    function resolve(value){
        self.status = 'fufilled';
        self.value = value;
        self.onresolve.forEach(item=>item(self.value));
    }
    function reject(reason){
        self.status = 'reject';
        self.reason = reason;
        self.onreject.forEach(item=>item(self.reason));
    }
    try{
        executor(resolve,reject)
    }catch(e){
        reject(e);
    }
    
}

Promise.prototype.then = function(success,reject){
    let self = this;
    if(self.status==='fufilled'){
        success(self.value);
    }
    if(self.status==='reject'){
        reject(self.reason);
    }
    if(self.status==='pending'){
        self.onresolve.push(success);
        self.onreject.push(reject);
    }
}
module.exports = Promise;