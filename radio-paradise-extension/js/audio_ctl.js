/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

var audio_controller = (function () {

  var stream_url;
  var normal_volume;
  var state;
  var body_element = window.document.body;

  var on_start_loading;
  var on_start_playing;
  var on_stop_playing;

  var target_volume;
  var volume_ctl_timer;
  var audio_element;

  function drop_audio_element() {
    body_element.removeChild(audio_element);
    audio_element = undefined;
    on_stop_playing();
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
        on_start_playing();
        change_volume();
      };
      audio_element.onerror = function () {
        if (volume_ctl_timer !== undefined) {
          clearTimeout(volume_ctl_timer);
          volume_ctl_timer = undefined;
        }
        drop_audio_element();
      };
      audio_element.src = stream_url;
      audio_element.load();
      volume_ctl_timer = 1;
      on_start_loading();
    } else {
      // continue
      var v = audio_element.volume;
      var sv = target_volume - v;
      var dv = sv <= 0 ? -0.01 : 0.01;
      var nv = v + dv;
      if (sv * (target_volume - nv) <= 0) {
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
    target_volume = state ? normal_volume : 0;
    if (volume_ctl_timer === undefined) {
      change_volume();
    }
  }

  return {
    set_callbacks: function (start_loading, start_playing, stop_playing) {
      on_start_loading = start_loading;
      on_start_playing = start_playing;
      on_stop_playing = stop_playing;
    },
    set_volume: function (volume) {
      normal_volume = volume;
      run_change_volume();
    },
    set_state: function (st) {
      state = st;
      run_change_volume();
    },
    set_stream: function (url) {
      if (audio_element !== undefined) {
        drop_audio_element();
      }
      stream_url = url;
      run_change_volume();
    }
  };

}());
