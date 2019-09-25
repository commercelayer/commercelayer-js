const utils = require('./utils')
const normalize = require('json-api-normalize')

function enableElement(element) {
  if (element) {
    element.removeAttribute('disabled')
    element.classList.remove('disabled')
  }
}

function disableElement(element) {
  if (element) {
    element.setAttribute('disabled', 'disabled')
    element.classList.add('disabled')
  }
}

function displayElement(element) {
  if (element) {
    element.style.display = 'block'
  }
}

function hideElement(element) {
  if (element) {
    element.style.display = 'none'
  }
}

function setElementHTML(parent, selector, html) {
  element = parent.querySelector(selector)
  if (element) {
    element.innerHTML = html
  }
}

function updateShoppingBagItemsCount(order) {
  let shoppingBagItemsCounts = document.querySelectorAll(
    '.clayer-shopping-bag-items-count'
  )
  shoppingBagItemsCounts.forEach(function(shoppingBagItemsCount) {
    shoppingBagItemsCount.innerHTML = order.attributes.skus_count
  })
}

function updateShoppingBagTotal(order) {
  let shoppingBagTotals = document.querySelectorAll(
    '.clayer-shopping-bag-total'
  )
  shoppingBagTotals.forEach(function(shoppingBagTotal) {
    shoppingBagTotal.innerHTML =
      order.attributes.formatted_total_amount_with_taxes
  })
}

function updateShoppingBagSubtotal(order) {
  let shoppingBagSubtotals = document.querySelectorAll(
    '.clayer-shopping-bag-subtotal'
  )
  shoppingBagSubtotals.forEach(function(shoppingBagSubtotal) {
    shoppingBagSubtotal.innerHTML = order.attributes.formatted_subtotal_amount
  })
}

function updateShoppingBagShipping(order) {
  let shoppingBagShippings = document.querySelectorAll(
    '.clayer-shopping-bag-shipping'
  )
  shoppingBagShippings.forEach(function(shoppingBagShipping) {
    shoppingBagShipping.innerHTML = order.attributes.formatted_shipping_amount
  })
}

function updateShoppingBagPayment(order) {
  let shoppingBagPayments = document.querySelectorAll(
    '.clayer-shopping-bag-payment'
  )
  shoppingBagPayments.forEach(function(shoppingBagPayment) {
    shoppingBagPayment.innerHTML =
      order.attributes.formatted_payment_method_amount
  })
}

function updateShoppingBagTaxes(order) {
  let shoppingBagTaxes = document.querySelectorAll('.clayer-shopping-bag-taxes')
  shoppingBagTaxes.forEach(function(shoppingBagTax) {
    shoppingBagTax.innerHTML = order.attributes.formatted_total_tax_amount
  })
}

function updateShoppingBagDiscount(order) {
  let shoppingBagDiscounts = document.querySelectorAll(
    '.clayer-shopping-bag-discount'
  )
  shoppingBagDiscounts.forEach(function(shoppingBagDiscount) {
    shoppingBagDiscount.innerHTML = order.attributes.formatted_discount_amount
  })
}

