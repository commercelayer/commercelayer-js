const config = require('./config')

module.exports = {
  setCookie: function(cname, cvalue, exsecs) {
      var d = new Date();
      d.setTime(d.getTime() + (exsecs*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  getCookie: function(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  },
  getOrderToken: function() {
    var orderToken = this.getCookie('order_token_' + config.countryCode())
    if (orderToken != '') {
      return orderToken
    } else {
      return null
    }
  },
  setOrderToken: function(token) {
    this.setCookie('order_token_' + config.countryCode(), token, 30*60*60*24)
  }
}
