var $ = require('jquery');
require('./vendor/slick');
var breakpoints = require('./breakpoints');

var sliders = [ ...document.querySelectorAll('.product-images') ].map( el => ({
    slides: $( '.product-images__slides', el ),
    index: $( '.product-images__index', el )
}));

var on = () => sliders.forEach( ({ slides, index }) => {
    slides.slick({ arrows: false });
    slides.on('click.slider', e => {
        if ( e.offsetX < slides.width() / 2 ) {
            slides.slick('slickPrev');
        } else {
            slides.slick('slickNext');
        }
    })
    if ( index ) slides.on('afterChange', ( e, slick, i ) => index.text( i + 1 ) )
})

var off = () => {
    sliders.forEach( ({ slides }) => {
        slides.slick('unslick').off('afterChange').off('click.slider')
    });
}

breakpoints({
    small: { on, off },
    medium: { on, off }
})