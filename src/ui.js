module.exports = {

  updatePrices: function(skus) {
    for (var k = 0; k < skus.length; k++) {
      var priceAmount = document.querySelector('[data-sku-code=' + skus[k].code + '] > .amount')
      if (priceAmount) {
        priceAmount.innerHTML = skus[k].prices[0].formatted_amount
      }
      var priceCompareAmount = document.querySelector('[data-sku-code=' + skus[k].code + '] > .compare-at-amount')
      if (priceCompareAmount) {
        priceCompareAmount.innerHTML = skus[k].prices[0].formatted_compare_at_amount
      }
    }
  },
  toggleShoppingBag: function() {
    document.querySelector('#shopping-bag').classList.toggle("open");
    document.querySelector('#main').classList.toggle("open");
  },
  openShoppingBag: function() {
    document.querySelector('#shopping-bag').classList.add("open");
    document.querySelector('#main').classList.add("open");
  },
  closeShoppingBag: function() {
    document.querySelector('#shopping-bag').classList.remove("open");
    document.querySelector('#main').classList.remove("open");
  },
  displayAvailableMessage: function(inventory) {
    var $availableMessage = document.querySelector('.available-message')

    if ($availableMessage) {

      first_level = inventory.levels[0]

      if (first_level.quantity == 0) {
        for(var k=1; k < inventory.levels.length; k++) {
          level = inventory.levels[k]
          if (level.quantity > 0) {
            first_level = level
            break
          }
        }
      }

      if (first_level.quantity > 0) {
        first_delivery_lead_time = first_level.delivery_lead_times[0]

        var $availableMessageQty = document.querySelector('.available-message-qty')
        if ($availableMessageQty) {
          $availableMessageQty.innerHTML = first_level.quantity
        }

        var $availableMessageMinDays = document.querySelector('.available-message-min-days')
        if ($availableMessageMinDays) {
          $availableMessageMinDays.innerHTML = first_delivery_lead_time.min.days
        }

        var $availableMessageMaxDays = document.querySelector('.available-message-max-days')
        if ($availableMessageMaxDays) {
          $availableMessageMaxDays.innerHTML = first_delivery_lead_time.max.days
        }

        var $availableMessageShippingPrice = document.querySelector('.available-message-shipping-price')
        if ($availableMessageShippingPrice) {
          $availableMessageShippingPrice.innerHTML = first_delivery_lead_time.shipping_method.formatted_price_amount
        }

        $availableMessage.style.display = 'block'

      }

    }

    document.querySelector('.unavailable-message').style.display = 'none'
  },
  displayUnavailableMessage: function() {
    document.querySelector('.available-message').style.display = 'none'
    document.querySelector('.unavailable-message').style.display = 'block'
  },
  displayShoppingBagUnavailableMessage: function() {
    document.querySelector('.shopping-bag-unavailable-message').style.display = 'block'
  },
  hideShoppingBagUnavailableMessage: function() {
    document.querySelector('.shopping-bag-unavailable-message').style.display = 'none'
  },
  updateAddToBagLink: function(skuId, skuOptionText) {
    var $addToBag = document.querySelector(".add-to-bag")

    if ($addToBag) {
      $addToBag.dataset.skuId = skuId
      $addToBag.dataset.skuName = $addToBag.dataset.productName + ' (' + skuOptionText + ')'
      $addToBag.removeAttribute('disabled')
    }
  },
  addTableColText: function(tableRow, text, className) {
    var tableCol = document.createElement('td')
    tableCol.classList.add('shopping-bag-col')
    tableCol.classList.add(className)
    var tableColText = document.createTextNode(text)
    tableCol.appendChild(tableColText)
    tableRow.appendChild(tableCol)
  },
  addTableColImage: function(tableRow, imageUrl, className) {
    var tableCol = document.createElement('td')
    tableCol.classList.add('shopping-bag-col')
    tableCol.classList.add(className)
    var tableColImg = document.createElement('img')
    tableColImg.src = imageUrl
    tableCol.appendChild(tableColImg)
    tableRow.appendChild(tableCol)
  },
  addTableColElement: function(tableRow, element, className) {
    var tableCol = document.createElement('td')
    tableCol.classList.add('shopping-bag-col')
    tableCol.classList.add(className)
    tableCol.appendChild(element)
    tableRow.appendChild(tableCol)
  }
}
