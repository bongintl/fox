var localStorage = require('./utils/storage');
var $ = require('jquery');
var m = require('mithril');
var currency = require('./currency');
var sidebars = require('./sidebars');

var element = document.querySelector('.bag');
var counters = document.querySelectorAll('.bag-count');

var items = {};
var loadItems = ids => {
    if ( !ids.length ) return;
    window.fetch( `/bag-items/${ ids.join(',') }` )
        .then( r => r.json() )
        .then( is => Object.assign( items, is ) )
        .then( update )
}

var bag = JSON.parse( localStorage.getItem( 'bag' ) || '{}' );

var save = () => localStorage.setItem( 'bag', JSON.stringify( bag ) );

var add = id => {
    if ( !( id in bag ) ) bag[ id ] = 0;
    bag[ id ]++;
    loadItems([ id ]);
    save();
    update();
}

var remove = id => {
    if ( !( id in bag ) ) return;
    bag[ id ]--;
    if ( bag[ id ] === 0 ) delete bag[ id ];
    save();
    update();
}

var cartBaseUrl = element.dataset.cartBaseUrl;
var buildCartUrl = () => cartBaseUrl + Object.keys( bag ).map( key => key.split(':')[ 1 ] + ':' + bag[ key ] ).join(',')

var renderItem = ({ id, quantity, item: { title, price, size, image, product_id } }) => m('.bag-item', { key: id },
    m( 'a.bag-item__image', { href: `/product/${ product_id }` },
        m( 'img', { src: image } )
    ),
    m( '.bag-item__text',
        m('.bag-item__name', title, m.trust('<br>'), `Size ${ size }` ),
        m('.bag-item__details',
            m( 'a.bag-item__button', { onclick: () => remove( id ) }, '-' ),
            quantity,
            m( 'a.bag-item__button', { onclick: () => add( id ) }, '+' ),
            m( '.bag-item__price', currency.format( price * quantity ) )
        )
    )
)

var render = () => {
    var empty = Object.keys( bag ).length === 0;
    var loadedItems = Object.keys( bag )
        .filter( key => key in items )
        .map( key => ({
            id: key,
            item: items[ key ],
            quantity: bag[ key ]
        }));
    var loaded = loadedItems.length === Object.keys( bag ).length;
    var isWhite = loaded && loadedItems.length > 0 && loadedItems.length % 2 === 0;
    return [
        m( '.bag__header', 'My Bag' ),
        m('div',
            { class: 'bag__items bag__items--bg-' + ( isWhite ? 'white' : 'off-white' ) },
            empty
                ? ''
                : loaded
                    ? loadedItems.map( renderItem )
                    : m( '.bag__loading' )
        ),
        m('.bag__footer',
            m('.bag__total',
                empty
                    ? m( 'p', 'Your bag is empty' )
                    : [
                        m( 'p', 'Subtotal' ),
                        m( 'p', currency.format( loadedItems.reduce( ( sum, { quantity, item: { price } } ) => sum + Number( price ) * quantity, 0 ) ) ),
                    ]
                
            ),
            !empty && m( 'a.bag__checkout', { href: buildCartUrl() }, 'Check out' )
        )
    ]
}

var update = () => {
    m.render( element, render() );
    var totalItems = Object.keys( bag ).reduce( ( sum, key ) => sum + bag[ key ], 0 );
    counters.forEach( el => el.innerText = totalItems );
}

$( 'body' ).on( 'click', '[data-add-to-bag]', e => {
    e.stopPropagation();
    add( e.target.dataset.addToBag );
    sidebars.openRight();
})

$( window ).on( 'currency-change', update );
loadItems( Object.keys( bag ) );

update();