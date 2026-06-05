// ===== HR Dashboard Functions =====
// Dependencies: api.js, utils.js, auth.js, notifications.js
let selectedEmployeeId=null

async function loadEmployeeList(){
  const list=document.getElementById('employeeList')
  if(!list) return
  try{
    const emps=await apiGet('/employees')
    list.innerHTML=emps.map(e=>{
      const initial=(e.name||'?')[0].toUpperCase()
      const colors=['bg-blue-500','bg-emerald-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500','bg-indigo-500','bg-rose-500']
      const color=colors[e.name?e.name.charCodeAt(0)%colors.length:0]
      const searchData = (e.name||'').toLowerCase()+'|'+(e.id||'').toLowerCase()+'|'+(e.email||'').toLowerCase()
      return `<div data-search="${searchData}" onclick="selectEmployee('${e.id}')" class="p-3 rounded-xl cursor-pointer border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition ${selectedEmployeeId===e.id?'bg-blue-50 border-blue-300 ring-2 ring-blue-200':''}"><div class="flex items-center gap-3"><div class="w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">${initial}</div><div class="flex-1 min-w-0"><p class="font-semibold text-sm text-gray-800 truncate">${e.name}</p><p class="text-xs text-gray-500">${e.id} · ⚤ ${e.gender||'—'}</p><p class="text-xs text-gray-500">Designation: ${e.designation||'—'}${e.projectTag?' · 🏷️ '+e.projectTag:''}</p></div>${e.hasDocument?`<button onclick="event.stopPropagation();viewDocument('${e.id}')" class="text-xs shrink-0 hover:scale-110 transition" title="View document">📄</button>`:''}</div></div>`
    }).join('')
  }catch(e){list.innerHTML='<p class="text-sm text-red-500">Error loading employees</p>'}
}

window.filterEmployeeList=function(){
  const q=document.getElementById('empSearch')?.value.toLowerCase()||''
  document.querySelectorAll('#employeeList > div').forEach(el=>{
    el.style.display=el.getAttribute('data-search')&&el.getAttribute('data-search').includes(q)?'':'none'
  })
}

window.editProjectTagUi=async function(id){
  const tagInputDiv=document.getElementById('tagInput'+id)
  if(!tagInputDiv.classList.contains('hidden')){tagInputDiv.classList.add('hidden');return}
  tagInputDiv.classList.remove('hidden')
  const emp=tagInputDiv.getAttribute('data-current-tag')||''
  tagInputDiv.innerHTML='<input type="text" id="projectTagField'+id+'" placeholder="Enter project name..." class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value="'+emp+'"><button onclick="saveTag(\''+id+'\')" class="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">✓ Tag</button>'
  document.getElementById('projectTagField'+id).focus()
  document.getElementById('projectTagField'+id).setSelectionRange(emp.length,emp.length)
}

window.saveTag=async function(id){
  const input=document.getElementById('projectTagField'+id)
  const tag=input.value.trim()
  try{
    const res=await apiPut('/employees/'+id+'/project-tag',{projectTag:tag||null})
    if(res.success) selectEmployee(id)
  }catch(e){alert('Error: '+e.message)}
}

window.untagEmployee=async function(id){
  try{
    const res=await apiPut('/employees/'+id+'/project-tag',{projectTag:null})
    if(res.success) selectEmployee(id)
  }catch(e){alert('Error: '+e.message)}
}

window.tagEmployeeInline=function(id){
  editProjectTagUi(id)
}

