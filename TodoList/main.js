(function (){
    var e=new Vue();

    Vue.component('todotask',{
        template:'#todo-tpl',
        props:['todo','index'],
        methods:{
            action:function(name,paras){
                console.log(name);
                e.$emit(name,paras);
            }
        }
    })

    new Vue({
        el:"#main",
        data: {
            todoList:[{
                title:"任务一",
                completed:false
            },
            {
                title:"任务二",
                completed:false
            }],
            currentEdit:{
                //当前所做是新增还是修改的标记
                edit:false,
                completed:false
            },
        },
        methods:{
            merge:function (){
                if(this.currentEdit.edit==false){
                    console.log(this.currentEdit.title);
                    if(this.currentEdit.title&&this.currentEdit.title!==0){
                        var newlist=Object.assign({},this.currentEdit);
                        this.todoList.push(newlist);
                    }
                }
                Vue.set(this.currentEdit,'checked',false);
                this.currentEdit={edit:false,};
                
            },
            remove:function(index){
                console.log(this.todoList);
                if(this.todoList.length==index+1){
                    //console.log('y');
                    this.todoList.pop();
                }else
                    this.todoList.splice(index,1);
            },
            edit:function(index){
                this.currentEdit=this.todoList[index];
                this.currentEdit.edit=true;
                
            },
            complete:function(index){
                Vue.set(this.todoList[index],"completed",true);
            },
            incomplete:function(index){
                Vue.set(this.todoList[index],"completed",false);
            }
        },

        watch:{
            todoList:{
                //监听深度
                deep:true,
                handler:function (n,o){
                    if(n){
                        window.localStorage.setItem("todoList",JSON.stringify(n));
                    }else{
                        window.localStorage.setItem("todoList",JSON.stringify([]));
                    }
                }
            }
        },

        mounted:function(){
            var me=this;
            this.todoList=JSON.parse(window.localStorage.getItem('todoList'))||this.todoList;
            //定时检查任务是否到时
            var alertinfo=setInterval(function(){
                me.todoList.forEach(function(list,i){
                    if(!list.time||list.checked==true){
                        return;
                    }
                    var mstime=new Date(list.time);
                    var now=new Date();
                    if(mstime<=now){
                        alert("任务："+list.title+" 已到期限");
                        Vue.set(list,'checked',true);
                    }
                });
            },1000);
            e.$on('remove',function(index){
                me.remove(index);
            });
            e.$on('edit',function(index){
                me.edit(index);
            });
            e.$on('complete',function(index){
                me.complete(index);
            });

            e.$on('showDetail',function(index){
                Vue.set(me.todoList[index],'showD',!me.todoList[index].showD);
            });
        }
    })
})();