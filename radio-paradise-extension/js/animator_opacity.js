/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global animator_generator */
/*exported opacity_animator_generator */

'use strict';

var opacity_animator_generator = (function () {
  function getElementById(id) {
    return window.document.getElementById(id);
  }
  var seq_forward = [];
  var seq_backward = [];
  (function (i) {
    for (i = 0; i < 1; i += 0.2) {
      seq_forward.push(i);
      seq_backward.push(1 - i);
    }
  }());
  var dialogs = getElementById('dialogs');
  var dialogs_sentinel = getElementById('dialogs-sentinel');
  function animation_step(v) {
    dialogs.style.opacity = v;
  }
  return function (name) {
    var e = getElementById(name);
    var a = animator_generator(animation_step, function () { // fin
      dialogs.style.opacity = 1;
      dialogs_sentinel.style.display = 'none';
    });
    var b = animator_generator(animation_step, function () { // fin
      dialogs.style.display = 'none';
      e.style.display = 'none';
    });
    return {
      open: function () {
        a(seq_forward.slice(0));
        dialogs.style.display = 'block';
        dialogs_sentinel.style.display = 'block';
        e.style.display = 'block';
      },
      close: function () {
        b(seq_backward.slice(0));
        dialogs_sentinel.style.display = 'block';
      }
    };
  };
}());
