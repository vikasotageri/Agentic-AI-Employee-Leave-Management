// ===== Employee Dashboard Functions =====
// Dependencies: api.js, utils.js, auth.js, notifications.js, chat.js
// Weekly calendar state
let weekCalOffset = 0
let weekCalSelections = {}

function updateWeekCalSummary() {
  const entries = Object.entries(weekCalSelections).filter(([_, v]) => v.type)
  const count = entries.length
  const btn = document.getElementById('weekCalApplyBtn')
  btn.disabled = count === 0
  const summary = document.getElementById('weekCalSummary')
  const options = document.getElementById('weekCalLeaveOptions')
  if (count === 0) { summary.classList.add('hidden'); options?.classList.add('hidden'); return }
  summary.classList.remove('hidden')
  options?.classList.remove('hidden')
  document.getElementById('weekCalTotalCount').textContent = count
  const list = document.getElementById('weekCalSummaryList')
  const sorted = entries.sort(([a], [b]) => a.localeCompare(b))
  list.innerHTML = sorted.map(([dateStr, sel]) => {
    const parts = dateStr.split('-')
    const label = `${parts[2]}-${parts[1]}-${parts[0]}`
    return `<div class="flex items-center justify-between"><span>${label}</span><span class="font-medium capitalize text-blue-600">${sel.type}</span></div>`
  }).join('')
}

