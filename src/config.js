module.exports = {
  baseUrl: function() {
    var $baseUrl = document.querySelector('#commercelayer[data-base-url]')
    if ($baseUrl) {
      return $baseUrl.dataset.baseUrl
    }
  },
  clientId: function() {
    var $cliendId = document.querySelector('#commercelayer[data-client-id]')
    if ($cliendId) {
      return $cliendId.dataset.clientId
    }
  },
  marketId: function() {
    var $market = document.querySelector('#commercelayer[data-market-id]')
    if ($market) {
      return $market.dataset.marketId
    }
  },
  countryCode: function() {
    var $country = document.querySelector('#commercelayer[data-country-code]')
    if ($country) {
      return $country.dataset.countryCode
    }
  },
  languageCode: function() {
    var $language = document.querySelector('#commercelayer[data-language-code]')
    if ($language) {
      return $language.dataset.languageCode.split("-")[0]
    }
  },
  cartUrl: function() {
    var $cartUrl = document.querySelector('#commercelayer[data-cart-url]')
    if ($cartUrl) {
      return $cartUrl.dataset.cartUrl
    }
  },
  returnUrl: function() {
    var $returnUrl = document.querySelector('#commercelayer[data-return-url]')
    if ($returnUrl) {
      return $returnUrl.dataset.cartUrl
    }
  },
  privacyUrl: function() {
    var $privacyUrl = document.querySelector('#commercelayer[data-privacy-url]')
    if ($privacyUrl) {
      return $privacyUrl.dataset.privacyUrl
    }
  },
  termsUrl: function() {
    var $termsUrl = document.querySelector('#commercelayer[data-terms-url]')
    if ($termsUrl) {
      return $termsUrl.dataset.termsUrl
    }
  }
}
