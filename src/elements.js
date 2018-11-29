module.exports = {
  addToBag: document.querySelector(".clayer-add-to-bag"),
  availableMessage: document.querySelector('.clayer-available-message'),
  config: document.querySelector('#clayer-config'),
  main: document.querySelector('#clayer-main'),
  prices: Array.prototype.slice.call(document.querySelectorAll('.clayer-price'), 0),

  shoppingBagContainer: document.querySelector('#clayer-shopping-bag-container'),
  shoppingBagItemsContainer: document.querySelector('#clayer-shopping-bag-items-container'),
  shoppingBagItemTemplate: document.querySelector('#clayer-shopping-bag-item-template'),

  shoppingBagCheckout: document.querySelector('#clayer-shopping-bag-checkout'),
  shoppingBagClose: document.querySelector('#clayer-shopping-bag-close'),

  shoppingBagPreviewCount: document.querySelector('#clayer-shopping-bag-preview-count'),
  shoppingBagPreviewTotal: document.querySelector('#clayer-shopping-bag-preview-total'),
  shoppingBagToggle: document.querySelector('#clayer-shopping-bag-toggle'),

  shoppingBagUnavailableMessage: document.querySelector('.clayer-shopping-bag-unavailable-message'),
  unavailableMessage: document.querySelector('.clayer-unavailable-message'),
  variants: Array.prototype.slice.call(document.querySelectorAll('.clayer-variant'), 0),

  variantSelect: document.querySelector('.clayer-variant-select')
}
