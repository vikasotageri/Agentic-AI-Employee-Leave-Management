// ===== Clock, Notifications & Navbar =====
// Dependencies: api.js, utils.js
function updateClock(){
  const now=new Date()
  const timeEl=document.getElementById('clockDisplay')
  const dateEl=document.getElementById('dateDisplay')
  if(timeEl) timeEl.textContent=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  if(dateEl) dateEl.textContent=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})
}
setInterval(updateClock,1000)
updateClock()

// ===== Notifications =====
async function loadNotifications(){
  const u=getUser()
  if(!u) return
  try{
    const notifs=await apiGet('/notifications/'+u.id)
    const unread=notifs.filter(n=>!n.read)
    const badge=document.getElementById('notifBadge')
    if(badge){
      if(unread.length>0){badge.textContent=unread.length;badge.classList.remove('hidden')}
      else badge.classList.add('hidden')
    }
    const dd=document.getElementById('notifDropdown')
    if(dd){
      if(notifs.length===0) dd.innerHTML='<div class="p-4 text-sm text-gray-400 text-center">No notifications</div>'
      else dd.innerHTML=`
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 sticky top-0">
          <span class="text-sm font-semibold text-gray-700">Notifications</span>
          <button onclick="clearAllNotifs()" class="text-xs text-red-600 hover:text-red-800 font-medium">🗑️ Clear All</button>
        </div>
        ${notifs.slice(0,10).map(n=>`
          <div class="px-4 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer text-sm flex items-start gap-2 transition ${n.read?'':'bg-blue-50 font-medium'}" onclick="markNotifRead('${n.id}')">
            <span class="mt-0.5 ${n.read?'opacity-30':'opacity-100'}">${n.type==='employee_created'?'🎉':n.type==='account_created'?'👋':n.type==='leave_approved'||n.message?.includes('Approval')?'✅':'📌'}</span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-800 truncate">${n.title}</p>
              <p class="text-gray-500 text-xs mt-0.5 truncate">${n.message?.substring(0,80)||''}</p>
            </div>
            ${!n.read?'<span class="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>':''}
          </div>
        `).join('')}
      `
    }
  }catch(e){console.error('Notif error:',e)}
}

window.markNotifRead=async function(id){
  try{
    await apiPut('/notifications/'+id+'/read',{})
    loadNotifications()
  }catch(e){console.error('Error marking read:',e)}
}

window.clearAllNotifs=async function(){
  const u=getUser()
  if(!u) return
  if(!confirm('Clear all notifications?')) return
  try{
    await apiDelete('/notifications/'+u.id+'/clear-all')
    loadNotifications()
  }catch(e){console.error('Error clearing all:',e)}
}

// Poll notifications every 30 seconds
setInterval(() => {
  if(isAuthenticated()) loadNotifications()
}, 30000)

document.addEventListener('click',function(e){
  const bell=document.getElementById('notificationBell')
  const dd=document.getElementById('notifDropdown')
  if(!bell||!dd) return
  if(bell.contains(e.target)){
    dd.classList.toggle('hidden')
    if(!dd.classList.contains('hidden')) loadNotifications()
  } else if(!dd.contains(e.target)) dd.classList.add('hidden')
})

function initNavbar(){
  const u=getUser()
  const nav=document.getElementById('navbar')
  const navLinks=document.getElementById('navLinks')
  const userDisplay=document.getElementById('userDisplay')
  if(!u||!nav){document.title='Login - AI Solution Ltd';return}
  nav.classList.remove('hidden')
  const links={
    hr:[],
    manager:[]
  }
  if(navLinks){
    const roleLinks=links[u.role]||[]
    navLinks.innerHTML=roleLinks.map(l=>`<a href="${l.href}" class="hover:text-blue-600 ${window.location.pathname===l.href?'text-blue-600':''}">${l.label}</a>`).join('')
  }
  if(userDisplay){
    const seniorTitles={hr:'Senior HR',manager:'Senior Manager'}
    const title=seniorTitles[u.role]
    userDisplay.textContent=title?u.name+' - '+title:u.name
  }
  document.title=u.role.charAt(0).toUpperCase()+u.role.slice(1)+' - AI Solution Ltd'
  loadNotifications()
  if(u.role==='hr'&&window.location.pathname==='/hr') loadEmployeeList()
}

