if (typeof ipAddress == "undefined" || !ipAddress) { var ipAddress = {}; }

ipAddress.utils = {

    getIPData: function(callback){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://check-ip.9gg.de/check-ip.php", true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            var responseObject = JSON.parse(xhr.responseText);
            callback(responseObject);
          }
        }
        xhr.send();
    },


    copyToClipboard: function( text ){
      var copyDiv = document.createElement('div');
      copyDiv.contentEditable = true;
      copyDiv.setAttribute("style","position:absolute; left: 0; top: 0; height: 0; visability: hidden;");
      document.body.appendChild(copyDiv);
      copyDiv.innerHTML = text;
      copyDiv.unselectable = "off";
      copyDiv.focus();
      document.execCommand('SelectAll');
      document.execCommand("Copy", false, null);
      document.body.removeChild(copyDiv);
    },


    /**
    * Tranlates each Element with a data-message attribute.
    * Example: <h1 data-message="someI18nKey">Default text</h1>
    */
    translateHtml: function(){
      var objects = document.getElementsByTagName('*'), i;
      for(i = 0; i < objects.length; i++) {
        if (objects[i].dataset && objects[i].dataset.message) {
          objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.message);
        }
      }
    }
}
