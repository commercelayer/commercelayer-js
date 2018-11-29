const api = require('./api')
const listeners = require('./listeners')
const utils = require('./utils')

exports.init = function() {
  api.getPrices()
  api.getVariants()
  listeners.setVariantSelect()
  listeners.setAddToShoppingBag()
  listeners.setShoppingBagToggle()
  listeners.setShoppingBagClose()
  api.refreshOrder()
}
