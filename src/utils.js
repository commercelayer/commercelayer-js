const config = require('./config')

module.exports = {
  setCookie: function(cname, cvalue, exsecs) {
      var d = new Date()
      d.setTime(d.getTime() + (exsecs*1000))
      var expires = "expires="+ d.toUTCString()
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  },
  getCookie: function(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie)
      var ca = decodedCookie.split(';')
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return ""
  },
  deleteCookie: function(cname) {
    document.cookie = cname + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  },
  getOrderCookieName: function() {
    return 'order_token_' + config.countryCode()
  },
  getOrderToken: function() {
    return this.getCookie(this.getOrderCookieName())
  },
  setOrderToken: function(token) {
    return this.setCookie(this.getOrderCookieName(), token, 30*60*60*24)
  },
  deleteOrderToken: function() {
    return this.deleteCookie(this.getOrderCookieName())
  }

}
