
window.addEventListener('DOMContentLoaded', (event) => {                     
    //
    document.getElementById("reinicializar-extension").addEventListener("click", function(){    
        document.getElementById("confirmacion-reinicializar-extension").classList.toggle("ocultar");         
    });  
    //
    document.getElementById("reiniciar-extension").addEventListener("click", function(){    
        document.getElementById("confirmacion-reiniciar-extension").classList.toggle("ocultar");         
    });           
    //
    document.getElementById("boton-aceptar-reinicializar").addEventListener("click", function(){    
        chrome.runtime.sendMessage({msg: "reinicializar"}, function(respuesta){             
            mostrarDesvanecerElementById("field-info", "La extensión ha sido reinicializa a los valores de instalación por defecto.");
            document.getElementById("confirmacion-reinicializar-extension").classList.toggle("ocultar");                         
            refrescarTabs();                           
        });        
    });            
    //
    document.getElementById("boton-cancelar-reinicializar").addEventListener("click", function(){    
        document.getElementById("confirmacion-reinicializar-extension").classList.toggle("ocultar");    
    });        
    //
    document.getElementById("boton-aceptar-reiniciar").addEventListener("click", function(){    
        chrome.runtime.sendMessage({msg: "reiniciar"}, function(respuesta){             
            mostrarDesvanecerElementById("field-info", "La extensión ha sido reiniciada.");
            document.getElementById("confirmacion-reiniciar-extension").classList.toggle("ocultar");    
            refrescarTabs();                                 
        });        
    });            
    //
    document.getElementById("boton-cancelar-reiniciar").addEventListener("click", function(){    
        document.getElementById("confirmacion-reiniciar-extension").classList.toggle("ocultar");    
    });               
}); 

