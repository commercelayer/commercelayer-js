const axios = require('axios')
const config = require('./config')
const utils = require('./utils')

exports.getOrderToken = function getOrderToken() {
  var orderToken = utils.getCookie('order_token_' + config.getCountryCode())
  if (orderToken != '') {
    return orderToken
  } else {
    return null
  }
}

exports.setOrderToken = function setOrderToken(token) {
  utils.setCookie('order_token_' + config.getCountryCode(), token, 30*60*60*24)
}

exports.getAccessToken = function getAccessToken() {

  var accessTokenFromCookie = utils.getCookie('access_token')

  if (accessTokenFromCookie) {
    return new Promise(function(resolve, reject){
      resolve(accessTokenFromCookie)
    })
  } else {
    var clientId = config.getClientId()
    var marketId = config.getMarketId()

    return axios
      .post('/oauth/token', {
        grant_type: "client_credentials",
        client_id: clientId,
        scope: "market:" + marketId
      })
      .then(function (response) {
        utils.setCookie('access_token', response.data.access_token, response.data.expires_in - 60)
        return response.data.access_token
      })
  }

}
