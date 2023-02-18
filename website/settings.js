
//Input sezione dark mode
const platBot=document.getElementById('platBot');
const hints=document.getElementById('hints');
const editorTema=document.getElementById('temaEditor');
const fontSizeEditor=document.getElementById('fontSizeEditor');
const macroCommentoBloccoEditor=document.getElementById('macroCommentoBloccoEditor');
const aceBeautifier=document.getElementById('aceBeautifier');
//Input sezione notifiche
const notificheAbilitate=document.getElementById('notificheAbilitate');
const notificheGiorniReminder=document.getElementById('notificheGiorniReminder');


//Recupero tutti i settings presenti nella memoria sync
chrome.storage.sync.get(null, (result) => {
    console.log(JSON.stringify(result))
    if(result.platBot != undefined) { //Imposto la preferenza per platbot
        platBot.checked=result.platBot;
     }
     if(result.hints != undefined) { //Imposto la preferenza per hint
        hints.checked=result.hints;
     }
     if(result.fontSizeEditor != undefined) { //Imposto la preferenza per la dimensione del font
        fontSizeEditor.value=result.fontSizeEditor;
     }
     if(result.editorTema != undefined) { //Imposto la preferenza per il tema dell'editor
        editorTema.value=result.editorTema;
     }

     if(result.macroCommentoBloccoEditor != undefined) { //Imposto la preferenza per macroCommentoBloccoEditor
        macroCommentoBloccoEditor.checked=result.macroCommentoBloccoEditor;
     }

     if(result.aceBeautifier != undefined) { //Imposto la preferenza per aceBeautifier
        aceBeautifier.checked=result.aceBeautifier;
     }

     //Sezione notifiche
     if(result.notificheAbilitate != undefined) {
        notificheAbilitate.checked=result.notificheAbilitate;
     }
     if(result.notificheGiorniReminder != undefined) {
        notificheGiorniReminder.value=result.notificheGiorniReminder;
     }

});

//Recupero tutti i settings presenti nella memoria local
chrome.storage.local.get(null, function(result) { 
    if(result.favIconChanger){ //Gestione caricamento link e immagini dentro input box funzionalita favicon changer
        var data=JSON.parse(result.favIconChanger);

        for(var i=0; i<data.patterns.length; i++){
            Array.from(document.querySelectorAll('[pattern]'))[i].value=data.patterns[i];
            Array.from(document.querySelectorAll('[icon]'))[i].value=data.icons[i];

        }

    }
  });

/**
 * Carico l'editor
 */
ace.config.set('loadWorkerFromBlob', false); //Altrimenti restituisce errore
var editor = ace.edit("cssEditor");
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    editor.session.setMode("ace/mode/css");
    chrome.storage.local.get(['userCSS'], function(result) { //Verifico se l'utente aveva già specificato un proprio CSS
        if(result.userCSS){
            editor.setValue(result.userCSS);
        }
      });







// -------------- Sezione Dark mode settings -------

//Gestione bottone salvataggio css personalizzato
const darkModeSettingsBtnTop = document.getElementById('darkModeSettingsBtnTop');
if (darkModeSettingsBtnTop) {
    darkModeSettingsBtnTop.addEventListener('click', () => {
        saveSettings('darkMode');
  })
}
const darkModeSettingsBtnBottom = document.getElementById('darkModeSettingsBtnBottom');
if (darkModeSettingsBtnBottom) {
    darkModeSettingsBtnBottom.addEventListener('click', () => {
        saveSettings('darkMode');
  })
}


//Gestione bottone esportazione CSS utente

const esportaCSSBtnBottom = document.getElementById('esportaCSSBtnBottom');
if (esportaCSSBtnBottom) {
    esportaCSSBtnBottom.addEventListener('click', () => {
    // Start file download.
    download("userCSS.css", editor.getValue());
  })
}

// ---------------------------------------------------



// --------- Sezione Notifiche ----------------
//Gestione bottone salvataggio css personalizzato
const notificheSettingsBtnTop = document.getElementById('notificheSettingsBtnTop');
if (notificheSettingsBtnTop) {
    notificheSettingsBtnTop.addEventListener('click', () => {
        saveSettings('notification');
  })
}
const notificheSettingsBtnBottom = document.getElementById('notificheSettingsBtnBottom');
if (notificheSettingsBtnBottom) {
    notificheSettingsBtnBottom.addEventListener('click', () => {
        saveSettings('notification');
  })
}



// ---------------------------------------


// -------------- Sezione JSON EDITOR SETTINGS --------

const modalGetKey = document.getElementById('modalGetKey');
var modal=new bootstrap.Modal('#modalGetKey', {});
var bodyModalGetKey= document.getElementById('bodyModalGetKey');
const modalGetKeyConfirmButton= document.getElementById('modalGetKeyConfirmButton');
const firstKeyJsonEditor = document.getElementById('firstKeyJsonEditor');
const secondKeyJsonEditor = document.getElementById('secondKeyJsonEditor');
const labelTasto1 = document.getElementById('labelTasto1');
const labelTasto2 = document.getElementById('labelTasto2');

