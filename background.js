chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      var tabId = Number(key);
        
      // Volume value between 0 - 1
      var newVolumeAsFloat = parseFloat(storageChange.newValue / 100.0);

      // Script given below checks for video or audio elements within 
      // the document. If a element exists we change it's volume value
      var code = `var elements = document.getElementsByTagName("video");
                  if(elements.length != 0){
                    Array.from(elements).forEach(element => element.volume = ${newVolumeAsFloat});
                  }
                  else{
                    elements = document.getElementsByTagName("audio");
                    Array.from(elements).forEach(element => element.volume = ${newVolumeAsFloat});
                }`;

      chrome.tabs.executeScript(tabId, { code });

      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
});