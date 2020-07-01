window.addEventListener('DOMContentLoaded', (event) => {                   
    let tabla_dominios = document.getElementById("reglas-dominio");
    let lista_reglas = [];
    //
    for (let k in localStorage) {
        if (k.indexOf('.') > 0) {
            let d = localStorage[k];
            let parsed = JSON.parse(d);        
            if ((parsed.dominio)&&(validarNombreDominio(parsed.dominio))) { 
                if (d.indexOf("\"dinamico\":true") >= 0) parsed.check_dinamico = true;
                lista_reglas.push(parsed);            
            }    
        }
     }
     lista_reglas = lista_reglas.sort((a, b) => (a.dominio < b.dominio) ? -1 : (a.dominio > b.dominio) ? 1 : 0);
     //
     for (let i=0; i < lista_reglas.length; i++) {
        tabla_dominios.innerHTML += "<tr class=\"regla-tabla\"><td title='" + lista_reglas[i].dominio + "'>" + lista_reglas[i].dominio + "</td>" + 
                                    htmlColumna("bloquear", lista_reglas[i].bloquear) +                                 
                                    htmlColumna("ocultar", lista_reglas[i].ocultar) + 
                                    "<td class=\"centrar\">" + (lista_reglas[i].check_dinamico ? "X" : " ") + "</td>" +
                                    htmlColumna("noscript", lista_reglas[i].noscript) + 
                                    htmlColumna("scripts", lista_reglas[i].scripts) + "</tr>";
     }
     //
     document.getElementById('search').addEventListener('keyup', filtrarBusqueda);
     //
     if (!IS_ANDROID) mostrarDesvanecerElementById("info-reglas", "Haz doble click sobre una fila para copiar los filtros del dominio al portapapeles.");            
     //
     document.getElementById("search").focus();
     //
     onTableRowDoubleClick("reglas-dominio", function (row){
        let nombre_dominio = row.getElementsByTagName("td")[0].innerHTML;
        let dominio = localStorage.getItem(nombre_dominio);            
        
        if (dominio) {            
            copyStringToClipboard(JSON.stringify(JSON.parse(dominio), null, 2));
            mostrarDesvanecerElementById("info-reglas", "Las Reglas de \"" + nombre_dominio + "\" se han copiado al PortaPapeles." );
            let filas = document.getElementsByTagName("tr");
            for (let f=0; f < filas.length; f++) {
                filas[f].classList.remove("seleccionada");
            }                
            row.classList.toggle("seleccionada");
        }                
    });
}); 

function htmlColumna(campo_str, objeto) {
    let check = " ";
    let title = "";
    if (objeto) {
        check = "X";        
        title = campo_str + ": " + JSON.stringify(objeto, null, 2).replace(/'/g, "&apos;");
    }
    return "<td class=\"centrar\" title='" + title +  "' >" + check + "</td>";
}

function filtrarBusqueda() {
    let filas = document.getElementById("reglas-dominio").getElementsByTagName('tr');
    let col_buscar = parseInt(document.getElementById("buscar-en").value);
    let texto_busqueda = this.value; 
        
    for (let i = 0; i < filas.length; i++) {                        
        let col = filas[i].getElementsByTagName('td')[col_buscar];          
        if (col) {
            if (col.title.toLowerCase().indexOf(texto_busqueda.toLowerCase()) >= 0) { //innerHTML
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }                        
    }
  }

