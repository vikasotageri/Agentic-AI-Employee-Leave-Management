// ===== Navigation, Auth Guard & Login =====
// Dependencies: api.js
function loadPage(url){
  if(!isAuthenticated()&&url!=='/employee/login'){window.location.href='/employee/login';return}
  window.location.href=url
}

function logout(){
  const u=getUser()
  const role=(u&&u.role)||'employee'
  const loginPages={hr:'/hr/login',manager:'/manager/login',employee:'/employee/login'}
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  window.location.href=loginPages[role]||'/employee/login'
}

// ===== Auth guard (runs on every page load, including bfcache back-navigation) =====
(function guard(){
  const path=window.location.pathname
  const pub=['/employee/login','/manager/login','/hr/login']
  if(!isAuthenticated()&&!pub.includes(path)){
    if (path.startsWith('/employee')) window.location.href='/employee/login'
    else if (path.startsWith('/manager')) window.location.href='/manager/login'
    else if (path.startsWith('/hr')) window.location.href='/hr/login'
    return
  }
  if(isAuthenticated()&&pub.includes(path)){
    const u=getUser()
    if(u){
      const routes={hr:'/hr',manager:'/manager',employee:'/employee'}
      window.location.href=routes[u.role]||'/employee'
    }
  }
})()
// Also catch browser back-button bfcache restore
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    const path=window.location.pathname
    const pub=['/employee/login','/manager/login','/hr/login']
    if(!isAuthenticated()&&!pub.includes(path)){
      window.location.reload()
    }
  }
})
// ===== Login =====
document.addEventListener('DOMContentLoaded',function(){
  const form=document.getElementById('loginForm')
  if(!form) return initNavbar()
  form.addEventListener('submit',async function(e){
    e.preventDefault()
    const error=document.getElementById('loginError')
    error.classList.add('hidden')
    try{
      const res=await apiPost('/auth/login',{email:document.getElementById('email').value,password:document.getElementById('password').value})
      if(res.success&&res.token){
        sessionStorage.setItem('token',res.token)
        sessionStorage.setItem('user',JSON.stringify(res.user))
        const routes={hr:'/hr',manager:'/manager',employee:'/employee'}
        window.location.href=routes[res.user.role]||'/employee'
      }
    }catch(e){
      error.textContent=e.message
      error.classList.remove('hidden')
    }
  })

window.fillLogin = function(email, pass) {
  document.getElementById('email').value = email
  document.getElementById('password').value = pass
}
})
