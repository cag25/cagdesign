(function(){
'use strict';
window.__caq=true;
var d=document,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#year').textContent=new Date().getFullYear();
// header
var header=$('.site-header');
function onScroll(){header.classList.toggle('is-scrolled',window.scrollY>8)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile menu
var toggle=$('.menu-toggle'),label=$('.menu-toggle__label'),nav=$('#site-nav');
function setNav(open){d.body.classList.toggle('nav-open',open);toggle.setAttribute('aria-expanded',open);label.textContent=open?'Close':'Menu';if(open){var f=$('a',nav);f&&f.focus()}}
toggle.addEventListener('click',function(){setNav(!d.body.classList.contains('nav-open'))});
nav.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false)});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.body.classList.contains('nav-open')){setNav(false);toggle.focus()}});
window.matchMedia('(min-width: 901px)').addEventListener('change',function(m){if(m.matches)setNav(false)});
// active nav link
if('IntersectionObserver' in window){
var links={};$$('#site-nav a[href^="#"]').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
var so=new IntersectionObserver(function(es){es.forEach(function(e){var a=links[e.target.id];if(!a||a.classList.contains('btn'))return;if(e.isIntersecting){$$('#site-nav a[aria-current]').forEach(function(x){x.removeAttribute('aria-current')});a.setAttribute('aria-current','true')}})},{rootMargin:'-45% 0px -50% 0px'});
['work','services','about','contact'].forEach(function(id){var s=d.getElementById(id);s&&so.observe(s)});
// reveals
var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');ro.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
$$('.reveal').forEach(function(el){ro.observe(el)});
}else{$$('.reveal').forEach(function(el){el.classList.add('is-in')})}
// filters
var grid=$('#grid'),tiles=$$('.tile:not(.tile--cta)',grid),cta=$('.tile--cta',grid),btns=$$('.filters button');
btns.forEach(function(b){b.addEventListener('click',function(){
var f=b.getAttribute('data-filter');
btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
grid.classList.toggle('is-filtered',f!=='all');if(cta)cta.hidden=f!=='all';
tiles.forEach(function(t){var show=f==='all'||t.getAttribute('data-cat')===f;t.hidden=!show;if(show)t.classList.add('is-in')});
})});
// lightbox
var lb=$('#lightbox'),lbImg=$('#lb-img'),lbCap=$('#lb-cap'),cur=0,list=[];
function show(i){list=tiles.filter(function(t){return!t.hidden});cur=(i+list.length)%list.length;var t=list[cur],a=$('a',t),im=$('img',t);
lbImg.src=a.getAttribute('href');lbImg.alt=im.alt;lbCap.innerHTML='<strong></strong><span></span>';$('strong',lbCap).textContent=a.getAttribute('data-title');$('span',lbCap).textContent=t.getAttribute('data-cat')+' \u00b7 '+(cur+1)+' of '+list.length}
grid.addEventListener('click',function(e){var a=e.target.closest('.tile:not(.tile--cta) a');if(!a||typeof lb.showModal!=='function')return;e.preventDefault();list=tiles.filter(function(t){return!t.hidden});show(list.indexOf(a.parentNode));lb.showModal()});
lb.addEventListener('click',function(e){var act=e.target.getAttribute&&e.target.getAttribute('data-act');if(act==='close'||e.target===lb)lb.close();else if(act==='prev')show(cur-1);else if(act==='next')show(cur+1)});
lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1)});
// service enquiry prefill
var sel=$('#f-service');
$$('[data-service]').forEach(function(a){a.addEventListener('click',function(){sel.value=a.getAttribute('data-service');if(sel.value!==a.getAttribute('data-service')){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===a.getAttribute('data-service'))sel.selectedIndex=i}}})});
// contact form (Formspree, endpoint taken from the form's own action)
var form=$('#project-form'),status=$('#form-status');
var msgs={name:'Enter your name.',email:'Enter a valid email address.',message:'Describe your project so I know how to help.'};
function check(){var ok=true;['name','email','message'].forEach(function(n){var el=form.elements[n],er=$('#e-'+n);var bad=!el.value.trim()||!el.checkValidity();el.setAttribute('aria-invalid',bad);if(bad){er.textContent=msgs[n];el.setAttribute('aria-describedby','e-'+n);ok=false}else{er.textContent='';el.removeAttribute('aria-describedby')}});return ok}
function say(t,c){status.className='status '+(c||'');status.textContent=t}
form.addEventListener('input',function(e){if(e.target.getAttribute('aria-invalid')==='true')check()});
form.addEventListener('submit',function(e){
e.preventDefault();say('');
if(!check()){var bad=$('[aria-invalid="true"]',form);bad&&bad.focus();return}
form.classList.add('is-busy');
fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}}).then(function(r){
if(r.ok){form.reset();say('Message sent. I will reply to the email address you provided.','is-ok')}
else return r.json().then(function(j){throw new Error(j&&j.errors?j.errors.map(function(x){return x.message}).join(' '):'')},function(){throw new Error('')})
}).catch(function(err){say('Your message was not sent. '+(err.message?err.message+' Fix this and try again.':'The form service could not be reached. Check your connection and try again.')+' You can also message me on Instagram or LinkedIn.','is-bad')}).then(function(){form.classList.remove('is-busy')});
});
})();
