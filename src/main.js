function initCommercelayer() {

  const api = require('./api')
  const listeners = require('./listeners')
  const config = require('./config')
  const clsdk = require('@commercelayer/sdk')

  exports.init = function() {

    clsdk.initialize({
      client_id : config.clientId,
      market_id : config.marketId,
      base_url : config.baseUrl,
      country_code : config.countryCode,
      language_code : config.languageCode
    })

    clsdk.settings.debug = config.devSettings.debug
    clsdk.settings.console = config.devSettings.console
    clsdk.settings.trace = config.devSettings.trace

    api.getPrices()
    api.getVariants()
    api.getAddToBags()

    listeners.setupVariants()
    listeners.setupAddToBags()
    listeners.setupShoppingBagToggles()

    api.refreshOrder()
  }

  window.commercelayer = module.exports
  module.exports.init()
}

if (document.readyState == 'loading') {
  document.addEventListener('readystatechange', function(event) {
    if (document.readyState == 'interactive') {
      initCommercelayer()
    }
  })
} else { // interactive or complete
  initCommercelayer()
}
