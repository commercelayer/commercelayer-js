exports.getBaseUrl = function getBaseUrl() {
  var $baseUrl = document.querySelector('#commercelayer[data-base-url]')
  if ($baseUrl) {
    return $baseUrl.dataset.baseUrl
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-client-id]');
  }
}

exports.getClientId = function getClientId() {
  var $cliendId = document.querySelector('#commercelayer[data-client-id]')
  if ($cliendId) {
    return $cliendId.dataset.clientId
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-client-id]');
  }
}

exports.getMarketId = function getMarketId() {
  var $market = document.querySelector('#commercelayer[data-market-id]')
  if ($market) {
    return $market.dataset.marketId
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-market-id]');
  }
}

exports.getCountryCode = function getCountryCode() {
  var $country = document.querySelector('#commercelayer[data-country-code]')
  if ($country) {
    return $country.dataset.countryCode
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-country-code]');
  }
}

exports.getLanguageCode = function getLanguageCode() {
  var $language = document.querySelector('#commercelayer[data-language-code]')
  if ($language) {
    return $language.dataset.languageCode.split("-")[0]
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-language-code]');
  }
}

exports.getCartUrl = function getCartUrl() {
  var $cartUrl = document.querySelector('#commercelayer[data-cart-url]')
  if ($cartUrl) {
    return $cartUrl.dataset.cartUrl
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-cart-url]');
  }
}

exports.getReturnUrl = function getReturnUrl() {
  var $returnUrl = document.querySelector('#commercelayer[data-return-url]')
  if ($returnUrl) {
    return $returnUrl.dataset.cartUrl
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-return-url]');
  }
}

exports.getPrivacyUrl = function getPrivacyUrl() {
  var $privacyUrl = document.querySelector('#commercelayer[data-privacy-url]')
  if ($privacyUrl) {
    return $privacyUrl.dataset.privacyUrl
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-privacy-url]');
  }
}

exports.getTermsUrl = function getTermsUrl() {
  var $termsUrl = document.querySelector('#commercelayer[data-terms-url]')
  if ($termsUrl) {
    return $termsUrl.dataset.termsUrl
  } else {
    console.log('[Commerce Layer] Missing config: #commercelayer[data-terms-url]');
  }
}
