var $ = require('jquery');
require('./vendor/visible');

var throttle = require('lodash/throttle');
var events = 'scroll.fadein resize.fadein sticky_kit:recalc';

var fadeIn = $element => {
    var update = throttle( () => {
        if ( $element.visible( true ) ) {
            $element.addClass('fade-in--done');
            $( window ).off( events, update );
        }
    }, 200, { leading: true, trailing: true } )
    $( window ).on( events, update );
    update();
}

$('.fade-in').toArray().map( $ ).forEach( fadeIn );

module.exports = fadeIn;