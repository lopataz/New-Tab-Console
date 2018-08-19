var globalLine = new String(""); //determines if the last line has background-color
	
/* Keys events */	
if (document.addEventListener)
{
	document.addEventListener("keydown",keydown,false);
    document.addEventListener("keypress",keypress,false);
}else if (document.attachEvent)
{
	document.attachEvent("onkeydown",keydown,false);
    document.attachEvent("onkeypress", keypress);
	
}else{document.onkeydown= keydown;
document.onkeypress= keypress;}
	
function keyval(n){
    if (n == null) return 'undefined';
    return String.fromCharCode(n);
}
//
	
function showChar(str){
	if(globalLine === null){ 
		eraseLastLine();
		globalLine=new String;
	}else if(!globalLine.length){ 
	var Div = document.getElementById("typingConsole");
	var content = document.createTextNode(str);
	Div.appendChild(content);
	}
}

function showHTML(str)
{
	document.getElementById("typingConsole").innerHTML+= str;
}


function eraseLastLine(br_included){
	if(index === undefined) var index=document.getElementById("typingConsole").innerHTML.lastIndexOf("<br>");
	document.getElementById("typingConsole").innerHTML = document.getElementById("typingConsole").innerHTML.substring(0,index+(br_included?0:4));
}

var save_output = function(index) {
	  var output = document.getElementById("typingConsole").innerHTML.substring(0,index);
	  chrome.storage.local.set({consoleSave: output}, function(){});
	  return true;
	};
var erase_save = function() {
	  chrome.storage.local.set({consoleSave: ""}, function(){});
	  return true;
	};
	
var clear_output = function() {
		document.getElementById("typingConsole").innerHTML = "";
		return true;
	};
	
	
var display_help = function(){
	
	if(document.getElementById("typingConsole").innerHTML.slice(-11)=="help</span>"){
		eraseLastLine();
		document.getElementById("typingConsole").innerHTML += "Available commands:<br>save<br>erase<br>clear<br>HBi"+document.getElementById("typingConsole").innerHTML.length;
	}else{
		var match = document.getElementById("typingConsole").innerHTML.match(/HBi\d+/g);
		var HBi = match[match.length-1].substring(3);
		document.getElementById("typingConsole").innerHTML = document.getElementById("typingConsole").innerHTML.substring(0,HBi);
		globalLine = new String;
	}
};

	function backgroundLine(color, index){
		var output=document.getElementById("typingConsole").innerHTML ;
		document.getElementById("typingConsole").innerHTML = output.slice(0,index+4)+"<span class='"+color+"'>"+output.slice(index+4)+"</span>";
		
	}

function funDictionary(indexLastLine,name){
	if( ! ["save","erase","clear","help"].includes(name) ){
		if(globalLine != null && !globalLine.length){
			backgroundLine("redSpan",indexLastLine);
			globalLine=null;
		}else{
			eraseLastLine();
			globalLine=new String;
		}
	}else {
		if(!globalLine.length){
			backgroundLine("greenSpan",indexLastLine);
			globalLine=name;
		}else{
			var need_eraseLL = false;
			var need_globalReset = true;
			switch(globalLine){
			case "save":save_output(indexLastLine);need_eraseLL=true; 
			break;
			case "erase":erase_save();need_eraseLL=true; 
			break;
			case "clear":clear_output();need_eraseLL=true; 
			break;
			case "help":display_help(); need_globalReset=false;
			break;

			default:
			break;
			}
			if(need_eraseLL){
			eraseLastLine(true);
			}
			if(need_globalReset){
				globalLine=new String;
			}
		}
	}
}
	
function suppressdefault(e)
{
	if (e.preventDefault) e.preventDefault();
	if (e.stopPropagation) e.stopPropagation();
}

function removeCaret(){
	document.getElementById("typingConsole").innerHTML = document.getElementById("typingConsole").innerHTML.slice(0, -1); ;
}
function addCaret(){
	document.getElementById("typingConsole").innerHTML += "&#9632;";
}

function Evaluate(e){
	if(!e.shiftKey  && globalLine != null && !globalLine.length){
		document.getElementById("typingConsole").innerHTML += "<br>";
	}else {
		var output =document.getElementById("typingConsole").innerHTML;
		var lastLineIndex = output.lastIndexOf("<br>");
		lastLineIndex += 3*(lastLineIndex >>31);
			if(globalLine != null && !globalLine.length){
				funDictionary( lastLineIndex,output.substring(lastLineIndex+4)); 
			}else{
				funDictionary(lastLineIndex,globalLine); 
			}
	}
	
}
	
function Erase(){
	if(globalLine === null ){ eraseLastLine();addCaret();}
	else if(globalLine.length){eraseLastLine();addCaret(); globalLine=new String;}
	else{
	var output = document.getElementById("typingConsole").innerHTML;
	var Caret = (output.slice(-1).charCodeAt(0) == 9632 ? -1 : 0);
	
	if (document.getElementById("typingConsole").innerText.slice(Caret-1).charCodeAt(0) == 10) //confu
	{document.getElementById("typingConsole").innerHTML = output.slice(0, -4 + Caret)+(Caret? "&#9632;":"");}
	else if ([38,60,62,160].includes(document.getElementById("typingConsole").innerText.slice(Caret-1).charCodeAt(0))) 
	{
		var match = output.match(/&[a-z\d]+;/g);
		if(match.length) document.getElementById("typingConsole").innerHTML = output.substring(0, output.lastIndexOf(match[match.length-1]))+(Caret? "&#9632;":"");
	}
	else{
		document.getElementById("typingConsole").innerHTML = output.slice(0, Caret-1)+(Caret? "&#9632;":"");
	}
	}
}
	
function keypress(e)
{
   if (!e) e= event;
   removeCaret();
   switch (e.which) {
            case 13:Evaluate(e);
			break;
			/*case 32:showHTML("&nbsp;");
			break;*/
			
			default:showChar(keyval(e.keyCode));
			break;
   }
   addCaret();
}

function keydown(e)
{
   if (!e) e= event;
   switch (e.which) {
			
			case 8:Erase();
			break;
			default:
			break;
			
   }
}