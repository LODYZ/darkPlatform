<<<<<<< HEAD
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
=======
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
					chrome.storage.sync.get(['fontSizeEditor'], function(result) {
						if(result.fontSizeEditor != undefined && result.fontSizeEditor) {
							editorCss.innerText+=" .ace_editor{font-size: "+result.fontSizeEditor+"px; }";
						}
					});
				});
				console.log('fatto');
			});				 
		});
	}
	
	
	//Controllo se il css  è attivo, se si allora aggiorno il valore di platbot, hints secondo le preferenze
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
		
		//Attivo o disattivo hints
		try{
			chrome.storage.sync.get(['hints'], function(result) {
				if(document.getElementsByClassName('x-tip-tooltip-hint').length>0){ //Ad un tratto scompare
					if(result.hints != undefined && result.hints) { ///Vogliamo nascondere hint

						document.getElementsByClassName('x-tip-tooltip-hint')[0].style.display='none';
						document.getElementsByClassName('x-shadow')[0].style.display='none';
					}else{
						document.getElementsByClassName('x-tip-tooltip-hint')[0].style.display!='' ? delete document.getElementsByClassName('x-tip-tooltip-hint')[0].style.removeProperty("display") : null;
						document.getElementsByClassName('x-shadow')[0].style.display!='' ?  delete document.getElementsByClassName('x-shadow')[0].style.removeProperty("display") : null;
					 }
				}
			});
		}catch(e){
			console.log(e);
		}
		
		
	}

	
}catch(e){
	console.log(e);
>>>>>>> f756f78 (V1.1.1)
}