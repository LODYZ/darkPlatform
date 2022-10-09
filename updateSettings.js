try{

	//Controllo se il css dell'editor è attivo
	if(document.getElementById('darkModeEditor')==null){	
	}else{
		var editorCss=document.getElementById('darkModeEditor');
		chrome.storage.sync.get(['editorTema'], function(result) {
			if(result.editorTema != undefined) {
				var tema=result.editorTema;
			}else{
				var tema="aceTomorrowNight";
			 }
			var css=chrome.runtime.getURL('/aceCss/'+tema+".css");
					
			fetch(css).then(function(response) {
				response.text().then(function(response){
					editorCss.innerText=response;
				});
				console.log('fatto');
			});				 
		});
	}
	
	
	//Controllo se il css  è attivo, se si allora aggiorno il valore di platbot secondo le preferenze
	if(document.getElementById('darkMode')==null){	
	}else{
		//Attivo o disattivo platBot
		try{
			chrome.storage.sync.get(['platBot'], function(result) {
				if(document.getElementsByTagName('df-messenger').length>0){ //Ad un tratto scompare
					if(result.platBot != undefined && result.platBot) {

						document.getElementsByTagName('df-messenger')[0].setAttribute('style',"display:none;");
					}else{
						document.getElementsByTagName('df-messenger')[0].style ? document.getElementsByTagName('df-messenger')[0].removeAttribute('style') : null;
					 }	
				}
			});
		}catch(e){
			console.log(e);
		}
	}

	
}catch(e){
	console.log(e);
}