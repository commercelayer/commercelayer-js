const config = require('./config')
const cookies = require('js-cookie')

module.exports = {
  getOrderCookieName: function() {
    return `order_token_${config.clientId()}_${config.marketId()}_${config.countryCode()}`
  },
  getAccessTokenCookieName: function() {
    return `access_token_${config.clientId()}_${config.marketId()}`
  },
  getAccessTokenRetryLockCookieName: function() {
    return `${this.getAccessTokenCookieName()}_retry_lock`
  },
  getOrderToken: function() {
    return cookies.get(this.getOrderCookieName())
  },
  setOrderToken: function(token) {
    return cookies.set(this.getOrderCookieName(), token, { expires: 30 })
  },
  deleteOrderToken: function() {
    return cookies.remove(this.getOrderCookieName())
  },
  getAccessTokenCookie: function() {
    return cookies.get(this.getAccessTokenCookieName())
  },
  setAccessTokenCookie: function(access_token, expires_in) {
    cookies.set(this.getAccessTokenCookieName(), access_token, expires_in)
  },
  getAccessTokenRetryLockCookie: function() {
    return cookies.get(this.getAccessTokenRetryLockCookieName())
  },
  setAccessTokenRetryLockCookie: function() {
    cookies.set(this.getAccessTokenRetryLockCookieName(), "1", { expires: 1/1440 }) // 1 minute
  },
  getElementFromTemplate: function(template) {
    if (template.tagName == "TEMPLATE") {
      return document.importNode(template.content.firstElementChild, true)
    } else {
      return document.importNode(template.firstElementChild, true)
    }
  },
  getInventoryFirstAvailableLevel: function(inventory) {

    first_level = inventory.levels[0]

    if (first_level.quantity == 0) {
      for(k=1; k < inventory.levels.length; k++) {
        level = inventory.levels[k]
        if (level.quantity > 0) {
          first_level = level
          break
        }
      }
    }
    return first_level
  }
}
