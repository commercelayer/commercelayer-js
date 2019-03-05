function initCommercelayer() {

  const api = require('./api')
  const listeners = require('./listeners')
  const config = require('./config')
  const clsdk = require('@commercelayer/sdk')

  exports.init = function() {

    clsdk.initialize({
      client_id : config.clientId(),
      market_id : config.marketId(),
      base_url : config.baseUrl(),
      country_code : config.countryCode(),
      language_code : config.languageCode()
    });

    clsdk.settings.debug = true;
    clsdk.settings.console = true;
    clsdk.settings.trace = true;

    api.getPrices()
    api.getVariants()
    listeners.setVariantSelect()
    listeners.setAddToShoppingBagButtons()
    listeners.setShoppingBagToggle()
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
