// JavaScript Document
	//初始化
	var title=document.getElementById("title");
	var playBTN=document.getElementById("playBTN");
	var nextBTN=document.getElementById("nextBTN");
	var lyricBox=document.getElementById("lyrics");
	var currentTrack=document.getElementById("track1");
	var playMode=["src/Repeat.png","src/Shuffle.png"];
	var currentPlayMode=0;
	var timer=0;
	var num=0;
var showlyricc=0;
var channelArr=[];
var currentChannel="public_tuijian_spring";
var chan={};
	
	//*加载音频为异步,加载完音频后的操作
	currentTrack.onloadedmetadata=function(){
		
		document.getElementById("playedtime").innerHTML="-"+translateTime(Math.floor(currentTrack.duration));
		currentTrack.currentTime=0;
		document.getElementById("playedbar").style.width="0px";
		currentTrack.volume=document.getElementById("volum").style.width.replace("px","")/50;
		console.log(num);
		//打开页面的第一首歌曲不立即播放
		if(num>1){
			showPlayingTime();
			currentTrack.play();
			playBTN.src="src/pause.png";
		}else{
			playBTN.src="src/play.png";
		}
		showLyric(currentTrack.sid);
	};
	
	document.getElementById("volum").style.width="50px";
	
	//控制音量
	function controlVolume(vo){
		currentTrack.volume=vo;
	}
	
	//切换静音状态
	function switchMuted(){
		if(currentTrack.muted){
			currentTrack.muted=false;
			document.getElementById("volum").style.width=currentTrack.volume*50+"px";
		}else{
			currentTrack.muted=true;
			document.getElementById("volum").style.width=0;
		}
	}

	function getChannel(){
		var channelRequest;
		if(window.XMLHttpRequest){
			channelRequest=new XMLHttpRequest();
		}
		if(channelRequest){
			channelRequest.onreadystatechange=function(){
				if(channelRequest.readyState===4){
					channelArr=JSON.parse(channelRequest.response).channels;
					var channelList=document.getElementById("playlist");
					
					for(var i=0;i<channelArr.length;i++){
						var newchannel=document.createElement("li");
						newchannel.innerHTML=channelArr[i].name;
						newchannel.channelID=channelArr[i].channel_id;
						newchannel.ondblclick=chooseChannel;
						
						channelList.appendChild(newchannel);
						
					}
					chan=(document.getElementsByTagName("li"))[0];

					chan.className="active";
				}
				
			};
			channelRequest.open("GET",'https://jirenguapi.applinzi.com/fm/getChannels.php',true);
			channelRequest.send(null);
		}
	}
getChannel();

	function chooseChannel(e){
		chan.className="";
		currentChannel=e.target.channelID;
		chan=e.target;
		chan.className="active";
		playNextTrack();
	}
	
	//播放下一首歌曲
	function playNextTrack(){
		currentTrack.pause();
		clearInterval(timer);
		
		var xmlhttp,
			songData;
		
		function getSongData(){
			if(xmlhttp.readyState===4){
				if(xmlhttp.status===0||xmlhttp.status===200){
					songData=JSON.parse(xmlhttp.responseText).song[0];
					
					resetPlayer(songData);
				}
			}
		}
		
		function resetPlayer(data){
			title.innerHTML=data.title;
			document.getElementById("artist").innerHTML=data.artist;
			document.getElementById("albumIMG").style.backgroundImage="url("+data.picture+")";
			document.getElementById("track1").src=data.url;
			
			currentTrack.sid=data.sid;
			
		}
		
		if(window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
		}else{
			console.log("the web browser don't support ajax");
		}
		
		if(xmlhttp){
			xmlhttp.onreadystatechange=getSongData;
			xmlhttp.open("GET",'https://jirenguapi.applinzi.com/fm/getSong.php?channel='+currentChannel,true);
			xmlhttp.send(null);
		}
		console.log(currentChannel);
		num++;
	}
	
playNextTrack();
	
