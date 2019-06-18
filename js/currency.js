/* global Currency */
var localStorage = require('./utils/storage');
var $ = require('jquery');
var { format } = require('currency-formatter');

var $window = $( window );

var currency = {
    curr: null,
    convert: ( x, to = currency.curr ) => Currency.convert( Number( x ), 'GBP', to ),
    format: ( x, code = currency.curr ) => {
        var str = format( currency.convert( x, code ), { code } );
        if ( code === 'EUR' ) {
            str = '€' + str.replace('€', '').replace(/\s/, '');
        }
        return str;
    },
    set: code => {
        currency.curr = code;
        localStorage.setItem( 'currency', code );
        $window.trigger( 'currency-change', code );
    }
}

$('[data-display-currency]').each( ( i, el ) => {
    var $el = $( el );
    var gbp = $el.data( 'displayCurrency' );
    $window.on( 'currency-change', () => $el.text( currency.format( gbp ) ) );
})

$('[data-display-currency-code]').each( ( i, el ) => {
    var $el = $( el );
    $window.on( 'currency-change', ( e, currency ) => $el.text( currency ) );
})

$('[data-set-currency]').click( e => {
    currency.set( $( e.target ).data( 'setCurrency' ) );
})

currency.set( localStorage.getItem( 'currency' ) || 'GBP' );

module.exports = currency;