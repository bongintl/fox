var $ = require('jquery');
require('smoothscroll-polyfill').polyfill()

var isCurrentURL = require('./utils/isCurrentURL');

var nav = document.querySelector('.nav__section--logo');

var getTop = element => element.getBoundingClientRect().top + window.pageYOffset;
var navHeight = () => nav.getBoundingClientRect().height;

var hash = url => url.split( '#' )[ 1 ];

document.querySelectorAll('a').forEach( a => {
    if (
        !a.href ||
        a.href === '#' || 
        a.target !== '' ||
        a.href.startsWith('mailto:') ||
        a.href.startsWith('tel:') ||
        a.classList.contains( 'ajax' ) ||
        a.host !== window.location.host
    ) {
        return;
    } else if ( a.href.includes('#') && isCurrentURL( a.href ) ) {
        a.addEventListener( 'click', e => {
            e.preventDefault();
            var el = document.getElementById( hash( a.href ) );
            var top = getTop( el );
            if ( top < window.pageYOffset ) top -= navHeight();
            window.scrollTo({ top, behavior: 'smooth' });
        })
    } else {
        a.addEventListener( 'click', e => {
            if ( e.metaKey ) return;
            e.preventDefault();
            document.body.classList.add( 'fade-out' );
            setTimeout( () => {
                window.location.href = a.href;
            }, 500 )
        })
    }
})

if ( window.location.hash ) {
    var el = document.querySelector( window.location.hash );
    if ( el ) {
        // $( window ).on( 'fontsLoaded', () => {
            window.scrollTo( 0, getTop( el ) - navHeight() )
        // })
    }
}

window.onpageshow = () => document.body.classList.remove('fade-out');
