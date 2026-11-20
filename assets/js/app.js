const form=document.getElementById('surveyForm');
const questions=Array.from({length:9},(_,i)=>`q${i+1}`);
const progressFill=document.getElementById('progressFill');
const progressText=document.getElementById('progressText');
const statusBox=document.getElementById('formStatus');
const submitButton=document.getElementById('submitButton');
const iframe=document.getElementById('submitFrame');
const API_URL='https://script.google.com/macros/s/AKfycbzyKXzM-nLs5c52tVpJ90SRfM5Lyy5V9i_lOdRDbBW0lVfuzoaPVBPuuqaRvu1dgXvHAg/exec';
form.action=API_URL;
function answeredCount(){return questions.filter(q=>q==='q9'?form.querySelectorAll('[name="q9"]:checked').length>0:form.querySelector(`[name="${q}"]:checked`)).length;}
function updateProgress(){const n=answeredCount();progressText.textContent=`${n} de 9 respondidas`;progressFill.style.width=`${n/9*100}%`;}
form.addEventListener('change',updateProgress);
form.addEventListener('submit',e=>{
  const q9=form.querySelectorAll('[name="q9"]:checked');
  if(!q9.length){e.preventDefault();alert('Seleccione al menos un aspecto en la pregunta 9.');return;}
  if(!form.reportValidity()){e.preventDefault();return;}
  submitButton.disabled=true;submitButton.textContent='Enviando encuesta...';
  statusBox.className='form-status info';statusBox.textContent='Estamos registrando su respuesta. Por favor, espere.';
});
window.addEventListener('message',e=>{
  if(!e.data||e.data.tipo!=='INJUVE_ENCUESTA')return;
  if(e.data.ok){form.reset();updateProgress();statusBox.className='form-status info';statusBox.textContent='¡Gracias! Su encuesta fue registrada correctamente. Sus respuestas contribuirán a mejorar el Portal Único de Transparencia.';submitButton.disabled=false;submitButton.innerHTML='Enviar encuesta <span aria-hidden="true">→</span>';}
  else{statusBox.className='form-status error';statusBox.textContent=e.data.mensaje||'No fue posible registrar la encuesta. Intente nuevamente.';submitButton.disabled=false;submitButton.innerHTML='Enviar encuesta <span aria-hidden="true">→</span>';}
});
updateProgress();
