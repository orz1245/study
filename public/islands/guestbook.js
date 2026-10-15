/* =============================================================================
   留言板小岛（/guestbook/）
   -----------------------------------------------------------------------------
   页面是静态的：表单、字段、蜜罐都在 HTML 里（爬虫与无 JS 用户都能看到结构），
   这段脚本负责拉列表、提交、以及两个反垃圾信号 —— 与后端
   functions/api/messages.js 里的校验一一对应：
     · hp   蜜罐字段（真人看不见、也不该填）
     · t0   表单落到页面的时刻，用于计算填写耗时（<2.5s 判为机器人）
   提交成功返回的是脱敏后的对象（后端不会把 contact 回传给前端）。
   ========================================================================== */
(function () {
  'use strict'

  var S = window.STUDY
  var form = document.getElementById('gb-form')
  if (!S || !form) return

  var API = '/api/messages'
  var T0 = Date.now()

  var nameEl = form.querySelector('[name="name"]')
  var contactEl = form.querySelector('[name="contact"]')
  var hpEl = form.querySelector('[name="hp"]')
  var contentEl = form.querySelector('[name="content"]')
  var countEl = form.querySelector('.gb-count')
  var errEl = form.querySelector('.gb-form-error')
  var submitEl = form.querySelector('.gb-submit')

  var itemsEl = document.getElementById('gb-items')
  var stateEl = document.getElementById('gb-state')

  function showError(msg) {
    if (!errEl) return
    errEl.textContent = msg || ''
    errEl.hidden = !msg
  }

  function setBusy(busy) {
    if (!submitEl) return
    submitEl.disabled = busy || !contentEl.value.trim()
    submitEl.textContent = busy ? '提交中…' : '发表留言'
  }

  function itemHtml(m) {
    var nm = m.name || '匿名访客'
    return '<li class="gb-item">' +
      '<div class="gb-item-head">' +
      '<span class="gb-avatar">' + S.esc(nm.slice(0, 1)) + '</span>' +
      '<span class="gb-name">' + S.esc(nm) + '</span>' +
      '<span class="gb-time">' + S.esc(S.fmtTime(m.createdAt)) + '</span>' +
      '</div>' +
      '<p class="gb-content">' + S.esc(m.content) + '</p>' +
      '</li>'
  }

  function render(list) {
    if (!itemsEl || !stateEl) return
    if (!list.length) {
      itemsEl.hidden = true
      stateEl.hidden = false
      stateEl.className = 'gb-state'
      stateEl.textContent = '还没有留言，欢迎写下第一条'
      return
    }
    stateEl.hidden = true
    itemsEl.hidden = false
    itemsEl.innerHTML = list.map(itemHtml).join('')
  }

  function load() {
    if (stateEl) {
      stateEl.hidden = false
      stateEl.className = 'gb-state'
      stateEl.textContent = '加载中…'
    }
    return fetch(API, { cache: 'no-store' })
      .then(function (r) { return r.json() })
      .then(function (d) {
        render(Array.isArray(d.messages) ? d.messages : [])
      })
      .catch(function () {
        if (stateEl) {
          stateEl.className = 'gb-state gb-state--error'
          stateEl.textContent = '留言加载失败，请稍后重试'
        }
      })
  }

  if (contentEl) {
    contentEl.addEventListener('input', function () {
      if (countEl) countEl.textContent = contentEl.value.length + '/500'
      setBusy(false)
    })
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    showError('')
    var text = contentEl.value.trim()
    if (!text) return showError('请填写留言内容')
    if (text.length > 500) return showError('留言内容不能超过 500 字')

    setBusy(true)
    fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: nameEl.value.trim(),
        contact: contactEl.value.trim(),
        content: text,
        hp: hpEl.value,
        t0: T0
      })
    })
      .then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, data: d } })
      })
      .then(function (res) {
        if (!res.ok) {
          showError((res.data && res.data.error) || '提交失败，请稍后重试')
          setBusy(false)
          return
        }
        contentEl.value = ''
        if (contactEl) contactEl.value = ''
        if (countEl) countEl.textContent = '0/500'
        setBusy(false)
        // 乐观插入：后端返回的就是列表里用的同一个对象结构
        if (res.data && res.data.message && itemsEl) {
          stateEl.hidden = true
          itemsEl.hidden = false
          itemsEl.insertAdjacentHTML('afterbegin', itemHtml(res.data.message))
          if (!itemsEl.querySelector('.gb-item')) load()
        } else {
          load()
        }
      })
      .catch(function () {
        showError('提交失败，请检查网络后重试')
        setBusy(false)
      })
  })

  // 友链申请快捷支持：若 URL 带 ?ref=friendlink，自动预填申请模版并聚焦
  if (contentEl && typeof location !== 'undefined' && location.search && location.search.indexOf('ref=friendlink') !== -1) {
    if (!contentEl.value) {
      contentEl.value = '【申请友链】\n站点名称：\n站点地址：\n站点简介：'
      if (countEl) countEl.textContent = contentEl.value.length + '/500'
      setBusy(false)
    }
    setTimeout(function () {
      if (form && typeof form.scrollIntoView === 'function') {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      contentEl.focus()
    }, 120)
  }

  setBusy(false)
  load()
})()
