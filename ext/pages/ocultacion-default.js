const CODIGO_OCULTACION_DEFAULT = 'display: none !important;';
const CODIGO_OCULTACION_MARCAR = 'background-color: #FF00FF !important;\nborder: solid 1px #39FF14 !important;\nbox-shadow:0 0 5px #FF00FF !important;'; 

window.addEventListener('DOMContentLoaded', (event) => {       
    let bkg = chrome.extension.getBackgroundPage();    
    let config = JSON.parse(localStorage.getItem("configuracion"));
    let text_area = document.getElementById("textarea-codigo");
    let radio_button = document.getElementsByName('codigo-ocultar');
    for (let i=0; i < radio_button.length; i++) {
        radio_button[i].onclick = function() {
            switch (this.value) {
                case 'default':
                    text_area.value = CODIGO_OCULTACION_DEFAULT;
                    text_area.readOnly = true;
                    break;
                case 'resaltar':
                    text_area.value = CODIGO_OCULTACION_MARCAR;
                    text_area.readOnly = true;
                    break;
                case 'custom':
                    text_area.value = "";
                    text_area.readOnly = false;
                    break;
            }
        };
    }
    //
    document.getElementById("boton-aplicar").addEventListener("click", function() {             
        let valor_radio_button = document.querySelector('input[name="codigo-ocultar"]:checked').value;
        let extra_info = "";
        let no_aplicar = false;
        switch (valor_radio_button) {
            case 'default':
                config.omitir_default_ocultar = false;
                break;
            case 'resaltar':
                config.omitir_default_ocultar = CODIGO_OCULTACION_MARCAR;
                break;
            default: //'custom' code
                if (text_area.value.trim()) { 
                    config.omitir_default_ocultar = text_area.value.trim();
                    extra_info = "Verifica el correcto funcionamiento de la extensión tras la aplicación del código personalizado!"
                } else {
                    no_aplicar = true;
                    mostrarDesvanecerElementById("error-reglas", "No se especificó ningún código CSS");
                }
                break;
        }        
        if (!no_aplicar) {
            localStorage.setItem("configuracion", JSON.stringify(config));
            bkg.configuracion.omitir_default_ocultar = config.omitir_default_ocultar;
            mostrarDesvanecerElementById("info-reglas", "Cambios aplicados y guardados.<br>" + extra_info);
            bkg.actualizarEstadoIcono();
        }
    }); 
    // 
    if (config.omitir_default_ocultar) {
        if (config.omitir_default_ocultar === CODIGO_OCULTACION_MARCAR) {
            radio_button[1].click();
        } else { //'custom'
            text_area.value = config.omitir_default_ocultar;
        }
    } else {
        radio_button[0].click();
    }
    //
    mostrarDesvanecerElementById("info-reglas", 
                                `Puedes modificar el código de estilo CSS a aplicar por defecto en los elementos seleccionados por las reglas de "<b>ocultar</b>".<br>
                                <br>                                
                                Es una función que puede resultar útil cuando estás creando tus propias reglas para un sitio web.<br>
                                Para poder visualizar mejor sobre que elementos se aplicarán las reglas definidas.`,
                                12000);
}); 