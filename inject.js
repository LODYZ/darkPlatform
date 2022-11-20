/**
 * ATTENZIONE, nella parte finale dello script è presente il controllo del tema attivo e vengono effettuati i controlli sugli aggiornamenti
 * 
 */



/*function getLanguagesIds(){
	var lingue=document.getElementById('translations').getElementsByClassName('x-grid3-header')[0].getElementsByTagName('td');
	var languagesMap={}
	for (var i=1; i<lingue.length; ++i){
		var lingua=lingue[i].innerText;
		if(lingua!=='Italiano' && lingua!=='Tipo traduzione' && lingua!=='Id' ){
			languagesMap[lingua]=i;
		}
	}
	
	return languagesMap;
}



function copyTranslations(translation,languagesMap){
	for (language in languagesMap){
		if (languagesMap.hasOwnProperty(language)) {
			document.getElementById('translations').getElementsByClassName('x-grid3-row-selected')[0].getElementsByTagName('td')[languagesMap[language]].innerText=translation;
		}
	}
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type === "cloneTranslation"){
		debugger;
		copyTranslations(request.traduzione,getLanguagesIds());
		sendResponse({success:true});
	
	}
  }
);
*/


/** JSONEDITOR IN PLATFORM. 
 * Gestione dell'inject dell'editor
 * JS + CSS
 * 
**/


/**
 * 
 * Gestine modal resizable --> css 
 * il suo js è stato aggiunto alla fine
 */

 if(document.getElementById('modalResizable')==null){
	var css=chrome.runtime.getURL("./jsonEditor/vanilla-jsoneditor/resizable-dialog/draggable-resizable-dialog.css");
	
	fetch(css).then(function(response) {
		var style = document.createElement("style");
		style.id = "modalResizable";
		response.text().then(function(response){
			style.innerText=response;
		});
		(document.head).after(style);
	});
	
}


/*Creazioen degli elementi html */
if(document.getElementById('jsonEditorDarkMode')==null){
	var css=chrome.runtime.getURL("./jsonEditor/vanilla-jsoneditor/themes/jse-theme-dark.css");
	
	fetch(css).then(function(response) {
		var style = document.createElement("style");
		style.id = "jsonEditorDarkMode";
		response.text().then(function(response){
			style.innerText=response;
		});
		(document.head).after(style);
	});
	
}

/*
<div id="dialog" class="dialog" style="min-width:400px; min-height:280px;">
	<div class="titlebar">Dialog Title...</div>
	<button name="close"><!-- enter symbol here like &times; or &#x1f6c8; or use the default X if empty --></button>
	<div class="content">
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
	</div>
	<div class="buttonpane">
		<div class="buttonset">
			<button name="ok">OK</button>
			<button name="cancel">Cancel</button>
		</div>
	</div>
</div>
*/
var modalDiv=document.createElement('div');
modalDiv.setAttribute('id', 'dialog');
modalDiv.setAttribute('class',"dialog");
modalDiv.setAttribute('style',"min-width:350px; min-height:280px; width:400px; height:500px");

var modalTitle=document.createElement('div');
modalTitle.setAttribute('class', 'titlebar');
modalTitle.innerText="JSON Viewer";

var openExternal=document.createElement('div');
openExternal.setAttribute('id', 'open-external');

var openExternalButton=document.createElement('div');
openExternalButton.setAttribute('id', 'open-external-button');
openExternalButton.innerHTML='&#xe164;';
openExternal.appendChild(openExternalButton);

var modalButton=document.createElement('button');
modalButton.setAttribute('name', 'close');

var modalContent=document.createElement('div');
modalContent.setAttribute('class', 'content');
modalContent.setAttribute('style',"width:100% !important; height:100%; top:33px; left:0px;");

var editorDiv=document.createElement('div');
editorDiv.setAttribute('id', 'jsoneditor');
editorDiv.setAttribute('class',"jse-theme-dark");
editorDiv.setAttribute('style',"width:100%; height:100%");

