module.exports = {
  addToBag: document.querySelector(".add-to-bag"),
  availableMessage: document.querySelector('.available-message'),
  main: document.querySelector('#main'),
  prices: Array.prototype.slice.call(document.querySelectorAll('.price'), 0),
  shoppingBag: document.querySelector('#shopping-bag'),
  shoppingBagCheckout: document.querySelector('#shopping-bag-checkout'),
  shoppingBagClose: document.querySelector('#shopping-bag-close'),
  shoppingBagPreviewCount: document.querySelector('#shopping-bag-preview-count'),
  shoppingBagPreviewTotal: document.querySelector('#shopping-bag-preview-total'),
  shoppingBagTable: document.querySelector('#shopping-bag-table'),
  shoppingBagToggle: document.querySelector('#shopping-bag-toggle'),
  shoppingBagUnavailableMessage: document.querySelector('.shopping-bag-unavailable-message'),
  unavailableMessage: document.querySelector('.unavailable-message'),
  variants: Array.prototype.slice.call(document.querySelectorAll('.variant'), 0)
}
