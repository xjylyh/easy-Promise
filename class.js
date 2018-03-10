function defineProperties(constructor,properties){
    for(var i=0;i<properties.length;i++){
        var obj = {...properties[i],enumerable:true,writeable:true,configurable:true}
        console.log(obj);
        Object.defineProperty(constructor,properties[i].key,obj)
    }
}

function _createClass(con,protoProperty,staticProperty){
    if(protoProperty){
        defineProperties(con.prototype,protoProperty);
    }
    if(staticProperty){
        defineProperties(con,staticProperty);
    }
}


var Parent = function(){
    function Parent(){
        _classCallCheck(this,Parent);
        this.name = 'jiyao';
        this.getAge = function(){//对象方法//对象方法需要通过实例化对象去调用
            return '22';
        }
    }
    //用来描述这个类的原型方法(私有方法，//原型方法也需要通过实例化对象去调用)和静态方法(类方法)//类方法不需要通过实例化对象去调用
    //
    _createClass(Parent,[
        {key:'getName',value:function(){
            return this.name;
        }}
    ],[
        {key:'Fn',value:function(){
            return 'Fn';
        }}
    ])
    return Parent;
}()

function _inherits(subclass,superclass){
    subclass.prototype = Object.create(superclass.prototype,{constructor:{value:subclass}});//child类的原型指向了parent类的被创造出来的原型
    subclass.__proto__ = superclass;
}

var Child = function(Parent){
    _inherits(Child,Parent);
    function Child(){
        _classCallCheck(this,Child);
        var that = this;
        console.log(Object.getPrototypeOf(Child),typeof Object.getPrototypeOf(Child));//父类->Parent
        var obj = Object.getPrototypeOf(Child).call(this);// Child.__proto__ 继承父类的私有方法
        if(typeof obj === 'object'){
            that = obj;
        }
        return that;
    }
    return Child;
}(Parent)


function _classCallCheck(instance,constructor){
    if(!(instance instanceof constructor)){
        throw Error('没有实例化构造函数');
    }
}
var c = new Child();
console.log(Child.Fn());
// class Parent {
//     constructor(){
//         this.name = 'parent';
//     }
//     getName(){
//         return this.name;
//     }
//     static Fn(){
//         return 'this is static Fn';
//     }
// }
// class Child extends Parent{
//     constructor(name){
//         super(name);
//         this.name = name;
//     }
// }

// let child = new Child('jiyao');
// console.log(child.name);