//加载PhantomJS的webpage模块，并创建一个实例。
var page = require('webpage').create();

var searchKey='兔子';
var url='http://www.baidu.com/s?wd='+encodeURIComponent(searchKey);

page.onLoadStarted=function(){
    page.starttime=new Date();
}

/* page.onConsoleMessage = function(msg) {
  console.log('Page title is ' + msg);
}; */

page.open(url, function(status) {
    var results;
    if(status==='success'){
        results=page.evaluate(function(){
            var t=[];
            var contents=document.getElementById('content_left').children;
            for(var i=0;i<contents.length;i++){
                if(contents[i].id){
                    var o={};
                    if(contents[i].children[0].tagName=='H3'){
                        o.title=contents[i].children[0].innerText;

                        if(contents[i].children[1].getElementsByClassName('c-abstract')[0]){
                            o.info=contents[i].children[1].getElementsByClassName('c-abstract')[0].innerText;
                        }else{
                            o.info='';
                        }
                        
                        o.link=contents[i].children[0].getElementsByTagName('a')[0].getAttribute('href')||'';

                        if(contents[i].children[1].getElementsByClassName('c-img')[0]){
                            o.img=(contents[i].children[1].getElementsByClassName('c-img')[0]).getAttribute('src');
                        }else{
                            o.img='';
                        }

                        t.push(o);
                    }
                }
            }
            var stime=page.starttime;
            var str={
                code:1,
                msg:'抓取成功',
                //word:'searchKey',
                //time:stime,
                datalist:t
            };
            return str;
        });

        var timed=(new Date())-page.starttime;
        results.time=timed;
        results.word=searchKey;
    }else{
        results={
            code: 0, //返回状态码，1为成功，0为失败
            msg: '抓取失败', //返回的信息
            word: searchKey,
            time: -1, //任务的时间
            dataList:[]
        };
    }

    var output=JSON.stringify(results);
    console.log(output);
    phantom.exit();
});
