var url = window.location.href;
var swLocation = '/20213-PWA-E-TimesUTEZ/sw.js';

if(navigator.serviceWorker){
    if(url.includes('localhost')){
        swLocation='/sw.js'
    }
    navigator.serviceWorker.register(swLocation);
}