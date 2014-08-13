/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global streams, storage, audio_controller, on_storage_change, toggle_playing_state, update_field */

'use strict';

(function () {

  var browser_action = chrome.browserAction;

  function update_popup_mode(mode) {
    // mode === undefined is true
    browser_action.setPopup({
      popup: (mode === undefined || mode) ? 'popup.html' : ''
    });
  }

  function update_badge_color(color) {
    browser_action.setBadgeBackgroundColor({color: color || '#942'});
  }

  function badge_updater(text) {
    return function () {
      browser_action.setBadgeText({text: text});
    };
  }

  var url_resolver = {
    custom_streams: {},
    set_customs: function (c) {
      url_resolver.custom_streams = {};
      if (c) {
        c.forEach(function (v) {
          url_resolver.custom_streams[v[0]] = v[1];
        });
      }
    },
    resolv: function (iid) {
      var x = streams.map[iid];
      if (x) {
        return x.url;
      }
      x = url_resolver.custom_streams[iid];
      if (x) {
        return x.url;
      }
      return streams.map[streams.def.stream].url;
    }
  };

  // setup audio element; *MUST* be before bindings

  audio_controller.set_callbacks(
    badge_updater('…'),
    badge_updater('►'),
    badge_updater(''),
    function (failed_url) {
      update_field('last_stream_timeout');
      storage.set({last_stream_timeout_url: failed_url});
      storage.set({playing: false});
    },
    streams.map[streams.def.stream].url
  );

  // bind state processing

  on_storage_change(function (ch) {
    if (ch.volume) {
      audio_controller.set_volume(ch.volume.newValue);
    }
    if (ch.playing) {
      audio_controller.set_state(ch.playing.newValue);
    }
    if (ch.stream_id) {
      audio_controller.set_stream(url_resolver.resolv(ch.stream_id.newValue));
    }
    if (ch.popup) {
      update_popup_mode(ch.popup.newValue);
    }
    if (ch.badge_background_color) {
      update_badge_color(ch.badge_background_color.newValue);
    }
  });

  // bind state changers

  browser_action.onClicked.addListener(toggle_playing_state);

  // init state

  storage.get(['volume', 'playing', 'stream_id', 'custom_streams'], function (x) {
    update_field('last_init_audio');
    storage.set({last_init_audio_args: x});
    url_resolver.set_customs(x.custom_streams);
    audio_controller.set_stream(url_resolver.resolv(x.stream_id));
    audio_controller.set_volume(x.volume);
    audio_controller.set_state(x.playing);
  });

  function init() {
    // part of initialisation, that have not to do
    // every time page loaded
    storage.get(['popup', 'badge_background_color'], function (x) {
      storage.set({last_init_args: x});
      update_popup_mode(x.popup);
      update_badge_color(x.badge_background_color);
    });
  }

  chrome.runtime.onStartup.addListener(function () {
    // not fired on installed
    update_field('last_startup');
    init();
  });
  chrome.runtime.onInstalled.addListener(function () {
    update_field('last_install');
    init();
  });
  chrome.runtime.onUpdateAvailable.addListener(function () {
    // reload if update available, but isn't installed immediately
    // because the background page is currently running
    chrome.runtime.reload();
  });

}());
