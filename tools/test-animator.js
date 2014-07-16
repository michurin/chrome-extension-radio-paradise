function seq(a, b) {
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
}

function height_animator_generator(wrapper, container) {
  var animator = animator_generator(function (v) {
    container.style.height = Math.round(v) + 'px';
  }, function () {
    container.style.overflow = 'visible';
    container.style.height = 'auto';
  });
  return function (content) {
    var ih = container.clientHeight;
    container.style.overflow = 'visible';
    container.style.height = 'auto';
    wrapper.style.overflow = 'hidden';
    wrapper.style.height = wrapper.clientHeight + 'px';
    container.innerText = '';
    container.appendChild(content);
    var fh = container.clientHeight;
    container.style.overflow = 'hidden';
    container.style.height = ih + 'px';
    wrapper.style.overflowY = 'visible';
    wrapper.style.height = 'auto';
    animator(seq(ih, fh)); // start animation
  };
}

function update(wrapper, container, content, animator) {
  console.log(arguments);
  var ih = container.clientHeight;
  container.style.overflow = 'visible';
  container.style.height = 'auto';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = wrapper.clientHeight + 'px';
  container.innerText = '';
  container.appendChild(content);
  var fh = container.clientHeight;
  container.style.overflow = 'hidden';
  container.style.height = ih + 'px';
  wrapper.style.overflowY = 'visible';
  wrapper.style.height = 'auto';
  animator(seq(ih, fh)); // start animation
}

(function () {

  var height_animator = height_animator_generator(
    document.getElementById('wrapper'),
    document.getElementById('container'));

  for (i = 1; i < 4; ++i) {
    e = document.createElement('div');
    e.style.width = i + '00px';
    e.style.height = i + '00px';
    e.style.background = '#5ff';
    e.style.border = '5px solid #888';
    document.getElementById('x' + i).onclick = (function (content) {
      return function () {
        height_animator(content);
      };
    }(e));
  }

/*
  // --- old way

  var wrapper = document.getElementById('wrapper');
  var container = document.getElementById('container');
  var animator = animator_generator(function (v) {
    container.style.height = Math.round(v) + 'px';
  }, function () {
    container.style.overflow = 'visible';
    container.style.height = 'auto';
  });
  var e;

  for (i = 1; i < 4; ++i) {
    e = document.createElement('div');
    e.style.width = i + '00px';
    e.style.height = i + '00px';
    e.style.background = '#fff';
    e.style.border = '5px solid #888';
    document.getElementById('x' + i).onclick = (function (content) {
      return function () {
        update(wrapper, container, content, animator);
      };
    }(e));
  }
*/

}());