modalDiv.appendChild(modalTitle);
modalDiv.appendChild(openExternal);
modalDiv.appendChild(modalButton);
modalContent.appendChild(editorDiv);
modalDiv.appendChild(modalContent);

//document.body.appendChild(editorDiv);
document.body.appendChild(modalDiv);

var modalDialog=new DialogBox('dialog', ()=>null);

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
		editor = new JSONEditor({
				target: editorDiv,
				props: {
					content
				}
				}
			)
		

		chrome.storage.sync.get(
			['firstKeyJsonEditor','secondKeyJsonEditor'], function(result) {
				if(Object.keys(result).length==2){
					result.firstKeyJsonEditor=JSON.parse(result.firstKeyJsonEditor);
					result.secondKeyJsonEditor=JSON.parse(result.secondKeyJsonEditor);
					
					var keysPressed = {};

					document.body.addEventListener("keydown",function(e){
						//console.log(JSON.stringify(keysPressed));
						e = e || window.event;
						var tasto=e.code || e.which || e.keyCode;
						var tasto=e.code || e.which || e.keyCode;
						if(tasto== result.firstKeyJsonEditor.code ||
							tasto== result.firstKeyJsonEditor.which ||
							tasto== result.firstKeyJsonEditor.keyCode){
								keysPressed[tasto]=true;
							}

						if((tasto== result.secondKeyJsonEditor.code ||
							tasto== result.secondKeyJsonEditor.which ||
							tasto== result.secondKeyJsonEditor.keyCode) &&
							(keysPressed[result.firstKeyJsonEditor.code] ||
								keysPressed[result.firstKeyJsonEditor.which] ||
								keysPressed[result.firstKeyJsonEditor.keyCode])){
									if(document.getSelection().toString().length>0){
										editor.set({text:document.getSelection().toString()});
										modalDialog.showDialog();
									}								
								}
								//console.log(JSON.stringify(keysPressed));
					},false);

					document.body.addEventListener('keyup', (e) => {
						var tasto=e.code || e.which || e.keyCode;
						delete keysPressed[tasto];
					 });


				}else{//Configurazioni non trovate, uso quelle di default
					//Se l'utente premere CTRL+Q si apre l'editor con già importato il testo selezionato
					document.body.addEventListener("keydown",function(e){
						e = e || window.event;
						var key = e.which || e.keyCode; // keyCode detection
						var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // shift detection
					
						if ( key == 81 && ctrl ) {
							if(document.getSelection().toString().length>0){
								editor.set({text:document.getSelection().toString()});
								modalDialog.showDialog();
							}
						}
					
					},false);
				}
			});
	});



  



