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
      await onTabLoaded(tab.id);
      await chrome.tabs.sendMessage(tab.id, {
        action: 'setData',
        data: request.data,
      });

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

    }
  return true;
});