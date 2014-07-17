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
    var v;
    if (current_strategy.length === 0) {
      cb_fin();
    } else {
      v = current_strategy.shift();
      cb_step(v);
      window.setTimeout(step, 20);
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
    container.style.height = v.height;
    container.style.opacity = v.opacity;
  }, function () {
    container.style.overflow = 'visible';
    container.style.height = 'auto';
    container.style.opacity = 1;
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
    container.style.opacity = 0;
    wrapper.style.overflowY = 'visible';
    wrapper.style.height = 'auto';
    animator((function (a, b) {
      var f, x, y, m, i, s = [], J = 20;
      m = b - a;
      for (i = 0; i < J; ++i) {
        // like f = Math.sin(i/J * Math.PI/2) but better
        x = i / J; // 0..1
        y = 4 - x * 3; // 4..1
        y *= y; // 16..1
        f = (16 - y) / 15; // 0..1
        s.push({
          height: Math.round(a + m * f) + 'px',
          opacity: x * x
        });
      }
      return s;
    }(ih, fh))); // start animation
  };
}