module.exports = {
  updatePrice(sku, priceContainerId) {
    priceContainer = document.querySelector(`#${priceContainerId}`)
    if (priceContainer) {
      priceAmount = priceContainer.querySelector('.amount')
      if (priceAmount) {
        priceAmount.innerHTML = sku.prices[0].formatted_amount
      }
      priceCompareAmount = priceContainer.querySelector('.compare-at-amount')
      if (priceCompareAmount) {
        if (
          sku.prices[0].compare_at_amount_cents > sku.prices[0].amount_cents
        ) {
          priceCompareAmount.innerHTML =
            sku.prices[0].formatted_compare_at_amount
        }
      }
    }
  },
  updatePrices: function(skus) {
    skus.forEach(function(sku) {
      priceAmounts = document.querySelectorAll(
        '[data-sku-code="' + sku.code + '"] > .amount'
      )
      priceAmounts.forEach(function(priceAmount) {
        priceAmount.innerHTML = sku.prices[0].formatted_amount
      })
      priceCompareAmounts = document.querySelectorAll(
        '[data-sku-code="' + sku.code + '"] > .compare-at-amount'
      )
      priceCompareAmounts.forEach(function(priceCompareAmount) {
        if (
          sku.prices[0].compare_at_amount_cents > sku.prices[0].amount_cents
        ) {
          priceCompareAmount.innerHTML =
            sku.prices[0].formatted_compare_at_amount
        }
      })
    })
  },
  updateVariants: function(skus, clear) {
    if (clear === true) {
      let allVariants = document.querySelectorAll('.clayer-variant')
      allVariants.forEach(function(variant) {
        disableElement(variant)
      })
    }
    skus.forEach(function(sku) {
      let variants = document.querySelectorAll(
        '.clayer-variant[data-sku-code="' + sku.code + '"]'
      )
      variants.forEach(function(variant) {
        variant.value = sku.id
        enableElement(variant)
      })
    })
  },
  updateVariantsQuantity: function(skus) {
    console.log('skus :', skus)
    let allAddVariantQuantity = document.querySelectorAll(
      '.clayer-add-to-bag-quantity'
    )
    allAddVariantQuantity.forEach(function(addVariantQuantity) {
      disableElement(addVariantQuantity)
    })
    skus.forEach(function(sku) {
      let addVariantsQuantity = document.querySelectorAll(
        '.clayer-add-to-bag-quantity[data-sku-code="' + sku.code + '"]'
      )
      addVariantsQuantity.forEach(function(addVariantQuantity) {
        addVariantQuantity.dataset.skuId = sku.id
        enableElement(addVariantQuantity)
      })
    })
  },
  updateAddVariantQuantitySKU: function(
    skuId,
    skuName,
    skuReference,
    skuImageUrl,
    skuMaxQuantity,
    addToBagQuantityId
  ) {
    let addVariantQuantity = document.querySelector(`#${addToBagQuantityId}`)
    if (addVariantQuantity) {
      addVariantQuantity.dataset.skuId = skuId
      addVariantQuantity.value = 1
      addVariantQuantity.min = 1
      if (skuName) addVariantQuantity.dataset.skuName = skuName
      if (skuReference) addVariantQuantity.dataset.skuReference = skuReference
      if (skuImageUrl) addVariantQuantity.dataset.skuImageUrl = skuImageUrl
      if (skuMaxQuantity) addVariantQuantity.max = skuMaxQuantity
    }
  },

  updateAddToBags: function(skus) {
    let allAddToBags = document.querySelectorAll('.clayer-add-to-bag')
    allAddToBags.forEach(function(addToBag) {
      disableElement(addToBag)
    })
    skus.forEach(function(sku) {
      let addToBags = document.querySelectorAll(
        '.clayer-add-to-bag[data-sku-code="' + sku.code + '"]'
      )
      addToBags.forEach(function(addToBag) {
        addToBag.dataset.skuId = sku.id
        enableElement(addToBag)
      })
    })
  },
  updateAddToBagSKU: function(
    skuId,
    skuName,
    skuReference,
    skuImageUrl,
    addToBagId,
    addToBagQuantityId
  ) {
    let addToBag = document.querySelector(`#${addToBagId}`)
    if (addToBag) {
      addToBag.dataset.skuId = skuId
      if (skuName) addToBag.dataset.skuName = skuName
      if (skuReference) addToBag.dataset.skuReference = skuReference
      if (skuImageUrl) addToBag.dataset.skuImageUrl = skuImageUrl
      if (addToBagQuantityId)
        addToBag.dataset.addToBagQuantityId = addToBagQuantityId
    }
  },
  enableAddVariantQuantity: function(addToBagQuantityId) {
    let addVariantQuantity = document.querySelector(`#${addToBagQuantityId}`)
    if (addVariantQuantity) {
      enableElement(addVariantQuantity)
    }
  },
  disableAddVariantQuantity: function(addToBagQuantityId) {
    let addVariantQuantity = document.querySelector(`#${addToBagQuantityId}`)
    if (addVariantQuantity) {
      disableElement(addVariantQuantity)
    }
  },
  enableAddToBag: function(addToBagId) {
    let addToBag = document.querySelector(`#${addToBagId}`)
    if (addToBag) {
      enableElement(addToBag)
    }
  },
  disableAddToBag: function(addToBagId) {
    let addToBag = document.querySelector(`#${addToBagId}`)
    if (addToBag) {
      disableElement(addToBag)
    }
  },
  updateAvailabilityMessage: function(
    inventory,
    availabilityMessageContainerId
  ) {
    let availabilityMessageContainer = document.querySelector(
      `#${availabilityMessageContainerId}`
    )
    if (availabilityMessageContainer) {
      let first_level = utils.getInventoryFirstAvailableLevel(inventory)
      if (first_level.quantity > 0) {
        this.displayAvailableMessage(availabilityMessageContainer, first_level)
      } else {
        this.displayUnavailableMessage(availabilityMessageContainer)
      }
    }
  },
  updateShoppingBagSummary: function(order) {
    updateShoppingBagItemsCount(order)
    updateShoppingBagTotal(order)
    updateShoppingBagSubtotal(order)
    updateShoppingBagShipping(order)
    updateShoppingBagPayment(order)
    updateShoppingBagTaxes(order)
    updateShoppingBagDiscount(order)
  },
  updateShoppingBagCheckout: function(order) {
    let shoppingBagCheckouts = document.querySelectorAll(
      '.clayer-shopping-bag-checkout'
    )
    shoppingBagCheckouts.forEach(function(shoppingBagCheckout) {
      normalized_order = order.get(['line_items.id', 'checkout_url'])

      if (normalized_order.line_items) {
        enableElement(shoppingBagCheckout)
        shoppingBagCheckout.href = normalized_order.checkout_url
      } else {
        shoppingBagCheckout.href = ''
        disableElement(shoppingBagCheckout)
      }
    })
  },
  displayAvailableMessage: function(container, stockLevel) {
    dlt = stockLevel.delivery_lead_times[0]
    qty = stockLevel.quantity
    minDays = dlt.min.days
    maxDays = dlt.max.days
    minHours = dlt.min.hours
    maxHours = dlt.max.hours
    shippingMethodName = dlt.shipping_method.name
    shippingMethodPrice = dlt.shipping_method.formatted_price_amount

    if (container) {
      let template = document.querySelector(
        '#clayer-availability-message-available-template'
      )

      if (template) {
        let element = utils.getElementFromTemplate(template)

        setElementHTML(
          element,
          '.clayer-availability-message-available-qty',
          qty
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-min-days',
          minDays
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-max-days',
          maxDays
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-min-hours',
          minHours
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-max-hours',
          maxHours
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-shipping-method-name',
          shippingMethodName
        )
        setElementHTML(
          element,
          '.clayer-availability-message-available-shipping-method-price',
          shippingMethodPrice
        )

        container.innerHTML = ''
        container.appendChild(element)
        displayElement(container)
      }
    }
  },
  displayUnavailableMessage: function(container) {
    if (container) {
      let template = document.querySelector(
        '#clayer-availability-message-unavailable-template'
      )
      if (template) {
        let element = utils.getElementFromTemplate(template)
        container.innerHTML = ''
        container.appendChild(element)
        displayElement(container)
      }
    }
  },
  toggleShoppingBag: function() {
    let shoppingBagContainer = document.querySelector(
      '#clayer-shopping-bag-container'
    )
    if (shoppingBagContainer) {
      shoppingBagContainer.classList.toggle('open')
    }
    let main = document.querySelector('#clayer-main')
    if (main) {
      main.classList.toggle('open')
    }
  },
  openShoppingBag: function() {
    let shoppingBagContainer = document.querySelector(
      '#clayer-shopping-bag-container'
    )
    if (shoppingBagContainer) {
      shoppingBagContainer.classList.add('open')
    }
    let main = document.querySelector('#clayer-main')
    if (main) {
      main.classList.remove('open')
    }
  },
  clearShoppingBag: function() {
    if (document.querySelector('#clayer-shopping-bag-items-container')) {
      document.querySelector('#clayer-shopping-bag-items-container').innerHTML =
        ''
    }
  },
  hideAvailabilityMessages: function() {
    let allAvailabilityMessageContainers = document.querySelectorAll(
      '.clayer-availability-message-container'
    )
    allAvailabilityMessageContainers.forEach(function(container) {
      hideElement(container)
    })
  }
}
