var h = require('hyperscript');
var $ = require('jquery');
var throttle = require('lodash/throttle');
var breakpoints = require('./breakpoints');

var bisect = arr => {
    var halfway = Math.ceil( arr.length / 2 );
    return [ arr.slice( 0, halfway ), arr.slice( halfway ) ];
}

var findIndexRight = ( arr, fn ) => {
    for ( var i = arr.length - 1; i >= 0; i-- ) {
        if ( fn( arr[ i ], i, arr ) ) return i;
    }
}

var buildItem = className => ( heading, i ) => {
    var href = window.location.href + '#' + i;
    return h( 'a.contents__item', { href, className }, 
        h('span', heading.innerHTML.replace( /^\d+.?\s/g, '' ) )
    );
}

var buildContents = headings => {
    var items = headings.map( buildItem( 'contents__item' ) );
    return h('.contents',
        h( 'h3.list__heading', 'Contents' ),
        h( '.contents__columns', bisect( items ).map( column => {
            return h( '.contents__column', column )
        }))
    )
}

var buildIndex = headings => {
    var items = headings.map( buildItem( 'docs-index__item' ) );
    var index = h('.docs-index', items );
    window.addEventListener('scroll', throttle(() => {
        var curr = findIndexRight( headings, el => el.getBoundingClientRect().top < 100 );
        items.forEach( ( el, i ) => el.classList.toggle( 'docs-index__item--active', i === curr ) );
        index.classList.toggle( 'docs-index--visible', (
            window.pageYOffset < document.documentElement.scrollHeight - window.innerHeight - 200 &&
            headings[ 0 ].getBoundingClientRect().top < 100
        ))
    }, 200, { leading: true, trailing: true }))
    return index;
}

$('.docs__contents').each( ( i, el ) => {
    
    var headings = $( el ).parents( '.docs' ).find( '.list__heading' ).toArray();
    headings.forEach( ( h, i ) => h.id = i );
    var $bodies = headings.map( el => $( el.nextElementSibling ) );
    
    headings.forEach( ( heading, idx ) => {
        var toggle = () => $bodies.forEach( ( $el, i ) => {
            i === idx ? $el.slideToggle() : $el.slideUp();
        })
        var on = () => {
            heading.addEventListener( 'click', toggle );
            $bodies[ idx ].slideUp( 0 );
        }
        var off = () => {
            heading.removeEventListener( 'click', toggle );
            $bodies[ idx ].slideDown( 0 );
        }
        breakpoints( { small: { on, off } } );
    })
    
    el.appendChild( buildContents( headings ) );
    
    document.body.appendChild( buildIndex( headings ) );
    
})


var headings = [ ...document.querySelectorAll('.list__heading') ];



// document.querySelectorAll('.docs__list--numbered').forEach( el => {
    
//     var headings = [ ...el.querySelectorAll('h3') ];
    
    
// })