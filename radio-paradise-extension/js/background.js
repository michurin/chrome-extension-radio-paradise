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

  var audio_element; // undefined
  var volume_ctl_timer; // undefined
  var target_volume = 0;

  function change_volume() {
    volume_ctl_timer = undefined;
    if (audio_element === undefined) {
      // init
      audio_element = window.document.createElement('audio');
      body_element.appendChild(audio_element);
      audio_element.oncanplaythrough = function () {
        audio_element.volume = 0;
        target_volume = 1;
        audio_element.play();
        browser_action.setBadgeText({text: '\u25ba'});
        change_volume();
      };
      audio_element.src = stream_url;
      audio_element.load();
      browser_action.setBadgeText({text: '…'});
    } else {
      // continue
      var v = audio_element.volume;
      var sv = target_volume - v;
      var dv = sv < 0 ? -0.01 : 0.01;
      var nv = v + dv;
      if (sv * (target_volume - nv) < 0) {
        // fin
        if (target_volume <= 0) {
          body_element.removeChild(audio_element);
          audio_element = undefined;
          browser_action.setBadgeText({text: ''});
          return;
        }
        nv = v;
      } else {
        // continue
        volume_ctl_timer = setTimeout(change_volume, 25);
      }
      audio_element.volume = nv;
    }
  }

  function onClickHandler() {
    if (target_volume > 0) {
      target_volume = 0;
    } else {
      target_volume = 1;
    }
    if (volume_ctl_timer === undefined) {
      change_volume();
    }
  }

  browser_action.setBadgeBackgroundColor({color: '#942'});
  browser_action.onClicked.addListener(onClickHandler);

}());
