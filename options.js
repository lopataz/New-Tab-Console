const dynamicDefault ="#677999";

function save_options() {
  var color = document.getElementById('color').value;  
  var volume = document.getElementById('volume').value;
   var apparent = document.getElementById('apparent').checked;
   var colorSatu = document.getElementById('colorSatu').value;
   var finalColor = document.getElementById('satuExample').style.backgroundColor;
  chrome.storage.sync.set({
    favoriteColor: (color != dynamicDefault ? finalColor : dynamicDefault),
	textColor:(colorSatu > 175? "#FFF" : "#000"),
	apparentConsole : apparent,
	soundVolume : volume,
	colorSatu : colorSatu
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: dynamicDefault,
	apparentConsole:true,
	soundVolume:0,
	colorSatu: "180"
  }, function(items) {
	  console.log(items.soundVolume);
    setSelectedIndex(document.getElementById("color"),items.favoriteColor);
	document.getElementById('apparent').checked = items.apparentConsole;
	document.getElementById('colorSatu').value = items.colorSatu;
	changeExampleSatu(items.colorSatu);
	
	setSelectedIndex(document.getElementById("volume"),items.soundVolume);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
	
	
function setSelectedIndex(s, valsearch){
	for (i = 0; i< s.options.length; i++){ 
		if (s.options[i].value == valsearch)
		{
			s.options[i].selected = true;
			break;
		}
	}
	return;
}


/// RANGE SLIDER AND DOM RELATIVES

document.getElementById('colorSatu').addEventListener("input", function() {
	
	if (document.getElementById('color').value == dynamicDefault && this.value> 200) this.value = 200;
	changeExampleSatu(this.value);
});

document.getElementById('color').addEventListener("change", function() {
	if(document.getElementById('colorSatu').value>200) document.getElementById('colorSatu').value =200;
	changeExampleSatu(document.getElementById('colorSatu').value);
});


function changeExampleSatu(saturation){
	if(document.getElementById('color').value == dynamicDefault){
		
		document.getElementById('satuExample').style.backgroundColor ="#524261"+parseInt(saturation).toString(16);
		document.getElementById('SatuLimit').style.visibility = "visible";
		
	}else if (document.getElementById('color').value == "#000000"){
		
		var r = 255 - parseInt(saturation);
		document.getElementById('satuExample').style.backgroundColor ="rgb("+r+","+r+","+r+")";
		document.getElementById('SatuLimit').style.visibility = "hidden";
	}
}