const ui = require('./ui')
const api = require('./api')
const utils = require('./utils')

module.exports = {

  setVariantSelect: function() {

    let variantSelect = document.querySelector('.clayer-variant-select')

    if (variantSelect) {
      variantSelect.addEventListener('change', function(event){
        let selectedOption = variantSelect.options[this.selectedIndex]
        api.getInventory(selectedOption.value, selectedOption.dataset.skuName)
      })
    } else { // radio
      let variants = document.querySelectorAll('.clayer-variant')
      variants.forEach(function (variant) {
        variant.addEventListener('click', function(event){
          api.getInventory(this.value, this.dataset.skuName)
        })
      })
    }
  },

  setAddToShoppingBagButtons: function() {
    let addToBagButtons = document.querySelectorAll(".clayer-add-to-bag")

    if (addToBagButtons.length > 0) {
      addToBagButtons.forEach(function (addToBag) {
        addToBag.addEventListener('click', function(event) {
          event.preventDefault()

          orderPromise = utils.getOrderToken() ? api.getOrder() : api.createOrder()

          orderPromise.then(function(order){

            api.createLineItem(order.get('id')[0], addToBag.dataset.skuId, addToBag.dataset.skuName, addToBag.dataset.skuImageUrl).then(function(lineItem){
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
      })
    }
  },

  setShoppingBagToggle: function() {
    let shoppingBagToggle = document.querySelector('#clayer-shopping-bag-toggle')
    if (shoppingBagToggle) {
      shoppingBagToggle.addEventListener('click', function(event){
        event.preventDefault()
        ui.toggleShoppingBag()
      })
    }
  }

}
