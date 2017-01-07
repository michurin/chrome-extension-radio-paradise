/*
 * Radio Paradise player
 * Copyright (c) 2014-2017 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global $ */
/*exported audio_controller */

'use strict';

var audio_controller = (function () {

  var stream_url;
  var normal_volume;
  var state;

  var on_start_loading;
  var on_start_playing;
  var on_stop_playing;
  var on_timeout_loading;

  var target_volume;
  var volume_ctl_timer;
  var audio_element;

  function drop_audio_element() {
    // force abort of buffering
    audio_element.oncanplaythrough = function () {};
    audio_element.pause();
    audio_element.src = '';
    $.body.removeChild(audio_element);
    audio_element = undefined;
    // /force
    on_stop_playing();
  }

  function change_volume() {
    volume_ctl_timer = undefined;
    if (audio_element === undefined) {
      if (target_volume === 0) {
        return;
      }
      // init
      audio_element = $.create('audio');
      $.body.appendChild(audio_element);
      audio_element.oncanplaythrough = function () {
        audio_element.volume = 0;
        audio_element.play();
        on_start_playing();
        change_volume();
      };
      audio_element.onstalled = function () {
        on_timeout_loading('[stalled]' + audio_element.src);
        drop_audio_element();
      };
      window.setTimeout(function () { // watchdog
        if (audio_element && audio_element.readyState !== 4) {
          if (volume_ctl_timer) {
            window.clearTimeout(volume_ctl_timer);
            volume_ctl_timer = undefined;
          }
          on_timeout_loading(audio_element.src);
          drop_audio_element();
        }
      }, 7000);
      audio_element.src = stream_url;
      audio_element.load();
      on_start_loading();
    } else {
      // continue
      var v = audio_element.volume;
      var sv = target_volume - v;
      var dv = sv <= 0 ? -0.02 : 0.01;
      var nv = v + dv;
      if (sv * (nv - target_volume) >= 0) {
        // fin
        if (target_volume <= 0) {
          drop_audio_element();
          return;
        }
        nv = target_volume;
      } else {
        // continue
        volume_ctl_timer = window.setTimeout(change_volume, 25);
      }
      audio_element.volume = nv;
    }
  }

  function run_change_volume() {
    target_volume = state ? normal_volume : 0;
    if (volume_ctl_timer === undefined) {
      change_volume();
    }
  }

  function run_if_complete(f) {
    if (
      normal_volume !== undefined &&
      state !== undefined &&
      stream_url !== undefined
    ) {
      f();
    }
  }

  return {
    // this method *MUST* be called first
    set_callbacks: function (start_loading, start_playing, stop_playing, timeout_loading) {
      on_start_loading = start_loading;
      on_start_playing = start_playing;
      on_stop_playing = stop_playing;
      on_timeout_loading = timeout_loading;
    },
    // these methods can be called in any order
    set_volume: function (volume) {
      normal_volume = volume;
      run_if_complete(run_change_volume);
    },
    set_state: function (st) {
      state = st;
      run_if_complete(run_change_volume);
    },
    set_stream: function (url) {
      stream_url = url;
      run_if_complete(function () {
        if (audio_element !== undefined) {
          drop_audio_element();
        }
        run_change_volume();
      });
    }
  };

}());
