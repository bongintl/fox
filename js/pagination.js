var $ = require('jquery');
var fadeIn = require('./fade-in');

var paginate = $more => {
    var loading = false;
    var $container = $more.parents('.pagination');
    $more.on('click', e => {
        e.preventDefault();
        if ( loading ) return;
        $more.addClass( 'pagination__more--loading' );
        fetch( $more.attr( 'href' ) )
            .then( r => r.text() )
            .then( html => {
                var $elements = $( html ).find( '.pagination > *' );
                $more.parent().append( $elements );
                $more.remove();
                $container.trigger( 'pagination', { $elements });
                paginate( $elements.filter('.pagination__more') );
                $elements.filter('.fade-in').toArray().map( $ ).forEach( fadeIn );
            })
    })
}

paginate( $('.pagination__more') );