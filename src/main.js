function initCommercelayer() {
  const api = require('./api')
  const listeners = require('./listeners')
  const utils = require('./utils')

  exports.init = function() {
    api.getPrices()
    api.getVariants()
    listeners.setVariantSelect()
    listeners.setAddToShoppingBag()
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
