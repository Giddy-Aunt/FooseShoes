'use strict';

(function() {
  var menu = document.querySelector('.main-nav');
  menu.classList.remove('main-nav--no-js');
  var navToggle = document.querySelector('.main-nav__toggle');

  navToggle.addEventListener('click', function(){
    if (menu.classList.contains('main-nav--closed')) {
      menu.classList.remove('main-nav--closed');
      menu.classList.add('main-nav--opened');
    } else {
      menu.classList.add('main-nav--closed');
      menu.classList.remove('main-nav--opened');
    }
  });

})();
