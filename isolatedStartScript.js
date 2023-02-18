//Script che viene eseguito in ambiente isolato all'avvio. Lo scopo è quello di usarlo come appoggio per salvare informazioni nel dominio per worldContentScript

/*
*Recupero le informazioni relative alle macro abilitate dall utente e le salvo nel localStorage della pagina
*/
if(document.URL.includes('main_designer.jsp')){
    chrome.storage.sync.get(['aceBeautifier'], function(result) {
        if(result && result.aceBeautifier){
            localStorage.darkPlatformVariables=JSON.stringify(result);
        }
    });
}