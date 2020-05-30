window.addEventListener('DOMContentLoaded', (event) => {                   
    let bkg = chrome.extension.getBackgroundPage();
    let tabla_dominos = document.getElementById("dominios-cargados");

    if (bkg.dominios_cargados) {
        let dominios_cargados_ord = bkg.dominios_cargados.sort();

        for (let i=0; i < dominios_cargados_ord.length; i++) {            
            tabla_dominos.innerHTML += "<tr class=\"regla-tabla\"><td>" + dominios_cargados_ord[i] + "</td><td title=\"ver reglas\">+</td></tr>";
        }
    }

    //
    mostrarDesvanecerElementById("info-reglas", "Se incluyen tanto los dominios accedidos directamente como indirectamente a través de <i>frames</i>.");
    //
    onTableRowClick("dominios-cargados", function (row){
        let dominio = localStorage.getItem(row.getElementsByTagName("td")[0].innerHTML);                                
        if (dominio) {            
            let textArea = document.getElementById("textarea-reglas");
            textArea.value = JSON.stringify(JSON.parse(dominio), null, 2);
            textArea.classList.remove("ocultar");
            document.getElementsByClassName("espacio-tabla")[0].style.height = "200px";
            let filas = document.getElementsByTagName("tr");
            for (let f=0; f < filas.length; f++) {
                filas[f].classList.remove("seleccionada");
            }                
            row.classList.toggle("seleccionada");
        }                
    });    
}); 





 
