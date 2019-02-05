const elements = require('./elements')
// const axios = require('axios')
// const auth = require('./auth')
// const normalize = require('json-api-normalize')
const config = require('./config')
const utils = require('./utils')
const ui = require('./ui')

const clsdk = require('@commercelayer/commercelayer-js-sdk')

module.exports = {
  getPrices: function() {

    $prices = elements.prices

    if ($prices.length > 0) {

      skuCodes = []

      $prices.forEach(function ($price) {
        skuCodes.push($price.dataset.skuCode)
      })

      skus = []
      skusEndpoint = '/api/skus?filter[codes]=' + skuCodes.join(',') +'&include=prices&page[size]=25'
      skuAttributes = [
        'id',
        'code',
        'prices.formatted_amount',
        'prices.formatted_compare_at_amount',
        'prices.amount_cents',
        'prices.compare_at_amount_cents'
      ]

      axios
        .get(skusEndpoint)
        .then(function(response) {

          ui.updatePrices(normalize(response.data).get(skuAttributes))

          pageCount = response.data.meta.page_count

          if (pageCount > 1) {
            for (p=2; p<=pageCount; p++ ) {

              skusEndpointWithPage = skusEndpoint + '&page[number]=' + p

              axios
                .get(skusEndpointWithPage)
                .then(function(response) {
                  ui.updatePrices(normalize(response.data).get(skuAttributes))
                })
            }
          }
        })
    }
  },
  getVariants: function() {

    ui.disableElement(elements.addToBag)

    $variants = elements.variants

    if ($variants.length > 0) {

      skuCodes = []

      $variants.forEach(function (variant) {
        ui.disableElement(variant)
        skuCodes.push(variant.dataset.skuCode)
      })

      axios
        .get('/api/skus?filter[codes]=' + skuCodes.join(','))
        .then(function(response) {
          skus = normalize(response.data).get([
            'id',
            'code'
          ])

          for (i = 0; i < skus.length; i++) {

            variant = document.querySelector('.clayer-variant[data-sku-code="' + skus[i].code + '"]')
            if (variant) {
              variant.value = skus[i].id
              ui.enableElement(variant)
              if (i == 0) {
                module.exports.selectVariant(variant)
              }
            }
          }
        })
    }
  },
  getInventory: function(skuId, skuName) {
    axios
      .get('/api/skus/' + skuId + '?fields[skus]=inventory')
      .then(function(response) {
        sku = response.data.data
        ui.updateAvailabilityMessage(sku.attributes.inventory)
        if (sku.attributes.inventory.available) {
          ui.updateAddToBagSKU(skuId, skuName)
          ui.enableAddToBag()
        } else {
          ui.disableAddToBag()
        }
      })
  },
  selectVariant: function(variant) {
    switch(variant.tagName) {
      case "INPUT":
        switch(variant.type) {
          case "radio":
            variant.click()
            break
          case "hidden":
            module.exports.getInventory(variant.value, variant.dataset.skuName)
            break
        }
        break
      case "OPTION":
        $select = variant.parentNode
        $select.value = variant.value
        $select.dispatchEvent(new Event('change'))
        break
    }
  },
  createOrder: function() {
    return axios
      .post('/api/orders', {
        data: {
          type: 'orders',
          attributes: {
            shipping_country_code_lock: config.countryCode(),
            language_code: config.languageCode(),
            cart_url: config.cartUrl(),
            return_url: config.returnUrl(),
            privacy_url: config.privacyUrl(),
            terms_url: config.termsUrl()
          }
        }
      },{
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      }
    ).then(function(response) {
      utils.setOrderToken(response.data.data.attributes.token)
      return(response.data.data)
    })
  },
  refreshOrder: function() {
    if (utils.getOrderToken()) {
      this.getOrder().then(function(order) {
        if (order && order.attributes.status == 'placed') {
          utils.deleteOrderToken()
          ui.clearShoppingBag()
        }
      })
    }
  },
  createLineItem: function(orderId, skuId, skuName, skuImageUrl) {
    return axios
      .post('/api/line_items', {
        data: {
          type: 'line_items',
          attributes: {
            quantity: 1,
            name: skuName,
            image_url: skuImageUrl,
            _update_quantity: 1
          },
          relationships: {
            order: {
              data: {
                type: 'orders',
                id: orderId
              }
            },
            item: {
              data: {
                type: 'skus',
                id: skuId
              }
            }
          }
        }
      },{
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      }
    )
    .then(function(response) {
      return(response.data)
    })
  },
  deleteLineItem: function(lineItemId) {
    return axios
      .delete('/api/line_items/' + lineItemId)
      .then(function(response) {
        return true
      })
  },
  updateLineItem: function(lineItemId, attributes) {
    return axios
      .patch('/api/line_items/' + lineItemId, {
        data: {
          type: 'line_items',
          id: lineItemId,
          attributes: attributes
        }
      },{
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      }
    )
    .then(function(response) {
      return(response.data)
    })
  },
  updateLineItemQty: function(lineItemId, quantity) {
    api = this
    api.updateLineItem(lineItemId, { quantity: quantity }).then(function(lineItem){
      api.getOrder()
    })
    .catch(function(error) {
      if (error.response) {
        switch(error.response.status) {
          case 422:
            ui.displayShoppingBagUnavailableMessage()
            break
        }
      }
    })

  },
  updateShoppingBagItems: function(order) {
    api = this
    $shoppingBagItemsContainer = elements.shoppingBagItemsContainer
    if ($shoppingBagItemsContainer) {

      normalized_order = normalize(order).get([
        'id',
        'formatted_subtotal_amount',
        'formatted_discount_amount',
        'formatted_shipping_amount',
        'formatted_payment_method_amount',
        'formatted_total_tax_amount',
        'formatted_total_amount_with_taxes',
        'line_items.id',
        'line_items.item_type',
        'line_items.image_url',
        'line_items.name',
        'line_items.quantity',
        'line_items.formatted_unit_amount',
        'line_items.formatted_total_amount'
      ])[0]

      if (normalized_order.line_items) {

        $shoppingBagItemsContainer.innerHTML = ''

        for (i = 0; i < normalized_order.line_items.length; i++) {

          line_item = normalized_order.line_items[i]

          if (line_item.item_type == "skus") {

            $shoppingBagItemTemplate = elements.shoppingBagItemTemplate

            if ($shoppingBagItemTemplate) {
              $shoppingBagItem = utils.getElementFromTemplate($shoppingBagItemTemplate)

              // image
              $shoppingBagItemImage = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-image')
              $shoppingBagItemImage.src = line_item.image_url

              // name
              $shoppingBagItemName = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-name')
              $shoppingBagItemName.innerHTML = line_item.name

              // qty
              $shoppingBagItemQtyContainer = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-qty-container')
              $qtySelect = document.createElement('select')
              $qtySelect.dataset.lineItemId = line_item.id

              for (qty = 1; qty <= 10; qty++) {
                  $option = document.createElement("option")
                  $option.value = qty
                  $option.text = qty
                  if (qty == line_item.quantity) {
                    $option.selected = true
                  }
                  $qtySelect.appendChild($option)
              }

              $qtySelect.addEventListener('change', function(event){
                api.updateLineItemQty(this.dataset.lineItemId, this.value)
              })
              $shoppingBagItemQtyContainer.appendChild($qtySelect)

              // unit_amount
              $shoppingBagItemUnitAmount = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-unit-amount')
              $shoppingBagItemUnitAmount.innerHTML = line_item.formatted_unit_amount

              // total_amount
              $shoppingBagItemTotalAmount = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-total-amount')
              $shoppingBagItemTotalAmount.innerHTML = line_item.formatted_total_amount

              // remove
              $shoppingBagItemRemove = $shoppingBagItem.querySelector('.clayer-shopping-bag-item-remove')
              $shoppingBagItemRemove.dataset.lineItemId = line_item.id
              $shoppingBagItemRemove.addEventListener('click', function(event){
                event.preventDefault()
                api.deleteLineItem(this.dataset.lineItemId).then(function(lineItem){
                  api.getOrder()
                })
              })

              $shoppingBagItemsContainer.appendChild($shoppingBagItem)

            }
          }
        }
      }
    }
  },
  getOrder: function() {

    api = this

    return axios
      .get('/api/orders?include=line_items&filter[token]=' + utils.getOrderToken())
      .then(function(response) {
        if (response.data.data.length > 0) {
          api.updateShoppingBagItems(response.data)
          ui.hideShoppingBagUnavailableMessage() // refactor
          ui.updateShoppingBagSummary(response.data.data[0])
          ui.updateShoppingBagCheckout(response.data)
          if (response.data.data[0].attributes.skus_count == 0) {
            ui.clearShoppingBag()
          }
          return response.data.data[0]
        }
      })
  }

}
