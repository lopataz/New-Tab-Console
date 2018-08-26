class Console { 
constructor(){this.console = document.getElementById("typingConsole"); } 
get Element(){ return this.console;}
get innerHTML(){ return this.console.innerHTML; }
get innerText(){ return this.console.innerText; }

set ["innerHTML"](data) { this.console.innerHTML = data; }
set ["innerText"](data) { this.console.innerText = data; }

};

// globals //
let myConsole = new Console();
var OPTIONS = new Array;
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

/* retarded Options sync retrieval*/
setTimeout(function(){
	OPTIONS.Dynamic = (getComputedStyle(document.documentElement).getPropertyValue("--OPT-Dynamic") == "true");
	OPTIONS.colorSatu = getComputedStyle(document.documentElement).getPropertyValue("--OPT-colorSatu");
	OPTIONS.soundVolume = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--OPT-soundVolume"));
	
},25);

// //import * as computeDataModule from './computeDataModule.js';
import colorFromData from './computeDataModule.js';
import {colorSave} from './storage.js';

/* Console functions*/
var save_output = function(index) {
	  var output = myConsole.innerHTML.substring(0,index);
	  chrome.storage.local.set({consoleSave: output}, function(){
			colorSave.setData(output);
			var cool = colorSave.color(OPTIONS.colorSatu); 
			if(OPTIONS.Dynamic) document.body.style.backgroundColor = cool;
			if(OPTIONS.soundVolume) colorSave.sound(OPTIONS.soundVolume);
	  });
	  return true;
	};
var erase_save = function() {
	  chrome.storage.local.remove("consoleSave", function(){ 
			colorSave.setData("");
			var cool = colorSave.color(OPTIONS.colorSatu); 
			if(OPTIONS.Dynamic) document.body.style.backgroundColor = cool;
			if(OPTIONS.soundVolume) colorSave.sound(OPTIONS.soundVolume);
		  });
	  return true;
	};
	
var restore_save = function() {
	  chrome.storage.local.get(['consoleSave'], function(result) {
		 colorSave.setData(result.consoleSave? result.consoleSave: "");
		 myConsole.innerHTML = colorSave.output;
		 addCaret();
			var cool = colorSave.color(OPTIONS.colorSatu); 
			if(OPTIONS.Dynamic) document.body.style.backgroundColor = cool;
			if(OPTIONS.soundVolume) colorSave.sound(OPTIONS.soundVolume);
	  });
	  return true;
	};
	
var clear_output = function() {
		myConsole.innerHTML = "";
		return true;
	};
	
	
var visit_page = function(page){ console.log(page[0]);
	if (page && page != null){
		var url = RegExp('^(https?|ftp)?(?::\/\/)?([a-zA-Z\d\\-\.\/]+)').exec(page[0]);
		if(url !=null){
			var protocol = (typeof url[1] != 'undefined' ? url[1]:"http");
			if (typeof url[2] != 'undefined'){ document.location.replace(protocol+"://"+url[2]); return true;}
		}
	}
	return false;
};
	
var display_help = function(arg){
	
	if(globalLine== "help" && !arg.length){
		globalLine="help 1";
		eraseLastLine();
		var help_text ="<br>###Help###<br><br>Available commands:"+
		"<br>save (Saves current display)"+
		"<br>erase (Erases last save)"+
		"<br>restore (Loads the save)"+
		"<br>clear(Clears whole console)"+
		"<br>visit url (Goes to the specified url)"+
		"<br>help (displays current help)<br>Press Enter to quit";
		
		myConsole.innerHTML += help_text+"<br>ZANi"+myConsole.innerHTML.length;
		return true;
	}else{
		
		clearToZANi();
		globalLine=new String;
		return true;
	}
};


//  Zippy Added New index
function clearToZANi(){
	var match = myConsole.innerHTML.match(/ZANi\d+/g);
		var ZANi = match[match.length-1].substring(4);
		myConsole.innerHTML = myConsole.innerHTML.substring(0,ZANi);
}


/* Console intern functions*/
function showChar(str){
	if(globalLine === null){ 
		eraseLastLine();
		globalLine=new String;
	}else if(!globalLine.length){ 
		var Div = myConsole.Element;
		var content = document.createTextNode(str);
		Div.appendChild(content);
	}
}

function showHTML(str)
{
	myConsole.innerHTML+= str;
}


