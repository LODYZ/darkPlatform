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
                injectCode(chrome.runtime.getURL('worldContentScript.js'));

                //TODO
                //  Con chrome > 111
                //   togliere worldContentScript da qui. 
                //   Modificare manifest. rimuovendo lo script dalle risorse accessibili
                //   aggiungere lo script come content script come segue 
                //   		, {
                //         "world": "MAIN",
                //         "js": ["worldContentScript.js"],
                //         "matches": ["*://*/*/*/main_designer*"]
                //     }
                //Se non funziona più la possibilità di inject per i primi due script fare la stessa cosa per loro
                //Sfortunatamente questo implica iniettare sempre il codice  anche se l utente non ha abilitato la macro

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
        //this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}



/**
 * Gestione stato allineamento azioni GAE
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let updateGaeStatusSync=function(){
        let validDetails=[];
        document.getElementsByName('pk.actionId').forEach(el => el.value==request.actionId ? validDetails.push(el) : null);
        
        //Verifico se l'azione che è stata salvata è di tipo GAE o meno
        if(validDetails.length>0 && validDetails[0].parentElement.querySelector('[name="actionType"]').value=='Javascript GAE'){
            let actionTypeDivs=validDetails.map(idInput => idInput.parentElement.querySelector('[name="actionType"]').parentElement);

            var divElement=document.createElement('div');
            divElement.setAttribute('name','actionGaeStatus-'+request.actionId);
            divElement.classList.add(request.status=='NOT_SYNC' ? 'gae-sync-not-aligned' : 'gae-sync-aligned');
            divElement.innerText=request.status=='NOT_SYNC' ? 'NON ALLINEATO' : 'ALLINEATO';

            //Rimuovo eventuali vecchi elementi
            document.getElementsByName('actionGaeStatus-'+request.actionId).forEach(el=>el.remove());

            //Inserisco i nuovi aggiornati
            actionTypeDivs.forEach(function(el){
                if(!el.classList.contains('gae-sync-opacity')){ //Sistemo opacity degli elementi padre
                    el.classList.add('gae-sync-opacity');
                }
                el.appendChild(divElement);
            } )

        }

    }


    if (request.action === "updateGaeStatus") {
        debugger;
        updateGaeStatusSync()

    }

    sendResponse({});
    return true;
  });