// -------------- Funzionalità Selenium delayer ------------
var fileContent;
var fileName;
//Gestione bottone salvataggio css personalizzato
const seleniumDelayerBtnTop = document.getElementById('seleniumDelayerBtnTop');
if (seleniumDelayerBtnTop) {
    seleniumDelayerBtnTop.addEventListener('click', () => {
        if(fileContent && fileContent!='' && fileContent!=undefined && fileContent!=null){
            var pausa=document.getElementById('seleniumDelayerPausa').value;
            var ourProject=applyDefaultPause(fileContent, pausa);
            download(fileName, JSON.stringify(ourProject));
        }else{
            alert('Impossibile leggere il file!', 'danger');
        }
        
  })
}
const seleniumDelayerBtnBottom = document.getElementById('seleniumDelayerBtnBottom');
if (seleniumDelayerBtnBottom) {
    seleniumDelayerBtnBottom.addEventListener('click', () => {
        if(fileContent && fileContent!='' && fileContent!=undefined && fileContent!=null){
            var pausa=document.getElementById('seleniumDelayerPausa').value;
            var ourProject=applyDefaultPause(fileContent, pausa);
            download(fileName, JSON.stringify(ourProject));
        }else{
            alert('Impossibile leggere il file!', 'danger');
        }

  })
}


// ---------------------------------------------------

/**
 * Gestione caricamento file 
 */

function readSingleFile(e) {
    try{
        fileContent='';
        fileName='';
        var file = e.target.files[0];
        debugger;
        if (!file) {
            alert('Impossibile trovare il file!', 'danger');
        return;
        }
        fileName=file.name;
        var reader = new FileReader();
        reader.onload = function(e) {
        var contents = e.target.result;
        fileContent=JSON.parse(contents);
        alert('File caricato con successo', 'success');
        };
    reader.readAsText(file);
    }   catch(e){
        alert('Errore in fase di caricamento!', 'danger');
    }
  }
  
  
  document.getElementById('seleniumDelayerFile')
    .addEventListener('change', readSingleFile, false);

/**
 * Gestione modifica del file
 */

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
    
function applyDefaultPause(project, pause){
    var tests=[];
    project.tests.forEach(function(testCase){
        var testCaseCommands=[];
        testCase.commands.forEach(
            function(element){
                if(element.command=='open' || element.command=='setWindowSize' ||  element.command=='pause'){
                    testCaseCommands.push(element);
                }else{
                    var id=crypto.randomUUID();
                    testCaseCommands.push({
                    "id": id,
                    "comment": "",
                    "command": "pause",
                    "target": pause,
                    "targets": [],
                    "value": pause
                    });
                    testCaseCommands.push(element);
                }
            }
        );
        testCase.commands=testCaseCommands;
        tests.push(testCase);
        });
    
    var ourProject=Object.assign({}, project);
    ourProject.tests=tests;
    return ourProject;
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
