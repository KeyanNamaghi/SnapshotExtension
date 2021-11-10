const handleError = () => {
  chrome.tabs.create({
    url: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif?cid=ecf05e47xmmukjdmwahuqizbjq5r73vmxiys1xbfz9346exs&rid=giphy.gif&ct=g'
  })
}

const checkoutDocumentUrlPatterns = [
  'http://localhost/checkout/*',
  'http://ui-payment-stub.service.eu-west-1.dev.deveng.systems/checkout/*',
  'https://uat2.test-arg-uk.com/checkout/*',
  'https://www.argos.co.uk/checkout/*'
]

const getOrder = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const pageUrl = tab[0].url
    const regex = /([0-9a-f]{64})/g

    const matchArray = pageUrl.match(regex)
    const domain = pageUrl.split('/')[2]
    const id = pageUrl.split('/')[4]

    if (!matchArray) {
      handleError()
      return
    }

    chrome.tabs.create({ url: `http://${domain}/checkout-api-v2/orders/${id}?hash=${matchArray[0]}` })
  })
}

chrome.contextMenus.create({
  title: '_Open Get Order 🧾',
  contexts: ['all'],
  onclick: getOrder,
  documentUrlPatterns: [
    'http://localhost/confirmation/*',
    'http://ui-payment-stub.service.eu-west-1.dev.deveng.systems/confirmation/*',
    'https://uat2.test-arg-uk.com/confirmation/*',
    'https://www.argos.co.uk/confirmation/*'
  ]
})

const endpointBuilder = (tab) => {
  const pageUrl = tab[0].url
  const regex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g

  const matchArray = pageUrl.match(regex)
  const domain = pageUrl.split('/')[2]

  if (!matchArray) {
    handleError()
    return
  }

  return { domain, id: matchArray[0] }
}

const getSnapshot = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const { domain, id } = endpointBuilder(tab)
    chrome.tabs.create({ url: `http://${domain}/checkout-api-v2/checkouts/${id}` })
  })
}

const getPaymentMethods = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const { domain, id } = endpointBuilder(tab)
    chrome.tabs.create({ url: `http://${domain}/checkout-api-v2/checkouts/${id}/paymentMethods` })
  })
}

const getCreditPlans = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const { domain, id } = endpointBuilder(tab)
    chrome.tabs.create({ url: `http://${domain}/checkout-api-v2/checkouts/${id}/creditplans` })
  })
}

const getAddresses = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const { domain, id } = endpointBuilder(tab)
    try {
      fetch(`http://${domain}/checkout-api-v2/checkouts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.snapshot.customer.id)
          const customerId = data.snapshot.customer.id
          chrome.tabs.create({ url: `http://${domain}/account-api/users/${customerId}/addresses` })
        })
    } catch {
      handleError()
    }
  })
}

const getWallet = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const { domain, id } = endpointBuilder(tab)
    try {
      fetch(`http://${domain}/checkout-api-v2/checkouts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.snapshot.customer.id)
          const customerId = data.snapshot.customer.id
          chrome.tabs.create({ url: `http://${domain}/account-api/users/${customerId}/wallet` })
        })
    } catch {
      handleError()
    }
  })
}

chrome.contextMenus.create({
  title: 'Open Snapshot 📸',
  contexts: ['all'],
  onclick: getSnapshot,
  documentUrlPatterns: checkoutDocumentUrlPatterns
})

chrome.contextMenus.create({
  title: 'Open Payment Methods 💰',
  contexts: ['all'],
  onclick: getPaymentMethods,
  documentUrlPatterns: checkoutDocumentUrlPatterns
})

chrome.contextMenus.create({
  title: 'Open Credit Plans 💳',
  contexts: ['all'],
  onclick: getCreditPlans,
  documentUrlPatterns: checkoutDocumentUrlPatterns
})

chrome.contextMenus.create({
  title: 'Open Addresses 🏠',
  contexts: ['all'],
  onclick: getAddresses,
  documentUrlPatterns: checkoutDocumentUrlPatterns
})

chrome.contextMenus.create({
  title: 'Open Wallet 🧧',
  contexts: ['all'],
  onclick: getWallet,
  documentUrlPatterns: checkoutDocumentUrlPatterns
})

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    if (tab[0].url.includes('checkout')) {
      getSnapshot()
    } else {
      getOrder()
    }
  })
})
