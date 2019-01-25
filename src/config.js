const elements = require('./elements')

module.exports = {
  baseUrl: function() {
    return elements.config.dataset.baseUrl
  },
  clientId: function() {
    return elements.config.dataset.clientId
  },
  marketId: function() {
    return elements.config.dataset.marketId
  },
  countryCode: function() {
    return elements.config.dataset.countryCode
  },
  languageCode: function() {
    return elements.config.dataset.languageCode.split("-")[0]
  },
  cartUrl: function() {
    return elements.config.dataset.cartUrl
  },
  returnUrl: function() {
    return elements.config.dataset.returnUrl
  },
  privacyUrl: function() {
    return elements.config.dataset.privacyUrl
  },
  termsUrl: function() {
    return elements.config.dataset.termsUrl
  }
}
