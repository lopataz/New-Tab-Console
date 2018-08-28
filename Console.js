export class Console { 
constructor(data){
	this.console = document.getElementById("typingConsole");
	this.caret = -1;
	this.initHiddenChar();
	if(data!== undefined) this.innerHTML = data;
} 
get Element(){ return this.console;}
get innerHTML(){ return this.console.innerHTML; }
get innerText(){ return this.console.innerText; }
get caretPos() {return this.caret;}
get hiddenCharVal(){return this.hiddenChar;}

get carsetIndexBr(){
	var index ={"debut" : -1 , "fin" :-1, "data" : ""};
	var arrConsole = this.innerHTML.split('■');
	if(arrConsole && arrConsole.length){console.log(arrConsole);
		index.debut = arrConsole[0].lastIndexOf("<br>");
		if(index.debut== -1 ) index.debut=0;
		index.fin = arrConsole[0].length;
		index.data = arrConsole[0].substring(index.debut+ 4);
	}
	return index;
}

set ["innerHTML"](data) { this.console.innerHTML = data; }
set ["innerText"](data) { this.console.innerText = data; }

set ["caretPos"](position) { this.caret = position; }
set ["hiddenCharVal"](hiddenChar) { this.hiddenChar = hiddenChar; }

	

	showChar(str){
		if(globalLine === null){ 
			this.eraseLine();
			globalLine=new String;
		}else if(!globalLine.length){ 
			//var content = document.createTextNode(str);
			var arrConsole = this.innerText.split('■');
			if (this.insert){
				this.hiddenChar = arrConsole[1].slice(0,1);
				this.innerText=arrConsole[0]+str+'■'+arrConsole[1].slice(1);
			}else{
				this.innerText=arrConsole[0]+str+'■'+arrConsole[1];
				//this.hiddenChar = '';
			}
		}
	}
	
	Erase(){
		if(globalLine === null ){ myConsole.eraseLine();}
			else if(globalLine.length && globalLine == "help"){display_help();}
			else if(globalLine.length){myConsole.eraseLine(); globalLine=new String;}
				else{
					var arrConsole = this.innerText.split('■');
					this.innerText = arrConsole[0].slice(0,-1)+'■'+arrConsole[1];
					
				}
	}

	showHTML(str)
	{
		this.console.innerHTML+= str;
	}
	
	Evaluate(e){//console.log("g:"+globalLine);
	
		if(!e.shiftKey  && globalLine != null && !globalLine.length){
			this.showChar('\n');
		}else {
			var output = this.innerHTML.split('■'); 
			if (output){
			var lineIndex = this.carsetIndexBr;
			lineIndex["debut"] += 3*(lineIndex["debut"] >>31); 
				if((lineIndex["debut"]+3) == lineIndex["fin"]-1 && globalLine != null && !globalLine.length){//alert("0");
					this.Erase();
				}else if(globalLine != null && !globalLine.length){ //alert("1");
					funDictionary( lineIndex,lineIndex["data"]); 
				}else{//alert("2");
					funDictionary(lineIndex,globalLine); 
				}
			}
		}
	
	}

	
	eraseLine(br_included){ 
		var lineIndex = this.carsetIndexBr;//console.log(lineIndex);
		this.innerHTML = this.innerHTML.substring(0,lineIndex["debut"]+(br_included?0:4))+this.innerHTML.substring(lineIndex["fin"]);
	}

	

	backgroundLine(color, index1, index2){
			var output=this.console.innerHTML ;
			if(index1 === undefined) {var index=carsetIndexBr; var index1= index["debut"]; var index2 = index["fin"];}
			else if(index2 === undefined){var index2 = this.innerHTML.substring(index1).firstIndexOf("<br>")-1;  }
			
			console.log(index1 + " "+index2);
			
			if(!document.getElementsByClassName("bL").length){
				this.console.innerHTML = output.slice(0,index1+(!index1?0:4))+"<span class='bL "+color+"'>"+output.slice(index1+(!index1?0:4),index2)+"</span>"+output.slice(index2);
			}else{
				document.getElementsByClassName("bL")[0].className = 'bL '+color;
			}
	}
	//caret movements
		moveLeft(){
			var arrConsole = this.innerText.split('■');
			if(arrConsole && arrConsole[0].length){
			var isLB = Number(arrConsole[0].slice(-1) == "\n");
			var isdoubleLB = (isLB && arrConsole[0].slice(-2, -1) == "\n");
					if(this.hiddenChar == "\n" && isLB) arrConsole[1] = arrConsole[1].slice(1);//console.log(arrConsole[0]);
					this.innerText = arrConsole[0].slice(0,-1-isLB) + (isLB && !isdoubleLB?'■\n':(isdoubleLB? '\n■\n':'■'))+ (this.hiddenChar!= '\n'?this.hiddenChar:(isLB?'\n':'')) + arrConsole[1];
					this.hiddenChar = arrConsole[0].slice(-1-isLB,(isLB?-1:undefined));
				if(arrConsole[0].length<=0) this.hiddenChar = '\0'; 
				//console.log(this.hiddenChar);
			}
		}
		
		moveRight(){
			var arrConsole = this.innerText.split('■');
			var isLB = Number(arrConsole[1].slice(0,1) == "\n");
			var isdoubleLB = Number(arrConsole[1].slice(0, 2) == "\n\n");
			var isHaLB = this.hiddenChar == "\n";
			if(this.hiddenChar!='\0'){
				this.innerText = arrConsole[0] +this.hiddenChar+(!isHaLB && isLB?(isLB && !isdoubleLB?'■\n':'■'):'■')+ arrConsole[1].slice(1-(!isHaLB && isLB)+isLB-isdoubleLB) ;
				 this.hiddenChar =arrConsole[1].slice(-(!isHaLB && isLB)+isLB,-(!isHaLB && isLB)+1+isLB);
			}else{ 
				this.innerText =(isLB?'\n':'')+'■'+arrConsole[1].slice(1-isdoubleLB+isLB);
				this.hiddenChar =arrConsole[1].slice(0+isLB,1+isLB);
			}				
		}
		
		initHiddenChar(i_char){
		if (i_char !== undefined){ this.hiddenChar = i_char;}else{
			var arrConsole = this.innerText.split('■');
			this.hiddenChar = (arrConsole && arrConsole[1] && arrConsole[1].slice(0,1) != "\n" ?arrConsole[0].slice(-1):'\n');
			if(arrConsole[1] && this.hiddenChar != '\n') this.innerText = arrConsole[0].slice(0,-1) +'■' +arrConsole[1];
		}
		}

};