var reloadLabelTasti= function(){
    chrome.storage.sync.get(
        ['firstKeyJsonEditor','secondKeyJsonEditor'], function(result) {
            if(result.firstKeyJsonEditor){
                result.firstKeyJsonEditor=JSON.parse(result.firstKeyJsonEditor);
                labelTasto1.innerText='Tasto 1: '+ result.firstKeyJsonEditor.key.toUpperCase();
            }

            if(result.secondKeyJsonEditor){
                result.secondKeyJsonEditor=JSON.parse(result.secondKeyJsonEditor);
                labelTasto2.innerText='Tasto 2: '+ result.secondKeyJsonEditor.key.toUpperCase();
            }
        });
}

reloadLabelTasti(); //cambiamo il testo indicando i tasti ad ora attivi

//Gestione salvataggio nuovo tasto
modalGetKeyConfirmButton.addEventListener('click', () => {
    if(modalGetKeyConfirmButton.params){
        var obj={};
        obj[modalGetKeyConfirmButton.params.from]=JSON.stringify({
            key: modalGetKeyConfirmButton.params.keyPressed.key ? modalGetKeyConfirmButton.params.keyPressed.key : null,
            keyCode: modalGetKeyConfirmButton.params.keyPressed.keyCode ? modalGetKeyConfirmButton.params.keyPressed.keyCode : null,
            which: modalGetKeyConfirmButton.params.keyPressed.which ? modalGetKeyConfirmButton.params.keyPressed.which : null,
            code: modalGetKeyConfirmButton.params.keyPressed.code ? modalGetKeyConfirmButton.params.keyPressed.code : null,
        })
        saveSettings('jsonEditorKey',obj);
        modal.hide();
        reloadLabelTasti();
    }

})


//Gestione apertura modal e rilevamento tasti
var getKeyModal= function (from) {
    console.log(from.target.id);
    var readKey=function(e) {
        bodyModalGetKey.innerHTML="Tasto scelto: "+e.key.toUpperCase()+"<br>Digita nuovamente un tasto per cambiarlo";
        modalGetKeyConfirmButton.classList.remove("d-none");
        modalGetKeyConfirmButton.params={//Salvo all'interno del bottone chi mi ha chiamato e il tasto scelto
            from:from.target.id,
            keyPressed:e
        };
    }

    modalGetKey.addEventListener('show.bs.modal', event => {
        modalGetKey.addEventListener('keydown', readKey)
      })
      modalGetKey.addEventListener('hidden.bs.modal', event => {
        modalGetKey.removeEventListener('keydown', readKey);
        bodyModalGetKey.innerHTML="Tasto scelto: ";
        modalGetKeyConfirmButton.classList.add("d-none");
        delete modalGetKeyConfirmButton.params;
      })
    

    modal.show();


}

firstKeyJsonEditor.addEventListener('click', getKeyModal);
secondKeyJsonEditor.addEventListener('click', getKeyModal);


// -----------------------------------------



// -------------- Sezione favicon changer settings -------

//Gestione bottone salvataggio css personalizzato
const favIconChangerBtnTop = document.getElementById('favIconChangerBtnTop');
if (favIconChangerBtnTop) {
    favIconChangerBtnTop.addEventListener('click', () => {
        saveSettings('favIconChanger');
  })
}
const favIconChangerBtnBottom = document.getElementById('favIconChangerBtnBottom');
if (favIconChangerBtnBottom) {
    favIconChangerBtnBottom.addEventListener('click', () => {
        saveSettings('favIconChanger');
  })
}


// ---------------------------------------------------



const saveSettings= function(section, data){
    try{
        var msg='Impostazioni salvate con successo!';
        if(section=='darkMode'){
            /*salvataggio css utente*/
            chrome.storage.local.set({'userCSS': editor.getValue()}, function() {}); //Salviamo il css dell'utente -> le salviamo in local dato che in sync avremmo poco spazio

            chrome.storage.sync.set(
                {
                'hints': hints.checked,
                'platBot': platBot.checked,
                'editorTema': editorTema.value,
                'fontSizeEditor': fontSizeEditor.value,
                'macroCommentoBloccoEditor':macroCommentoBloccoEditor.checked,
                'aceBeautifier':aceBeautifier.checked
            }, function() {});
            msg+=' Per rendere effettive le modifiche disattiva e riattiva la dark mode'
        }else if(section=='notification'){
            chrome.storage.sync.set(
                {
                'notificheAbilitate': notificheAbilitate.checked,
                'notificheGiorniReminder': notificheGiorniReminder.value,
            }, function() {});
        }else if(section=='jsonEditorKey'){
            chrome.storage.sync.set(data, function() {});
            msg+=' Per rendere effettive le modifiche ricarica la pagina/designer'
        }else if(section=='favIconChanger'){
            var data={
                patterns: Array.from(document.querySelectorAll('[pattern]')).map(el =>el.value),
                icons: Array.from(document.querySelectorAll('[icon]')).map(el =>el.value),

            };
            data=JSON.stringify(data);

            var toSave={
                'favIconChanger':data
            };

            chrome.storage.local.set(toSave, function() {});
            msg+=' Per rendere effettive le modifiche ricarica la pagina/designer'
        }


        alert(msg, 'success');

    }catch(e){
        console.log(e);
        alert('Errore in fase di salvataggio!', 'danger');
    }
}




function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }




  /**
   * Inizializiamo i tooltip nella pagina (lo vuole bootstrap)
   * 
   */
   document.querySelectorAll('[data-bs-toggle="tooltip"]')
   .forEach(tooltip => {
     new bootstrap.Tooltip(tooltip)
   })
