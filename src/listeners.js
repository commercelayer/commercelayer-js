const elements = require('./elements')
const ui = require('./ui')
const api = require('./api')
const utils = require('./utils')

module.exports = {

  setVariantSelect: function() {

    $variantSelect = elements.variantSelect

    if ($variantSelect) {
      $variantSelect.addEventListener('change', function(event){
        $selectedOption = $variantSelect.options[this.selectedIndex]
        api.getInventory($selectedOption.value, $selectedOption.dataset.skuName)
      })
    } else { // radio
      $variants = elements.variants
      $variants.forEach(function (variant) {
        variant.addEventListener('click', function(event){
          api.getInventory(this.value, this.dataset.skuName)
        })
      })
    }
  },

  setAddToShoppingBag: function() {
    $addToBag = elements.addToBag

    if ($addToBag) {
      $addToBag.addEventListener('click', function(event) {
        event.preventDefault()

        orderPromise = utils.getOrderToken() ? api.getOrder() : api.createOrder()

        orderPromise.then(function(order){
          api.createLineItem(order.get('id')[0], $addToBag.dataset.skuId, $addToBag.dataset.skuName, $addToBag.dataset.skuImageUrl).then(function(lineItem){
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
    $shoppingBagToggle = elements.shoppingBagToggle
    if ($shoppingBagToggle) {
      $shoppingBagToggle.addEventListener('click', function(event){
        event.preventDefault()
        ui.toggleShoppingBag()
      })
    }
  }
  
}
