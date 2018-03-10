function deepClone(parent,c){
    var obj = c||{};
    for(let key in parent){
        if(typeof parent[key] === 'object'){
            console.log(Object.prototype.toString.call(parent[key]));
            obj[key] = Object.prototype.toString.call(parent[key])==='[object Array]'?
            []:{};
            deepClone(parent[key],obj[key])
        }else{
            obj[key] = parent[key];
        }
    }
    return obj;
}

let p = {name:'aaa',age:'22',if:{a:1,b:2},arr:[3,4,5,6,7,8,9]}
let newp = deepClone(p);
console.log(newp);
p.name = 'xjy';
console.log(newp);