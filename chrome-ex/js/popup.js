function showInputSuccess(element) {

  var msg = document.createElement('span');
  msg.appendChild(document.createTextNode(chrome.i18n.getMessage('popup_page_copied')));
  msg.setAttribute('class', 'msg');

  element.parentElement.appendChild(msg);

  // change the style for some seconds
  element.style.backgroundColor = '#e3f8e7';
  element.style.color = '#4aaa5a';

  //hide the msg after 0.75 seconds
  window.setTimeout(function () {
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.parentElement.removeChild(msg);
  }, 750);
}


function handleDetails() {
  var details = document.getElementById("details_button");
  var detailsBox = document.getElementById("details");

  // load state
  if (localStorage['showDetails'] == "true") {
    detailsBox.style.display = "block";
    details.innerHTML = chrome.i18n.getMessage('popup_page_hide_details');
  } else {
    detailsBox.style.display = "none";
  }

  // toggle on click
  details.addEventListener('click', function () {
    if (detailsBox.style.display == "none") {
      localStorage['showDetails'] = true;
      detailsBox.style.display = "block";
      details.innerHTML = chrome.i18n.getMessage('popup_page_hide_details');
    } else {
      localStorage['showDetails'] = false;
      detailsBox.style.display = "none";
      details.innerHTML = " " + chrome.i18n.getMessage('popup_page_details');
    }
  }, false)
}

ipAddress.utils.translateHtml();

/**
 * handles the response (ip,....)
 */
function init(ipData) {
  ipField = document.getElementById("ip_field");
  ipField.value = ipData.remote_addr;
  window.getSelection().removeAllRanges();
  ipField.addEventListener('click', function () {
    ipAddress.utils.copyToClipboard(ipData.remote_addr);
    showInputSuccess(ipField);
  });

  dnsField = document.getElementById("dns_field").innerHTML = ipData.remote_host;
  countryField = document.getElementById("country_field").innerHTML = ipData.remote_country;

  handleDetails();
}

ipAddress.utils.getIPData(init);
