var OPT_Apparent= new Boolean;

document.addEventListener("DOMContentLoaded", function(e){
	
	chrome.storage.sync.get({
		favoriteColor: '000000',
		apparentConsole : true
	  }, function(items) {
		  OPT_Apparent = items.apparentConsole;
		document.body.style.background = "#"+items.favoriteColor;
		if(items.favoriteColor == "000000") document.getElementById("typingConsole").style.color = "#fff";
	 });
	
	chrome.storage.local.get(['consoleSave'], function(result) {
		setTimeout(function(){
			if (typeof OPT_Apparent == "boolean" && !OPT_Apparent){ 
				AddContent(result.consoleSave);
			}else if(typeof OPT_Apparent != "Object"){
				
				document.addEventListener("click",function(){AddContent(result.consoleSave);},{once: true});
			}else{
				document.getElementById("typingConsole").innerHTML = "."; //&nbsp;
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