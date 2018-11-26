const elements = require('./elements')
const axios = require('axios')
const auth = require('./auth')
const normalize = require('json-api-normalize')
const config = require('./config')
const utils = require('./utils')
const ui = require('./ui')

module.exports = {
  getPrices: function() {

    var $prices = elements.prices

    if ($prices.length > 0) {

      var skuCodes = []

      $prices.forEach(function ($price) {
        skuCodes.push($price.dataset.skuCode)
      })

      var skus = []
      var skusEndpoint = '/api/skus?filter[codes]=' + skuCodes.join(',') +'&include=prices&page[size]=25'
      var skuAttributes = [
        'id',
        'code',
        'prices.formatted_amount',
        'prices.formatted_compare_at_amount',
      ]

      axios
        .get(skusEndpoint)
        .then(function(response) {

          ui.updatePrices(normalize(response.data).get(skuAttributes))

          var pageCount = response.data.meta.page_count

          if (pageCount > 1) {
            for (var p=2; p<=pageCount; p++ ) {

              var skusEndpointWithPage = skusEndpoint + '&page[number]=' + p

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

    var $variants = elements.variants

    if ($variants.length > 0) {

      var skuCodes = []

      $variants.forEach(function (variant) {
        ui.disableElement(variant)
        skuCodes.push(variant.dataset.skuCode)
      })

      axios
        .get('/api/skus?filter[codes]=' + skuCodes.join(','))
        .then(function(response) {
          var skus = normalize(response.data).get([
            'id',
            'code'
          ])

          for (var i = 0; i < skus.length; i++) {

            var variant = document.querySelector('.variant[data-sku-code=' + skus[i].code + ']')
            if (variant) {
              variant.value = skus[i].id
              ui.enableElement(variant)
            }
            if (variant.tagName === 'INPUT') {
              module.exports.getSingleVariant(variant)
            }

          }
        })

    }
  },
  getSingleVariant      : function (variant) {

    var skuId = variant.value

    axios
      .get('/api/skus/' + skuId + '?fields[skus]=inventory')
      .then(function (response) {
        var sku = response.data.data

        if (sku.attributes.inventory.available) {
          ui.updateAddToBag(skuId, null)
          ui.updateAvailableMessage(sku.attributes.inventory)
        }
      })

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
  updateShoppingBagTable: function(order) {
    var api = this
    var $shoppingBagTable = elements.shoppingBagTable
    if ($shoppingBagTable) {

      var normalized_order = normalize(order).get([
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

        $shoppingBagTable.innerHTML = ''

        for (var i = 0; i < normalized_order.line_items.length; i++) {

          var line_item = normalized_order.line_items[i]

          if (line_item.item_type == "skus") {

            var tableRow = document.createElement('tr')

            ui.addTableColImage(tableRow, line_item.image_url, 'shopping-bag-col-image')

            ui.addTableColText(tableRow, line_item.name, 'shopping-bag-col-name')

            var quantitySelect = document.createElement('select')
            quantitySelect.dataset.lineItemId = line_item.id

            for (var qty = 1; qty <= 10; qty++) {
                var option = document.createElement("option");
                option.value = qty;
                option.text = qty;
                if (qty == line_item.quantity) {
                  option.selected = true
                }
                quantitySelect.appendChild(option)
            }

            quantitySelect.addEventListener('change', function(event){
              api.updateLineItemQty(this.dataset.lineItemId, this.value)
            })

            var quantitySelectWrap = document.createElement('div')
            quantitySelectWrap.classList.add('select')
            quantitySelectWrap.appendChild(quantitySelect)

            ui.addTableColElement(tableRow, quantitySelectWrap, 'shopping-bag-col-qty')


            ui.addTableColText(tableRow, line_item.formatted_total_amount, 'shopping-bag-col-total')

            // remove
            var removeLink = document.createElement('a')
            var removeLinkText = document.createTextNode('X')
            removeLink.appendChild(removeLinkText)
            removeLink.dataset.lineItemId = line_item.id

            removeLink.addEventListener('click', function(event){
              event.preventDefault()
              this.parentElement.parentElement.remove()
              api.deleteLineItem(this.dataset.lineItemId).then(function(lineItem){
                api.getOrder()
              })
            })
            ui.addTableColElement(tableRow, removeLink, 'shopping-bag-col-remove')


            $shoppingBagTable.appendChild(tableRow)

          }
        }
      }

    }
  },
  getOrder: function() {

    var api = this

    return axios
      .get('/api/orders?include=line_items&filter[token]=' + utils.getOrderToken())
      .then(function(response) {
        if (response.data.data.length > 0) {
          api.updateShoppingBagTable(response.data)
          ui.hideShoppingBagUnavailableMessage()
          ui.updateShoppingBagPreview(response.data.data[0])
          ui.updateShoppingBagCheckout(response.data)
          return response.data.data[0]
        }
      })
  }

}
