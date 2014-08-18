/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global storage, $ */

'use strict';

chrome.alarms.onAlarm.addListener(function (alarm) {
  var name = alarm.name;
  var act, t;
  if (name.substr(0, 6) === 'alarm_') {
    t = new Date(new Date().getTime() - 30 * 1000).getTime(); // -30s
    if (alarm.scheduledTime > t) {
      act = name.substr(12);
      storage.update_field('last_alarm');
      storage.set({last_alarm_name: name});
      if (act === 'on') {
        storage.set({playing: true});
      }
      if (act === 'off') {
        storage.set({playing: false});
      }
      if (act === 'bell') {
        // TODO:
        // bell only if sound is on?
        // fix bell volume?
        (function () {
          var audio = $.create('audio');
          $.body.appendChild(audio);
          audio.oncanplaythrough = function () {
            audio.volume = 0.8; // Hm...
            audio.play();
          };
          audio.onended = function () {
            $.body.removeChild(audio);
          };
          audio.src = 'media/temple_bell.mp3';
          audio.load();
        }());
      }
    }
    // we left all alarms from the past;
    // they can be raised on the first moment Chrome started;
    // note: there are alarms-at-chrome-startup bugs 236684, 305925 etc.
    // has been fixed in Chrome 31 only.
  }
});
