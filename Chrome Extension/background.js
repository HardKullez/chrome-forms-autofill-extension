chrome.runtime.onInstalled.addListener(() => {
  const defaults = {
    username: 'tstprod',
    email: 'default@mail.com',
    phone: '+79221996764',
    timeout: 1
  }
  chrome.storage.sync.set({ ...defaults })
  updateTabs()
})

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status == 'complete' && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: updateFieldsOnPageLoad
    })
  }
})

// ; (async () => {
//   console.log((await chrome.tabs.query({})).filter(tab => tab.url))

// })();

async function updateTabs() {
  const tabs = await chrome.tabs.query({ url: "*://*.skyeng.ru/*", active: true })

  if (!tabs.length) return

  for (let tab of tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/updateCurrentTab.js']
    })
  }
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
      console.log('timeout killed')
      clearInterval(id)
    }, data.timeout * 1000)
  })
}