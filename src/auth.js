const modernizr = require("modernizr")
const axios = require('axios')
const config = require('./config')
const utils = require('./utils')

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
    if (modernizr.cookies) {
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
