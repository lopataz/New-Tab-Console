

function save_options() {
  var color = document.getElementById('color').value;
   var apparent = document.getElementById('apparent').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
	apparentConsole : apparent
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
    favoriteColor: '000000',
	apparentConsole:true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
	document.getElementById('apparent').checked = items.apparentConsole;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);