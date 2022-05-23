chrome.runtime.onInstalled.addListener(() => {
  const defaults = {
    username: 'tstprod',
    email: 'default@mail.com',
    phone: '+79221996764',
    timeout: 1
  }
  chrome.storage.sync.set({ ...defaults })
  updateActiveTabs()
})

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status == 'complete' && !info.discarded && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: updateFieldsOnPageLoad
    })
  }
})

function updateActiveTabs() {
  chrome.tabs.query({ url: "*://*.skyeng.ru/*" }, tabs => {
    tabs.filter(tab => tab.status === 'complete' && !tab.discarded).forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/updateTabFormFields.js']
      })
    })
  })
}

function updateFieldsOnPageLoad() {
  chrome.storage.sync.get(['username', 'email', 'phone', 'timeout'], data => {
    const id = setInterval(() => {
      const fields = {
        username: document.getElementsByName('name'),
        email: document.getElementsByName('email'),
        phone: document.getElementsByName('tildaspec-phone-part[]')
      }

      for (let name of ['username', 'email', 'phone']) {
        for (let field of fields[name]) {
          field.value = data[name]
          field.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }))
        }
      }
    }, 500)

    setTimeout(() => {
      clearInterval(id)
    }, data.timeout * 1000)
  })
} 