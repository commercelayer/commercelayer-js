module.exports = {
  addToBag: document.querySelector(".add-to-bag"),
  availableMessage: document.querySelector('.available-message'),
  main: document.querySelector('#main'),
  prices: Array.prototype.slice.call(document.querySelectorAll('.price'), 0),
  shoppingBag: document.querySelector('#shopping-bag'),
  shoppingBagUnavailableMessage: document.querySelector('.shopping-bag-unavailable-message'),
  unavailableMessage: document.querySelector('.unavailable-message'),
  variants: Array.prototype.slice.call(document.querySelectorAll('.variant'), 0)
}
