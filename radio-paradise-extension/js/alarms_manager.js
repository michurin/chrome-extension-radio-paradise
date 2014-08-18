/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global opacity_animator_generator, storage, $ */

'use strict';

(function () {

  var root = $.id('alarms-root');

  function two(x) {
    if (x > 9) {
      return x;
    }
    return '0' + x;
  }

  var confirmation = opacity_animator_generator('dialog-remove-alarm');
  $.id('dialog-remove-alarm-cancel').onclick = confirmation.close;
  var confirmation_delete = $.id('dialog-remove-alarm-delete');

  function update_action() {
    // this function can be called as onmessage handler *ONLY*
    // this is done to synchronize tabs if any
    chrome.alarms.getAll(function (aa) {
      if (aa.length === 0) {
        root.innerText = '(no alarms)';
      } else {
        root.innerText = '';
        var table = $.create('table');
        var tr = $.create('tr');
        ['Alarm', 'Action', 'Next', '', ''].forEach(function (v) {
          var th = $.create('th');
          th.innerText = v;
          tr.appendChild(th);
        });
        table.appendChild(tr);
        aa.sort(function (a, b) {
          return a.scheduledTime - b.scheduledTime;
        });
        aa.forEach(function (v) {
          var name = v.name;
          if (name.substr(0, 6) === 'alarm_') {
            var tr = $.create('tr');
            var h = name.substr(6, 2);
            var m = name.substr(9, 2);
            var a = name.substr(12);
            var d = new Date(v.scheduledTime);
            var fmt_d = d.getFullYear() + '-' +
              two(d.getMonth()) + '-' +
              two(d.getDate()) + ' ' +
              two(d.getHours()) + ':' +
              two(d.getMinutes());
            [h + ':' + m, a, fmt_d].forEach(function (v) {
              var td = $.create('td');
              td.innerText = v;
              tr.appendChild(td);
            });
            var x, td;
            x = $.create('span');
            x.innerText = '⚙';
            x.className = 'control-char';
            x.title = 'edit alarm';
            x.onclick = function () {
              var x =  v.name.substr(6, 2) + v.name.substr(9, 2);
              controls.forEach(function (v, n) {
                v.set(x.charAt(n));
              });
              $.id('alarm-id').value = v.name; // edit mode
              $.id(
                'alarm-action-' + v.name.substr(12)
              ).checked = true;
              dialog.open();
            };
            td = $.create('td');
            td.appendChild(x);
            tr.appendChild(td);
            table.appendChild(tr);
            x = $.create('span');
            x.innerText = '☒';
            x.className = 'control-char';
            x.title = 'delete alarm';
            x.onclick = function () {
              confirmation_delete.onclick = function () {
                confirmation.close();
                chrome.alarms.clear(name, update);
              };
              confirmation.open();
            };
            td = $.create('td');
            td.appendChild(x);
            tr.appendChild(td);
          }
        });
        root.appendChild(table);
      }
    });
  }

  function update() {
    chrome.runtime.sendMessage({action: 'alarms_changed'});
    storage.update_field('last_alarm_change'); // for debugging only
  }

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === 'alarms_changed') {
      update_action();
    }
  });

  var controls = [3, 10, 6, 10].map(function (v, n) {
    var r = {
      up: $.id('alarms-digit-' + n + '-up'),
      down: $.id('alarms-digit-' + n + '-down'),
      digit: $.id('alarms-digit-' + n),
      set: function (v) {
        r.digit.innerText = v;
      },
      get: function () {
        return parseInt(r.digit.innerText, 10);
      },
      incr: function () {
        r.set((r.get() + 1) % v);
      },
      decr: function () {
        r.set((r.get() + v - 1) % v);
      }
    };
    r.up.onclick = r.digit.onclick = r.incr;
    r.down.onclick = r.decr;
    return r;
  });

  var dialog = opacity_animator_generator('dialog-create-new-alarm');
  $.id('dialog-create-new-alarm-cancel').onclick = dialog.close;
  $.id('dialog-create-new-alarm-save').onclick = function () {
    var h = controls[0].get() * 10 + controls[1].get();
    var m = controls[2].get() * 10 + controls[3].get();
    if (h > 24) {
      h %= 24;
      controls[0].set(Math.floor(h / 10) % 10);
      controls[1].set(h % 10);
      return;
    }
    dialog.close();

    var action = $.id('dialog-create-new-alarm').querySelector(
      'input[type=radio]:checked'
    ).id.substr(13); // remove 'alarm-action-'
    var antiaction = action === 'on' ? 'off' : action === 'off' ? 'on' : 'X';
    var base_name = 'alarm_' + controls[0].get() + controls[1].get() + '_' + controls[2].get() + controls[3].get() + '_';
    var name = base_name + action;
    var antiname = base_name + antiaction;
    var delta = (h * 60 + m) * 60 * 1000;
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var when = midnight.getTime() + delta;
    if (when < now.getTime() + 60000) {
      when += 24 * 60 * 60 * 1000;
    }
    chrome.alarms.create(name, {
      when: when,
      periodInMinutes: 24 * 60
    });
    chrome.alarms.clear(antiname, function () {
      // FIXIT: we do not really need to remove X-alarms
      var old = $.id('alarm-id').value;
      if (old !== '' && old !== name) {
        chrome.alarms.clear(old, update);
      } else {
        update();
      }
    });
  };

  $.id('alarms-add-button').onclick = function () {
    var t = new Date(new Date().getTime() + 2 * 60 * 1000); // +2m
    var x = two(t.getHours()) + '' + two(t.getMinutes()); // force string
    controls.forEach(function (v, n) {
      v.set(x.charAt(n));
    });
    $.id('alarm-action-on').checked = true;
    $.id('alarm-id').value = ''; // create mode
    dialog.open();
  };

  chrome.alarms.onAlarm.addListener(update);

  update();

}());
