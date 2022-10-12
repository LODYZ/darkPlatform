chrome.runtime.onMessage.addListener( data => {
  if ( data.type === 'enableDarkMode' ) {
	  console.log('aaa');
	  debugger;
  }else if( data.type === 'disableDarkMode' ){
  }
});