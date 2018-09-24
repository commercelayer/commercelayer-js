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
      utils.setCookie('access_token_' + config.marketId(), response.data.access_token, response.data.expires_in)
      return response.data.access_token
    })
}

// axios defaults
axios.defaults.baseURL = config.baseUrl()
axios.defaults.headers.common['Accept'] = 'application/vnd.api+json'
axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json'

// axios interceptors
axios.interceptors.request.use(function (requestConfig) {
  requestConfig.headers.Authorization = 'Bearer ' + utils.getCookie('access_token_' + config.marketId())
  return requestConfig
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    if (error.response.data.errors[0].code == "INVALID_TOKEN") {
      return getAccessToken().then(function(accessToken) {
        error.config.headers.Authorization = 'Bearer ' + accessToken
        return axios.request(error.config)
      })
    }
  }
  return Promise.reject(error)
})
