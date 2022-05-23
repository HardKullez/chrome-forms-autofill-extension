const changeUsername = document.getElementById('changeUsername')
const changeEmail = document.getElementById('changeEmail')
const changePhone = document.getElementById('changePhone')
const changeTimeout = document.getElementById('changeTimeout')


chrome.storage.sync.get(['username', 'email', 'phone', 'timeout'], ({ username, email, phone, timeout }) => {
  changeUsername.value = username;
  changeEmail.value = email;
  changePhone.value = phone;
  changeTimeout.value = timeout
});


changeUsername.addEventListener('input', (e) => {
  chrome.storage.sync.set({ username: e.target.value })
  updateTabs()
})

changeEmail.addEventListener('input', (e) => {
  chrome.storage.sync.set({ email: e.target.value })
  updateTabs()
})

changePhone.addEventListener('input', (e) => {
  chrome.storage.sync.set({ phone: e.target.value })
  updateTabs()
})

changeTimeout.addEventListener('input', (e) => {
  if (!isNaN(e.target.value)) {
    chrome.storage.sync.set({ timeout: e.target.value })
  }
})

function updateTabs() {
  chrome.tabs.query({ url: "*://*.skyeng.ru/*" }, tabs => {
    tabs.filter(tab => tab.status === 'complete' && !tab.discarded).forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/updateTabFormFields.js']
      })
    })
  })
} 