function commercelayer() {
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

  document.commercelayer = module.exports
  document.commercelayer.init()
}

if (document.readyState == 'loading') {
  document.addEventListener('readystatechange', function(event) {
    if (document.readyState == 'interactive') {
      commercelayer()
    }
  })
} else {
  document.addEventListener('DOMContentLoaded', function(event) {
    commercelayer()
  })
}