// globals //
export let myConsole = new Console();
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


import colorFromData from './computeDataModule.js';
import {colorSave} from './storage.js';

/* Console functions*/
var save_output = function(index1,index2) {
	  var output = myConsole.innerHTML.substring(0,index1)+(myConsole.hiddenChar!='\n'?myConsole.hiddenChar:'')+myConsole.innerHTML.substring(index2+1);
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
		 myConsole = new Console(colorSave.output);
		 //addCaret();
			var cool = colorSave.color(OPTIONS.colorSatu); 
			if(OPTIONS.Dynamic) document.body.style.backgroundColor = cool;
			if(OPTIONS.soundVolume) colorSave.sound(OPTIONS.soundVolume);
	  });
	  return true;
	};
	
var clear_output = function() {
		myConsole.innerHTML = "■";
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
		myConsole.eraseLine();
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


function funDictionary(indexLine,cmd){//console.log(globalLine);console.log(cmd);
	var cmd_line=cmd;
	var args = (cmd=== null ? [] :(cmd.match(/\s[a-zA-Z\d\-\.:\/]+/g) || [])); 
	if (args && args.length){
	args.forEach(function(t,i,a){a[i]= t.substring(1);});
	cmd  = (cmd.match(/[a-zA-Z\d]+/) || new Array(null))[0];
	}
	
	
	if( ! ["save","erase","restore","clear","visit","help"].includes(cmd) ){
		if(globalLine != null && !globalLine.length){
			myConsole.backgroundLine("redSpan",indexLine.debut,indexLine.fin);
			globalLine=null;
		}else{
			myConsole.eraseLine();
			globalLine=new String;
		}
	}else {
		if(!globalLine.length){
			myConsole.backgroundLine("greenSpan",indexLine.debut,indexLine.fin);
			globalLine=(args && args.length>0?cmd_line:cmd);
		}else{
			var return_func;
			var need_eraseLL = false;
			var need_globalReset = true;
			switch(cmd){
			case "save":return_func = save_output(indexLine.debut, indexLine.fin);need_eraseLL=true; 
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
			myConsole.eraseLine(true);
			}
			if(need_globalReset){
				globalLine=new String;
			}
			
			if(!return_func &&  !need_eraseLL ){ 
				myConsole.backgroundLine("orangeSpan",indexLine.debut,indexLine.fin);
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


	
	/* KEYS EVENT CASES */
function keypress(e)
{
   if (!e) e= event;
  //removeCaret();
   switch (e.which) {
            case 13:myConsole.Evaluate(e);
			break;
			/*case 32:showHTML("&nbsp;");
			break;*/
			
			default: if(e.keyCode != 118 && e.keyCode !=  86) myConsole.showChar(keyval(e.keyCode)); else if(!e.ctrlKey) myConsole.showChar(keyval(e.keyCode));
			break;
   }
   //addCaret();
}

function keydown(e)
{
   if (!e) e= event;
   switch (e.which) {
			
			case 8:myConsole.Erase();
			break;
			case 37:myConsole.moveLeft();
			break;
			case 39:myConsole.moveRight();
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
	myConsole.showChar(pastedData);
	//addCaret();
}

myConsole.Element.addEventListener('paste', handlePaste);