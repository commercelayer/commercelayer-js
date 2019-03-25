const ui = require('./ui')
const api = require('./api')
const utils = require('./utils')

module.exports = {

  setupVariants: function() {
    let variantSelects = document.querySelectorAll('.clayer-variant-select')
    variantSelects.forEach(function (variantSelect) {
      variantSelect.addEventListener('change', function(event){
        let selectedOption = variantSelect.options[this.selectedIndex]
        api.selectSku(selectedOption.value, selectedOption.dataset.skuName, selectedOption.dataset.skuReference, selectedOption.dataset.skuImageUrl, this.dataset.priceContainerId, this.dataset.availabilityMessageContainerId, this.dataset.addToBagId)
      })
    })

    let variantRadios = document.querySelectorAll('.clayer-variant-radio')
    variantRadios.forEach(function (variantRadio) {
      variantRadio.addEventListener('click', function(event){
        api.selectSku(this.value, this.dataset.skuName, this.dataset.skuReference, this.dataset.skuImageUrl, this.dataset.priceContainerId, this.dataset.availabilityMessageContainerId, this.dataset.addToBagId)
      })
    })
  },

  setupAddToBags: function() {
    let addToBags = document.querySelectorAll(".clayer-add-to-bag")

    addToBags.forEach(function (addToBag) {
      addToBag.addEventListener('click', function(event) {
        event.preventDefault()

        let orderPromise = utils.getOrderToken() ? api.getOrder() : api.createOrder()

        orderPromise.then(function(order){

          api.createLineItem(order.id, addToBag.dataset.skuId, addToBag.dataset.skuName, addToBag.dataset.skuReference, addToBag.dataset.skuImageUrl).then(function(lineItem){
            api.getOrder()
            ui.openShoppingBag()
          })
          .catch(function(error) {
            switch(error.status) {
              case 422:
                let availabilityMessageContainer = document.querySelector(`#${addToBag.dataset.availabilityMessageContainerId}`)
                if (availabilityMessageContainer) {
                  ui.displayUnavailableMessage(availabilityMessageContainer)
                }
                break
            }
          })
        })
      })
    })
  },

  setupShoppingBagToggles: function() {
    let shoppingBagToggles = document.querySelectorAll('.clayer-shopping-bag-toggle')
    shoppingBagToggles.forEach(function(shoppingBagToggle){
      shoppingBagToggle.addEventListener('click', function(event){
        event.preventDefault()
        ui.toggleShoppingBag()
      })
    })
  }
}
