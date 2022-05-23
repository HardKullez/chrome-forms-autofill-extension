// might have used block scope, but var leaks outside and function declaration without strict mode too
(function () {
  const fields = {
    username: document.getElementsByName('name'),
    email: document.getElementsByName('email'),
    phone: document.getElementsByName('tildaspec-phone-part[]')
  }

  chrome.storage.sync.get(['username', 'email', 'phone'], data => {
    for (let [name, value] of Object.entries(data)) {
      for (let field of fields[name]) {
        field.value = value
        field.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }))
      }
    }
  })
})()