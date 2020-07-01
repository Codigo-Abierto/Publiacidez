/*
 * This file is part of Publiacidez Extension Project,
 *
 * Publiacidez Extension is free software; you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License version 3 as published by the Free Software Foundation.
 *
 * Publiacidez extension is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Publiacidez.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict'

const TIEMPO_MIN_TRAS_CARGA = 150; //ms
const TIEMPO_MAX_TRAS_CARGA = 1150; 
const MULTIPLICADOR = 16;
let tiempo_tras_carga = TIEMPO_MIN_TRAS_CARGA;
let tiempo_ultima_ocultacion;
let timeout_id;
var encontrado;
let codigo_ocultacion = 'display: none !important;'; //default


console.log("Inicio content-script para:", window.location.hostname);

// 
chrome.runtime.sendMessage({msg: "buscar", txt: window.location.hostname}, function(respuesta) { //callback:    
    if (respuesta.dominio) { 
        encontrado = respuesta;        
    }   
});


document.documentElement.style.visibility = 'hidden'; 
//
document.addEventListener('DOMContentLoaded', function() {     
    if (encontrado) {
        if ((encontrado.noscript)&&(encontrado.noscript.length > 0)) { 
            //eliminacion/modificacion de scripts inline seleccionados:
            let scripts = document.querySelectorAll('script'); 
            for (let i = 0; i < scripts.length; i++) {
                let bMatch_script = false;
                for (var ns = 0; ns < encontrado.noscript.length; ns++) {
                    if ((scripts[i].textContent)&&(scripts[i].textContent.indexOf(encontrado.noscript[ns].text) >= 0)) {                         
                        bMatch_script = true;                        
                        break;
                    }      
                }
                if ((!bMatch_script)||(bMatch_script && encontrado.noscript[ns].buscar)) { 
                    let new_script = document.createElement("script"); 
                    let atributos = scripts[i].getAttributeNames();                                        
                    for (let a = 0; a < atributos.length; a++) {          
                        new_script.setAttribute(atributos[a], scripts[i].getAttribute(atributos[a]));    
                    }                                        
                    new_script.nonce = encontrado.nonce;
                    new_script.innerHTML = (bMatch_script && encontrado.noscript[ns].buscar && encontrado.noscript[ns].reemplazar) ? scripts[i].textContent.replace(encontrado.noscript[ns].buscar, encontrado.noscript[ns].reemplazar) : scripts[i].textContent;		
                    if (scripts[i].parentNode.nodeName === "HEAD") {
                        document.head.appendChild(new_script);
                    } else {
                        document.body.appendChild(new_script);  
                    }
                }
            }            
        }
        //
        //inyeccion de nuevos scripts:
        if ((encontrado.scripts)&&(encontrado.scripts.length > 0)) {              
            for (let i = 0; i < encontrado.scripts.length; i++) {
                let new_script = document.createElement("script");
                new_script.type = "text/javascript";
                new_script.async = false; 
                if (encontrado.nonce) new_script.nonce = encontrado.nonce;
                if (encontrado.scripts[i].defer != undefined) new_script.defer = encontrado.scripts[i].defer;
                new_script.innerHTML = encontrado.scripts[i].codigo;
                if (encontrado.scripts[i].head) {
                    document.head.appendChild(new_script);
                } else {
                    document.body.appendChild(new_script);
                }                                                         
            }            
        } 
        //  
        if (encontrado.omitir_default_ocultar) codigo_ocultacion = encontrado.omitir_default_ocultar;
        // ocultaciones Cosmeticos CSS:
        if ((encontrado.ocultar)&&(encontrado.ocultar.length > 0)) {            
            ocultarHuecosPubliacidez(encontrado.ocultar);            
            if ((encontrado.dinamico)||(encontrado.ocultar.find(e=>e.dinamico))) {                                 
                let lista_dinamica = encontrado.dinamico ? encontrado.ocultar : encontrado.ocultar.filter(e=>e.dinamico);                              
                const targetNode = document.body;
                const config = { attributes: false, childList: true, subtree: true }; 
                const callback = function(mutationsList, observer) { 
                    clearTimeout(timeout_id);
                    timeout_id = setTimeout(ocultarHuecosPubliacidez, tiempo_tras_carga, lista_dinamica);
                };
                const observer = new MutationObserver(callback);
                observer.observe(targetNode, config);                
            }
        }
    }
    //
    document.documentElement.style.visibility = ''; 
});


//
function ocultarHuecosPubliacidez(lista_elementos) {               
    let t_inicial = performance.now();                
    lista_elementos.forEach(function(element) {     
        if (typeof(element) === "string") { 
            let coincidencias = document.querySelectorAll(element);
            coincidencias.forEach(publi => publi.setAttribute('style', codigo_ocultacion));            
        } else { 
            if ((!element.path)||(element.path && window.location.pathname.match(RegExp(element.path)))) {
                let coincidencias = Array.from(document.querySelectorAll(element.sel));
                if (element.resel) {
                    let coincidencias_tmp = [];
                    for (let i=0; i < coincidencias.length; i++) {
                        let reseleccion = coincidencias[i].querySelectorAll(element.resel); 
                        if (reseleccion) {
                            let union_textContents = "";
                            for (let j=0; j < reseleccion.length; j++) {
                                union_textContents += reseleccion[j].textContent;
                            }
                            if ((element.text)&&(union_textContents.match(RegExp(element.text)))) {
                                coincidencias_tmp.push(coincidencias[i]);
                            }
                        }                        
                    }                    
                    coincidencias = coincidencias_tmp;
                } else {
                    if (element.text) coincidencias = coincidencias.filter(el => el.textContent.match(RegExp(element.text))); 
                }                
                coincidencias.forEach(function (publi, index, array) {
                    if (element.extend) { 
                        let ascendiente = publi.closest(element.extend);
                        if (ascendiente) publi = ascendiente;
                    }                
                    if (!element.omitir_default) publi.setAttribute('style', codigo_ocultacion); 
                    if (element.set) {
                        for (let k in element.set) {
                            publi.setAttribute(k, element.set[k]);                          
                        }
                    }
                });
            }
        }
    });
    tiempo_ultima_ocultacion = performance.now() - t_inicial;
    tiempo_tras_carga = Math.min(Math.max(TIEMPO_MIN_TRAS_CARGA, tiempo_ultima_ocultacion*MULTIPLICADOR), TIEMPO_MAX_TRAS_CARGA);    
    //console.log("tiempo ocultar:", tiempo_ultima_ocultacion, "ms\n", "tiempo tras carga:", tiempo_tras_carga);        
}


//
if (IS_ANDROID) {
    const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
    // Page Visibility API: (forzamos el estado visible del document en Android, para que no Pause al apagar pantalla) 
    if (IS_MOBILE_YOUTUBE) {
        Object.defineProperties(document.wrappedJSObject, { 'hidden': {value: false}, 'visibilityState': {value: 'visible'} });
    } 
}