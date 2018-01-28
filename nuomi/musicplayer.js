// JavaScript Document
	//初始化
	var tracklist=document.getElementsByTagName("audio");
	var title=document.getElementById("title");
	var playBTN=document.getElementById("playBTN");
	var nextBTN=document.getElementById("nextBTN");
	var playedbar=document.getElementById("playedbar");
	var currentTrack=tracklist[0];
	var currentTrackIndex=0;
	var playMode=["src/loop.png","src/Repeat.png","src/Shuffle.png"];
	var currentPlayMode=0;
	var timer=0;
	
	title.innerHTML=tracklist[0].src.replace(/^.*\//,"");
	//*加载音频为异步
	tracklist[0].onloadedmetadata=function(){
		document.getElementById("playedtime").innerHTML="-"+translateTime(Math.floor(tracklist[0].duration));
	}
	
	document.getElementById("volum").style.width="50px";
	
	//初始化歌曲列表
	function initPlaylist(){
		for(var i=0;i<tracklist.length;i++){
			var track=document.createElement("li");
			document.getElementById("playlist").appendChild(track);
			track.innerHTML=decodeURIComponent(tracklist[i].src.replace(/^.*\//,""));
		}
	}
	initPlaylist();
	
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
	
	//根据播放模式参数播放下一首歌曲
	function playNextTrack(playmode){
		
		currentTrack.pause();
		clearInterval(timer);
		currentTrack.currentTime=0;
		switch(playmode){
			case 0:
				if(currentTrackIndex<tracklist.length-1){
					currentTrackIndex++;
				}else{
					currentTrackIndex=0;
				}
				currentTrack=tracklist[currentTrackIndex];
				break;
			case 1:
				break;
			case 2:
				currentTrackIndex=Math.floor(Math.random()*tracklist.length);
				currentTrack=tracklist[currentTrackIndex];
				break;
			default:
				break;
		}
		
		title.innerHTML=decodeURIComponent(currentTrack.currentSrc.replace(/^.*\//,""));
		currentTrack.play();
		playBTN.src="src/pause.png";
		showPlayingTime();
		currentTrack.volume=document.getElementById("volum").style.width.replace("px","")/50;
	}
	
	//根据播放模式参数播放上一首歌曲
	function playPrevTrack(playmode){
		currentTrack.pause();
		clearInterval(timer);
		currentTrack.currentTime=0;
		switch(playmode){
			case 0:
				if(currentTrackIndex>0){
					currentTrackIndex--;
				}else{
					currentTrackIndex=tracklist.length-1;
				}
				currentTrack=tracklist[currentTrackIndex];
				break;
			case 1:
				break;
			case 2:
				currentTrackIndex=Math.floor(Math.random()*tracklist.length);
				currentTrack=tracklist[currentTrackIndex];
				break;
			default:
				break;
		}
		
		title.innerHTML=decodeURIComponent(currentTrack.currentSrc.replace(/^.*\//,""));
		currentTrack.play();
		playBTN.src="src/pause.png";
		showPlayingTime();
		currentTrack.volume=document.getElementById("volum").style.width.replace("px","")/50;
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
		timer=setInterval(function(){
			document.getElementById("playedtime").innerHTML="-"+translateTime(Math.floor(totaltime-currentTrack.currentTime));
			document.getElementById("playedbar").style.width=
										Math.floor(300*(currentTrack.currentTime/totaltime))+"px";
		},1000);
	}
	
	//show lyrics
	function showLyric(url){
		//get lyric by ajax
		var xmlhttp;
		
		if(window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=getLyric;
			xmlhttp.open("GET",url,true);
			xmlhttp.send(null);
		}
		
		//transform format
		function getLyric(){
			if(xmlhttp.readyState===4){
				if(xmlhttp.status===0||xmlhttp.status===200){
					console.log(JSON.parse(xmlhttp.responseText).song[0].title);
				}
			}
		}
	}
	
	showLyric('http://api.jirengu.com/fm/getSong.php');
	
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
		playNextTrack(currentPlayMode);
	},false);
	
	//播放上一首歌曲
	document.getElementById("prevBTN").addEventListener("click",function(){
		playPrevTrack(currentPlayMode);
	},false);
	
	//修改播放模式
	document.getElementById("playmode").addEventListener("click",function(){
		currentPlayMode=(currentPlayMode+1)%3;
		this.src=playMode[currentPlayMode];
	},false);
	
	for(var i=0;i<tracklist.length;i++){
		tracklist[i].addEventListener("ended",function(){
			playNextTrack(currentPlayMode);
		},false);
	}