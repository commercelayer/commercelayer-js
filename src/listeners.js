const elements = require('./elements')
const axios = require('axios')
const auth = require('./auth')

const ui = require('./ui')
const api = require('./api')
const utils = require('./utils')

module.exports = {
  setVariantSelect: function() {

    var $variantSelect = document.querySelector('.variant-select')

    if ($variantSelect) {
      $variantSelect.addEventListener('change', function () {
        var skuId = this.value
        var skuOptionText = this.options[this.selectedIndex].text;
        axios
          .get('/api/skus/' + skuId + '?fields[skus]=inventory')
          .then(function(response) {
            var sku = response.data.data
            if (sku.attributes.inventory.available) {
              ui.updateAddToBag(skuId, skuOptionText)
              ui.updateAvailableMessage(sku.attributes.inventory)
            }
          })
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
