const API_URL='https://script.google.com/macros/s/AKfycbzyKXzM-nLs5c52tVpJ90SRfM5Lyy5V9i_lOdRDbBW0lVfuzoaPVBPuuqaRvu1dgXvHAg/exec';
const dashboard=document.getElementById('dashboard');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(data){
 if(!data||!data.ok)throw new Error('No se pudieron obtener los resultados.');
 const total=Number(data.total||0);
 let html=`<div class="results-grid"><div class="metric"><strong>${total.toLocaleString('es-HN')}</strong><span>Encuestas recibidas</span></div><div class="metric"><strong>${data.updatedAt?esc(data.updatedAt):'—'}</strong><span>Última actualización</span></div></div>`;
 if(!total){html+='<div class="result-card"><p class="results-note">Aún no se han registrado respuestas. Los resultados aparecerán aquí cuando se reciban las primeras encuestas.</p></div>';dashboard.innerHTML=html;return;}
 data.questions.forEach(q=>{const sum=q.options.reduce((a,o)=>a+Number(o.count||0),0);html+=`<section class="result-card"><h3>${esc(q.title)}</h3>`;q.options.forEach(o=>{const pct=sum?Math.round(Number(o.count||0)/sum*100):0;html+=`<div class="result-row"><div class="result-meta"><span>${esc(o.label)}</span><strong>${o.count} · ${pct}%</strong></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;});html+='</section>';});
 html+='<p class="results-note">Los porcentajes se calculan sobre las respuestas registradas para cada pregunta. En la pregunta 9 se permiten selecciones múltiples, por lo que el total de selecciones puede superar el número de encuestas.</p>';dashboard.innerHTML=html;
}
function load(){const callback='injuveSurveyStats';window[callback]=data=>{try{render(data);}catch(e){dashboard.innerHTML=`<p class="error">${esc(e.message)}</p>`;}};const s=document.createElement('script');s.src=`${API_URL}?action=stats&callback=${callback}&_=${Date.now()}`;s.onerror=()=>dashboard.innerHTML='<p class="error">No fue posible conectar con el servicio de resultados. Intente más tarde.</p>';document.body.appendChild(s);}
load();
