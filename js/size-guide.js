var $ = require('jquery');

var sizeGuide = $('.size-guide');
$('[data-toggle-size-guide]').on('click', () => sizeGuide.toggleClass('size-guide--open'));