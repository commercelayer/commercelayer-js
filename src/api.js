const config = require('./config')
const utils = require('./utils')
const ui = require('./ui')
const clsdk = require('@commercelayer/sdk')

module.exports = {
  getPrices: function() {
    let prices = document.querySelectorAll('.clayer-price')

    if (prices.length > 0) {
      let skuCodes = []

      prices.forEach(function(price) {
        skuCodes.push(price.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .include('prices')
        .pageSize(25)

      clsdk.listSkus(qf.build()).then(data => {
        let skuAttributes = [
          'id',
          'code',
          'prices.formatted_amount',
          'prices.formatted_compare_at_amount',
          'prices.amount_cents',
          'prices.compare_at_amount_cents'
        ]

        ui.updatePrices(data.get(skuAttributes))

        let pageCount = data.dataset.meta.page_count

        if (pageCount > 1) {
          for (p = 2; p <= pageCount; p++) {
            qf.pageNumber(p)
            clsdk
              .listSkus(qf)
              .then(data => ui.updatePrices(data.get(skuAttributes)))
          }
        }

        document.dispatchEvent(new Event('clayer-prices-ready'))

        if (data.get(skuAttributes).length === 0) {
          document.dispatchEvent(new Event('clayer-skus-empty'))
        }
      })
    }
  },

  getVariants: function() {
    let variants = document.querySelectorAll('.clayer-variant')

    if (variants.length > 0) {
      let skuCodes = []

      variants.forEach(function(variant) {
        skuCodes.push(variant.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .pageSize(25)

      let skuAttributes = ['id', 'code']

      clsdk.listSkus(qf.build()).then(data => {
        ui.updateVariants(data.get(skuAttributes), true)

        let pageCount = data.dataset.meta.page_count

        if (pageCount > 1) {
          for (p = 2; p <= pageCount; p++) {
            qf.pageNumber(p)
            clsdk
              .listSkus(qf)
              .then(data => ui.updateVariants(data.get(skuAttributes), false))
          }
        }
        document.dispatchEvent(new Event('clayer-variants-ready'))
      })
    }
  },

  getVariantsQuantity: () => {
    let variantQuantity = document.querySelectorAll(
      '.clayer-add-to-bag-quantity'
    )

    if (variantQuantity.length > 0) {
      let skuCodes = []

      variantQuantity.forEach(function(variant) {
        skuCodes.push(variant.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .pageSize(25)

      let skuAttributes = ['id', 'code']
      clsdk.listSkus(qf.build()).then(data => {
        ui.updateVariantsQuantity(data.get(skuAttributes), true)

        let pageCount = data.dataset.meta.page_count

        if (pageCount > 1) {
          for (p = 2; p <= pageCount; p++) {
            qf.pageNumber(p)
            clsdk
              .listSkus(qf)
              .then(data =>
                ui.updateVariantsQuantity(data.get(skuAttributes), false)
              )
          }
        }
        document.dispatchEvent(new Event('clayer-variants-quantity-ready'))
      })
    }
  },

  getAddToBags: function() {
    let addToBags = document.querySelectorAll('.clayer-add-to-bag')

    if (addToBags.length > 0) {
      let skuCodes = []

      addToBags.forEach(function(addToBag) {
        skuCodes.push(addToBag.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .pageSize(25)

      let skuAttributes = ['id', 'code']

      clsdk.listSkus(qf.build()).then(data => {
        ui.updateAddToBags(data.get(skuAttributes))

        let pageCount = data.dataset.meta.page_count

        if (pageCount > 1) {
          for (p = 2; p <= pageCount; p++) {
            qf.pageNumber(p)
            clsdk
              .listSkus(qf)
              .then(data => ui.updateAddToBags(data.get(skuAttributes)))
          }
        }
        document.dispatchEvent(new Event('clayer-add-to-bags-ready'))
      })
    }
  },

  selectSku: function(
    skuId,
    skuName,
    skuReference,
    skuImageUrl,
    priceContainerId,
    availabilityMessageContainerId,
    addToBagId,
    addToBagQuantityId
  ) {
    console.log('addToBagQuantityId :', addToBagQuantityId)
    let qf = new clsdk.query.QueryFilter().include('prices').pageSize(25)

    clsdk.retrieveSku(skuId, qf.build()).then(data => {
      let skuAttributes = [
        'id',
        'code',
        'inventory',
        'prices.formatted_amount',
        'prices.formatted_compare_at_amount',
        'prices.amount_cents',
        'prices.compare_at_amount_cents'
      ]

      let sku = data.get(skuAttributes)
      ui.updatePrice(sku, priceContainerId)
      ui.updateAvailabilityMessage(
        sku.inventory,
        availabilityMessageContainerId
      )
      if (sku.inventory.available) {
        ui.updateAddToBagSKU(
          skuId,
          skuName,
          skuReference,
          skuImageUrl,
          addToBagId,
          addToBagQuantityId
        )
        ui.updateAddVariantQuantitySKU(
          skuId,
          skuName,
          skuReference,
          skuImageUrl,
          sku.inventory.quantity,
          addToBagQuantityId
        )
        // TODO: enable quantity
        ui.enableAddToBag(addToBagId)
        ui.enableAddVariantQuantity(addToBagQuantityId)
      } else {
        // TODO: disable quantity
        ui.disableAddToBag(addToBagId)
        ui.disableAddVariantQuantity(addToBagQuantityId)
      }
      document.dispatchEvent(new Event('clayer-variant-selected'))
    })
  },

  createOrder: function() {
    return clsdk
      .createOrder({
        type: 'orders',
        shipping_country_code_lock: config.countryCode,
        language_code: config.languageCode,
        cart_url: config.cartUrl,
        return_url: config.returnUrl,
        privacy_url: config.privacyUrl,
        terms_url: config.termsUrl
      })
      .then(response => {
        utils.setOrderToken(response.dataset.data.id)
        return response.dataset.data
      })
  },

  getOrder: function() {
    api = this

    let qf = new clsdk.query.QueryFilter()

    qf.include('line_items')
    return clsdk.retrieveOrder(utils.getOrderToken(), qf).then(response => {
      if (response.dataset.data.attributes) {
        api.updateShoppingBagItems(response)
        ui.updateShoppingBagSummary(response.dataset.data)
        ui.updateShoppingBagCheckout(response)
        if (response.dataset.data.attributes.skus_count === 0) {
          ui.clearShoppingBag()
        }
        document.dispatchEvent(new Event('clayer-order-ready'))
        return response.dataset.data
      }
    })

    return clsdk.listOrders(qf).then(function(response) {
      if (response.get(['line_items']).length > 0) {
        api.updateShoppingBagItems(response)
        ui.updateShoppingBagSummary(response.dataset.data[0])
        ui.updateShoppingBagCheckout(response)
        if (response.get('skus_count') == 0) {
          ui.clearShoppingBag()
        }
        document.dispatchEvent(new Event('clayer-order-ready'))
        return response.dataset.data[0]
      }
    })
  },

  refreshOrder: function() {
    if (utils.getOrderToken()) {
      this.getOrder().then(function(order) {
        if (!order || order.attributes.status == 'placed') {
          utils.deleteOrderToken()
          ui.clearShoppingBag()
        }
      })
    }
  },

  createLineItem: function(
    orderId,
    skuId,
    skuName,
    skuReference,
    skuImageUrl,
    quantity = 1
  ) {
    let lineItemData = {
      type: 'line_items',
      attributes: {
        quantity,
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

    if (skuName) lineItemData.attributes.name = skuName
    if (skuReference) lineItemData.attributes.reference = skuReference
    if (skuImageUrl) lineItemData.attributes.image_url = skuImageUrl
    if (quantity) lineItemData.attributes.quantity = quantity

    return clsdk
      .createLineItem({
        data: lineItemData
      })
      .then(function(response) {
        document.dispatchEvent(new Event('clayer-line-item-created'))
        return response
      })
  },

  deleteLineItem: function(lineItemId) {
    return clsdk.deleteLineItem(lineItemId).then(function(response) {
      document.dispatchEvent(new Event('clayer-line-item-deleted'))
      return response
    })
  },

  updateLineItem: function(lineItemId, attributes) {
    return clsdk
      .updateLineItem(lineItemId, {
        data: {
          type: 'line_items',
          id: lineItemId,
          attributes: attributes
        }
      })
      .then(function(response) {
        document.dispatchEvent(new Event('clayer-line-item-updated'))
        return response
      })
  },

  updateLineItemQty: function(
    lineItemId,
    quantity,
    availabilityMessageContainer
  ) {
    api = this
    api
      .updateLineItem(lineItemId, { quantity: quantity })
      .then(function() {
        api.getOrder()
      })
      .catch(function(error) {
        if (error) {
          switch (error.status) {
            case 422:
              if (availabilityMessageContainer) {
                ui.displayUnavailableMessage(availabilityMessageContainer)
              }
              break
          }
        }
      })
  },

  updateShoppingBagItems: function(order) {
    api = this
    let shoppingBagItemsContainer = document.querySelector(
      '#clayer-shopping-bag-items-container'
    )
    if (shoppingBagItemsContainer) {
      normalized_order = order.get([
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
        'line_items.reference',
        'line_items.quantity',
        'line_items.formatted_unit_amount',
        'line_items.formatted_total_amount'
      ])

      if (normalized_order.line_items) {
        shoppingBagItemsContainer.innerHTML = ''

        for (i = 0; i < normalized_order.line_items.length; i++) {
          line_item = normalized_order.line_items[i]

          if (line_item.item_type == 'skus') {
            let shoppingBagItemTemplate = document.querySelector(
              '#clayer-shopping-bag-item-template'
            )

            if (shoppingBagItemTemplate) {
              let shoppingBagItem = utils.getElementFromTemplate(
                shoppingBagItemTemplate
              )

              // image
              let shoppingBagItemImage = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-image'
              )
              if (shoppingBagItemImage) {
                shoppingBagItemImage.src = line_item.image_url
              }

              // name
              let shoppingBagItemName = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-name'
              )
              if (shoppingBagItemName) {
                shoppingBagItemName.innerHTML = line_item.name
              }

              // reference
              let shoppingBagItemReference = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-reference'
              )
              if (shoppingBagItemReference) {
                shoppingBagItemReference.innerHTML = line_item.reference
              }

              // qty
              let shoppingBagItemQtyContainer = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-qty-container'
              )
              if (shoppingBagItemQtyContainer) {
                let availabilityMessageContainer = shoppingBagItemQtyContainer.querySelector(
                  '.clayer-shopping-bag-item-availability-message-container'
                )

                let qtySelect = document.createElement('select')
                qtySelect.dataset.lineItemId = line_item.id

                for (qty = 1; qty <= 50; qty++) {
                  let option = document.createElement('option')
                  option.value = qty
                  option.text = qty
                  if (qty == line_item.quantity) {
                    option.selected = true
                  }
                  qtySelect.appendChild(option)
                }

                qtySelect.addEventListener('change', function(event) {
                  api.updateLineItemQty(
                    this.dataset.lineItemId,
                    this.value,
                    availabilityMessageContainer
                  )
                })
                shoppingBagItemQtyContainer.insertBefore(
                  qtySelect,
                  shoppingBagItemQtyContainer.firstChild
                )
              }

              // unit_amount
              let shoppingBagItemUnitAmount = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-unit-amount'
              )
              if (shoppingBagItemUnitAmount) {
                shoppingBagItemUnitAmount.innerHTML =
                  line_item.formatted_unit_amount
              }

              // total_amount
              let shoppingBagItemTotalAmount = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-total-amount'
              )
              if (shoppingBagItemTotalAmount) {
                shoppingBagItemTotalAmount.innerHTML =
                  line_item.formatted_total_amount
              }

              // remove
              let shoppingBagItemRemove = shoppingBagItem.querySelector(
                '.clayer-shopping-bag-item-remove'
              )
              if (shoppingBagItemRemove) {
                shoppingBagItemRemove.dataset.lineItemId = line_item.id
                shoppingBagItemRemove.addEventListener('click', function(
                  event
                ) {
                  event.preventDefault()
                  event.stopPropagation()
                  api
                    .deleteLineItem(this.dataset.lineItemId)
                    .then(function(lineItem) {
                      api.getOrder()
                    })
                })
              }

              shoppingBagItemsContainer.appendChild(shoppingBagItem)
            }
          }
        }
      }
    }
  }
}
