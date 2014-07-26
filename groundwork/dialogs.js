// cosmetics

(function() {
  document.getElementById('content').innerText = new Array(100).join('space ');
}());

// dialoger

var dialogs_generator = (function () {
  var seq_forward = [];
  var seq_backward = [];
  (function (i) {
    for (i = 0; i < 1; i += 0.1) {
      seq_forward.push(i);
      seq_backward.push(1 - i);
    }
  }());
  var dialogs = document.getElementById('dialogs');
  var dialogs_sentinel = document.getElementById('dialogs-sentinel');
  function animation_step(v) {
    dialogs.style.opacity = v;
  }
  return function (name) {
    var e = document.getElementById(name);
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
    }
  }
}());

// demo

(function() {
  var idea = dialogs_generator('idea_box');
  document.getElementById('call_dialog').onclick = idea.open;
  document.getElementById('idea_ok').onclick = idea.close;
  document.getElementById('idea_hmm').onclick = function () {
    console.log('hmm…');
    idea.close();
  }
  var ok = dialogs_generator('ok_box');
  document.getElementById('call_ok_dialog').onclick = ok.open;
  document.getElementById('ok_ok').onclick = ok.close;
}());
