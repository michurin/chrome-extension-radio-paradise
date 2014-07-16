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

function animator_generator(cb_step, cb_fin) {
  var current_strategy = [];
  function step() {
    var v = current_strategy.shift();
    cb_step(v);
    if (current_strategy.length === 0) {
      cb_fin();
    } else {
      window.setTimeout(step, 33);
    }
  }
  return function (strategy) {
    var l = current_strategy.length;
    current_strategy = strategy;
    if (l === 0) {
      step();
    }
  };
}

function height_animator_generator(wrapper, container) {
  var animator = animator_generator(function (v) {
    container.style.height = Math.round(v) + 'px';
  }, function () {
    container.style.overflow = 'visible';
    container.style.height = 'auto';
  });
  function set_content(content) {
    var i;
    container.innerText = '';
    for (i = 0; i < content.length; ++i) {
      container.appendChild(content[i]);
    }
  }
  return function (content, no_animation) {
    if (no_animation) {
      set_content(content);
      return;
    }
    var ih = container.clientHeight;
    container.style.overflow = 'visible';
    container.style.height = 'auto';
    wrapper.style.overflow = 'hidden';
    wrapper.style.height = wrapper.clientHeight + 'px';
    set_content(content);
    var fh = container.clientHeight;
    container.style.overflow = 'hidden';
    container.style.height = ih + 'px';
    wrapper.style.overflowY = 'visible';
    wrapper.style.height = 'auto';
    animator((function (a, b) {
      var f, x, y, m, i, s = [], J = 20;
      m = b - a;
      if (m === 0) {
        return s;
      }
      for (i = 0; i <= J; ++i) {
        // like f = Math.sin(i/J * Math.PI/2) but better
        x = i / J - 2;
        y = x * x;
        y = y * x;
        y = y * y;
        f = (64 - y) / 63; // 0..1
        s.push(a + m * f);
      }
      return s;
    }(ih, fh))); // start animation
  };
}
