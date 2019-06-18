var $ = require('jquery');

var $nav = $('.nav');
var height = $('.nav__section--logo')[ 0 ].getBoundingClientRect().height;

var batch = fn => {
    var frame;
    return () => {
        window.cancelAnimationFrame( frame );
        frame = window.requestAnimationFrame( fn );
    }
}

var prevScroll = window.pageYOffset;
var scrollDir = 0;
var hovered = false;

var update = batch( () => {
    $nav.toggleClass( 'nav--hidden', window.pageYOffset >= height && scrollDir === 1 && !hovered );
    // $nav.toggleClass( 'nav--floating', window.pageYOffset > 0 );
});

window.addEventListener( 'scroll', () => {
    scrollDir = window.pageYOffset > prevScroll ? 1 : -1;
    prevScroll = window.pageYOffset;
    update();
})

$('.nav, .nav-trigger').hover(
    () => { hovered = true; update() },
    () => { hovered = false; update() }
)

// var $ = require('jquery');

// var $nav = $('.nav');
// var $logo = $('.nav__section--logo');

// var height = $logo[ 0 ].getBoundingClientRect().height + 1;
// var offset = 0;

// var prevScroll = window.pageYOffset;
// var frameRequested = false;
// var timer;
// var update = () => {
//     var d = window.pageYOffset - prevScroll;
//     offset = Math.min( Math.max( -height, offset - d ), 0 );
//     prevScroll = window.pageYOffset;
//     $nav.css( 'pointerEvents', 'none' );
//     clearTimeout( timer );
//     timer = setTimeout( () => $nav.css( 'pointerEvents', '' ), 100 );
//     if ( !frameRequested ) {
//         window.requestAnimationFrame(() => {
//             $nav.css('transform', `translateY(${ offset }px)`);
//             $nav.toggleClass( 'nav--floating', window.pageYOffset > 0 );
//             frameRequested = false;
//         })
//         frameRequested = true;
//     }
// }

// $('.nav-trigger').hover(
//     () => $nav.css('transform', '' ),
//     () => $nav.css('transform', `translateY(${ offset }px)`)
// )

// $( window )
//     .on( 'resize', () => height = $logo[ 0 ].getBoundingClientRect().height )
//     .on( 'scroll', update )

// update();