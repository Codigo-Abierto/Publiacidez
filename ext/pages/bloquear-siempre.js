
window.addEventListener('DOMContentLoaded', (event) => {       
    let bkg = chrome.extension.getBackgroundPage();    

    if (bkg.configuracion.default_bloquear_urls) {
        document.getElementById("textarea-reglas").value = bkg.configuracion.default_bloquear_urls.join("\n");        
    }    
    
    document.getElementById("boton-actualizar-reglas").addEventListener("click", function() {     
        const regex_compactar = /[\r \n]{2,}/g;
        const regex_char_no_validos_url = /[^A-Za-z0-9-\._~:/\?#\[\]@!\$&'\(\)\*\+\,;%=\n]/g; 
        //preprocesamos entrada:
        let text_area = document.getElementById("textarea-reglas");
        //
        text_area.value = text_area.value.replace(regex_compactar, "\n");    
        //
        if (regex_char_no_validos_url.test(text_area.value)) {
            text_area.value = text_area.value.replace(regex_char_no_validos_url, "");  
            mostrarDesvanecerElementById("warning-reglas", 
                                         "<legend>AVISO:</legend>Había caracteres no válidos que han sido eliminados.<br>Verifica de nuevo la coherencia de las reglas!");                                                 
        }        
        //tratamos de importar el resultado
        importarReglasPermanentes(text_area);            
    });                  

    mostrarDesvanecerElementById("info-reglas", 
                                `Se muestran las reglas permanentes actuales, que puedes editar.<br>
                                Una regla (<i><b>Match Pattern</b></i>) por línea.<br>
                                <br>
                                Funcionan como un <i><b>bypass</b></i> del sistema de reglas por dominio característico de esta extensión.
                                Útil para aquellos elementos que desees bloquear <b>siempre</b> mientras navegas.`,
                                20000);
}); 


function importarReglasPermanentes(textarea) {
    let reglas = textarea.value.split("\n");
    let bOK = true;
    let posicion0 = 0, posicion = 0;
    for (var i=0; i < reglas.length; i++) { //validación
        posicion0 = posicion;
        posicion += reglas[i].length;
        if (reglas[i].trim()) {
            if (!validarMatchPattern(reglas[i])) {
                bOK = false;
                break;
            }
        } else {
            reglas.splice(i, 1); //quita salto linea
        }
    }
    if (bOK) {
        //guardamos las nuevas reglas 
        let config = JSON.parse(localStorage.getItem("configuracion"));
        config.default_bloquear_urls = reglas;
        localStorage.setItem("configuracion", JSON.stringify(config));
        //reiniciamos la extension
        chrome.runtime.sendMessage({msg: "reiniciar"}, function(respuesta) { //callback:            
            ocultarElement(document.getElementById("error-reglas"));
            mostrarDesvanecerElementById("info-reglas", 
                                         `Reglas permanentes actualizadas!<br><br>
                                          Se refescarán las pestañas abiertas para aplicar cambios.<br>
                                          Verifica el correcto funcionamiento de la extensión.`); 
            refrescarTabs();                            
        });  
    } else {
        ocultarElement(document.getElementById("info-reglas"));
        mostrarDesvanecerElementById("error-reglas", "<legend>ERROR en línea  " + (i+1).toString() + ":</legend>La regla no es válida!", 10000, 2000);
        textarea.focus();
        textarea.setSelectionRange(posicion0 + 1, posicion + 1);  
    }
}

