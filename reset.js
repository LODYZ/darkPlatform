try{
	document.getElementById('darkMode').remove();
	document.getElementById('darkModeEditor').remove();
	if(document.getElementsByTagName('df-messenger').length>0){
	document.getElementsByTagName('df-messenger')[0].style ? document.getElementsByTagName('df-messenger')[0].removeAttribute('style') : null;
	}
}catch(e){
	console.log(e);
}