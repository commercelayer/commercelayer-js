const elements = require('./elements')
const axios = require('axios')
const auth = require('./auth')
const ui = require('./ui')
const api = require('./api')
const utils = require('./utils')

module.exports = {
  setVariantSelect: function() {

    var $variantSelect = elements.variantSelect

    if ($variantSelect) {
      $variantSelect.addEventListener('change', api.getInventory($variantSelect.value, $variantSelect.options[this.selectedIndex].dataset.skuName))
    } else { // radio
      $variants = elements.variants
      $variants.forEach(function (variant) {
        console.log(variant)
        variant.addEventListener('click', api.getInventory(variant.value, variant.dataset.skuName))
      })
    }
  },
  setAddToShoppingBag: function() {
    var $addToBag = elements.addToBag

    if ($addToBag) {
      $addToBag.addEventListener('click', function(event){
        event.preventDefault()

        var orderPromise = utils.getOrderToken() ? api.getOrder() : api.createOrder()

        orderPromise.then(function(order){
          api.createLineItem(order.id, $addToBag.dataset.skuId, $addToBag.dataset.skuName, $addToBag.dataset.skuImageUrl).then(function(lineItem){
            api.getOrder()
            ui.openShoppingBag()
          })
          .catch(function(error) {
            if (error.response) {
              switch(error.response.status) {
                case 422:
                  ui.displayUnavailableMessage()
                  break
              }
            }
          })
        })
      })
    }
  },
  setShoppingBagToggle: function() {
    var $shoppingBagToggle = elements.shoppingBagToggle
    if ($shoppingBagToggle) {
      $shoppingBagToggle.addEventListener('click', function(event){
        event.preventDefault()
        ui.toggleShoppingBag()
      })
    }
  },
  setShoppingBagClose: function() {
    var $shoppingBagClose = elements.shoppingBagClose
    if ($shoppingBagClose) {
      $shoppingBagClose.addEventListener('click', function(event){
        event.preventDefault()
        ui.closeShoppingBag()
      })
    }
  }

}
