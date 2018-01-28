/**
 * 一个DOM动画库，接口api参考velocity.js
 */


 /**
  * 构造函数
  * @param element:DOM element
  */
function Animation(element){
    this.el=element;
}

/**
 * 通过传入的参数实现动画，返回一个Animation对象可供链式调用
 * @param {*动画的末状态} style 
 * @param {*可选参数} option 
 */
Animation.prototype.animation=function (style,option){
    var startStyle={},
        finalStyle={};
    //解析style
    for(key in style){
        if(style.hasOwnProperty(key)){
            var o=window.getComputedStyle(this.el).getPropertyValue(key);
            var n=style[key];
            startStyle[key]=Number(o.replace('px',''));
            finalStyle[key]=Number(n.replace('px',''));
        }
    }
    console.log(startStyle);
    console.log(finalStyle);
}

Animation.prototype.fadeIn=function (option){

}

Animation.prototype.stop=function (){

}
