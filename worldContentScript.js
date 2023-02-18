/**
 * Attenzione, questo content script viene eseguito a livello globale ed ha accesso al dominio
 */

//Funzione che si occupa di aggiungere i listener una volta aver 
var waitJwertyLoaded= async function(maxRetries){
    if(maxRetries==0){
        //Importo jwerty per una più facile gestione dei listener
        var jwrt = document.createElement("script");
        jwrt.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js");
        document.head.appendChild(jwrt);
    }
    //Controllo se è stato importato, altrimenti andrà in eccezzione e riprovo
    try{
        if(maxRetries<=5){
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
        }
    }catch(e){
        await new Promise(r => setTimeout(r, 1000));
        waitJwertyLoaded(maxRetries+1);
    }

}

if(document.URL.includes('main_designer.jsp')){
    if(localStorage.darkPlatformVariables){
        var darkPlatformVariables=JSON.parse(localStorage.darkPlatformVariables);

        if(darkPlatformVariables.aceBeautifier){

            //Importo beautify js 
            var beauty = document.createElement("script");
            beauty.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.js")
            document.head.appendChild(beauty);

            //Carico jwerty e attivo il listener per beautifier 
            waitJwertyLoaded(0);

        }
    }
}
