(function () {
  var image = window.document.getElementById('i1');
  var backstage = window.document.getElementById('c1');
  var icon = window.document.getElementById('c2').getContext('2d');
  var ctx = backstage.getContext('2d');
  ctx.drawImage(image, 0, 0);
  var background_data = ctx.getImageData(0, 0, 19, 19);
  var timer_id = null;
  var animation_state = 1;

  function rect(i) {
    ctx.rect(i * 3 + 1, 17, 2, 2);
  }

  function rgba(v) {
    console.log('a=', v);
    ctx.fillStyle = 'rgba(95, 42, 21, ' + v.toFixed(3) + ')'; // #5f2a15
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + v.toFixed(3) + ')';
  }

  function update_icon() {
    icon.clearRect(0, 0, 19, 19);
    icon.drawImage(backstage, 0, 0);
  }

  function loading() {
    animation_state += .1;
    if (animation_state > 7) {
      animation_state = 0;
    }
    ctx.putImageData(background_data, 0, 0);
    var i;
    if (animation_state < 1) {
      ctx.beginPath();
      rgba(1 - animation_state);
      for (i = 0; i < 6; ++i) {
        rect(i);
      }
      ctx.fill();
    } else {
      var n = Math.floor(animation_state);
      var o = animation_state - n;
      --n;
      ctx.beginPath();
      rgba(1);
      for (i = 0; i < n; ++i) {
        rect(i);
      }
      ctx.fill();
      ctx.beginPath();
      rgba(o);
      rect(n);
      ctx.fill();
    }
    update_icon();
    timer_id = setTimeout(loading, 20);
  }

  function playing() {
    var continue_flag = true;
    animation_state += .1;
    ctx.putImageData(background_data, 0, 0);
    ctx.beginPath();
    if (animation_state > 1) {
      continue_flag = false;
      rgba(1);
    } else {
      if (animation_state < 0) {
        rgba(-animation_state);
        if (animation_state > -.4) {
          animation_state = -animation_state;
        }
      } else {
        rgba(animation_state);
      }
    }
    ctx.rect(0, 0, 6, 6);
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.moveTo(13, 12);
    ctx.lineTo(19.5, 15.5);
    ctx.lineTo(13, 19);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    update_icon();
    if (continue_flag) {
      timer_id = setTimeout(playing, 50);
    } else {
      animation_state = -1;
      timer_id = setTimeout(playing, 5000);
    }
  }

  // stop
  window.document.getElementById('b1').onclick = function () {
    if (timer_id) {
      clearTimeout(timer_id);
      timer_id = null;
    }
    ctx.putImageData(background_data, 0, 0);
    update_icon();
  };
  // loading
  window.document.getElementById('b2').onclick = function () {
    if (timer_id) {
      clearTimeout(timer_id);
      timer_id = null;
    }
    animation_state = 1;
    loading();
  }
  // play
  window.document.getElementById('b3').onclick = function () {
    if (timer_id) {
      clearTimeout(timer_id);
      timer_id = null;
    }
    animation_state = 0;
    playing();
  }
}());
