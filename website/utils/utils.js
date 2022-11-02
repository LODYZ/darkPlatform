/**
 * Azione che permette di far comparire gli alert voluti
 * Inserire nella pagina un elemento con id liveAlertPlaceholder
 */

 const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

 const alert = (message, type) => {
 const wrapper = document.createElement('div')
 wrapper.innerHTML = [
     `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
     `   <div>${message}</div>`,
     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
     '</div>'
 ].join('')
 
 fadeIn(wrapper, 400);
 
 setTimeout(()=>{
     fadeOut(wrapper, 400);
 },2000);
 
 alertPlaceholder.append(wrapper);
 }
 
 
 function fadeIn( elem, ms )
 {
   if( ! elem )
     return;
 
   elem.style.opacity = 0;
   elem.style.filter = "alpha(opacity=0)";
   elem.style.display = "block";
   elem.style.visibility = "visible";
 
   if( ms )
   {
     var opacity = 0;
     var timer = setInterval( function() {
       opacity += 50 / ms;
       if( opacity >= 1 )
       {
         clearInterval(timer);
         opacity = 1;
       }
       elem.style.opacity = opacity;
       elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
     }, 50 );
     
   }
   else
   {
     elem.style.opacity = 1;
     elem.style.filter = "alpha(opacity=1)";
   }
 }
 
 function fadeOut( elem, ms )
 {
   if( ! elem )
     return;
 
   if( ms )
   {
     var opacity = 1;
     var timer = setInterval( function() {
       opacity -= 50 / ms;
       if( opacity <= 0 )
       {
         clearInterval(timer);
         opacity = 0;
         elem.style.display = "none";
         elem.style.visibility = "hidden";
       }
       elem.style.opacity = opacity;
       elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
     }, 50 );
   }
   else
   {
     elem.style.opacity = 0;
     elem.style.filter = "alpha(opacity=0)";
     elem.style.display = "none";
     elem.style.visibility = "hidden";
   }
 }
 