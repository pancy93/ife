function Observer(data){
    this.data=data;
    this.walk(data);
}

var p=Observer.prototype;

//为对象的每一个属性绑定get和set
p.walk=function (obj){
    for(var i in obj){
        var val=obj[i];
        console.log(obj);
        if(obj.hasOwnProperty(i)){
            //console.log(obj);
            if(typeof val==='object'){
                new Observer(val);
            }
            this.convert(val,i);
            
        }
    }
}

p.convert=function(val,i){
    Object.defineProperty(this.data,i,{
        enumerable: true,
        configurable: true,
        get:function (){
            console.log('you visited '+i);
            return val;
        },
        set:function (nv){
            //console.log(i);
            return nv;
        }
    })
}

var data = {
    user: {
        name: "px",
        age: "24"
    },
    address: {
        city: "tz"
    }
};

/* var data2={
    name: 'youngwind',
    age: 25
  }; */

var app = new Observer(data);

/* Object.defineProperty(data2,'name',{
    get:function (){
        console.log('visited');
        return 'px';
    }
}); */
//data2.name;
console.log(app.data.user);