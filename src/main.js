const api = require('./api')
const listeners = require('./listeners')

exports.init = function() {
  api.refreshOrder()
  api.getPrices()
  api.getVariants()
  listeners.setVariantSelect()
  listeners.setAddToShoppingBag()
  listeners.setShoppingBagToggle()
  listeners.setShoppingBagClose()
}