function eraseLastLine(br_included){
	if(index === undefined) var index=myConsole.innerHTML.lastIndexOf("<br>");
	myConsole.innerHTML = myConsole.innerHTML.substring(0,index+(br_included?0:4));
}

	function backgroundLine(color, index){
		var output=myConsole.innerHTML ;
		if(!document.getElementsByClassName("bL").length){
			myConsole.innerHTML = output.slice(0,index+4)+"<span class='bL "+color+"'>"+output.slice(index+4)+"</span>";
		}else{
			document.getElementsByClassName("bL")[0].className = 'bL '+color;
		}
	}

function funDictionary(indexLastLine,cmd){
	var cmd_line=cmd;
	var args = (cmd=== null ? [] :(cmd.match(/\s[a-zA-Z\d\-\.:\/]+/g) || [])); 
	if (args && args.length){
	args.forEach(function(t,i,a){a[i]= t.substring(1);});
	cmd  = (cmd.match(/[a-zA-Z\d]+/) || new Array(null))[0];
	}
	
	
	if( ! ["save","erase","restore","clear","visit","help"].includes(cmd) ){
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
			globalLine=(args && args.length>0?cmd_line:cmd);
		}else{
			var return_func;
			var need_eraseLL = false;
			var need_globalReset = true;
			switch(cmd){
			case "save":return_func = save_output(indexLastLine);need_eraseLL=true; 
			break;
			case "erase":return_func = erase_save();need_eraseLL=true; 
			break;
			case "restore":return_func = restore_save();
			break;
			case "clear":return_func = clear_output(); 
			break;
			case "visit":return_func = visit_page(args); 
			break;
			case "help":return_func = display_help(args); need_globalReset=false;
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
			
			if(!return_func &&  !need_eraseLL ){ 
				backgroundLine("orangeSpan",indexLastLine);
				globalLine=null;//!\ changes global var, regardless of function pref
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
	myConsole.innerHTML = myConsole.innerHTML.slice(0, -1); ;
}
function addCaret(){
	myConsole.innerHTML += "&#9632;";
}

function Evaluate(e){
	if(!e.shiftKey  && globalLine != null && !globalLine.length){
		myConsole.innerHTML += "<br>";
	}else {
		var output = myConsole.innerHTML;
		var lastLineIndex = output.lastIndexOf("<br>");
		lastLineIndex += 3*(lastLineIndex >>31);
			if((lastLineIndex+3) == (output.length-1)){
			Erase();
			}else if(globalLine != null && !globalLine.length){
				funDictionary( lastLineIndex,output.substring(lastLineIndex+4)); 
			}else{
				funDictionary(lastLineIndex,globalLine); 
			}
	}
	
}
	
function Erase(){
	if(globalLine === null ){ eraseLastLine();addCaret();}
	else if(globalLine.length && globalLine == "help"){display_help();addCaret();}
	else if(globalLine.length){eraseLastLine();addCaret(); globalLine=new String;}
	else{
	var output = myConsole.innerHTML;
	var Caret = (output.slice(-1).charCodeAt(0) == 9632 ? -1 : 0);
	
	if (myConsole.innerText.slice(Caret-1).charCodeAt(0) == 10) 
	{myConsole.innerHTML = output.slice(0, -4 + Caret)+(Caret? "&#9632;":"");} //+4 avoids <br> tag
	else if ([38,60,62,160].includes(myConsole.innerText.slice(Caret-1).charCodeAt(0))) 
	{
		var match = output.match(/&[a-z\d]+;/g);
		if(match.length) myConsole.innerHTML = output.substring(0, output.lastIndexOf(match[match.length-1]))+(Caret? "&#9632;":"");
	}
	else{
		myConsole.innerHTML = output.slice(0, Caret-1)+(Caret? "&#9632;":"");
	}
	}
}
	
	/* KEYS EVENT CASES */
function keypress(e)
{
   if (!e) e= event;
   removeCaret();
   switch (e.which) {
            case 13:Evaluate(e);
			break;
			/*case 32:showHTML("&nbsp;");
			break;*/
			
			default: if(e.keyCode != 118 && e.keyCode !=  86) showChar(keyval(e.keyCode)); else if(!e.ctrlKey) showChar(keyval(e.keyCode));
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

/* paste event */

function handlePaste (e) {
		var clipboardData, pastedData;

		e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    
    removeCaret();
	showChar(pastedData);
	addCaret();
}

myConsole.Element.addEventListener('paste', handlePaste);