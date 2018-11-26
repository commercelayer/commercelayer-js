const elements = require('./elements')
const normalize = require('json-api-normalize')

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
      $addToBag.dataset.skuName = $addToBag.dataset.productName
      $addToBag.dataset.skuName += skuOptionText ? ' (' + skuOptionText + ')' : ''
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

  updateShoppingBagPreview: function(order) {
    var $shoppingBagPreviewCount = elements.shoppingBagPreviewCount
    if ($shoppingBagPreviewCount) {
      $shoppingBagPreviewCount.innerHTML = order.attributes.skus_count
    }
    var $shoppingBagPreviewTotal = elements.shoppingBagPreviewTotal
    if ($shoppingBagPreviewTotal) {
      $shoppingBagPreviewTotal.innerHTML = order.attributes.formatted_total_amount_with_taxes
    }
  },
  updateShoppingBagCheckout: function(order) {
    var $shoppingBagCheckout = elements.shoppingBagCheckout
    if ($shoppingBagCheckout) {
      var normalized_order = normalize(order).get([
        'line_items.id',
        'checkout_url'
      ])[0]

      if (normalized_order.line_items) {
        $shoppingBagCheckout.removeAttribute('disabled')
        $shoppingBagCheckout.href = normalized_order.checkout_url
      } else {
        $shoppingBagCheckout.setAttribute('disabled', '')
      }
    }
  },

  displayUnavailableMessage: function() {
    this.hideElement(elements.availableMessage)
    this.displayElement(elements.unavailableMessage)
  },
  toggleShoppingBag: function() {
    $shoppingBag = elements.shoppingBag
    if ($shoppingBag) {
      $shoppingBag.classList.toggle("open")
    }
    $main = elements.main
    if ($main) {
      $main.classList.toggle("open")
    }
  },
  openShoppingBag: function() {
    $shoppingBag = elements.shoppingBag
    if ($shoppingBag) {
      $shoppingBag.classList.add("open")
    }
    $main = elements.main
    if ($main) {
      $main.classList.add("open")
    }
  },
  closeShoppingBag: function() {
    $shoppingBag = elements.shoppingBag
    if ($shoppingBag) {
      $shoppingBag.classList.remove("open")
    }
    $main = elements.main
    if ($main) {
      $main.classList.remove("open")
    }
  },
  displayShoppingBagUnavailableMessage: function() {
    this.displayElement(elements.shoppingBagUnavailableMessage)
  },
  hideShoppingBagUnavailableMessage: function() {
    this.hideElement(elements.shoppingBagUnavailableMessage)
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
