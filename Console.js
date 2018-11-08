export class Console { 
//#console;
//#caret;

constructor(data){
	this.console = document.getElementById("typingConsole");
	this.caret = -1;
	this.caretblink = false;
	this.initHiddenChar();
	if(data!== undefined) this.innerHTML = data;
	//if(this.innerHTML.match(/\u25A0/) == null) this.innerHTML += "&#x25A0;"
} 
get Element(){ return this.console;}
get innerHTML(){ return this.console.innerHTML; }
get innerText(){ return this.console.innerText; }
get caretPos() {return this.caret;}
get hiddenCharVal(){return this.hiddenChar;}

get carsetIndexBr(){
	var index ={"start" : -1 , "end" :-1, "data" : ""};
	
	var arrConsole = this.innerHTML.split('■');
	if(arrConsole && arrConsole.length){//console.log(arrConsole);
		index.start = arrConsole[0].lastIndexOf("<br>");
		if(index.start== -1 ) index.start=0;
		
		index.end = arrConsole[0].length;
		index.data = arrConsole[0].substring(index.start+4*(index.start > 0 ));
	}

	return index;
}

get carsetIndexBrText(){
	var index ={"start" : -1 , "end" :-1, "data" : ""};
	
	var arrConsole = this.innerText.split('■');
		if(arrConsole && arrConsole.length){
			index.start = arrConsole[0].lastIndexOf("\n");
			//if(index.start== -1 ) index.start=0;
			index.end = arrConsole[0].length;
			index.data = arrConsole[0].substring(index.start+(index.start > 0 ));
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
	
	Delete(){
		if(globalLine === null ){ myConsole.eraseLine();}
			else if(globalLine.length && globalLine == "help"){display_help();}
			else if(globalLine.length){myConsole.eraseLine(); globalLine=new String;}
				else{
					const spChars = ['\n','','\0'];
					var arrConsole = this.innerText.split('■');
					var ol_hiddenChar = this.hiddenChar;
					this.hiddenChar = arrConsole[1].slice(0,+(arrConsole[1].length>0)); //!def of hiddenChar
					this.innerText = arrConsole[0]+'■'+arrConsole[1].slice(+(arrConsole[1].length>0)-(this.hiddenChar=="\n")); 
					if(this.hiddenChar=='\n' && spChars.includes(ol_hiddenChar) && (arrConsole[1].length>1 && !spChars.includes(arrConsole[1].slice(1,2)))) { //need this for charset's imbrication
						this.innerText = arrConsole[0]+'■'+arrConsole[1].slice(1+(arrConsole[1].length>0)); 
						this.hiddenChar = arrConsole[1].slice(1,2);
					}else if(this.hiddenChar=='\n' && spChars.includes(ol_hiddenChar)){
						this.innerText = arrConsole[0]+'■'+arrConsole[1].slice((arrConsole[1].length>0));
					}
					//else do nothin'
					
				}
	}

	showHTML(str)
	{
		this.console.innerHTML+= str;
	}
	
	Evaluate(e){////console.log("g:"+globalLine);
	
		if(!e.shiftKey  && globalLine != null && !globalLine.length){
			this.showChar('\n');
		}else {
			var output = this.innerHTML.split('■'); 
			if (output){
			var lineIndex = this.carsetIndexBr; //console.log(">>>"+lineIndex.start+ " " +lineIndex.end +" " + lineIndex.data);
			
				if((lineIndex["start"]+4*(lineIndex["start"]>0)) == lineIndex["end"] && globalLine != null && !globalLine.length){//alert("0");
					this.Erase();
				}else if(globalLine != null && !globalLine.length){ //alert("1");
					funDictionary( lineIndex,lineIndex["data"]); 
				}else{//alert("2");
					funDictionary(lineIndex,globalLine); 
				}
			}
		}
	
	}

	
	eraseLine(br_included,start,end){ 
		var lineIndex = this.carsetIndexBr;////console.log(lineIndex);
		this.innerHTML = this.innerHTML.substring(0,lineIndex["start"]+(br_included?0:4-4*(lineIndex.start==0)))+this.innerHTML.substring(lineIndex["end"]);
	}

	

	backgroundLine(color, index1, index2){
			var output=this.console.innerHTML ;
			if(index1 === undefined) {var index=carsetIndexBr; var index1= index["start"]; var index2 = index["end"];}
			else if(index2 === undefined){var index2 = this.innerHTML.substring(index1).firstIndexOf("<br>")-1;  }
			
			//console.log(index1 + " "+index2);
			
			if(!document.getElementsByClassName("bL").length){ //console.log(typeof index1+" "+index1);
				this.console.innerHTML = output.slice(0,index1+4*(index1 > 0 ))+"<span class='bL "+color+"'>"+output.slice(index1+4*(index1 > 0 ),index2)+"</span>"+output.slice(index2);
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
					if(this.hiddenChar == "\n" && isLB) arrConsole[1] = arrConsole[1].slice(1);////console.log(arrConsole[0]);
					this.innerText = arrConsole[0].slice(0,-1-isLB) + (isLB && !isdoubleLB?'■\n':(isdoubleLB? '\n■\n':'■'))+ (this.hiddenChar!= '\n'?this.hiddenChar:(isLB?'\n':'')) + arrConsole[1];
					this.hiddenChar = arrConsole[0].slice(-1-isLB,(isLB?-1:undefined));
				if(arrConsole[0].length<=0) this.hiddenChar = '\0'; 
				////console.log(this.hiddenChar);
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
		
		
		moveUp(){
			var IndexBr = this.carsetIndexBrText;
			var ol_hiddenChar= this.hiddenChar;
			var isLB = Number(this.innerText.slice(IndexBr.start-1,IndexBr.start) == "\n");
						
			if (IndexBr.start>0 ){console.log("1"+ol_hiddenChar+"2"); //console.log((isLB && !['','\n'].includes(ol_hiddenChar))+":"+isLB);
				this.hiddenChar =  (isLB? '':this.innerText.slice(IndexBr.start-1,IndexBr.start));
				 this.innerText = this.innerText.slice(0,IndexBr.start-1)+(isLB ?'\n■':'■')+this.innerText.slice(IndexBr.start,IndexBr.end)+ol_hiddenChar+this.innerText.slice(IndexBr.end+1+(['\n'].includes(ol_hiddenChar)));
			}else if(IndexBr.start==0){
				this.hiddenChar = "";
				this.innerText = '■'+this.innerText.slice(0,IndexBr.end)+ol_hiddenChar+this.innerText.slice(IndexBr.end+1);
			}else if(IndexBr.start == -1 && IndexBr.end>0 ){ //alert("D");
				this.hiddenChar = (![" ", '\n'].includes(this.innerText.slice(0,1))  ? this.innerText.slice(0,1):(IndexBr.end>=2 ?this.innerText.slice(1,2):"\0"));
				this.innerText = '■'+this.innerText.slice(+(IndexBr.end>0)+[" ", '\n'].includes(this.innerText.slice(0,1)),IndexBr.end)+ol_hiddenChar+this.innerText.slice(IndexBr.end+1);
			}else if(IndexBr.start == -1 ){ //alert("0");
				
			}
			
			// if(ol_hiddenChar == '\n' && this.innerHTML.slice(IndexBr.start-4, IndexBr.start)== "<br>") this.hiddenChar = '\n';
		}
		
		moveDown(){
			var arrConsole = this.innerHTML.split('■');
			var indexBR = arrConsole[1].indexOf("<br>");
			
			if(indexBR > 0){
				this.innerHTML = arrConsole[0]+this.hiddenChar+arrConsole[1].slice(0,indexBR)+'■'+arrConsole[1].slice(indexBR);
				this.hiddenChar = '';
				
			}else if (indexBR == 0){
				var nextBR = arrConsole[1].slice(4).indexOf("<br>")+4;
				if(nextBR >3){
					this.innerHTML = arrConsole[0]+this.hiddenChar+arrConsole[1].slice(0,nextBR)+'■'+arrConsole[1].slice(nextBR);
				}else{
					this.innerHTML = arrConsole[0]+this.hiddenChar+arrConsole[1]+'■';
				}
				this.hiddenChar = '';
			}
			
			
		}
		
		
		initHiddenChar(i_char){
			var arrConsole = this.innerText.split('■');
			if (i_char !== undefined){ this.hiddenChar = i_char;}else{
			this.hiddenChar = (arrConsole && arrConsole[1] && arrConsole[1].slice(0,1) != "\n" ?arrConsole[0].slice(-1):'\n');
			if(arrConsole[1] && this.hiddenChar != '\n') this.innerText = arrConsole[0].slice(0,-1) +'■' +arrConsole[1];
			}
			this.caret = arrConsole[0].length;
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
/* carset blink funcs*/

function toggleBlink(forceCaret){
	
	if (typeof forceCaret != "undefined" && !forceCaret){
		myConsole.caretPos = arrConsole[0].length;
		myConsole.caretblink =true;
	}
	
	/*   */
	if(myConsole.caretblink){
		var arrConsole = myConsole.innerText.split('■');
		if(arrConsole.length == 1 && myConsole.caretPos >=0){
			myConsole.innerText = arrConsole[0].slice(0,myConsole.caretPos)+'■'+arrConsole[0].slice(myConsole.caretPos+1)
			myConsole.caretPos = -1;
		}
		else if(arrConsole.length >1 && !forceCaret){
			myConsole.caretPos = arrConsole[0].length;
			myConsole.innerText = arrConsole[0].slice(0,myConsole.caretPos +(myConsole.hiddenCharVal== '\n'|0))+(myConsole.hiddenCharVal!= '\n'?myConsole.hiddenCharVal :' ')+arrConsole[1];
			
		}else if( myConsole.caretPos ==-1  && !forceCaret){
			if(!arrConsole) arrConsole[0]="";
			myConsole.innerText = '■'+arrConsole[0];
		}
	}
	/*  */
	if (typeof forceCaret != "undefined" && forceCaret){
		myConsole.caretblink =false;
	}
	
}

//setInterval(toggleBlink,200);

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
	  var output = myConsole.innerHTML.substring(0,index1)+(index1 != 0?'<br>':'')+(myConsole.hiddenChar!='\n'?myConsole.hiddenChar:'')+myConsole.innerHTML.substring(index2);
	  //console.log(output);
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
			
			
			myConsole.caretblink=true;
	  });
	  return true;
	};
	
var clear_output = function() {
		myConsole.innerHTML = "■";
		return true;
	};
	
	
var visit_page = function(page){ //console.log(page[0]);
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


function funDictionary(indexLine,cmd){////function dictionnary, to process available commands
	var cmd_line=cmd;
	var args = (cmd=== null ? [] :(cmd.match(/\s[a-zA-Z\d\-\.:\/]+/g) || [])); 
	if (args && args.length){
	args.forEach(function(t,i,a){a[i]= t.substring(1);});
	cmd  = (cmd.match(/[a-zA-Z\d]+/) || new Array(null))[0];
	}
	
	
	if( ! ["save","erase","restore","clear","visit","help"].includes(cmd) ){
		if(globalLine != null && !globalLine.length){
			myConsole.backgroundLine("redSpan",indexLine.start,indexLine.end);
			globalLine=null;
		}else{
			myConsole.eraseLine();
			globalLine=new String;
		}
	}else {
		if(!globalLine.length){
			myConsole.backgroundLine("greenSpan",indexLine.start,indexLine.end);
			globalLine=(args && args.length>0?cmd_line:cmd);
		}else{
			var return_func;
			var need_eraseLL = false;
			var need_globalReset = true;
			switch(cmd){
			case "save":return_func = save_output(indexLine.start, indexLine.end);myConsole.eraseLine(false);
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
				myConsole.backgroundLine("orangeSpan",indexLine.start,indexLine.end);
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
            case 13:myConsole.Evaluate(e); //Enter
			break;
			/*case 32:showHTML("&nbsp;"); // space
			break;*/
			
			default: if(e.keyCode != 118 && e.keyCode !=  86) myConsole.showChar(keyval(e.keyCode)); else if(!e.ctrlKey) myConsole.showChar(keyval(e.keyCode)); //V ctrl+ V
			break;
   }
   //addCaret();
}

function keydown(e)
{
	
	if (!e) e= event;
	var forced = false;
	//switch (e.which){case 8: case 37: case 39: case 38: case 40: case 46: toggleBlink(1);forced=true; break;}
	switch (e.which) {
			case 8:myConsole.Erase();
			break;
			case 37:myConsole.moveLeft();
			break;
			case 39:myConsole.moveRight();
			break;
			case 38:myConsole.moveUp();
			break;
			case 40:myConsole.moveDown();
			break;
			case 46:myConsole.Delete();
			break;
			default:
			break;
	}
	//if(forced)toggleBlink(false);
	
}

/* paste event */

function handlePaste (e) {
		var clipboardData, pastedData;

		e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    
   // removeCaret();
	myConsole.showChar(pastedData);
	//addCaret();
}

myConsole.Element.addEventListener('paste', handlePaste);