async function renderWeekCal() {
  const { monday, sunday } = getWeekRange(weekCalOffset)
  document.getElementById('weekCalRange').textContent =
    `${formatDateShort(monday)} - ${formatDateShort(sunday)}, ${monday.getFullYear()}`

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i); days.push(d)
  }

  let holidays = []
  try { holidays = await apiGet('/holidays') } catch (e) {}
  const holidayDates = {}
  ;(holidays || []).forEach(h => { holidayDates[h.date] = h.name })

  let existingLeaves = []
  try {
    const u = getUser()
    if (u) existingLeaves = await apiGet('/leaves/employee/' + u.id)
  } catch (e) {}
  const leaveByDate = {}
  ;(existingLeaves || []).forEach(l => {
    const date = l.start_date || l.startDate || ''
    if (date) {
      if (!leaveByDate[date]) leaveByDate[date] = []
      leaveByDate[date].push(l)
    }
  })

  const grid = document.getElementById('weekCalGrid')
  const headerDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  grid.innerHTML = headerDays.map(d => `<div class="text-center text-xs font-semibold text-gray-500 py-1">${d}</div>`).join('')

  days.forEach((d, idx) => {
    const dateStr = formatDate(d)
    const isWeekend = idx >= 5
    const holidayName = holidayDates[dateStr]
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24))
    const outOfRange = Math.abs(diffDays) > 70
    const isDisabled = isWeekend || outOfRange
    const sel = weekCalSelections[dateStr]
    const isChecked = sel && sel.checked

    // Check for existing leaves on this date
    const dayLeaves = leaveByDate[dateStr] || []
    let leaveBadge = ''
    if (dayLeaves.length > 0) {
      const lv = dayLeaves[0]
      const s = (lv.status || '').toLowerCase()
      if (s === 'approved' || s === 'auto-approved') leaveBadge = '<span class="block text-[10px] text-green-700 font-medium mt-0.5">✅ Approved</span>'
      else if (s === 'pending') leaveBadge = '<span class="block text-[10px] text-red-600 font-medium mt-0.5">⏳ Pending</span>'
      else if (s === 'cancellation_requested') leaveBadge = '<span class="block text-[10px] text-blue-700 font-medium mt-0.5">🔶 Cancellation Pending</span>'
      else if (s === 'rejected') leaveBadge = ''
    }

    let bg = 'bg-white'
    if (holidayName) bg = 'bg-orange-50 border-orange-200'
    else if (isWeekend) bg = 'bg-gray-100'
    else if (leaveBadge && leaveBadge.includes('Cancellation Pending')) bg = 'bg-blue-50 border-blue-200'
    else if (leaveBadge && leaveBadge.includes('Approved')) bg = 'bg-green-50 border-green-200'
    else if (leaveBadge && leaveBadge.includes('Pending')) bg = 'bg-red-50 border-red-200'

    const extra = holidayName ? `<span class="text-[10px] text-orange-600 block truncate" title="${holidayName}">${holidayName}</span>` : ''
    // Rejected leaves should not block checkbox
    const hasBlockingLeave = dayLeaves.some(lv => {
      const s = (lv.status || '').toLowerCase()
      return s !== 'rejected'
    })
    const cbDis = isDisabled ? 'disabled' : ''
    const cbVis = isDisabled || hasBlockingLeave ? 'invisible' : ''

    const dateLabel = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`

    const typeSelect = isChecked
      ? `<div class="mt-1">        <select onchange="weekCalTypeChange('${dateStr}',this.value)" class="w-full text-[11px] px-1 py-0.5 border border-blue-300 rounded-lg bg-blue-50 outline-none focus:ring-1 focus:ring-blue-400">
          <option value="">Select type...</option>
          <option value="casual" ${sel.type==='casual'?'selected':''}>Casual</option>
          <option value="sick" ${sel.type==='sick'?'selected':''}>Sick</option>
          <option value="business" ${sel.type==='business'?'selected':''}>Business</option>
          <option value="emergency" ${sel.type==='emergency'?'selected':''}>Personal/Emergency</option>
          <option value="family" ${sel.type==='family'?'selected':''}>Family/Vacation</option>
          <option value="unpaid" ${sel.type==='unpaid'?'selected':''}>Unpaid</option>
        </select></div>`
      : ''

    grid.innerHTML += `<div class="p-1.5 border ${isWeekend?'border-gray-100':'border-gray-200'} rounded-xl text-center transition ${bg} min-h-[72px]">
      <div class="flex items-center justify-center gap-1">
        <input type="checkbox" onchange="weekCalToggleCheck('${dateStr}',this.checked)" ${cbDis} ${isChecked?'checked':''} class="w-3.5 h-3.5 accent-blue-600 ${cbVis}">
        <p class="text-xs font-medium ${holidayName?'text-orange-700':isWeekend?'text-gray-400':'text-gray-700'}">${dateLabel}</p>
      </div>
      ${leaveBadge}
      ${extra}
      ${typeSelect}
    </div>`
  })

  updateWeekCalSummary()
}

window.weekCalPrev = function () { weekCalOffset--; renderWeekCal() }
window.weekCalNext = function () { weekCalOffset++; renderWeekCal() }

window.weekCalToggleCheck = function (dateStr, checked) {
  if (checked) weekCalSelections[dateStr] = { type: '', checked: true }
  else delete weekCalSelections[dateStr]
  renderWeekCal()
}

window.weekCalTypeChange = function (dateStr, type) {
  if (!weekCalSelections[dateStr]) weekCalSelections[dateStr] = {}
  weekCalSelections[dateStr].type = type
  updateWeekCalSummary()
}

window.weekCalClear = function () {
  weekCalSelections = {}
  renderWeekCal()
  document.getElementById('weekCalResult').classList.add('hidden')
}

window.weekCalSubmit = async function () {
  const entries = Object.entries(weekCalSelections).filter(([_, v]) => v.type)
  if (entries.length === 0) return

  const u = getUser()
  const reason = document.getElementById('weekCalReason').value
  const fileInput = document.getElementById('weekCalDocument')
  const file = fileInput?.files?.[0]

  let fileData = null
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    fileData = await new Promise((resolve, reject) => { reader.onload = () => resolve(reader.result); reader.onerror = reject })
  }

  const result = document.getElementById('weekCalResult')
  result.classList.remove('hidden')
  result.className = 'mt-3 text-sm p-3 rounded-xl bg-blue-50 text-blue-700'
  result.textContent = 'Applying ' + entries.length + ' leave(s)...'

  // Group entries by leave type
  const byType = {}
  for (const [dateStr, sel] of entries) {
    if (!byType[sel.type]) byType[sel.type] = []
    byType[sel.type].push(dateStr)
  }

  let successCount = 0; let failCount = 0; let lastMsg = ''

  for (const [type, dates] of Object.entries(byType)) {
    try {
      const data = { employeeId: u.id, leaveType: type, dates, reason }
      if (fileData) data.document = fileData
      const res = await apiPost('/leaves/bulk', data)
      successCount += dates.length
    } catch (e) { failCount += dates.length; lastMsg = e.message }
  }

  if (failCount === 0) {
    result.className = 'mt-3 text-sm p-3 rounded-xl bg-green-50 text-green-700'
    result.textContent = successCount + ' leave(s) applied successfully!'
  } else {
    result.className = 'mt-3 text-sm p-3 rounded-xl bg-yellow-50 text-yellow-700'
    result.textContent = successCount + ' applied, ' + failCount + ' failed' + (lastMsg ? '. Last error: ' + lastMsg : '')
  }

  weekCalSelections = {}
  document.getElementById('weekCalReason').value = ''
  if (fileInput) fileInput.value = ''
  const savedOffset = weekCalOffset
  await loadEmployeeDashboard()
  weekCalOffset = savedOffset
  renderWeekCal()
}

async function loadEmployeeDashboard() {
  const u = getUser()
  if (!u || window.location.pathname !== '/employee') return
  try {
    // Header
    const emp = await apiGet('/employees/' + u.id)
    document.getElementById('empHeaderId').textContent = emp.id
    document.getElementById('empHeaderName').textContent = emp.name
    document.getElementById('empHeaderDoj').textContent = toDisplayDate(emp.doj)
    document.getElementById('empHeaderEmail').textContent = emp.email
    document.getElementById('empHeaderPhone').textContent = emp.phone || '—'
    document.getElementById('empHeaderGender').textContent = emp.gender || '—'
    const desigColorsEmp = {
      'software engineer':'bg-blue-100 text-blue-700','senior software engineer':'bg-indigo-100 text-indigo-700',
      'tech lead':'bg-purple-100 text-purple-700','manager':'bg-orange-100 text-orange-700',
      'ai ml engineer':'bg-cyan-100 text-cyan-700','data scientist':'bg-teal-100 text-teal-700',
      'devops engineer':'bg-rose-100 text-rose-700','qa engineer':'bg-lime-100 text-lime-700',
      'product manager':'bg-amber-100 text-amber-700','ui/ux designer':'bg-pink-100 text-pink-700',
      'business analyst':'bg-violet-100 text-violet-700','intern':'bg-gray-100 text-gray-700',
    }
    const defaultColorEmp = 'bg-gray-100 text-gray-700'
    const desig = (emp.designation||'').toLowerCase()
    const dColorEmp = Object.keys(desigColorsEmp).reduce((acc,key)=> desig.includes(key) ? desigColorsEmp[key] : acc, defaultColorEmp)
    document.getElementById('empHeaderDesig').innerHTML = emp.designation ? `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${dColorEmp}">${emp.designation}</span>` : '—'
    document.getElementById('empHeaderProject').textContent = emp.projectTag ? '🏷️ ' + emp.projectTag : '—'

    // Balance
    const lbRes = await apiGet('/employees/' + u.id + '/balance')
    const lb = lbRes || {}
    const cards = document.getElementById('leaveBalanceCards')
    const types = ['sick', 'casual', 'business', 'emergency', 'family']
    const colors = { sick: 'green', casual: 'blue', business: 'purple', emergency: 'orange', family: 'pink' }
    const icons = { sick: '🤒', casual: '😎', business: '💼', emergency: '🚨', family: '👨‍👩‍👧‍👦' }
    const labels = { sick: 'Sick', casual: 'Casual', business: 'Business', emergency: 'Emergency/Personal', family: 'Family/Vacation' }
    cards.innerHTML = types.map(t => {
      const lt = lb[t] || {}
      const remaining = lt.remaining || 0
      return `<div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition text-center"><div class="text-3xl mb-1">${icons[t]}</div><p class="text-xs text-gray-500 mb-3">${labels[t]}</p><div class="text-3xl font-bold text-${colors[t]}-600">${remaining}</div></div>`
    }).join('')

    // Upcoming leaves - top 6
    try {
      const upcoming = await apiGet('/employees/' + u.id + '/upcoming')
      const ul = document.getElementById('upcomingLeaves')
      if (!upcoming || upcoming.length === 0) ul.innerHTML = '<div class="text-center py-8 text-gray-400"><span class="text-4xl block mb-2">🏖️</span><p class="text-sm">No upcoming leaves</p></div>'
      else {
        const showAll = window._showAllUpcoming || false
        const items = showAll ? upcoming : upcoming.slice(0, 5)
        ul.innerHTML = items.map(l => {
          const status = (l.status || l.Status || '').toLowerCase()
          const isApproved = status === 'approved' || status === 'auto-approved'
          const isCancellationReq = status === 'cancellation_requested'
          const isPending = status === 'pending'
          const isRejected = status === 'rejected'
          let statColor, statIcon, statLabel, actionHtml
          if (isPending) {
            statColor = 'bg-yellow-100 text-yellow-700'; statIcon = '⏳'; statLabel = 'Pending'
            actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
          } else if (isApproved) {
            statColor = 'bg-green-100 text-green-700'; statIcon = '✅'; statLabel = 'Approved'
            actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
          } else if (isCancellationReq) {
            statColor = 'bg-blue-100 text-blue-700'; statIcon = '🔶'; statLabel = 'Cancellation Pending'
            actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
          } else if (isRejected) {
            statColor = 'bg-red-100 text-red-700'; statIcon = '❌'; statLabel = 'Rejected'
            actionHtml = '<span class="text-xs text-gray-400">--</span>'
          } else {
            statColor = 'bg-gray-100 text-gray-600'; statIcon = '📋'; statLabel = status
            actionHtml = '<span class="text-xs text-gray-400">--</span>'
          }
          const leaveDate = l.startDate || l.start_date || ''
          const cancelTitle = isCancellationReq ? (l.cancellation_reason||'').replace(/"/g,'&quot;') : ''
          return `<div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-lg">📅</div><div><p class="text-sm font-semibold text-gray-800">${l.type} Leave</p><p class="text-xs text-gray-500 mt-0.5">${toDisplayDate(leaveDate)}</p></div></div><div class="flex items-center gap-2"><span class="text-xs px-3 py-1 rounded-full font-medium ${statColor}"${cancelTitle ? ` title="${cancelTitle}"` : ''}>${statIcon} ${statLabel}</span>${actionHtml}</div></div>`
        }).join('')
        if (upcoming.length > 5) {
          ul.innerHTML += '<button onclick="window._showAllUpcoming=!' + (showAll ? 'true' : 'false') + ';loadEmployeeDashboard()" class="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">' + (showAll ? '▲ Show less' : '▼ Show all ' + upcoming.length + ' leaves') + '</button>'
        }
      }
    } catch (e) { }

    // Past leaves - only pending & cancellation_requested
    try {
      const allLeaves = await apiGet('/employees/' + u.id + '/leaves?limit=200')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const past = allLeaves.filter(l => {
        const s = (l.status || '').toLowerCase()
        if (s !== 'pending' && s !== 'cancellation_requested') return false
        const ds = l.start_date || l.startDate || ''
        if (!ds) return false
        let d
        if (ds.includes('-')) {
          const parts = ds.split('-')
          if (parts[0].length === 4) d = new Date(parts[0], parts[1] - 1, parts[2])
          else d = new Date(parts[2], parts[1] - 1, parts[0])
        } else { d = new Date(ds) }
        return d < today
      })
      const pl = document.getElementById('pastLeaves')
      if (!past || past.length === 0) pl.innerHTML = '<div class="text-center py-8 text-gray-400"><span class="text-4xl block mb-2">📋</span><p class="text-sm">No past leaves requests pending</p></div>'
      else {
        const showAllPast = window._showAllPast || false
        const items = showAllPast ? past : past.slice(0, 5)
        let html = ''
        if (past.length > 5 && !showAllPast) html += '<p class="text-xs text-gray-500 mb-2">Showing top 5 of ' + past.length + ' past pending requests</p>'
        html += items.map(l => {
          const status = (l.status || l.Status || '').toLowerCase()
          const isCancellationReq = status === 'cancellation_requested'
          let statColor, statIcon, statLabel
          if (isCancellationReq) { statColor = 'bg-blue-100 text-blue-700'; statIcon = '🔶'; statLabel = 'Cancellation Pending' }
          else { statColor = 'bg-yellow-100 text-yellow-700'; statIcon = '⏳'; statLabel = 'Pending' }
          const leaveDate = l.start_date || l.startDate || ''
          return `<div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-lg">📅</div><div><p class="text-sm font-semibold text-gray-800">${l.type} Leave</p><p class="text-xs text-gray-500 mt-0.5">${toDisplayDate(leaveDate)}</p></div></div><div class="flex items-center gap-2"><span class="text-xs px-3 py-1 rounded-full font-medium ${statColor}">${statIcon} ${statLabel}</span><button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button></div></div>`
        }).join('')
        if (past.length > 5) {
          html += '<button onclick="window._showAllPast=!' + (showAllPast ? 'true' : 'false') + ';loadEmployeeDashboard()" class="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">' + (showAllPast ? '▲ Show less' : '▼ Show all ' + past.length + ' leaves') + '</button>'
        }
        pl.innerHTML = html
      }
    } catch (e) { }

    // Leave history table for Apply Leave tab
    try {
      const leaves = await apiGet('/employees/' + u.id + '/leaves?limit=200')
      window._empLeaveHistory = leaves || []
      renderLeaveHistory(leaves || [])
    } catch (e) { window._empLeaveHistory = []; renderLeaveHistory([]) }

    // Weekly calendar
    weekCalOffset = 0
    weekCalSelections = {}
    renderWeekCal()

    // Auto-refresh every 10s to pick up manager actions
    if (window._empRefreshInterval) clearInterval(window._empRefreshInterval)
    window._empRefreshInterval = setInterval(() => {
      // Silently refresh upcoming leaves and calendar only (not entire page)
      refreshEmployeeData(u.id)
    }, 10000)
  } catch (e) { console.error('Emp dash error:', e) }
}

