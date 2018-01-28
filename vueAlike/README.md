ife任务：如何模仿vue，使用js实现动态数据绑定的大致思路小记。

### task1
首先需要探测到一个对象的属性是否发生了变化，es5加入的Object.defineProperty这一方法可以设置对象的某一个key的详细信息。
其中get和set可以定义一个回调函数，这样就可以方便地动态探测对象的属性。
如下所示：
Object.defineProperty(obj, key, {
    get: function () {
        //………………
    },
    set: function (newVal) {
        //对设置的新value（即newval）作处理
    }

任务一中定义了一个Observer构造函数，传入参数为一个object（不考虑数组），输出为一个对象，其 data 属性能够访问到传递进去的对象，并且可以动态监测到是否访问或修改。这里因为传入参数的某个属性可能仍然是一个对象，所以需要递归一下。
