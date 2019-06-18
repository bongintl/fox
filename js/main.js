if ( !( 'forEach' in NodeList.prototype ) ) NodeList.prototype.forEach = Array.prototype.forEach;

var $ = require('jquery');

document.body.classList.add( 'ontouchstart' in window ? 'touch' : 'no-touch' );

$(() => {
    require('./preloader');
    require('./nav');
    require('./menu');
    require('./currency');
    require('./order');
    require('./bag');
    require('./fade-in');
    require('./sidebars');
    require('./dropdown');
    require('./product-images');
    require('./testimonials');
    require('./panels');
    require('./accordion');
    require('./press');
    require('./masonry');
    require('./pagination');
    require('./size-guide');
    require('./docs');
    require('./links');
    require('./newsletter');
    require('./currency-select');
})