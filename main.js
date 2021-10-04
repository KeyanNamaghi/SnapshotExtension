const getSnapshot = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const pageUrl = tab[0].url
    const regex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g

    const matchArray = pageUrl.match(regex)
    const domain = pageUrl.split('/')[2]

    if (!matchArray) {
      chrome.tabs.create({
        url: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif?cid=ecf05e47xmmukjdmwahuqizbjq5r73vmxiys1xbfz9346exs&rid=giphy.gif&ct=g'
      })
      return
    }

    chrome.tabs.create({ url: `http://${domain}/checkout-api-v2/checkouts/${matchArray[0]}` })
  })
}

chrome.contextMenus.create({
  title: '_Open Snapshot 📸',
  contexts: ['all'],
  onclick: getSnapshot,
  documentUrlPatterns: [
    'http://localhost/*',
    'http://ui-payment-stub.service.eu-west-1.dev.deveng.systems/checkout/*',
    'https://uat2.test-arg-uk.com/checkout/*',
    'https://www.argos.co.uk/checkout/*'
  ]
})
