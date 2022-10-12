function getLanguagesIds(){
	var lingue=document.getElementById('translations').getElementsByClassName('x-grid3-header')[0].getElementsByTagName('td');
	var languagesMap={}
	for (var i=1; i<lingue.length; ++i){
		var lingua=lingue[i].innerText;
		if(lingua!=='Italiano' && lingua!=='Tipo traduzione' && lingua!=='Id' ){
			languagesMap[lingua]=i;
		}
	}
	
	return languagesMap;
}



function copyTranslations(translation,languagesMap){
	for (language in languagesMap){
		if (languagesMap.hasOwnProperty(language)) {
			document.getElementById('translations').getElementsByClassName('x-grid3-row-selected')[0].getElementsByTagName('td')[languagesMap[language]].innerText=translation;
		}
	}
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type === "cloneTranslation"){
		debugger;
		copyTranslations(request.traduzione,getLanguagesIds());
		sendResponse({success:true});
	
	}
  }
);
