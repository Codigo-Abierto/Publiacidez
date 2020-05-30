(function () {

    const DEBUG = false;
  
    if (DEBUG === false) {
        if ( typeof(window.console) === 'undefined') { window.console = {}; }
        window.console.log = function () {};
    }
    
})();

