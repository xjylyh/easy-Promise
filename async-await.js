let fs = require('fs');
function read(filename){
    return new Promise(function(resolve,reject){
        let content = fs.readFileSync(filename,'utf8');
        resolve(content);
    })
    
}

async function r(){
    try{
        let content1 = await read('./test.txt');
        console.log(`content1:${content1}`);
        let content2 = await read(content1);
        return content2;
    }catch(e){
        console.log(e);
    }
}

r().then(function(data){
    console.log(data);
})