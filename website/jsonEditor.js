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
