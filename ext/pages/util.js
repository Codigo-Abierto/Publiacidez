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

//
function refrescarTabs(targets_query={}){ 
    chrome.tabs.query(targets_query, function(tabs) { 
        tabs.forEach(function(tab) {
            if ((tab.url)&&(tab.url.indexOf("http") >= 0)){
                chrome.tabs.executeScript(tab.id, {code: "window.location.reload();"}); 
            }                        
        });
    });  
}

//
function mostrarDesvanecerElementById(element_id, text_html, msec_in=8000, msec_out=2000){
    let e = document.getElementById(element_id);
    if (e) {
        if (text_html) e.innerHTML = text_html;    
        mostrarElement(e);
        e.desvanecer_timeout = window.setTimeout(desvanecerElement, msec_in, e, msec_out);    
    }
}

function mostrarElement(e){
    if (e.desvanecer_timeout) window.clearTimeout(e.desvanecer_timeout);
    if (e.ocultar_timeout) window.clearTimeout(e.ocultar_timeout);    
    e.classList.remove("ocultar", "fade-out");
    e.classList.add("fade-in");    
}

function ocultarElement(e, borrar_html){
    e.classList.add("ocultar"); 
    e.classList.remove("fade-in", "fade-out");
    if (borrar_html) e.innerHTML = "";
}

function desvanecerElement(e, msec_out=2000){
    e.classList.add("fade-out");
    e.ocultar_timeout = window.setTimeout(ocultarElement, msec_out, e, true);
}


//
function validarNombreDominio(nombre) {
    return ((typeof nombre === 'string')&&(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(nombre)));
}

//
function validarMatchPattern(pattern) {   
    const schemeSegment = '(\\*|http|https|file|ftp)';
    const hostSegment = '(\\*|(\\*\\.)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])|(\\*\\.)?((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))';
    const pathSegment = '(.*)';
    const matchPatternRegExp = new RegExp(`^${schemeSegment}://${hostSegment}/${pathSegment}$`);    

    let match = matchPatternRegExp.test(pattern);

    return match;
}

//
function copyStringToClipboard(str) {
    let tmpTextArea = document.createElement("textarea"); 
    tmpTextArea.textContent = str;     
    document.body.appendChild(tmpTextArea);
    tmpTextArea.select();  
    document.execCommand('copy'); 
    tmpTextArea.blur(); 
    document.body.removeChild(tmpTextArea); 
}

//
function onTableRowClick(tableId, callback) {
    let table = document.getElementById(tableId);
    let rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function(row) { return function () { callback(row); }; }(table.rows[i]);
    }
}

function onTableRowDoubleClick(tableId, callback) {
    let table = document.getElementById(tableId);
    let rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        table.rows[i].ondblclick = function(row) { return function () { callback(row); }; }(table.rows[i]);
    }
}