
window.addEventListener('DOMContentLoaded', (event) => {               
    let bkg = chrome.extension.getBackgroundPage();
    let manifest = chrome.runtime.getManifest();
    let cabecera = document.getElementById("titulo");
    cabecera.innerHTML = "<b>" + manifest.name + "</b>   <i>v" + manifest.version + "</i>"
    
    function refrescarMenus(){
        document.getElementById("toggle-extension").innerHTML = (bkg.configuracion.bloqueador ? "Desactivar bloqueador" : "Activar de nuevo el bloqueador!");
        document.getElementById("toggle-javascript").innerHTML = (bkg.configuracion.javascript ? "Desactivar JavaScript global" : "Habilitar de nuevo el JavaScript!");
        bkg.actualizarEstadoIcono();
    }

    refrescarMenus();

    document.getElementById("toggle-extension").addEventListener("click", function(){                        
        if (bkg.configuracion){
            if (bkg.configuracion.bloqueador) {                
                document.getElementById("confirmacion-habilitar-extension").classList.toggle("ocultar");  
            } else {
                bkg.activarBloqueadorPubliacidez();
                refrescarTabs({active: true});                        
                refrescarMenus();
            }            
        }      
    });            
    document.getElementById("toggle-javascript").addEventListener("click", function(){                        
        if (bkg.configuracion){
            if (bkg.configuracion.javascript) {                
                document.getElementById("confirmacion-desactivar-javascript").classList.toggle("ocultar");    
            } else {
                bkg.enableJavaScript();
                refrescarTabs();                         
                refrescarMenus();
            }            
        }        
    });    
    document.getElementById("boton-aceptar-extension").addEventListener("click", function() { 
        bkg.desactivarBloqueadorPubliacidez();      
        document.getElementById("confirmacion-habilitar-extension").classList.toggle("ocultar"); 
        refrescarTabs();                         
        refrescarMenus();   
    });  
    document.getElementById("boton-cancelar-extension").addEventListener("click", function() {    
        document.getElementById("confirmacion-habilitar-extension").classList.toggle("ocultar");    
    });  
    document.getElementById("boton-aceptar-javascript").addEventListener("click", function() {   
        bkg.disableJavaScript(); 
        document.getElementById("confirmacion-desactivar-javascript").classList.toggle("ocultar");    
        refrescarTabs();                         
        refrescarMenus();
    });
    document.getElementById("boton-cancelar-javascript").addEventListener("click", function() {    
        document.getElementById("confirmacion-desactivar-javascript").classList.toggle("ocultar");    
    });                
}); 