/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  var stream_url = 'http://stream-uk1.radioparadise.com:80/mp3-192';

  var body_element = window.document.body;
  var browser_action = chrome.browserAction;

  function onClickHandler() {
    var i;
    var a = body_element.getElementsByTagName('audio');
    if (a.length === 0) {
      a = window.document.createElement('audio');
      body_element.appendChild(a);
      a.oncanplaythrough = function () {
        a.play();
        browser_action.setBadgeText({text: '\u25ba'});
      };
      a.src = stream_url;
      a.load();
      browser_action.setBadgeText({text: '…'});
    } else {
      for (i = 0; i < a.length; ++i) {
        body_element.removeChild(a[i]);
      }
      browser_action.setBadgeText({text: ''});
    }
  }

  browser_action.setBadgeBackgroundColor({color: '#942'});
  browser_action.onClicked.addListener(onClickHandler);

}());