//根据sid显示歌曲的歌词
function showLyric(sid){
	var lyricRequest,
		lyricText;
	//通过Ajax获取歌词文本
	if(window.XMLHttpRequest){
		lyricRequest=new XMLHttpRequest(); 
	}
	if(lyricRequest){
		lyricRequest.onreadystatechange=function(){
			if(lyricRequest.readyState===4){
				if(lyricRequest.status===0||lyricRequest.status===200){
					lyricText=JSON.parse(lyricRequest.response.replace(/^error/,"")).lyric;
					
					//若歌词文本不为空则放入lyricbox，否则显示“暂无歌词”
					if(lyricText){
						console.log(lyricText);
						var LineArr=lyricText.split("\n");
						var timeReg=/\[\d{2}:\d{2}\.\d{2}\]/g;
						var lineResult=[];
						var htmlLyric="";

						for(var i=1;i<LineArr.length;i++){
							var time=LineArr[i].match(timeReg);
							if(!time) 
								continue;
							var str=LineArr[i].replace(timeReg,"");
							//时间转化为秒
							var t=time[time.length-1].slice(1,-1).split(":");
							var sec=parseInt(t[0])*60+parseInt(t[1]);
							lineResult.push([sec,str]);
						}
						
						for(var j=0;j<lineResult.length;j++){
							htmlLyric+="<div>"+lineResult[j][1]+"</div>";
						}
						lyricBox.innerHTML=htmlLyric;
						for(var q=0;q<lyricBox.childElementCount;q++){
							lyricBox.children[q].lyricT=lineResult[q][0];
						}
					}
					if(lyricBox.innerHTML==""){
						lyricBox.innerHTML="暂无歌词";
					}
					
				}
				
			}
			
		};
		var lyricURL='http://jirenguapi.applinzi.com/fm/getLyric.php?&sid='+sid;
		lyricRequest.open("POST",lyricURL,true);
		lyricRequest.send();
	}
}

	//切换播放和暂停状态的函数
	function SwitchPlayAndPause(){
		if(currentTrack.paused){
			currentTrack.play();
			this.src="src/pause.png";
			showPlayingTime();
		}else{
			currentTrack.pause();
			this.src="src/play.png";
			clearInterval(timer);
		}
	}
	
	//将秒数转换为分秒的格式
	function translateTime(second){
		if(second!=NaN){
			var minute=Math.floor(second/60);
			var sec=second%60;
			if(sec<10){
				return minute+":"+"0"+sec;
			}else{
				return minute+":"+sec;
			}
		}
	}
	
	//显示播放时间
	function showPlayingTime(){
		var totaltime=currentTrack.duration;
		//var playedtime=currentTrack.currentTime;
		var lyricArr=lyricBox.children;
		timer=setInterval(function(){
			var curT=currentTrack.currentTime;
			document.getElementById("playedtime").innerHTML="-"+translateTime(Math.floor(totaltime-curT));
			document.getElementById("playedbar").style.width=Math.floor(300*(curT/totaltime))+"px";
			//滚动歌词
			if(lyricArr){
				for(var i=0;i<lyricArr.length-1;i++){
					var curLT=lyricArr[i].lyricT;
					var nextLT=lyricArr[i+1].lyricT;
					if((curT>=curLT)&&(curT<nextLT)){
						lyricBox.style.top=(100-lyricArr[i].offsetTop)+"px";
						break;
					}
				}
			}
			
		},1000);
	}
	
	//点击按钮切换播放和暂停状态
	playBTN.addEventListener("click",SwitchPlayAndPause,false);
	
	//点击按钮切换静音状态
	document.getElementById("muted").addEventListener("click",switchMuted,false);
	
	//根据mouseup的位置改动音频播放进度
	document.getElementById("progressbar").addEventListener("mouseup",function(e){
		console.log(e.clientX-this.getBoundingClientRect().left);
		currentTrack.currentTime=(e.clientX-this.getBoundingClientRect().left)/300*currentTrack.duration;
		document.getElementById("playedtime").innerHTML="-"+translateTime(Math.floor(currentTrack.duration-currentTrack.currentTime));
		document.getElementById("playedbar").style.width=
										e.clientX-this.getBoundingClientRect().left+"px";
	},false);
	
	//调节音量
	document.getElementById("volumbar").addEventListener("mouseup",function(e){
		var vo=(e.clientX-this.getBoundingClientRect().left)/50;
		controlVolume(vo);
		document.getElementById("volum").style.width=vo*50+"px";
	},false);
	
	//播放下一首歌曲
	nextBTN.addEventListener("click",function(){
		playNextTrack();
		
	},false);
	
	//当前曲目播放完后自动播放下一首歌曲
	currentTrack.addEventListener("ended",function(){
		playNextTrack();
		
	},false);

//切换歌词界面
document.getElementById("lyric").addEventListener("click",function(){
	if(showlyricc%2==0){
		document.getElementById("lyricMask").style.display="block";
		document.getElementById("lyricBox").style.display="block";
	}else{
		document.getElementById("lyricMask").style.display="none";
		document.getElementById("lyricBox").style.display="none";
	}
	showlyricc++;
},false);