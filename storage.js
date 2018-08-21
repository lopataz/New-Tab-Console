var OPT_Apparent= new Boolean;

document.addEventListener("DOMContentLoaded", function(e){
	
	chrome.storage.sync.get({
		favoriteColor: '#000000',
		textColor: '#FFF',
		apparentConsole : true
		
	  }, function(items) {
		  
			OPT_Apparent = items.apparentConsole;
			
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
			
	  
	 });
	
	chrome.storage.local.get(['consoleSave'], function(result) {
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
	if(consoleSave && consoleSave.length){ 
		document.getElementById("typingConsole").innerHTML = consoleSave+"&#9632;";
	}else{
		document.getElementById("typingConsole").innerHTML="&#9632;";
	}
}