exports.setCookie = function setCookie(cname, cvalue, exsecs) {
    var d = new Date();
    d.setTime(d.getTime() + (exsecs*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

exports.getCookie = function getCookie(cname) {
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
}

exports.addTableColText = function addTableColText(tableRow, text, className) {
  var tableCol = document.createElement('td')
  tableCol.classList.add('shopping-bag-col')
  tableCol.classList.add(className)
  var tableColText = document.createTextNode(text)
  tableCol.appendChild(tableColText)
  tableRow.appendChild(tableCol)
}

exports.addTableColImage = function addTableColImage(tableRow, imageUrl, className) {
  var tableCol = document.createElement('td')
  tableCol.classList.add('shopping-bag-col')
  tableCol.classList.add(className)
  var tableColImg = document.createElement('img')
  tableColImg.src = imageUrl
  tableCol.appendChild(tableColImg)
  tableRow.appendChild(tableCol)
}

exports.addTableColElement = function addTableColElement(tableRow, element, className) {
  var tableCol = document.createElement('td')
  tableCol.classList.add('shopping-bag-col')  
  tableCol.classList.add(className)
  tableCol.appendChild(element)
  tableRow.appendChild(tableCol)
}
