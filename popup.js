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
    chrome.storage.local.get([key.toString()], function(result) {
        if (typeof result[key] !== 'undefined') {
            // Get existing value
            let item = document.getElementById(key.toString());
            item.value = result[key];
        }
        else{
            // Tab id doesnt exist in storage. Init value
            chrome.storage.sync.set({[key]: 50}, function() {});
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
            <input id="${tab.id}" type="range" min="1" max="100" value="${volume}">
        </div>
    </div>
    `;
    target.parentNode.insertBefore( div, target.nextSibling );
}