/**
 * Attenzione, questo content script viene eseguito a livello globale ed ha accesso al dominio
 */


const delay = ms => new Promise(res => setTimeout(res, ms));

if (document.URL.includes('main_designer.jsp')) {
    if (localStorage.darkPlatformVariables) {
        var darkPlatformVariables = JSON.parse(localStorage.darkPlatformVariables);

        if (darkPlatformVariables.aceBeautifier) {
            //Ora tutti gli script vengono iniettati da isolatedStartScript
            //Ci basta definire la macro
            (async () => {
                await delay(2000);
                jwerty.key('⌘+⇧+8', function (event) {
                    event.preventDefault();
                    //Verifico se l'utente è all'interno dell editor. 
                    //Se si, sostituisco il testo da lui selezionato 
                    //Con il testo formattato
                    var aceEditor = event.srcElement.closest("div[id^=EDITOR]");
                    if (aceEditor && aceEditor.id) {
                        var editor = ace.edit(aceEditor.id);
                        var selectedText = editor.getCopyText();
                        var range = editor.selection.getRange();
                        var beautifiedText = js_beautify(selectedText);
                        editor.getSession().replace(range, beautifiedText);
                    }
                }, true);
            })(); //Funzione auto chiamante che aspetta due secondi prima definire la macro (per esser sicuri di aver caricato jwerty)
        }

        if (darkPlatformVariables.dpToVs) {
            //Se Platform to VS è attivo
            (async () => {
                await delay(2000);
                jwerty.key('ctrl+shift+9/⌘+⇧+9', function (event) {
                    event.preventDefault();
                    //Verifico se l'utente è all'interno dell editor. 
                    //Se si, sostituisco il testo da lui selezionato 
                    //Con il testo formattato
                    var aceEditor = event.srcElement.closest("div[id^=EDITOR]");
                    if (aceEditor && aceEditor.id) {
                        var editor = ace.edit(aceEditor.id);
                        var selectedText = editor.getValue();

                        // Crea una connessione WebSocket
                        const socket = new WebSocket(`ws://localhost:${darkPlatformVariables.vsToDpPort || 3005}/`);
                        // Gestisci gli eventi della connessione WebSocket
                        socket.onopen = () => {
                            console.log('Connessione WebSocket aperta');

                            // Invia un messaggio al server
                            socket.send(selectedText);

                        };

                        socket.onmessage = (event) => {
                            const data = event.data;
                            //console.log('Messaggio ricevuto dal server:', data);
                            editor.getSession().setValue(data);
                        };

                        socket.onclose = () => {
                            console.log('Connessione WebSocket chiusa');
                        };
                        socket.onerror = (e) => {
                            showMessageDialog('darkPlatform - Errore', "Impossibile comunicare con l'estensione VS. Assicurati di averla avviata correttamente.", () => { }, true, null)
                        }

                    }
                }, true);
            })(); //Funzione auto chiamante che aspetta due secondi prima definire la macro (per esser sicuri di aver caricato jwerty)
        }
    }
}
