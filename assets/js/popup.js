const extensionEnabledDiv=document.getElementById( 'extensionEnabled' );
const extensionDisabledDiv=document.getElementById( 'extensionDisabled' );
const notify = document.getElementById( 'notify-button' );
const resetButton = document.getElementById( 'notify-reset' );
const editorTema=document.getElementById('temaEditor');
const fontSizeEditor=document.getElementById('fontSizeEditor');
const platBot=document.getElementById('platBot');
const hints=document.getElementById('hints');
const clonaTraduzioni=document.getElementById('clonaTraduzioni');


//Verifico se l'utente è nel designer, altrimenti mostro il div contentente l'avviso di non rilevamento
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if(tabs[0].url.includes('main_designer.jsp')){
		extensionEnabledDiv.removeAttribute('style');
		extensionDisabledDiv.setAttribute('style', "display:none !important;");		
	}else{
		extensionDisabledDiv.removeAttribute('style');
		extensionEnabledDiv.setAttribute('style', "display:none !important;");		
	}
});



//Controllo se l'utente aveva una preferenza sul tema dell'editor
try{
	chrome.storage.sync.get(['editorTema'], function(result) {
      if(result.editorTema != undefined) {
			editorTema.value=result.editorTema;
		 }
	});
}catch(e){
	console.log(e);
}


//Controllo se l'utente aveva una preferenza sulla dimensione del font 
try{
	chrome.storage.sync.get(['fontSizeEditor'], function(result) {
      if(result.fontSizeEditor != undefined) {
			fontSizeEditor.value=result.fontSizeEditor;
		 }
	});
}catch(e){
	console.log(e);
}

//Controllo se l'utente aveva una preferenza su platBot
try{
	chrome.storage.sync.get(['platBot'], function(result) {
      if(result.platBot != undefined) {
			platBot.checked=result.platBot;
		 }
	});
}catch(e){
	console.log(e);
}


//Controllo se l'utente aveva una preferenza su hints
try{
	chrome.storage.sync.get(['hints'], function(result) {
      if(result.hints != undefined) {
			hints.checked=result.hints;
		 }
	});
}catch(e){
	console.log(e);
}

/*Listener cambio valore platBot*/
platBot.addEventListener( 'change',  () => {
	chrome.storage.sync.set({'platBot': platBot.checked}, function() {
	});
	
	//Chiamo updateSettings che controlla se darkPlatform è attivo o pure no, se si allora aggiorna il tema in automatico
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id, allFrames: true},
			files: ['updateSettings.js']
		});
	});
	
} );

/*Listener cambio valore hints*/
hints.addEventListener( 'change',  () => {
	chrome.storage.sync.set({'hints': hints.checked}, function() {
	});
	
	//Chiamo updateSettings che controlla se darkPlatform è attivo o pure no, se si allora aggiorna in automatico
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id, allFrames: true},
			files: ['updateSettings.js']
		});
	});
	
} );



/*Listener cambio valore select editor*/
editorTema.addEventListener( 'change',  () => {
	chrome.storage.sync.set({'editorTema': editorTema.value}, function() {
	});
	
	//Chiamo updateSettings che controlla se darkPlatform è attivo o pure no, se si allora aggiorna il tema in automatico
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id, allFrames: true},
			files: ['updateSettings.js']
		});
	});
} );


/*Listener cambio valore fontSizeEditor*/
fontSizeEditor.addEventListener( 'change',  () => {
	chrome.storage.sync.set({'fontSizeEditor': fontSizeEditor.value}, function() {
	});
	
	//Chiamo updateSettings che controlla se darkPlatform è attivo o pure no, se si allora aggiorna la dimensione del font in automatico
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id, allFrames: true},
			files: ['updateSettings.js']
		});
	});
	
} );


notify.addEventListener( 'click',  () => {
	
  //chrome.runtime.sendMessage( '', {
  //  type: 'enableDarkMode'
  //});
  
  //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //chrome.tabs.sendMessage(tabs[0].id, {type: 'enableDarkMode'}, function(response) {
  //  console.log(response.farewell);
  //});
  
//});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id, allFrames: true},
			files: ['darkEditor.js']
		});
  });
  

  notify.setAttribute('disabled', null);
  resetButton.removeAttribute('disabled');
} );


/*Gestione pressione bottone disattiva*/
resetButton.addEventListener( 'click',  () => {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id, allFrames: true},
				files: ['reset.js']
			});
	  });
	
	notify.removeAttribute('disabled');
    resetButton.setAttribute('disabled', null);
} );

//Gestione presione bottone clona traduzioni
clonaTraduzioni.addEventListener( 'click',  () => {
	var testoDaClonare=document.getElementById('traduzione').value;
	// console.log(testoDaClonare);

	// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	// 	chrome.tabs.sendMessage(tabs[0].id, {
	// 	type: 'cloneTranslation',
	// 	traduzione: testoDaClonare
	// 	}, function(response) {
	// 		console.log(response);
	// 	  });
	// });
	alert('Non ancora implementato :/');
} );



//Gestione presione bottone JSONEditor
document.getElementById('jsonAccordion').addEventListener( 'click',  () => {
	chrome.tabs.create({url:chrome.runtime.getURL('website/jsonEditor.html')});
} );



//Imposto la versione dell'app
var versioneAttiva=chrome.runtime.getManifest().version;
document.getElementById('appVersion').innerHTML='V '+versioneAttiva;

//Controllo se ci sono aggiornamenti
fetch('https://raw.githubusercontent.com/LODYZ/darkPlatform/main/manifest.json').then(r => r.text()).then(result => {
	if(versioneAttiva<JSON.parse(result).version){
		document.getElementById('appVersion').innerHTML='V '+versioneAttiva+" - <a href='' id='updateLink'>Aggiornamento disponibile</a> <img src='https://cdn3.emoji.gg/emojis/2230-poggies-peepo.png' width='18px' height='18px'>";
		const updateLink=document.getElementById('updateLink');
		updateLink.addEventListener( 'click',  () => {
			chrome.tabs.create({url:'https://github.com/LODYZ/darkPlatform'});
		} );
	}else{
		document.getElementById('appVersion').innerHTML='V '+versioneAttiva;
	}
})