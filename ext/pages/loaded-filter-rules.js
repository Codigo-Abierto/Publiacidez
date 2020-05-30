window.addEventListener('DOMContentLoaded', (event) => {                   
    let bkg = chrome.extension.getBackgroundPage();
    let tabla_bloquear_urls = document.getElementById("bloquear-urls");
    let dominios_cargados_ord = bkg.dominios_cargados.sort();
    let lista_cargada = [];
    for (let d=0; d < dominios_cargados_ord.length; d++) {
        lista_cargada.push(JSON.parse(localStorage.getItem(dominios_cargados_ord[d])));
    }    
    if (bkg.bloquear_urls) {
        for (let i=0; i < bkg.bloquear_urls.length; i++) {
            let titulo = "";
            for (let d=0; d < lista_cargada.length; d++){
                if ((lista_cargada[d].bloquear)&&(lista_cargada[d].bloquear.indexOf(bkg.bloquear_urls[i]) >= 0)) titulo += lista_cargada[d].dominio + "\n";
            }
            tabla_bloquear_urls.innerHTML += "<tr class=\"regla-tabla\"><td>" + bkg.bloquear_urls[i] + "</td><td title=\"" + titulo + "\">+</td></tr>";
        }
    }
    //
    mostrarDesvanecerElementById("info-reglas", "Se muestran las reglas de bloqueo de URLs cargadas en la sesión actual,<br> (las permanentes más las de los dominios accedidos).");
}); 