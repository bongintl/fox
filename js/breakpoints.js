var $ = require('jquery');
var { BREAKPOINTS } = require('./config');

var $window = $( window );
var getBreakpoint = () => BREAKPOINTS.find( ({ width }) => window.innerWidth > width );
var curr = null

var update = () => {
    var breakpoint = getBreakpoint();
    if ( breakpoint.name !== curr ) {
        $window.trigger( 'breakpoint', { from: curr, to: breakpoint.name } );
        $window.data( 'breakpoint', breakpoint.name );
        curr = breakpoint.name;
    }
}

$window.on('resize', update );
update();

module.exports = fns => {
    var fire = ( breakpoint, state ) => {
        fns[ breakpoint ] && fns[ breakpoint ][ state ] && fns[ breakpoint ][ state ]();
    }
    fire( curr, 'on' );
    $window.on( 'breakpoint', ( e, { to, from } ) => {
        fire( from, 'off' );
        fire( to, 'on' );
    })
}