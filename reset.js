try{
	document.getElementById('darkMode').remove();
	document.getElementById('darkModeEditor').remove();
	if(document.getElementsByTagName('df-messenger').length>0){
		document.getElementsByTagName('df-messenger')[0].style ? document.getElementsByTagName('df-messenger')[0].removeAttribute('style') : null;
	}
	
	if(document.getElementsByClassName('x-tip-tooltip-hint').length>0){
		document.getElementsByClassName('x-tip-tooltip-hint')[0].style.display!='' ? document.getElementsByClassName('x-tip-tooltip-hint')[0].style.removeProperty("display") : null;
		document.getElementsByClassName('x-shadow')[0].style.display!='' ? document.getElementsByClassName('x-shadow')[0].style.removeProperty("display") : null;
	}
	
}catch(e){
	console.log(e);
}