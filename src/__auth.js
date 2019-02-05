const axios = require('axios')
const config = require('./config')
const utils = require('./utils')

function checkCookie(){
  // Quick test if browser has cookieEnabled host property
  if (navigator.cookieEnabled) return true;
  // Create cookie
  document.cookie = "cookietest=1";
  var ret = document.cookie.indexOf("cookietest=") != -1;
  // Delete cookie
  document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  return ret;
}

function getAccessToken() {
  return axios
    .post('/oauth/token', {
      grant_type: "client_credentials",
      client_id: config.clientId(),
      scope: "market:" + config.marketId()
    })
    .then(function (response) {
      utils.setAccessTokenCookie(response.data.access_token, response.data.expires_in)
      return response.data.access_token
    })
}

// axios defaults
axios.defaults.baseURL = config.baseUrl()
axios.defaults.headers.common['Accept'] = 'application/vnd.api+json'

// axios interceptors
axios.interceptors.request.use(function (requestConfig) {
  requestConfig.headers.Authorization = 'Bearer ' + utils.getAccessTokenCookie()
  return requestConfig
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    if (checkCookie()) {
      if (utils.getAccessTokenRetryLockCookie() == undefined) {
        utils.setAccessTokenRetryLockCookie()
        return getAccessToken().then(function(accessToken) {
          error.config.headers.Authorization = 'Bearer ' + accessToken
          return axios.request(error.config)
        })
      }
    }
  }
  return Promise.reject(error)
})
