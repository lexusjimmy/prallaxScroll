//windows default info
var picQuantity=0;
var loadedNum=0;
var optiRate=0;
var winHeight=0;
var winWidth=0;

//data Loaded variable
var allQuery;
var allJsonDone=false;
var imageArray;

//loading Animation
var loadingPlayer;

//layout variable
var visualCenter=new Array(2);
var pBottom=0;
var allLayoutDone=false;

//parallax variable
var scrollmaster;
var viewOnMobile=false;

//-----------------all function begin here------------------
mainControl()

function mainControl(){
	initialize();
	parallaxControl();
	detectmob;
}

function initialize(){
	windowsCalculate();
	dataFeeding(0,"path",0);
	$("#loadingBox").css("left",visualCenter[0]-100+"px");
	$("#loadingBox").css("top",visualCenter[1]+"px");
	$("#loadingBox .frameAnimating").css("height",71.25+"px");
	playLoading();
	var jsonChecker=window.setInterval(function() {
		if (allJsonDone) {
			window.clearInterval(jsonChecker);
			imageArray=new Array(picQuantity);
			var counter=0;
			for (var i = 0; i < allQuery.story.length; i++) {
				for(var j=0;j<allQuery.story[i].pictures.length;j++){
					imageArray[counter]=new Array(2);
					loadPic(allQuery.story[i].pictures[j].source,counter);
					counter++;
				}
				
			};
		};
	},100);
}

function windowsCalculate () {
	winHeight=window.innerHeight;
	winWidth=window.innerWidth;
	optiRate=winWidth/1600;
	if (optiRate>1) {
		optiRate=1;
	}else if (optiRate<0.6) {
		optiRate=0.6;
	};
	visualCenter[0]=winWidth/2;
	visualCenter[1]=winHeight/2;
}

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    viewOnMobile=true;
  }
 else {
    viewOnMobile=false;
  }
}
//--------------get json ---------------------------------

function dataFeeding (stor,dataType,picNum) {
	var result="null";
	if (picQuantity==0) {
		$.getJSON("https://dl.dropboxusercontent.com/u/37826169/webPage/allData.json",function(data,state){
			picQuantity=data.story[0].imageQuantity;
			allQuery=data;
			allJsonDone=true;
		});
	};
	if(stor>picQuantity||picQuantity==0){
		result=-1;
	}else{
		switch(dataType){
			case "path":
				result=allQuery.story[stor].pictures[picNum].source;
			break;
			case "dom":
				result=allQuery.story[stor].pictures[picNum].domName;
			break;
			case "bg":
				result=allQuery.story[stor].pictures[picNum].background;
			break;
			case "article":
				result=allQuery.story[stor].word.article;
			break;
			case "tltle":
				result=allQuery.story[stor].word.title;
			break;
		}
	}
	return result;
}

//-----------------loading picture----------------------------

function loadPic (source,num) {
	var img=new Image();
	img.src=source;
	var picChecker=window.setInterval(function () {
		if (img.complete) {
			loadedNum++;
			window.clearInterval(picChecker);
			changeVisualProcess();
			imageArray[num][0]=img;
			img.width*=optiRate;
			if (loadedNum==picQuantity) {
				$(window).delay(500);
				$("#loadingBox").remove();
				window.clearInterval(loadingPlayer);
				placePic();
			};
		};
	},300);
}

function changeVisualProcess () {
	var vProcess=0;
	if (picQuantity>0&&loadedNum>0) {
		vProcess=(loadedNum/picQuantity)*100;
	};
	vProcess=Math.floor(vProcess);
	$("#loadingBox .foreignText").text(vProcess+"%");
}

function playLoading () {
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
	},500);
	
}

//---------------------------layout------------------------------
function sectionSet () {
	$('article').css("width",winWidth/5+"px");
	$('article').css("left",winWidth/10+"px");
	$('article').css("top","80px");
	$('.title').css("left",winWidth/10+"px");
	$('.title').css("top","30px");
	$('.picSec').css('height',700+"px");
	$('.wordSec').css('height',700+"px");
	$('.picSec').css('width',winWidth+"px");
	$('.wordSec').css('width',winWidth+"px");
	$('.wordSec').css("background-image","url("+dataFeeding(0,"path",0)+")");
}

function placePic () {
	var imageCounter=0;
	sectionSet();
	for (var i = 1; i < allQuery.story.length; i++) {
		for(var j=0;j<allQuery.story[i].pictures.length;j++){
			var plcName=dataFeeding(i,"dom",j);
			if (dataFeeding(i,"bg",j)) {
				$(plcName).css("background-image","url("+dataFeeding(i,"path",j)+")");
			} else{
				$(plcName).append(imageArray[imageCounter]);
			};
			imageCounter++;
			if (plcName.search("animating")>0||plcName.search("staticObj")>0) {
				innerDomSetting(plcName);
			};
		}
	};
	allLayoutDone=true;
	placeText()
}

function innerDomSetting (dom) {
	var parentHeight=$(dom).parent().css("height");
	var parentWidth=$(dom).parent().css("width")
	if (dom.search("staticObj")>0) {
		var tWidth=parseInt(parentWidth.substring(0,parentWidth.length-2));
		var tHeight=parseInt(parentHeight.substring(0,parentHeight.length-2));
		$(dom).css("width",tWidth*0.98+"px");
		$(dom).css("height",tHeight*0.98+"px");
		$(dom).css("left","20px");
	} else{
		$(dom).css("width",parentWidth);
		$(dom).css("height",parentHeight);
	};
	
}

