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

var configuracion, bloquear_urls, dominios_cargados;
let nonce, bloquear_scripts_urls;
iniciarExtension();

//
chrome.runtime.onInstalled.addListener(function(details) {
  console.log("Reseteando lista de filtros y configuración a valores por defecto. Motivo:", details.reason);
  reinicializarExtensionDefaults();
});

function reinicializarExtensionDefaults() {
  //
  guardarListaReglasPorDefecto();
  //valores de configuración por defecto:
  configuracion = {
    bloqueador: true,  //funcionamiento global de la extension: bloqueo de peticiones
    javascript: true,  //habilitar/deshabilitar javascript global    
    omitir_default_ocultar: false, //false para default/string con el codigo de estilo CSS a usar en las reglas de ocultación
    default_bloquear_urls: [
      "*://*.facebook.net/*-tag.js",
      "*://googleads.g.doubleclick.net/*"
    ], 
    log: false,    
  };    
  localStorage.setItem("configuracion", JSON.stringify(configuracion));
  iniciarExtension();
}

function iniciarExtension() {
  //
  if (chrome.webRequest.onBeforeRequest.hasListener(bloquearURLs)) chrome.webRequest.onBeforeRequest.removeListener(bloquearURLs);
  if (chrome.webRequest.onHeadersReceived.hasListener(setHeaderNonce)) chrome.webRequest.onHeadersReceived.removeListener(setHeaderNonce);
  if (chrome.webRequest.onHeadersReceived.hasListener(setHeaderNone)) chrome.webRequest.onHeadersReceived.removeListener(setHeaderNone);   
  //  
  if (localStorage.getItem("configuracion")) {
    configuracion = JSON.parse(localStorage.getItem("configuracion"));
    //
    nonce = [...Array(6)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    bloquear_urls = configuracion.default_bloquear_urls;
    bloquear_scripts_urls = [];
    dominios_cargados = [];
    configuracion = JSON.parse(localStorage.getItem("configuracion"));
    //
    if ((configuracion.bloqueador)&&(bloquear_urls.length > 0)) chrome.webRequest.onBeforeRequest.addListener(bloquearURLs, {urls: bloquear_urls}, ["blocking"]);
    if (configuracion.javascript) enableJavaScript(); else disableJavaScript();
    //
    actualizarEstadoIcono();
  }
}

//
function nombreDominioValido(nombre) {  
  if ((nombre.split('.').length - 1) >= 1) { //Simplificacion
      return true;
  } else {
      return false;
  }
}

function buscarDominioEnLista(domain) {    
  let busqueda = localStorage.getItem(domain);
  if (busqueda) {
    return JSON.parse(busqueda);
  } else {
    return false;
  }
}

// 
// {msg: "", txt: ""} --> msg: "tipo de mensaje", txt: "... contenido extra"
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {  
  switch (message.msg) {
    case "buscar":      
      var nombreHost = message.txt;
      var encontrado = false;
      if (configuracion.bloqueador) {
        do {        
          encontrado = buscarDominioEnLista(nombreHost); 
          if (encontrado){                         
              encontrado.nonce = nonce;
              if (configuracion.omitir_default_ocultar) encontrado.omitir_default_ocultar = configuracion.omitir_default_ocultar;
              if (dominios_cargados.indexOf(nombreHost) < 0) { 
                if (encontrado.bloquear) {
                    bloquear_urls = Array.from(new Set(bloquear_urls.concat(encontrado.bloquear)));
                    //
                    if (chrome.webRequest.onBeforeRequest.hasListener(bloquearURLs)) chrome.webRequest.onBeforeRequest.removeListener(bloquearURLs);                   
                    chrome.webRequest.onBeforeRequest.addListener(bloquearURLs, 
                                                                  {urls: bloquear_urls}, 
                                                                  ["blocking"]); 
                }
                if ((encontrado.noscript)&&(encontrado.noscript.length > 0)) {                  
                  let match_noscript_url = "*://*." + encontrado.dominio + "/*";                
                  bloquear_scripts_urls = Array.from(new Set(bloquear_scripts_urls.concat([match_noscript_url])));                                
                  if (chrome.webRequest.onHeadersReceived.hasListener(setHeaderNonce)) chrome.webRequest.onHeadersReceived.removeListener(setHeaderNonce);                
                  chrome.webRequest.onHeadersReceived.addListener(setHeaderNonce, 
                                                                  {urls: bloquear_scripts_urls, types: ['main_frame', 'sub_frame']}, 
                                                                  ['blocking', 'responseHeaders']);                  
                  chrome.tabs.executeScript(sender.tab.id, {code: 'window.location.reload();'});
                }
                dominios_cargados.push(nombreHost);
                console.log("CARGO:", nombreHost);
              }
          } else {
              nombreHost = nombreHost.substr(nombreHost.indexOf('.') + 1, nombreHost.length)
          }
        } while (!encontrado && nombreDominioValido(nombreHost));      
      }
      if (encontrado) {        
        sendResponse(encontrado); 
      } else {
        sendResponse(false);
      }
      break;   
    //
    case "importar":
      try {
        let listado = JSON.parse(message.txt);
        let flag_iniciar = false;
        for (let i=0; i < listado.length; i++) {
          let datos_dominio = listado[i];          
          if (localStorage.getItem(datos_dominio.dominio)) {
            console.log("El dominio ya existia y será sustituido!");            
            flag_iniciar = true;
            localStorage.setItem(datos_dominio.dominio, JSON.stringify(datos_dominio));
          } else {
            console.log("Nuevo dominio añadido:", datos_dominio.dominio);
            localStorage.setItem(datos_dominio.dominio, JSON.stringify(datos_dominio));
          }
        }
        if (flag_iniciar) iniciarExtension();
        console.log("Importacion datos correcta!");
        sendResponse(true);
      } catch (e) {
        console.log("ERROR AL IMPORTAR:", e);
        sendResponse(false); 
      }                       
      break;
    //
    case 'reinicializar':
      console.log("Borramos almacenamiento local y cargamos defaults de instalación.");
      localStorage.clear();
      reinicializarExtensionDefaults();
      sendResponse(true);
      break;
    //
    case 'reiniciar':
      console.log("Reiniciamos la extension.");
      iniciarExtension();
      sendResponse(true);
      break;
    //
    default:
      console.log('Message no reconocido:', message.msg);
      break;
  }
});