/*
 * Pure JavaScript for Draggable and Risizable Dialog Box
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
 * Extended by FrankBuchholz, Germany, 2019
 */
 // Encapsulate variables and functions to allow instanciation of multiple dialog boxes
 function DialogBox(id, callback) {
		
	var	_minW = 100, // The exact value get's calculated
		_minH = 1, // The exact value get's calculated
		_resizePixel = 5,
		_hasEventListeners = !!window.addEventListener,
		_parent,
		_dialog,
		_dialogTitle,
		_dialogContent,
		_dialogButtonPane,
		_maxX, _maxY,
		_startX, _startY,
		_startW, _startH,
		_leftPos, _topPos,
		_isDrag = false,
		_isResize = false,
		_isButton = false,
		_isButtonHovered = false, // Let's use standard hover (see css)
		//_isClickEvent = true, // Showing several dialog boxes work better if I do not use this variable
		_resizeMode = '',
		_whichButton,
		_buttons,
		_tabBoundary,
		_callback, // Callback function which transfers the name of the selected button to the caller
		_zIndex, // Initial zIndex of this dialog box 
		_zIndexFlag = false, // Bring this dialog box to front 
		_setCursor, // Forward declaration to get access to this function in the closure
		_whichClick, // Forward declaration to get access to this function in the closure
		_setDialogContent, // Forward declaration to get access to this function in the closure
		_openExternal, //Aggiunto per aprire jsonEditor in nuova pagina
		_addEvent = function(elm, evt, callback) {
			if (elm == null || typeof(elm) == undefined)
				return;
			if (_hasEventListeners)
				elm.addEventListener(evt, callback, false);
			else if (elm.attachEvent)
				elm.attachEvent('on' + evt, callback);
			else
				elm['on' + evt] = callback;
		},
		
		_returnEvent = function(evt) {
			if (evt.stopPropagation)
				evt.stopPropagation();
			if (evt.preventDefault)
				evt.preventDefault();
			else {
				evt.returnValue = false;
				return false;
			}
		},
		
		// not used
		/*
		_returnTrueEvent = function(evt) {
			evt.returnValue = true;
			return true;
		},
		*/
		
		// not used
		// Mybe we should be able to destroy a dialog box, too. 
		// In this case we should remove the event listeners from the dialog box but 
		// I do not know how to identfy which event listeners should be removed from the document.
		/*
		_removeEvent = function(elm, evt, callback) {
			if (elm == null || typeof(elm) == undefined)
				return;
			if (window.removeEventListener)
				elm.removeEventListener(evt, callback, false);
			else if (elm.detachEvent)
				elm.detachEvent('on' + evt, callback);
		},
		*/
		
		_adjustFocus = function(evt) {
			evt = evt || window.event;
			if (evt.target === _dialogTitle)
				_buttons[_buttons.length - 1].focus();
			else
				_buttons[0].focus();
			return _returnEvent(evt);
		},
		
		_onFocus = function(evt) {
			evt = evt || window.event;
			evt.target.classList.add('focus');
			return _returnEvent(evt);
		},
		
		_onBlur = function(evt) {
			evt = evt || window.event;
			evt.target.classList.remove('focus');
			return _returnEvent(evt);
		},
		
		_onClick = function(evt) {
			evt = evt || window.event;
			//if (_isClickEvent)
				_whichClick(evt.target);
			//else
			//	_isClickEvent = true;
			return _returnEvent(evt);
		},
		
		_onMouseDown = function(evt) {
			evt = evt || window.event;
			_zIndexFlag = true;
			// mousedown might happen on any place of the dialog box, therefore 
			// we need to take care that this does not to mess up normal events 
			// on the content of the dialog box, i.e. to copy text
			if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]))
				return;
			var rect = _getOffset(_dialog);
			_maxX = Math.max(
				document.documentElement["clientWidth"],
				document.body["scrollWidth"],
				document.documentElement["scrollWidth"],
				document.body["offsetWidth"],
				document.documentElement["offsetWidth"]
			);
			_maxY = Math.max(
				document.documentElement["clientHeight"],
				document.body["scrollHeight"],
				document.documentElement["scrollHeight"],
				document.body["offsetHeight"],
				document.documentElement["offsetHeight"]
			);
			if (rect.right > _maxX)
				_maxX = rect.right;
			if (rect.bottom > _maxY)
				_maxY = rect.bottom;
			_startX = evt.pageX;
			_startY = evt.pageY;
			_startW = _dialog.clientWidth;
			_startH = _dialog.clientHeight;
			_leftPos = rect.left;
			_topPos = rect.top;
			if (_isButtonHovered) {
				//_whichButton.classList.remove('hover');
				_whichButton.classList.remove('focus');
				_whichButton.classList.add('active');
				_isButtonHovered = false;
				_isButton = true;
			}
			else if (evt.target === _dialogTitle && _resizeMode == '') {
				_setCursor('move');
				_isDrag = true;
			}
			else if (_resizeMode != '') {
				_isResize = true;
			}	
			var r = _dialog.getBoundingClientRect();
			return _returnEvent(evt);
		},
		
		_onMouseMove = function(evt) {
			evt = evt || window.event;
			// mousemove might run out of the dialog box during drag or resize, therefore we need to 
			// attach the event to the whole document, but we need to take care that this  
			// does not to mess up normal events outside of the dialog box.
			if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) && !_isDrag && _resizeMode == '')
				return;
			if (_isDrag) {
				var dx = _startX - evt.pageX,
					dy = _startY - evt.pageY,
					left = _leftPos - dx,
					top = _topPos - dy,
					scrollL = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
					scrollT = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
				if (dx < 0) {
					if (left + _startW > _maxX)
						left = _maxX - _startW;
				}
				if (dx > 0) {
					if (left < 0)
						left = 0;
				}
				if (dy < 0) {
					if (top + _startH > _maxY)
						top = _maxY - _startH;
				}
				if (dy > 0) {
					if (top < 0)
						top = 0;
				}
				_dialog.style.left = left + 'px';
				_dialog.style.top = top + 'px';
				if (evt.clientY > window.innerHeight - 32)
					scrollT += 32;
				else if (evt.clientY < 32)
					scrollT -= 32;
				if (evt.clientX > window.innerWidth - 32)//32
					scrollL += 32;
				else if (evt.clientX < 32)
					scrollL -= 32;
				if (top + _startH == _maxY)
					scrollT = _maxY - window.innerHeight + 20;
				else if (top == 0)
					scrollT = 0;
				if (left + _startW == _maxX)
					scrollL = _maxX - window.innerWidth + 20;
				else if (left == 0)
					scrollL = 0;
				if (_startH > window.innerHeight) {
					if (evt.clientY < window.innerHeight / 2)
						scrollT = 0;
					else
						scrollT = _maxY - window.innerHeight + 20;
				}
				if (_startW > window.innerWidth) {
					if (evt.clientX < window.innerWidth / 2)
						scrollL = 0;
					else
						scrollL = _maxX - window.innerWidth + 20;
				}
				window.scrollTo(scrollL, scrollT);
			}
			else if (_isResize) {
				var dw, dh, w, h;
				if (_resizeMode == 'w') {
					dw = _startX - evt.pageX;
					if (_leftPos - dw < 0)
						dw = _leftPos;
					w = _startW + dw;
					if (w < _minW) {
						w = _minW;
						dw = w - _startW;
					}
					_dialog.style.width = w + 'px';
					_dialog.style.left = (_leftPos - dw) + 'px'; 
				}
				else if (_resizeMode == 'e') {
					dw = evt.pageX - _startX;
					if (_leftPos + _startW + dw > _maxX)
						dw = _maxX - _leftPos - _startW;
					w = _startW + dw;
					if (w < _minW)
						w = _minW;
					_dialog.style.width = w + 'px';
				}
				else if (_resizeMode == 'n') {
					dh = _startY - evt.pageY;
					if (_topPos - dh < 0)
						dh = _topPos;
					h = _startH + dh;
					if (h < _minH) {
						h = _minH;
						dh = h - _startH;
					}
					_dialog.style.height = h + 'px';
					_dialog.style.top = (_topPos - dh) + 'px';
				}
				else if (_resizeMode == 's') {
					dh = evt.pageY - _startY;
					if (_topPos + _startH + dh > _maxY)
						dh = _maxY - _topPos - _startH;
					h = _startH + dh;
					if (h < _minH)
						h = _minH;
					_dialog.style.height = h + 'px';
				}
				else if (_resizeMode == 'nw') {
					dw = _startX - evt.pageX;
					dh = _startY - evt.pageY;
					if (_leftPos - dw < 0)
						dw = _leftPos;
					if (_topPos - dh < 0)
						dh = _topPos;
					w = _startW + dw;
					h = _startH + dh;
					if (w < _minW) {
						w = _minW;
						dw = w - _startW;
					}
					if (h < _minH) {
						h = _minH;
						dh = h - _startH;
					}
					_dialog.style.width = w + 'px';
					_dialog.style.height = h + 'px';
					_dialog.style.left = (_leftPos - dw) + 'px'; 
					_dialog.style.top = (_topPos - dh) + 'px';
				}
				else if (_resizeMode == 'sw') {
					dw = _startX - evt.pageX;
					dh = evt.pageY - _startY;
					if (_leftPos - dw < 0)
						dw = _leftPos;
					if (_topPos + _startH + dh > _maxY)
						dh = _maxY - _topPos - _startH;
					w = _startW + dw;
					h = _startH + dh;
					if (w < _minW) {
						w = _minW;
						dw = w - _startW;
					}
					if (h < _minH)
						h = _minH;
					_dialog.style.width = w + 'px';
					_dialog.style.height = h + 'px';
					_dialog.style.left = (_leftPos - dw) + 'px'; 
				}
				else if (_resizeMode == 'ne') {
					dw = evt.pageX - _startX;
					dh = _startY - evt.pageY;
					if (_leftPos + _startW + dw > _maxX)
						dw = _maxX - _leftPos - _startW;
					if (_topPos - dh < 0)
						dh = _topPos;
					w = _startW + dw;
					h = _startH + dh;
					if (w < _minW)
						w = _minW;
					if (h < _minH) {
						h = _minH;
						dh = h - _startH;
					}
					_dialog.style.width = w + 'px';
					_dialog.style.height = h + 'px';
					_dialog.style.top = (_topPos - dh) + 'px';
				}
				else if (_resizeMode == 'se') {
					dw = evt.pageX - _startX;
					dh = evt.pageY - _startY;
					if (_leftPos + _startW + dw > _maxX)
						dw = _maxX - _leftPos - _startW;
					if (_topPos + _startH + dh > _maxY)
						dh = _maxY - _topPos - _startH;
					w = _startW + dw;
					h = _startH + dh;
					if (w < _minW)
						w = _minW;
					if (h < _minH)
						h = _minH;
					_dialog.style.width = w + 'px';
					_dialog.style.height = h + 'px';
				}
				_setDialogContent();
			}
			else if (!_isButton) {
				var cs, rm = '';
				if (evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) {
					var rect = _getOffset(_dialog);
					if (evt.pageY < rect.top + _resizePixel)
						rm = 'n';
					else if (evt.pageY > rect.bottom - _resizePixel)
						rm = 's';
					if (evt.pageX < rect.left + _resizePixel)
						rm += 'w';
					else if (evt.pageX > rect.right - _resizePixel)
						rm += 'e';
				}
				if (rm != '' && _resizeMode != rm) {
					if (rm == 'n' || rm == 's')
						cs = 'ns-resize';
					else if (rm == 'e' || rm == 'w')
						cs = 'ew-resize';
					else if (rm == 'ne' || rm == 'sw')
						cs = 'nesw-resize';
					else if (rm == 'nw' || rm == 'se')
						cs = 'nwse-resize';
					_setCursor(cs);
					_resizeMode = rm;
				}
				else if (rm == '' && _resizeMode != '') {
					_setCursor('');
					_resizeMode = '';
				}
				if (evt.target != _buttons[0] && evt.target.tagName.toLowerCase() == 'button' || evt.target === _buttons[0] && rm == '') {
					if (!_isButtonHovered || _isButtonHovered && evt.target != _whichButton) {
						_whichButton = evt.target;
						//_whichButton.classList.add('hover');
						_isButtonHovered = true;
					}
				}
				else if (_isButtonHovered) {
					//_whichButton.classList.remove('hover');
					_isButtonHovered = false;
				}
			}
			return _returnEvent(evt);
		};
		
		_onMouseUp = function(evt) {
			evt = evt || window.event;
			if (_zIndexFlag) {
				_dialog.style.zIndex = _zIndex + 1;
				_zIndexFlag = false;
			} else {
				_dialog.style.zIndex = _zIndex;
			}
			// mousemove might run out of the dialog box during drag or resize, therefore we need to 
			// attach the event to the whole document, but we need to take care that this  
			// does not to mess up normal events outside of the dialog box.
			if ( !(evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) && !_isDrag && _resizeMode == '')
				return;
			//_isClickEvent = false;
			if (_isDrag) {
				_setCursor('');
				_isDrag = false; 
			}
			else if (_isResize) {
				_setCursor('');
				_isResize = false;
				_resizeMode = '';
			}
			else if (_isButton) {
				_whichButton.classList.remove('active');
				_isButton = false;
				_whichClick(_whichButton);
			}
			//else
				//_isClickEvent = true;
			return _returnEvent(evt);
		},
		
		_whichClick = function(btn) {
			_dialog.style.display = 'none';
			if (_callback)
				_callback(btn.name);
		},
		
		_getOffset = function(elm) {
			var rect = elm.getBoundingClientRect(),
				offsetX = window.scrollX || document.documentElement.scrollLeft,
				offsetY = window.scrollY || document.documentElement.scrollTop;
			return {
				left: rect.left + offsetX,
				top: rect.top + offsetY,
				right: rect.right + offsetX,
				bottom: rect.bottom + offsetY
			}
		},
		
		_setCursor = function(cur) {
			_dialog.style.cursor = cur;
			_dialogTitle.style.cursor = cur;
			_buttons[0].style.cursor = cur;
		},
		
		_setDialogContent = function() {
			// Let's try to get rid of some of constants in javascript but use values from css
			var	_dialogContentStyle = getComputedStyle(_dialogContent),
				_dialogButtonPaneStyle,
				_dialogButtonPaneStyleBefore;
			if (_buttons.length > 1) {
				_dialogButtonPaneStyle = getComputedStyle(_dialogButtonPane);
				_dialogButtonPaneStyleBefore = getComputedStyle(_dialogButtonPane, ":before");
			}
	
			var w = _dialog.clientWidth 
					// - parseInt( _dialogContentStyle.left) // .dialog .content { left: 16px; }
					// - 16 // right margin?
					,
				h = _dialog.clientHeight - (
					parseInt(_dialogContentStyle.top) // .dialog .content { top: 48px } 
					// + 16 // ?
					+ (_buttons.length > 1 ? 
						+ parseInt(_dialogButtonPaneStyleBefore.borderBottom) // .dialog .buttonpane:before { border-bottom: 1px; }
						- parseInt(_dialogButtonPaneStyleBefore.top) // .dialog .buttonpane:before { height: 0; top: -16px; }
						+ parseInt(_dialogButtonPaneStyle.height) // .dialog .buttonset button { height: 32px; }
						+ parseInt(_dialogButtonPaneStyle.bottom) // .dialog .buttonpane { bottom: 16px; }
						: 0 )
					); // Ensure to get minimal height
			_dialogContent.style.width = w + 'px';
			_dialogContent.style.height = h + 'px';
	
			if (_dialogButtonPane) // The buttonpane is optional
				_dialogButtonPane.style.width = w + 'px';
	
			_dialogTitle.style.width = (w - 16) + 'px';
		},
		
		_showDialog = function() {
			_dialog.style.display = 'block';
			if (_buttons[1]) // buttons are optional
				_buttons[1].focus();
			else
				_buttons[0].focus();
		},


		//Azione che apre il json in una pagina diversa
		_openInExternal=function(){
			//Da content script non abbiamo accesso a tutte le API. Passiamo per il background il quale sarà incaricato di creare un nuovo tab e passargli il JSON
			chrome.runtime.sendMessage(
				{
					action:'openExternalJsonEditor',
					data:editor.get()
				},
				function (response) {
					_dialog.style.display = 'none';
				}
			);
			_dialog.style.display = 'none';
		}
		
		_init = function(id, callback) {
			_dialog = document.getElementById(id);
			_callback = callback; // Register callback function
	
			_dialog.style.visibility = 'hidden'; // We dont want to see anything..
			_dialog.style.display = 'block'; // but we need to render it to get the size of the dialog box
	
			_dialogTitle = _dialog.querySelector('.titlebar');
			_dialogContent = _dialog.querySelector('.content');
			_dialogButtonPane = _dialog.querySelector('.buttonpane');
			_buttons = _dialog.querySelectorAll('button');  // Ensure to get minimal width
			_openExternal = _dialog.querySelector('#open-external'); //definisco il bottone per aprire json editor in altra page
	
			// Let's try to get rid of some of constants in javascript but use values from css
			var _dialogStyle = getComputedStyle(_dialog),
				_dialogTitleStyle = getComputedStyle(_dialogTitle),
				_dialogContentStyle = getComputedStyle(_dialogContent),
				_dialogButtonPaneStyle,
				_dialogButtonPaneStyleBefore,
				_dialogButtonStyle;
			if (_buttons.length > 1) {
				_dialogButtonPaneStyle = getComputedStyle(_dialogButtonPane);
				_dialogButtonPaneStyleBefore = getComputedStyle(_dialogButtonPane, ":before");
				_dialogButtonStyle = getComputedStyle(_buttons[1]);
			}
	
			// Calculate minimal width
			_minW = Math.max(_dialog.clientWidth, _minW, 
				+ (_buttons.length > 1 ? 
					+ (_buttons.length - 1) * parseInt(_dialogButtonStyle.width) // .dialog .buttonset button { width: 64px; }
					+ (_buttons.length - 1 - 1) * 16 // .dialog .buttonset button { margin-left: 16px; } // but not for first-child
					+ (_buttons.length - 1 - 1) * 16 / 2 // The formula is not correct, however, with fixed value 16 for margin-left: 16px it works
					: 0 )
				);
			_dialog.style.width = _minW + 'px';
			
			// Calculate minimal height
			_minH = Math.max(_dialog.clientHeight, _minH, 
				+ parseInt(_dialogContentStyle.top) // .dialog .content { top: 48px } 
				+ (2 * parseInt(_dialogStyle.border)) // .dialog { border: 1px }
				+ 16 // ?
				+ 12 // .p { margin-block-start: 1em; } // default
				+ 12 // .dialog { font-size: 12px; } // 1em = 12px
				+ 12 // .p { margin-block-end: 1em; } // default
				+(_buttons.length > 1 ?
					+ parseInt(_dialogButtonPaneStyleBefore.borderBottom) // .dialog .buttonpane:before { border-bottom: 1px; }
					- parseInt(_dialogButtonPaneStyleBefore.top) // .dialog .buttonpane:before { height: 0; top: -16px; }
					+ parseInt(_dialogButtonPaneStyle.height) // .dialog .buttonset button { height: 32px; }
					+ parseInt(_dialogButtonPaneStyle.bottom) // .dialog .buttonpane { bottom: 16px; }
					: 0 )
				);
			_dialog.style.height = _minH + 'px';
	
			_setDialogContent();
			
			// center the dialog box
			_dialog.style.left = ((window.innerWidth - _dialog.clientWidth) / 2) + 'px';
			_dialog.style.top = ((window.innerHeight - _dialog.clientHeight) / 2) + 'px';
			
			_dialog.style.display = 'none'; // Let's hide it again..
			_dialog.style.visibility = 'visible'; // and undo visibility = 'hidden'
	
			_dialogTitle.tabIndex = '0';
	
			_tabBoundary = document.createElement('div');
			_tabBoundary.tabIndex = '0';
			_dialog.appendChild(_tabBoundary);
	
			_addEvent(_dialog, 'mousedown', _onMouseDown);
			// mousemove might run out of the dialog during resize, therefore we need to 
			// attach the event to the whole document, but we need to take care not to mess 
			// up normal events outside of the dialog.
			_addEvent(document, 'mousemove', _onMouseMove);
			// mouseup might happen out of the dialog during resize, therefore we need to 
			// attach the event to the whole document, but we need to take care not to mess 
			// up normal events outside of the dialog.
			_addEvent(document, 'mouseup', _onMouseUp);
			if (_buttons[0].textContent == '') // Use default symbol X if no other symbol is provided
				_buttons[0].innerHTML = '&#x2716;'; // use of innerHTML is required to show  Unicode characters
			for (var i = 0; i < _buttons.length; i++) {
				_addEvent(_buttons[i], 'click', _onClick);
				_addEvent(_buttons[i], 'focus', _onFocus);
				_addEvent(_buttons[i], 'blur', _onBlur);
			}
			_addEvent(_dialogTitle, 'focus', _adjustFocus);
			_addEvent(_tabBoundary, 'focus', _adjustFocus);

			//Listener nel bottone per aprire editor in new page
			_addEvent(_openExternal, 'click', _openInExternal);
	
			_zIndex = _dialog.style.zIndex;
		};
	
		// Execute constructor
		_init(id, callback);
	
		// Public interface 
		this.showDialog = _showDialog;
		return this;
	}
	




