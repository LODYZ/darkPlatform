//Script che viene eseguito in ambiente isolato all'avvio. Lo scopo è quello di usarlo come appoggio per salvare informazioni nel dominio per worldContentScript

/*
*Recupero le informazioni relative alle macro abilitate dall utente e le salvo nel localStorage della pagina
*/
if(document.URL.includes('main_designer.jsp')){
    chrome.storage.sync.get(['aceBeautifier'], function(result) {
        if(result && result.aceBeautifier!=null){
            localStorage.darkPlatformVariables=JSON.stringify(result);
            if(result.aceBeautifier){
                //Dato che sappiamo che l'utente vuole usare la macro
                //carichiamo subito lo script
                injectCode(chrome.runtime.getURL('modules/jwerty.js'));
                injectCode(chrome.runtime.getURL('modules/beautify.js'));
            }
        }
    });
}


/**
 * Metodi utili per iniettare degli script
 */
const nullthrows = (v) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function injectCode(src) {
    const script = document.createElement('script');
    // This is why it works!
    script.src = src;
    script.onload = function() {
        console.log("script injected");
        this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}