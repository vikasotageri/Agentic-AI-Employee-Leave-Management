// ===== Core API & Auth Helpers =====
// Dependencies: none
function getToken(){return sessionStorage.getItem('token')}
function getUser(){try{return JSON.parse(sessionStorage.getItem('user'))}catch{return null}}
function isAuthenticated(){return !!getToken()}

window.pickDate=function(displayId,pickerId){
  const picker=document.getElementById(pickerId)
  if(!picker) return
  picker.value=''
  picker.style.visibility='visible'
  picker.style.position='fixed'
  picker.style.left='0'
  picker.style.top='0'
  picker.style.opacity='0.01'
  picker.style.pointerEvents='none'
  const handler=function(){
    if(picker.value){
      document.getElementById(displayId).value=picker.value.split('-').reverse().join('-')
    }
    picker.style.visibility='hidden'
    picker.style.left='-9999px'
    picker.removeEventListener('change',handler)
    picker.removeEventListener('blur',handler)
  }
  picker.addEventListener('change',handler)
  picker.addEventListener('blur',handler)
  setTimeout(()=>{
    try{picker.showPicker()}catch(e){console.warn('showPicker failed',e)}
  },50)
}

function apiRequest(method, path, body){
  const opts={method,headers:{'Content-Type':'application/json'}}
  if(body) opts.body=JSON.stringify(body)
  const t=getToken()
  if(t) opts.headers['Authorization']='Bearer '+t
  return fetch('/api'+path, opts).then(async r=>{
    const d=await r.json()
    if(!r.ok) throw new Error(d.detail||'Request failed')
    return d
  })
}

function apiGet(path){return apiRequest('GET',path)}
function apiPost(path,body){return apiRequest('POST',path,body)}
function apiDelete(path){return apiRequest('DELETE',path)}
function apiPut(path,body){return apiRequest('PUT',path,body)}
