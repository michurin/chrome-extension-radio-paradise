/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  var stream_url; // undefined

  var body_element = window.document.body;
  var browser_action = chrome.browserAction;

  var audio_element; // undefined
  var volume_ctl_timer; // undefined
  var target_volume = 0;
  var default_volume; // undefined

  function drop_audio_element() {
    body_element.removeChild(audio_element);
    audio_element = undefined;
    browser_action.setBadgeText({text: ''});
  }

  function change_volume() {
    volume_ctl_timer = undefined;
    if (audio_element === undefined) {
      if (target_volume === 0) {
        return;
      }
      // init
      audio_element = window.document.createElement('audio');
      body_element.appendChild(audio_element);
      audio_element.oncanplaythrough = function () {
        audio_element.volume = 0;
        audio_element.play();
        browser_action.setBadgeText({text: '\u25ba'});
        change_volume();
      };
      audio_element.src = stream_url;
      audio_element.load();
      volume_ctl_timer = true;
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
          drop_audio_element();
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

  function run_change_volume() {
    if (volume_ctl_timer === undefined) {
      change_volume();
    }
  }

  function init() {
    browser_action.setBadgeBackgroundColor({color: '#942'});
    storage.get_all(function (vol, stream, state, mode) {
      console.log('state=', state);
      stream_url = streams.map[stream].url;
      default_volume = vol;
      window.update_volume(vol, state);
      window.update_control_mode(mode);
    });
  }

  // bindings

  browser_action.onClicked.addListener(storage.toggle_playing_state); // fired only if popup not set
  chrome.runtime.onStartup.addListener(init); // not fired on installed
  chrome.runtime.onInstalled.addListener(init);

  // publick

  window.play_pause = function (state) {
    target_volume = state ? default_volume : 0;
    run_change_volume();
  };

  window.update_volume = function (volume, force) {
    default_volume = volume / 100;
    if (audio_element || force) {
      target_volume = default_volume;
      run_change_volume();
    }
  };

  window.reset_media_source = function (stream) {
    console.log('stream:', stream);
    stream_url = streams.map[stream].url;
    if (audio_element) {
      drop_audio_element();
      run_change_volume();
    }
  };

  window.update_control_mode = function (mode) {
    console.log('BG', mode);
    browser_action.setPopup({
      popup: mode === 'popup' ? 'popup.html' : ''
    });
  };

}());
