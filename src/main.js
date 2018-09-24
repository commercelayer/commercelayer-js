const elements = require('./elements')
const axios = require('axios')
const auth = require('./auth')

const normalize = require('json-api-normalize')
const config = require('./config')
const utils = require('./utils')
const ui = require('./ui')
const api = require('./api')
const listeners = require('./listeners')


// function updateLineItemQty(lineItemId, quantity) {
//
//   api.updateLineItem(lineItemId, { quantity: quantity }).then(function(lineItem){
//     api.getOrder()
//   })
//   .catch(function(error) {
//     if (error.response) {
//       switch(error.response.status) {
//         case 422:
//           ui.displayShoppingBagUnavailableMessage()
//           break
//       }
//     }
//   })
//
// }

exports.init = function() {
  api.refreshOrder()
  api.getPrices()
  api.getVariants()
  listeners.setVariantSelect()
  listeners.setAddToShoppingBag()
  listeners.setShoppingBagToggle()
  listeners.setShoppingBagClose()
}
