/*global window */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true,
  nomen:    true
*/

'use strict';

/* switch */

(function () {

  var sound_switch = window.document.getElementById('sound-switch');
  var _ONOFF = false; // in storage

  function update_sound_switch(state) {
    // className do not works with <svg>, so use classList
    sound_switch.classList.add(state ? 'container-on' : 'container-off');
    sound_switch.classList.remove(state ? 'container-off' : 'container-on');
    console.log(state);
  }

  sound_switch.onclick = function () {
    _ONOFF = !_ONOFF; // change storage
    update_sound_switch(_ONOFF); // calls by on-storage-change event; not here
  };

  update_sound_switch(_ONOFF);

}());

/* volume */

(function () {

  var x = window.document.getElementById('volume-control');
  var xo = x.offsetLeft;
  var is_down = false;
  x.onmousedown = function (e) {
    is_down = true;
    window.document.body.onmousemove(e);
  };
  window.document.body.onmouseup = window.document.body.onmouseleave = function () {
    is_down = false;
  };
  window.document.body.onmousemove = function (e) {
    if (!is_down) {
      return;
    }
    console.log(e.clientX - xo, e.which);
    var nx = e.clientX - xo - 6;
    nx = (nx < 0 ? 0 : nx > 138 ? 138 : nx) / 138;
    // setup volume
    console.log(e.clientX - xo, e.which, nx);
    // in callback
    x.getElementsByTagName('circle')[0].setAttribute('cx', nx * 1380 + 60);
  };

}());

/* streams */

(function () {

  var _ACTIVE = 1;
  var x = window.document.getElementById('stream-point');
  var root = window.document.getElementById('stream-selectors');

  function update_selectors(state) {
    var id = 'st' + state;
    Array.prototype.slice.call(
      root.getElementsByTagName('svg')
    ).forEach(function (e) {
      var q = (e.id === id);
      e.classList.add(q ? 'container-on' : 'container-off');
      e.classList.remove(q ? 'container-off' : 'container-on');
    });
  }

  function onclick_generator(id) { // Don't make functions within a loop :-)
    return function () {
      _ACTIVE = id;
      update_selectors(id); // from callback
      console.log(id);
    };
  }

  var c, i, id;
  for (i = 0; i < 10; ++i) {
    id = 'st' + i;
    c = x.cloneNode(true);
    c.id = id;
    c.onclick = onclick_generator(i);
    root.appendChild(c);
    root.appendChild(window.document.createTextNode(' '));
  }
  update_selectors(_ACTIVE);

}());
