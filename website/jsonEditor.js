/*Funzione che importa il modulo dell'editor */
async function loadEditor() {
	const src = chrome.runtime.getURL('./jsonEditor/vanilla-jsoneditor/index.js');
	const contentScript = await import(src);
	return contentScript;
  };

/*Carichiamo l'editor e aggiungiamo i listener */
loadEditor().then(
	function(module){

		const JSONEditor =module.JSONEditor;
		const content = {
			text: undefined,
			json: {}
			}

        const editorleft = new JSONEditor({
            target: document.getElementById('editorleft'),
            props: {
                content
            }
            })
    
        const editorright = new JSONEditor({
            target: document.getElementById('editorright'),
            props: {
                content
            }
            })
        
        window.editorleft = editorleft;
        window.editorright = editorright;

        chrome.runtime.onMessage.addListener((msg, sender) => {
            if (msg.action === 'setData') {
                editorleft.set(msg.data);
            }
          });

	});
/*
Aggiumgiamo JSON editor direttamente negli strumenti sviluppatore
Nascondiamo però la toolbar
*/
try{
    chrome.devtools.panels.create("DP - JSONEditor",
                              "assets/icons/48.png",
                              "website/jsonEditor.html",
                              function(panel) { });
    document.getElementsByTagName('header')[0].classList.add('d-none');
    document.getElementsByTagName('main')[0].classList.add('pt-1');
    document.getElementsByTagName('footer')[0].classList.add('d-none');
    debugger;
    document.getElementById('editorleft').style.cssText = 'height:98vh !important;';
    document.getElementById('editorright').style.cssText = 'height:98vh !important;';
}catch(e){

}
