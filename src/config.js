module.exports = {
  baseUrl: function() {
    return document.querySelector('#clayer-config').dataset.baseUrl
  },
  clientId: function() {
    return document.querySelector('#clayer-config').dataset.clientId
  },
  marketId: function() {
    return document.querySelector('#clayer-config').dataset.marketId
  },
  countryCode: function() {
    return document.querySelector('#clayer-config').dataset.countryCode
  },
  languageCode: function() {
    return document.querySelector('#clayer-config').dataset.languageCode.split("-")[0]
  },
  cartUrl: function() {
    return document.querySelector('#clayer-config').dataset.cartUrl
  },
  returnUrl: function() {
    return document.querySelector('#clayer-config').dataset.returnUrl
  },
  privacyUrl: function() {
    return document.querySelector('#clayer-config').dataset.privacyUrl
  },
  termsUrl: function() {
    return document.querySelector('#clayer-config').dataset.termsUrl
  }
}
