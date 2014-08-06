/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global storage, update_field */

'use strict';

chrome.alarms.onAlarm.addListener(function (alarm) {
  var name = alarm.name;
  var act, t;
  if (name.substr(0, 6) === 'alarm_') {
    t = new Date(new Date().getTime() - 30 * 1000).getTime(); // -30s
    if (alarm.scheduledTime > t) {
      act = name.substr(12);
      update_field('last_alarm');
      storage.set({last_alarm_name: name});
      storage.set({playing: act === 'on'});
    }
    // we left all alarms from the past;
    // they can be raised on the first moment Chrome started;
    // note: there are alarms-at-chrome-startup bugs 236684, 305925 etc.
    // has been fixed in Chrome 31 only.
  }
});
