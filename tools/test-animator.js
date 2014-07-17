(function () {

  var height_animator = height_animator_generator(
    document.getElementById('wrapper'),
    document.getElementById('container'));

  for (i = 1; i < 4; ++i) {
    e = document.createElement('div');
    e.style.width = i + '00px';
    e.style.height = i + '00px';
    e.style.background = '#aaa';
    e.style.border = '5px solid #888';
    document.getElementById('x' + i).onclick = (function (content) {
      return function () {
        height_animator([content]);
      };
    }(e));
  }

}());
