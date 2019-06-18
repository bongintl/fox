var $ = require('jquery');
require('./vendor/stickykit');
var breakpoints = require('./breakpoints');

var $panels = $('.panels__panel');
var $nav = $('.nav');
$panels.find('img').on('load', () => $panels.trigger('sticky_kit:recalc'))

var on = () => $panels.stick_in_parent()
var off = () => $panels.trigger( "sticky_kit:detach" )

breakpoints({
    // medium: { on, off },
    large: { on, off }
})

// [ ...document.querySelectorAll('.panels') ].forEach( el => {
//     var panels = [ ...el.querySelectorAll('.panels__panel') ];
//     var prev = window.pageYOffset;
//     var offsets = panels.map( () => 0 );
//     var update = () => {
//         var curr = window.pageYOffset;
//         var dir = curr > prev ? 1 : -1;
//         var containerRect = el.getBoundingClientRect();
//         // var stickyTop = containerRect.top + curr;
//         var heights = panels.map( panel => panel.getBoundingClientRect().height );
//         panels.slice( 1 ).forEach( ( panel, i ) => {
            
//             // var height = heights[ i ];
//             // if ( dir === 1 ) {
//             //     offsets[ i ] = Math.max( 0, curr + window.innerHeight - height )
//             // } else {
                
//             // }
//             // panel.style.transform = `translateY( ${ offsets[ i ] }px )`;
//         })
//         prev = curr;
//     }
//     window.addEventListener( 'scroll', update );
//     update();
// })