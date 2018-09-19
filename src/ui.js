exports.toggleShoppingBag = function toggleShoppingBag() {
  document.querySelector('#shopping-bag').classList.toggle("open");
  document.querySelector('#main').classList.toggle("open");
}

exports.openShoppingBag = function openShoppingBag() {
  document.querySelector('#shopping-bag').classList.add("open");
  document.querySelector('#main').classList.add("open");
}

exports.closeShoppingBag = function closeShoppingBag() {
  document.querySelector('#shopping-bag').classList.remove("open");
  document.querySelector('#main').classList.remove("open");
}

exports.displayAvailableMessage = function displayAvailableMessage(inventory) {
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
}

exports.displayUnavailableMessage = function displayUnavailableMessage() {
  document.querySelector('.available-message').style.display = 'none'
  document.querySelector('.unavailable-message').style.display = 'block'
}

exports.displayShoppingBagUnavailableMessage = function displayShoppingBagUnavailableMessage() {
  document.querySelector('.shopping-bag-unavailable-message').style.display = 'block'
}

exports.hideShoppingBagUnavailableMessage = function hideShoppingBagUnavailableMessage() {
  document.querySelector('.shopping-bag-unavailable-message').style.display = 'none'
}

exports.updateAddToBagLink = function updateAddToBagLink(skuId, skuOptionText) {
  var $addToBag = document.querySelector(".add-to-bag")

  if ($addToBag) {
    $addToBag.dataset.skuId = skuId
    $addToBag.dataset.skuName = $addToBag.dataset.productName + ' (' + skuOptionText + ')'
    $addToBag.removeAttribute('disabled')
  }
}
