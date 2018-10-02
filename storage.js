var OPT_Apparent= new Boolean;
var OPTIONS = new Array;
const dynamicDefault ="#677999";

import {Console, myConsole} from './Console.js';
import colorFromData from './computeDataModule.js';
export let colorSave = new colorFromData('');

document.addEventListener("DOMContentLoaded", function(e){
	
	chrome.storage.sync.get({
		favoriteColor: dynamicDefault,
		textColor: '#FFF',
		apparentConsole : true,
		soundVolume:0,
		colorSatu:180
		
	  }, function(items) {
			OPT_Apparent = items.apparentConsole;
			
			if(items.favoriteColor == dynamicDefault){ 
			items.favoriteColor+=Number(items.colorSatu).toString(16);items.Dynamic=true; }
			else{ items.Dynamic=false;}
			
			OPTIONS=items;
			
			//* SET GLOBAL VAR OPTIONS in a STYLESHEET / READ-ONLY *//
			var style = document.createElement('style');
			style.type = 'text/css';
			var options = ':root { \ncolor:#f0f;';
			for (var prop in items) {
			  if (items.hasOwnProperty(prop)) { 
				options+='\n--OPT-'+prop+':'+items[prop]+';';
			  }
			}
			options+='\n}\n\n body{'
			+'background-color:var(--OPT-favoriteColor);\n'
			+'color:var(--OPT-textColor);}';
			
			style.appendChild(document.createTextNode(options));
			(document.head || document.getElementsByTagName('head')[0]).appendChild(style);
			
			document.title = "New tab Console";
	 });
	
	chrome.storage.local.get(['consoleSave'], function(result) {
		if (result.consoleSave === undefined) result.consoleSave = '';
		colorSave.setData(result.consoleSave);
		setTimeout(function(){
			if (typeof OPT_Apparent == "boolean" && !OPT_Apparent){ 
				AddContent(result.consoleSave);
			}else if(typeof OPT_Apparent != "Object"){
				document.addEventListener("click",function(){AddContent(result.consoleSave);},{once: true});
			}else{
				document.getElementById("typingConsole").innerHTML = "Internet Sync failed"; //&nbsp;
				document.addEventListener("click",function(){AddContent(result.consoleSave);},{once: true});
			}
		},50);
	});     
});


function AddContent(consoleSave){
	
	
	var cool = colorSave.color(OPTIONS.colorSatu); //in order to get the sounds inits
	if(OPTIONS.Dynamic) document.body.style.backgroundColor = cool;
	if(OPTIONS.soundVolume) colorSave.sound(parseFloat(OPTIONS.soundVolume));
	
	myConsole.innerHTML= (consoleSave && consoleSave.length? consoleSave : '■' );
	myConsole.initHiddenChar();
	myConsole.caretblink=true;
	
}