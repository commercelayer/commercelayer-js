const axios = require('axios')
const auth = require('./auth')
const ui = require('./ui')

module.exports = {
  updateVariantSelect: function() {

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
  }
}
