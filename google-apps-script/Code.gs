/***** INJUVE | Encuesta de satisfacción del Portal Único de Transparencia *****/
const CONFIG={
  SPREADSHEET_ID:'1c6c4mgjaECIGf0e17LvSNqL1gO_BzqbQ77SJjj1OX_Y',
  SHEET_NAME:'Respuestas'
};
const QUESTIONS=[
 {key:'q1',title:'1. Frecuencia de consulta',options:['Diariamente','Semanalmente','Mensualmente','Trimestralmente','Ocasionalmente','Primera vez que lo consulta']},
 {key:'q2',title:'2. Encontró la información pública que buscaba',options:['Sí','Parcialmente','No','No aplica']},
 {key:'q3',title:'3. Facilidad de acceso a la información',options:['Totalmente de acuerdo','De acuerdo','Ni de acuerdo ni en desacuerdo','En desacuerdo','Totalmente en desacuerdo']},
 {key:'q4',title:'4. Organización y presentación de la información',options:['Excelente','Muy buena','Buena','Regular','Deficiente']},
 {key:'q5',title:'5. Actualización y disponibilidad de la información',options:['Siempre','Casi siempre','Algunas veces','Nunca','No sabe / No responde']},
 {key:'q6',title:'6. Claridad, comprensión y suficiencia de la información',options:['Sí, totalmente','Parcialmente','No','No aplica']},
 {key:'q7',title:'7. Grado de satisfacción con el funcionamiento del Portal',options:['Muy satisfecho','Satisfecho','Neutral','Insatisfecho','Muy insatisfecho']},
 {key:'q8',title:'8. Experiencia general al consultar el Portal',options:['Excelente','Muy buena','Buena','Regular','Deficiente']},
 {key:'q9',title:'9. Aspectos que deberían fortalecerse',options:['Actualización de la información','Accesibilidad y facilidad de navegación','Organización de la información','Disponibilidad de documentos','Ampliación de la información publicada','Otros'],multiple:true}
];
function sheet_(){return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);}
function jsonp_(obj,callback){const body=JSON.stringify(obj);const safe=/^[a-zA-Z_$][\w.$]*$/.test(callback||'')?callback:null;return ContentService.createTextOutput(safe?`${safe}(${body});`:body).setMimeType(safe?ContentService.MimeType.JAVASCRIPT:ContentService.MimeType.JSON);}
function doGet(e){const action=e&&e.parameter&&e.parameter.action;if(action==='stats'){return jsonp_(getStats_(),e.parameter.callback||'');}return ContentService.createTextOutput('INJUVE Encuesta API activa');}
function doPost(e){let result={tipo:'INJUVE_ENCUESTA',ok:false,mensaje:'No fue posible registrar la encuesta.'};try{
 const p=e.parameter||{};const all=e.parameters||{};const values=QUESTIONS.map(q=>{let v=q.multiple?(all[q.key]||[]):(p[q.key]||'');if(q.multiple&&Array.isArray(v))v=v.join(' | ');if(!q.multiple&&!q.options.includes(v))throw new Error('Respuesta no válida.');if(q.multiple){const chosen=v.split(' | ').filter(Boolean);if(!chosen.length||chosen.some(x=>!q.options.includes(x)))throw new Error('Respuesta no válida.');}return v;});
 const lock=LockService.getScriptLock();lock.waitLock(10000);try{const sh=sheet_();if(!sh)throw new Error('No existe la pestaña de respuestas.');if(sh.getLastRow()===0)sh.appendRow(['Fecha de recepción',...QUESTIONS.map(q=>q.title)]);sh.appendRow([new Date(),...values]);}finally{lock.releaseLock();}
 result={tipo:'INJUVE_ENCUESTA',ok:true};
 }catch(err){console.error(err);result.mensaje='Ocurrió un inconveniente al registrar la encuesta. Intente nuevamente.';}
 const html=`<!doctype html><html><body><script>window.top.postMessage(${JSON.stringify(result)},'*');</script></body></html>`;return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function getStats_(){try{const sh=sheet_();if(!sh||sh.getLastRow()<2)return{ok:true,total:0,updatedAt:'',questions:QUESTIONS.map(q=>({title:q.title,options:q.options.map(label=>({label,count:0}))}))};const rows=sh.getRange(2,1,sh.getLastRow()-1,QUESTIONS.length+1).getValues();const totals=QUESTIONS.map(q=>{const counts={};q.options.forEach(o=>counts[o]=0);rows.forEach(row=>{const cell=String(row[QUESTIONS.indexOf(q)+1]||'');if(q.multiple)cell.split(' | ').filter(Boolean).forEach(v=>{if(v in counts)counts[v]++;});else if(cell in counts)counts[cell]++;});return{title:q.title,options:q.options.map(label=>({label,count:counts[label]}))};});const last=rows[rows.length-1][0];return{ok:true,total:rows.length,updatedAt:last?Utilities.formatDate(new Date(last),Session.getScriptTimeZone(),'dd/MM/yyyy HH:mm'):'',questions:totals};}catch(err){console.error(err);return{ok:false};}}
