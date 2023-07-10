/**
 * Attenzione, questo content script viene eseguito a livello globale ed ha accesso al dominio
 */


const delay = ms => new Promise(res => setTimeout(res, ms));

if(document.URL.includes('main_designer.jsp')){
    if(localStorage.darkPlatformVariables){
        var darkPlatformVariables=JSON.parse(localStorage.darkPlatformVariables);

        if(darkPlatformVariables.aceBeautifier){
            //Ora tutti gli script vengono iniettati da isolatedStartScript
            //Ci basta definire la macro
            (async ()  =>{
                await delay(2000);
                jwerty.key('⌘+⇧+8', function (event) { 
                    event.preventDefault(); 
                    //Verifico se l'utente è all'interno dell editor. 
                    //Se si, sostituisco il testo da lui selezionato 
                    //Con il testo formattato
                    var aceEditor=event.srcElement.closest("div[id^=EDITOR]");
                    if(aceEditor && aceEditor.id){
                        var editor = ace.edit(aceEditor.id);
                        var selectedText = editor.getCopyText();
                        var range = editor.selection.getRange();
                        var beautifiedText = js_beautify(selectedText);
                        editor.getSession().replace(range,beautifiedText);
                    }
                }, true);
            })(); //Funzione auto chiamante che aspetta due secondi prima definire la macro (per esser sicuri di aver caricato jwerty)



        }
    }
}
