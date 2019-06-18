var $ = require('jquery');

$('.order').each( ( i, el ) => {
    var $el = $( el );
    var $submit = $el.find('input[type="submit"]');
    $el.find('input').on('change', () => {
        var size = new FormData( $el[ 0 ] ).get('size')
        $submit.attr( 'disabled', !size );
        if ( size ) $submit[ 0 ].dataset.addToBag = size;
    })
    $el.submit(() => false);
})