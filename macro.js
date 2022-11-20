/*Funzione che importa moduli dinamicamente */
async function loadModule(path) {
	const src = chrome.runtime.getURL(path);
	const modulo = await import(src);
	return modulo;
  };



/*
*Verifico se l'utente ha abilitato la macro, se si carico il modulo e inserisco il listener di jwerty
*/
if(document.URL.includes('main_designer.jsp')){
    chrome.storage.sync.get(['macroCommentoBloccoEditor'], function(result) {
        if(result && result.macroCommentoBloccoEditor){
            loadModule('jwerty/jwerty.js').then(
                function(moduleLoaded){
                    console.log('Inserisco la macro');
                    //Inserisco la macro
                    jwerty.key('⌘+⇧+7', function (event) { 
                        event.preventDefault(); 
                        if(document.querySelector('.ace_editor.ace-eclipse.ace_focus')){
                            document.querySelector('.ace_editor.ace-eclipse.ace_focus').querySelector('.ace_text-input').dispatchEvent(new KeyboardEvent('keydown', { code: "Slash", key: "/", keyCode: 191, bubbles:true, shiftKey:true, metaKey:true, composed:true, defaultPrevented:true} ));
                        }
                    }, true);
            
                }
            );
        }
    });
}
