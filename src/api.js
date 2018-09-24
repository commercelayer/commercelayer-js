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

          }
        })

    }
  },
  getOrder: function() {
    return axios
      .get('/api/orders?include=line_items&filter[token]=' + utils.getOrderToken())
      .then(function(response) {
        if (response.data.data.length > 0) {
          ui.hideShoppingBagUnavailableMessage()
          ui.updateShoppingBagPreview(response.data.data[0])
          ui.updateShoppingBagTable(response.data)
          ui.updateShoppingBagCheckout(response.data)
          return response.data.data[0]
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
  }

}