async function refreshEmployeeData(empId) {
  try {
    // Refresh leave balance cards
    const lbRes = await apiGet('/employees/' + empId + '/balance')
    const lb = lbRes || {}
    const cards = document.getElementById('leaveBalanceCards')
    if (cards) {
      const types = ['sick', 'casual', 'business', 'emergency', 'family']
      const colors = { sick: 'green', casual: 'blue', business: 'purple', emergency: 'orange', family: 'pink' }
      const icons = { sick: '🤒', casual: '😎', business: '💼', emergency: '🚨', family: '👨‍👩‍👧‍👦' }
      const labels = { sick: 'Sick', casual: 'Casual', business: 'Business', emergency: 'Emergency/Personal', family: 'Family/Vacation' }
      cards.innerHTML = types.map(t => {
        const lt = lb[t] || {}
        const remaining = lt.remaining || 0
        return `<div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition text-center"><div class="text-3xl mb-1">${icons[t]}</div><p class="text-xs text-gray-500 mb-3">${labels[t]}</p><div class="text-3xl font-bold text-${colors[t]}-600">${remaining}</div></div>`
      }).join('')
    }
    // Refresh upcoming leaves
    const upcoming = await apiGet('/employees/' + empId + '/upcoming')
    const ul = document.getElementById('upcomingLeaves')
    if (upcoming && upcoming.length > 0) {
      const showAll = window._showAllUpcoming || false
      const items = showAll ? upcoming : upcoming.slice(0, 5)
      ul.innerHTML = items.map(l => {
        const status = (l.status || l.Status || '').toLowerCase()
        const isApproved = status === 'approved' || status === 'auto-approved'
        const isCancellationReq = status === 'cancellation_requested'
        const isPending = status === 'pending'
        const isRejected = status === 'rejected'
        let statColor, statIcon, statLabel, actionHtml
        if (isPending) {
          statColor = 'bg-yellow-100 text-yellow-700'; statIcon = '⏳'; statLabel = 'Pending'
          actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
        } else if (isApproved) {
          statColor = 'bg-green-100 text-green-700'; statIcon = '✅'; statLabel = 'Approved'
          actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
        } else if (isCancellationReq) {
          statColor = 'bg-blue-100 text-blue-700'; statIcon = '🔶'; statLabel = 'Cancellation Pending'
          actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button>`
        } else if (isRejected) {
          statColor = 'bg-red-100 text-red-700'; statIcon = '❌'; statLabel = 'Rejected'
          actionHtml = '<span class="text-xs text-gray-400">--</span>'
        } else {
          statColor = 'bg-gray-100 text-gray-600'; statIcon = '📋'; statLabel = status
          actionHtml = '<span class="text-xs text-gray-400">--</span>'
        }
        const leaveDate = l.startDate || l.start_date || ''
        const cancelTitle = isCancellationReq ? (l.cancellation_reason||'').replace(/"/g,'&quot;') : ''
        return `<div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-lg">📅</div><div><p class="text-sm font-semibold text-gray-800">${l.type} Leave</p><p class="text-xs text-gray-500 mt-0.5">${toDisplayDate(leaveDate)}</p></div></div><div class="flex items-center gap-2"><span class="text-xs px-3 py-1 rounded-full font-medium ${statColor}"${cancelTitle ? ` title="${cancelTitle}"` : ''}>${statIcon} ${statLabel}</span>${actionHtml}</div></div>`
      }).join('')
      if (upcoming.length > 5) {
        ul.innerHTML += '<button onclick="window._showAllUpcoming=!' + (showAll ? 'true' : 'false') + ';loadEmployeeDashboard()" class="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">' + (showAll ? '▲ Show less' : '▼ Show all ' + upcoming.length + ' leaves') + '</button>'
      }
    }
    // Refresh calendar (re-fetches existing leaves)
    renderWeekCal()
    // Refresh leave history and re-apply current filters
    const leaves = await apiGet('/employees/' + empId + '/leaves?limit=200')
    window._empLeaveHistory = leaves || []
    filterLeaveHistory()
    // Refresh past leaves (pending & cancellation only)
    const pl = document.getElementById('pastLeaves')
    if (pl && leaves) {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const past = leaves.filter(l => {
        const s = (l.status || '').toLowerCase()
        if (s !== 'pending' && s !== 'cancellation_requested') return false
        const ds = l.start_date || l.startDate || ''
        if (!ds) return false
        let d
        if (ds.includes('-')) {
          const parts = ds.split('-')
          if (parts[0].length === 4) d = new Date(parts[0], parts[1] - 1, parts[2])
          else d = new Date(parts[2], parts[1] - 1, parts[0])
        } else { d = new Date(ds) }
        return d < today
      })
      if (past.length === 0) pl.innerHTML = '<div class="text-center py-8 text-gray-400"><span class="text-4xl block mb-2">📋</span><p class="text-sm">No past leaves requests pending</p></div>'
      else {
        const showAllPast = window._showAllPast || false
        const items = showAllPast ? past : past.slice(0, 5)
        let html = ''
        if (past.length > 5 && !showAllPast) html += '<p class="text-xs text-gray-500 mb-2">Showing top 5 of ' + past.length + ' past pending requests</p>'
        html += items.map(l => {
          const status = (l.status || l.Status || '').toLowerCase()
          const isCR = status === 'cancellation_requested'
          const sc = isCR ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
          const si = isCR ? '🔶' : '⏳'
          const sl = isCR ? 'Cancellation Pending' : 'Pending'
          const ld = l.start_date || l.startDate || ''
          return '<div class="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-lg">📅</div><div><p class="text-sm font-semibold text-gray-800">' + l.type + ' Leave</p><p class="text-xs text-gray-500 mt-0.5">' + toDisplayDate(ld) + '</p></div></div><div class="flex items-center gap-2"><span class="text-xs px-3 py-1 rounded-full font-medium ' + sc + '">' + si + ' ' + sl + '</span><button onclick="cancelLeave(\'' + l.id + '\')" class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 font-medium">Cancel</button></div></div>'
        }).join('')
        if (past.length > 5) {
          html += '<button onclick="window._showAllPast=!' + (showAllPast ? 'true' : 'false') + ';loadEmployeeDashboard()" class="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">' + (showAllPast ? '▲ Show less' : '▼ Show all ' + past.length + ' leaves') + '</button>'
        }
        pl.innerHTML = html
      }
    }
  } catch (e) { /* silent refresh */ }
}

let leavePage = 0
const LEAVE_PAGE_SIZE = 10

function renderLeaveHistory(leaves) {
  const tbody = document.getElementById('leaveHistoryTable')
  const empty = document.getElementById('leaveHistoryEmpty')
  const pagination = document.getElementById('leavePagination')
  if (!tbody) return
  if (!leaves || leaves.length === 0) {
    tbody.innerHTML = ''
    if (empty) empty.classList.remove('hidden')
    if (pagination) pagination.classList.add('hidden')
    return
  }
  if (empty) empty.classList.add('hidden')

  const sorted = [...leaves].sort((a, b) => {
    const da = a.applied_on || ''
    const db = b.applied_on || ''
    return db.localeCompare(da)
  })
  const totalPages = Math.ceil(sorted.length / LEAVE_PAGE_SIZE)
  if (leavePage >= totalPages) leavePage = totalPages - 1
  if (leavePage < 0) leavePage = 0
  const start = leavePage * LEAVE_PAGE_SIZE
  const pageItems = sorted.slice(start, start + LEAVE_PAGE_SIZE)

  tbody.innerHTML = pageItems.map(l => {
    const status = (l.status || l.Status || '').toLowerCase()
    const isApproved = status === 'approved' || status === 'auto-approved'
    const isCancellationReq = status === 'cancellation_requested'
    const isRejected = status === 'rejected'
    const isPending = status === 'pending'

    let statLabel, statColor, statIcon, actionHtml
    if (isPending) {
      statLabel = 'Pending'
      statColor = 'bg-yellow-100 text-yellow-700'
      statIcon = '⏳'
      actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded font-medium">Cancel</button>`
    } else if (isApproved) {
      statLabel = 'Approved'
      statColor = 'bg-green-100 text-green-700'
      statIcon = '✅'
      actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded font-medium">Cancel</button>`
    } else if (isCancellationReq) {
      statLabel = 'Cancellation Pending'
      statColor = 'bg-blue-100 text-blue-700'
      statIcon = '🔶'
      actionHtml = `<button onclick="cancelLeave('${l.id}')" class="text-xs text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded font-medium">Cancel</button>`
    } else if (isRejected) {
      statLabel = 'Rejected'
      statColor = 'bg-red-100 text-red-700'
      statIcon = '❌'
      actionHtml = '<span class="text-xs text-gray-400">--</span>'
    } else {
      statLabel = status
      statColor = 'bg-gray-100 text-gray-600'
      statIcon = '📋'
      actionHtml = '<span class="text-xs text-gray-400">--</span>'
    }
    const appliedOn = l.applied_on || ''
    const appliedTime = appliedOn ? appliedOn.split(' ')[1] || '' : ''
    const appliedDate = appliedOn ? appliedOn.split(' ')[0] || appliedOn : ''
    const leaveDate = (l.start_date || l.startDate || '')
    const hasDoc = l.document || l.attachment
    const cancelTitle = isCancellationReq ? (l.cancellation_reason||'').replace(/"/g,'&quot;') : ''
    const rejectTitle = isRejected ? (l.rejection_reason||'').replace(/"/g,'&quot;') : ''
    return `<tr class="hover:bg-gray-50 transition border-b border-gray-100"><td class="px-4 py-3 font-mono text-xs text-gray-600">${l.id}</td><td class="px-4 py-3 text-sm whitespace-nowrap">${toDisplayDate(appliedDate)}<br><span class="text-xs text-gray-400">${appliedTime}</span></td><td class="px-4 py-3 text-sm capitalize">${l.type}</td><td class="px-4 py-3 text-sm">${toDisplayDate(leaveDate)}</td><td class="px-4 py-3 text-sm text-gray-500 max-w-[120px] truncate" title="${(l.reason||'').replace(/"/g,'&quot;')}">${l.reason||'—'}</td><td class="px-4 py-3">${hasDoc?`<button onclick="viewLeaveDoc('${l.id}')" class="text-blue-600 hover:text-blue-800 text-xs">📄 View</button>`:'—'}</td><td class="px-4 py-3"><span class="text-xs px-2.5 py-1 rounded-full font-medium ${statColor}"${cancelTitle ? ` title="${cancelTitle}"` : rejectTitle ? ` title="${rejectTitle}"` : ''}>${statIcon} ${statLabel}</span></td><td class="px-4 py-3 text-xs">${actionHtml}</td></tr>`
  }).join('')

  if (pagination) {
    if (totalPages > 1) {
      pagination.classList.remove('hidden')
      document.getElementById('leavePageInfo').textContent = `Page ${leavePage + 1} of ${totalPages} (${sorted.length} total)`
    } else {
      pagination.classList.add('hidden')
    }
  }
}

window.leavePrevPage = function () {
  if (leavePage > 0) { leavePage--; renderLeaveHistory(window._empLeaveHistory || []) }
}

window.leaveNextPage = function () {
  const total = (window._empLeaveHistory || []).length
  if ((leavePage + 1) * LEAVE_PAGE_SIZE < total) { leavePage++; renderLeaveHistory(window._empLeaveHistory || []) }
}

window.filterLeaveHistory = function () {
  leavePage = 0
  const q = document.getElementById('leaveHistorySearch')?.value.toLowerCase() || ''
  const typeF = document.getElementById('leaveTypeFilter')?.value || ''
  const statusF = document.getElementById('leaveStatusFilter')?.value || ''
  const monthF = document.getElementById('leaveMonthFilter')?.value || ''
  const yearF = document.getElementById('leaveYearFilter')?.value || ''
  let all = window._empLeaveHistory || []
  if (typeF) all = all.filter(l => (l.type || '').toLowerCase() === typeF)
  if (statusF) {
    if (statusF === 'approved') {
      all = all.filter(l => {
        const s = (l.status || '').toLowerCase()
        return s === 'approved' || s === 'auto-approved'
      })
    } else {
      all = all.filter(l => (l.status || '').toLowerCase() === statusF)
    }
  }
  if (monthF) {
    all = all.filter(l => {
      const p = getLeaveDateParts(l)
      return p.month === parseInt(monthF)
    })
  }
  if (yearF) {
    all = all.filter(l => {
      const p = getLeaveDateParts(l)
      return p.year === parseInt(yearF)
    })
  }
  if (q) {
    all = all.filter(l =>
      (l.id || '').toLowerCase().includes(q) ||
      (l.applied_on || '').includes(q) ||
      (l.start_date || l.startDate || '').includes(q)
    )
  }
  renderLeaveHistory(all)
}

window.cancelLeave = async function (leaveId) {
  const leaves = window._empLeaveHistory || []
  const lv = leaves.find(l => l.id === leaveId)
  const st = lv && (lv.status || '').toLowerCase()
  const isPending = st === 'pending'
  const isCancellationReq = st === 'cancellation_requested'
  if (isPending) {
    if (!confirm('Cancel this pending leave? It will be removed from history.')) return
    try {
      await apiPost('/leaves/cancel', { leaveId, reason: 'Cancelled by employee' })
      loadEmployeeDashboard()
    } catch (e) { alert('Error: ' + e.message) }
  } else if (isCancellationReq) {
    // Withdraw cancellation request — revert to approved, no reason needed
    try {
      await apiPost('/leaves/cancel', { leaveId, reason: '' })
      loadEmployeeDashboard()
    } catch (e) { alert('Error: ' + e.message) }
  } else {
    const reason = prompt('Reason for cancellation request:')
    if (!reason) return
    try {
      await apiPost('/leaves/cancel', { leaveId, reason })
      loadEmployeeDashboard()
    } catch (e) { alert('Error: ' + e.message) }
  }
}

window.deleteLeave = async function (leaveId) {
  const reason = prompt('Reason for deletion:')
  if (!reason) return
  try {
    await apiPost('/leaves/cancel', { leaveId, reason })
    loadEmployeeDashboard()
  } catch (e) { alert('Error: ' + e.message) }
}

// Calendar Modal (holiday + leave calendar)
let calendarYear, calendarMonth, calendarHolidays = {}, calendarLeaves = [], calendarHolidaysList = []

window.openCalendarModal = async function () {
  const modal = document.getElementById('calendarModal')
  modal.classList.remove('hidden')
  modal.classList.add('flex')
  const now = new Date()
  calendarYear = now.getFullYear()
  calendarMonth = now.getMonth()
  try {
    const [holidays, leaves] = await Promise.all([
      apiGet('/holidays'),
      apiGet('/employees/' + (getUser()?.id) + '/leaves?limit=200')
    ])
    calendarHolidays = {}
    ;(holidays || []).forEach(h => { calendarHolidays[h.date] = h.name })
    calendarHolidaysList = holidays || []
    calendarLeaves = leaves || []
    renderCalendar()
  } catch (e) {
    document.getElementById('calendarContent').innerHTML = '<p class="text-red-500 text-center py-4">Error loading calendar</p>'
  }
}

function renderCalendar () {
  const firstDay = new Date(calendarYear, calendarMonth, 1)
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  document.getElementById('calendarMonthTitle').textContent = monthName

  let html = '<div class="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-500 mb-1">'
  html += ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="text-center py-1">${d}</div>`).join('')
  html += '</div><div class="grid grid-cols-7 gap-1">'

  for (let i = 0; i < startPad; i++) html += '<div></div>'

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dt = new Date(calendarYear, calendarMonth, d)
    const dayOfWeek = dt.getDay()
    const isSunday = dayOfWeek === 0
    const isSaturday = dayOfWeek === 6
    const holidayName = calendarHolidays[dateStr]

    let leaveStatus = ''
    ;(calendarLeaves || []).forEach(l => {
      const s = l.startDate || l.start_date || ''
      const e = l.endDate || l.end_date || ''
      if (dateStr >= s && dateStr <= e) {
        const st = (l.status || l.Status || '').toLowerCase()
        if (st === 'approved' || st === 'auto-approved') leaveStatus = 'approved'
        else if (st === 'pending') leaveStatus = 'pending'
        else if (st === 'cancellation_requested') leaveStatus = 'cancellation'
      }
    })

    let bg = 'bg-white'
    let dot = ''
    if (holidayName) { bg = 'bg-orange-50'; dot = '<span class="text-[10px] block text-orange-600 truncate leading-tight" title="' + holidayName + '">🏛️ ' + holidayName + '</span>' }
    else if (isSunday || isSaturday) { bg = 'bg-gray-50' }
    if (leaveStatus === 'approved') { bg = 'bg-green-50'; dot = '<span class="text-[10px] block text-green-600">✅</span>' }
    else if (leaveStatus === 'pending') { bg = 'bg-red-50'; dot = '<span class="text-[10px] block text-red-500">⏳</span>' }
    else if (leaveStatus === 'cancellation') { bg = 'bg-blue-50'; dot = '<span class="text-[10px] block text-blue-600">🔶</span>' }

    html += `<div class="p-2 rounded-lg text-center text-sm ${bg} border border-gray-100 min-h-[50px]"><p class="font-medium ${holidayName ? 'text-orange-700' : (isSunday || isSaturday) ? 'text-gray-400' : 'text-gray-700'}">${d}</p>${dot}</div>`
  }
  html += '</div>'

  // Holiday list for current year
  const yearHolidays = Object.entries(calendarHolidays)
    .filter(([date]) => date.startsWith(String(calendarYear)))
    .sort(([a], [b]) => a.localeCompare(b))
  const user = getUser()
  const isHr = user && user.role === 'hr'
  if (isHr) {
    html += '<div class="mt-6 border-t border-gray-200 pt-4"><h4 class="text-sm font-semibold text-gray-700 mb-3">📋 Manage Holidays</h4><div class="flex gap-2 items-end"><div><label class="text-xs text-gray-500 block mb-1">Date</label><input type="date" id="newHolidayDate" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="text-xs text-gray-500 block mb-1">Holiday Name</label><input type="text" id="newHolidayName" placeholder="Enter holiday name..." class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"></div><button onclick="addHoliday()" class="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ Add</button></div></div>'
  }
  if (yearHolidays.length) {
    html += '<div class="mt-6 border-t border-gray-200 pt-4"><h4 class="text-sm font-semibold text-gray-700 mb-3">📋 Holidays – ' + calendarYear + '</h4><div class="grid grid-cols-2 gap-2 text-xs">'
    yearHolidays.forEach(([date, name]) => {
      const h = calendarHolidaysList.find(hh => hh.date === date)
      const d = new Date(date + 'T00:00:00')
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      html += '<div class="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100"><span class="text-orange-600">🏛️</span><span class="font-medium text-gray-700">' + name + '</span><span class="text-gray-400 ml-auto">' + formatted + '</span>' + (isHr && h ? '<button onclick="deleteHoliday(\'' + h.id + '\')" class="text-red-400 hover:text-red-600 ml-1" title="Delete">✕</button>' : '') + '</div>'
    })
    html += '</div></div>'
  }

  document.getElementById('calendarContent').innerHTML = html
}

window.calendarPrevMonth = function () {
  calendarMonth--
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear-- }
  renderCalendar()
}

window.calendarNextMonth = function () {
  calendarMonth++
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++ }
  renderCalendar()
}

window.closeCalendarModal = function () {
  document.getElementById('calendarModal').classList.add('hidden')
  document.getElementById('calendarModal').classList.remove('flex')
}

window.addHoliday = async function () {
  const date = document.getElementById('newHolidayDate')?.value
  const name = document.getElementById('newHolidayName')?.value?.trim()
  if (!date || !name) { alert('Please enter both date and name'); return }
  try {
    await apiPost('/holidays', { date, name })
    document.getElementById('newHolidayDate').value = ''
    document.getElementById('newHolidayName').value = ''
    const [holidays] = await Promise.all([apiGet('/holidays')])
    calendarHolidays = {}
    ;(holidays || []).forEach(h => { calendarHolidays[h.date] = h.name })
    calendarHolidaysList = holidays || []
    renderCalendar()
  } catch (e) { alert('Error: ' + e.message) }
}

window.deleteHoliday = async function (id) {
  if (!confirm('Delete this holiday?')) return
  try {
    await apiDelete('/holidays/' + id)
    const [holidays] = await Promise.all([apiGet('/holidays')])
    calendarHolidays = {}
    ;(holidays || []).forEach(h => { calendarHolidays[h.date] = h.name })
    calendarHolidaysList = holidays || []
    renderCalendar()
  } catch (e) { alert('Error: ' + e.message) }
}

