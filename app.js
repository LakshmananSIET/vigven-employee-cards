const DATA_FILE = 'employees.json';

function basePath(){
  const p = location.pathname;
  const i = p.lastIndexOf('/');
  return i >= 0 ? p.slice(0,i+1) : './';
}

function clean(v){ return v == null ? '' : String(v).trim(); }
function esc(v){return clean(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function initials(name){return clean(name).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'V';}
function normalize(row){
  const out={}; Object.keys(row||{}).forEach(k=>out[k.trim().toLowerCase()]=row[k]);
  return out;
}
async function loadEmployees(){
  const res=await fetch(basePath()+DATA_FILE+'?v='+Date.now(),{cache:'no-store'});
  if(!res.ok) throw new Error('Employee data not found');
  return (await res.json()).map(normalize).filter(r=>clean(r.id));
}
function cardUrl(id){return new URL('card.html?id='+encodeURIComponent(id),location.href).href;}
function imageUrl(value){
  const v=clean(value); if(!v)return '';
  if(/^https?:\/\//i.test(v)) return v;
  return basePath()+v.replace(/^\//,'');
}
function contact(label,href,text,icon){return `<a class="contact" href="${esc(href)}"><span class="icon">${icon}</span><span class="contact-text"><strong>${esc(label)}</strong><br>${esc(text)}</span></a>`;}
function vcard(e){
  const lines=['BEGIN:VCARD','VERSION:3.0','FN:'+clean(e.employeename),'ORG:'+clean(e.companyname||'VIGVEN'),'TITLE:'+clean(e.designation),'EMAIL:'+clean(e.email),'TEL:'+clean(e.phone),'URL:'+clean(e.website),'END:VCARD'];
  return lines.join('\r\n');
}
function saveContact(e){
  const blob=new Blob([vcard(e)],{type:'text/vcard;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(clean(e.employeename)||'employee')+'.vcf'; a.click(); URL.revokeObjectURL(a.href);
}
function renderCard(e){
  const root=document.getElementById('card'); const name=clean(e.employeename); const photo=imageUrl(e.employeeimage); const company=clean(e.companyname)||'VIGVEN';
  const links=[];
  if(clean(e.email)) links.push(contact('Email','mailto:'+clean(e.email),clean(e.email),'✉'));
  if(clean(e.phone)) links.push(contact('Phone','tel:'+clean(e.phone),clean(e.phone),'☎'));
  if(clean(e.linkedin)) links.push(contact('LinkedIn',clean(e.linkedin),clean(e.linkedin),'in'));
  if(clean(e.website)) links.push(contact('Website',clean(e.website),clean(e.website),'↗'));
  if(clean(e.address)) links.push(`<div class="contact"><span class="icon">⌖</span><span class="contact-text"><strong>Address</strong><br>${esc(e.address)}</span></div>`);
  root.className='business-card';
  root.innerHTML=`<div class="card-top"><div class="logo">${esc(company)}</div><div class="profile">${photo?`<img class="photo" src="${esc(photo)}" alt="${esc(name)}" onerror="this.outerHTML='<div class=\'initials\'>${esc(initials(name))}</div>'">`:`<div class="initials">${esc(initials(name))}</div>`}<div><h1 class="name">${esc(name)}</h1><p class="designation">${esc(e.designation)}</p><p class="department">${esc(e.department)}</p></div></div></div><div class="card-body"><div class="contact-list">${links.join('')}</div><div class="actions"><button class="btn primary" id="saveContact">Save Contact</button><a class="btn secondary" href="${esc(cardUrl(e.id))}">Permanent Link</a></div></div><div class="footer">Digital business card • Vigven</div>`;
  document.title=name+' | '+company;
  document.getElementById('saveContact').onclick=()=>saveContact(e);
}
async function start(){
  try{
    const employees=await loadEmployees();
    const id=new URLSearchParams(location.search).get('id');
    if(!id){ if(location.pathname.toLowerCase().endsWith('card.html')) throw new Error('Missing employee ID.'); return; }
    const e=employees.find(x=>clean(x.id).toLowerCase()===clean(id).toLowerCase() && clean(x.active).toLowerCase()!=='false' && clean(x.active)!=='0');
    if(!e) throw new Error('Employee card not found.');
    renderCard(e);
  }catch(err){
    const root=document.getElementById('card');
    if(root) root.innerHTML=`<div class="error"><h2>Card unavailable</h2><p>${esc(err.message)}<br>Please check the employee ID or employee data.</p></div>`;
    else document.querySelector('.landing-card').innerHTML='<span>Employee data is not available yet.</span>';
  }
}
start();