function bloquearURLs(details) {
  console.log("bloqueo:", details.url);
  return {cancel: true };
}

//
function setHeaderNonce(e) {
  var setNonceCSP = {
    name: "Content-Security-Policy",
    value: "script-src 'nonce-" + nonce + "';"	
  };
  e.responseHeaders.push(setNonceCSP);
  return {responseHeaders: e.responseHeaders};
}

function setHeaderNone(e) {
  var setNoneCSP = {
    name: "Content-Security-Policy",
    value: "script-src 'none';"	
  };
  e.responseHeaders.push(setNoneCSP);
  return {responseHeaders: e.responseHeaders};
}

//
function enableJavaScript() {
  if (chrome.webRequest.onHeadersReceived.hasListener(setHeaderNone)) chrome.webRequest.onHeadersReceived.removeListener(setHeaderNone);      
  configuracion.javascript = true;            
  console.log("Javascript habilitado");
  localStorage.setItem("configuracion", JSON.stringify(configuracion));
}

//
function disableJavaScript() {
  if (!chrome.webRequest.onHeadersReceived.hasListener(setHeaderNone)) {
    chrome.webRequest.onHeadersReceived.addListener(setHeaderNone, 
      {urls: ["*://*/*"], types: ['main_frame', 'sub_frame']}, 
      ['blocking', 'responseHeaders']);
  }     
  configuracion.javascript = false;
  console.log("Javascript deshabilitado");
  localStorage.setItem("configuracion", JSON.stringify(configuracion));
}

function activarBloqueadorPubliacidez() {
  if (!configuracion.bloqueador) {
    configuracion.bloqueador = true;
    localStorage.setItem("configuracion", JSON.stringify(configuracion));
    iniciarExtension();
  }
  console.log("Bloqueador ON");
}

function desactivarBloqueadorPubliacidez() {
  if (configuracion.bloqueador) {
    configuracion.bloqueador = false;
    localStorage.setItem("configuracion", JSON.stringify(configuracion));
    iniciarExtension();    
  }
  console.log("Bloqueador OFF");
}

function actualizarEstadoIcono() {
  let str_nombre = "Publiacidez";
  let str_off = "";
  let str_exc = "";
  if (!configuracion.bloqueador) {    
    str_off = "_off";
    str_nombre += "\nBloqueador OFF! ";
  }
  if (!configuracion.javascript) {
    str_exc = "_exc";
    str_nombre += "\nJavaScript OFF! ";
  }  
  if (configuracion.omitir_default_ocultar) {
    str_exc = "_exc";
    str_nombre += "\nOcultación NO default! ";
  }
  chrome.browserAction.setIcon({
    path : {
      "16": "icons/icon16" + str_off + str_exc + ".png",
      "48": "icons/icon48" + str_off + str_exc + ".png"
    }
  });
  chrome.browserAction.setTitle({title: str_nombre});
}