/**
 * Cambio icon dinamicamente sulla base del tema!
 */


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
	chrome.runtime.sendMessage(
		{
			action:'changeExtensionIcon',
			data: 'light'
		}
	);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
	chrome.runtime.sendMessage(
		{
			action:'changeExtensionIcon',
			data: 'dark'
		}
	);
}

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
	chrome.runtime.sendMessage(
		{
			action:'changeExtensionIcon',
			data: e.matches ? "light" : "dark"
		}
	);
});



/**
 * Controllo aggiornamenti
 */

//Mi serve per controllare quando ho cercato gli aggiornamenti
 function diff_hours(dt2, dt1) {
	var diff =(dt2.getTime() - dt1.getTime()) / 1000;
	diff /= (60 * 60);
	return Math.abs(Math.round(diff));
 }

 Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//Verifico se l'utente ha abilitato le notifiche (se non le ha abilitate tanto vale non fare nulla)
chrome.storage.sync.get(['notificheAbilitate', 'notificheGiorniReminder' ], (result) => {
	if(result.notificheAbilitate){
		chrome.storage.local.get(['lastUpdateCheck', 'lastNotifiedVersion', 'dateVersionDetected'], async (resultLocal) => {
			if(resultLocal.lastUpdateCheck){ //Mi dice quando è stato fatto l'ultimo controllo
				console.log(diff_hours(new Date(resultLocal.lastUpdateCheck), new Date()));
				if(diff_hours(new Date(resultLocal.lastUpdateCheck), new Date())>=24){ //Controlliamo se ci sono aggiornamenti ogni 24 ore
					//E'da almeno 6 ore che non cerco aggiornamenti, lo faccio
					var versioneAttiva=chrome.runtime.getManifest().version;
					//versioneAttiva=versioneAttiva.replace('2','1'); //Togliere
					var versioneRilevata= await checkUpdate();
					if(versioneAttiva<versioneRilevata){
						//E' disponibile un aggiornamento, controllo se già lo conoscevo e quando è che lo ho trovato
						if(versioneRilevata ==resultLocal.lastNotifiedVersion){
							//Lo conoscevo già, controllo se posso mandare la notifica all'utente oppure se sono passati troppi giorni
							if(new Date(resultLocal.dateVersionDetected).addDays(result.notificheGiorniReminder)>=new Date()){
								//Invio la notifica all'utente
								chrome.runtime.sendMessage(
									{
										action:'notify',
									}
								);
							}
						}else{
							//nuovo update, aggiorno le variabili e notifico
							chrome.storage.local.set(
								{
								'lastNotifiedVersion': versioneRilevata,
								'dateVersionDetected':new Date().toISOString()

							}, function() {});
							chrome.runtime.sendMessage(
								{
									action:'notify',
								}
							);
						}

					}
				}
				
			}else{
				//Controllo se ci sono aggiornamenti e aggiorno la variabile dell'ultimo controllo (l'utente non ha mai verificato se ci fossero update)
				checkUpdate();
			}
		  
		  });
	}
  });


  //Funzione che restituisce l'ultima versione disponibile dell'estensione e aggiorna la variabile locale che indica che l'ultima volta in cui è stato fatto l'update
  async function checkUpdate(){
	return fetch('https://raw.githubusercontent.com/LODYZ/darkPlatform/main/manifest.json').then(r => r.text()).then(result => {
		chrome.storage.local.set(
			{
			'lastUpdateCheck': new Date().toISOString()		
		}, function() {});
	  return JSON.parse(result).version;
	})
  }



