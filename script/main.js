//font-family: 'Special Elite', cursive;
//font-family: 'Cinzel', serif;
// JavaScript Document
//windows default information
var picQuantity=0;
var optiRate=0;
var winHeight=0;
var winWidth=0;
var pageOpen=false;

//image loading varialble
var loadedNum=0;
var imageArray;
var queryResult;
var wordQuery;
var jsonFinished=false;
var wordFinished=false;

//layout variable
var visualCenter=new Array(2);
var pBottom=0;

//anmating variable
var loadingPlayer;

//parallaxing variable
var scrollToDefault=false;
var scrollComandder;
var totalSection;

mainControl();
function mainControl(){
	intialize();
	//scrollDown();
	parallaxControl();
}

function intialize(){
	windowsCalculate();
	dataFeeding(0,"path");
	$("#loadingBox").css("left",visualCenter[0]-100+"px");
	$("#loadingBox").css("top",visualCenter[1]+"px");
	$("#loadingBox .frameAnimating").css("height",71.25+"px");
	playloading();
	var jsonChecker=window.setInterval(function(){
		if(jsonFinished){
			window.clearInterval(jsonChecker);
			imageArray=new Array(picQuantity);
			for(var i=0;i<picQuantity;i++){
				//[0] image itself; [1] image height ; [2] image default place
				imageArray[i]=new Array(3);
				loadPic(i);
			}
		}
	},100);
}

function windowsCalculate(){
	winHeight=window.innerHeight;
	winWidth=window.innerWidth;
	optiRate=winWidth/1600;
	if(optiRate>1){
		optiRate=1;
	}else if(optiRate<0.6){
		optiRate=0.6;
	}
	visualCenter[0]=winWidth/2;
	visualCenter[1]=winHeight/2;
}

//---------------------------------getting Json Data------------------------------------
function dataFeeding(num,dataType){
	var result;
	if(picQuantity==0){
	$.getJSON("https://dl.dropboxusercontent.com/u/37826169/webPage/imgData.json",function(data,state){
		picQuantity=data.image.length;
		queryResult=data;
		jsonFinished=true;
	});
	}
	if(num>picQuantity||picQuantity==0){
		result=-1;
	}else{
		switch(dataType){
			case "path":
				result=queryResult.image[num].path;
			break;
			case "dom":
				result=queryResult.image[num].divName;
			break;
			case "floor":
				result=queryResult.image[num].story;
			break;
			case "offset":
				result=new Array(2);
				result[0]=queryResult.image[num].xPlace;
				result[1]=queryResult.image[num].yPlace;
			break;
			case "bg":
				result=queryResult.image[num].backgroundImage;
			break;
			case "moduelPlace":
				result=queryResult.image[num].placeReCalculate;
			break;
		}
	}
	return result;
}

function getNum(clue,type){
	//put all the result into the array
	var result;
	var cluNum;
	switch(type){
		case "floor":
		result=new Array();
		for(var i=0;i<picQuantity;i++){
			var tmpName=queryResult.image[i].story;
			if(tmpName==clue){
				result.push(i);
			}
		}
		break;
		case "path":
		for(var i=0;i<picQuantity;i++){
			var tmpName=queryResult.image[i].path;
			if(tmpName.search(clue)>0){
				result=i;
				break;
			}
		}
		break;
	}
	return result;
}

function wordFeeding(floorNum){
	if(!wordFinished){
		$.getJSON("https://dl.dropboxusercontent.com/u/37826169/webPage/wordInfo.json",function(data,state){
			wordQuery=data;
			wordFinished=true;
		});
	}
	if(wordFinished){
		for(var i=0;i<wordQuery.wordData.length;i++){
			if(floorNum==wordQuery.wordData[i].domFloor){
				var mainDom=wordQuery.wordData[i].domName;
				var tmpName=mainDom+" h1";
				$(tmpName).text(wordQuery.wordData[i].title);
				tmpName=mainDom+" article";
				$(tmpName).text(wordQuery.wordData[i].article);
				break;
			}
		}
	}
}
//----------------------------------- loading Pic--------------------------------------
function loadPic(num){
	var img=new Image();
	img.src=dataFeeding(num,"path");
	var loadChecker = window.setInterval(function(){
		if(img.complete){
			loadedNum++;
			window.clearInterval(loadChecker);
			changeVisualProcess();
			imageArray[num][0]=img;
			img.width*=optiRate;
			imageArray[num][1]=img.height*optiRate;
			//console.log(num+":"+imageArray[num][1]);
			if(loadedNum==picQuantity){
				positionCalculator();
				$(window).delay(100);
				pageOpen=true;
				$("#loadingBox").remove();
				window.clearInterval(loadingPlayer);
				placePic();
			}
		}
		},300);
}

