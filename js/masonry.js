var $ = require('jquery');
var Masonry = require('masonry-layout');

document.querySelectorAll('.masonry').forEach( el => {
    var masonry = new Masonry( el, { transitionDuration: 0, columnWidth: '.masonry__sizer' });
    $( el ).on( 'pagination', ( e, { $elements } ) => {
        masonry.appended( $elements.toArray() );
        masonry.layout();
    })
})