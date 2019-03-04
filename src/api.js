const config = require('./config')
const utils = require('./utils')
const ui = require('./ui')
const clsdk = require('@commercelayer/sdk')

module.exports = {

  getPrices: function() {

    let prices = document.querySelectorAll('.clayer-price')

    if (prices.length > 0) {

      let skuCodes = []

      prices.forEach(function (price) {
        skuCodes.push(price.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .include('prices')
        .page(null, 25);

      let skuAttributes = [
        'id',
        'code',
        'prices.formatted_amount',
        'prices.formatted_compare_at_amount',
        'prices.amount_cents',
        'prices.compare_at_amount_cents'
      ]

      clsdk.listSkus(qf.build())
        .then(data => {

          ui.updatePrices(data.get(skuAttributes))

          let pageCount = data.dataset.meta.page_count;

          if (pageCount > 1) {
            for (p=2; p<=pageCount; p++) {
              qf.pageNumber(p);
              clsdk.listSkus(qf)
                .then(data => ui.updatePrices(data.get(skuAttributes)));
            }
          }

        }
      );

    }
  },

  getVariants: function() {

    ui.disableElement(document.querySelector(".clayer-add-to-bag"))

    let variants = document.querySelectorAll('.clayer-variant')

    if (variants.length > 0) {

      let skuCodes = []

      variants.forEach(function (variant) {
        ui.disableElement(variant)
        skuCodes.push(variant.dataset.skuCode)
      })

      let qf = new clsdk.query.QueryFilter().filter('codes', skuCodes.join(','));

      clsdk.listSkus(qf.build())
        .then(data => {

          let skus = data.get(['id', 'code' ]);

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

        }
      );

    }
  },

  getInventory: function(skuId, skuName) {
    clsdk.retrieveSku(skuId, {'fields[skus]' : 'inventory'})
      .then((data) => {
        let inventory = data.get('inventory');
        ui.updateAvailabilityMessage(inventory)
        if (inventory.available) {
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
        let select = variant.parentNode
        select.value = variant.value
        select.dispatchEvent(new Event('change'))
        break
    }
  },

  createOrder: function() {
    clsdk.createOrder({
        type: 'orders',
        shipping_country_code_lock: config.countryCode(),
        language_code: config.languageCode(),
        cart_url: config.cartUrl(),
        return_url: config.returnUrl(),
        privacy_url: config.privacyUrl(),
        terms_url: config.termsUrl()
      }
    ).then(data => {
      utils.setOrderToken(data.get('token'))
      return(data)
    })
  },

  refreshOrder: function() {
    if (utils.getOrderToken()) {
      this.getOrder().then(function(order) {
        if (order && order.get('status') == 'placed') {
          utils.deleteOrderToken()
          ui.clearShoppingBag()
        }
      })
    }
  },

  createLineItem: function(orderId, skuId, skuName, skuImageUrl) {

    return clsdk.createLineItem({
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
    })
  },

  deleteLineItem: function(lineItemId) {
    return clsdk.deleteLineItem(lineItemId)
      .then(function() {
        return true
      })
  },

  updateLineItem: function(lineItemId, attributes) {
    return clsdk.updateLineItem(lineItemId, {
      data: {
        type: 'line_items',
        id: lineItemId,
        attributes: attributes
      }
    })
  },

  updateLineItemQty: function(lineItemId, quantity) {
    api = this
    api.updateLineItem(lineItemId, { quantity: quantity })
      .then(function(){
        api.getOrder()
      })
      .catch(function(error) {
        if (error) {
          switch(error.status) {
            case 422:
              ui.displayShoppingBagUnavailableMessage()
              break
          }
        }
      })
  },

  updateShoppingBagItems: function(order) {
    api = this
    let shoppingBagItemsContainer = document.querySelector('#clayer-shopping-bag-items-container')
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
        'line_items.quantity',
        'line_items.formatted_unit_amount',
        'line_items.formatted_total_amount'
      ])[0]

      if (normalized_order.line_items) {

        shoppingBagItemsContainer.innerHTML = ''

        for (i = 0; i < normalized_order.line_items.length; i++) {

          line_item = normalized_order.line_items[i]

          if (line_item.item_type == "skus") {

            let shoppingBagItemTemplate = document.querySelector('#clayer-shopping-bag-item-template')

            if (shoppingBagItemTemplate) {
              let shoppingBagItem = utils.getElementFromTemplate(shoppingBagItemTemplate)

              // image
              let shoppingBagItemImage = shoppingBagItem.querySelector('.clayer-shopping-bag-item-image')
              shoppingBagItemImage.src = line_item.image_url

              // name
              let shoppingBagItemName = shoppingBagItem.querySelector('.clayer-shopping-bag-item-name')
              shoppingBagItemName.innerHTML = line_item.name

              // qty
              let shoppingBagItemQtyContainer = shoppingBagItem.querySelector('.clayer-shopping-bag-item-qty-container')
              let qtySelect = document.createElement('select')
              qtySelect.dataset.lineItemId = line_item.id

              for (qty = 1; qty <= 10; qty++) {
                  let option = document.createElement("option")
                  option.value = qty
                  option.text = qty
                  if (qty == line_item.quantity) {
                    option.selected = true
                  }
                  qtySelect.appendChild(option)
              }

              qtySelect.addEventListener('change', function(event){
                event.preventDefault()
                event.stopPropagation()
                api.updateLineItemQty(this.dataset.lineItemId, this.value)
              })
              shoppingBagItemQtyContainer.appendChild(qtySelect)

              // unit_amount
              let shoppingBagItemUnitAmount = shoppingBagItem.querySelector('.clayer-shopping-bag-item-unit-amount')
              shoppingBagItemUnitAmount.innerHTML = line_item.formatted_unit_amount

              // total_amount
              let shoppingBagItemTotalAmount = shoppingBagItem.querySelector('.clayer-shopping-bag-item-total-amount')
              shoppingBagItemTotalAmount.innerHTML = line_item.formatted_total_amount

              // remove
              let shoppingBagItemRemove = shoppingBagItem.querySelector('.clayer-shopping-bag-item-remove')
              shoppingBagItemRemove.dataset.lineItemId = line_item.id
              shoppingBagItemRemove.addEventListener('click', function(event){
                event.preventDefault()
                event.stopPropagation()
                api.deleteLineItem(this.dataset.lineItemId).then(function(lineItem){
                  api.getOrder()
                })
              })

              shoppingBagItemsContainer.appendChild(shoppingBagItem)

            }
          }
        }
      }
    }
  },

  getOrder: function() {

    api = this

    let qf = new clsdk.query.QueryFilter();

    qf.include('line_items').filter('token', utils.getOrderToken())

    return clsdk.listOrders(qf)
      .then(function(response) {

        if (response.get(['line_items']).length > 0) {
          api.updateShoppingBagItems(response)
          ui.hideShoppingBagUnavailableMessage() // refactor
          ui.updateShoppingBagSummary(response.dataset.data[0])
          ui.updateShoppingBagCheckout(response)
          if (response.get('skus_count') == 0) {
            ui.clearShoppingBag()
          }
          return response;
        }
      }
    )
  }
}