function changeVisualProcess(){
	var vProcess=0;
	if(picQuantity>0 && loadedNum>0){
		vProcess=(loadedNum/picQuantity)*100;
	}
	vProcess=Math.floor(vProcess);
	$("#loadingBox .foreignText").text(vProcess+"%");
}

function playloading(){
	var currStep=0;
	var posi=0;
	loadingPlayer=window.setInterval(function(){
		switch(currStep){
			case 0:
				currStep++;
				posi-=71.25;
			break;
			case 1:
				currStep++;
				posi-=71.25;
			break;
			case 2:
				currStep++;
				posi-=71.25;
			break;
			default:
				currStep=0;
				posi=0;
			break;
		}
		$('#loadingBox .frameAnimating img').css('top',posi+'px');
		$('#loadingBox .frameAnimating img').css('opacity','0px');
		$('#loadingBox .frameAnimating img').animate({opacity:1},200,function(){
			$('#loadingBox .frameAnimating img').animate({opacity:0},200)
		})
	},500)
	
}

//-----------------------layout part----------------------------------
function sectionDecorate(){
	$('.picSec').css('width',winWidth+"px");
	$('.picSec').css('height',winHeight+100+"px");
	$('.wordSec').css('height',winHeight+50+"px");
	$('.wordSec').css('width',winWidth+"px");
}
function placePic(){
	
	for(var i=0;i<picQuantity;i++){
		var plcName=dataFeeding(i,"dom");
		if(dataFeeding(i,"bg")){
			$(plcName).css("background-image","url("+dataFeeding(i,"path")+")");
			$(plcName).css("height",imageArray[i][1]+"px");
			$(plcName).css("width",imageArray[i][0].width+"px");
			$(plcName).css("top",imageArray[i][2].y+"px");
			$(plcName).css("left",imageArray[i][2].x+"px");
			switch(dataFeeding(i,"floor")){
				case "background":
					$(plcName).css("z-index",0);
				break;
				case "buildings":
					$(plcName).css("z-index",50);
				break;
			}
			//console.log(plcName+": x-->"+imageArray[i][2].x+", y-->"+imageArray[i][2].y);
			//
		}else{
			$(plcName).append(imageArray[i][0]);
			$(plcName).css("top",imageArray[i][2].y+"px");
			$(plcName).css("left",imageArray[i][2].x+"px");
			$(plcName).css("z-index",100);
		}
	}
	scrollDown();
}
function positionCalculator(){
	//each section seperate to many part
	//calculate to put it
	//xplace yplace r the "place grid" "12" at Width. "6" at Height
	for(var i=0;i<picQuantity;i++){
		if(dataFeeding(i,"bg")){
			imageArray[i][2].x=0;
			imageArray[i][2].y=0;
		}else{
			var tmpPlace=dataFeeding(i,"offset");
			if(dataFeeding(i,"moduelPlace")){
				var rLimit=winWidth-imageArray[i][0].width*optiRate;
				var btmLimit=winWidth-imageArray[i][0].height*optiRate;
				imageArray[i][2].x=rLimit*(tmpPlace[0]/12);
				imageArray[i][2].y=btmLimit*(tmpPlace[1]/6);
			}else{
				imageArray[i][2].x=tmpPlace[0]*optiRate;
				imageArray[i][2].y=tmpPlace[1]*optiRate;
			}
		}
	}
}
//--------------------start parallax----------------------------------------

function scrollDown(){
	var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	$body.animate({scrollTop: pBottom-winHeight}, 3000,function(){
		scrollToDefault=true;		
    });
}

function parallaxControl(){
	var pageReady=window.setInterval(function(){
		if(scrollToDefault){
			window.clearInterval(pageReady);
			scrollComandder=new ScrollMagic();
			totalSection=$('.wordSec').length+ $('picSec').length;
			
		}
	},250);
}

function parallaxSetting(){
	
}

function setPicSec(domName,bgOffset,objArray){
	//record original place
	
	//set scene
	var action=new TimelineMax().add(TweenMax.fromTo(domName,1,{backgroundPosition:""},{backgroundPosition:"+"+bgOffset}));
	switch(objArray.length){
		case 4:
			action.add(TweenMax.fromTo(domName+" .anmatingObjectD",1,{backgroundPosition:""},{backgroundPosition:"+"+objArray[3]}));
		case 3:
			action.add(TweenMax.fromTo(domName+" .anmatingObjectC",1,{backgroundPosition:""},{backgroundPosition:"+"+objArray[2]}));
		case 2:
			action.add(TweenMax.fromTo(domName+" .anmatingObjectB",1,{backgroundPosition:""},{backgroundPosition:"+"+objArray[1]}));
		case 1:
			action.add(TweenMax.fromTo(domName+" .anmatingObjectA",1,{backgroundPosition:""},{backgroundPosition:"+"+objArray[0]}));
		break;
	}
	var picScene=new ScrollScene({duration:window.innerHeight})
						.setTween(action)
						.addTo(scrollComandder);
}