function positionCalculate (dom) {
	
}

function placeText(){
	for (var i = 1; i < allQuery.story.length; i++) {
		var secName=allQuery.story[i].name;
		switch(secName){
			case "brain":
				$("#intro h1").append(allQuery.story[i].word.title);
				$("#intro article").append(allQuery.story[i].word.article);
			break;
			case "shebetic":
				$("#shebeInfo h1").append(allQuery.story[i].word.title);
				$("#shebeInfo article").append(allQuery.story[i].word.article);
			break;
			case "trick":
				$("#trickInfo h1").append(allQuery.story[i].word.title);
				$("#trickInfo article").append(allQuery.story[i].word.article);
			break;
			case "hakka":
				$("#hakkaInfo h1").append(allQuery.story[i].word.title);
				$("#hakkaInfo article").append(allQuery.story[i].word.article);
			break;
			case "impact":
				$("#impulseInfo h1").append(allQuery.story[i].word.title);
				$("#impulseInfo article").append(allQuery.story[i].word.article);
			break;
		}
	};
}

//------------------parallax setting---------------------------
function parallaxControl () {
	var layoutChecker=window.setInterval(function () {
		if (allLayoutDone) {
			window.clearInterval(layoutChecker);
			
				scrollmaster=new ScrollMagic({container:"#mobileWrapper"});
				wordSecTweenSet("#intro",100);
				wordSecTweenSet("#shebeInfo",250);
				wordSecTweenSet("#trickInfo",250);
				wordSecTweenSet("#hakkaInfo",270);
				wordSecTweenSet("#impulseInfo",250);
				picSecTweenSetM("#opening",0,100,0,0,0,0)
				picSecTweenSetM("#shebetic",0,100,-150,100,-300,100);
				picSecTweenSetM("#trick",0,100,-150,100,-400,100);
				picSecTweenSetM("#hakka",0,100,-50,100,-320,100);
				picSecTweenSetM("#impulse",0,100,-80,100,-155,100);
				picSecTweenSetM("#map",0,100,0,0,0,0);
			
			
			
				if(Modernizr.touch){
					var skScroll=new IScroll('#mobileWrapper',{scrollX:false,scrollY:true,scrollbars:true,useTransform:true,useTransion:false, probeType:3});
					scrollmaster.scrollPos(function(){
						return -skScroll.y;
						console.log("get the fucking scroll")
					});
					skScroll.on("scroll",function () {
						scrollmaster.update();
					})
				}
			
		};
	},500);
}

function picSecTweenSet(mainDom,mainFrom,mainTo,anAFrom,anATo,anBFrom,anBTo) {
	var picTween=new TimelineMax();
	picTween.add([
			TweenMax.fromTo(mainDom,1,{backgroundPosition:0+" "+mainFrom+"%"},{backgroundPosition:0+" "+mainTo+"%",ease:Linear.easeOut}),
			TweenMax.fromTo(mainDom+" .animatingObjA",1,{backgroundPosition:0+" "+anAFrom+"%"},{backgroundPosition:0+" "+anATo+"%",ease:Linear.easeOut}),
			TweenMax.fromTo(mainDom+" .animatingObjB",1,{backgroundPosition:0+" "+anBFrom+"%"},{backgroundPosition:0+" "+anBTo+"%",ease:Linear.easeOut})

		])
	var picScene= new ScrollScene({triggerElement:mainDom,duration:winHeight,offset:350});
	picScene.setTween(picTween)
			.setPin(mainDom)
			.addTo(scrollmaster);
}

function wordSecTweenSet (mainDom,anAFrom) {
	var wordTween=new TimelineMax();
	wordTween.add([
			TweenMax.fromTo(mainDom,1,{backgroundPosition:"0 0"},{backgroundPosition:"0 100%",ease:Linear.easeOut}),
			TweenMax.fromTo(mainDom+" .animatingObjA",1,{backgroundPosition:0+" "+anAFrom+"%"},{backgroundPosition:"0 100%",ease:Linear.easeOut})
		])
	var wordScene= new ScrollScene({triggerElement:mainDom,duration:350});
	wordScene.setTween(wordTween)
			.addTo(scrollmaster);
			console.log("what the fucking");
}

function picSecTweenSetM(mainDom,mainFrom,mainTo,anAFrom,anATo,anBFrom,anBTo) {
	var picTween=new TimelineMax();
	console.log("animating has been added");
	picTween.add([
			TweenMax.fromTo(mainDom,1,{backgroundPosition:0+" "+mainFrom+"%"},{backgroundPosition:0+" "+mainTo+"%",ease:Linear.easeOut}),
			TweenMax.fromTo(mainDom+" .animatingObjA",1,{backgroundPosition:0+" "+anAFrom+"%"},{backgroundPosition:0+" "+anATo+"%",ease:Linear.easeOut}),
			TweenMax.fromTo(mainDom+" .animatingObjB",1,{backgroundPosition:0+" "+anBFrom+"%"},{backgroundPosition:0+" "+anBTo+"%",ease:Linear.easeOut})

		])
	var picScene= new ScrollScene({triggerElement:mainDom});
	picScene.setTween(picTween)
			.addTo(scrollmaster);
}