window.selectEmployee=async function(id){
  selectedEmployeeId=id
  sessionStorage.setItem('hrSelectedEmpId', id)
  // Auto-refresh employee data every 15s to pick up changes (e.g. password reset)
  if (window._hrRefreshInterval) clearInterval(window._hrRefreshInterval)
  window._hrRefreshInterval = setInterval(() => {
    if (selectedEmployeeId) {
      apiGet('/employees/' + selectedEmployeeId).then(emp => {
        if (!emp) return
        // Update credentials section only
        const credSection = document.getElementById('empCredSection')
        if (credSection) {
          credSection.innerHTML = `
            <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Employee ID</p><p class="font-bold text-blue-600 mt-0.5">${emp.id}</p></div>
            <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Email</p><p class="font-semibold text-gray-800 mt-0.5 break-all">${emp.email}</p></div>
            <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Password</p><p class="font-mono font-bold text-yellow-700 mt-0.5">${emp.password||'—'}</p></div>
          `
        }
      }).catch(() => {})
    }
  }, 15000)
  loadEmployeeList()
  const profile=document.getElementById('employeeProfile')
  profile.innerHTML='<div class="text-center py-8"><p class="text-gray-400">Loading...</p></div>'
  try{
    const emp=await apiGet('/employees/'+id)
    const lb=emp.leaveBalance||{}
    profile.innerHTML=`
      <!-- Header Box -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">${(emp.name||'?')[0].toUpperCase()}</div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">${emp.name}</h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm text-gray-500">${emp.id}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <span class="text-sm px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">${emp.designation||'—'}</span>
              </div>
            </div>
          </div>
          <button onclick="openDeleteModal('${emp.id}')" class="px-4 py-2 text-red-500 text-sm hover:bg-red-50 rounded-xl font-medium transition flex items-center gap-1.5">🗑 Delete</button>
        </div>
      </div>
      <!-- Employee Info Box -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">📧 Email</p><p class="text-sm font-semibold text-gray-800">${emp.email}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">📞 Phone</p><p class="text-sm font-semibold text-gray-800">${emp.phone||'—'}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">🎂 Date of Birth</p><p class="text-sm font-semibold text-gray-800">${toDisplayDate(emp.dob)}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">📅 Date of Joining</p><p class="text-sm font-semibold text-gray-800">${toDisplayDate(emp.doj)}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">🌍 Nationality</p><p class="text-sm font-semibold text-gray-800">${emp.nationality||'—'}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><p class="text-xs text-gray-500 mb-1">⚤ Gender</p><p class="text-sm font-semibold text-gray-800">${emp.gender||'—'}</p></div>
          ${emp.projectTag
            ? `<div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200" id="projectTagSection${emp.id}"><p class="text-xs text-gray-500 mb-1">🏷️ Project Tag</p><p class="text-sm font-semibold text-gray-800 flex items-center gap-2">🏷️ ${emp.projectTag} <button onclick="editProjectTagUi('${emp.id}')" class="text-blue-500 hover:text-blue-700 text-xs" title="Edit">✏️</button> <button onclick="untagEmployee('${emp.id}')" class="text-red-500 hover:text-red-700 text-xs" title="Remove tag">✕ Untag</button></p><div id="tagInput${emp.id}" class="hidden mt-2 flex flex-col gap-2 w-full" data-current-tag="${emp.projectTag}"></div></div>`
            : `<div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"><div class="flex flex-col items-center"><button onclick="editProjectTagUi('${emp.id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition">+ Add Project Tag</button><div id="tagInput${emp.id}" class="hidden mt-2 flex flex-col gap-2 w-full"></div></div></div>`}
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 col-span-2"><p class="text-xs text-gray-500 mb-1">📍 Address</p><p class="text-sm font-semibold text-gray-800">${emp.address||'—'}</p></div>
          <div class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p class="text-xs text-gray-500 mb-1">📄 Document</p>
            <div class="flex items-center gap-2 mt-1">
              ${emp.document?`<button onclick="viewDocument('${emp.id}')" class="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">📄 View</button><button onclick="replaceDocument('${emp.id}')" class="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">🔄 Replace</button>`:`<button onclick="replaceDocument('${emp.id}')" class="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">📄 Upload</button>`}
            </div>
          </div>
        </div>
      </div>
      <!-- Credentials Box -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">🔑 Credentials</h3>
          <button onclick="copyProfileCredentials('${emp.id}')" class="text-xs px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 font-medium transition" id="copyCredBtn${emp.id}">📋 Copy Credentials</button>
        </div>
        <div class="grid grid-cols-3 gap-3" id="empCredSection">
          <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Employee ID</p><p class="font-bold text-blue-600 mt-0.5">${emp.id}</p></div>
          <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Email</p><p class="font-semibold text-gray-800 mt-0.5 break-all">${emp.email}</p></div>
          <div class="p-3 bg-white rounded-xl border border-gray-200"><p class="text-xs text-gray-500">Password</p><p class="font-mono font-bold text-yellow-700 mt-0.5">${emp.password||'—'}</p></div>
        </div>
      </div>
      <!-- Leave Balance Box -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
        <h3 class="font-semibold text-gray-700 mb-3">📊 Leave Balance</h3>
        <div class="grid grid-cols-5 gap-3">
          ${[['sick','Sick'],['casual','Casual'],['business','Business'],['emergency','Emergency/Personal'],['family','Family/Vacation']].map(([t,label])=>{
            const lt=lb[t]||{}
            const remaining=lt.remaining||0
            const limit=lt.limit||0
            const pct=limit>0?Math.round(((limit-remaining)/limit)*100):0
            return `<div class="p-3 bg-white rounded-xl border border-gray-200 text-center"><p class="text-xs text-gray-500 mb-2">${label}</p><div class="text-2xl font-bold ${remaining>0?'text-green-600':'text-red-500'}">${remaining}</div></div>`
          }).join('')}
        </div>
      </div>
      <!-- Leave History Box -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">📋 Leave History</h3>
        </div>
        <div class="flex gap-2 mb-2">
          <input id="hrLeaveSearch" oninput="applyHrLeaveFilter()" placeholder="🔍 Search by Request ID or Leave date..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400">
          <select id="hrLeaveTypeFilter" onchange="applyHrLeaveFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 bg-white">
            <option value="">All Types</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="emergency">Emergency</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select id="hrLeaveStatusFilter" onchange="applyHrLeaveFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 bg-white">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="auto-approved">Auto-Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancellation_requested">Cancellation Pending</option>
          </select>
          <select id="hrLeaveMonthFilter" onchange="applyHrLeaveFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 bg-white">
            <option value="">All Months</option>
            <option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option>
            <option value="4">Apr</option><option value="5">May</option><option value="6">Jun</option>
            <option value="7">Jul</option><option value="8">Aug</option><option value="9">Sep</option>
            <option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>
          </select>
          <select id="hrLeaveYearFilter" onchange="applyHrLeaveFilter()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400 bg-white">
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th class="px-3 py-2 text-left">Request ID</th>
                <th class="px-3 py-2 text-left">Applied On</th>
                <th class="px-3 py-2 text-left">Type</th>
                <th class="px-3 py-2 text-left">Leave on</th>
                <th class="px-3 py-2 text-left">Reason</th>
                <th class="px-3 py-2 text-left">Status</th>
                <th class="px-3 py-2 text-left">Document</th>
              </tr>
            </thead>
            <tbody id="empLeaveHistoryBody"></tbody>
          </table>
          <div id="empLeaveHistoryEmpty" class="text-gray-400 text-sm text-center py-4 hidden">No leave records yet</div>
          <div id="hrLeavePagination" class="flex items-center justify-between mt-3 hidden"></div>
        </div>
      </div>
    `
    const leaveData = await apiGet('/employees/'+id+'/leaves?limit=200')
    _hrLeaveData = leaveData
    _hrLeavePage = 0
    renderHrLeaveHistory(leaveData)
  } catch (e) { profile.innerHTML = '<p class="text-red-500">Error: ' + e.message + '</p>' }
}

window.viewDocument=async function(id){
  try{
    const emp=await apiGet('/employees/'+id)
    if(!emp.document) { alert('No document available'); return }
    const b64=emp.document.split(',')[1]
    if(!b64) { window.open(emp.document,'_blank'); return }
    const byteChars=atob(b64)
    const byteNums=new Array(byteChars.length)
    for(let i=0;i<byteChars.length;i++) byteNums[i]=byteChars.charCodeAt(i)
    const byteArr=new Uint8Array(byteNums)
    const blob=new Blob([byteArr],{type:'application/pdf'})
    const url=URL.createObjectURL(blob)
    window.open(url,'_blank')
    setTimeout(()=>URL.revokeObjectURL(url),60000)
  }catch(e){alert('Error loading document: '+e.message)}
}

window.replaceDocument=function(id){
  const input=document.createElement('input')
  input.type='file'
  input.accept='.pdf,.doc,.docx,.png,.jpg,.jpeg'
  input.onchange=async function(){
    const file=input.files[0]
    if(!file) return
    const reader=new FileReader()
    reader.readAsDataURL(file)
    const b64data=await new Promise((res,rej)=>{reader.onload=()=>res(reader.result);reader.onerror=rej})
    try{
      await apiPut('/employees/'+id+'/document',{document:b64data})
      selectEmployee(id)
    }catch(e){alert('Error: '+e.message)}
  }
  input.click()
}

window.copyProfileCredentials=async function(id){
  try{
    const emp=await apiGet('/employees/'+id)
    const text='Employee ID: '+emp.id+'\nEmail: '+emp.email+'\nPassword: '+emp.password
    const ta=document.createElement('textarea')
    ta.value=text
    ta.style.position='fixed'
    ta.style.left='-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    const btn=document.getElementById('copyCredBtn'+id)
    if(btn){btn.textContent='✅ Copied!';setTimeout(()=>btn.textContent='📋 Copy Credentials',2000)}
  }catch(e){alert('Error copying')}
}

window.openDeleteModal=function(id){
  selectedEmployeeId=id
  document.getElementById('deleteModal').classList.remove('hidden')
  document.getElementById('deleteModal').classList.add('flex')
}
window.closeDeleteModal=function(){
  document.getElementById('deleteModal').classList.add('hidden')
  document.getElementById('deleteModal').classList.remove('flex')
}
window.confirmDeleteEmployee=async function(){
  if(!selectedEmployeeId) return
  try{
    await apiDelete('/employees/'+selectedEmployeeId)
    closeDeleteModal()
    sessionStorage.removeItem('hrSelectedEmpId')
    selectedEmployeeId=null
    document.getElementById('employeeProfile').innerHTML='<div class="flex flex-col items-center justify-center py-16 text-gray-400"><div class="text-7xl mb-4 opacity-50">👤</div><p class="text-xl font-medium text-gray-300">Select an employee</p><p class="text-sm text-gray-300 mt-1">Click on any employee from the list to view their profile</p></div>'
    loadEmployeeList()
  }catch(e){alert('Error: '+e.message)}
}

window.openCreateEmployee=function(){
  document.getElementById('createModal').classList.remove('hidden')
  document.getElementById('createModal').classList.add('flex')
  document.getElementById('createFormContainer').classList.remove('hidden')
  document.getElementById('createSuccess').classList.add('hidden')
  document.getElementById('createEmployeeForm').reset()
  document.getElementById('formError').classList.add('hidden')
}

window.closeCreateEmployee=function(){
  document.getElementById('createModal').classList.add('hidden')
  document.getElementById('createModal').classList.remove('flex')
}

// Create employee form
document.addEventListener('DOMContentLoaded',function(){
  const form=document.getElementById('createEmployeeForm')
  if(!form) return
  form.addEventListener('submit',async function(e){
    e.preventDefault()
    const fd=new FormData(form)
    const fileInput=document.querySelector('input[name="document"]')
    const file=fileInput?.files?.[0]
    const data={
      firstName: fd.get('firstName'),
      middleName: fd.get('middleName') || '',
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      countryCode: fd.get('countryCode') || '+1',
      phone: fd.get('phone'),
      dob: fd.get('dob') ? fd.get('dob').split('-').reverse().join('-') : '',
      doj: fd.get('doj') ? fd.get('doj').split('-').reverse().join('-') : '',
      nationality: fd.get('nationality'),
      designation: fd.get('designation'),
      gender: fd.get('gender') || '',
      projectTag: fd.get('projectTag') || '',
      address: fd.get('address'),
    }
    if (!data.dob) { alert('Please select Date of Birth'); return }
    if (!data.doj) { alert('Please select Date of Joining'); return }

    // Age validation: must be 18+ at today and at DOJ
    const dobParts = data.dob.split('-')
    const dojParts = data.doj.split('-')
    const dobDate = new Date(+dobParts[2], +dobParts[1] - 1, +dobParts[0])
    const dojDate = new Date(+dojParts[2], +dojParts[1] - 1, +dojParts[0])
    const today = new Date()
    const ageToday = today.getFullYear() - dobDate.getFullYear() - ((today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) ? 1 : 0)
    const ageAtDoj = dojDate.getFullYear() - dobDate.getFullYear() - ((dojDate.getMonth() < dobDate.getMonth() || (dojDate.getMonth() === dobDate.getMonth() && dojDate.getDate() < dobDate.getDate())) ? 1 : 0)
    if (ageToday < 18) { alert('Employee must be at least 18 years old.'); return }
    if (ageAtDoj < 18) { alert('Employee must be at least 18 years old at the date of joining.'); return }
    if(file){
      const reader=new FileReader()
      reader.readAsDataURL(file)
      data.document=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=reject})
    }
    const errEl=document.getElementById('formError')
    errEl.classList.add('hidden')
    const btn=form.querySelector('button[type="submit"]')
    btn.disabled=true
    btn.textContent='Creating...'
    try{
      const res=await apiPost('/employees',data)
      document.getElementById('createFormContainer').classList.add('hidden')
      const success=document.getElementById('createSuccess')
      const emp=res.employee
      const lb=emp.leaveBalance||{}
      success.classList.remove('hidden')
      success.innerHTML=`
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-lg shadow-green-200">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold">Employee Profile Created</h3>
          <p class="text-green-100 mt-2 text-lg">${emp.name} has been onboarded successfully.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h4 class="font-semibold text-gray-700 text-lg mb-4">📋 Employee Credentials</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            ${[
              ['Employee ID',emp.id,'text-blue-600 font-bold'],
              ['Name',emp.name,'font-medium'],
              ['Email',emp.email,'font-medium'],
              ['Phone',emp.phone||'—',''],
              ['Nationality',emp.nationality||'—',''],
              ['Designation',emp.designation||'—',''],
              ['Gender',emp.gender||'—',''],
              ['Project Tag',emp.projectTag?'🏷️ '+emp.projectTag:'',''],
              ['Password',emp.password,'font-mono font-bold text-yellow-700'],
            ].map(([k,v,s])=>`<div class="p-3 bg-gray-50 rounded-xl"><p class="text-xs text-gray-500 mb-0.5">${k}</p><p class="${s}">${v}</p></div>`).join('')}
          </div>
          <div class="mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 text-sm text-blue-700 flex items-center gap-2"><span>📧</span> Real email sent to <strong>${emp.email}</strong> with ID, email & password. Check inbox/spam.</div>
        </div>
        <div class="flex gap-3">
          <button onclick="copyCredentials()" class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition" id="copyBtn">📋 Copy Credentials</button>
          <button onclick="closeCreateEmployee();loadEmployeeList()" class="flex-[2] px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-200 transition">✅ Done</button>
        </div>
      `
      loadEmployeeList()
      loadNotifications()
    }catch(e){
      errEl.textContent=e.message
      errEl.classList.remove('hidden')
    }finally{
      btn.disabled=false
      btn.textContent='Create Employee'
    }
  })
})

window.copyCredentials=function(){
  const items=document.querySelectorAll('#createSuccess .grid.grid-cols-2 > div')
  if(!items.length) return
  let id='',email='',pass=''
  items.forEach(el=>{
    const label=el.querySelector('p:first-child')?.textContent?.trim()||''
    const val=el.querySelector('p:last-child')?.textContent?.trim()||''
    if(label==='Employee ID') id=val
    else if(label==='Email') email=val
    else if(label==='Password') pass=val
  })
  const text='Employee ID: '+id+'\nEmail: '+email+'\nPassword: '+pass
  const ta=document.createElement('textarea')
  ta.value=text
  ta.style.position='fixed'
  ta.style.left='-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
  const btn=document.getElementById('copyBtn')
  if(btn){btn.textContent='✅ Copied!';setTimeout(()=>btn.textContent='📋 Copy Credentials',2000)}
}

