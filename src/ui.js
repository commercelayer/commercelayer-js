const elements = require('./elements')

module.exports = {
  enableElement: function(el) {
    if (el) {
      el.removeAttribute('disabled')
    }
  },
  disableElement: function(el) {
    if (el) {
      el.setAttribute("disabled","disabled")
    }
  },
  setElementHTML(selector, html) {
    var $el = document.querySelector(selector)
    if ($el) {
      $el.innerHTML = html
    }
  },
  displayElement: function(el) {
    if (el) {
      el.style.display = 'block'
    }
  },
  hideElement: function(el) {
    if (el) {
      el.style.display = 'none'
    }
  },
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
  updateAddToBag: function(skuId, skuOptionText) {

    var $addToBag = elements.addToBag

    if ($addToBag) {
      $addToBag.dataset.skuId = skuId
      $addToBag.dataset.skuName = $addToBag.dataset.productName + ' (' + skuOptionText + ')'
      this.enableElement($addToBag)
    }
  },
  updateAvailableMessage: function(inventory) {
    var $availableMessage = elements.availableMessage
    var $unavailableMessage = elements.unavailableMessage

    this.hideElement($unavailableMessage)

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
        this.setElementHTML('.available-message-qty', first_level.quantity)
        this.setElementHTML('.available-message-min-days', first_delivery_lead_time.min.days)
        this.setElementHTML('.available-message-max-days', first_delivery_lead_time.max.days)
        this.setElementHTML('.available-message-shipping-price', first_delivery_lead_time.shipping_method.formatted_price_amount)
        this.displayElement($availableMessage)
      }

    }
  },
  displayUnavailableMessage: function() {
    hideElement(elements.availableMessage)
    displayElement(elements.unavailableMessage)
  },
  toggleShoppingBag: function() {
    elements.shoppingBag.classList.toggle("open")
    elements.main.classList.toggle("open")
  },
  openShoppingBag: function() {
    elements.shoppingBag.classList.add("open")
    elements.main.classList.add("open")
  },
  closeShoppingBag: function() {
    elements.shoppingBag.classList.remove("open")
    elements.main.classList.remove("open")
  },
  displayShoppingBagUnavailableMessage: function() {
    displayElement(elements.shoppingBagUnavailableMessage)
  },
  hideShoppingBagUnavailableMessage: function() {
    hideElement(elements.shoppingBagUnavailableMessage)
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
