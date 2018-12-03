const elements = require('./elements')
const utils = require('./utils')
const normalize = require('json-api-normalize')

module.exports = {
  enableElement: function(el) {
    if (el) {
      el.classList.remove("disabled")
    }
  },
  disableElement: function(el) {
    if (el) {
      el.classList.add("disabled")
    }
  },
  setElementHTML(parent, selector, html) {
    el = parent.querySelector(selector)
    if (el) {
      el.innerHTML = html
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
    for (k = 0; k < skus.length; k++) {
      priceAmount = document.querySelector('[data-sku-code="' + skus[k].code + '"] > .amount')
      if (priceAmount) {
        priceAmount.innerHTML = skus[k].prices[0].formatted_amount
      }
      priceCompareAmount = document.querySelector('[data-sku-code="' + skus[k].code + '"] > .compare-at-amount')
      if (priceCompareAmount) {
        if (skus[k].prices[0].compare_at_amount_cents > skus[k].prices[0].amount_cents) {
          priceCompareAmount.innerHTML = skus[k].prices[0].formatted_compare_at_amount
        }
      }
    }
  },
  updateAddToBagSKU: function(skuId, skuName) {
    $addToBag = elements.addToBag
    if ($addToBag) {
      $addToBag.dataset.skuId = skuId
      $addToBag.dataset.skuName = skuName
    }
  },
  enableAddToBag: function() {
    $addToBag = elements.addToBag
    if ($addToBag) {
      this.enableElement($addToBag)
    }
  },
  disableAddToBag: function() {
    $addToBag = elements.addToBag
    if ($addToBag) {
      this.disableElement($addToBag)
    }
  },
  updateAvailabilityMessage: function(inventory) {

    $container = elements.availabilityMessageContainer

    if ($container) {

      first_level = utils.getInventoryFirstAvailableLevel(inventory)

      if (first_level.quantity > 0) {

        dlt = first_level.delivery_lead_times[0]

        qty = first_level.quantity
        minDays = dlt.min.days
        maxDays = dlt.max.days
        shippingMethodName = dlt.shipping_method.name
        shippingMethodPrice = dlt.shipping_method.formatted_price_amount
        this.displayAvailableMessage(qty, minDays, maxDays, shippingMethodName, shippingMethodPrice)
      } else {
        this.displayUnavailableMessage()
      }
    }
  },
  updateShoppingBagSummary: function(order) {
    $shoppingBagItemsCount = elements.shoppingBagItemsCount
    if ($shoppingBagItemsCount) {
      $shoppingBagItemsCount.innerHTML = order.attributes.skus_count
    }
    $shoppingBagTotal = elements.shoppingBagTotal
    if ($shoppingBagTotal) {
      $shoppingBagTotal.innerHTML = order.attributes.formatted_total_amount_with_taxes
    }
    $shoppingBagSubtotal = elements.shoppingBagSubtotal
    if ($shoppingBagSubtotal) {
      $shoppingBagSubtotal.innerHTML = order.attributes.formatted_subtotal_amount
    }
    $shoppingBagShipping = elements.shoppingBagShipping
    if ($shoppingBagShipping) {
      $shoppingBagShipping.innerHTML = order.attributes.formatted_shipping_amount
    }
    $shoppingBagPayment = elements.shoppingBagPayment
    if ($shoppingBagPayment) {
      $shoppingBagPayment.innerHTML = order.attributes.formatted_payment_method_amount
    }
    $shoppingBagTaxes = elements.shoppingBagTaxes
    if ($shoppingBagTaxes) {
      $shoppingBagTaxes.innerHTML = order.attributes.formatted_total_tax_amount
    }
    $shoppingBagDiscount = elements.shoppingBagDiscount
    if ($shoppingBagDiscount) {
      $shoppingBagDiscount.innerHTML = order.attributes.formatted_discount_amount
    }
  },
  updateShoppingBagCheckout: function(order) {
    $shoppingBagCheckout = elements.shoppingBagCheckout
    if ($shoppingBagCheckout) {
      normalized_order = normalize(order).get([
        'line_items.id',
        'checkout_url'
      ])[0]

      if (normalized_order.line_items) {
        this.enableElement($shoppingBagCheckout)
        $shoppingBagCheckout.href = normalized_order.checkout_url
      } else {
        $shoppingBagCheckout.href = ''
        this.disableElement($shoppingBagCheckout)
      }
    }
  },
  displayAvailableMessage: function(qty, minDays, maxDays, shippingMethodName, shippingMethodPrice) {
    $container = elements.availabilityMessageContainer

    if ($container) {
      $tmp = elements.availabilityMessageAvailableTemplate

      if ($tmp) {

        $el = utils.getElementFromTemplate($tmp)

        this.setElementHTML($el, '.clayer-availability-message-available-qty', qty)
        this.setElementHTML($el, '.clayer-availability-message-available-min-days', minDays)
        this.setElementHTML($el, '.clayer-availability-message-available-max-days', maxDays)
        this.setElementHTML($el, '.clayer-availability-message-available-shipping-method-name', shippingMethodName)
        this.setElementHTML($el, '.clayer-availability-message-available-shipping-method-price', shippingMethodPrice)

        $container.innerHTML = ''
        $container.appendChild($el)
      }
    }
  },
  displayUnavailableMessage: function() {

    $container = elements.availabilityMessageContainer

    if ($container) {
      $tmp = elements.availabilityMessageUnavailableTemplate

      if ($tmp) {
        $el = utils.getElementFromTemplate($tmp)
        $container.innerHTML = ''
        $container.appendChild($el)
      }
    }
  },
  toggleShoppingBag: function() {
    $shoppingBagContainer = elements.shoppingBagContainer
    if ($shoppingBagContainer) {
      $shoppingBagContainer.classList.toggle("open")
    }
    $main = elements.main
    if ($main) {
      $main.classList.toggle("open")
    }
  },
  openShoppingBag: function() {
    $shoppingBagContainer = elements.shoppingBagContainer
    if ($shoppingBagContainer) {
      $shoppingBagContainer.classList.add("open")
    }
    $main = elements.main
    if ($main) {
      $main.classList.remove("open")
    }
  },
  clearShoppingBag: function() {
    if(elements.shoppingBagItemsContainer){
      elements.shoppingBagItemsContainer.innerHTML = '';
    }
  },
  displayShoppingBagUnavailableMessage: function() {
    this.displayElement(elements.shoppingBagUnavailableMessage)
  },
  hideShoppingBagUnavailableMessage: function() {
    this.hideElement(elements.shoppingBagUnavailableMessage)
  }
}
