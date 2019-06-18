var nav = document.querySelector( 'nav' );
var footer = document.querySelector( 'footer' );

[ ...document.querySelectorAll('.press') ].forEach( press => {
    var list = press.querySelector('.press__list');
    var onResize = () => list.style.minHeight = ( window.innerHeight - nav.offsetHeight ) + 'px';
    // window.addEventListener( 'resize', onResize );
    // onResize();
    if ( !( 'ontouchstart' in window ) ) {
        var thumbnail = press.querySelector('.press__thumbnail');
        press.addEventListener( 'mousemove', e => {
            thumbnail.style.transform = `translate(${ e.clientX }px, ${ e.clientY }px) translate(-50%, -50%)`;
        })
        press.querySelectorAll('.press__item').forEach( item => {
            var src = item.dataset.thumbnail;
            new Image().src =  src;
            item.addEventListener('mouseenter', () => {
                thumbnail.style.display = 'block';
                thumbnail.src = src;
            })
            item.addEventListener('mouseleave', () => {
                thumbnail.style.display = 'none';
            })
        })
    }
})