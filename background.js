function onTabLoaded(tabId) { //Funzione che attende che la tab aperta abbia finito di caricare
  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function onUpdated(id, change) {
      if (id === tabId && change.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve();
      }
    });
  });
}


chrome.runtime.onMessage.addListener(    
  async function (request, sender, sendResponse) {
    if(request.action=="openExternalJsonEditor"){ //Apertura di json editor su nuova pagina
      const tab = await chrome.tabs.create({url:chrome.runtime.getURL('website/jsonEditor.html')});
      //Apriamo la nuova tab, aspettiamo che sia pronta e poi inviamo i dati.
      //Sfortunatamente il caricamento degli editor è asincrono quindi anche se la tab è pronta non è detto che lo sia il listener
      //aggiungiamo un timeout e se va in errore tentiamo di nuovo. Non è una buona soluzione lo so (potremmo gestirla inversa o usare altre API)
      await onTabLoaded(tab.id);
      await new Promise(r => setTimeout(r, 100));
      try{
        await chrome.tabs.sendMessage(tab.id, {
          action: 'setData',
          data: request.data,
        });
      }catch(e){
        console.log('Messaggio non ricevuto, riprovo');
        await new Promise(r => setTimeout(r, 400));
        await chrome.tabs.sendMessage(tab.id, {
          action: 'setData',
          data: request.data,
        });
      }
    }else if(request.action=='changeExtensionIcon'){ //Cambiamo l'icona dell'estensione
      if(request.data=='light'){
        chrome.action.setIcon({ path:{
          "48": "/assets/icons/48dark.png",
          "128": "/assets/icons/128dark.png"
        }});
      }else{
        chrome.action.setIcon({ path:{
          "48": "/assets/icons/48.png",
          "128": "/assets/icons/128.png"
        }});
      }

    }else if('notify'){
       chrome.notifications.create(
        'updateNotify',
        {
            type:'basic',
            iconUrl:'/assets/icons/48.png',
            title: 'Aggiornamento disponibile',
            message:'Ciao, è disponibile una nuova versione di DarkPlatform. Premimi per aggiornarmi'
        }
      )
    }
  return true;
});




/**Verifica configurazioni
 * Il seguente codice si occupa di controllare se sono presenti le configurazioni di default dell'estensione
 * In questo modo possiamo specificare i comportamenti di default quando l'utente ha installato l'estensione e non ancora specificato le proprie preferenze
 */

 chrome.storage.sync.get(null, (result) => {
  //console.log(JSON.stringify(result));
  chrome.storage.sync.set(
    {
    'hints': result.hints ? result.hints : true,
    'platBot': result.platBot ? result.platBot : true,
    'editorTema': result.editorTema ? result.editorTema : "aceTomorrowNight",
    'fontSizeEditor': result.fontSizeEditor ? result.fontSizeEditor : "12",
    'macroCommentoBloccoEditor':  result.macroCommentoBloccoEditor ? result.macroCommentoBloccoEditor : false,
    'aceBeautifier':  result.aceBeautifier ? result.aceBeautifier : false,
    'notificheAbilitate': result.notificheAbilitate ? result.notificheAbilitate : true,
    'notificheGiorniReminder': result.notificheGiorniReminder ? result.notificheGiorniReminder : "7",
    "firstKeyJsonEditor": result.firstKeyJsonEditor ? result.firstKeyJsonEditor : JSON.stringify({
        "key": "Control",
        "keyCode": 17,
        "which": 17,
        "code": "ControlLeft"
    }),
    "secondKeyJsonEditor": result.secondKeyJsonEditor ? result.secondKeyJsonEditor : JSON.stringify({
        "key": "q",
        "keyCode": 81,
        "which": 81,
        "code": "KeyQ"
    }),
    'gaeSync': result.gaeSync ? result.gaeSync : true,
    
}, function() {});

});


//Codice che apre il changelog quando viene aggiornata l'estensione
chrome.storage.local.get(['latestChangeLogShown'], (result) => {
  //console.log(JSON.stringify(result));
  console.log(result);
  result.latestChangeLogShown = result.latestChangeLogShown ? result.latestChangeLogShown : '1.0.0';
  if(chrome.runtime.getManifest().version>result.latestChangeLogShown){
    chrome.tabs.create({url:chrome.runtime.getURL('website/guida.html')});
    chrome.storage.local.set(
      {
      'latestChangeLogShown': chrome.runtime.getManifest().version
      }, function() {});
  }

});



//Se l'utente preme sulla notifica viene riportato a github
chrome.notifications.onClicked.addListener(
  function(id){
    if(id=='updateNotify'){
        chrome.tabs.create({url:'https://github.com/LODYZ/darkPlatform'});
    }
}
)


//Verifico le chiamate http che vengono effettuate al fine di capire se l'utente ha allineato o meno le azioni gae
chrome.storage.sync.get(['gaeSync'], (result) => {
  if(result.gaeSync){
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        if (details.method=='PUT' && details.url.includes('getActions/detail?') && new URLSearchParams(details.url).get('actionId')) {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(details.tabId, { action: "updateGaeStatus", status:'NOT_SYNC', actionId: new URLSearchParams(details.url).get('actionId') });
          });
        }else if(details.method=='GET' && details.url.includes('executeJs/syncAction?') && new URLSearchParams(details.url).get('actionId') ){
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(details.tabId, { action: "updateGaeStatus", status:'SYNC', actionId: new URLSearchParams(details.url).get('actionId') });
          });
        }
      },
      { urls: ["*://*/*/getActions/detail?*","*://*/*/executeJs/syncAction?*"] },
      []
    );
  }
});




