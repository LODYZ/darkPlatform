try{
	//Controllo se il css di platform è attivo
	if(document.getElementById('darkMode')==null){
		var css=chrome.runtime.getURL("customCSS.css");
		
		fetch(css).then(function(response) {
			var style = document.createElement("style");
			style.id = "darkMode";
			response.text().then(function(response){
				style.innerText=response;
			});
			(document.head).after(style);
			console.log('fatto');
		});
		
	}else{
		console.log('darkMode platform già attiva');
	}
	
	//Controllo se il css dell'editor è attivo
	if(document.getElementById('darkModeEditor')==null){
		try{
			chrome.storage.sync.get(['editorTema'], function(result) {
				if(result.editorTema != undefined) {
					var tema=result.editorTema;
					debugger;
				}else{
					var tema="aceTomorrowNight";
				 }
				var css=chrome.runtime.getURL('/aceCss/'+tema+".css");
				
				fetch(css).then(function(response) {
					var style = document.createElement("style");
					style.id = "darkModeEditor";
					response.text().then(function(response){
						style.innerText=response;
						chrome.storage.sync.get(['fontSizeEditor'], function(result) {
							if(result.fontSizeEditor != undefined && result.fontSizeEditor) {
								style.innerText+=" .ace_editor{font-size: "+result.fontSizeEditor+"px; }";
							}
						});
					});
					(document.head).after(style);
					console.log('fatto');
				});				 
			});
		}catch(e){
			console.log(e);
		}	
	}else{
		console.log('darkMode platform già attiva');
	}
	
	//Attivo o disattivo platBot
	try{
		chrome.storage.sync.get(['platBot'], function(result) {
			if(document.getElementsByTagName('df-messenger').length>0){
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
					document.getElementsByClassName('x-tip-tooltip-hint')[0].style.display!='' ? document.getElementsByClassName('x-tip-tooltip-hint')[0].style.removeProperty("display") : null;
					document.getElementsByClassName('x-shadow')[0].style.display!='' ? document.getElementsByClassName('x-shadow')[0].style.removeProperty("display") : null;
				 }	
			} 
		});
	}catch(e){
		console.log(e);
	}
	
	
}catch(e){
	console.log(e);
}



