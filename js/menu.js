var $ = require('jquery');
var sidebars = require('./sidebars');

var isCurrentURL = require('./utils/isCurrentURL');

var open = null;

$('.menu').each( ( i, menu ) => {
    var $menu = $( menu );
    $menu.find( '.menu__item' ).each( ( i, item ) => {
        var $item = $( item );
        if ( $item.hasClass( 'menu-accordion' ) ) {
            var $title = $item.find( '.menu-accordion__title' );
            var $items = $item.find( '.menu-accordion__items' );
            var isOpen = false;
            $items.slideUp( 0 );
            $title.on( 'click', () => $menu.trigger( 'accordion', isOpen ? null : $item ) );
            $menu.on( 'accordion', ( e, element ) => {
                if ( $item.is( element ) && !isOpen ) {
                    $items.slideDown()
                    isOpen = true;
                } else {
                    $items.slideUp();
                    isOpen = false;
                }
            })
        } else {
            var href = $item.attr( 'href' );
            $item.on('click', e => {
                if ( $item.hasClass( 'menu__item--disabled' ) ) {
                    e.preventDefault();
                    $menu.trigger( 'accordion', null );
                }
            })
        }
        $menu.on( 'accordion', ( e, element ) => {
            if ( !element || $item.is( element ) ) {
                $item.removeClass( 'menu__item--disabled' );
            } else {
                $item.addClass( 'menu__item--disabled' );
            }
            // console.log( element );
            // $item.toggleClass( 'menu__item--disabled', element || !$item.is( element ) );
        })
    });
    $menu.find('a[href]').each( ( i, a ) => {
        var $a = $( a );
        var href = $a.attr( 'href' );
        if ( href.includes( '#' ) && isCurrentURL( href ) ) {
            $a.on( 'click', sidebars.closeLeft );
        }
    })
})