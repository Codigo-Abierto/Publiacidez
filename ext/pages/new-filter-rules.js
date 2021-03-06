
window.addEventListener('DOMContentLoaded', (event) => {          
    document.getElementById("boton-cargar-reglas").addEventListener("click", function(){                        
        let textarea_reglas = document.getElementById("textarea-reglas");
        if (importarReglas(textarea_reglas.value)) {
            textarea_reglas.value = JSON.stringify(JSON.parse(textarea_reglas.value), null, 2); 
        }            
    });    
    mostrarDesvanecerElementById("info-reglas", 
                                 `Incorporar nuevas <i>reglas por dominio</i> en formato <b>JSON</b>.<br>
                                  Si ya existiesen reglas para alguno de los dominios, las anteriores serán reemplazadas`,
                                  12000);              
}); 


//
function importarReglas(texto) {    
    let area_reglas = document.getElementById("textarea-reglas");
    //se parsea:
    try {
        var supuestas_reglas = JSON.parse(area_reglas.value);
    } catch (e) {  
        ocultarElement(document.getElementById("info-reglas"));      
        mostrarDesvanecerElementById("error-reglas", "<legend>ERROR:</legend>" + e.toString());               
        if (e.toString().indexOf("at position ") >= 0) {            
            let posicion = parseInt(e.toString().substring(e.toString().indexOf("at position ")+12, e.toString().indexOf("at position ").length));
            area_reglas.focus();
            area_reglas.setSelectionRange(posicion, posicion+1);  
        }
        return false;
    }
    //analizamos el objeto javascript en sí:    
    if (!Array.isArray(supuestas_reglas)) supuestas_reglas = [supuestas_reglas]; 
    let bOK = true;
    let error_info = "";
    for (let r=0; r < supuestas_reglas.length; r++) { //validar regla:
        if (!supuestas_reglas[r].dominio || !validarNombreDominio(supuestas_reglas[r].dominio)) {
            bOK = false; //dominio es el unico campo obligatorio
            error_info += "La propiedad obligatoria 'dominio' fue omitida o es incorrecta.<br>";
        } else {
            supuestas_reglas[r].dominio = supuestas_reglas[r].dominio.toLowerCase(); 
        }
        for (let key in supuestas_reglas[r]) {
            if (!listaPropiedadesReglaValidas().find(k => k === key)) {
                bOK = false;   
                error_info += "Propiedad '<b>" + key + "</b>' no reconocida.<br>";
                break;
            } else {
                let valor = supuestas_reglas[r][key];
                switch (key) { //validaciones especificas según propiedad:
                    case 'dinamico':
                        if (typeof valor !== 'boolean') {
                            bOK = false;
                            error_info += "La propiedad 'dinamico' debe ser <b>booleana</b> (<i>true/false</i>).<br>";                            
                        }
                        break;
                    case 'bloquear':
                        if (Array.isArray(valor)) {
                            let match_patterns = valor;
                            for (let i=0; i < match_patterns.length; i++) {
                                if ((typeof match_patterns[i] !== 'string')||(!validarMatchPattern(match_patterns[i]))) {
                                    bOK = false;
                                    error_info += "Regla de 'bloquear' incorrecta (<i>match pattern</i> erróneo):<br><b>\"" + match_patterns[i] + "\"</b>";
                                    break;
                                }
                            }                                
                        } else {
                            bOK = false;
                            error_info += "La propiedad 'bloquear' debe ser un <b>Array</b>.<br>";                            
                        }
                        break;  
                    case 'ocultar':
                        if (Array.isArray(valor)) {
                            for (let i=0; i < valor.length; i++) {
                                let elemento = valor[i];
                                if (typeof elemento === 'string') {  
                                    if (!validarSelectorCSS(elemento)) {
                                        bOK = false;
                                        error_info += "'" + elemento + "' no es un selector CSS válido.<br>";                                                                
                                    }                                   
                                } else if (typeof elemento === 'object') {
                                    for (let subkey in elemento) {
                                        if (listaPropiedadesReglaValidas(key).find(sk => sk === subkey)) {                                            
                                            let subvalor = elemento[subkey];
                                            switch (subkey) { 
                                                case 'path':
                                                case 'text': 
                                                    if (typeof subvalor !== 'string') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'ocultar' debe ser de tipo <b>'string'</b>.<br>";
                                                    } else {                                                       
                                                        if (!validarExpresionRegular(subvalor)) {
                                                            bOK = false;
                                                            error_info += "'" + subvalor + "' no representa una Expresión Regular válida.<br>";                                                                
                                                        }                                                                                                                                     
                                                    } 
                                                    break;                                                                                               
                                                case 'sel':   
                                                case 'resel':
                                                case 'extend':                                                
                                                    if (typeof subvalor !== 'string') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'ocultar' debe ser de tipo <b>'string'</b>.<br>";
                                                    } else {                                                       
                                                        if (!validarSelectorCSS(subvalor)) {
                                                            bOK = false;
                                                            error_info += "'" + subvalor + "' no es un selector CSS válido.<br>";                                                                
                                                        }                                                                                                                                     
                                                    } 
                                                    break;
                                                case 'dinamico':
                                                case 'omitir_default':
                                                    if (typeof subvalor !== 'boolean') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'ocultar' debe ser de tipo <b>'boolean'</b>.<br>";
                                                    }
                                                    break;
                                                case 'set': 
                                                    if (typeof subvalor !== 'object') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'ocultar' debe ser de tipo <b>'object'</b>.<br>";
                                                    } 
                                                    break;
                                            } 
                                        } else {
                                            bOK = false;   
                                            error_info += "Propiedad '" + subkey + "' no reconocida en 'ocultar'.<br>";
                                            break;
                                        }
                                    }
                                } else {
                                    bOK = false;
                                    error_info += "El Array 'ocultar' solo puede tener elementos <b>'string'</b> u <b>'object'</b>.<br>";                            
                                }
                            }
                        } else {
                            bOK = false;
                            error_info += "La propiedad 'ocultar' debe ser un <b>Array</b>.<br>";                            
                        }                        
                        break;
                    case 'noscript':
                        if (Array.isArray(valor)) {
                            for (let i=0; i < valor.length; i++) {
                                let elemento = valor[i];
                                if (typeof elemento !== 'object') {
                                    bOK = false;
                                    error_info += "El Array 'noscript' solo puede tener elementos <b>'object'</b> {}.<br>";                                                                
                                } else  {
                                    for (let subkey in elemento) {
                                        if (listaPropiedadesReglaValidas(key).find(sk => sk === subkey)) {                                            
                                            let subvalor = elemento[subkey];
                                            switch (subkey) {
                                                case 'text':
                                                case 'buscar':
                                                case 'reemplazar':
                                                    if (typeof subvalor !== 'string') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'noscript' debe ser de tipo <b>'string'</b>.<br>";
                                                    } else {
                                                        if (subvalor.trim() === "") {
                                                            bOK = false;
                                                            error_info += "La propiedad '" + subkey + "' del Array 'noscript' no debe estar vacia.<br>";
                                                        }
                                                    }
                                                    break;                   
                                            }                                            
                                        } else {
                                            bOK = false;   
                                            error_info += "Propiedad '" + subkey + "' no reconocida en 'noscript'.<br>";
                                            break;
                                        }
                                    }
                                }                                 
                            }                  
                        } else {
                            bOK = false;
                            error_info += "La propiedad 'noscript' debe ser un <b>Array</b>.<br>";                            
                        }                        
                        break;
                    case 'scripts':
                        if (Array.isArray(valor)) {
                            for (let i=0; i < valor.length; i++) {
                                let elemento = valor[i];
                                if (typeof elemento !== 'object') {
                                    bOK = false;
                                    error_info += "El Array 'scripts' solo puede tener elementos <b>'object'</b> {}.<br>";                                                                
                                } else  {
                                    for (let subkey in elemento) {
                                        if (listaPropiedadesReglaValidas(key).find(sk => sk === subkey)) {
                                            let subvalor = elemento[subkey];
                                            switch (subkey) {
                                                case 'codigo':
                                                    if (typeof subvalor !== 'string') {
                                                        bOK = false;
                                                        error_info += "La propiedad 'codigo' del Array 'scripts' debe ser de tipo <b>'string'</b>.<br>";                                                                
                                                    }
                                                    break;
                                                case 'head':
                                                case 'defer':
                                                    if (typeof subvalor !== 'boolean') {
                                                        bOK = false;
                                                        error_info += "La propiedad '" + subkey + "' del Array 'scripts' debe ser de tipo <b>'boolean'</b>.<br>";
                                                    }
                                                    break;
                                            }                                            
                                        } else {
                                            bOK = false;   
                                            error_info += "Propiedad '" + subkey + "' no reconocida en 'scripts'.<br>";
                                            break;
                                        }
                                    }
                                }                                 
                            }                   
                        } else {
                            bOK = false;
                            error_info += "La propiedad 'scripts' debe ser un <b>Array</b>.<br>";                            
                        }                        
                        break;    
                }    
            }
        }
    }
    //
    if (!bOK) {
        ocultarElement(document.getElementById("info-reglas"));
        mostrarDesvanecerElementById("error-reglas", "<legend>ERROR:</legend>No se pudo hacer la importación!<br>" + error_info, 12000, 2000);
        return false;
    } else {
        chrome.runtime.sendMessage({msg: "importar", txt: JSON.stringify(supuestas_reglas)}, function(respuesta){ //callback:                
            if (respuesta) { 
                ocultarElement(document.getElementById("error-reglas"));
                mostrarDesvanecerElementById("info-reglas", "Importación realizada.<br>Verifica el correcto funcionamiento de la aplicación!");
            }
        });
        return true;
    }   
}

//
function validarSelectorCSS(selector) {
    try {
        document.querySelector(selector);
        return true;
    }
    catch(e) {
        //selector CSS no valido
        console.log(e);        
    }
    return false;
}

function validarExpresionRegular(re_str) {
    try {
        RegExp(re_str);
        return true;
    }
    catch(e) {
        //contruccion Expresion Regular no válida
        console.log(e);        
    }
    return false;
}

//
function listaPropiedadesReglaValidas(propiedad="") {
    let lista = [];
    switch (propiedad) {
        case "": 
            lista = ["dominio", "dinamico", "bloquear", "ocultar", "noscript", "scripts"];
            break; 
        case "ocultar":
            lista = ["path", "sel", "set", "extend", "text", "resel", "dinamico", "omitir_default"];  
            break;
        case "noscript":
            lista = ["text", "buscar", "reemplazar"]; 
            break;            
        case "scripts": 
            lista = ["codigo", "head", "defer"];
            break;
        default:            
            break;
    }
    return lista;
}


