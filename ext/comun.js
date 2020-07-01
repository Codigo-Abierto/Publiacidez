(function () {

    const DEBUG = false; 
  
    if (DEBUG === false) {
        if ( typeof(window.console) === 'undefined') { window.console = {}; }
        window.console.log = function () {};
    }
    
})();

const IS_ANDROID = window.navigator.userAgent.toLowerCase().indexOf('android') >= 0; //evitar setIcon, aumentar font-size

if (IS_ANDROID) {
    document.documentElement.style.setProperty('--base-texto', '38px'); //variable CSS
}
