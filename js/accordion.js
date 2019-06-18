var $ = require('jquery');

// $.fn.accordion = function ( $trigger, options = {} ) {
//     var d0 = Object.assign( {}, options, { duration: 0 } );
//     this.slideUp( d0 );
//     var isDown = false;
//     this.trigger('accordion', { isDown } );
//     $trigger.on( 'click.accordion', () => {
//         this.slideToggle( options );
//         isDown = !isDown;
//         this.trigger('accordion', { isDown } );
        
//     })
//     this.one( 'accordion:stop', () => {
//         $trigger.off( '.accordion' );
//         this.slideDown( d0 );
//         if ( !isDown ) {
//             isDown = true;
//             this.trigger('accordion', { isDown });
//         }
//     })
//     return this;
// }

$('.accordion').each( ( i, el ) => {
    var $el = $( el );
    var $title = $( '.accordion__title', el );
    var $body = $( '.accordion__body', el );
    var panels = $el.parents('.panels');
    var update = () => panels.trigger('sticky_kit:recalc');
    $body.slideUp({ duration: 0, complete: update });
    $title.click( () => {
        $body.slideToggle({ complete: update, progress: update })
        $el.toggleClass('accordion--open');
    });
});