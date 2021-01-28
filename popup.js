chrome.tabs.getAllInWindow(null, function(tabs){
    for (var i = 0; i < tabs.length; i++) {  
        var key = tabs[i].id;
        var value = 50;

        createSlide(tabs[i], value);
        getData(key);
    }

    // Get all the sliders in the html
    var collection = document.getElementsByTagName("input");
    // Loop through each item 
    for(let item of collection){
        item.addEventListener("change", function(event){
            // Get new value
            key = event.target.id;
            value = event.target.value;
            chrome.storage.local.set({[key]: value}, function() {
                console.log(key + " changed to "+ value.toString());
            });
        });
    }
});

function getData(key) {
    let item = document.getElementById(key.toString());

    chrome.storage.local.get([key.toString()], function(result) {
        if (typeof result[key] !== 'undefined') {
            // Get existing value and set its slider value
            item.value = result[key];
        }
        else{
            // Tab id doesnt exist in storage. Init value
            var code = `
            var elements = document.getElementsByTagName("video");
            if(elements.length != 0){
              var element = elements[0]; 
            }
            else{
              elements = document.getElementsByTagName("audio");
              if(elements.length != 0){
                  var element = elements[0]; 
              }
            }
            element.volume;
            `;

            chrome.tabs.executeScript(key, { code }, function(result){
                // If tab contains an audio source get its volume level
                // And init a key - value for it in local storage
                var initialValue = 50;

                if(result != null){
                    // result return an array
                    // Volume value is a floating value between 0 and 1
                    initialValue = result[0] * 100;
                    // Set slider value
                    item.value = initialValue;
                }
                // Init key - value in local storage
                chrome.storage.sync.set({[key]: initialValue}, function() {});
            });
        }
    });
}

function createSlide(tab, volume){
    var target = document.querySelector('#tabs');
    var div = document.createElement('div');
    div.innerHTML = 
    `
    <div class="card">
        <div class="container">
            <img src="${tab.favIconUrl}">
            <div class="tab-name">
                <span>${tab.title}</span>
            </div>
        </div>
        <div class="slider">
            <input id="${tab.id}" type="range" min="0" max="100" value="${volume}">
        </div>
    </div>
    `;
    target.parentNode.insertBefore( div, target.nextSibling );
}